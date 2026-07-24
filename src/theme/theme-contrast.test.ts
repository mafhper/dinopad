import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/styles/globals.css'), 'utf8')
const themeNames = ['gold', 'light', 'dark', 'purple'] as const

type ThemeName = (typeof themeNames)[number]
type ThemeTokens = Record<string, string>

function extractThemeBlock(theme: ThemeName): ThemeTokens {
  const pattern =
    theme === 'gold'
      ? /:root,\s*:root\[data-theme="gold"\]\s*\{([\s\S]*?)\n\}/
      : new RegExp(`:root\\[data-theme="${theme}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`)
  const match = css.match(pattern)

  if (!match) {
    throw new Error(`Bloco do tema ${theme} não encontrado`)
  }

  return Object.fromEntries(
    [...match[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((token) => [
      token[1],
      token[2].toLowerCase(),
    ]),
  )
}

const baseTokens = extractThemeBlock('gold')

function themeTokens(theme: ThemeName) {
  return { ...baseTokens, ...extractThemeBlock(theme) }
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

function expectContrast(
  tokens: ThemeTokens,
  foregroundToken: string,
  backgroundToken: string,
  minimum: number,
  theme: ThemeName,
) {
  const foreground = tokens[foregroundToken]
  const background = tokens[backgroundToken]

  expect(foreground, `Token --${foregroundToken} ausente no tema ${theme}`).toBeDefined()
  expect(background, `Token --${backgroundToken} ausente no tema ${theme}`).toBeDefined()
  expect(
    contrastRatio(foreground, background),
    `${theme}: --${foregroundToken} sobre --${backgroundToken}`,
  ).toBeGreaterThanOrEqual(minimum)
}

describe.each(themeNames)('contraste do tema %s', (theme) => {
  const tokens = themeTokens(theme)

  it('mantém textos semânticos legíveis nas superfícies principais', () => {
    const foregrounds = [
      'text-primary',
      'text-secondary',
      'text-tertiary',
      'accent-strong',
      'moss',
      'rust',
      'diet-carnivore',
      'diet-herbivore',
    ]
    const backgrounds = ['bg-canvas', 'bg-deep', 'surface-1', 'surface-2', 'surface-3']

    for (const foreground of foregrounds) {
      for (const background of backgrounds) {
        expectContrast(tokens, foreground, background, 4.5, theme)
      }
    }
  })

  it('mantém textos editoriais legíveis sobre papel', () => {
    const foregrounds = [
      'paper-text',
      'paper-muted',
      'paper-placeholder',
      'paper-accent',
      'paper-index',
      'paper-body',
      'paper-ink-strong',
    ]

    for (const foreground of foregrounds) {
      expectContrast(tokens, foreground, 'paper', 4.5, theme)
    }
  })

  it('mantém ações e foco perceptíveis', () => {
    expectContrast(tokens, 'ink', 'accent', 4.5, theme)

    for (const background of ['bg-canvas', 'surface-1', 'surface-2', 'surface-3']) {
      expectContrast(tokens, 'accent-strong', background, 3, theme)
    }
  })

  it('isola conteúdo sobre fotografia das cores do preset', () => {
    expectContrast(tokens, 'media-text-primary', 'media-surface', 4.5, theme)
    expectContrast(tokens, 'media-text-secondary', 'media-surface', 4.5, theme)
    expectContrast(tokens, 'media-accent', 'media-surface', 4.5, theme)
    expectContrast(tokens, 'media-border', 'media-surface', 3, theme)

    expect(tokens['media-surface']).toBe(baseTokens['media-surface'])
    expect(tokens['media-text-primary']).toBe(baseTokens['media-text-primary'])
    expect(tokens['media-text-secondary']).toBe(baseTokens['media-text-secondary'])
  })
})
