// tests/signout.spec.ts
import { test, expect } from '@playwright/test';

test('API logout clears session and dashboard is blocked', async ({ page }) => {
  const BASE = 'https://meal4v.vercel.app';

  await page.goto(`${BASE}/login`);
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');

  const [loginResp] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/auth/login') && r.request().method() === 'POST'),
    page.click('[data-testid="login-button"]'),
  ]);
  expect([200, 302]).toContain(loginResp.status());

  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible({ timeout: 10000 });

  // logout via API (shares cookies because it's in the page context)
  await page.evaluate(() => fetch('/api/auth/logout', { method: 'POST' }));

  await page.goto(`${BASE}/dashboard`);
  await page.waitForURL('**/login', { timeout: 15000 });
  await expect(page.locator('[data-testid="login-button"]')).toBeVisible({ timeout: 10000 });
});
// signout.spec.ts (or a shared helpers file)
 
type Credentials = { email: string; password: string };

 
 
test('sign out flow', async ({ page }) => {
  // If you need a user, either register here or use known creds:
  const user = { email: `user.${Date.now()}@test.com`, password: 'SecurePass123!' };

  // If the app requires an existing account, register via API/UI before login
  // await registerUserViaApi(user); // <- your project helper

  await uiLogin(page, user); // ✅ pass creds explicitly
  // ... continue with the sign-out assertions
});
