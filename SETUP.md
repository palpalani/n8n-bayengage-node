# BayEngage n8n Node Setup Guide

This guide will walk you through setting up the BayEngage n8n community node for both self-hosted and cloud deployments.

## Prerequisites

- n8n instance (self-hosted or cloud)
- BayEngage account with API access
- Node.js >= 20.15 (for self-hosted installations)

## Step 1: Get BayEngage API Credentials

### 1.1 Access BayEngage Dashboard
1. Log in to your BayEngage account at [https://app.bayengage.com](https://app.bayengage.com)
2. Navigate to **Settings** → **Integrations** → **Custom Integration**

### 1.2 Create API Integration
1. Click **"Create New Integration"**
2. Fill in the integration details:
   - **Name**: `n8n Integration` (or your preferred name)
   - **Description**: `Integration for n8n automation workflows`
   - **Permissions**: Select `read` and `write` permissions
3. Click **"Create Integration"**

### 1.3 Copy Credentials
After creating the integration, you'll see:
- **Client ID**: Copy this value
- **Client Secret**: Copy this value (keep it secure!)

## Step 2: Install the Node

### For n8n Cloud

1. In your n8n cloud instance, go to **Settings** → **Community Nodes**
2. Click **"Install a community node"**
3. Search for `@bayengage/n8n-nodes-bayengage`
4. Click **"Install"**
5. Wait for the installation to complete

### For Self-Hosted n8n

#### Option A: npm install (Recommended)
```bash
# In your n8n installation directory
npm install @bayengage/n8n-nodes-bayengage
```

#### Option B: Manual Installation
1. Clone the repository:
```bash
git clone https://github.com/bayengage/n8n-nodes-bayengage.git
cd n8n-nodes-bayengage
npm install
npm run build
```

2. Copy the built files to your n8n custom nodes directory:
```bash
cp -r dist/* /path/to/n8n/custom/nodes/
```

#### Option C: Docker Installation
Add to your `docker-compose.yml`:
```yaml
services:
  n8n:
    image: n8nio/n8n
    volumes:
      - ./custom-nodes:/home/node/.n8n/custom
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
```

Then install the package:
```bash
docker exec -it n8n-container npm install @bayengage/n8n-nodes-bayengage
```

## Step 3: Configure Credentials

### 3.1 Create BayEngage Credentials
1. In n8n, go to **Credentials** → **Add Credential**
2. Search for "BayEngage API"
3. Fill in the credential form:

| Field | Value | Description |
|-------|-------|-------------|
| **Base URL** | `https://developer.targetbay.com/bayengage/v2` | BayEngage API base URL |
| **Client ID** | `your-client-id` | From BayEngage dashboard |
| **Client Secret** | `your-client-secret` | From BayEngage dashboard |
| **Authentication Mode** | `Client Credentials (OAuth2)` | Recommended method |
| **Scope** | `read write` | API permissions |

### 3.2 Test Connection
1. Click **"Test"** to verify your credentials
2. You should see a success message
3. If it fails, double-check your credentials and try again

## Step 4: Set Up Webhooks (Optional)

### 4.1 Configure BayEngage Trigger Node
1. Add a **BayEngage Trigger** node to your workflow
2. Configure the trigger:
   - **Event Type**: Select events you want to listen for
   - **Verify Webhook Signature**: Enable for security
   - **Webhook Secret**: Set a secret for signature verification

### 4.2 Register Webhook in BayEngage
1. Copy the webhook URL from the trigger node
2. In BayEngage dashboard, go to **Settings** → **Webhooks**
3. Click **"Add Webhook"**
4. Paste the webhook URL
5. Select the events to send
6. Set the webhook secret (if using signature verification)
7. Click **"Save"**

## Step 5: Test Your Setup

### 5.1 Test Actions Node
1. Create a new workflow
2. Add a **BayEngage** node
3. Configure it to list contacts
4. Execute the workflow
5. Verify you receive contact data

### 5.2 Test Trigger Node
1. Create a test contact in BayEngage
2. Check if your webhook receives the event
3. Verify the event data in n8n

## Troubleshooting

### Common Issues

#### "Invalid credentials" error
- **Cause**: Incorrect Client ID or Client Secret
- **Solution**: Double-check credentials in BayEngage dashboard
- **Check**: Ensure API access is enabled for your account

#### "Webhook not receiving events"
- **Cause**: Webhook URL not accessible or misconfigured
- **Solution**: 
  - Verify webhook URL is publicly accessible
  - Check BayEngage webhook configuration
  - Ensure event types are selected correctly

#### "Rate limit exceeded"
- **Cause**: Too many API requests
- **Solution**: 
  - The node automatically retries with backoff
  - Reduce frequency of API calls
  - Check your BayEngage plan's rate limits

#### "Node not found" error
- **Cause**: Node not properly installed
- **Solution**:
  - Restart n8n after installation
  - Check node installation in n8n logs
  - Verify package is in correct directory

### Debug Mode

Enable debug logging to troubleshoot issues:

1. Set environment variable:
```bash
export N8N_LOG_LEVEL=debug
```

2. Or in n8n configuration:
```json
{
  "logging": {
    "level": "debug"
  }
}
```

3. Check logs for detailed request/response information

### Getting Help

- **Documentation**: Check the [README](README.md) for detailed usage
- **Examples**: See the `examples/` directory for sample workflows
- **Issues**: Report problems on [GitHub Issues](https://github.com/bayengage/n8n-nodes-bayengage/issues)
- **Support**: Contact support@bayengage.com

## Security Best Practices

### Credential Security
- Never share your Client Secret
- Use environment variables for production deployments
- Regularly rotate your API keys
- Enable webhook signature verification

### Network Security
- Use HTTPS for all webhook URLs
- Restrict webhook access by IP if possible
- Monitor webhook logs for suspicious activity

### Data Privacy
- Be mindful of PII in your workflows
- Use data transformation nodes to filter sensitive information
- Follow your organization's data handling policies

## Next Steps

1. **Explore Examples**: Check out the example workflows in the `examples/` directory
2. **Build Workflows**: Create your own automation workflows
3. **Monitor Performance**: Use n8n's execution logs to monitor workflow performance
4. **Scale Up**: Consider upgrading your BayEngage plan for higher rate limits

## Support

For additional help:
- **BayEngage Support**: support@bayengage.com
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)
- **GitHub Issues**: [Report bugs or request features](https://github.com/bayengage/n8n-nodes-bayengage/issues)
