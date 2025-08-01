import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Fix - Critical Test Cases (TC001, TC002, TC007)', () => {
  // Helper to generate a unique email
  function uniqueEmail() {
    return `test.user.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;
  }

  // TC001: Session Token Creation After Registration (UI-based check)
  test('TC001: should authenticate user immediately after registration', async ({ page }) => {
    await page.goto('/register');
    const email = uniqueEmail();
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    await page.click('[data-testid="register-button"]');
    await expect(page).toHaveURL('/diet-form');
    // Check UI for authenticated state
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });

  // TC002: Session Persistence Across Navigation
  test('TC002: should persist session across navigation', async ({ page }) => {
    await page.goto('/register');
    const email = uniqueEmail();
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    await page.click('[data-testid="register-button"]');
    await expect(page).toHaveURL('/diet-form');
    // Navigate to homepage
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
    // Navigate to another page
    await page.goto('/admin');
    await expect(page.locator('p:has-text("Access denied. Admins only.")')).toBeVisible();
    // Back to homepage, still authenticated
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
  });

  // TC007: Authentication State After Registration
  test('TC007: should be authenticated immediately after registration', async ({ page }) => {
    await page.goto('/register');
    const email = uniqueEmail();
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    await page.click('[data-testid="register-button"]');
    await expect(page).toHaveURL('/diet-form');
    // Go to homepage and check authenticated state
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });
}); 