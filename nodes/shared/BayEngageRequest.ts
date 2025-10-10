import {
	IHttpRequestOptions,
} from 'n8n-workflow';

// Type declarations for global functions
declare global {
	function fetch(input: string | URL, init?: RequestInit): Promise<Response>;
	class URLSearchParams {
		constructor(init?: string[][] | Record<string, string> | string | URLSearchParams);
		toString(): string;
		append(name: string, value: string): void;
	}
	class URL {
		constructor(input: string, base?: string | URL);
		searchParams: URLSearchParams;
		toString(): string;
	}
	class AbortSignal {
		static timeout(ms: number): AbortSignal;
	}
	interface RequestInit {
		method?: string;
		headers?: Record<string, string>;
		body?: string;
		signal?: AbortSignal;
	}
	interface Response {
		ok: boolean;
		status: number;
		statusText: string;
		headers: {
			get(name: string): string | null;
		};
		json(): Promise<any>;
		text(): Promise<string>;
	}
	function setTimeout(callback: (value?: any) => void, ms: number): any;
}

export interface BayEngageCredentials {
	baseUrl: string;
	clientId: string;
	clientSecret: string;
	authMode: 'client_credentials' | 'header_keys';
	scope?: string;
}

export interface BayEngageRequestOptions extends IHttpRequestOptions {
	baseURL?: string;
	url: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	qs?: Record<string, any>;
	timeout?: number;
	retries?: number;
}

export interface BayEngageResponse<T = any> {
	data: T;
	meta?: {
		pagination?: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	};
}

export class BayEngageRequest {
	private credentials: BayEngageCredentials;
	private accessToken?: string;
	private tokenExpiry?: number;

	constructor(credentials: BayEngageCredentials) {
		this.credentials = credentials;
	}

	/**
	 * Get authentication headers based on the configured auth mode
	 */
	private async getAuthHeaders(): Promise<Record<string, string>> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};

		if (this.credentials.authMode === 'header_keys') {
			headers['X-Public-Id'] = this.credentials.clientId;
			headers['X-Client-Secret'] = this.credentials.clientSecret;
		} else {
			// Client credentials mode - get OAuth2 token
			const token = await this.getAccessToken();
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	}

	/**
	 * Get OAuth2 access token using client credentials flow
	 */
	private async getAccessToken(): Promise<string> {
		// Check if we have a valid cached token
		if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
			return this.accessToken as string;
		}

		const tokenUrl = `${this.credentials.baseUrl}/oauth/token`;
		const tokenData = {
			grant_type: 'client_credentials',
			client_id: this.credentials.clientId,
			client_secret: this.credentials.clientSecret,
			scope: this.credentials.scope || 'read write',
		};

		try {
			const response = await fetch(tokenUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json',
				},
				body: new URLSearchParams(tokenData).toString(),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to get access token: ${response.status} ${response.statusText}`,
				);
			}

			const tokenResponse = await response.json();
			this.accessToken = tokenResponse.access_token || '';
			// Set expiry with 5 minute buffer
			this.tokenExpiry = Date.now() + ((tokenResponse.expires_in || 3600) - 300) * 1000;

			return this.accessToken as string;
		} catch (error) {
			throw new Error(
				`Failed to authenticate with BayEngage: ${error.message}`,
			);
		}
	}

	/**
	 * Make a request to the BayEngage API with retry logic
	 */
	async makeRequest<T = any>(options: BayEngageRequestOptions): Promise<BayEngageResponse<T>> {
		const {
			url,
			method = 'GET',
			body,
			qs,
			timeout = 30000,
			retries = 3,
		} = options;

		const authHeaders = await this.getAuthHeaders();
		const requestOptions: RequestInit = {
			method,
			headers: {
				...authHeaders,
				...options.headers,
			},
			signal: AbortSignal.timeout(timeout),
		};

		if (body && method !== 'GET') {
			requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
		}

		// Add query parameters to URL
		const fullUrl = new URL(url, this.credentials.baseUrl);
		if (qs) {
			Object.entries(qs).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					fullUrl.searchParams.append(key, String(value));
				}
			});
		}

		let lastError: Error | undefined;

		for (let attempt = 0; attempt <= retries; attempt++) {
			try {
				const response = await fetch(fullUrl.toString(), requestOptions);

				// Handle rate limiting
				if (response.status === 429) {
					const retryAfter = response.headers.get('Retry-After');
					const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;

					if (attempt < retries) {
						await new Promise(resolve => setTimeout(resolve, delay));
						continue;
					}
				}

				// Handle authentication errors
				if (response.status === 401) {
					// Clear cached token and retry once
					if (this.credentials.authMode === 'client_credentials' && attempt === 0) {
						this.accessToken = undefined;
						this.tokenExpiry = undefined;
						continue;
					}
				}

				if (!response.ok) {
					const errorText = await response.text();
					let errorMessage = `Request failed: ${response.status} ${response.statusText}`;

					try {
						const errorData = JSON.parse(errorText);
						errorMessage = errorData.message || errorData.error || errorMessage;
					} catch {
						// Use the text as is if not JSON
					}

					throw new Error(errorMessage);
				}

				const responseData = await response.json();
				return responseData;

			} catch (error) {
				lastError = error;

				// Don't retry on certain errors
				if (error instanceof Error && error.message.includes('Request failed')) {
					throw error;
				}

				// Wait before retrying (exponential backoff)
				if (attempt < retries) {
					const delay = Math.pow(2, attempt) * 1000;
					await new Promise<void>(resolve => setTimeout(() => resolve(), delay));
				}
			}
		}

		throw lastError || new Error('Request failed after all retries');
	}

	/**
	 * Test the API connection
	 */
	async testConnection(): Promise<boolean> {
		try {
			await this.makeRequest({
				url: '/account',
				method: 'GET',
			});
			return true;
		} catch (error) {
			return false;
		}
	}
}

/**
 * Helper function to create a BayEngage request instance
 */
export function createBayEngageRequest(credentials: BayEngageCredentials): BayEngageRequest {
	return new BayEngageRequest(credentials);
}

/**
 * Helper function to handle pagination
 */
export function handlePagination<T>(
	items: T[],
	page: number = 1,
	limit: number = 50,
): { data: T[]; meta: { pagination: { page: number; limit: number; total: number; totalPages: number } } } {
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedItems = items.slice(startIndex, endIndex);
	const totalPages = Math.ceil(items.length / limit);

	return {
		data: paginatedItems,
		meta: {
			pagination: {
				page,
				limit,
				total: items.length,
				totalPages,
			},
		},
	};
}
