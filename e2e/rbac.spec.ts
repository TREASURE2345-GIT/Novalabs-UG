import { test, expect, type Page } from '@playwright/test';

const roles = ['student', 'teacher', 'admin', 'partner'] as const;
type Role = (typeof roles)[number];

async function signInAs(page: Page, role: Role, status: 'active' | 'suspended' = 'active') {
  await page.addInitScript(
    ({ role, status }) => {
      sessionStorage.setItem(
        'novalab:user',
        JSON.stringify({
          id: `e2e-${role}`,
          name: `E2E ${role}`,
          email: `${role}@example.com`,
          role,
          status,
          permissions: [],
          createdAt: '2024-01-01T00:00:00.000Z',
        }),
      );
    },
    { role, status },
  );
}

test('student can open a subject lab and its experiments', async ({ page }) => {
  await signInAs(page, 'student');
  await page.goto('/labs/chemistry');
  await expect(page.getByRole('heading', { name: /chemistry/i }).first()).toBeVisible();
  await expect(page.getByText(/flame tests/i).first()).toBeVisible();
});

test('partner is blocked from lab routes', async ({ page }) => {
  await signInAs(page, 'partner');
  await page.goto('/labs/biology');
  await expect(page.getByRole('heading', { name: /access denied/i })).toBeVisible();
});

test('suspended users are redirected to the suspension page', async ({ page }) => {
  await signInAs(page, 'student', 'suspended');
  await page.goto('/labs/biology');
  await expect(page.getByRole('heading', { name: /account suspended/i })).toBeVisible();
  await expect(page).toHaveURL(/\/suspended$/);
});

test('teacher navigation exposes class tools but student navigation does not', async ({ page }) => {
  await signInAs(page, 'teacher');
  await page.goto('/dashboard');
  await expect(page.getByRole('link', { name: /my classes/i })).toBeVisible();

  await signInAs(page, 'student');
  await page.goto('/dashboard');
  await expect(page.getByRole('link', { name: /my classes/i })).toHaveCount(0);
});

test('admin can reach the user management page', async ({ page }) => {
  await signInAs(page, 'admin');
  await page.goto('/admin/users');
  await expect(page.getByRole('heading', { name: /users and access/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /recent audit log/i })).toBeVisible();
});

test('experiment page renders the interactive bench and simulation', async ({ page }) => {
  await signInAs(page, 'student');
  await page.goto('/experiments/flame-tests');
  await expect(page.getByRole('heading', { name: /interactive practical bench/i })).toBeVisible();
  await expect(page.getByText(/flame test simulator/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /check setup/i })).toBeVisible();
});

test('student can sign in offline, complete a practical, and submit a lab report', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Student', exact: true }).click();
  await page.getByRole('button', { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.reload();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto('/experiments/acid-base-titration');
  await page.getByRole('button', { name: /set up apparatus/i }).click();
  await expect(page.getByText(/apparatus setup complete/i).first()).toBeVisible();

  await page.getByLabel('Measurement', { exact: true }).fill('pH 7.00');
  await page.getByLabel('Observation', { exact: true }).fill(
    'The solution changed from colourless to permanent pink at the endpoint because neutralisation occurred.',
  );
  await page.getByRole('button', { name: /submit practical evidence/i }).click();
  await expect(page.getByText(/practical evidence submitted/i).first()).toBeVisible();

  const recordTrial = page.getByRole('button', { name: /^record trial$/i });
  await recordTrial.click();
  await recordTrial.click();
  await recordTrial.click();
  await page.getByLabel('Conclusion', { exact: true }).fill(
    'The endpoint was reached because the acid and alkali neutralised, therefore the titration result is reliable.',
  );

  for (let step = 0; step < 12; step += 1) {
    const checkpointOption = page.getByRole('button', { name: /^A\./ });
    if (await checkpointOption.count()) {
      await checkpointOption.first().click();
    }
    const finish = page.getByRole('button', { name: /^finish$/i });
    if (await finish.count()) {
      await finish.click();
      if (await page.getByText(/experiment graded/i).count()) break;
      continue;
    }
    await page.getByRole('button', { name: /^next/i }).click();
  }

  await expect(page.getByText(/experiment graded/i)).toBeVisible();
  await page.getByRole('button', { name: /submit lab report for grading/i }).click();
  await expect(page.getByText(/awaiting teacher review/i).first()).toBeVisible();
});

test('student can build a complete flame-test setup and re-check after changes', async ({ page }) => {
  await signInAs(page, 'student');
  await page.goto('/experiments/flame-tests');

  for (const name of [
    'Nichrome wire loop',
    'Flame test samples',
    'Bunsen burner',
    'White tile',
    'Forceps',
    'Test tube rack',
    'Dilute hydrochloric acid',
  ]) {
    await page.getByRole('button', { name: `Add ${name} to bench` }).click();
  }
  for (const name of ['safety goggles', 'protective gloves', 'laboratory coat']) {
    await page.getByRole('button', { name: `Wear ${name}` }).click();
  }

  await page.getByRole('button', { name: /check setup/i }).click();
  await expect(page.getByText(/apparatus setup complete/i).first()).toBeVisible();

  await page.getByRole('button', { name: /safety goggles on/i }).click();
  await expect(page.getByText(/apparatus setup complete/i)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /check setup/i })).toBeVisible();
});
