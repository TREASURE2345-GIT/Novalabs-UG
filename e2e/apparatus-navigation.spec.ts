import { test, expect, type Page } from '@playwright/test';

async function signInAsStudent(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      'novalab:user',
      JSON.stringify({
        id: 'e2e-apparatus',
        name: 'E2E Student',
        email: 'student@example.com',
        role: 'student',
        status: 'active',
        permissions: [],
        createdAt: '2024-01-01T00:00:00.000Z',
      }),
    );
  });
}

test('subject dashboard shows apparatus and starts at the setup bench', async ({ page }) => {
  await signInAsStudent(page);
  await page.goto('/labs/chemistry');

  await expect(page.getByRole('heading', { name: 'Choose a practical' })).toBeVisible();
  await expect(page.getByText('Apparatus to set up').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Set up apparatus →' }).first()).toBeVisible();

  await page.getByRole('link', { name: 'Set up & start practical' }).first().click();
  await expect(page).toHaveURL(/\/experiments\/[a-z-]+\?setup=1/);
  await expect(page.getByRole('heading', { name: /interactive practical bench/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Set up apparatus' })).toBeVisible();
});

test('measurable apparatus updates its live reading', async ({ page }) => {
  await signInAsStudent(page);
  await page.goto('/experiments/acid-base-titration?setup=1');

  await page.getByRole('button', { name: 'Set up apparatus' }).click();
  await expect(page.getByText('Live measurement')).toBeVisible();

  const panel = page.getByTestId('measurable-apparatus');
  const mark = panel.getByRole('button').nth(1);
  const markText = (await mark.innerText()).trim();
  await mark.click();
  await expect(panel.getByText(markText, { exact: true }).first()).toBeVisible();
  await expect(panel.getByRole('img')).toHaveAttribute('aria-label', new RegExp(markText.replace('.', '\\.')));

  const benchHeight = await page.locator('[data-dropzone="bench"]').evaluate((element) => Math.round(element.clientHeight));
  expect(benchHeight).toBeLessThan(320);
});

test('student dashboard lists apparatus for each subject', async ({ page }) => {
  await signInAsStudent(page);
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Set up a practical' })).toBeVisible();
  await expect(page.getByText('Apparatus provided').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Set up apparatus →' })).toHaveCount(4);
});
