# Quick Setup Guide

This guide will help you get started with the Playwright Template in minutes.

## Prerequisites

- Node.js 18.x or 20.x
- npm (comes with Node.js)

## Installation Steps

### 1. Clone and Install

```bash
git clone https://github.com/AutomatorSw/playwright-template.git
cd playwright-template
npm install
npx playwright install chromium
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` to match your application:
```env
BASE_URL=https://your-app.com
API_BASE_URL=https://your-api.com
TEST_USERNAME=your-test-user
TEST_PASSWORD=your-test-password
```

### 3. Run Your First Test

```bash
# Run all tests
npm test

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run tests in headed mode (see the browser)
npm run test:headed
```

### 4. View Test Results

```bash
npm run test:report
```

## What's Included

### Project Structure
```
playwright-template/
├── src/
│   ├── pages/          # Page Object Models for UI tests
│   ├── api/            # API client classes
│   ├── fixtures/       # Test fixtures and helpers
│   └── utils/          # Utility functions
├── tests/
│   ├── ui/             # UI test specifications
│   └── api/            # API test specifications
├── .github/workflows/  # GitHub Actions CI/CD
├── .gitlab-ci.yml      # GitLab CI configuration
└── bitbucket-pipelines.yml  # Bitbucket Pipelines config
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:report` | Open test report |
| `npm run test:codegen` | Generate tests interactively |

## Next Steps

1. **Add Your First Page Object**
   - Create a new file in `src/pages/`
   - Extend `BasePage`
   - Define locators and methods

2. **Write Your First Test**
   - Create a new file in `tests/ui/`
   - Import your page object
   - Write test scenarios

3. **Set Up CI/CD**
   - Choose your platform (GitHub/GitLab/Bitbucket)
   - Add `DOTENV_PRIVATE_KEY` to secrets
   - Push to repository

## Common Commands

### Run specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run specific test file
```bash
npx playwright test tests/ui/home.spec.ts
```

### Run tests matching a pattern
```bash
npx playwright test --grep "@ui"
npx playwright test --grep "login"
```

### Update Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install
```

## Using dotenvx for Security

### Encrypt your environment variables:

```bash
# Install dotenvx globally
npm install -g @dotenvx/dotenvx

# Encrypt .env file
dotenvx encrypt

# Add DOTENV_PRIVATE_KEY to CI/CD secrets
```

This creates `.env.vault` which can be safely committed to version control.

## IDE Setup

### VS Code (Recommended)

Install these extensions:
- Playwright Test for VSCode
- ESLint
- Prettier

The template includes `.vscode/` configuration for:
- Debugging tests
- Running tests
- Code formatting

### Using the VS Code Extension

1. Open the Testing sidebar (flask icon)
2. See all your tests listed
3. Click the play button to run a test
4. Click the debug icon to debug a test

## Getting Help

- **Documentation**: See [README.md](README.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues**: https://github.com/AutomatorSw/playwright-template/issues
- **Playwright Docs**: https://playwright.dev

## Tips

1. **Start Small**: Begin with a few simple tests and build up
2. **Use Tags**: Organize tests with `@ui`, `@api`, `@smoke`, etc.
3. **Keep Tests Fast**: Avoid unnecessary waits and assertions
4. **Use Fixtures**: Share setup code via fixtures
5. **Review Reports**: Check HTML reports after test runs

Happy Testing! 🎭
