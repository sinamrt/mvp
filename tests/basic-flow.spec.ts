import { test, expect, Page } from '@playwright/test';

// Test data generator
const generateTestUser = () => ({
  email: `test.${Date.now()}@example.com`,
  password: 'TestPass123!',
  name: 'Test User'
});

test.describe('Basic Application Flow', () => {
  // Remove the global alert handler from beforeEach
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  // 1. Homepage Test
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  // 2. Navigation Test
  test('should navigate to login page', async ({ page }) => {
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
  });

  // 3. Registration Form Fields
  test('should have all registration form fields', async ({ page }) => {
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  // 4. Basic Form Submission
  test('should submit registration form', async ({ page }) => {
    const user = generateTestUser();
    
    // Set up dialog handler before form interaction
    page.once('dialog', dialog => dialog.dismiss());
    
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.fill('#confirmPassword', user.password);
    
    // Click submit and handle possible redirects
    await page.click('button[type="submit"]');

    // Wait for navigation
    try {
      await page.waitForURL((url) => {
        return url.pathname === '/diet-form' || url.pathname.includes('/api/auth/error');
      }, { timeout: 30000 });

      const currentUrl = page.url();
      if (currentUrl.includes('error')) {
        const errorMessage = await page.textContent('body');
        throw new Error(`Registration failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      throw error;
    }
  });

  // 5. Password Mismatch
  test('should show alert for password mismatch', async ({ page }) => {
    let dialogShown = false;
    let dialogMessage = '';

    // Set up single dialog handler
    page.once('dialog', dialog => {
      dialogShown = true;
      dialogMessage = dialog.message();
      dialog.dismiss();
    });

    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'different123');
    await page.click('button[type="submit"]');

    // Verify dialog was shown with correct message
    expect(dialogShown).toBe(true);
    expect(dialogMessage).toContain("Passwords don't match");
  });

  // 6. Required Fields
  test('should require all mandatory fields', async ({ page }) => {
    // Try submitting empty form
    await page.click('button[type="submit"]');
    
    // Check HTML5 validation
    const emailInput = page.locator('#email');
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  // 7. Email Format
  test('should validate email format', async ({ page }) => {
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'invalid-email');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    
    // Check HTML5 validation
    const emailInput = page.locator('#email');
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  // 8. Successful Registration
  test('should redirect after successful registration', async ({ page }) => {
    const user = generateTestUser();
    
    // Set up dialog handler before form interaction
    page.once('dialog', dialog => dialog.dismiss());
    
    await page.fill('#name', user.name);
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.fill('#confirmPassword', user.password);
    
    // Click submit and wait for navigation
    await page.click('button[type="submit"]');

    // Wait and verify navigation
    try {
      await page.waitForURL((url) => {
        return url.pathname === '/diet-form' || url.pathname.includes('/api/auth/error');
      }, { timeout: 30000 });

      const currentUrl = page.url();
      if (currentUrl.includes('error')) {
        const errorMessage = await page.textContent('body');
        throw new Error(`Registration failed: ${errorMessage}`);
      }

      // Verify we reached the success page
      expect(currentUrl).toContain('/diet-form');
    } catch (error) {
      console.error('Navigation error:', error);
      throw error;
    }
  });

  // 9. OAuth Buttons
  test('should have OAuth login options', async ({ page }) => {
    await expect(page.locator('.oauth-btn-google')).toBeVisible();
    await expect(page.locator('.oauth-btn-github')).toBeVisible();
  });

  // 10. Login Link
  test('should have login link', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /sign in/i });
    await expect(loginLink).toBeVisible();
    expect(await loginLink.getAttribute('href')).toBe('/login');
  });
}); 