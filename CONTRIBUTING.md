# Contributing to Playwright Template

Thank you for considering contributing to this project! Here are some guidelines to help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/playwright-template.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes
6. Run tests: `npm test`
7. Commit your changes: `git commit -m "Add your commit message"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code structure and patterns
- Use async/await for asynchronous operations
- Keep functions small and focused
- Add JSDoc comments for public methods

### Page Objects

When creating new page objects:
- Extend `BasePage` class
- Use descriptive names for locators
- Keep locators as `readonly` properties
- Group related methods together
- Avoid hardcoded waits, use Playwright's built-in waiting

Example:
```typescript
export class NewPage extends BasePage {
  readonly elementLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.elementLocator = page.locator('.selector');
  }

  async performAction(): Promise<void> {
    await this.clickElement(this.elementLocator);
  }
}
```

### API Classes

When creating new API classes:
- Extend `BaseAPI` class
- Define interfaces for request/response types
- Use descriptive method names
- Add proper error handling
- Document expected response codes

Example:
```typescript
export interface NewResource {
  id: number;
  name: string;
}

export class NewAPI extends BaseAPI {
  async getResource(id: number): Promise<APIResponse> {
    return await this.get(`/resource/${id}`);
  }
}
```

### Writing Tests

- Use descriptive test names that explain what is being tested
- Add tags (`@ui`, `@api`) to categorize tests
- Keep tests independent and isolated
- Use fixtures for common setup
- Clean up after tests if necessary

Example:
```typescript
test.describe('Feature Tests @ui', () => {
  test('should perform expected action', async ({ page }) => {
    // Arrange
    const myPage = new MyPage(page);
    await myPage.goto();

    // Act
    await myPage.performAction();

    // Assert
    const result = await myPage.getResult();
    expect(result).toBe('expected value');
  });
});
```

### Commit Messages

Follow the conventional commits specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add user profile page object
fix: correct login page locator
docs: update README with new examples
test: add API tests for delete endpoint
```

## Testing Your Changes

Before submitting a PR:

1. Run all tests: `npm test`
2. Run UI tests: `npm run test:ui`
3. Run API tests: `npm run test:api`
4. Check for TypeScript errors: `npx tsc --noEmit`
5. Ensure tests pass in headed mode: `npm run test:headed`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md if present
3. Ensure all tests pass
4. Request review from maintainers
5. Address any feedback from code review
6. Once approved, your PR will be merged

## Adding New CI/CD Platforms

If you want to add support for a new CI/CD platform:

1. Create a configuration file in the appropriate location
2. Use the Playwright Docker image: `mcr.microsoft.com/playwright:v1.57.0-jammy`
3. Run tests in parallel using matrix strategy
4. Include all projects: chromium, firefox, webkit, api
5. Support dotenvx encryption via `DOTENV_PRIVATE_KEY`
6. Upload test artifacts
7. Update README.md with setup instructions

## Questions or Issues?

- Open an issue for bugs or feature requests
- Tag issues appropriately (bug, enhancement, question)
- Provide as much context as possible
- Include steps to reproduce for bugs

Thank you for contributing!
