import { expect, test } from '@playwright/test';

async function focar(page: import('@playwright/test').Page, nomeCientifico: RegExp) {
  await page.getByRole('treeitem', { name: nomeCientifico }).click();
}

async function selectedDistanceFromVisibleCenter(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const treeCanvas = document.querySelector<HTMLElement>('.phylogeny-canvas');
    const inspector = document.querySelector<HTMLElement>('.phylogeny-inspector');
    const marker = document.querySelector<SVGGraphicsElement>('.phylogeny-node.is-selected circle, .phylogeny-node.is-selected image');
    if (!treeCanvas || !marker) return Number.POSITIVE_INFINITY;

    const canvasRect = treeCanvas.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const inspectorRect = inspector?.getBoundingClientRect();
    const overlap = inspectorRect ? {
      bottom: Math.min(canvasRect.bottom, inspectorRect.bottom),
      left: Math.max(canvasRect.left, inspectorRect.left),
      right: Math.min(canvasRect.right, inspectorRect.right),
      top: Math.max(canvasRect.top, inspectorRect.top),
    } : null;
    const candidates = overlap && overlap.right > overlap.left && overlap.bottom > overlap.top ? [
      { bottom: canvasRect.bottom, left: canvasRect.left, right: overlap.left, top: canvasRect.top },
      { bottom: canvasRect.bottom, left: overlap.right, right: canvasRect.right, top: canvasRect.top },
      { bottom: overlap.top, left: canvasRect.left, right: canvasRect.right, top: canvasRect.top },
      { bottom: canvasRect.bottom, left: canvasRect.left, right: canvasRect.right, top: overlap.bottom },
    ] : [canvasRect];
    const visible = candidates
      .map((rect) => ({
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        area: Math.max(0, rect.right - rect.left) * Math.max(0, rect.bottom - rect.top),
      }))
      .sort((a, b) => b.area - a.area)[0];
    const target = visible.area > 0
      ? visible
      : { bottom: canvasRect.bottom, left: canvasRect.left, right: canvasRect.right, top: canvasRect.top };
    const expectedX = (target.left + target.right) / 2;
    const expectedY = (target.top + target.bottom) / 2;
    const markerX = markerRect.left + markerRect.width / 2;
    const markerY = markerRect.top + markerRect.height / 2;
    return Math.hypot(markerX - expectedX, markerY - expectedY);
  });
}

test('parte de Eukaryota e chega a uma planta e a um dinossauro', async ({ page }) => {
  await page.goto('#/arvore?raiz=eukaryota&modo=cladograma');
  await expect(page.getByRole('heading', { name: 'Árvore da vida' })).toBeVisible();

  await focar(page, /Tracheophyta/);
  await focar(page, /Euphyllophyta/);
  await focar(page, /Spermatophyta/);
  await focar(page, /Angiospermae/);
  await focar(page, /Archaefructaceae/);
  await focar(page, /Archaefructus, certeza/);
  await focar(page, /Archaefructus liaoningensis/);
  await expect(page.getByRole('heading', { name: 'Arqueofruto' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir ficha' }).click();
  await expect(page.getByRole('heading', { name: 'Arqueofruto' })).toBeVisible();

  await page.goto('#/arvore?raiz=eukaryota&modo=cladograma');
  await focar(page, /Chordata/);
  await focar(page, /Vertebrata/);
  await focar(page, /Tetrapoda/);
  await focar(page, /Amniota/);
  await focar(page, /Sauropsida/);
  await focar(page, /Archosauromorpha/);
  await focar(page, /Archosauria/);
  await focar(page, /Dinosauria/);
  await focar(page, /Saurischia/);
  await focar(page, /Eusaurischia/);
  await focar(page, /Theropoda/);
  await focar(page, /Tetanurae/);
  await focar(page, /Avetheropoda/);
  await focar(page, /Coelurosauria/);
  await focar(page, /Tyrannosauroidea/);
  await focar(page, /Tyrannosaurus rex/);
  await expect(page.getByRole('heading', { name: 'Tiranossauro' })).toBeVisible();
});

test('restaura foco, seleção e modo pela URL', async ({ page }) => {
  await page.goto('#/arvore?raiz=dromaeosauridae&item=velociraptor&modo=cladograma');
  await expect(page.getByRole('heading', { name: 'Velociraptor' })).toBeVisible();
  await page.getByRole('button', { name: 'Ver como lista' }).click();
  await expect(page).toHaveURL(/modo=lista/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Velociraptor' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cladograma' })).toHaveAttribute('aria-pressed', 'true');
});

test('abre a árvore em tela cheia, preserva a URL e fecha com Escape', async ({ page }) => {
  await page.goto('#/arvore?raiz=hominidae&modo=cladograma');
  await page.getByRole('button', { name: 'Abrir árvore em tela cheia' }).click();
  await expect(page).toHaveURL(/tela=cheia/);
  await expect(page.getByRole('dialog', { name: 'Árvore da vida em tela cheia' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/tela=cheia/);
  await expect(page.getByRole('button', { name: 'Abrir árvore em tela cheia' })).toBeFocused();
});

test('identifica o ramo em foco ao retroceder pela árvore', async ({ page }) => {
  await page.goto('#/arvore?raiz=sauropsida&modo=cladograma&tela=cheia');
  const context = page.locator('[data-phylogeny-context]');

  await expect(context).toContainText('Sauropsídeos');
  await expect(page.locator('[data-phylogeny-current-root="true"]')).toHaveCount(1);
  await expect(page.locator('[data-phylogeny-current-root="true"]')).toHaveAttribute('aria-current', 'location');
  await expect(page.getByRole('button', { name: 'Sauropsídeos' })).toHaveAttribute('aria-current', 'location');

  await page.getByRole('button', { name: 'Voltar um ramo' }).click();
  await expect(page).toHaveURL(/raiz=amniota/);
  await expect(context).toContainText('Amniotas');
  await expect(page.locator('[data-phylogeny-current-root="true"]')).toHaveAttribute('data-phylogeny-id', 'amniota');

  await page.locator('[data-phylogeny-reset]').click();
  await expect(page).toHaveURL(/raiz=eukaryota/);
  await expect(context).toContainText('Eucariotos');
});

test('abre o nódulo correspondente a partir de uma ficha', async ({ page }) => {
  await page.goto('#/cartas?item=homo-naledi');
  await page.getByRole('link', { name: /Ver na árvore/ }).click();
  await expect(page).toHaveURL(/raiz=homo&item=homo-naledi&modo=cladograma/);
  await expect(page.getByRole('heading', { name: 'Homo naledi' })).toBeVisible();
});

test('centraliza o nódulo ao navegar pelo inspetor', async ({ page }) => {
  await page.goto('#/arvore?raiz=titanosauria&item=austroposeidon&modo=cladograma');
  const canvas = page.locator('.phylogeny-canvas');
  await expect(canvas).toBeVisible();
  await canvas.evaluate((element) => element.scrollTo({ left: 0, top: 0 }));

  await page.getByRole('button', { name: 'Próximo' }).click();
  await expect(page).toHaveURL(/item=uberabatitan/);

  await expect.poll(() => selectedDistanceFromVisibleCenter(page)).toBeLessThan(18);

  await page.getByRole('button', { name: 'Anterior', exact: true }).click();
  await expect(page).toHaveURL(/item=austroposeidon/);
  await expect.poll(() => selectedDistanceFromVisibleCenter(page)).toBeLessThan(18);
});
