import { expect, test } from '@playwright/test';

test('percorre Humanidade e abre o ramo filogenético correto', async ({ page }) => {
  await page.goto('#/humanidade');
  await expect(page.getByRole('heading', { name: 'Humanidade', level: 1 })).toBeVisible();
  await expect(page.locator('.dossier-index a')).toHaveCount(8);
  await expect(page.locator('.human-specimen-card')).toHaveCount(12);

  await page.getByRole('link', { name: /Abrir o ramo humano/ }).click();
  await expect(page).toHaveURL(/#\/arvore\?raiz=hominidae&modo=cladograma/);
  await expect(page.locator('[data-phylogeny-root="hominidae"]')).toBeVisible();
});

test('salva um ponto de leitura e volta ao trecho após recarregar', async ({ page }) => {
  await page.goto('#/publicacoes/arvore-ou-escada');
  const block = page.locator('#reader-block-arvore-ou-escada-aprofundar-3');
  await block.hover();
  await block.getByRole('button', { name: 'Continuar daqui depois' }).click();
  await expect(page.getByText(/Ponto de leitura salvo em/)).toBeVisible();

  await page.goto('#/');
  const homeMarker = page.getByRole('link', { name: /Árvore ou escada.*O nó não é uma espécie conhecida/ });
  await expect(homeMarker).toBeVisible();
  await homeMarker.click();
  await expect(page).toHaveURL(/retomar=arvore-ou-escada-aprofundar-3/);
  await expect(page.locator('.reader-block.is-bookmarked')).toBeFocused();

  await page.reload();
  const resume = page.getByRole('button', { name: /Continuar de onde parei/ });
  await expect(resume).toBeVisible();
  await resume.click();
  await expect(page.locator('.reader-block.is-bookmarked')).toBeFocused();
});

test('destaca uma seleção e adiciona um comentário no próprio trecho', async ({ page }) => {
  await page.goto('#/publicacoes/leitura-cann-1987');
  const block = page.locator('#reader-block-leitura-cann-1987-aprofundar-1');
  const paragraph = block.locator('[data-reader-content]');

  await paragraph.evaluate((element) => {
    const text = element.firstChild;
    if (!text) throw new Error('Parágrafo sem texto selecionável');
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, Math.min(36, text.textContent?.length ?? 0));
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  });
  await block.getByRole('button', { name: 'Destacar o texto selecionado' }).click();
  await expect(block.locator('mark')).toBeVisible();

  const commentBlock = page.locator('#reader-block-leitura-cann-1987-aprofundar-2');
  const commentParagraph = commentBlock.locator('[data-reader-content]');
  await commentParagraph.evaluate((element) => {
    const text = element.firstChild;
    if (!text) throw new Error('Parágrafo sem texto selecionável');
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, Math.min(38, text.textContent?.length ?? 0));
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  });
  await commentBlock.getByRole('button', { name: 'Comentar o texto selecionado' }).click();
  await commentBlock.getByLabel('Comentário').fill('Rever a diferença entre linhagem genética e pessoa.');
  await commentBlock.getByRole('button', { name: 'Salvar comentário' }).click();
  await expect(commentBlock.getByText('Rever a diferença entre linhagem genética e pessoa.')).toBeVisible();
});
