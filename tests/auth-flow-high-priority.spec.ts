import { test, expect } from '@playwright/test';

test.describe('Authentication Flow - High Priority Test Cases (TC012, TC016, TC017, TC020, TC021)', () => {
  // Helper to generate a unique email
  function uniqueEmail() {
    return `test.user.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;
  }

  // TC012: Registration Success Redirect with Authentication
  test('TC012: should redirect and authenticate after successful registration', async ({ page }) => {
    await page.goto('/register');
    const email = uniqueEmail();
    
    // Fill registration form
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    
    // Submit registration
    await page.click('[data-testid="register-button"]');
    
    // Verify redirect to diet-form (successful registration)
    await expect(page).toHaveURL('/diet-form');
    
    // Verify user is authenticated by checking homepage
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
    
    // Verify user can access protected content
    await page.goto('/diet-form');
    await expect(page.locator('h1:has-text("Diet Onboarding Form")')).toBeVisible();
  });

  // TC016: Sign In Button Functionality
  test('TC016: should handle sign in button functionality', async ({ page }) => {
    await page.goto('/');
    
    // Verify sign in button is visible for unauthenticated users
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    
    // Click sign in button
    await page.click('button:has-text("Sign In")');
    
    // Should either open a modal, redirect to login page, or trigger NextAuth signIn
    // Check if we're redirected or if a modal appears
    const currentUrl = page.url();
    const hasModal = await page.locator('[role="dialog"], .modal, .signin-modal').isVisible();
    const isRedirected = currentUrl.includes('/login') || currentUrl.includes('/signin');
    
    // At least one of these should be true
    expect(hasModal || isRedirected || currentUrl.includes('next-auth')).toBe(true);
  });

  // TC017: Sign Out Button Functionality
  test('TC017: should handle sign out button functionality', async ({ page }) => {
    // First register and authenticate a user
    await page.goto('/register');
    const email = uniqueEmail();
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    await page.click('[data-testid="register-button"]');
    
    // Go to homepage and verify user is authenticated
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
    
    // Click sign out button
    await page.click('button:has-text("Sign Out")');
    
    // Verify user is signed out
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    await expect(page.locator('.auth-status-content')).not.toContainText(email);
    
    // Verify user cannot access protected content
    await page.goto('/diet-form');
    // Should either redirect to sign in or show unauthenticated message
    const currentUrl = page.url();
    const isRedirectedToSignIn = currentUrl.includes('/login') || currentUrl.includes('/register');
    const showsUnauthenticatedMessage = await page.locator('p:has-text("must be signed in")').isVisible();
    
    expect(isRedirectedToSignIn || showsUnauthenticatedMessage).toBe(true);
  });

  // TC020: Authentication Error Page Functionality
  test('TC020: should display correct error messages on authentication error page', async ({ page }) => {
    // Test different error types
    const errorTests = [
      { error: 'CredentialsSignin', expectedMessage: 'Invalid email or password' },
      { error: 'EmailExists', expectedMessage: 'Email already exists' },
      { error: 'WeakPassword', expectedMessage: 'Password is too weak' },
      { error: 'RequiredFields', expectedMessage: 'All fields are required' },
      { error: 'NetworkError', expectedMessage: 'Network error occurred' }
    ];
    
    for (const { error, expectedMessage } of errorTests) {
      await page.goto(`/auth/error?error=${error}`);
      await page.waitForLoadState('networkidle');
      
      // Verify error message is displayed
      await expect(page.locator('[data-testid="error-message"]')).toContainText(expectedMessage);
      
      // Verify error page structure
      await expect(page.locator('h2:has-text("Authentication Error")')).toBeVisible();
      await expect(page.locator('a:has-text("Back to Registration")')).toBeVisible();
    }
  });

  // TC021: Network Error Handling During Authentication
  test('TC021: should handle network errors gracefully during authentication', async ({ page, context }) => {
    await page.goto('/register');
    const email = uniqueEmail();
    
    // Fill registration form
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    
    // Simulate network error by going offline
    await context.setOffline(true);
    
    // Try to submit registration
    await page.click('[data-testid="register-button"]');
    
    // Should show network error message
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="network-error"]')).toContainText('Network error');
    
    // Go back online
    await context.setOffline(false);
    
    // Try registration again - should work now
    await page.click('[data-testid="register-button"]');
    
    // Should succeed and redirect
    await expect(page).toHaveURL('/diet-form');
    
    // Verify user is authenticated
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
  });

  // Additional test: Error Recovery After Network Issues
  test('TC021b: should recover from network errors and allow successful authentication', async ({ page, context }) => {
    await page.goto('/register');
    const email = uniqueEmail();
    
    // Fill form
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    
    // Go offline, submit, see error
    await context.setOffline(true);
    await page.click('[data-testid="register-button"]');
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    
    // Go online, retry
    await context.setOffline(false);
    await page.click('[data-testid="register-button"]');
    
    // Should succeed
    await expect(page).toHaveURL('/diet-form');
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
  });
}); 