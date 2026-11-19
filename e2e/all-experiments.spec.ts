import { test, expect, type Page } from '@playwright/test';
import { experimentCatalog } from '../src/data/experimentCatalog';

async function signInAsStudent(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      'novalab:user',
      JSON.stringify({
        id: 'e2e-all-experiments',
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

test('every catalog experiment has a usable apparatus bench and simulation', async ({ page }) => {
  test.setTimeout(120_000);
  await signInAsStudent(page);

  for (const slug of Object.keys(experimentCatalog)) {
    await page.goto(`/experiments/${slug}`);
    await expect(
      page.getByRole('heading', { name: /interactive practical bench/i }),
      `${slug} is missing the apparatus bench`,
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^Add .+ to bench$/ }).first(),
      `${slug} has no apparatus to add`,
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /record trial/i }),
      `${slug} is missing a runnable simulation`,
    ).toBeVisible();

    await page.getByRole('button', { name: /set up apparatus/i }).click();
    await expect(
      page.getByText(/apparatus setup complete/i).first(),
      `${slug} could not set up its required apparatus`,
    ).toBeVisible();
  }
});

test('every catalog experiment can be completed from setup to final grading', async ({ page }) => {
  test.setTimeout(300_000);
  await signInAsStudent(page);

  for (const slug of Object.keys(experimentCatalog)) {
    await page.goto(`/experiments/${slug}`);

    await page.getByRole('button', { name: /set up apparatus/i }).click();
    await expect(
      page.getByText(/apparatus setup complete/i).first(),
      `${slug} could not set up its required apparatus`,
    ).toBeVisible();

    await page.getByLabel('Measurement', { exact: true }).fill('A measurable result of 10 units was observed.');
    await page.getByLabel('Observation', { exact: true }).fill(
      'The apparatus behaved as expected and the result changed clearly during the practical.',
    );
    await page.getByRole('button', { name: /submit practical evidence/i }).click();
    await expect(
      page.getByText(/practical evidence submitted/i).first(),
      `${slug} could not submit practical evidence`,
    ).toBeVisible();

    await page.getByLabel('Conclusion', { exact: true }).fill(
      'The experiment worked because the variables were controlled and therefore the evidence is reliable.',
    );

    for (let step = 0; step < 12; step += 1) {
      const checkpointOption = page.getByRole('button', { name: /^A\./ });
      if (await checkpointOption.count()) {
        await checkpointOption.first().click();
      }
      const finish = page.getByRole('button', { name: /^finish$/i });
      if (await finish.count()) {
        await finish.click();
        break;
      }
      const next = page.getByRole('button', { name: /^next/i });
      if (!(await next.count())) break;
      await next.click();
    }

    await expect(
      page.getByText(/experiment graded/i),
      `${slug} did not reach final grading`,
    ).toBeVisible();
  }
});
