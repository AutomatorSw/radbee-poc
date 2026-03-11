# Page Exploration Guidelines

## Using Stored Authentication

When exploring Confluence or other authenticated pages with browser_action, always use the stored authentication state from `setupFile` to see the authenticated user experience.

### Current setupFile Location
- Path: `./setupFile`
- Contains: Atlassian/Google authentication cookies and storage state
- Domain: `vdxtest.atlassian.net` and related domains

### Browser Action with Authentication
When using browser_action to explore, the authentication cookies should be loaded to see:
- The actual authenticated page content
- Available buttons and UI elements for authenticated users
- Proper page functionality without login redirects

### Key Learning
During the Confluence snapshot test development:
- Initial exploration showed login page because no auth cookies were used
- The "Take Snapshot" button is only visible to authenticated users
- Button text was "Take Snapshot" not "Create Snapshot" as expected

### Best Practice
Always explore pages with the same authentication state that tests will use to ensure accurate understanding of the UI elements and functionality available to the test user.

### Browser Action Limitation Discovered
**Issue**: The `browser_action` tool doesn't automatically load authentication cookies from `setupFile` like Playwright tests do with `storageState` configuration.

**Result**: When I explored the Confluence URL with `browser_action`, it showed the login page instead of the authenticated page content, even though the setupFile contains valid authentication cookies.

**Workaround Needed**: To properly explore authenticated pages with browser_action, we need to find a way to inject the authentication cookies from setupFile, or use the Playwright test execution itself to explore and take screenshots.

### Key Insight
The fact that the test passes (clicking "Take Snapshot") but browser_action exploration shows login page proves that:
1. The test correctly uses stored authentication via `storageState: './setupFile'`
2. Browser exploration needs the same authentication context
3. Future explorations should account for this authentication gap
