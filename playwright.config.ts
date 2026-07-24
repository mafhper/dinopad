import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  outputDir: '.dev/playwright/test-results',
  reporter: [['html', { outputFolder: '.dev/playwright/report', open: 'never' }], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173/dinopad/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile-portrait', testIgnore: /visual\.spec\.ts/, use: { browserName: 'chromium', viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } },
    { name: 'mobile-landscape', testIgnore: /visual\.spec\.ts/, use: { viewport: { width: 844, height: 390 } } },
    { name: 'desktop', testIgnore: /visual\.spec\.ts/, use: { viewport: { width: 1440, height: 900 } } },
    { name: 'visual', testMatch: /visual\.spec\.ts/, use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: true,
  },
});
