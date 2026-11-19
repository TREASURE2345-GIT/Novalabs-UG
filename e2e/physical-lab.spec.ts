import { test, expect, type Page } from '@playwright/test';

async function runTitration(page: Page) {
  for (let index = 0; index < 24; index += 1) {
    await page.getByRole('button', { name: 'Add 1.00 cm³' }).click();
  }
  for (let index = 0; index < 5; index += 1) {
    await page.getByRole('button', { name: 'Add 0.10 cm³' }).click();
  }
  await expect(page.getByText(/endpoint reached/i).first()).toBeVisible();
  await page.getByRole('button', { name: 'Record trial' }).click();
}

test('physical titration lab runs a complete experiment with interactive apparatus', async ({ page }) => {
  await page.goto('/physical-lab');
  await expect(page.getByRole('heading', { name: 'Acid–base titration' })).toBeVisible();
  await expect(page.getByRole('img', { name: /titration apparatus/i })).toBeVisible();

  await page.getByRole('button', { name: /wear safety goggles/i }).click();
  await page.getByRole('button', { name: /wear lab coat/i }).click();
  await page.getByRole('button', { name: /wear gloves/i }).click();
  await page.getByRole('button', { name: 'Fill burette with acid' }).click();
  await page.getByRole('button', { name: 'Add indicator' }).click();

  await runTitration(page);
  await page.getByRole('button', { name: 'Refill burette' }).click();
  await runTitration(page);
  await page.getByRole('button', { name: 'Refill burette' }).click();
  await runTitration(page);

  await expect(page.getByText(/experiment complete/i)).toBeVisible();
  await expect(page.getByText(/mean 24.50 cm³/i)).toBeVisible();
});
