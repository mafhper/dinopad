import { expect, test } from '@playwright/test';

test('explora um organismo, restaura URL e volta ao Mesozoico', async ({ page }) => {
  await page.goto('#/tempo?inicioMa=71&fimMa=63&item=tyrannosaurus-rex&camada=organismo&filtro=fauna');
  await expect(page.getByRole('heading', { name: 'Tiranossauro' })).toBeVisible();
  await expect(page).toHaveURL(/item=tyrannosaurus-rex/);
  await page.getByRole('button', { name: 'Voltar ao Mesozoico' }).click();
  await expect(page.locator('.timeline-header strong', { hasText: 'Mesozoico' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Tiranossauro' })).toBeVisible();
});

test('abre atlas, ficha e navega entre organismos relacionados', async ({ page }) => {
  await page.goto('#/cartas');
  await expect(page.getByRole('heading', { name: 'Atlas', level: 1 })).toBeVisible();
  await page.getByRole('button', { name: /Tiranossauro/ }).click();
  await expect(page.getByRole('heading', { name: 'Tiranossauro' })).toBeVisible();
  await page.getByRole('button', { name: /Tricerátopo/ }).click();
  await expect(page.getByRole('heading', { name: 'Tricerátopo' })).toBeVisible();
});

test.describe('cache offline', () => {
  test.use({ serviceWorkers: 'allow' });

  test('continua navegável sem rede depois de aquecer as rotas', async ({ page, context }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'O cache offline é independente do viewport e é validado uma vez no desktop.');
    await page.goto('#/');
    await page.getByRole('link', { name: 'Abrir o atlas' }).click();
    await expect(page.getByRole('heading', { name: 'Atlas', level: 1 })).toBeVisible();
    await page.getByRole('link', { name: 'Tempo' }).click();
    await expect(page.getByRole('heading', { name: 'Tempo profundo' })).toBeVisible();
    await page.evaluate(() => navigator.serviceWorker?.ready);
    await expect.poll(() => page.evaluate(async () => {
      if (!navigator.serviceWorker.controller) return false;
      const cacheName = (await caches.keys()).find((name) => name.startsWith('dinopad-atlas-'));
      if (!cacheName) return false;
      const requests = await (await caches.open(cacheName)).keys();
      return requests.some(({ url }) => url.includes('/assets/ArvoreEvolutiva-'));
    }), { timeout: 30_000 }).toBe(true);
    await context.setOffline(true);
    await page.goto('#/cartas?item=archaefructus');
    await expect(page.getByRole('heading', { name: 'Arqueofruto' })).toBeVisible();
    const imagemDaPlanta = page.locator('.detail-gallery img').first();
    await expect.poll(() => imagemDaPlanta.evaluate((imagem: HTMLImageElement) => imagem.naturalWidth)).toBeGreaterThan(0);
    await page.goto('#/arvore?raiz=archaefructus-lineage&item=archaefructus&modo=cladograma');
    await expect(page.getByRole('heading', { name: 'Arqueofruto' })).toBeVisible();
    await page.goto('#/publicacoes');
    await expect(page.getByRole('heading', { name: 'Biblioteca' })).toBeVisible();
    await context.setOffline(false);
  });
});

test('ficha de pterossauro usa envergadura sem inventar comprimento', async ({ page }) => {
  await page.goto('#/cartas?item=pteranodon');
  await expect(page.getByRole('heading', { name: 'Pteranodonte' })).toBeVisible();
  await expect(page.locator('.fact-cell', { hasText: 'Envergadura' })).toContainText('6 m');
  await expect(page.locator('.fact-cell', { hasText: 'Comprimento' })).toHaveCount(0);
});

test('ficha usa régua dimensional e não uma silhueta abstrata para escala', async ({ page }) => {
  await page.goto('#/cartas?item=tyrannosaurus-rex');
  const escala = page.getByRole('region', { name: /Comprimento: até 12–13 m\. Régua de zero a 15 m/ });
  await expect(escala).toBeVisible();
  await expect(escala).toContainText('Referência humana: 1,7 m.');
  await expect(page.locator('.detail-gallery .dimension-scale img')).toHaveCount(0);
  await expect(page.locator('.detail-gallery .detail-visual').evaluate((element) => getComputedStyle(element, '::after').content)).resolves.toBe('none');

  await page.getByRole('button', { name: 'Ampliar Escala aproximada de Tiranossauro' }).click();
  const dialog = page.getByRole('dialog', { name: 'Tiranossauro' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('region', { name: /Régua de zero a 15 m/ })).toBeVisible();
});

test('carrega a mídia local sob o prefixo do GitHub Pages', async ({ page }) => {
  const respostasQuebradas: string[] = [];
  page.on('response', (response) => {
    if (response.url().includes('/media/') && !response.ok()) respostasQuebradas.push(`${response.status()} ${response.url()}`);
  });

  await page.goto('#/cartas');
  const imagemPrincipal = page.locator('.organism-card img').first();
  await expect(imagemPrincipal).toBeVisible();
  await expect.poll(() => imagemPrincipal.evaluate((imagem: HTMLImageElement) => imagem.naturalWidth)).toBeGreaterThan(0);
  await expect(imagemPrincipal).toHaveAttribute('src', /\/dinopad\/media\//);
  expect(respostasQuebradas).toEqual([]);
});
