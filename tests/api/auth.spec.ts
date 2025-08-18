// tests/api/auth.spec.ts
import { test, expect } from '@playwright/test';

test.beforeAll(async ({ page, baseURL }) => {
  // Ensure base URL resolves before API calls
  await page.goto(baseURL!);
  await expect(page).toHaveTitle(/Your App/i); // optional sanity check
});

test.describe('Auth API contract', () => {
  const email = `spec.user+${Date.now()}@example.com`;
  const password = 'SpecPass123!';

  test('register + login flow', async ({ request }) => {
    // Register
    const reg = await request.post('/api/auth/register', {
      data: { name: 'Spec User', email, password },
    });
    expect([201, 200, 400]).toContain(reg.status());

    // Login valid
    const ok = await request.post('/api/auth/login', {
      data: { email, password },
    });
    expect(ok.status()).toBe(200);

    // Login invalid
    const bad = await request.post('/api/auth/login', {
      data: { email, password: 'WrongPass!' },
    });
    expect(bad.status()).toBe(401);
  });
});
