import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  private readonly emailInput = () => this.page.getByLabel('Email address', { exact: false });
  private readonly passwordInput = () => this.page.getByLabel('Password', { exact: false });
  private readonly signInButton = () => this.page.getByRole('button', { name: 'Sign in' });
  private readonly forgottenPasswordLink = () => this.page.getByRole('link', { name: /Forgotten your password/i });
  private readonly errorSummary = () => this.page.locator('.govuk-error-summary');

  public readonly signInHeading = (): Locator => this.page.getByRole('heading', { name: 'Sign in', level: 2 });
  public readonly troubleHeading = (): Locator => this.page.getByRole('heading', { name: 'Having trouble signing in?' });

  public readonly backLink = (): Locator => this.page.getByRole('link', { name: 'Back' });
  public readonly forgotPasswordLink = (): Locator => this.page.getByRole('link', { name: 'Forgotten your password?' });
  public readonly registerLink = (): Locator => this.page.getByText("Don't have an account yet?");

  public readonly englishLabel = (): Locator => this.page.getByText('English', { exact: true });
  public readonly cymraegLink = (): Locator => this.page.getByRole('link', { name: 'Cymraeg' });

  public readonly feedbackLink = (): Locator => this.page.locator('main').getByRole('link', { name: 'feedback' });

  async open() {
    await this.goto('/sign-in');
    await this.waitForLoad();
  }

  async signIn(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.signInButton().click();
  }

  async expectSignInFormVisible() {
    await this.expectVisible(this.emailInput());
    await this.expectVisible(this.passwordInput());
    await this.expectVisible(this.signInButton());
  }

  async expectValidationError(message?: string) {
    await this.expectVisible(this.errorSummary());
    if (message) {
      await expect(this.errorSummary()).toContainText(message);
    }
  }

  async clickForgottenPassword() {
    await this.forgottenPasswordLink().click();
  }

  async getBearerToken(): Promise<string> {
    const token = await this.page.evaluate(() => {
      const normalizeValue = (raw: string | null, key?: string): string | null => {
        if (!raw) return null;

        const bearerMatch = raw.match(/Bearer\s+([A-Za-z0-9\-_.=]+)/i);
        if (bearerMatch) return bearerMatch[1];

        try {
          const json = JSON.parse(raw);
          return (
            json?.accessToken ?? json?.token ?? json?.idToken ?? json?.authToken ?? json?.bearerToken ?? json?.access_token ?? json?.id_token ?? null
          );
        } catch {}

        if (key && /token|auth|bearer|session/i.test(key) && /^[A-Za-z0-9\-_.=]+$/.test(raw) && raw.length > 20) {
          return raw;
        }

        return null;
      };

      const scanStorage = (storage: Storage): string | null => {
        for (let i = 0; i < storage.length; i += 1) {
          const key = storage.key(i);
          const raw = key ? storage.getItem(key) : null;
          const token = normalizeValue(raw, key ?? undefined);
          if (token) return token;
        }
        return null;
      };

      return scanStorage(localStorage) || scanStorage(sessionStorage);
    });

    if (!token) {
      throw new Error('Bearer token not found in localStorage or sessionStorage after login');
    }

    return token;
  }
}
