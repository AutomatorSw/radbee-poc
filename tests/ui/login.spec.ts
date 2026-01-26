import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Login Page Tests @ui', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test.skip('should fill login form with credentials from env', async () => {
    const username = process.env.TEST_USERNAME || 'test@example.com';
    const password = process.env.TEST_PASSWORD || 'testpassword123';

    await loginPage.goto();
    await loginPage.fillInput(loginPage.emailInput, username);
    await loginPage.fillInput(loginPage.passwordInput, password);

    const emailValue = await loginPage.emailInput.inputValue();
    expect(emailValue).toBe(username);
  });

  test.skip('should display error message for invalid login', async () => {
    await loginPage.goto();
    await loginPage.login('invalid@email.com', 'wrongpassword');

    // Note: This is an example test. Adjust selectors based on your actual application
    // await expect(loginPage.errorMessage).toBeVisible();
  });
});
