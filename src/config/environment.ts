import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  env: process.env.TEST_ENV || 'uat',
  baseUrl: process.env.BASE_URL || 'https://uat.catchrecording.cefasext.co.uk',
  adminUrl: process.env.ADMIN_URL || 'https://uat.catchrecording.cefasext.co.uk/admin',
  apiBaseUrl: process.env.API_BASE_URL || 'https://uat.catchrecording.cefasext.co.uk/api',
  headless: process.env.HEADLESS !== 'false',
  browser: process.env.BROWSER || 'chromium',
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT || 30000),
  credentials: {
    email: process.env.TEST_USER_EMAIL || '',
    password: process.env.TEST_USER_PASSWORD || '',
  },
};
