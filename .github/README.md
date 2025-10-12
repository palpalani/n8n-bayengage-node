# GitHub Actions Setup for n8n-nodes-bayengage

## Overview

This directory contains GitHub Actions workflows, issue templates, and automation configuration for the n8n-nodes-bayengage project.

## 📁 Directory Structure

```
.github/
├── workflows/               # GitHub Actions workflows
│   ├── ci.yml              # Continuous Integration
│   ├── publish.yml         # NPM Publishing
│   ├── codeql.yml          # Security Scanning
│   ├── release-pr.yml      # Release Validation
│   └── auto-merge-dependabot.yml  # Dependency Auto-merge
├── ISSUE_TEMPLATE/         # Issue templates
│   ├── bug_report.yml      # Bug report template
│   ├── feature_request.yml # Feature request template
│   └── config.yml          # Issue template config
├── dependabot.yml          # Dependabot configuration
├── PULL_REQUEST_TEMPLATE.md # PR template
├── WORKFLOWS.md            # Workflow documentation
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Enable GitHub Actions

GitHub Actions are automatically enabled when you push these workflow files to your repository.

### 2. Configure Secrets

Add the following secrets in your GitHub repository settings (`Settings → Secrets and variables → Actions`):

#### Required Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `NPM_TOKEN` | NPM publish token | [npmjs.com](https://www.npmjs.com/) → Account Settings → Access Tokens → Generate (Automation type) |

#### Optional Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `CODECOV_TOKEN` | Code coverage reporting | [codecov.io](https://codecov.io/) → Add Repository → Copy Token |

### 3. Enable Dependabot

Dependabot is automatically configured via `dependabot.yml`. Ensure Dependabot alerts and security updates are enabled in repository settings.

### 4. Configure Branch Protection

Recommended settings for `main` branch (`Settings → Branches → Add rule`):

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging:
  - `Lint`
  - `Test (20.x)`
  - `Build`
  - `Security Audit`
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ⚠️ (Optional) Require signed commits

## 📋 Workflows Explanation

### CI Workflow (`ci.yml`)

**When it runs:**
- On push to `main` or `develop`
- On pull requests

**What it does:**
- Runs ESLint and Prettier
- Tests on Node.js 20.x and 22.x
- Builds the package
- Runs security audit

**Status:** Required for PRs

### Publish Workflow (`publish.yml`)

**When it runs:**
- When a GitHub Release is published

**What it does:**
- Runs all tests
- Builds package
- Publishes to NPM with provenance

**Requirements:** `NPM_TOKEN` secret

### CodeQL Workflow (`codeql.yml`)

**When it runs:**
- On push to `main` or `develop`
- On pull requests
- Weekly (Mondays at 6 AM UTC)

**What it does:**
- Scans code for security vulnerabilities
- Runs advanced security queries

**Status:** Recommended for security

### Release PR Workflow (`release-pr.yml`)

**When it runs:**
- On PRs from `release/*` branches to `main`

**What it does:**
- Validates version bump
- Runs comprehensive pre-release checks
- Tests package installation

**Status:** Required for releases

### Auto-merge Dependabot (`auto-merge-dependabot.yml`)

**When it runs:**
- On Dependabot PRs

**What it does:**
- Runs tests and linting
- Auto-approves and merges if all checks pass
- Comments if manual review needed

**Status:** Automated maintenance

## 🔄 Release Process

### Standard Release Flow

1. **Create Release Branch**
   ```bash
   git checkout -b release/v0.2.0
   ```

2. **Bump Version**
   ```bash
   npm version patch  # or minor, major
   ```

3. **Update Documentation**
   - Update README.md with changes
   - Add entry to CHANGELOG (if exists)

4. **Create PR to Main**
   ```bash
   git push origin release/v0.2.0
   ```
   - Create PR from `release/v0.2.0` → `main`
   - Wait for CI checks to pass
   - Get approval and merge

5. **Create GitHub Release**
   - Go to Releases → Draft a new release
   - Tag: `v0.2.0`
   - Title: `v0.2.0`
   - Description: Release notes
   - Publish release

6. **Automatic NPM Publish**
   - Publish workflow automatically runs
   - Package published to NPM with provenance

### Hotfix Flow

For urgent production fixes:

```bash
git checkout main
git pull
git checkout -b hotfix/v0.1.1
# Make fixes
npm version patch
git push origin hotfix/v0.1.1
# Create PR → main → Merge → Release
```

## 🛡️ Security Features

### CodeQL Analysis
- Automated security vulnerability scanning
- Runs on every push and PR
- Weekly scheduled scans

### NPM Audit
- Runs on every CI build
- Checks for known vulnerabilities
- Fails on high/critical issues

### Dependabot
- Automated dependency updates
- Security vulnerability alerts
- Auto-merges safe updates

### NPM Provenance
- Package provenance enabled
- Verifiable build attestation
- Enhanced supply chain security

## 📊 Monitoring

### Workflow Status

View workflow runs:
- Repository → Actions tab
- Check individual workflow runs
- Review logs for failures

### Status Badges

Add to README.md:

```markdown
[![CI](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/ci.yml/badge.svg)](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/ci.yml)
[![CodeQL](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/codeql.yml/badge.svg)](https://github.com/bayengage/n8n-nodes-bayengage/actions/workflows/codeql.yml)
[![npm version](https://badge.fury.io/js/n8n-nodes-bayengage.svg)](https://www.npmjs.com/package/n8n-nodes-bayengage)
```

## 🐛 Troubleshooting

### Common Issues

#### "NPM_TOKEN not found"
**Solution:** Add NPM_TOKEN secret to repository settings

#### "Tests pass locally but fail on CI"
**Causes:**
- Node version mismatch
- Missing environment variables
- Cached dependencies

**Solution:**
```bash
nvm use 20
npm ci
npm run test:run
```

#### "Dependabot PRs not auto-merging"
**Causes:**
- Branch protection rules
- Failed tests
- Missing permissions

**Solution:** Check Actions logs and branch protection settings

#### "Cannot publish to NPM"
**Causes:**
- Version not bumped
- NPM token expired
- Package name taken

**Solution:** Verify version, token validity, and package availability

## 📚 Additional Resources

- [WORKFLOWS.md](./WORKFLOWS.md) - Detailed workflow documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)

## 🤝 Contributing

See [PULL_REQUEST_TEMPLATE.md](./PULL_REQUEST_TEMPLATE.md) for PR guidelines.

## 💬 Support

- GitHub Issues: Bug reports and feature requests
- n8n Community: [community.n8n.io](https://community.n8n.io)
- BayEngage Support: support@bayengage.com
