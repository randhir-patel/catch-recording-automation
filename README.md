# Catch Recording Automation Framework

Playwright + Cucumber + TypeScript framework for end-to-end (UI) and API
automation of the DEFRA Catch Recording service.

## Why this shape

The solution architecture shows three layers worth testing separately:

| Architecture component                        | How it's covered here                                                                                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| External clients (iOS/Android/web browsers)   | Playwright browser contexts (`chromium`/`firefox`/`webkit`) simulate the web client; `@ui` scenarios                                                                                    |
| Azure AD B2C + AWS WAF + ALB                  | Hit transparently through `env.baseUrl`; no special handling needed unless MFA/OTP is introduced, in which case add a dedicated `AuthPage`                                              |
| Web Service / Admin Service (Fargate)         | `SignInPage`, `DashboardPage` page objects under `src/ui/pages`                                                                                                                         |
| Catch Recording API (Fargate, private subnet) | `CatchRecordingApiClient` under `src/api`, exercised directly via Playwright's `APIRequestContext`; `@api` scenarios bypass the browser entirely for faster, more stable backend checks |
| MongoDB / Redis                               | Not touched directly by design — verified indirectly through API responses. Add a DB helper only if you need to seed/verify data that the API doesn't expose                            |

## Project structure

```
├── cucumber.js                 # Cucumber runner config (ts-node, formatters)
├── eslint.config.cjs           # ESLint flat config for the current toolchain
├── playwright.config.ts        # Shared trace/video/screenshot defaults
├── tsconfig.json
├── .env.example                 # Copy to .env and fill in real values
├── features/
│   ├── ui/signIn.feature           # UI scenarios (@ui)
│   ├── api/catchRecordingApi.feature  # API scenarios (@api)
│   ├── ui/step-definitions/
│   └── api/step-definitions/
├── src/
│   ├── api/CatchRecordingApiClient.ts
│   ├── config/environment.ts
│   ├── ui/pages/                   # Page Object Model
│   ├── ui/support/world.ts         # Custom Cucumber World (holds page/browser/apiContext)
│   ├── ui/support/hooks.ts         # Before/After hooks, browser lifecycle, screenshots on failure
│   └── utils/report.ts          # HTML report generation from cucumber-report.json
└── test-results/                # Generated: screenshots, json + html report
```

## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env   # fill in TEST_USER_EMAIL / TEST_USER_PASSWORD etc.
```

## Running tests

```bash
npm run test:ui        # UI scenarios only
npm run test:api       # API scenarios only
npm run test:smoke     # anything tagged @smoke
npm run test:headed    # UI scenarios, visible browser
npm run lint           # run ESLint with eslint.config.cjs
npm run format         # format source with Prettier
```

An HTML report is generated automatically after each run at
`test-results/cucumber-report.html`.

## Continuous Integration (GitHub Actions)

This repository includes two separate GitHub Actions workflows located in `.github/workflows/`:

- **UI Tests (`.github/workflows/ui-tests.yml`)**: Installs Playwright Chromium dependencies and executes UI scenarios (`npm run test:ui`).
- **API Tests (`.github/workflows/api-tests.yml`)**: Lightweight workflow executing API scenarios (`npm run test:api`) without installing browser dependencies.

### GitHub Secrets Configuration

To run workflows against environments requiring credentials, configure the following **Repository Secrets** under `Settings > Secrets and variables > Actions`:

| Secret Name          | Description                                  |
| -------------------- | -------------------------------------------- |
| `TEST_USER_EMAIL`    | Email for test user authentication           |
| `TEST_USER_PASSWORD` | Password for test user authentication        |
| `BASE_URL`           | _(Optional)_ Override base URL for UI tests  |
| `API_BASE_URL`       | _(Optional)_ Override base URL for API tests |

Both workflows can also be triggered manually using `workflow_dispatch` with a choice of target environment (`uat`, `staging`, `dev`).

## Extending

- **New UI page**: add a class under `src/ui/pages` extending `BasePage`, add
  matching steps under `features/ui/step-definitions`.
- **New API endpoint**: add a method to `CatchRecordingApiClient`.
- **New environment** (e.g. `dev`, `staging`, `prod`): set `TEST_ENV`,
  `BASE_URL`, `API_BASE_URL` accordingly — everything reads from
  `src/config/environment.ts`, nothing is hardcoded in tests.
- **Parallelism**: Cucumber supports `--parallel <n>`; since each scenario
  gets its own browser/context in `hooks.ts`, this is safe to enable once
  the environment can handle concurrent sessions.

## Notes

- Locators in `SignInPage` use accessible, label-based selectors
  (`getByLabel`, `getByRole`) rather than brittle CSS/XPath, matching the
  GOV.UK Design System markup the service is built on.
- `@api` scenarios never open a browser — they're faster and a good place
  to put negative/edge-case validation that would be slow or flaky through
  the UI.
