import { test, expect } from '@playwright/test';

//import { generateMultipleUsers } from './utils/testUsers';

// utils/testUsers.ts
// utils/testUsers.ts
export const generateTestUser = (overrides = {}) => {
  const timestamp = Date.now() + Math.floor(Math.random() * 1000); // avoid collision
  return {
    fullName: `Test User ${timestamp}`,
    email: `test.user.${timestamp}@example.com`,
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
    ...overrides,
  };
};

export const generateMultipleUsers = (count = 5) => {
  return Array.from({ length: count }, () => generateTestUser());
};


const users = generateMultipleUsers(5);

const randomNames = ['Ali', 'Mina', 'Zoe', 'Leo', 'Ray', 'Ella'];

export const generateUserWithRandomName = () => {
  const name = randomNames[Math.floor(Math.random() * randomNames.length)];
  const timestamp = Date.now() + Math.floor(Math.random() * 1000);
  return {
    fullName: `${name} ${timestamp}`,
    email: `user.${name.toLowerCase()}.${timestamp}@example.com`,
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
  };
};
export const generateInvalidUsers = () => ([
  {
    fullName: 'Missing Email',
    email: '',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
  },
  {
    fullName: 'Bad Email Format',
    email: 'invalid-email',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
  },
  {
    fullName: 'Weak Password',
    email: `weak.${Date.now()}@example.com`,
    password: '123',
    confirmPassword: '123',
  },
  {
    fullName: 'Password Mismatch',
    email: `mismatch.${Date.now()}@example.com`,
    password: 'StrongPass123!',
    confirmPassword: 'DifferentPass123!',
  },
]);


test('register multiple users', async ({ page }) => {
  for (const user of users) {
    await page.goto('/register');
    await page.fill('[data-testid="name"]', user.fullName);
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.fill('[data-testid="confirm-password"]', user.confirmPassword);
    await page.click('[data-testid="register-button"]');
    await expect(page).toHaveURL(/dashboard|success|welcome/);
  }
});



test.use({ storageState: 'state.json' }); // Pre-saved logged-in state

 

test('Session persists after navigating to protected route', async ({ page }) => {
  await page.goto('https://meal4v.vercel.app/login');

  await page.fill('[data-testid="email"]', 'existing.user@test.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="login-button"]');

  await expect(page).toHaveURL(/dashboard|diet-form/);

  // Navigate to protected route
  await page.goto('https://meal4v.vercel.app/dashboard');

  // Confirm user has access
  await expect(page.locator('h1')).toContainText('Dashboard');
}); test('Session persists after page reload', async ({ page }) => {
  await page.goto('https://meal4v.vercel.app/login');

  await page.fill('[data-testid="email"]', 'existing.user@test.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="login-button"]');

  // Ensure login success
  await expect(page).toHaveURL(/dashboard|diet-form/);

  // Reload the page
  await page.reload();

  // Confirm user is still authenticated
  await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
});
test('Session cookie is set after login', async ({ page, context }) => {
  await page.goto('https://meal4v.vercel.app/login');

  await page.fill('[data-testid="email"]', 'existing.user@test.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="login-button"]');

  const cookies = await context.cookies();
  const sessionCookie = cookies.find(cookie => cookie.name.includes('session'));

  expect(sessionCookie).toBeDefined();
  expect(sessionCookie?.value).not.toBe('');
});

test('Session persists across internal navigation', async ({ page }) => {
  await page.goto('https://meal4v.vercel.app/login');

  await page.fill('[data-testid="email"]', 'existing.user@test.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="login-button"]');

  await expect(page).toHaveURL(/dashboard|diet-form/);

  // Navigate via internal link
  await page.click('[data-testid="nav-meal-plans"]');
  await expect(page).toHaveURL(/meal-plans/);

  // Check still authenticated
  await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
});

test('Session persists from saved state (reopen simulation)', async ({ page }) => {
  await page.goto('https://meal4v.vercel.app/dashboard');

  // Should be logged in already
  await expect(page.locator('h1')).toContainText('Dashboard');
});

