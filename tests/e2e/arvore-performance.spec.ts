import { expect, test } from '@playwright/test';

// A gravação de trace também ocupa a thread principal e contaminaria a métrica observada.
test.use({ trace: 'off' });

test('mantém reenquadramentos leves e respeita movimento reduzido', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Medição única no viewport desktop.');
  await page.goto('#/arvore?raiz=eukaryota&modo=cladograma');
  await expect(page.getByRole('heading', { name: 'Árvore da vida' })).toBeVisible();
  await page.evaluate(() => {
    const durations: number[] = [];
    Object.assign(window, { __dinopadLongTasks: durations });
    new PerformanceObserver((list) => durations.push(...list.getEntries().map(({ duration }) => duration))).observe({ type: 'longtask', buffered: false });
  });

  // O gate de performance evita seletores por nome acessível durante a janela medida.
  // Os testes funcionais de árvore continuam cobrindo a semântica e os nomes acessíveis.
  const focarEEsperar = async (nodeId: string, root: string) => {
    await page.locator(`[data-phylogeny-id="${nodeId}"]`).click();
    await expect(page.locator('.phylogeny-canvas')).toHaveAttribute('data-phylogeny-root', root);
    await page.waitForTimeout(230);
  };
  const voltarAEEsperar = async (root: string) => {
    await page.locator('[data-phylogeny-reset]').click();
    await expect(page.locator('.phylogeny-canvas')).toHaveAttribute('data-phylogeny-root', root);
    await page.waitForTimeout(230);
  };
  await focarEEsperar('tracheophyta', 'tracheophyta');
  await focarEEsperar('spermatophyta', 'spermatophyta');
  await focarEEsperar('angiospermae', 'angiospermae');
  await voltarAEEsperar('eukaryota');
  await focarEEsperar('chordata', 'chordata');
  await focarEEsperar('archosauromorpha', 'archosauromorpha');
  await focarEEsperar('dinosauria', 'dinosauria');
  await focarEEsperar('theropoda', 'theropoda');
  await focarEEsperar('coelurosauria', 'coelurosauria');
  await voltarAEEsperar('eukaryota');

  const maiorLongTask = await page.evaluate(() => Math.max(0, ...((window as unknown as { __dinopadLongTasks: number[] }).__dinopadLongTasks)));
  expect(maiorLongTask).toBeLessThanOrEqual(50);
  const duracoes = await page.locator('.phylogeny-stage').evaluate((element) => getComputedStyle(element).transitionDuration.split(',').map((duration) => Number.parseFloat(duration)));
  expect(duracoes.every((duration) => duration <= 0.22)).toBe(true);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('.phylogeny-stage').evaluate((element) => getComputedStyle(element).transitionDuration.split(',').every((duration) => Number.parseFloat(duration) <= 0.001))).toBe(true);
});
