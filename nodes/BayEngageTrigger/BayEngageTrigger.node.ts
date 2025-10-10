import {
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	INodeExecutionData,
	NodeOperationError,
	IHookFunctions,
} from 'n8n-workflow';

// Type declaration for btoa
declare global {
	function btoa(str: string): string;
}

export class BayEngageTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BayEngage Trigger',
		name: 'bayEngageTrigger',
		icon: 'file:bayengage.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["eventType"]}}',
		description: 'Trigger workflow when BayEngage events occur',
		defaults: {
			name: 'BayEngage Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'bayengage',
			},
		],
		properties: [
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				options: [
					{
						name: 'All Events',
						value: 'all',
						description: 'Trigger on all BayEngage events',
					},
					{
						name: 'Campaign Bounced',
						value: 'campaign.bounced',
						description: 'Trigger when a campaign bounces',
					},
					{
						name: 'Campaign Clicked',
						value: 'campaign.clicked',
						description: 'Trigger when a campaign is clicked',
					},
					{
						name: 'Campaign Opened',
						value: 'campaign.opened',
						description: 'Trigger when a campaign is opened',
					},
					{
						name: 'Campaign Sent',
						value: 'campaign.sent',
						description: 'Trigger when a campaign is sent',
					},
					{
						name: 'Campaign Unsubscribed',
						value: 'campaign.unsubscribed',
						description: 'Trigger when someone unsubscribes',
					},
					{
						name: 'Contact Created',
						value: 'contact.created',
						description: 'Trigger when a contact is created',
					},
					{
						name: 'Contact Deleted',
						value: 'contact.deleted',
						description: 'Trigger when a contact is deleted',
					},
					{
						name: 'Contact Updated',
						value: 'contact.updated',
						description: 'Trigger when a contact is updated',
					},
					{
						name: 'List Created',
						value: 'list.created',
						description: 'Trigger when a list is created',
					},
					{
						name: 'List Deleted',
						value: 'list.deleted',
						description: 'Trigger when a list is deleted',
					},
					{
						name: 'List Updated',
						value: 'list.updated',
						description: 'Trigger when a list is updated',
					},
					{
						name: 'Order Created',
						value: 'order.created',
						description: 'Trigger when an order is created',
					},
					{
						name: 'Order Updated',
						value: 'order.updated',
						description: 'Trigger when an order is updated',
					},
				],
				default: 'all',
				description: 'The type of event to listen for',
			},
			{
				displayName: 'Verify Webhook Signature',
				name: 'verifySignature',
				type: 'boolean',
				default: true,
				description: 'Whether to verify the webhook signature for security',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						verifySignature: [true],
					},
				},
				default: '',
				description: 'The webhook secret to verify the signature (if supported by BayEngage)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Custom Event Types',
						name: 'customEventTypes',
						type: 'string',
						default: '',
						description: 'Comma-separated list of custom event types to listen for',
					},
					{
						displayName: 'Filter by Contact ID',
						name: 'contactIdFilter',
						type: 'string',
						default: '',
						description: 'Only trigger for specific contact ID (optional)',
					},
					{
						displayName: 'Filter by List ID',
						name: 'listIdFilter',
						type: 'string',
						default: '',
						description: 'Only trigger for specific list ID (optional)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				// Check if webhook URL is already registered
				return !!(webhookData.webhookUrl && webhookData.webhookUrl === webhookUrl);
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				webhookData.webhookUrl = webhookUrl;
				webhookData.webhookId = `bayengage-${Date.now()}`;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				delete webhookData.webhookUrl;
				delete webhookData.webhookId;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		const headers = this.getHeaderData();

		const eventType = this.getNodeParameter('eventType') as string;
		const verifySignature = this.getNodeParameter('verifySignature') as boolean;
		const webhookSecret = this.getNodeParameter('webhookSecret') as string;
		const additionalFields = this.getNodeParameter('additionalFields') as any;

		// Verify webhook signature if enabled
		if (verifySignature && webhookSecret) {
			const signature = headers['x-signature'] || headers['x-hub-signature-256'];
			if (!signature) {
				throw new NodeOperationError(this.getNode(), 'Missing webhook signature');
			}

			// Note: BayEngage may use different signature verification methods
			// This is a placeholder - implement actual signature verification based on BayEngage docs
			const expectedSignature = BayEngageTrigger.generateSignature(JSON.stringify(body), webhookSecret);
			if (signature !== expectedSignature) {
				throw new NodeOperationError(this.getNode(), 'Invalid webhook signature');
			}
		}

		// Extract event type from webhook payload
		const receivedEventType = body.event_type || body.type || body.event;

		// Check if this event should trigger the workflow
		if (eventType !== 'all' && receivedEventType !== eventType) {
			// Check custom event types
			const customEventTypes = additionalFields.customEventTypes?.split(',').map((t: string) => t.trim()) || [];
			if (!customEventTypes.includes(receivedEventType)) {
				return { workflowData: [] };
			}
		}

		// Apply filters
		if (additionalFields.contactIdFilter && body.contact_id !== additionalFields.contactIdFilter) {
			return { workflowData: [] };
		}

		if (additionalFields.listIdFilter && body.list_id !== additionalFields.listIdFilter) {
			return { workflowData: [] };
		}

		// Prepare the response data
		const responseData: INodeExecutionData = {
			json: {
				event_type: receivedEventType,
				timestamp: body.timestamp || new Date().toISOString(),
				data: body.data || body,
				contact_id: body.contact_id,
				list_id: body.list_id,
				campaign_id: body.campaign_id,
				order_id: body.order_id,
				raw: body,
			},
		};

		return {
			workflowData: [[responseData]],
		};
	}

	/**
	 * Generate webhook signature for verification
	 * Note: This is a placeholder implementation - update based on BayEngage's actual signature method
	 */
	private static generateSignature(payload: string, secret: string): string {
		// This is a placeholder - implement actual signature generation based on BayEngage docs
		// Common methods include HMAC-SHA256 or HMAC-SHA1
		// In a real implementation, you would use a proper crypto library
		return 'sha256=' + btoa(payload + secret);
	}
}
