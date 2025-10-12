# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-10-12

### Added
- Initial release of BayEngage n8n community node
- **Contact Operations**: Create, Get, List, Update, Create or Update (Upsert)
- **List Operations**: Create, Get, List, Add Contact, Remove Contact
- **Campaign Operations**: List, Get, Send, Get Reports
- **Template Operations**: Create, Get, List
- **Event Operations**: Track custom events
- **Webhook Trigger Node**: Real-time event processing for:
  - Campaign events (bounced, clicked, opened, sent, unsubscribed)
  - Contact events (created, deleted, updated)
  - List events (created, deleted, updated)
  - Order events (created, updated)
  - Custom events
- **Authentication Methods**:
  - Client Credentials (OAuth2) - Recommended
  - Header Keys authentication
- **Advanced Features**:
  - Automatic token caching with expiry management
  - Retry logic with exponential backoff
  - Rate limiting support (respects Retry-After headers)
  - Comprehensive error handling
- **Developer Experience**:
  - TypeScript with strict mode
  - Comprehensive test suite (28 tests)
  - ESLint configuration with n8n-specific rules
  - GitHub Actions CI/CD pipeline
  - Dependabot for automated dependency updates
  - CodeQL security scanning
- **Documentation**:
  - Comprehensive README with installation guides
  - 20+ workflow examples for common use cases
  - API reference links
  - Troubleshooting guide

### Security
- Form-data dependency updated to v4.0.4 (fixes critical security vulnerability)
- Zero production dependencies (except peer dependency on n8n-workflow)
- Secure credential handling via n8n credential system
- All API calls use HTTPS

[unreleased]: https://github.com/bayengage/n8n-nodes-bayengage/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/bayengage/n8n-nodes-bayengage/releases/tag/v0.1.0
