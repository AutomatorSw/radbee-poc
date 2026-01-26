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

  test('should have correct page title', async () => {
    const title = await homePage.getTitle();
    expect(title).toContain('Playwright');
  });

  test('should navigate to Getting Started page', async () => {
    await homePage.clickGetStarted();
    await homePage.page.waitForURL(/.*intro/);
    expect(homePage.page.url()).toContain('intro');
  });

  test('should display search button', async () => {
    const isVisible = await homePage.isElementVisible(homePage.searchButton);
    expect(isVisible).toBeTruthy();
  });
});
