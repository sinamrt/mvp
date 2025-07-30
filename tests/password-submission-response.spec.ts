import { test, expect, Page } from '@playwright/test';

// Test data generator
const generateTestUser = () => ({
  email: `test.${Date.now()}@example.com`,
  password: 'TestPass123!',
  name: 'Test User'
});

test.describe('Password, Submission, and Response Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    // Wait for form to be ready
    await page.waitForSelector('form', { state: 'visible' });
  });

  // Password Tests
  test.describe('Password Validation', () => {
    test('should validate password requirements', async ({ page }) => {
      const requirements = [
        { password: '1234', error: 'at least 8 characters' },
        { password: 'password', error: 'uppercase letter' },
        { password: 'Password', error: 'number' },
        { password: 'Password1', error: 'special character' }
      ];

      for (const { password, error } of requirements) {
        await page.fill('#password', password);
        await page.locator('#password').blur();
        const requirementItem = page.locator('[data-testid="password-requirements"] li', { hasText: error });
        await expect(requirementItem).not.toHaveClass(/met/);
      }

      // Test valid password
      await page.fill('#password', 'TestPass123!');
      await page.locator('#password').blur();
      const allRequirements = await page.locator('[data-testid="password-requirements"] li').all();
      for (const req of allRequirements) {
        await expect(req).toHaveClass(/met/);
      }
    });
  });

  // Form Submission Tests
  test.describe('Form Submission', () => {
    test('should reset form after successful submission', async ({ page }) => {
      const user = generateTestUser();

      // Fill form
      await page.fill('#name', user.name);
      await page.fill('#email', user.email);
      await page.fill('#password', user.password);
      await page.fill('#confirmPassword', user.password);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 2000 });

      // Wait for navigation
      await page.waitForURL('/diet-form');

      // Go back and verify form reset
      await page.goto('/register');
      await expect(page.locator('#name')).toHaveValue('');
      await expect(page.locator('#email')).toHaveValue('');
      await expect(page.locator('#password')).toHaveValue('');
    });
  });

  // Response Handling Tests
  test.describe('Response Handling', () => {
    test('should handle server errors', async ({ page }) => {
      const user = generateTestUser();

      // Fill form with existing user data
      await page.fill('#name', user.name);
      await page.fill('#email', 'existing@example.com');
      await page.fill('#password', user.password);
      await page.fill('#confirmPassword', user.password);

      // Submit form and wait for error page
      await Promise.all([
        page.waitForURL('**/auth/error?error=EmailExists'),
        page.click('button[type="submit"]')
      ]);

      // Wait for page to load and check error message
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/email.*exists/i);
    });

    test('should handle network errors', async ({ page, context }) => {
      // Simulate offline mode
      await context.setOffline(true);

      const user = generateTestUser();
      await page.fill('#name', user.name);
      await page.fill('#email', user.email);
      await page.fill('#password', user.password);
      await page.fill('#confirmPassword', user.password);

      // Submit form and wait for error page
      await Promise.all([
        page.waitForURL('**/auth/error?error=NetworkError'),
        page.click('button[type="submit"]')
      ]);

      // Wait for page to load and check error message
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/network/i);

      // Reset offline mode
      await context.setOffline(false);
    });
  });

  // Edge Cases
  test.describe('Edge Cases', () => {
    test('should handle very long inputs', async ({ page }) => {
      const longString = 'a'.repeat(256);
      await page.fill('#name', longString);
      await page.fill('#email', `test.${Date.now()}@example.com`);
      await page.fill('#password', 'ValidPass123!');
      await page.fill('#confirmPassword', 'ValidPass123!');

      // Name should be truncated to maxLength
      await expect(page.locator('#name')).toHaveValue(longString.substring(0, 100));
    });
  });

  // Error States
  test.describe('Error States', () => {
    test('should handle server validation errors', async ({ page }) => {
      const user = generateTestUser();
      await page.fill('#name', user.name);
      await page.fill('#email', user.email);
      await page.fill('#password', '12345'); // Invalid password
      await page.fill('#confirmPassword', '12345');

      // Submit form and wait for error page
      await Promise.all([
        page.waitForURL('**/auth/error?error=WeakPassword'),
        page.click('button[type="submit"]')
      ]);

      // Wait for page to load and check error message
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/password.*weak/i);
    });
  });

  // Accessibility Tests
  test.describe('Accessibility', () => {
    test('should handle keyboard navigation', async ({ page }) => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      await expect(page.locator('#name')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('#email')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('#password')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('#confirmPassword')).toBeFocused();
    });

    test('should announce form errors to screen readers', async ({ page }) => {
      // Submit empty form to trigger HTML5 validation
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) form.reportValidity();
      });
      
      // Check for ARIA attributes
      await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#password')).toHaveAttribute('aria-invalid', 'true');
    });
  });
}); 