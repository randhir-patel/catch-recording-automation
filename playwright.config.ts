import { defineConfig } from '@playwright/test';
import { env } from './src/config/environment';

export default defineConfig({
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
