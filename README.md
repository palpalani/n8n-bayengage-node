# BayEngage n8n Community Node

This is an n8n community node that provides seamless integration with BayEngage, a powerful email marketing and automation platform. It allows you to automate your marketing workflows by connecting BayEngage with hundreds of other services through n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Workflow Examples Library](#workflow-examples-library)  
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

## Workflow Examples Library

A comprehensive collection of production-ready n8n workflow examples that demonstrate how to use the `n8n-node-bayengage` community node for various marketing automation scenarios.

### 1️⃣ Lifecycle / Drip & Nurture Campaigns

#### Welcome Series
**Description**: Automated welcome email sequence for new subscribers with personalized content based on signup source and user preferences.

**Trigger**: BayEngage Trigger (contact.created) → Filter by signup source
**Example Node Sequence**: 
- BayEngage Trigger → Filter → Switch (by signup source) → BayEngage (Create Campaign) → BayEngage (Send Campaign) → Slack Notification

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/templates`
**Optional AI Extension**: Use OpenAI to generate personalized welcome content based on user profile data

**File**: `examples/welcome-series.json`

---

#### Abandoned Cart Recovery
**Description**: Multi-stage abandoned cart recovery with escalating urgency and personalized offers.

**Trigger**: BayEngage Trigger (order.created) → Filter (abandoned status)
**Example Node Sequence**: 
- BayEngage Trigger → Wait (1 hour) → BayEngage (Get Contact) → BayEngage (Create Campaign) → BayEngage (Send Campaign) → Wait (24 hours) → Follow-up Campaign

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/events`
**Optional AI Extension**: AI-powered discount optimization based on cart value and user behavior

**File**: `examples/abandoned-cart-recovery.json`

---

#### Post-Purchase Follow-Up
**Description**: Automated follow-up sequence after purchase completion with order details, shipping updates, and cross-sell opportunities.

**Trigger**: BayEngage Trigger (order.created)
**Example Node Sequence**: 
- BayEngage Trigger → Filter (order status) → BayEngage (Get Contact) → BayEngage (Create Campaign) → BayEngage (Send Campaign) → CRM Update

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/events`
**Optional AI Extension**: AI-powered product recommendations based on purchase history and user preferences

**File**: `examples/post-purchase-followup.json`

---

### 2️⃣ Campaign Optimization & Testing

#### A/B Test Campaign
**Description**: Automated A/B testing workflow that creates multiple campaign variants and measures performance to determine winning content.

**Trigger**: Manual trigger or schedule
**Example Node Sequence**: 
- Manual Trigger → BayEngage (Create Campaign A) → BayEngage (Create Campaign B) → BayEngage (Send Campaign A) → BayEngage (Send Campaign B) → Wait (24 hours) → BayEngage (Get Reports) → Google Sheets (Log Results)

**BayEngage Endpoints**: `/campaigns`, `/campaigns/{id}/reports`
**Optional AI Extension**: AI-powered variant generation and statistical significance analysis

**File**: `examples/ab-test-campaign.json`

---

#### Send-Time Optimization
**Description**: Dynamic send-time optimization based on individual user engagement patterns and timezone data.

**Trigger**: Schedule Trigger (hourly)
**Example Node Sequence**: 
- Schedule Trigger → BayEngage (List Contacts) → Filter (by timezone) → BayEngage (Get Contact Engagement) → Switch (by optimal send time) → BayEngage (Send Campaign)

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/events`
**Optional AI Extension**: Machine learning model to predict optimal send times per user based on historical engagement data

**File**: `examples/send-time-optimization.json`

---

### 3️⃣ Newsletter & Content Campaigns

#### Newsletter Aggregation (RSS → Email)
**Description**: Automated newsletter creation by aggregating content from multiple RSS feeds and sending curated content to subscribers.

**Trigger**: Schedule Trigger (daily/weekly)
**Example Node Sequence**: 
- Schedule Trigger → RSS Feed Reader → Content Aggregator → OpenAI (Summarize Content) → BayEngage (Create Template) → BayEngage (Create Campaign) → BayEngage (Send Campaign)

**BayEngage Endpoints**: `/templates`, `/campaigns`
**Optional AI Extension**: AI-powered content curation, summarization, and personalized content recommendations

**File**: `examples/newsletter-rss-aggregation.json`

---

#### Weekly Digest Automation
**Description**: Automated weekly digest emails with personalized content, product updates, and user-specific recommendations.

**Trigger**: Schedule Trigger (weekly)
**Example Node Sequence**: 
- Schedule Trigger → BayEngage (List Contacts) → Filter (by preferences) → Content Aggregator → BayEngage (Create Campaign) → BayEngage (Send Campaign) → Analytics Log

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/templates`
**Optional AI Extension**: AI-powered content personalization and user preference learning

**File**: `examples/weekly-digest-automation.json`

---

### 4️⃣ Transactional & Behavioural Campaigns

#### Order Confirmation
**Description**: Automated order confirmation emails with order details, tracking information, and next steps.

**Trigger**: BayEngage Trigger (order.created)
**Example Node Sequence**: 
- BayEngage Trigger → Filter (order status) → BayEngage (Get Contact) → BayEngage (Create Campaign) → BayEngage (Send Campaign) → CRM Update

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/events`
**Optional AI Extension**: AI-powered order confirmation personalization and cross-sell recommendations

**File**: `examples/order-confirmation.json`

---

#### Review Request
**Description**: Automated review request campaigns with personalized messaging and incentive offers.

**Trigger**: BayEngage Trigger (order.updated) → Filter (delivered status)
**Example Node Sequence**: 
- BayEngage Trigger → Wait (3 days) → BayEngage (Get Contact) → BayEngage (Create Campaign) → BayEngage (Send Campaign) → Review Platform Integration

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/events`
**Optional AI Extension**: AI-powered review request timing optimization and personalized incentive offers

**File**: `examples/review-request.json`

---

### 5️⃣ Data-Driven & Cross-Channel Campaigns

#### Churn Prediction Alert (AI-powered)
**Description**: AI-powered churn prediction system that identifies at-risk customers and triggers retention campaigns.

**Trigger**: Schedule Trigger (daily)
**Example Node Sequence**: 
- Schedule Trigger → BayEngage (List Contacts) → AI Model (Churn Prediction) → Filter (high risk) → BayEngage (Create Campaign) → BayEngage (Send Campaign) → CRM Alert

**BayEngage Endpoints**: `/contacts`, `/campaigns`, `/events`
**Optional AI Extension**: Machine learning model for churn prediction using engagement data, purchase history, and behavioral patterns

**File**: `examples/churn-prediction-alert.json`

---

#### Multi-Channel Sync (Email + SMS)
**Description**: Coordinated multi-channel campaigns that sync email and SMS messaging for maximum reach and engagement.

**Trigger**: BayEngage Trigger (contact.created)
**Example Node Sequence**: 
- BayEngage Trigger → BayEngage (Create Campaign) → BayEngage (Send Campaign) → SMS Service (Send SMS) → Analytics Aggregation

**BayEngage Endpoints**: `/contacts`, `/campaigns`
**Optional AI Extension**: AI-powered channel optimization and message personalization across channels

**File**: `examples/multi-channel-sync.json`

---

### 6️⃣ Operations, Analytics & Reporting

#### Campaign Performance Dashboard
**Description**: Automated campaign performance monitoring and dashboard updates with real-time metrics and insights.

**Trigger**: Schedule Trigger (hourly)
**Example Node Sequence**: 
- Schedule Trigger → BayEngage (List Campaigns) → BayEngage (Get Reports) → Data Transformation → Dashboard Update → Slack Notification

**BayEngage Endpoints**: `/campaigns`, `/campaigns/{id}/reports`
**Optional AI Extension**: AI-powered performance insights and optimization recommendations

**File**: `examples/campaign-performance-dashboard.json`

---

#### Monthly KPI Summary
**Description**: Automated monthly KPI reporting with performance summaries, trends analysis, and actionable insights.

**Trigger**: Schedule Trigger (monthly)
**Example Node Sequence**: 
- Schedule Trigger → BayEngage (Get Reports) → Data Aggregation → Report Generation → Email Distribution → Slack Notification

**BayEngage Endpoints**: `/campaigns`, `/campaigns/{id}/reports`
**Optional AI Extension**: AI-powered trend analysis and predictive insights

**File**: `examples/monthly-kpi-summary.json`

---

### 7️⃣ Advanced AI-Powered Concepts

#### Automated Campaign Creation Pipeline
**Description**: End-to-end automated campaign creation using AI to generate content, optimize timing, and execute campaigns without manual intervention.

**Trigger**: Schedule Trigger or Manual
**Example Node Sequence**: 
- Trigger → OpenAI (Generate Content) → BayEngage (Create Template) → BayEngage (Create Campaign) → AI Optimization → BayEngage (Send Campaign) → Performance Monitoring

**BayEngage Endpoints**: `/templates`, `/campaigns`
**AI Extension**: OpenAI GPT integration for content generation, subject line optimization, and campaign strategy development

**File**: `examples/ai-campaign-creation.json`

---

#### AI-Segment Generator
**Description**: AI-powered dynamic segment creation based on user behavior analysis, engagement patterns, and predictive modeling.

**Trigger**: Schedule Trigger (daily)
**Example Node Sequence**: 
- Schedule Trigger → BayEngage (List Contacts) → AI Analysis (Behavior Patterns) → BayEngage (Create List) → BayEngage (Add Contacts) → Campaign Automation

**BayEngage Endpoints**: `/contacts`, `/lists`, `/campaigns`
**AI Extension**: Machine learning models for behavioral analysis, predictive segmentation, and dynamic list management

**File**: `examples/ai-segment-generator.json`

---

## Basic Examples

Check out the basic example workflows in the `examples/` directory:

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

## Getting Started

1. **Install the n8n-node-bayengage package** in your n8n instance
2. **Configure BayEngage API credentials** in n8n
3. **Import the workflow examples** from the `examples/` directory
4. **Customize the workflows** to match your specific use cases
5. **Test and deploy** your automated marketing campaigns

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
- [BayEngage API Documentation](https://help.targetbay.com/s/topic/0TOe20000000CCTGA2/bayengage)
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
