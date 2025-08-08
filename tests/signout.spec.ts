// tests/signout.spec.ts

import { test, expect } from '@playwright/test';

test('User can sign in and then sign out', async ({ page }) => {
  await page.goto('https://meal4v.vercel.app/login');

  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="login-button"]');

  await page.waitForURL('**/dashboard');
  await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible();

  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('**/login');
  await expect(page).toHaveURL(/.*\/login/);
});
test('Session does not persist after sign out and reload', async ({ page }) => {
    await page.goto('https://meal4v.vercel.app/login');
  
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'SecurePass123!');
    await page.click('[data-testid="login-button"]');
  
    await page.waitForURL('**/dashboard');
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
  
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*\/login/);
  
    // 🔄 Try reloading — user should still be logged out
    await page.reload();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });
  test('Access to dashboard after logout is blocked', async ({ page }) => {
    await page.goto('https://meal4v.vercel.app/login');
  
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'SecurePass123!');
    await page.click('[data-testid="login-button"]');
  
    await page.waitForURL('**/dashboard');
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL('**/login');
  
    // 🚫 Try to access dashboard directly
    await page.goto('https://meal4v.vercel.app/dashboard');
  
    // ✅ Should redirect or show "not authorized"
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });
  