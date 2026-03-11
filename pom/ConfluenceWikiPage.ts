import { Page, Locator } from '@playwright/test';

export class ConfluenceWikiPage {
  private page: Page;

  // Locators
  private createSnapshotButton: Locator;
  private pageContent: Locator;
  private pageTitle: Locator;
  private editButton: Locator;
  private shareButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // More robust locator strategy for snapshot button - target the main jql-snapshot iframe specifically
    this.createSnapshotButton = page.frameLocator('iframe[id*="jira-jqlstop-snapshot"]:not([id*="background"])').getByText('Take Snapshot', { exact: false }).first();
    this.pageContent = page.locator('[data-testid="pageContentRendererTestId"]').first();
    this.pageTitle = page.getByRole('heading', { level: 1 }).or(page.locator('h1').first());
    this.editButton = page.getByRole('button', { name: 'Edit' }).or(page.locator('[data-testid="edit-button"], .edit-button'));
    this.shareButton = page.getByRole('button', { name: 'Share' }).or(page.locator('[data-testid="share-button"], .share-button'));
  }

  /**
   * Navigate to the wiki page
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Click on Create Snapshot button
   */
  async clickCreateSnapshot(): Promise<void> {
    await this.createSnapshotButton.click();
  }

  /**
   * Check if Create Snapshot button is visible
   */
  async isCreateSnapshotButtonVisible(): Promise<boolean> {
    return await this.createSnapshotButton.isVisible();
  }

  /**
   * Check if wiki page is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    return await this.pageContent.isVisible();
  }

  /**
   * Get page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.pageContent.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check if user is authenticated (not on login page)
   */
  async isAuthenticated(): Promise<boolean> {
    return !this.page.url().includes('/login') && !this.page.url().includes('id.atlassian.com');
  }

  /**
   * Click Create Snapshot button inside iframe
   */
  async clickCreateSnapshotInIframe(): Promise<void> {
    await this.createSnapshotButton.click();
  }
}
