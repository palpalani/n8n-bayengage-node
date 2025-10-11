import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { BayEngageCredentials, createBayEngageRequest } from '../shared/BayEngageRequest';

export class BayEngage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BayEngage',
		name: 'bayEngage',
		icon: 'file:bayengage.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BayEngage email marketing platform',
		defaults: {
			name: 'BayEngage',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bayEngageApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://developer.targetbay.com/bayengage/v2',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'List',
						value: 'list',
					},
					{
						name: 'Template',
						value: 'template',
					},
				],
				default: 'contact',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contact',
						action: 'Create a contact',
					},
					{
						name: 'Create or Update',
						value: 'upsert',
						description:
							'Create a new record, or update the current one if it already exists (upsert)',
						action: 'Upsert a contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contact by ID or email',
						action: 'Get a contact',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all contacts',
						action: 'List contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing contact',
						action: 'Update a contact',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['list'],
					},
				},
				options: [
					{
						name: 'Add Contact',
						value: 'addContact',
						description: 'Add a contact to a list',
						action: 'Add contact to list',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new list',
						action: 'Create a list',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a list by ID',
						action: 'Get a list',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all lists',
						action: 'List lists',
					},
					{
						name: 'Remove Contact',
						value: 'removeContact',
						description: 'Remove a contact from a list',
						action: 'Remove contact from list',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a campaign by ID',
						action: 'Get a campaign',
					},
					{
						name: 'Get Reports',
						value: 'getReports',
						description: 'Get campaign reports',
						action: 'Get campaign reports',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all campaigns',
						action: 'List campaigns',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send a campaign',
						action: 'Send a campaign',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['template'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new template',
						action: 'Create a template',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a template by ID',
						action: 'Get a template',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all templates',
						action: 'List templates',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{
						name: 'Track',
						value: 'track',
						description: 'Track a custom event',
						action: 'Track an event',
					},
				],
				default: 'track',
			},
			// Contact fields
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update', 'upsert', 'get'],
					},
				},
				default: '',
				description: 'Contact email address',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['get', 'update'],
					},
				},
				default: '',
				description: 'BayEngage contact ID',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				default: '',
				description: 'Contact first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				default: '',
				description: 'Contact last name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				default: '',
				description: 'Contact phone number',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				default: {},
				options: [
					{
						name: 'fields',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Custom field name',
							},
							{
								displayName: 'Field Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Custom field value',
							},
						],
					},
				],
				description: 'Custom contact fields',
			},
			// List fields
			{
				displayName: 'List Name',
				name: 'listName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['list'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Name of the list to create',
			},
			{
				displayName: 'List ID',
				name: 'listId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['list'],
						operation: ['get', 'addContact', 'removeContact'],
					},
				},
				default: '',
				description: 'BayEngage list ID',
			},
			// Campaign fields
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['get', 'send', 'getReports'],
					},
				},
				default: '',
				description: 'BayEngage campaign ID',
			},
			// Template fields
			{
				displayName: 'Template Name',
				name: 'templateName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Name of the template to create',
			},
			{
				displayName: 'Template Content',
				name: 'templateContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'HTML content of the template',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'BayEngage template ID',
			},
			// Event fields
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['track'],
					},
				},
				default: '',
				description: 'Name of the event to track',
			},
			{
				displayName: 'Event Properties',
				name: 'eventProperties',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['track'],
					},
				},
				default: {},
				options: [
					{
						name: 'properties',
						displayName: 'Property',
						values: [
							{
								displayName: 'Property Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Event property name',
							},
							{
								displayName: 'Property Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Event property value',
							},
						],
					},
				],
				description: 'Event properties to track',
			},
			// Pagination fields
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						resource: ['contact', 'list', 'campaign', 'template'],
						operation: ['list'],
					},
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['contact', 'list', 'campaign', 'template'],
						operation: ['list'],
					},
				},
				default: 1,
				description: 'Page number to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// Get credentials
				const credentials = (await this.getCredentials('bayEngageApi')) as BayEngageCredentials;
				const bayEngageRequest = createBayEngageRequest(credentials);

				let responseData: any;

				// Handle different resources and operations
				if (resource === 'contact') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const customFields = this.getNodeParameter('customFields', i) as any;

						const contactData: any = {
							email,
							first_name: firstName,
							last_name: lastName,
							phone,
						};

						// Add custom fields
						if (customFields?.fields) {
							customFields.fields.forEach((field: any) => {
								contactData[field.name] = field.value;
							});
						}

						responseData = await bayEngageRequest.makeRequest({
							url: '/contacts',
							method: 'POST',
							body: contactData,
						});
					} else if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						if (contactId) {
							responseData = await bayEngageRequest.makeRequest({
								url: `/contacts/${contactId}`,
								method: 'GET',
							});
						} else if (email) {
							responseData = await bayEngageRequest.makeRequest({
								url: '/contacts',
								method: 'GET',
								qs: { email },
							});
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'Either Contact ID or Email must be provided',
							);
						}
					} else if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const customFields = this.getNodeParameter('customFields', i) as any;

						const contactData: any = {};

						if (email) contactData.email = email;
						if (firstName) contactData.first_name = firstName;
						if (lastName) contactData.last_name = lastName;
						if (phone) contactData.phone = phone;

						// Add custom fields
						if (customFields?.fields) {
							customFields.fields.forEach((field: any) => {
								contactData[field.name] = field.value;
							});
						}

						responseData = await bayEngageRequest.makeRequest({
							url: `/contacts/${contactId}`,
							method: 'PUT',
							body: contactData,
						});
					} else if (operation === 'list') {
						const limit = this.getNodeParameter('limit', i) as number;
						const page = this.getNodeParameter('page', i) as number;

						responseData = await bayEngageRequest.makeRequest({
							url: '/contacts',
							method: 'GET',
							qs: { limit, page },
						});
					} else if (operation === 'upsert') {
						const email = this.getNodeParameter('email', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const customFields = this.getNodeParameter('customFields', i) as any;

						const contactData: any = {
							email,
							first_name: firstName,
							last_name: lastName,
							phone,
						};

						// Add custom fields
						if (customFields?.fields) {
							customFields.fields.forEach((field: any) => {
								contactData[field.name] = field.value;
							});
						}

						responseData = await bayEngageRequest.makeRequest({
							url: '/contacts/upsert',
							method: 'POST',
							body: contactData,
						});
					}
				} else if (resource === 'list') {
					if (operation === 'create') {
						const listName = this.getNodeParameter('listName', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: '/lists',
							method: 'POST',
							body: { name: listName },
						});
					} else if (operation === 'get') {
						const listId = this.getNodeParameter('listId', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: `/lists/${listId}`,
							method: 'GET',
						});
					} else if (operation === 'list') {
						const limit = this.getNodeParameter('limit', i) as number;
						const page = this.getNodeParameter('page', i) as number;

						responseData = await bayEngageRequest.makeRequest({
							url: '/lists',
							method: 'GET',
							qs: { limit, page },
						});
					} else if (operation === 'addContact') {
						const listId = this.getNodeParameter('listId', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: `/lists/${listId}/contacts`,
							method: 'POST',
							body: { email },
						});
					} else if (operation === 'removeContact') {
						const listId = this.getNodeParameter('listId', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: `/lists/${listId}/contacts`,
							method: 'DELETE',
							body: { email },
						});
					}
				} else if (resource === 'campaign') {
					if (operation === 'list') {
						const limit = this.getNodeParameter('limit', i) as number;
						const page = this.getNodeParameter('page', i) as number;

						responseData = await bayEngageRequest.makeRequest({
							url: '/campaigns',
							method: 'GET',
							qs: { limit, page },
						});
					} else if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: `/campaigns/${campaignId}`,
							method: 'GET',
						});
					} else if (operation === 'send') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: `/campaigns/${campaignId}/send`,
							method: 'POST',
						});
					} else if (operation === 'getReports') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: `/campaigns/${campaignId}/reports`,
							method: 'GET',
						});
					}
				} else if (resource === 'template') {
					if (operation === 'create') {
						const templateName = this.getNodeParameter('templateName', i) as string;
						const templateContent = this.getNodeParameter('templateContent', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: '/templates',
							method: 'POST',
							body: {
								name: templateName,
								content: templateContent,
							},
						});
					} else if (operation === 'get') {
						const templateId = this.getNodeParameter('templateId', i) as string;

						responseData = await bayEngageRequest.makeRequest({
							url: `/templates/${templateId}`,
							method: 'GET',
						});
					} else if (operation === 'list') {
						const limit = this.getNodeParameter('limit', i) as number;
						const page = this.getNodeParameter('page', i) as number;

						responseData = await bayEngageRequest.makeRequest({
							url: '/templates',
							method: 'GET',
							qs: { limit, page },
						});
					}
				} else if (resource === 'event') {
					if (operation === 'track') {
						const eventName = this.getNodeParameter('eventName', i) as string;
						const eventProperties = this.getNodeParameter('eventProperties', i) as any;

						const eventData: any = {
							event: eventName,
						};

						// Add event properties
						if (eventProperties?.properties) {
							eventProperties.properties.forEach((property: any) => {
								eventData[property.name] = property.value;
							});
						}

						responseData = await bayEngageRequest.makeRequest({
							url: '/events',
							method: 'POST',
							body: eventData,
						});
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
