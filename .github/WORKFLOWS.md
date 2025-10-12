# GitHub Actions Workflows

This document describes the GitHub Actions workflows configured for the n8n-nodes-bayengage project.

## Overview

The project uses GitHub Actions for continuous integration, automated testing, security scanning, dependency management, and publishing to NPM.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:** Push to `main`/`develop` branches, Pull Requests

**Jobs:**
- **Lint** - Runs ESLint and Prettier to ensure code quality
- **Test** - Runs test suite on Node.js 20.x and 22.x
- **Build** - Compiles TypeScript and verifies build output
- **Security** - Runs npm audit to check for vulnerabilities

**Purpose:** Ensures all code changes meet quality standards before merging.

**Matrix Testing:** Tests against Node.js versions 20.x and 22.x for compatibility.

---

### 2. Publish Workflow (`publish.yml`)

**Triggers:** GitHub Release published

**Steps:**
1. Checkout code
2. Install dependencies
3. Run tests and linting
4. Build package
5. Verify package contents
6. Publish to NPM with provenance

**Requirements:**
- `NPM_TOKEN` secret must be configured in repository settings
- Requires `id-token: write` permission for NPM provenance

**Purpose:** Automates NPM publishing when a new release is created on GitHub.

**How to use:**
1. Update version in `package.json`
2. Create a new GitHub Release with tag matching the version (e.g., `v0.2.0`)
3. Workflow automatically publishes to NPM

---

### 3. CodeQL Security Analysis (`codeql.yml`)

**Triggers:**
- Push to `main`/`develop` branches
- Pull Requests
- Weekly schedule (Mondays at 6 AM UTC)

**Purpose:** Automated security vulnerability scanning using GitHub's CodeQL engine.

**Queries:** Runs `security-extended` and `security-and-quality` query suites.

---

### 4. Release PR Validation (`release-pr.yml`)

**Triggers:** Pull Requests to `main` branch from `release/*` branches

**Jobs:**
- **validate-version** - Ensures version was bumped in package.json
- **pre-release-checks** - Runs comprehensive checks before release

**Checks:**
- Version bump validation
- All tests pass
- Linting passes
- Build succeeds
- Package can be installed

**Purpose:** Validates release PRs to prevent publishing issues.

---

### 5. Auto-merge Dependabot (`auto-merge-dependabot.yml`)

**Triggers:** Dependabot Pull Requests

**Behavior:**
- Runs tests and linting
- If all checks pass: Auto-approves and merges
- If checks fail: Adds comment requesting manual review

**Merge method:** Squash merge

**Purpose:** Automates dependency updates while ensuring stability.

---

## Dependabot Configuration

**File:** `.github/dependabot.yml`

**Updates:**

### NPM Dependencies
- **Frequency:** Weekly (Mondays at 6 AM UTC)
- **Max PRs:** 10 concurrent
- **Grouping:** Development dependencies grouped by type
- **Labels:** `dependencies`, `automated`

### GitHub Actions
- **Frequency:** Weekly (Mondays at 6 AM UTC)
- **Labels:** `dependencies`, `github-actions`

**Groups:**
- `development-dependencies`: Groups TypeScript, ESLint, Prettier, Vitest updates

---

## Setup Instructions

### Required Secrets

Add these secrets in your GitHub repository settings (`Settings → Secrets and variables → Actions`):

1. **`NPM_TOKEN`** (Required for publishing)
   - Go to [npmjs.com](https://www.npmjs.com/)
   - Account Settings → Access Tokens → Generate New Token
   - Select "Automation" type
   - Copy token and add to GitHub secrets

2. **`CODECOV_TOKEN`** (Optional, for code coverage)
   - Go to [codecov.io](https://codecov.io/)
   - Add your repository
   - Copy the token and add to GitHub secrets

### Branch Protection

Recommended branch protection rules for `main`:

1. Require pull request reviews
2. Require status checks to pass:
   - `Lint`
   - `Test (20.x)`
   - `Build`
3. Require branches to be up to date
4. Require signed commits (optional)

### Repository Settings

**Enable:**
- Dependabot alerts
- Dependabot security updates
- CodeQL scanning

**Permissions:**
- Actions: Read and write (for auto-merge workflow)

---

## Release Process

### Standard Release

1. Create a release branch:
   ```bash
   git checkout -b release/v0.2.0
   ```

2. Update version in `package.json`:
   ```bash
   npm version patch  # or minor, or major
   ```

3. Update README.md with changes

4. Push and create PR to `main`:
   ```bash
   git push origin release/v0.2.0
   ```

5. After PR approval and merge, create GitHub Release:
   - Go to "Releases" → "Draft a new release"
   - Tag: `v0.2.0`
   - Title: `v0.2.0`
   - Description: Release notes
   - Publish release

6. Workflow automatically publishes to NPM

### Hotfix Release

For urgent fixes:

1. Create branch from `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/v0.1.1
   ```

2. Make fix, bump version, push PR

3. After merge, create GitHub Release

---

## Troubleshooting

### Publish Fails

**Check:**
- NPM_TOKEN is valid and not expired
- Package name is available on NPM
- Version in package.json was bumped

### Tests Fail on CI but Pass Locally

**Common causes:**
- Node version mismatch
- Missing environment variables
- Cached dependencies
- Timezone differences

**Solution:**
```bash
# Test with exact CI Node version
nvm use 20
npm ci  # Use clean install
npm run test:run
```

### Dependabot PRs Not Auto-merging

**Check:**
- Tests/linting are passing
- Branch protection rules allow auto-merge
- Repository has correct permissions set

---

## Workflow Status Badges

Add these badges to your README.md:

```markdown
[![CI](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/ci.yml/badge.svg)](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/ci.yml)
[![CodeQL](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/codeql.yml/badge.svg)](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/codeql.yml)
[![npm version](https://badge.fury.io/js/n8n-nodes-bayengage.svg)](https://www.npmjs.com/package/n8n-nodes-bayengage)
```

---

## Best Practices

1. **Always bump version** before creating releases
2. **Run tests locally** before pushing
3. **Review Dependabot PRs** even if auto-merged
4. **Keep workflows up to date** with latest action versions
5. **Monitor security alerts** from CodeQL and Dependabot
6. **Test package installation** after publishing

---

## Support

For issues with workflows:
- Check workflow runs in the Actions tab
- Review logs for failed steps
- Consult GitHub Actions documentation

For n8n-specific issues:
- [n8n Community Forum](https://community.n8n.io)
- [BayEngage Support](mailto:support@bayengage.com)
