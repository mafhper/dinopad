import { useCallback, useEffect, useState } from 'react';

export const THEME_IDS = ['light', 'dark', 'gold', 'purple'] as const;
export const THEME_PREFERENCES = ['system', ...THEME_IDS] as const;

export type ThemeId = (typeof THEME_IDS)[number];
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const THEME_STORAGE_KEY = 'dinopad.theme';
const THEME_EVENT = 'dinopad:theme-change';

const THEME_COLORS: Record<ThemeId, string> = {
  light: '#f5f0e4',
  dark: '#141619',
  gold: '#16150f',
  purple: '#17121d',
};

export const THEME_OPTIONS: ReadonlyArray<{
  id: ThemePreference;
  label: string;
  description: string;
}> = [
  { id: 'system', label: 'Automático', description: 'Acompanha o tema claro ou escuro do aparelho.' },
  { id: 'light', label: 'Claro', description: 'Papel fóssil, tinta escura e leitura luminosa.' },
  { id: 'dark', label: 'Escuro', description: 'Carvão mineral com acentos azulados.' },
  { id: 'gold', label: 'Dourado', description: 'Âmbar, musgo e o clima original do Dinopad.' },
  { id: 'purple', label: 'Roxo', description: 'Ameixa profunda com detalhes de ametista.' },
];

function isThemeId(value: string | null): value is ThemeId {
  return THEME_IDS.some((theme) => theme === value);
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || isThemeId(value);
}

function readStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'gold';
  } catch {
    return 'gold';
  }
}

function resolveTheme(preference: ThemePreference): ThemeId {
  if (preference !== 'system') return preference;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeColor(theme: ThemeId) {
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

export function applyThemePreference(preference: ThemePreference, persist = true) {
  const activeTheme = resolveTheme(preference);
  document.documentElement.dataset.theme = activeTheme;
  document.documentElement.dataset.themePreference = preference;
  updateThemeColor(activeTheme);

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // The selected theme still applies for this session when storage is unavailable.
    }
  }

  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { activeTheme, preference } }));
  return activeTheme;
}

export function initializeTheme() {
  return applyThemePreference(readStoredPreference(), false);
}

function currentPreference(): ThemePreference {
  const value = document.documentElement.dataset.themePreference ?? null;
  return isThemePreference(value) ? value : readStoredPreference();
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(currentPreference);
  const [activeTheme, setActiveTheme] = useState<ThemeId>(() => resolveTheme(currentPreference()));

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ activeTheme: ThemeId; preference: ThemePreference }>).detail;
      setPreference(detail.preference);
      setActiveTheme(detail.activeTheme);
    };
    const onSystemChange = () => {
      if (currentPreference() === 'system') applyThemePreference('system', false);
    };
    window.addEventListener(THEME_EVENT, onThemeChange);
    media.addEventListener('change', onSystemChange);
    return () => {
      window.removeEventListener(THEME_EVENT, onThemeChange);
      media.removeEventListener('change', onSystemChange);
    };
  }, []);

  const selectTheme = useCallback((nextPreference: ThemePreference) => {
    applyThemePreference(nextPreference);
  }, []);

  return { activeTheme, preference, selectTheme };
}
