import { expect, test } from '@playwright/test';

const pages = [
  { route: '#/', heading: 'A Terra guardou as pistas. Vamos encontrá-las.' },
  { route: '#/cartas', heading: 'Atlas' },
  { route: '#/cartas?item=tyrannosaurus-rex', heading: 'Tiranossauro' },
  { route: '#/tempo', heading: 'Tempo profundo' },
  { route: '#/arvore', heading: 'Árvore da vida' },
  { route: '#/humanidade', heading: 'Humanidade' },
  { route: '#/publicacoes', heading: 'Leia, marque, volte.' },
  { route: '#/publicacoes/arvore-ou-escada?camada=essencial', heading: 'Árvore ou escada?' },
  { route: '#/buscar', heading: 'O que você lembra?' },
  { route: '#/comparar', heading: 'Quem viveu mais perto de quem?' },
  { route: '#/config', heading: 'Seu Dinopad' },
  { route: '#/creditos', heading: 'Créditos e fontes' },
];

for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
  test(`modelos principais preservam largura e alvos em ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const item of pages) {
      await page.goto(item.route);
      await expect(page.getByRole('heading', { name: item.heading, level: 1 })).toBeVisible();
      const metrics = await page.evaluate(() => {
        const visibleButtons = [...document.querySelectorAll<HTMLElement>('main button')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { label: element.getAttribute('aria-label') ?? element.textContent?.trim(), width: rect.width, height: rect.height };
          });
        return {
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          undersizedButtons: visibleButtons.filter(({ width, height }) => width < 40 || height < 40),
        };
      });
      expect(metrics.horizontalOverflow, `${item.route} não deve transbordar horizontalmente`).toBeLessThanOrEqual(1);
      expect(metrics.undersizedButtons, `${item.route} não deve ter botões visíveis menores que 40 px`).toEqual([]);
    }
  });
}
