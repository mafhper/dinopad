import { expect, test } from '@playwright/test';

test('usa a arte de Dilophosaurus somente na abertura da home', async ({ page }) => {
  await page.goto('#/');

  await expect(page.locator('.brand-lockup img, .mobile-brand img')).toHaveCount(0);
  await expect(page.locator('.home-brand-art img')).toHaveCount(1);
  await expect(page.locator('.home-brand-art img')).toHaveAttribute('src', /dinopad-dilophosaurus-transparent/);
});

test('escolhe um tema, persiste a preferência e mantém acesso no celular', async ({ page }) => {
  await page.goto('#/config');
  await expect(page.getByRole('heading', { name: 'Seu Dinopad' })).toBeVisible();

  await page.getByRole('radio', { name: /Roxo/ }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'purple');
  await page.reload();
  await expect(page.getByRole('radio', { name: /Roxo/ })).toBeChecked();

  await page.goto('#/');
  const mobileSettings = page.getByRole('link', { name: 'Aparência e configurações' });
  if (await mobileSettings.isVisible()) await mobileSettings.click();
  else await page.getByRole('link', { name: 'Configurações' }).click();
  await expect(page.getByRole('heading', { name: 'Seu Dinopad' })).toBeVisible();
});
