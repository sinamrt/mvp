import { test, expect } from '@playwright/test';

test.describe('Basic Comprehensive Test - Core Functionality', () => {
  let testUser: { email: string; password: string; name: string };

  test.beforeEach(async ({ page }) => {
    // Generate unique test data
    const timestamp = Date.now();
    testUser = {
      email: `test.user.${timestamp}@example.com`,
      password: 'SecureTestPass123!',
      name: 'Test User'
    };
  });

  test('Core Application Flow - Registration → Authentication → Basic Navigation', async ({ page }) => {
    
    // ========================================
    // PHASE 1: BASIC NAVIGATION & AUTH STATUS
    // ========================================
    
    // 1.1 Test homepage loads
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1.header-logo')).toContainText('MEALS4V');
    
    // 1.2 Test AuthStatus component on homepage
    await expect(page.locator('.auth-status-content')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    
    // 1.3 Test navigation to register page
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
    
    // ========================================
    // PHASE 2: USER REGISTRATION
    // ========================================
    
    // 2.1 Test registration form
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1.form-title')).toContainText('Create Your Account');
    await expect(page.locator('[data-testid="name"]')).toBeVisible();
    await expect(page.locator('[data-testid="email"]')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toBeVisible();
    
    // 2.2 Fill and submit registration form
    await page.fill('[data-testid="name"]', testUser.name);
    await page.fill('[data-testid="email"]', testUser.email);
    await page.fill('[data-testid="password"]', testUser.password);
    await page.fill('[data-testid="confirm-password"]', testUser.password);
    await page.click('[data-testid="register-button"]');
    
    // 2.3 Verify successful registration redirects to diet-form
    await expect(page).toHaveURL('/diet-form');
    
    // ========================================
    // PHASE 3: AUTHENTICATION VERIFICATION
    // ========================================
    
    // 3.1 Go back to homepage to check authentication status
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 3.2 Verify user is authenticated
    await expect(page.locator('.auth-status-content')).toContainText(testUser.email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
    
    // ========================================
    // PHASE 4: AUTHORIZATION TESTING
    // ========================================
    
    // 4.1 Test admin page access (should be denied for regular user)
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('p:has-text("Access denied. Admins only.")')).toBeVisible();
    
    // 4.2 Test diet form access (should be allowed)
    await page.goto('/diet-form');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("Diet Onboarding Form")')).toBeVisible();
    
    // ========================================
    // PHASE 5: BASIC FORM FUNCTIONALITY
    // ========================================
    
    // 5.1 Test diet type selection
    await page.selectOption('select', 'vegan');
    await expect(page.locator('select')).toHaveValue('vegan');
    
    // 5.2 Test localStorage persistence
    const formData = await page.evaluate(() => {
      return localStorage.getItem('dietFormData');
    });
    expect(formData).not.toBeNull();
    
    // ========================================
    // PHASE 6: API INTEGRATION
    // ========================================
    
    // 6.1 Test database connectivity
    const dbResponse = await page.request.get('/api/test-db');
    expect(dbResponse.status()).toBe(200);
    const dbData = await dbResponse.json();
    expect(dbData.message).toContain('Connected');
    
    // ========================================
    // PHASE 7: ERROR HANDLING
    // ========================================
    
    // 7.1 Test authentication error page
    await page.goto('/auth/error?error=CredentialsSignin');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid email or password');
    
    // 7.2 Test form validation
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="register-button"]');
    await expect(page.locator('[data-testid="name"]')).toHaveAttribute('aria-invalid', 'true');
    
    // ========================================
    // PHASE 8: SIGN OUT FUNCTIONALITY
    // ========================================
    
    // 8.1 Go back to homepage and sign out
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Sign Out")');
    await page.waitForLoadState('networkidle');
    
    // 8.2 Verify user is signed out
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('Component Testing - AuthStatus States', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test unauthenticated state
    await expect(page.locator('.auth-status-content')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    
    // Test authenticated state after registration
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.fill('[data-testid="name"]', testUser.name);
    await page.fill('[data-testid="email"]', testUser.email);
    await page.fill('[data-testid="password"]', testUser.password);
    await page.fill('[data-testid="confirm-password"]', testUser.password);
    await page.click('[data-testid="register-button"]');
    
    // Go to homepage to check auth status
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.auth-status-content')).toContainText(testUser.email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });

  test('Component Testing - DietFormClient Basic Functionality', async ({ page }) => {
    await page.goto('/diet-form');
    await page.waitForLoadState('networkidle');
    
    // Test form loads
    await expect(page.locator('h1:has-text("Diet Onboarding Form")')).toBeVisible();
    
    // Test diet type selection
    await page.selectOption('select', 'vegetarian');
    await expect(page.locator('select')).toHaveValue('vegetarian');
    
    // Test localStorage has data
    const formData = await page.evaluate(() => {
      return localStorage.getItem('dietFormData');
    });
    expect(formData).not.toBeNull();
    
    // Test form persistence on reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('select')).toHaveValue('vegetarian');
  });
}); 