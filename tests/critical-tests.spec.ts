import { test, expect } from '@playwright/test';

// Test data generator
const generateTestUser = (overrides = {}) => ({
  email: `test.${Date.now()}@example.com`,
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  firstName: 'Test',
  lastName: 'User',
  ...overrides
});

test.describe('Critical Path Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 1. Basic Navigation
  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  // 2. Registration Form Access
  test('should navigate to registration page', async ({ page }) => {
    await page.click('[data-testid="register-link"]');
    await expect(page).toHaveURL('/register');
  });

  // 3. Basic Registration
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    const user = generateTestUser();
    
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
    await page.check('[data-testid="terms-checkbox"]');
    
    await page.click('[data-testid="register-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  // 4. Login Flow
  test('should login registered user', async ({ page }) => {
    const user = generateTestUser();
    
    // Register first
    await page.goto('/register');
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
    await page.check('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="register-button"]');
    
    // Logout
    await page.click('[data-testid="logout-button"]');
    
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  // 5. Form Validation
  test('should show validation errors', async ({ page }) => {
    await page.goto('/register');
    await page.click('[data-testid="register-button"]');
    
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
  });

  // 6. Password Strength
  test('should validate password strength', async ({ page }) => {
    await page.goto('/register');
    await page.fill('[data-testid="password"]', 'weak');
    
    await expect(page.locator('[data-testid="password-strength"]')).toContainText('weak');
  });

  // 7. Duplicate Email
  test('should prevent duplicate email registration', async ({ page }) => {
    const user = generateTestUser();
    
    // First registration
    await page.goto('/register');
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
    await page.check('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="register-button"]');
    
    // Logout
    await page.click('[data-testid="logout-button"]');
    
    // Try registering again with same email
    await page.goto('/register');
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
    await page.check('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="register-button"]');
    
    await expect(page.locator('[data-testid="email-error"]')).toContainText('already exists');
  });

  // 8. Password Match
  test('should validate password match', async ({ page }) => {
    await page.goto('/register');
    await page.fill('[data-testid="password"]', 'Password123!');
    await page.fill('[data-testid="confirm-password"]', 'DifferentPass123!');
    
    await expect(page.locator('[data-testid="password-match-error"]')).toBeVisible();
  });

  // 9. Terms Checkbox
  test('should require terms acceptance', async ({ page }) => {
    await page.goto('/register');
    const user = generateTestUser();
    
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
    // Don't check terms checkbox
    
    await page.click('[data-testid="register-button"]');
    await expect(page.locator('[data-testid="terms-error"]')).toBeVisible();
  });

  // 10. Loading State
  test('should show loading state', async ({ page }) => {
    await page.goto('/register');
    const user = generateTestUser();
    
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
    await page.check('[data-testid="terms-checkbox"]');
    
    await page.click('[data-testid="register-button"]');
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });
}); 