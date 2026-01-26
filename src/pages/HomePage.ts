import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly getStartedLink: Locator;
  readonly heading: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.heading = page.getByRole('heading', { name: 'Playwright enables reliable' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async clickGetStarted(): Promise<void> {
    await this.clickElement(this.getStartedLink);
  }

  async isHeadingVisible(): Promise<boolean> {
    return await this.isElementVisible(this.heading);
  }

  async getHeadingText(): Promise<string> {
    return await this.getText(this.heading);
  }
}
