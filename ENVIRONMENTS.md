# Multi-Environment Setup Guide

This project supports multiple encrypted environment configurations: **production**, **staging**, and **development**.

## 📁 Environment Files

| File | Description | Status | Committed to Git |
|------|-------------|--------|------------------|
| `.env.production` | Production environment | ✅ Encrypted | ✅ Yes |
| `.env.staging` | Staging environment | ✅ Encrypted | ✅ Yes |
| `.env.development` | Development environment | ✅ Encrypted | ✅ Yes |
| `.env.example` | Template for new environments | Not encrypted | ✅ Yes |
| `.env.keys` | Private decryption keys | **🔐 SECRET** | ❌ **NO** |

## 🔑 Decryption Keys

All decryption keys are stored in `.env.keys` (which is gitignored):

```bash
# Production
DOTENV_PRIVATE_KEY=922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa

# Staging
DOTENV_PRIVATE_KEY_STAGING=0fcc5081fbf286c5e1f30999494851f8cf7f7cc6de54a66b2b04c2bdbaea395d

# Development
DOTENV_PRIVATE_KEY_DEVELOPMENT=e431127dcc5b4c4b360e8eebc2965da3c48b87f26e7060c827eb780659b462d9
```

**⚠️ IMPORTANT:** Keep these keys secure! Never commit `.env.keys` to version control.

## 🚀 Running Tests Locally

### Production Environment (default)

```bash
npm test              # All tests
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run test:headed   # With visible browser
npm run test:debug    # Debug mode
```

### Staging Environment

```bash
npm run test:staging        # All tests
npm run test:staging:ui     # UI tests only
npm run test:staging:api    # API tests only
```

### Development Environment

```bash
npm run test:dev            # All tests
npm run test:dev:ui         # UI tests only
npm run test:dev:api        # API tests only
npm run test:codegen        # Code generator (uses dev env)
```

## ⚙️ Environment Configurations

### Production (.env.production)

```env
BASE_URL=https://playwright.dev
API_BASE_URL=https://dummyjson.com
ENV=production
HEADLESS=true
```

**Use for:**
- Production deployments
- Final validation tests
- Release testing

### Staging (.env.staging)

```env
BASE_URL=https://staging.playwright.dev
API_BASE_URL=https://dummyjson.com
ENV=staging
HEADLESS=true
```

**Use for:**
- Pre-production testing
- Integration testing
- QA validation

### Development (.env.development)

```env
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8080
ENV=development
HEADLESS=false
SLOW_MO=100
```

**Use for:**
- Local development
- Debugging
- Test creation

## 🐙 GitHub Actions

### Automatic Tests (Push/PR)

When you push to `main`, `master`, or `develop`, tests run automatically with **production** environment.

### Manual Test Execution

You can manually trigger tests with a specific environment:

1. Go to: **Actions** tab in GitHub
2. Select: **Playwright Tests** workflow
3. Click: **Run workflow**
4. Select environment:
   - **production** (default)
   - **staging**
   - **development**
5. Click: **Run workflow**

### CI/CD Secrets Setup

Add these secrets to GitHub (Settings → Secrets and variables → Actions):

| Secret Name | Value | Used For |
|-------------|-------|----------|
| `DOTENV_PRIVATE_KEY` | `922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa` | Production |
| `DOTENV_PRIVATE_KEY_STAGING` | `0fcc5081fbf286c5e1f30999494851f8cf7f7cc6de54a66b2b04c2bdbaea395d` | Staging |
| `DOTENV_PRIVATE_KEY_DEVELOPMENT` | `e431127dcc5b4c4b360e8eebc2965da3c48b87f26e7060c827eb780659b462d9` | Development |

The workflow automatically selects the correct key based on the chosen environment.

## 🦊 GitLab CI

Update `.gitlab-ci.yml` to add environment variables for all three keys:

```yaml
variables:
  DOTENV_PRIVATE_KEY: $DOTENV_PRIVATE_KEY
  DOTENV_PRIVATE_KEY_STAGING: $DOTENV_PRIVATE_KEY_STAGING
  DOTENV_PRIVATE_KEY_DEVELOPMENT: $DOTENV_PRIVATE_KEY_DEVELOPMENT
```

Add the keys in: **Settings → CI/CD → Variables**

## 🪣 Bitbucket Pipelines

Add all three keys as repository variables in: **Repository settings → Repository variables**

## 🔄 Updating Environment Variables

### Option 1: Using dotenvx CLI

```bash
# Set a value in production
npx dotenvx set -f .env.production BASE_URL=https://new-url.com

# Set a value in staging
npx dotenvx set -f .env.staging BASE_URL=https://staging-new-url.com

# Set a value in development
npx dotenvx set -f .env.development BASE_URL=http://localhost:4000
```

### Option 2: Decrypt, Edit, Re-encrypt

```bash
# 1. Decrypt the environment file
npx dotenvx decrypt .env.production > .env.production.decrypted

# 2. Edit the decrypted file
nano .env.production.decrypted

# 3. Re-encrypt
npx dotenvx encrypt -f .env.production.decrypted
mv .env.production.decrypted .env.production

# 4. Clean up
rm .env.production.decrypted
```

## 🆕 Creating New Environments

To create a new environment (e.g., `qa`):

```bash
# 1. Copy the example file
cp .env.example .env.qa

# 2. Edit with your values
nano .env.qa

# 3. Encrypt it
npx dotenvx encrypt -f .env.qa

# 4. Update .gitignore to allow it
echo "!.env.qa" >> .gitignore

# 5. Add to package.json scripts
# "test:qa": "dotenvx run -f .env.qa -- playwright test"

# 6. Add the key from .env.keys to CI/CD secrets
# DOTENV_PRIVATE_KEY_QA=<key-from-env-keys>
```

## 🔍 Viewing Current Environment

To see which environment values are being used:

```bash
# Production
dotenvx run -f .env.production -- printenv | grep -E "BASE_URL|API_BASE_URL|ENV"

# Staging
dotenvx run -f .env.staging -- printenv | grep -E "BASE_URL|API_BASE_URL|ENV"

# Development
dotenvx run -f .env.development -- printenv | grep -E "BASE_URL|API_BASE_URL|ENV"
```

## 🛡️ Security Best Practices

### ✅ DO:
- ✅ Commit encrypted environment files (`.env.production`, `.env.staging`, `.env.development`)
- ✅ Add all `DOTENV_PRIVATE_KEY_*` to CI/CD secrets
- ✅ Keep `.env.keys` in `.gitignore`
- ✅ Use different keys for different environments
- ✅ Rotate keys periodically

### ❌ DON'T:
- ❌ Commit `.env.keys` file
- ❌ Share private keys in plain text
- ❌ Use production keys in development
- ❌ Commit unencrypted `.env` files

## 📊 Environment Comparison

| Feature | Production | Staging | Development |
|---------|-----------|---------|-------------|
| **URL** | playwright.dev | staging.playwright.dev | localhost:3000 |
| **API** | dummyjson.com | dummyjson.com | localhost:8080 |
| **Headless** | ✅ true | ✅ true | ❌ false |
| **Slow Motion** | 0ms | 0ms | 100ms |
| **Timeout** | 30s | 30s | 60s |
| **Use Case** | Release testing | QA validation | Local development |

## 🔄 Workflow Examples

### Development Workflow

```bash
# 1. Make changes to tests
# 2. Run locally with dev environment
npm run test:dev

# 3. When ready, test against staging
npm run test:staging

# 4. Push to GitHub (auto-tests with production)
git push origin feature-branch
```

### CI/CD Workflow

```bash
# On push to main → Runs with production automatically
# Manual trigger → Select environment in GitHub Actions UI
# Staging validation → Select "staging" from dropdown
# Development test → Select "development" from dropdown
```

## 📚 Related Documentation

- [ENCRYPTION.md](ENCRYPTION.md) - Details on encryption
- [README.md](README.md) - General setup and usage
- [SETUP.md](SETUP.md) - Quick start guide

## ❓ Troubleshooting

### Tests fail with wrong environment

**Problem:** Tests are using wrong URLs/credentials

**Solution:** Check which environment is being used:
```bash
# Verify environment selection
npm run test:staging -- --list | head -5
```

### Cannot decrypt environment file

**Problem:** "Error: unable to decrypt"

**Solution:** Make sure the corresponding `DOTENV_PRIVATE_KEY_*` is in your CI/CD secrets or in local `.env.keys` file.

### Want to sync environments

**Problem:** Need to add same variable to all environments

**Solution:**
```bash
# Add to all environments at once
npx dotenvx set -f .env.production NEW_VAR=value
npx dotenvx set -f .env.staging NEW_VAR=value
npx dotenvx set -f .env.development NEW_VAR=value
```

## 🎯 Quick Reference

```bash
# Test Commands
npm test                    # Production (default)
npm run test:staging        # Staging
npm run test:dev           # Development

# View Environment
dotenvx run -f .env.production -- printenv

# Update Variable
npx dotenvx set -f .env.production KEY=value

# Create New Environment
cp .env.example .env.new && npx dotenvx encrypt -f .env.new
```

---

**Remember:** All environment files are encrypted and safe to commit. Only `.env.keys` must stay private! 🔐
