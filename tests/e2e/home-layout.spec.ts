import { expect, test } from '@playwright/test';

test('home mantém leituras, caderno e humanidade na mesma coluna visual', async ({ page }) => {
  await page.goto('#/');
  await expect(page.getByRole('heading', { name: 'A Terra guardou as pistas. Vamos encontrá-las.', level: 1 })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const bounds = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Elemento ausente: ${selector}`);
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    };

    return {
      reading: bounds('.home-reading-section'),
      personal: bounds('.home-personal-grid'),
      pathways: bounds('.home-pathways'),
    };
  });

  for (const section of [metrics.reading, metrics.pathways]) {
    expect(Math.abs(section.left - metrics.personal.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(section.right - metrics.personal.right)).toBeLessThanOrEqual(1);
    expect(Math.abs(section.width - metrics.personal.width)).toBeLessThanOrEqual(1);
  }
});
