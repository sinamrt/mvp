// tests/api.auth.spec.ts
import { test, expect, request } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'https://your-app.vercel.app';

test.describe('Auth API contract', () => {
  test('register => 201 or 400 if exists', async ({}) => {
    const api = await request.newContext({ baseURL: BASE });
    const payload = {
      name: `Test User ${Date.now()}`,
      email: `test.${Date.now()}@example.com`,
      password: 'StrongPass123!'
    };

    const res = await api.post('/api/auth/register', { data: payload });

    // Accept either "created" or "already exists" as valid contract outcomes
    expect([201, 200, 400]).toContain(res.status());
    if (res.status() === 400) {
      const body = await res.json();
      expect(body.error ?? body.message).toMatch(/exists/i);
    }
  });

  test('login valid => 200; invalid => 401', async () => {
    const api = await request.newContext({ baseURL: BASE });

    // valid
    const ok = await api.post('/api/auth/login', {
      data: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD }
    });
    expect(ok.status()).toBe(200);

    // invalid
    const bad = await api.post('/api/auth/login', {
      data: { email: 'nope@example.com', password: 'wrong' }
    });
    expect([401, 400]).toContain(bad.status());
  });
});
