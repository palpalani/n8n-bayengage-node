import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BayEngageApi implements ICredentialType {
	name = 'bayEngageApi';
	displayName = 'BayEngage API';
	documentationUrl = 'https://help.targetbay.com/s/topic/0TOe20000000CCTGA2/bayengage';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://developer.targetbay.com/bayengage/v2',
			description: 'The base URL for the BayEngage API',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'Your BayEngage Client ID from the Custom Integration area',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'Your BayEngage Client Secret from the Custom Integration area',
		},
		{
			displayName: 'Authentication Mode',
			name: 'authMode',
			type: 'options',
			options: [
				{
					name: 'Client Credentials (OAuth2)',
					value: 'client_credentials',
				},
				{
					name: 'Header Keys',
					value: 'header_keys',
				},
			],
			default: 'client_credentials',
			description: 'Choose the authentication method',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'read write',
			description: 'OAuth2 scope (only used with client credentials mode)',
			displayOptions: {
				show: {
					authMode: ['client_credentials'],
				},
			},
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Public-Id': '={{$credentials.clientId}}',
				'X-Client-Secret': '={{$credentials.clientSecret}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.baseUrl}}',
			url: '/account',
			method: 'GET',
		},
	};
}
