import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly heading = () => this.page.locator('h1#page-title');
  private readonly signOutLink = () => this.page.getByRole('link', { name: /Sign out/i });

  async expectLoaded() {
    await this.expectVisible(this.heading());
  }

  async getHeadingText(): Promise<string | null> {
    return this.heading().textContent();
  }

  async signOut() {
    await this.signOutLink().click();
  }
}
