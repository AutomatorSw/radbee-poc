import { test, expect } from '@playwright/test';
import { ConfluenceLoginPage } from '../../pom/ConfluenceLoginPage';
import { ConfluenceWikiPage } from '../../pom/ConfluenceWikiPage';
import { SnapshotCreatedPage } from '../../pom/SnapshotCreatedPage';
import { EnvironmentFactory } from '../../config/env/EnvironmentFactory';

test.describe('Confluence Wiki Snapshot Tests', () => {
  let environment: any;

  test.beforeEach(async () => {
    environment = EnvironmentFactory.create();
  });

  test('User logs in to the system and clicks on Take Snapshot button @ui', async ({ page }) => {
    test.setTimeout(15000);
    
    const loginPage = new ConfluenceLoginPage(page);
    const wikiPage = new ConfluenceWikiPage(page);
    const snapshotCreatedPage = new SnapshotCreatedPage(page);
    
    await wikiPage.navigate(environment.fullWikiUrl);
    
    const isLoginRequired = await loginPage.isLoginPageDisplayed();
    if (isLoginRequired) {
      await loginPage.loginWithCredentials('{login}', '{password}');
      await loginPage.waitForLoginSuccess();
    }
    
    await wikiPage.waitForPageLoad();
    await expect(wikiPage.isAuthenticated()).resolves.toBe(true);
    await expect(wikiPage.isPageLoaded()).resolves.toBe(true);
    
    // Click on Take Snapshot button
    await wikiPage.clickCreateSnapshot();
    
    // Validate that snapshot creation success message appears
    await snapshotCreatedPage.waitForSuccessMessage();
    console.log('Clicked on Take Snapshot button');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `test-results/failure-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png` });
    }
  });
});
