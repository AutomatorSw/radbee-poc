import { Page, Locator } from '@playwright/test';

export class SnapshotCreatedPage {
  private page: Page;

  // Locators
  private successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successMessage = page.frameLocator('iframe[id*="jira-jql-snapshot"]:not([id*="background"])').locator('text=/Snapshot is ready/i');
  }

  /**
   * Check if the snapshot success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible({ timeout: 15000 });
  }

  /**
   * Wait for the snapshot success message to appear
   */
  async waitForSuccessMessage(): Promise<void> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
  }
}
