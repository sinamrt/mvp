// tests/critical-tests.spec.ts

import { test, expect, chromium } from '@playwright/test';

test('Session persists after reload', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const page = await context.newPage();

  try {
    // 🔹 Navigate to the registration page
    await page.goto('https://meal4v.vercel.app/register', { waitUntil: 'load' });

    // 🔹 Wait and fill email
    await page.waitForSelector('[data-testid="email"]', { timeout: 10000 });
    await page.fill('[data-testid="email"]', 'user@example.com');

    // 🔹 Wait and fill password
    await page.waitForSelector('[data-testid="password"]', { timeout: 10000 });
    await page.fill('[data-testid="password"]', 'SecurePass123!');

    // 🔹 Click the login/register button
    await page.waitForSelector('[data-testid="login-button"]', { timeout: 10000 });
    await page.click('[data-testid="login-button"]');

    // 🔹 Optional: Wait for redirect or confirmation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // buffer for any redirects

    // 🔹 Save session state
    const storageState = await context.storageState();
    console.log('✅ Session created. Storage state captured.');

    // 🔹 Reload the page
    await page.reload({ waitUntil: 'load' });

    // 🔹 Validate session still exists
    const sessionCookie = storageState.cookies.find(cookie => cookie.name === 'next-auth.session-token');
    expect(sessionCookie).toBeDefined();
    console.log('✅ Session persisted after reload.');

  } catch (e) {
    console.error('❌ Test failed:', e);
    await page.screenshot({ path: 'error-session-reload.png' });
    throw e;
  } finally {
    await browser.close();
  }
});


// import { test, expect } from '@playwright/test';
// import { chromium } from '@playwright/test';
 

// test('Session persists after reload', async ({ page }) => {
//   await page.goto('https://meal4v.vercel.app/', { timeout: 15000 });
//   // continue test...
// });


// import fs from 'fs';
// export const generateTestUser = (overrides = {}) => {
//   const timestamp = Date.now() + Math.floor(Math.random() * 1000); // avoid collision
//   return {
//     fullName: `Test User ${timestamp}`,
//     email: `test.user.${timestamp}@example.com`,
//     password: 'StrongPass123!',
//     confirmPassword: 'StrongPass123!',
//     ...overrides,
//   };
// };

// export const generateMultipleUsers = (count = 5) => {
//   return Array.from({ length: count }, () => generateTestUser());
// };


// const users = generateMultipleUsers(5);

// const randomNames = ['Ali', 'Mina', 'Zoe', 'Leo', 'Ray', 'Ella'];

// export const generateUserWithRandomName = () => {
//   const name = randomNames[Math.floor(Math.random() * randomNames.length)];
//   const timestamp = Date.now() + Math.floor(Math.random() * 1000);
//   return {
//     fullName: `${name} ${timestamp}`,
//     email: `user.${name.toLowerCase()}.${timestamp}@example.com`,
//     password: 'StrongPass123!',
//     confirmPassword: 'StrongPass123!',
//   };
// };
// export const generateInvalidUsers = () => ([
//   {
//     fullName: 'Missing Email',
//     email: '',
//     password: 'StrongPass123!',
//     confirmPassword: 'StrongPass123!',
//   },
//   {
//     fullName: 'Bad Email Format',
//     email: 'invalid-email',
//     password: 'StrongPass123!',
//     confirmPassword: 'StrongPass123!',
//   },
//   {
//     fullName: 'Weak Password',
//     email: `weak.${Date.now()}@example.com`,
//     password: '123',
//     confirmPassword: '123',
//   },
//   {
//     fullName: 'Password Mismatch',
//     email: `mismatch.${Date.now()}@example.com`,
//     password: 'StrongPass123!',
//     confirmPassword: 'DifferentPass123!',
//   },
// ]);


// test('register multiple users', async ({ page }) => {
//   for (const user of users) {
//     await page.goto('/register');
//     await page.fill('[data-testid="name"]', user.fullName);
//     await page.fill('[data-testid="email"]', user.email);
//     await page.fill('[data-testid="password"]', user.password);
//     await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
//     await page.click('[data-testid="register-button"]');
//     await expect(page).toHaveURL(/dashboard|success|welcome/);
//   }
// });



// (async () => {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();
//   await page.goto('https://meal4v.vercel.app/');

//   await page.fill('[data-testid="email"]', 'user@example.com');
//   await page.fill('[data-testid="password"]', 'SecurePass123!');
//   await page.click('[data-testid="login-button"]');

//   // ✅ Save state
//   await page.context().storageState({ path: 'state.json' });
//   await browser.close();
// })();



// let storageState = undefined;

// if (fs.existsSync('state.json')) {
//   storageState = 'state.json';
// }

// test.use({ storageState });

// test('session persists across routes', async ({ page }) => {
//   if (!storageState) {
//     // Do login manually
//     await page.goto('/login');
//     await page.fill('[data-testid="email"]', 'user@example.com');
//     await page.fill('[data-testid="password"]', 'SecurePass123!');
//     await page.click('[data-testid="login-button"]');
//   }

//   await page.goto('/protected-route');
//   await expect(page.locator('h1')).toContainText('Welcome');
// });

// test.use({ storageState: 'state.json' }); // Pre-saved logged-in state

// test('Session persists after navigating to protected route', async ({ page }) => {
//   await page.goto('https://meal4v.vercel.app/login');

//   await page.fill('[data-testid="email"]', 'existing.user@test.com');
//   await page.fill('[data-testid="password"]', 'SecurePass123!');
//   await page.click('[data-testid="login-button"]');

//   await expect(page).toHaveURL(/dashboard|diet-form/);

//   // Navigate to protected route
//   await page.goto('https://meal4v.vercel.app/dashboard');

//   // Confirm user has access
//   await expect(page.locator('h1')).toContainText('Dashboard');
// }); 

// test('Session persists after page reload', async ({ page, context }) => {
//   // Go to site and login
//   await page.goto('https://meal4v.vercel.app/login');
//   await page.fill('[data-testid="email"]', 'user@example.com');
//   await page.fill('[data-testid="password"]', 'StrongPass123!');
//   await page.click('[data-testid="login-button"]');
//   await page.waitForURL(/dashboard|diet-form/);

//   // Save storage state after login
//   await context.storageState({ path: 'state.json' });

//   // Reload the page
//   await page.reload();

//   // Confirm session persists (e.g. user is still on dashboard)
//   await expect(page).toHaveURL(/dashboard|diet-form/);
//   await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible(); // adjust based on your UI
// });


// test('Session cookie is set after login', async ({ page, context }) => {
//   await page.goto('https://meal4v.vercel.app/login');

//   await page.fill('[data-testid="email"]', 'existing.user@test.com');
//   await page.fill('[data-testid="password"]', 'SecurePass123!');
//   await page.click('[data-testid="login-button"]');

//   const cookies = await context.cookies();
//   const sessionCookie = cookies.find(cookie => cookie.name.includes('session'));

//   expect(sessionCookie).toBeDefined();
//   expect(sessionCookie?.value).not.toBe('');
// });

// test('Session persists across internal navigation', async ({ page }) => {
//   await page.goto('https://meal4v.vercel.app/login');

//   await page.fill('[data-testid="email"]', 'existing.user@test.com');
//   await page.fill('[data-testid="password"]', 'SecurePass123!');
//   await page.click('[data-testid="login-button"]');

//   await expect(page).toHaveURL(/dashboard|diet-form/);

//   // Navigate via internal link
//   await page.click('[data-testid="nav-meal-plans"]');
//   await expect(page).toHaveURL(/meal-plans/);

//   // Check still authenticated
//   await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
// });

// test('Session persists from saved state (reopen simulation)', async ({ page }) => {
//   await page.goto('https://meal4v.vercel.app/dashboard');

//   // Should be logged in already
//   await expect(page.locator('h1')).toContainText('Dashboard');
// });

