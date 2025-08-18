// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
  },
});
