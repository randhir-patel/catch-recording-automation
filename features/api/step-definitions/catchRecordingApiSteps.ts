import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../../src/ui/support/world';
import { CatchRecordingApiClient } from '../../../src/api/catchRecordingApiClient';

When(
  'I call the login endpoint with username {string} and password {string}',
  async function (this: ICustomWorld, username: string, password: string) {
    const client = new CatchRecordingApiClient(this.apiContext!);
    this.testData.response = await client.login(username, password);
  }
);

Then('the response status should be {int}', async function (this: ICustomWorld, statusCode: number) {
  expect(this.testData.response!.status()).toBe(statusCode);
});
