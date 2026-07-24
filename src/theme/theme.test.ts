import { afterEach, describe, expect, it } from 'vitest';
import { applyThemePreference, THEME_STORAGE_KEY } from './theme';

afterEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themePreference;
});

describe('preferência de tema', () => {
  it('aplica e persiste um tema escolhido', () => {
    applyThemePreference('purple');

    expect(document.documentElement).toHaveAttribute('data-theme', 'purple');
    expect(document.documentElement).toHaveAttribute('data-theme-preference', 'purple');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('purple');
  });

  it('persiste a preferência automática', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'gold');
    applyThemePreference('system');

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement).toHaveAttribute('data-theme-preference', 'system');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
  });
});
