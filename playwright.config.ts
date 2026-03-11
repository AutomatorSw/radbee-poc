import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        // CI reporters: concise output, machine-readable formats
        ['github'],                                            // GitHub Actions annotations
        ['junit', { outputFile: 'reports/junit.xml' }],        // JUnit for CI tools
        ['json', { outputFile: 'reports/results.json' }],      // JSON for parsing
        ['html', { outputFolder: 'reports/html', open: 'never' }], // HTML but don't open
      ]
    : [
        // Local reporters: detailed output, interactive HTML
        ['html', { outputFolder: 'reports/html', open: 'on-failure' }], // Open on failures
        ['list'],                                              // Detailed console output
        ['json', { outputFile: 'reports/results.json' }],      // JSON for records
      ],
  use: {
    baseURL: process.env.BASE_URL || 'https://playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\.api\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: './setupFile',
        headless: false,
      },
    },
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'https://dummyjson.com',
      },
    },
  ],
});
