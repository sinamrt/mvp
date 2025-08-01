import { test, expect } from '@playwright/test';

test.describe('Authentication Flow - High Priority Test Cases (TC012, TC016, TC017, TC020, TC021)', () => {
  function uniqueEmail() {
    return `test.user.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;
  }

  // TC012: Registration Success Redirect with Authentication
  test('TC012: should redirect and authenticate after successful registration', async ({ page }) => {
    await page.goto('/register');
    const email = uniqueEmail();

    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    await page.click('[data-testid="register-button"]');

    // Wait for redirect
    await expect(page).toHaveURL('/diet-form', { timeout: 10000 });

    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();

    await page.goto('/diet-form');
    await expect(page.locator('h1:has-text("Diet Onboarding Form")')).toBeVisible();
  });

  // TC016: Sign In Button Functionality
  // TC016: Sign In Button Functionality
test('TC016: should handle sign in button functionality', async ({ page }) => {
  await page.goto('/');

  // Check sign in button is visible
  const signInButton = page.locator('button:has-text("Sign In")');
  await expect(signInButton).toBeVisible();

  // Click the sign in button
  await signInButton.click();

  // Wait for potential modal or redirect
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500); // small buffer

  // Check for expected outcomes
  const modalLocator = page.locator('[role="dialog"], .modal, .signin-modal');
  const hasModal = await modalLocator.isVisible().catch(() => false);
  const currentUrl = page.url();
  const isRedirected = currentUrl.includes('/login') || currentUrl.includes('/signin') || currentUrl.includes('next-auth');

  // Ensure at least one expected outcome is true
  expect(hasModal || isRedirected).toBe(true);
});

  // TC017: Sign Out Button Functionality
  test('TC017: should handle sign out button functionality', async ({ page }) => {
    const email = uniqueEmail();
  
    // Register user
    await page.goto('/register');
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    await page.click('[data-testid="register-button"]');
    await expect(page).toHaveURL('/diet-form', { timeout: 10000 });
  
    // Go to homepage and ensure user is signed in
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  
    // Perform sign out
    await page.click('button:has-text("Sign Out")');
  
    // Poll for unauthenticated indicators
    await expect.poll(async () => {
      const url = page.url();
      const redirected = url.includes('/login') || url.includes('/register');
  
      const unauthMsgVisible = await page
        .locator('p:has-text("must be signed in"), h2:has-text("unauthorized"), .auth-status-content:has-text("Sign In")')
        .isVisible()
        .catch(() => false);
  
      return redirected || unauthMsgVisible;
    }, {
      timeout: 8000,
      message: '❌ Did not redirect or show unauthenticated message after sign out',
    }).toBe(true);
  });
  

  // TC020: Authentication Error Page Functionality
  test('TC020: should display correct error messages on authentication error page', async ({ page }) => {
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

      await expect(page.locator('[data-testid="error-message"]')).toContainText(expectedMessage);
      await expect(page.locator('h2:has-text("Authentication Error")')).toBeVisible();
      await expect(page.locator('a:has-text("Back to Registration")')).toBeVisible();
    }
  });

  test('TC021: should handle network errors gracefully during authentication', async ({ page, context }) => {
    // Step 1: Go to registration page
    await page.goto('/register');
    const email = uniqueEmail();
  
    // Step 2: Fill in registration form
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
  
    // Step 3: Simulate offline network
    await context.setOffline(true);
  
    // Step 4: Attempt to submit the form while offline
    await page.click('[data-testid="register-button"]');
    await page.waitForTimeout(1000); // give UI time to respond offline
  
    // Step 5: Poll for fallback UI or error page
    const fallbackAppeared = await expect
      .poll(async () => {
        const isOnErrorPage = page.url().includes('/auth/error');
        const fallbackVisible = await page
          .locator(
            '[data-testid="network-error"], [data-testid="error-message"], h2:has-text("Authentication Error")'
          )
          .isVisible()
          .catch(() => false);
  
        console.log(`[DEBUG] URL: ${page.url()}, Fallback visible: ${fallbackVisible}`);
        return isOnErrorPage || fallbackVisible;
      }, {
        timeout: 8000,
        message: '❌ Neither fallback UI nor error page appeared during simulated network failure.',
      });
      
    // Step 5: Poll for fallback UI or error page
    // Step 5: Poll for fallback UI or error page
await expect
.poll(async () => {
  const isOnErrorPage = page.url().includes('/auth/error');
  const fallbackVisible = await page
    .locator('[data-testid="network-error"], [data-testid="error-message"], h2:has-text("Authentication Error")')
    .isVisible()
    .catch(() => false);

  console.log(`[DEBUG] URL: ${page.url()}, Fallback visible: ${fallbackVisible}`);
  return isOnErrorPage || fallbackVisible;
}, {
  timeout: 6000,
  message: '❌ Neither fallback UI nor error page appeared during simulated network failure.',
})
.toBe(true);


      // Step 6: Assert result
      expect(fallbackAppeared).toBe(true);
    
    // Step 7: Restore network
    await context.setOffline(false);
    await page.goto('/register');
  
    // Step 8: Retry registration
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', email);
    await page.fill('[data-testid="password"]', 'SecureTestPass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecureTestPass123!');
    await page.click('[data-testid="register-button"]');
  
    // Step 9: Verify success
    await expect(page).toHaveURL('/diet-form', { timeout: 10000 });
    await page.goto('/');
    await expect(page.locator('.auth-status-content')).toContainText(email);
  });
  
  
  
  
  
  
  
  


});
