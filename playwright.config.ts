import { defineConfig } from '@playwright/test';
import { PORTAS } from './scripts/dev/portas';

// A porta do servidor de teste vem do **registro**, e nao de um literal.
//
// Este arquivo fixava 4173 e o `npm run preview` agora sobe na porta nomeada
// `dinopad-preview` (4180). O resultado foi o job `browser` da CI pendurado
// para sempre: o Playwright esperava 4173, o servidor escutava 4180, e ninguem
// acusou nada — a mesma classe do documento de porta da frota, agora entre o
// teste e o servidor.
//
// Ler o registro aqui e o que mantem uma fonte so. Um literal nos dois lados
// funciona ate alguem trocar um deles.
const PREVIEW = PORTAS['dinopad-preview'];
const BASE = `http://127.0.0.1:${PREVIEW}/dinopad/`;

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  outputDir: '.dev/playwright/test-results',
  reporter: [['html', { outputFolder: '.dev/playwright/report', open: 'never' }], ['list']],
  use: {
    baseURL: BASE,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile-portrait', testIgnore: /visual\.spec\.ts/, use: { browserName: 'chromium', viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } },
    { name: 'mobile-landscape', testIgnore: /visual\.spec\.ts/, use: { viewport: { width: 844, height: 390 } } },
    { name: 'desktop', testIgnore: /visual\.spec\.ts/, use: { viewport: { width: 1440, height: 900 } } },
    { name: 'visual', testMatch: /visual\.spec\.ts/, use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // Sem `--host`: o launcher ja passa `--host 127.0.0.1` ao Vite, e um
    // argumento extra aqui seria lido por ninguem.
    command: 'npm run preview',
    port: PREVIEW,
    reuseExistingServer: false,
  },
});