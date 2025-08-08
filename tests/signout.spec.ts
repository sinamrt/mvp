// tests/signout.spec.ts
import { test, expect } from '@playwright/test';

test('User can sign in and then sign out (UI-driven)', async ({ page }) => {
  await page.goto('https://meal4v.vercel.app/login');

  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');

  // Click login and wait for the login API to succeed (reduces flakiness)
  const [,] = await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/auth/login') && r.status() === 200),
    page.click('[data-testid="login-button"]'),
  ]);

  // ✅ Prove we’re on dashboard before touching logout
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible({ timeout: 10000 });

  // 🛠️ First fix: explicit wait + debug capture if missing
  await page
    .waitForSelector('[data-testid="logout-button"]', { timeout: 10000 })
    .catch(async () => {
      await page.screenshot({ path: 'logout-missing.png', fullPage: true });
      const html = await page.content();
      console.log('DEBUG HTML:', html.slice(0, 2000));
      throw new Error('logout-button not present on dashboard');
    });

  await page.click('[data-testid="logout-button"]');

  // Redirect to login must occur
  await page.waitForURL('**/login', { timeout: 15000 });
  await expect(page.locator('[data-testid="login-button"]')).toBeVisible({ timeout: 10000 });
});
