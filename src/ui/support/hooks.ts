import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit, request } from '@playwright/test';
import { ICustomWorld } from './world';
import { env } from '../../config/environment';
import * as fs from 'fs';
import * as path from 'path';

const browsers = { chromium, firefox, webkit };

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  const dir = path.join(process.cwd(), 'test-results', 'screenshots');
  fs.mkdirSync(dir, { recursive: true });
});

Before({ tags: 'not @api' }, async function (this: ICustomWorld) {
  const browserType = browsers[env.browser as keyof typeof browsers] ?? chromium;
  this.browser = await browserType.launch({
    headless: env.headless,
    args: ['--disable-web-security', '--ignore-certificate-errors'],
  });
  this.context = await this.browser.newContext({
    baseURL: env.baseUrl,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });
  this.context.setDefaultTimeout(env.defaultTimeout);
  this.page = await this.context.newPage();
});

After({ tags: 'not @api' }, async function (this: ICustomWorld, { result, pickle }) {
  if (result?.status === Status.FAILED && this.page) {
    const safeName = pickle.name.replace(/[^a-z0-9]/gi, '_');
    const screenshotPath = path.join('test-results', 'screenshots', `${safeName}.png`);
    const buffer = await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.attach(buffer, 'image/png');
  }
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});

Before({ tags: '@api' }, async function (this: ICustomWorld) {
  this.apiContext = await request.newContext({
    baseURL: env.apiBaseUrl,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  });
});

After({ tags: '@api' }, async function (this: ICustomWorld) {
  await this.apiContext?.dispose();
});

AfterAll(async function () {});
