# Environment Variable Encryption Guide

This project uses **dotenvx** for secure environment variable encryption. Your `.env` file is encrypted and safe to commit to version control.

## 🔐 How It Works

- **`.env`** - Contains encrypted values (safe to commit)
- **`.env.keys`** - Contains the private decryption key (NEVER commit this!)
- **`DOTENV_PRIVATE_KEY`** - The key needed to decrypt values

## 📋 What's Already Done

✅ Your `.env` file has been encrypted with dotenvx
✅ All sensitive values are encrypted with `encrypted:` prefix
✅ `.env.keys` is in `.gitignore` and will NOT be committed
✅ Encrypted `.env` is safe to commit to version control

## 🔑 Your Decryption Key

Your private decryption key is stored in `.env.keys`:

```
DOTENV_PRIVATE_KEY=922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa
```

**⚠️ IMPORTANT:** Keep this key secure and NEVER commit it to version control!

## 🚀 Usage

### Running Tests Locally

Tests automatically decrypt the `.env` file:

```bash
npm test              # Automatically decrypts and runs tests
npm run test:ui       # Automatically decrypts and runs UI tests
npm run test:api      # Automatically decrypts and runs API tests
```

All npm scripts use `dotenvx run --` which handles decryption automatically.

### Manual Decryption (if needed)

```bash
# Run any command with decrypted environment
npx dotenvx run -- <your-command>

# Example:
npx dotenvx run -- node app.js
```

## 🔧 CI/CD Setup

To use the encrypted `.env` in CI/CD, add the `DOTENV_PRIVATE_KEY` as a secret:

### GitHub Actions

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Click: **New repository secret**
3. Name: `DOTENV_PRIVATE_KEY`
4. Value: `922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa`
5. Click: **Add secret**

The GitHub workflow is already configured to use it:

```yaml
env:
  CI: true
  HOME: /root
  DOTENV_PRIVATE_KEY: ${{ secrets.DOTENV_PRIVATE_KEY }}
```

### GitLab CI

1. Go to: **Settings** → **CI/CD** → **Variables**
2. Click: **Add variable**
3. Key: `DOTENV_PRIVATE_KEY`
4. Value: `922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa`
5. Uncheck: **Protect variable** (unless only for protected branches)
6. Check: **Mask variable**
7. Click: **Add variable**

The GitLab CI config is already set up:

```yaml
variables:
  DOTENV_PRIVATE_KEY: $DOTENV_PRIVATE_KEY
```

### Bitbucket Pipelines

1. Go to: **Repository settings** → **Repository variables**
2. Click: **Add variable**
3. Name: `DOTENV_PRIVATE_KEY`
4. Value: `922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa`
5. Check: **Secured**
6. Click: **Add**

## 🔄 Updating Environment Variables

### 1. Decrypt the .env file first

```bash
# Decrypt to see current values
npx dotenvx decrypt .env > .env.decrypted
```

### 2. Edit the decrypted file

```bash
# Edit the decrypted file
nano .env.decrypted
# or
code .env.decrypted
```

### 3. Re-encrypt with your changes

```bash
# Replace encrypted .env with new encrypted version
npx dotenvx encrypt .env.decrypted -o .env

# Clean up
rm .env.decrypted
```

### Quick Update Method

```bash
# Decrypt, edit, and re-encrypt in one go
npx dotenvx set BASE_URL=https://new-url.com
```

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Commit the encrypted `.env` file
- ✅ Add `DOTENV_PRIVATE_KEY` to CI/CD secrets
- ✅ Keep `.env.keys` in `.gitignore`
- ✅ Rotate keys periodically
- ✅ Use different keys for different environments

### ❌ DON'T:
- ❌ Commit `.env.keys` file
- ❌ Share `DOTENV_PRIVATE_KEY` in plain text (use secure channels)
- ❌ Commit unencrypted `.env` files
- ❌ Store the private key in your code

## 🔄 Key Rotation

If you need to rotate the encryption key:

```bash
# 1. Decrypt current .env
npx dotenvx decrypt .env > .env.temp

# 2. Delete old keys
rm .env.keys

# 3. Re-encrypt with new key
npx dotenvx encrypt .env.temp -o .env

# 4. Update DOTENV_PRIVATE_KEY in CI/CD with new key from .env.keys

# 5. Clean up
rm .env.temp
```

## 🌍 Multiple Environments

You can create encrypted files for different environments:

```bash
# Encrypt for production
npx dotenvx encrypt -e production

# Encrypt for staging
npx dotenvx encrypt -e staging

# Encrypt for development
npx dotenvx encrypt -e development
```

This creates:
- `.env.production`
- `.env.staging`
- `.env.development`

And corresponding keys in `.env.keys`.

## 🔍 Viewing Encrypted Values

To see what's currently encrypted:

```bash
# View encrypted values
cat .env

# Decrypt and view (doesn't modify file)
npx dotenvx run -- printenv | grep -E "BASE_URL|API_BASE_URL"
```

## 📚 Additional Resources

- **dotenvx Documentation:** https://dotenvx.com
- **Encryption Guide:** https://dotenvx.com/docs/encryption
- **CI/CD Integration:** https://dotenvx.com/docs/ci-cd

## ❓ Troubleshooting

### Tests fail with "missing environment variable"

**Solution:** Make sure `DOTENV_PRIVATE_KEY` is set in your CI/CD secrets.

### "Error: unable to decrypt"

**Solution:** The `DOTENV_PRIVATE_KEY` is incorrect or missing. Check your `.env.keys` file locally or CI/CD secrets.

### Want to start over?

```bash
# Remove encryption and start fresh
rm .env.keys
cp .env.example .env
# Edit .env with real values
npx dotenvx encrypt
```

## 🎯 Quick Reference

```bash
# Encrypt .env file
npx dotenvx encrypt

# Decrypt and run command
npx dotenvx run -- <command>

# View decrypted values (for debugging)
npx dotenvx get BASE_URL

# Set a new encrypted value
npx dotenvx set NEW_VAR=value

# Run tests (auto-decrypts)
npm test
```

---

**Remember:** Your `DOTENV_PRIVATE_KEY` is:
```
922cb58df778b186f5adbdf8c1d704d879be92a3237f100f993751df77e504aa
```

Store this securely! 🔐
