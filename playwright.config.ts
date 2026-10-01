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

// **O comando invoca o Vite direto, e nao `npm run preview`. Deliberado.**
//
// `npm run preview` e o launcher, e o launcher sobe o Vite como filho. Isso
// coloca tres processos entre o Playwright e o servidor — `npm`, o launcher, o
// Vite — e o `webServer` encerra **um** processo, o primeiro. O Vite sobrevive
// com o pipe de saida aberto, o Playwright espera o fim do pipe, e o job fica
// pendurado sem erro: foi o que aconteceu na CI, 25 min contra 2,6 de base.
//
// Um comando com wrapper dentro de `webServer` e armadilha conhecida. O numero
// vem do registro (fonte unica) e o `--strictPort` mantem a falha alta, que e o
// que substitui o launcher aqui: se algo Changed a porta entre a leitura e o
// bind, o processo morre em vez de servir em outro lugar.
//
// Nao trocar por `npm run preview` sem medir o tempo do job.
const VITE_BIN = 'node_modules/vite/bin/vite.js';
const COMANDO = `node ${VITE_BIN} preview --port ${PREVIEW} --strictPort --host 127.0.0.1`;

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  outputDir: '.dev/playwright/test-results',
  reporter: [['html', { outputFolder: '.dev/playwright/report', open: 'never' }], ['list']],
  use: {
    baseURL: `http://127.0.0.1:${PREVIEW}/dinopad/`,
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
    command: COMANDO,
    port: PREVIEW,
    reuseExistingServer: false,
  },
});