import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BayEngageRequest, BayEngageCredentials } from '../nodes/shared/BayEngageRequest';

// Mock fetch
global.fetch = vi.fn();

describe('BayEngageRequest', () => {
  let credentials: BayEngageCredentials;
  let bayEngageRequest: BayEngageRequest;
  const tokenOkResponse = {
    ok: true,
    json: () => Promise.resolve({ access_token: 'test-token', expires_in: 3600 }),
  } as any;

  function mockTokenOnce() {
    (global.fetch as any).mockResolvedValueOnce(tokenOkResponse);
  }

  beforeEach(() => {
    credentials = {
      baseUrl: 'https://api.example.com',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      authMode: 'client_credentials',
      scope: 'read write',
    };
    bayEngageRequest = new BayEngageRequest(credentials);
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with credentials', () => {
      expect(bayEngageRequest).toBeInstanceOf(BayEngageRequest);
    });
  });

  describe('makeRequest', () => {
    it('should make a successful GET request', async () => {
      mockTokenOnce();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const result = await bayEngageRequest.makeRequest({
        url: '/test',
        method: 'GET',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should handle POST request with body', async () => {
      mockTokenOnce();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const requestData = { name: 'test' };
      await bayEngageRequest.makeRequest({
        url: '/test',
        method: 'POST',
        body: requestData,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );
    });

    it('should handle query parameters', async () => {
      mockTokenOnce();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await bayEngageRequest.makeRequest({
        url: '/test',
        method: 'GET',
        qs: { page: 1, limit: 10 },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test?page=1&limit=10',
        expect.any(Object)
      );
    });

    it('should retry on 429 rate limit', async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: {
          get: (name: string) => (name === 'Retry-After' ? '1' : null),
        },
        text: () => Promise.resolve('Rate limit exceeded'),
      };
      const successResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'success' }),
      };

      (global.fetch as any)
        .mockResolvedValueOnce(tokenOkResponse) // token fetch
        .mockResolvedValueOnce(rateLimitResponse) // first API attempt
        .mockResolvedValueOnce(successResponse); // retry API attempt

      // Mock setTimeout to avoid actual delays in tests
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return {} as any;
      });

      const result = await bayEngageRequest.makeRequest({
        url: '/test',
        method: 'GET',
        retries: 1,
      });

      // 1 token request + 2 API calls (initial 429 + retry success)
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ data: 'success' });
    });

    it('should throw error on failed request', async () => {
      mockTokenOnce();
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Error message'),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await expect(
        bayEngageRequest.makeRequest({
          url: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Request failed: 400 Bad Request');
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      mockTokenOnce();
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ account: 'test' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const result = await bayEngageRequest.testConnection();
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      mockTokenOnce();
      const mockResponse = {
        ok: false,
        status: 401,
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const result = await bayEngageRequest.testConnection();
      expect(result).toBe(false);
    });
  });
});
