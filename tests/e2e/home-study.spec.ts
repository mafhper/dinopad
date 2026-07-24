import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context, page }) => {
  await context.clearCookies();
  await page.goto('#/');
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('dinopad-study');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  });
  await page.reload();
});

test('concluir uma leitura a retira da estante diária', async ({ page }) => {
  const firstReading = page.locator('.home-reading-card').first();
  await expect(firstReading).toBeVisible();
  const title = await firstReading.locator('h3').innerText();
  await firstReading.click();

  await page.getByRole('button', { name: 'Marcar como lida' }).click();
  await expect(page.getByText('Leitura marcada como concluída.')).toBeVisible();

  await page.goto('#/');
  await expect(page.locator('.home-reading-card h3', { hasText: title })).toHaveCount(0);
});

test('um organismo favorito reaparece no caderno da home', async ({ page }) => {
  await page.goto('#/cartas?item=tyrannosaurus-rex');
  await page.getByRole('button', { name: 'Adicionar aos favoritos' }).click();
  await expect(page.getByRole('button', { name: 'Remover dos favoritos' })).toBeVisible();

  await page.goto('#/');
  await expect(page.locator('.home-shelf').getByText('Tiranossauro', { exact: true })).toBeVisible();
});

test('backup fica nas configurações e não interrompe a biblioteca', async ({ page }) => {
  await page.goto('#/publicacoes');
  await expect(page.getByRole('button', { name: /Exportar/ })).toHaveCount(0);
  await expect(page.getByText('Seus dados pertencem ao navegador')).toHaveCount(0);

  await page.goto('#/config');
  await expect(page.getByRole('button', { name: 'Exportar cópia' })).toBeVisible();
  await expect(page.getByText('Importar cópia')).toBeVisible();
});
