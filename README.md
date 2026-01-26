[![Playwright Tests](https://github.com/AutomatorSw/playwright-template/actions/workflows/playwright.yml/badge.svg)](https://github.com/AutomatorSw/playwright-template/actions/workflows/playwright.yml)
# Playwright Template

A comprehensive Playwright test automation template featuring Page Object Model (POM), API testing capabilities, and multi-platform CI/CD support.

## Features

- **Page Object Model (POM)**: Clean, maintainable test architecture
- **API Testing**: Built-in API testing infrastructure with fixtures
- **Environment Management**: Secure environment variable handling with dotenvx
- **Multi-Browser Support**: Chromium, Firefox, and WebKit
- **CI/CD Ready**: Pre-configured workflows for GitHub Actions, GitLab CI, and Bitbucket Pipelines
- **TypeScript**: Fully typed for better IDE support and code quality
- **Test Reports**: HTML, JSON, and JUnit reporting formats
- **Best Practices**: Follows Playwright and testing best practices

## Project Structure

```
playwright-template/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow
├── src/
│   ├── pages/                      # Page Object Models
│   │   ├── BasePage.ts             # Base page class with common methods
│   │   ├── HomePage.ts             # Home page object
│   │   ├── LoginPage.ts            # Login page object
│   │   └── index.ts                # Page exports
│   ├── api/                        # API testing infrastructure
│   │   ├── BaseAPI.ts              # Base API class with HTTP methods
│   │   ├── UserAPI.ts              # User API endpoints
│   │   └── index.ts                # API exports
│   ├── fixtures/                   # Test fixtures
│   │   ├── apiFixtures.ts          # API test fixtures
│   │   ├── pageFixtures.ts         # Page test fixtures
│   │   └── index.ts                # Fixture exports
│   └── utils/                      # Utility functions
├── tests/
│   ├── ui/                         # UI tests
│   │   ├── home.spec.ts            # Home page tests (4 examples)
│   │   └── login.spec.ts           # Login tests (2 examples)
│   └── api/                        # API tests
│       ├── auth.api.spec.ts        # Authentication tests (7 examples)
│       └── products.api.spec.ts    # Products CRUD tests (8 examples)
├── reports/                        # Test reports (generated)
├── .env.example                    # Example environment variables
├── .env                            # Local environment variables (gitignored)
├── .gitlab-ci.yml                  # GitLab CI configuration
├── bitbucket-pipelines.yml         # Bitbucket Pipelines configuration
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Project dependencies and scripts
```

## Prerequisites

- Node.js 18.x or 20.x
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AutomatorSw/playwright-template.git
cd playwright-template
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Environment Variables

The template uses **dotenvx** for secure environment variable management with **multi-environment support**. All values are encrypted and safe to commit.

🌍 **Three environments available:**
- **Production** (`.env.production`) - For production testing
- **Staging** (`.env.staging`) - For pre-production validation
- **Development** (`.env.development`) - For local development

📚 See [ENVIRONMENTS.md](ENVIRONMENTS.md) for complete multi-environment guide.
🔐 See [ENCRYPTION.md](ENCRYPTION.md) for encryption details.

### Environment Configuration

```env
# Application URLs
BASE_URL=https://playwright.dev
API_BASE_URL=https://dummyjson.com

# Test Credentials
TEST_USERNAME=test@example.com
TEST_PASSWORD=testpassword123

# API Keys
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here

# Test Configuration
HEADLESS=true
SLOW_MO=0
TIMEOUT=30000

# Environment
ENV=dev
```

### Encrypted Environment Variables

✅ **Already encrypted!** Your `.env` file is encrypted and safe to commit.

**Your decryption key:**
```
DOTENV_PRIVATE_KEY=922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa
```

**For CI/CD:** Add `DOTENV_PRIVATE_KEY` to your CI/CD secrets (GitHub/GitLab/Bitbucket).

**For updates:** See [ENCRYPTION.md](ENCRYPTION.md) for how to modify encrypted values.

Tests automatically decrypt using `dotenvx run --` in npm scripts.

## Running Tests

### Production Environment (Default)

```bash
npm test              # All tests
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run test:headed   # With visible browser
npm run test:debug    # Debug mode
```

### Staging Environment

```bash
npm run test:staging        # All tests
npm run test:staging:ui     # UI tests only
npm run test:staging:api    # API tests only
```

### Development Environment

```bash
npm run test:dev            # All tests
npm run test:dev:ui         # UI tests only
npm run test:dev:api        # API tests only
npm run test:codegen        # Code generator (uses dev env)
```

### Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View Test Report

```bash
npm run test:report
```

## Writing Tests

### UI Tests with Page Object Model

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Home Page Tests @ui', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display homepage heading', async () => {
    const isVisible = await homePage.isHeadingVisible();
    expect(isVisible).toBeTruthy();
  });
});
```

### API Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication API Tests @api', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL,
    });
  });

  test('should successfully login', async () => {
    const response = await apiContext.post('/auth/login', {
      data: {
        username: 'emilys',
        password: 'emilyspass',
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.accessToken).toBeDefined();
    expect(responseBody.refreshToken).toBeDefined();
  });
});
```

### Creating New Page Objects

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyNewPage extends BasePage {
  readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator('.my-selector');
  }

  async goto(): Promise<void> {
    await this.navigate('/my-path');
  }

  async performAction(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

## CI/CD Setup

### GitHub Actions

The template includes a GitHub Actions workflow that:
- Runs tests on multiple browsers in parallel using matrix strategy
- Uses Playwright Docker image for consistent execution
- Runs all projects: chromium, firefox, webkit, and api
- **Supports environment selection** (production, staging, development)
- Uploads test results and reports as artifacts
- Supports encrypted environment variables via dotenvx

**Automatic Execution:**
- Push/PR to `main`, `master`, or `develop` → Runs with **production** environment

**Manual Execution with Environment Selection:**
1. Go to **Actions** tab → **Playwright Tests** workflow
2. Click **Run workflow**
3. Select environment: production, staging, or development
4. Click **Run workflow**

**Setup:**
Add these secrets to GitHub (Settings → Secrets and variables → Actions):
- `DOTENV_PRIVATE_KEY` - For production
- `DOTENV_PRIVATE_KEY_STAGING` - For staging
- `DOTENV_PRIVATE_KEY_DEVELOPMENT` - For development

### GitLab CI

The template includes GitLab CI configuration that:
- Runs tests in parallel for each browser project
- Uses Playwright Docker image
- Caches dependencies for faster builds
- Generates test reports with 30-day retention

**Setup:**
1. Add `DOTENV_PRIVATE_KEY` to GitLab CI/CD Variables (Settings → CI/CD → Variables)
2. Push to repository
3. Pipeline runs automatically

### Bitbucket Pipelines

The template includes Bitbucket Pipelines configuration that:
- Runs tests in parallel for all projects
- Different workflows for master and pull requests
- Artifact support for test reports
- Uses Playwright Docker image

**Setup:**
1. Add `DOTENV_PRIVATE_KEY` to Bitbucket Repository Variables (Settings → Repository variables)
2. Enable Pipelines in repository settings
3. Push to repository

## Test Reports

The template uses **different reporters for CI vs local** to optimize each experience:

### 🏠 Local Reports (Interactive)
- **HTML Report** (opens on failure) - `reports/html/index.html`
- **List output** - Detailed console with timing
- **JSON Report** - `reports/results.json`

### 🤖 CI Reports (Concise)
- **GitHub Annotations** - Inline test results
- **JUnit XML** - `reports/junit.xml` (CI tool integration)
- **JSON Report** - `reports/results.json`
- **HTML Report** - Downloadable artifact

**View HTML report:**
```bash
npm run test:report
```

📚 See [REPORTING.md](REPORTING.md) for complete reporting guide.

## Best Practices

1. **Keep Page Objects Simple**: One page object per page, focused on interactions
2. **Use Fixtures**: Leverage fixtures for common setup and dependency injection
3. **Tag Tests**: Use tags like `@ui` and `@api` to run specific test suites
4. **Environment Variables**: Never commit sensitive data, use dotenvx encryption
5. **Atomic Tests**: Each test should be independent and able to run in isolation
6. **Descriptive Names**: Use clear, descriptive names for tests and methods
7. **Wait Strategies**: Use built-in Playwright waiting mechanisms instead of hard waits
8. **Base Classes**: Extend BasePage and BaseAPI for common functionality

## Debugging

### Using Playwright Inspector
```bash
npm run test:debug
```

### Using VS Code
1. Install Playwright Test extension
2. Set breakpoints in your tests
3. Run tests from the testing sidebar

### Trace Viewer
Tests automatically capture traces on first retry. View them:
```bash
npx playwright show-trace trace.zip
```

### Verbose Logging
```bash
DEBUG=pw:api npm test
```

## Codegen Tool

Generate tests automatically:
```bash
npm run test:codegen
```

This opens a browser where you can interact with your application, and Playwright will generate test code automatically.

## Troubleshooting

### Using Different Public APIs for Testing

The template uses **DummyJSON** (https://dummyjson.com) as the demo API because:
- It's specifically designed for testing
- Has authentication endpoints (login, token refresh, protected routes)
- Has CRUD operations for multiple resources (products, users, posts, etc.)
- No bot protection or Cloudflare blocking
- Fast and reliable

**Note:** Some public APIs like reqres.in are protected by Cloudflare and will block automated requests with 403 errors. Always choose APIs that are designed for testing or use your own API endpoints.

**Solution:**
Replace the API_BASE_URL in your `.env` file with your own API endpoint:
```env
API_BASE_URL=https://your-api.com
```

### Tests Not Running

If tests aren't running:
1. Ensure all dependencies are installed: `npm install`
2. Install Playwright browsers: `npx playwright install`
3. Check your `.env` file exists and has valid values
4. Verify TypeScript compiles: `npx tsc --noEmit`

### dotenvx Not Working in CI/CD

Ensure you've added `DOTENV_PRIVATE_KEY` to your CI/CD secrets:
- GitHub: Settings → Secrets and variables → Actions
- GitLab: Settings → CI/CD → Variables
- Bitbucket: Repository settings → Repository variables

### Browser Tests Failing Locally

Try running in headed mode to see what's happening:
```bash
npm run test:headed
```

Or use debug mode:
```bash
npm run test:debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

ISC

## Support

For issues and questions:
- GitHub Issues: https://github.com/AutomatorSw/playwright-template/issues
- Playwright Documentation: https://playwright.dev

## Acknowledgments

- Built with [Playwright](https://playwright.dev)
- Environment management by [dotenvx](https://dotenvx.com)
- Inspired by testing best practices and community standards
