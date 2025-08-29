import { test, expect } from '@playwright/test';

// This test validates that the Google OAuth authorization request contains
// the correct redirect_uri built from NEXTAUTH_URL.
// It intercepts the outbound request and aborts it to avoid external network calls.

const expectedRedirect = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`;

test.describe('Google OAuth redirect URI', () => {
  test('has correct redirect_uri in Google auth request', async ({ page }) => {
    let sawAuthRequest = false;
    let observedRedirect: string | null = null;

    await page.route('https://accounts.google.com/**', async (route) => {
      const url = new URL(route.request().url());
      // Handle both /o/oauth2/v2/auth and legacy /o/oauth2/auth
      if (url.pathname.includes('/o/oauth2')) {
        sawAuthRequest = true;
        observedRedirect = url.searchParams.get('redirect_uri');

        // Assert immediately for clearer, localized failure
        expect(observedRedirect, 'Google redirect_uri param').toBe(expectedRedirect);

        // Block network call to keep test fast/offline
        await route.abort('blockedbyclient');
        return;
      }
      // Block any other calls to accounts.google.com as well
      await route.abort('blockedbyclient');
    });

    // Navigate to the login page and trigger Google sign-in
    await page.goto('/login');
    await page.click('[data-testid="oauth-google"]');

    // Ensure we saw the OAuth request
    await expect
      .poll(() => sawAuthRequest, { timeout: 4000, message: 'Did not see Google OAuth request' })
      .toBe(true);

    // Extra safety: if assertion above didn't run due to path mismatch, surface details
    if (!observedRedirect && sawAuthRequest) {
      throw new Error('Observed Google OAuth request but did not find redirect_uri parameter.');
    }
  });
});

