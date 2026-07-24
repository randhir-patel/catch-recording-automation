import { setWorldConstructor, World, IWorldOptions, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, APIRequestContext, APIResponse } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';

export interface ITestData {
  response?: APIResponse;
  bearerToken?: string;
  signInPage?: SignInPage;
  [key: string]: unknown;
}

export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiContext?: APIRequestContext;
  testData: ITestData;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiContext?: APIRequestContext;
  testData: ITestData = {};

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);
