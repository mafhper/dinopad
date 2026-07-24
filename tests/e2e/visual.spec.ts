import { expect, test } from '@playwright/test';

const tamanhos = [
  { width: 360, height: 800 },
  { width: 844, height: 390 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

test('linha do tempo mantém composição responsiva aprovada', async ({ page }) => {
  for (const tamanho of tamanhos) {
    await page.setViewportSize(tamanho);
    await page.goto('#/tempo');
    await expect(page.getByRole('heading', { name: 'Tempo profundo' })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`timeline-${tamanho.width}x${tamanho.height}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });
  }
});

test('árvore mantém foco e inspetor responsivos', async ({ page }) => {
  for (const tamanho of tamanhos) {
    await page.setViewportSize(tamanho);
    await page.goto('#/arvore?raiz=dinosauria&modo=cladograma');
    await expect(page.getByRole('heading', { name: 'Árvore da vida' })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`arvore-${tamanho.width}x${tamanho.height}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });
  }
});

test('temas mantêm contraste e hierarquia na tela de preferências', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('#/config');
  for (const theme of ['Claro', 'Escuro', 'Dourado', 'Roxo']) {
    await page.getByRole('radio', { name: new RegExp(theme) }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme === 'Claro' ? 'light' : theme === 'Escuro' ? 'dark' : theme === 'Dourado' ? 'gold' : 'purple');
    await expect(page).toHaveScreenshot(`tema-${theme.toLocaleLowerCase('pt-BR')}-1024x768.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });
  }

  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('#/config');
  await page.getByRole('radio', { name: /Roxo/ }).check();
  await expect(page).toHaveScreenshot('tema-roxo-360x800.png', {
    animations: 'disabled',
    caret: 'hide',
    fullPage: false,
  });
});

test('Humanidade e Biblioteca mantêm leitura progressiva nos quatro formatos', async ({ page }) => {
  for (const tamanho of tamanhos) {
    await page.setViewportSize(tamanho);
    await page.goto('#/humanidade');
    await expect(page.getByRole('heading', { name: 'Humanidade', level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`humanidade-${tamanho.width}x${tamanho.height}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });

    await page.goto('#/publicacoes');
    await expect(page.getByRole('heading', { name: 'Leia, marque, volte.' })).toBeVisible();
    await expect(page).toHaveScreenshot(`biblioteca-${tamanho.width}x${tamanho.height}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });
  }
});

test('home, atlas, ficha e leitor mantêm os modelos principais', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-07-24T12:00:00-03:00'));
  for (const tamanho of [tamanhos[0], tamanhos[3]]) {
    await page.setViewportSize(tamanho);
    for (const surface of [
      { slug: 'home', route: '#/', heading: 'A Terra guardou as pistas. Vamos encontrá-las.' },
      { slug: 'atlas', route: '#/cartas', heading: 'Atlas' },
      { slug: 'ficha', route: '#/cartas?item=tyrannosaurus-rex', heading: 'Tiranossauro' },
      { slug: 'leitor', route: '#/publicacoes/arvore-ou-escada?camada=essencial', heading: 'Árvore ou escada?' },
    ]) {
      await page.goto(surface.route);
      await expect(page.getByRole('heading', { name: surface.heading, level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${surface.slug}-${tamanho.width}x${tamanho.height}.png`, {
        animations: 'disabled',
        caret: 'hide',
        fullPage: false,
      });
    }
  }
});

test('ferramentas e transparência mantêm o mesmo ritmo visual', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const surface of [
    { slug: 'buscar', route: '#/buscar', heading: 'O que você lembra?' },
    { slug: 'comparar', route: '#/comparar', heading: 'Quem viveu mais perto de quem?' },
    { slug: 'creditos', route: '#/creditos', heading: 'Créditos e fontes' },
  ]) {
    await page.goto(surface.route);
    await expect(page.getByRole('heading', { name: surface.heading, level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${surface.slug}-1440x900.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });
  }
});
