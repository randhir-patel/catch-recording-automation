import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    const fullUrl = `${process.env.BASE_URL}${path}`;
    await this.page.goto(fullUrl);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
