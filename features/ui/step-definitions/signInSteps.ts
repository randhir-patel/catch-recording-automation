import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../../../src/ui/support/world';
import { SignInPage } from '../../../src/ui/pages/SignInPage';
import { DashboardPage } from '../../../src/ui/pages/DashboardPage';
import { env } from '../../../src/config/environment';

const getSignInPage = (world: ICustomWorld): SignInPage => {
  if (!world.testData.signInPage) {
    throw new Error('SignInPage is not initialized. Ensure the Given step has run first.');
  }

  return world.testData.signInPage;
};

const signIn = async (world: ICustomWorld, email: string, password: string) => {
  await getSignInPage(world).signIn(email, password);
};

Given('I am on the Catch Recording sign-in page', async function (this: ICustomWorld) {
  const signInPage = new SignInPage(this.page!);
  await signInPage.open();
  this.testData.signInPage = signInPage;
});

Then('I should see the email and password fields and a sign in button', async function (this: ICustomWorld) {
  await getSignInPage(this).expectSignInFormVisible();
});

When('I sign in with a valid email and password', async function (this: ICustomWorld) {
  await signIn(this, env.credentials.email, env.credentials.password);
});

When('I sign in with email {string} and password {string}', async function (this: ICustomWorld, email: string, password: string) {
  await signIn(this, email, password);
});

When('I capture the bearer token from the UI session', async function (this: ICustomWorld) {
  this.testData.bearerToken = await getSignInPage(this).getBearerToken();
});

Then('I should be redirected to my dashboard', async function (this: ICustomWorld) {
  const dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.expectLoaded();
});

Then('I should see a sign-in error message', async function (this: ICustomWorld) {
  await this.testData.signInPage!.expectValidationError();
});
