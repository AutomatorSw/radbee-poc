import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    let baseUrl = process.env.BASE_URL || 'https://playwright.dev';
    
    // Handle encrypted environment variables that can't be decrypted
    if (baseUrl && baseUrl.startsWith('encrypted:')) {
      console.warn('BASE_URL is encrypted but cannot be decrypted, falling back to default');
      baseUrl = 'https://playwright.dev';
    }
    
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    await this.page.goto(fullUrl);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png` });
  }
}
