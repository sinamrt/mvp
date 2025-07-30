import { test, expect } from '@playwright/test';

test.describe('Basic Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load and hydration to complete
    await page.waitForLoadState('networkidle');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('p:has-text("Loading...")', { state: 'hidden', timeout: 10000 });
  });

  // 1. Homepage Load Test
  test('should load homepage successfully', async ({ page }) => {
    // Wait for the actual content to load
    await page.waitForSelector('h1.header-logo', { timeout: 10000 });
    await expect(page.locator('h1.header-logo')).toContainText('MEALS4V');
  });

  // 2. Navigation Test - Updated to match actual structure
  test('should navigate to register page', async ({ page }) => {
    // Wait for the actual content to load
    await page.waitForSelector('a[href="/register"]', { timeout: 10000 });
    await expect(page.locator('a[href="/register"]')).toBeVisible();
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
  });

  // 3. Registration Form Test
  test('should display registration form', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    await expect(page.locator('h1.form-title')).toContainText('Create Your Account');
    await expect(page.locator('[data-testid="name"]')).toBeVisible();
    await expect(page.locator('[data-testid="email"]')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password"]')).toBeVisible();
  });

  // 4. Form Validation Test
  test('should validate required fields', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Try to submit empty form
    await page.click('[data-testid="register-button"]');
    
    // Check for HTML5 validation messages
    const nameInput = page.locator('[data-testid="name"]');
    const emailInput = page.locator('[data-testid="email"]');
    const passwordInput = page.locator('[data-testid="password"]');
    
    // Wait a bit for validation to trigger
    await page.waitForTimeout(1000);
    
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
  });

  // 5. Password Mismatch Test - Updated to check DOM error message
  test('should show error for password mismatch', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Fill form with mismatched passwords
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'Password123!');
    await page.fill('[data-testid="confirm-password"]', 'DifferentPassword123!');
    
    // Submit form
    await page.click('[data-testid="register-button"]');
    
    // Check for DOM error message instead of alert
    await expect(page.locator('[data-testid="password-match-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-match-error"]')).toContainText('Passwords do not match');
  });

  // 6. Email Validation Test
  test('should validate email format', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Enter invalid email
    await page.fill('[data-testid="email"]', 'invalid-email');
    
    // Check for email validation error
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Please enter a valid email address');
  });

  // 7. Password Strength Test
  test('should show password strength indicator', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Enter weak password
    await page.fill('[data-testid="password"]', 'weak');
    
    // Check for password strength indicator
    await expect(page.locator('[data-testid="password-strength"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-strength"]')).toContainText('weak');
  });

  // 8. Password Requirements Test
  test('should show password requirements', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Check that password requirements are visible
    await expect(page.locator('[data-testid="password-requirements"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-requirements"]')).toContainText('Password must:');
  });

  // 9. OAuth Buttons Test
  test('should display OAuth buttons', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Check for OAuth buttons
    await expect(page.locator('[data-testid="oauth-btn-google"]')).toBeVisible();
    await expect(page.locator('[data-testid="oauth-btn-github"]')).toBeVisible();
  });

  // 10. Loading State Test
  test('should show loading state during submission', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Fill form with valid data
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'Password123!');
    await page.fill('[data-testid="confirm-password"]', 'Password123!');
    
    // Submit form
    await page.click('[data-testid="register-button"]');
    
    // Check for loading spinner
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  // 11. Navigation Links Test
  test('should have working navigation links', async ({ page }) => {
    // Wait for the actual content to load
    await page.waitForSelector('nav.header-nav', { timeout: 10000 });
    
    // Check for navigation links in header
    await expect(page.locator('a[href="#features"]')).toBeVisible();
    await expect(page.locator('a[href="#how-it-works"]')).toBeVisible();
    await expect(page.locator('a[href="#pricing"]')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toBeVisible();
  });

  // 12. Authentication Status Test
  test('should show authentication status', async ({ page }) => {
    // Wait for the actual content to load
    await page.waitForSelector('.auth-status-content', { timeout: 10000 });
    
    // Check for auth status component
    await expect(page.locator('.auth-status-content')).toBeVisible();
    
    // Should show sign in button when not authenticated
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  // 13. Footer Links Test
  test('should have working footer links', async ({ page }) => {
    // Wait for the actual content to load
    await page.waitForSelector('footer.landing-footer', { timeout: 10000 });
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for footer links
    await expect(page.locator('a[href="/diet-form"]')).toBeVisible();
    await expect(page.locator('a[href="/admin"]')).toBeVisible();
  });

  // 14. Responsive Design Test
  test('should be responsive', async ({ page }) => {
    // Wait for the actual content to load
    await page.waitForSelector('h1.header-logo', { timeout: 10000 });
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that elements are still visible
    await expect(page.locator('h1.header-logo')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  // 15. Accessibility Test
  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/register');
    // Wait for the loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 });
    
    // Check for proper labels
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    
    // Check for aria-invalid attributes
    const nameInput = page.locator('[data-testid="name"]');
    await expect(nameInput).toHaveAttribute('aria-invalid');
  });
}); 