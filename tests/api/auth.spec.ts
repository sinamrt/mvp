// tests/api/auth.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');                 // uses baseURL from config
  // optional sanity check
  await expect(page).toHaveURL(/\/($|register|login)/);
});

test.describe('Auth API contract', () => {
  test('register + login flow', async ({ request }) => {
    // ... your API calls via `request.post('/api/...')`
  });
});
