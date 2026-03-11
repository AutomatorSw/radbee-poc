import { Page, Locator } from '@playwright/test';

export class ConfluenceLoginPage {
  private page: Page;

  // Locators
  private emailInput: Locator;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private continueButton: Locator;
  private submitButton: Locator;
  private googleLoginButton: Locator;
  private passkeyButton: Locator;
  private microsoftButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.submitButton = page.locator('button[type="submit"]');
    this.googleLoginButton = page.getByRole('button', { name: 'Google' });
    this.passkeyButton = page.getByRole('button', { name: 'Passkey' });
    this.microsoftButton = page.getByRole('button', { name: 'Microsoft' });
  }

  /**
   * Navigate to Confluence login page
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Login using Google authentication
   */
  async loginWithGoogle(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.googleLoginButton.click();
  }

  /**
   * Login using username and password
   */
  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.submitButton.click();
    
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Check if login page is displayed (checks for both email and username inputs)
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    const emailVisible = await this.emailInput.isVisible().catch(() => false);
    const usernameVisible = await this.usernameInput.isVisible().catch(() => false);
    return emailVisible || usernameVisible;
  }

  /**
   * Wait for login to complete and redirect
   */
  async waitForLoginSuccess(): Promise<void> {
    await this.page.waitForURL(/\/wiki\/spaces/, { timeout: 30000 });
  }
}
