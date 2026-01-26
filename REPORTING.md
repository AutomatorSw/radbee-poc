# Test Reporting Guide

This guide explains the different reporting strategies for local development vs CI/CD environments.

## 📊 Reporter Configuration

The template uses **different reporters** for CI and local environments to optimize the experience for each context.

### 🏠 Local Environment

**Optimized for:** Interactive development, debugging, detailed feedback

```typescript
reporters: [
  ['html', { open: 'on-failure' }],  // Opens HTML report automatically on failures
  ['list'],                           // Detailed console output with timing
  ['json'],                          // Machine-readable record
]
```

**Features:**
- ✅ **Detailed console output** - See every test as it runs
- ✅ **Auto-open HTML report on failure** - Immediately see what went wrong
- ✅ **Rich terminal colors** - Easy to scan results
- ✅ **Test timing information** - Performance insights

**Example Output:**
```bash
Running 15 tests using 4 workers

  ✓ [api] › auth.api.spec.ts:16 › POST - should successfully login (611ms)
  ✓ [api] › auth.api.spec.ts:55 › POST - should fail login (562ms)
  ✓ [api] › products.api.spec.ts:16 › GET - should retrieve products (16ms)
  ...

  15 passed (1.9s)
```

### 🤖 CI Environment (GitHub Actions)

**Optimized for:** Concise logs, integration with CI tools, artifact generation

```typescript
reporters: [
  ['github'],                        // GitHub Actions annotations
  ['junit', { outputFile: '...' }],  // JUnit XML for test integrations
  ['json', { outputFile: '...' }],   // JSON for programmatic analysis
  ['html', { open: 'never' }],       // HTML for artifact download
]
```

**Features:**
- ✅ **GitHub annotations** - Failed tests appear as workflow annotations
- ✅ **JUnit XML** - Integration with test reporting tools
- ✅ **Concise logs** - Reduced console noise
- ✅ **HTML artifacts** - Downloadable reports with full details

**Example Output:**
```bash
##[group]Run npx dotenvx run -f .env.production -- playwright test
Running 15 tests using 1 worker
##[error]tests/api/auth.api.spec.ts:16:7 › Authentication API Tests @api › POST - should successfully login
15 passed (2.0s)
##[endgroup]
```

**GitHub Annotations:**
- ✅ Failed tests show in "Files changed" tab
- ✅ Click annotation to jump to the line
- ✅ Summary in workflow overview

## 📁 Report Formats

### 1. HTML Report

**Location:** `reports/html/index.html`

**Features:**
- Interactive UI with filters
- Screenshots and videos
- Stack traces
- Test timeline

**View:**
```bash
npm run test:report
# or
npx playwright show-report reports/html
```

**Local:**
- Opens automatically on test failure
- Rich interactive exploration

**CI:**
- Uploaded as workflow artifact
- Download from Actions → Artifacts
- Open locally for analysis

### 2. JSON Report

**Location:** `reports/results.json`

**Features:**
- Machine-readable format
- Programmatic analysis
- CI/CD integration

**Structure:**
```json
{
  "config": {...},
  "suites": [...],
  "stats": {
    "startTime": "2025-12-17T...",
    "duration": 1900,
    "expected": 15,
    "unexpected": 0,
    "flaky": 0,
    "skipped": 0
  }
}
```

**Use Cases:**
- Custom reporting scripts
- Metrics collection
- Trend analysis
- Integration with dashboards

### 3. JUnit XML Report (CI Only)

**Location:** `reports/junit.xml`

**Features:**
- Standard XML format
- CI tool integration
- Test history tracking

**Integrations:**
- Jenkins
- CircleCI
- TeamCity
- Azure DevOps
- GitLab CI/CD

**Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="Authentication API Tests" tests="7" failures="0" time="2.1">
    <testcase name="POST - should successfully login" time="0.611"/>
    ...
  </testsuite>
</testsuites>
```

## 🔄 Behavior Differences

### Test Execution

| Setting | Local | CI | Reason |
|---------|-------|-----|--------|
| **Retries** | 0 | 2 | Flaky tests get second chance in CI |
| **Workers** | Unlimited | 1 | CI runs sequentially for stability |
| **forbidOnly** | false | true | Prevent `.only` from reaching CI |

### Reporting

| Feature | Local | CI | Reason |
|---------|-------|-----|--------|
| **Console Output** | Detailed (`list`) | Concise (`github`) | CI logs should be scannable |
| **HTML Open** | `on-failure` | `never` | Auto-open locally, manual in CI |
| **JUnit XML** | No | Yes | CI tools need XML format |
| **GitHub Annotations** | No | Yes | Integrate with GitHub UI |

## 📈 Accessing Reports

### Local Development

```bash
# Run tests (HTML opens on failure)
npm test

# View HTML report anytime
npm run test:report

# View JSON programmatically
cat reports/results.json | jq '.stats'
```

### GitHub Actions

**Option 1: Download Artifacts**
1. Go to Actions → Your workflow run
2. Scroll to "Artifacts"
3. Download `playwright-report-production-<project>`
4. Extract and open `index.html`

**Option 2: View Annotations**
1. Check "Annotations" section in workflow summary
2. Click failed test annotations
3. See error details inline

**Option 3: Check Logs**
1. Click on failed job
2. Expand "Run Playwright tests" step
3. See concise test output

## 🎨 Customizing Reports

### Add Custom Reporter

```typescript
// playwright.config.ts
reporter: [
  ...existingReporters,
  ['./custom-reporter.ts'],  // Your custom reporter
]
```

### Modify HTML Report Theme

```typescript
reporter: [
  ['html', {
    outputFolder: 'reports/html',
    open: 'on-failure',
    host: 'localhost',
    port: 9323,
  }]
]
```

### Add Slack Notifications

```typescript
// Install: npm install -D @playwright/test-results-reporter-slack
reporter: process.env.CI
  ? [
      ['github'],
      ['junit', { outputFile: 'reports/junit.xml' }],
      ['@playwright/test-results-reporter-slack', {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
      }]
    ]
  : [...localReporters]
```

## 🔍 Analyzing Test Results

### Local Analysis

```bash
# View test duration
cat reports/results.json | jq '.suites[].suites[].specs[].tests[].results[].duration'

# Count passed/failed
cat reports/results.json | jq '.stats'

# Find slowest tests
cat reports/results.json | jq '.suites[].suites[].specs[].tests[] | select(.results[].duration > 1000)'
```

### CI Integration

**GitHub Actions:**
```yaml
- name: Analyze test results
  if: always()
  run: |
    echo "Total tests: $(jq '.stats.expected' reports/results.json)"
    echo "Passed: $(jq '.stats.expected - .stats.unexpected' reports/results.json)"
    echo "Failed: $(jq '.stats.unexpected' reports/results.json)"
```

## 📊 Report Retention

| Environment | Location | Retention | Access |
|-------------|----------|-----------|--------|
| **Local** | `reports/` | Until deleted | Direct file access |
| **GitHub** | Workflow artifacts | 30 days | Download from Actions |
| **GitLab** | Job artifacts | 30 days | Download from pipeline |
| **Bitbucket** | Pipeline artifacts | Configurable | Download from build |

## 🎯 Best Practices

### ✅ DO:
- ✅ Review HTML reports after test runs
- ✅ Use JSON for automated analysis
- ✅ Keep test execution fast (good reports depend on it)
- ✅ Check screenshots/videos in HTML report for failures
- ✅ Download CI artifacts for detailed debugging

### ❌ DON'T:
- ❌ Commit `reports/` directory to git (it's ignored)
- ❌ Rely only on console output in CI
- ❌ Ignore JUnit reports if integrating with test tools
- ❌ Skip HTML report review after failures

## 🚀 Quick Reference

```bash
# View HTML report
npm run test:report

# Run with specific reporter
npx playwright test --reporter=dot

# Generate only HTML
npx playwright test --reporter=html

# Generate multiple
npx playwright test --reporter=html --reporter=json

# Merge multiple reports (after sharding)
npx playwright merge-reports --reporter html ./blob-reports
```

## 📚 Related Documentation

- [Playwright Reporters](https://playwright.dev/docs/test-reporters)
- [GitHub Actions Annotations](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions)
- [JUnit XML Format](https://llg.cubic.org/docs/junit/)

---

**Summary:** Local gets detailed, interactive reports. CI gets concise, machine-readable reports optimized for workflow integration. Both produce HTML artifacts for detailed analysis. 📊
