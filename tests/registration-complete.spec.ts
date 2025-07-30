import { test, expect, Page } from '@playwright/test';

// Test data generator
const generateTestUser = () => ({
  email: `test.${Date.now()}@example.com`,
  password: 'TestPass123!',
  name: 'Test User'
});

test.describe('Complete Registration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  // 1. Basic Registration Flow
  test('should complete full registration process', async ({ page }) => {
    const user = generateTestUser();
    
    // Fill form
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.fill('#confirmPassword', user.password);
    
    // Handle alert/dialog if shown
    page.once('dialog', dialog => dialog.dismiss());
    
    // Submit and verify redirect
    await page.click('button[type="submit"]');
    await page.waitForURL('/diet-form');
    
    // Verify successful registration
    await expect(page).toHaveURL('/diet-form');
  });

  // 2. Form Field Validation
  test('should validate all form fields properly', async ({ page }) => {
    // Check required field indicators
    await expect(page.locator('label:has-text("Name")'))
      .toHaveClass(/required/);
    await expect(page.locator('label:has-text("Email")'))
      .toHaveClass(/required/);
    await expect(page.locator('label:has-text("Password")'))
      .toHaveClass(/required/);

    // Check placeholders
    await expect(page.locator('#email'))
      .toHaveAttribute('placeholder', expect.stringContaining('email'));
    await expect(page.locator('#password'))
      .toHaveAttribute('placeholder', expect.stringContaining('password'));
  });

  // 3. Password Validation
  test('should enforce password requirements', async ({ page }) => {
    const testCases = [
      { password: '12345', expected: false },
      { password: 'password', expected: false },
      { password: 'Password123!', expected: true }
    ];

    for (const { password, expected } of testCases) {
      await page.fill('#password', password);
      await page.fill('#confirmPassword', password);
      
      const submitButton = page.locator('button[type="submit"]');
      const isEnabled = await submitButton.isEnabled();
      expect(isEnabled).toBe(expected);
    }
  });

  // 4. Error Handling
  test('should handle registration errors properly', async ({ page }) => {
    // Test duplicate email
    const user = generateTestUser();
    
    // First registration
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.fill('#confirmPassword', user.password);
    await page.click('button[type="submit"]');
    
    // Try registering again with same email
    await page.goto('/register');
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.fill('#confirmPassword', user.password);
    
    // Should show error
    await page.click('button[type="submit"]');
    await expect(page.locator('text=email already exists')).toBeVisible();
  });

  // 5. Navigation Handling
  test('should handle navigation properly', async ({ page }) => {
    // Fill form partially
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    
    // Navigate away
    await page.goto('/');
    
    // Navigate back
    await page.goto('/register');
    
    // Form should be clear (not persisted)
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
  });

  // 6. OAuth Options
  test('should display OAuth alternatives', async ({ page }) => {
    await expect(page.locator('.oauth-btn-google')).toBeVisible();
    await expect(page.locator('.oauth-btn-github')).toBeVisible();
    
    // Verify OAuth buttons are clickable
    await expect(page.locator('.oauth-btn-google')).toBeEnabled();
    await expect(page.locator('.oauth-btn-github')).toBeEnabled();
  });

  // 7. Accessibility
  test('should be accessible', async ({ page }) => {
    // Check form labels
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    
    // Check ARIA attributes
    await expect(page.locator('form')).toHaveAttribute('role', 'form');
    await expect(page.locator('#email')).toHaveAttribute('aria-required', 'true');
  });

  // 8. Mobile Responsiveness
  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('form')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('form')).toBeVisible();
  });

  // 9. Form State
  test('should manage form state correctly', async ({ page }) => {
    const user = generateTestUser();
    
    // Fill form
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    
    // Clear fields
    await page.locator('#name').clear();
    await page.locator('#email').clear();
    
    // Fields should be empty
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
  });

  // 10. Security Checks
  test('should handle security aspects', async ({ page }) => {
    // Password field should be type="password"
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    await expect(page.locator('#confirmPassword')).toHaveAttribute('type', 'password');
    
    // Form should have CSRF token if implemented
    await expect(page.locator('input[name="csrf"]')).toBeVisible();
  });

  // Password Component Tests
  test('should handle password visibility toggle', async ({ page }) => {
    // Fill password field
    await page.fill('#password', 'TestPass123!');
    
    // Check initial type is password (hidden)
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    
    // Click show password button if exists
    const showPasswordButton = page.locator('[data-testid="show-password"]');
    if (await showPasswordButton.isVisible()) {
      await showPasswordButton.click();
      await expect(page.locator('#password')).toHaveAttribute('type', 'text');
      
      // Click again to hide
      await showPasswordButton.click();
      await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    }
  });

  test('should show password strength indicator', async ({ page }) => {
    // Test weak password
    await page.fill('#password', '12345');
    await expect(page.locator('[data-testid="password-strength"]'))
      .toContainText(/weak|poor/i);

    // Test medium password
    await page.fill('#password', 'Password123');
    await expect(page.locator('[data-testid="password-strength"]'))
      .toContainText(/medium|moderate/i);

    // Test strong password
    await page.fill('#password', 'StrongP@ss123!');
    await expect(page.locator('[data-testid="password-strength"]'))
      .toContainText(/strong/i);
  });

  test('should display password requirements', async ({ page }) => {
    await page.focus('#password');
    
    // Check if requirements are shown
    const requirements = page.locator('[data-testid="password-requirements"]');
    await expect(requirements).toBeVisible();
    
    // Verify all requirements are listed
    await expect(requirements).toContainText(/8 characters/i);
    await expect(requirements).toContainText(/uppercase/i);
    await expect(requirements).toContainText(/number/i);
    await expect(requirements).toContainText(/special character/i);
  });

  // Form Submission State Tests
  test('should handle form submission states', async ({ page }) => {
    const user = generateTestUser();
    
    // Fill form
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.fill('#confirmPassword', user.password);
    
    // Click submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(submitButton).toBeDisabled();
    
    // Wait for completion
    await page.waitForURL('/diet-form');
    
    // Verify form reset
    await page.goto('/register');
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
  });

  // Response Feedback Tests
  test('should display appropriate feedback messages', async ({ page }) => {
    const user = generateTestUser();
    
    // Test success message
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.fill('#confirmPassword', user.password);
    
    // Handle success/error messages
    page.once('dialog', dialog => dialog.dismiss());
    
    await Promise.race([
      page.waitForSelector('[data-testid="success-message"]'),
      page.waitForSelector('[data-testid="error-message"]')
    ]);

    // Test validation feedback
    await page.fill('#email', 'invalid-email');
    await page.locator('#email').blur();
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText(/valid email/i);

    // Test real-time validation
    await page.fill('#password', '123');
    await expect(page.locator('[data-testid="password-error"]'))
      .toContainText(/requirements/i);
  });

  // International Email Support
  test('should accept valid international email formats', async ({ page }) => {
    const internationalEmails = [
      'user@domain.co.uk',
      'user@domain.com.au',
      'user.name+tag@domain.com',
      'user@subdomain.domain.co.jp'
    ];

    for (const email of internationalEmails) {
      await page.fill('#email', email);
      await page.locator('#email').blur();
      
      // Should not show error for valid emails
      const emailError = page.locator('[data-testid="email-error"]');
      await expect(emailError).not.toBeVisible();
    }
  });
}); 