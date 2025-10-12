# BayEngage Email Automation Workflows

This directory contains AI-powered email automation workflows that integrate BayEngage with various AI services to create intelligent, automated email marketing solutions.

## Overview

All workflows follow a consistent pattern:
- **AI Processing**: Text analysis, embeddings, vector search, and intelligent content generation
- **BayEngage Integration**: Contact management, campaign creation, email sending, and event tracking
- **Logging & Alerts**: Google Sheets logging and Slack notifications for monitoring

## Available Workflows

### 1. Auto Reply to FAQs (`auto-reply-to-faqs.json`)
**Purpose**: AI-powered FAQ auto-reply system using BayEngage for email delivery.

**Features**:
- Processes incoming questions through vector search
- Generates intelligent responses using RAG (Retrieval-Augmented Generation)
- Sends personalized replies via BayEngage campaigns
- Tracks contact interactions and FAQ performance

**AI Components**: Cohere Embeddings, Pinecone Vector Store, Anthropic Claude
**BayEngage Operations**: Contact upsert, Template retrieval, Campaign sending

### 2. Auto Archive Promotions (`auto-archive-promotions.json`)
**Purpose**: AI-powered promotion archiving system using BayEngage.

**Features**:
- Analyzes campaign performance data
- Automatically identifies campaigns for archiving
- Provides intelligent insights for optimization
- Tracks campaign analytics via BayEngage

**AI Components**: OpenAI Embeddings, Pinecone Vector Store, OpenAI GPT
**BayEngage Operations**: Campaign listing, Campaign reports, Event tracking

### 3. Daily Email Digest (`daily-email-digest.json`)
**Purpose**: AI-powered daily email digest system using BayEngage.

**Features**:
- Analyzes content and generates personalized digests
- Creates dynamic email templates
- Sends targeted campaigns to segmented contact lists
- Tracks engagement and performance metrics

**AI Components**: OpenAI Embeddings, Supabase Vector Store, Anthropic Claude
**BayEngage Operations**: Contact listing, Template creation, Campaign creation & sending

### 4. Follow-up Emails (`follow-up-emails.json`)
**Purpose**: AI-powered follow-up email automation using BayEngage.

**Features**:
- Analyzes customer interactions and behavior patterns
- Determines optimal follow-up timing and content
- Creates personalized follow-up campaigns
- Tracks engagement and response rates

**AI Components**: OpenAI Embeddings, Weaviate Vector Store, Anthropic Claude
**BayEngage Operations**: Contact upsert, Template retrieval, Campaign creation & sending

### 5. Forward Attachments (`forward-attachments.json`)
**Purpose**: AI-powered attachment forwarding system using BayEngage.

**Features**:
- Analyzes email attachments and content
- Determines appropriate recipients and forwarding strategy
- Creates dynamic email templates for forwarded content
- Tracks forwarding activity and engagement

**AI Components**: OpenAI Embeddings, Pinecone Vector Store, OpenAI GPT
**BayEngage Operations**: Contact listing, Template creation, Campaign creation & sending

### 6. Lead to BayEngage (`lead-to-bayengage.json`)
**Purpose**: AI-powered lead processing system using BayEngage.

**Features**:
- Analyzes incoming leads with AI insights
- Enriches lead data with quality scores and segmentation
- Automatically adds leads to appropriate contact lists
- Triggers welcome campaigns and event tracking

**AI Components**: Cohere Embeddings, Supabase Vector Store, Anthropic Claude
**BayEngage Operations**: Contact upsert, List management, Event tracking, Campaign creation

### 7. BayEngage Campaign Tracking (`bayengage-campaign-tracking.json`)
**Purpose**: AI-powered campaign tracking system using BayEngage.

**Features**:
- Monitors campaign performance in real-time
- Analyzes engagement metrics and bounce rates
- Provides intelligent optimization recommendations
- Tracks campaign events and performance data

**AI Components**: OpenAI Embeddings, Supabase Vector Store, Anthropic Claude
**BayEngage Operations**: Campaign listing, Campaign reports, Event tracking

### 8. Parse Invoice Emails (`parse-invoice-emails.json`)
**Purpose**: AI-powered invoice email parsing system using BayEngage.

**Features**:
- Extracts key invoice data (amount, due date, vendor, etc.)
- Generates automated follow-up campaigns
- Tracks invoice processing events
- Manages vendor contact information

**AI Components**: OpenAI Embeddings, Weaviate Vector Store, Anthropic Claude
**BayEngage Operations**: Contact upsert, Template retrieval, Campaign creation, Event tracking

### 9. Product Launch Email (`product-launch-email.json`)
**Purpose**: AI-powered product launch email system using BayEngage.

**Features**:
- Analyzes product data and generates compelling content
- Creates dynamic email templates for product launches
- Executes targeted campaigns to segmented audiences
- Tracks launch performance and engagement

**AI Components**: Cohere Embeddings, Supabase Vector Store, OpenAI GPT
**BayEngage Operations**: Contact listing, Template creation, Campaign creation & sending, Event tracking

### 10. BayEngage Bounce Alert (`bayengage-bounce-alert.json`)
**Purpose**: AI-powered bounce alert system using BayEngage.

**Features**:
- Monitors email bounces and analyzes patterns
- Automatically manages contact lists based on bounce types
- Tracks bounce events and contact updates
- Provides intelligent bounce management recommendations

**AI Components**: OpenAI Embeddings, Weaviate Vector Store, Anthropic Claude
**BayEngage Operations**: Contact retrieval & updates, Event tracking, List management

## Prerequisites

### Required Credentials

1. **BayEngage API** (`bayEngageApi`)
   - Client ID and Client Secret for OAuth2 authentication
   - Or Public ID and Client Secret for header-based authentication

2. **AI Services** (choose based on workflow):
   - **OpenAI API** (`openAiApi`) - For GPT models and embeddings
   - **Anthropic API** (`anthropicApi`) - For Claude models
   - **Cohere API** (`cohereApi`) - For Cohere embeddings

3. **Vector Stores** (choose based on workflow):
   - **Pinecone API** (`pineconeApi`) - For Pinecone vector storage
   - **Supabase API** (`supabaseApi`) - For Supabase vector storage
   - **Weaviate API** (`weaviateApi`) - For Weaviate vector storage

4. **Logging & Alerts**:
   - **Google Sheets API** (`googleSheetsOAuth2Api`) - For workflow logging
   - **Slack API** (`slackApi`) - For error notifications

### Required Setup

1. **BayEngage Account**: Set up your BayEngage account and obtain API credentials
2. **AI Services**: Configure your preferred AI service providers
3. **Vector Database**: Set up your chosen vector database for content storage
4. **Google Sheets**: Create a spreadsheet for workflow logging
5. **Slack Workspace**: Set up a Slack channel for alerts

## Workflow Structure

Each workflow follows this pattern:

```
Webhook Trigger → AI Processing Chain → BayEngage Operations → Logging & Alerts
```

### AI Processing Chain
- **Text Splitter**: Breaks down content into manageable chunks
- **Embeddings**: Converts text to vector representations
- **Vector Store**: Stores and retrieves relevant content
- **RAG Agent**: Generates intelligent responses using retrieved context

### BayEngage Operations
- **Contact Management**: Create, update, and retrieve contact information
- **Template Management**: Create and retrieve email templates
- **Campaign Management**: Create and send email campaigns
- **Event Tracking**: Track user interactions and campaign events
- **List Management**: Add/remove contacts from mailing lists

### Logging & Alerts
- **Google Sheets**: Logs workflow execution and results
- **Slack Alerts**: Notifies of errors and important events

## Usage

1. **Import Workflows**: Import the desired JSON files into your n8n instance
2. **Configure Credentials**: Set up all required API credentials
3. **Customize Parameters**: Adjust workflow parameters for your specific use case
4. **Test Workflows**: Run test executions to verify everything works correctly
5. **Deploy**: Activate workflows for production use

## Customization

### Modifying AI Prompts
Update the `systemMessage` in the RAG Agent nodes to customize AI behavior for your specific use case.

### Adjusting BayEngage Operations
Modify the BayEngage node parameters to match your contact lists, templates, and campaign preferences.

### Customizing Logging
Update the Google Sheets column mappings to track additional data points relevant to your business.

## Monitoring

- **Google Sheets**: Monitor workflow execution and results
- **Slack Alerts**: Receive real-time notifications of errors
- **BayEngage Dashboard**: Track campaign performance and contact engagement
- **n8n Execution Logs**: Review detailed execution logs for debugging

## Support

For issues or questions:
1. Check the n8n execution logs for detailed error information
2. Verify all credentials are properly configured
3. Ensure BayEngage API access and permissions are correct
4. Review the workflow connections and parameter mappings

## Contributing

To add new workflows or improve existing ones:
1. Follow the established pattern of AI processing → BayEngage operations → Logging
2. Include comprehensive error handling and logging
3. Document any new AI services or BayEngage operations used
4. Test thoroughly before submitting changes
