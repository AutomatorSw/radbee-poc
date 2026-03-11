const { chromium } = require('playwright');
const fs = require('fs');

async function exploreWithAuth() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  const page = await context.newPage();
  
  try {
    // Navigate to Atlassian login page first
    await page.goto('https://vdxtest.atlassian.net/wiki/spaces/SNAP/pages/825163779/gfsdfhgdfshgdfg');
    
    // Wait for login form and authenticate
    await page.fill('input[name="username"]', '{password}');
    await page.click('button[type="submit"]');
    
    // Wait for password field and fill it
    await page.waitForSelector('input[name="password"]');
    await page.fill('input[name="password"]', '{password}');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete after login
    await page.waitForURL('**/wiki/spaces/SNAP/pages/**', { timeout: 30000 });
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see the authenticated page
    await page.screenshot({ 
      path: 'exploration-with-auth.png', 
      fullPage: true 
    });
    
    // Look for iframes and Take Snapshot button
    const iframes = await page.$$('iframe');
    console.log(`Found ${iframes.length} iframes on the page`);
    
    // Check for Take Snapshot button
    const takeSnapshotButton = await page.getByRole('button', { name: 'Take Snapshot' });
    const isVisible = await takeSnapshotButton.isVisible().catch(() => false);
    console.log(`Take Snapshot button visible: ${isVisible}`);
    
    if (isVisible) {
      const buttonBox = await takeSnapshotButton.boundingBox();
      console.log('Take Snapshot button position:', buttonBox);
    }
    
    // Look for any snapshot-related elements
    const snapshotElements = await page.locator('*:has-text("Snapshot"):visible').all();
    console.log(`Found ${snapshotElements.length} elements containing "Snapshot"`);
    
    console.log('Exploration complete! Check exploration-with-auth.png');
    
    // Keep browser open for manual inspection
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('Error during exploration:', error);
  }
  
  await browser.close();
}

exploreWithAuth().catch(console.error);
