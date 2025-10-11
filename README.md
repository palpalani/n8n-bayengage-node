# BayEngage n8n Community Node

This is an n8n community node that provides seamless integration with BayEngage, a powerful email marketing and automation platform. It allows you to automate your marketing workflows by connecting BayEngage with hundreds of other services through n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Examples](#examples)  
[Resources](#resources)  
[Version History](#version-history)

## Installation

### For n8n Cloud

1. In your n8n cloud instance, go to **Settings** → **Community Nodes**
2. Click **"Install a community node"**
3. Search for `n8n-nodes-bayengage`
4. Click **"Install"**
5. Wait for the installation to complete

### For Self-Hosted n8n

#### Option A: npm install (Recommended)
```bash
# In your n8n installation directory
npm install n8n-nodes-bayengage
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
docker exec -it n8n-container npm install n8n-nodes-bayengage
```

## Operations

This package includes two nodes:

### BayEngage Node
The main action node for interacting with BayEngage API:

#### Contact Operations
- **Create** - Create a new contact
- **Create or Update (Upsert)** - Create or update a contact if it already exists
- **Get** - Retrieve a contact by ID or email
- **List** - List all contacts with pagination
- **Update** - Update an existing contact

#### List Operations
- **Create** - Create a new contact list
- **Get** - Retrieve a list by ID
- **List** - List all contact lists
- **Add Contact** - Add a contact to a list
- **Remove Contact** - Remove a contact from a list

#### Campaign Operations
- **List** - List all campaigns
- **Get** - Retrieve a campaign by ID
- **Send** - Send a campaign
- **Get Reports** - Retrieve campaign performance reports

#### Template Operations
- **Create** - Create a new email template
- **Get** - Retrieve a template by ID
- **List** - List all templates

#### Event Operations
- **Track** - Track custom events for analytics

### BayEngage Trigger Node
A webhook trigger node for real-time event processing:

#### Supported Events
- **All Events** - Trigger on any BayEngage event
- **Campaign Events** - Bounced, Clicked, Opened, Sent, Unsubscribed
- **Contact Events** - Created, Deleted, Updated
- **List Events** - Created, Deleted, Updated
- **Order Events** - Created, Updated
- **Custom Events** - Support for custom event types

## Credentials

### Prerequisites
- BayEngage account with API access
- API credentials from BayEngage dashboard

### Setting Up Credentials

1. **Get BayEngage API Credentials**:
   - Log in to your BayEngage account at [https://app.bayengage.com](https://app.bayengage.com)
   - Navigate to **Settings** → **Integrations** → **Custom Integration**
   - Click **"Create New Integration"**
   - Fill in integration details and select `read` and `write` permissions
   - Copy your **Client ID** and **Client Secret**

2. **Configure in n8n**:
   - In n8n, go to **Credentials** → **Add Credential**
   - Search for "BayEngage API"
   - Fill in the credential form:

| Field | Value | Description |
|-------|-------|-------------|
| **Base URL** | `https://developer.targetbay.com/bayengage/v2` | BayEngage API base URL |
| **Client ID** | `your-client-id` | From BayEngage dashboard |
| **Client Secret** | `your-client-secret` | From BayEngage dashboard |
| **Authentication Mode** | `Client Credentials (OAuth2)` | Recommended method |
| **Scope** | `read write` | API permissions |

3. **Test Connection**:
   - Click **"Test"** to verify your credentials
   - You should see a success message

### Authentication Methods
- **Client Credentials (OAuth2)** - Recommended for server-to-server communication
- **Header Keys** - Alternative authentication method

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Node.js version**: >= 20.15
- **Tested with n8n versions**: 1.0.0+
- **BayEngage API version**: v2

## Usage

### Basic Contact Management
1. Add a **BayEngage** node to your workflow
2. Select **Contact** as the resource
3. Choose an operation (e.g., Create, List, Update)
4. Configure the required fields
5. Execute the workflow

### Webhook Integration
1. Add a **BayEngage Trigger** node to your workflow
2. Select the event types you want to listen for
3. Configure webhook security (optional)
4. Copy the webhook URL from the trigger node
5. Register the webhook in your BayEngage dashboard

### Campaign Automation
1. Use the **BayEngage** node to create and send campaigns
2. Use the **BayEngage Trigger** node to respond to campaign events
3. Combine with other n8n nodes for complex automation workflows

## Examples

Check out the example workflows in the `examples/` directory:

- **`campaign-report-to-sheets.json`** - Export campaign reports to Google Sheets
- **`contact-sync.json`** - Sync contacts between BayEngage and other platforms
- **`webhook-to-slack.json`** - Send BayEngage events to Slack notifications

### Quick Start Example
```json
{
  "nodes": [
    {
      "name": "BayEngage",
      "type": "n8n-nodes-bayengage.bayEngage",
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "email": "{{ $json.email }}",
        "firstName": "{{ $json.firstName }}",
        "lastName": "{{ $json.lastName }}"
      }
    }
  ]
}
```

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
- [BayEngage API Documentation](https://intercom.help/targetbay-bayengage/en/collections/11772762-api)
- [BayEngage Dashboard](https://app.bayengage.com)
- [n8n Community Forum](https://community.n8n.io)
- [GitHub Repository](https://github.com/bayengage/n8n-nodes-bayengage)

## Version History

### v0.1.0 (Current)
- Initial release
- Support for Contact, List, Campaign, Template, and Event operations
- Webhook trigger for real-time event processing
- OAuth2 and Header Key authentication methods
- Comprehensive error handling and retry logic

## Support

For additional help:
- **BayEngage Support**: support@bayengage.com
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)
- **GitHub Issues**: [Report bugs or request features](https://github.com/bayengage/n8n-nodes-bayengage/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.


