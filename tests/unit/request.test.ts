import { makeRequest, get, post, mergeHeaders, DEFAULT_TIMEOUT } from '../../src/request';
import { NetworkError, ResponseError } from '../../src/errors';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('HTTP Request Wrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    jest.spyOn(global, 'clearTimeout');
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('makeRequest', () => {
    it('should make successful JSON request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ message: 'success' }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const response = await makeRequest('https://api.example.com/test');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        signal: expect.any(AbortSignal),
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'success' });
    });

    it('should make successful text request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: jest.fn().mockResolvedValue('plain text response'),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const response = await makeRequest('https://api.example.com/text');

      expect(response.data).toBe('plain text response');
    });

    it('should handle binary response', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/octet-stream' }),
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const response = await makeRequest('https://api.example.com/binary');

      expect(response.data).toBe(mockArrayBuffer);
    });

    it('should throw NetworkError for HTTP error status', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ error: 'Resource not found' }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(makeRequest('https://api.example.com/missing')).rejects.toThrow(NetworkError);
      await expect(makeRequest('https://api.example.com/missing')).rejects.toThrow(
        'HTTP 404: Not Found'
      );
    });

    it('should throw ResponseError for JSON parse error', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(makeRequest('https://api.example.com/invalid-json')).rejects.toThrow(
        ResponseError
      );
      await expect(makeRequest('https://api.example.com/invalid-json')).rejects.toThrow(
        'Failed to parse JSON response'
      );
    });

    it('should handle request timeout', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((_, reject) => {
            // Simulate AbortError thrown by AbortController after timeout
            setTimeout(() => {
              const abortError = new Error('The operation was aborted.');
              abortError.name = 'AbortError';
              reject(abortError);
            }, 0);
          })
      );

      const requestPromise = makeRequest('https://api.example.com/slow', { timeout: 1000 });

      // Fast-forward time to trigger timeout
      jest.advanceTimersByTime(1000);

      await expect(requestPromise).rejects.toThrow(NetworkError);
      await expect(requestPromise).rejects.toThrow('Request timeout after 1000ms');
    });

    it('should handle user abort signal', async () => {
      const controller = new AbortController();
      const abortError = new Error('The operation was aborted.');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValue(abortError);

      const requestPromise = makeRequest('https://api.example.com/test', {
        signal: controller.signal,
      });

      controller.abort();

      await expect(requestPromise).rejects.toThrow(NetworkError);
      await expect(requestPromise).rejects.toThrow('Request was aborted');
    });

    it('should handle network failure', async () => {
      mockFetch.mockRejectedValue(new Error('fetch failed'));

      await expect(makeRequest('https://api.example.com/test')).rejects.toThrow(NetworkError);
      await expect(makeRequest('https://api.example.com/test')).rejects.toThrow(
        'Network request failed: fetch failed'
      );
    });

    it('should extract request ID from response headers', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({
          'content-type': 'application/json',
          'x-request-id': 'req-12345',
        }),
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      try {
        await makeRequest('https://api.example.com/error');
      } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        expect((error as NetworkError).requestId).toBe('req-12345');
      }
    });

    it('should pass through custom headers', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await makeRequest('https://api.example.com/test', {
        headers: { Authorization: 'Bearer token', 'Custom-Header': 'value' },
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        headers: { Authorization: 'Bearer token', 'Custom-Header': 'value' },
        signal: expect.any(AbortSignal),
      });
    });

    it('should use default timeout if not specified', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await makeRequest('https://api.example.com/test');

      // Verify setTimeout was called with default timeout
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), DEFAULT_TIMEOUT);
    });
  });

  describe('ResponseError specifics', () => {
    it('should include content-type and status in ResponseError', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json; charset=utf-8' }),
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(mockResponse);

      try {
        await makeRequest('https://api.example.com/invalid-json');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        const responseError = error as ResponseError;
        expect(responseError.statusCode).toBe(200);
        expect(responseError.contentType).toBe('application/json; charset=utf-8');
      }
    });

    it('should include request ID in ResponseError when available', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'content-type': 'application/json',
          'x-trace-id': 'trace-abc123',
        }),
        json: jest.fn().mockRejectedValue(new Error('Malformed JSON')),
      };
      mockFetch.mockResolvedValue(mockResponse);

      try {
        await makeRequest('https://api.example.com/malformed');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect((error as ResponseError).requestId).toBe('trace-abc123');
      }
    });
  });

  describe('mergeHeaders', () => {
    it('should merge headers objects correctly', () => {
      const headers1 = { 'Content-Type': 'application/json' };
      const headers2 = { Authorization: 'Bearer token' };
      const headers3 = { 'Custom-Header': 'value' };

      const merged = mergeHeaders(headers1, headers2, headers3);

      expect(merged).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
        'Custom-Header': 'value',
      });
    });

    it('should handle undefined headers', () => {
      const headers1 = { 'Content-Type': 'application/json' };
      const headers2 = undefined;
      const headers3 = { Authorization: 'Bearer token' };

      const merged = mergeHeaders(headers1, headers2, headers3);

      expect(merged).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      });
    });

    it('should overwrite headers with later values', () => {
      const headers1 = { 'Content-Type': 'application/json' };
      const headers2 = { 'Content-Type': 'text/plain' };

      const merged = mergeHeaders(headers1, headers2);

      expect(merged).toEqual({
        'Content-Type': 'text/plain',
      });
    });

    it('should return empty object for all undefined headers', () => {
      const merged = mergeHeaders(undefined, undefined);
      expect(merged).toEqual({});
    });
  });

  describe('get helper', () => {
    it('should make GET request with correct method', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const response = await get('https://api.example.com/test');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        method: 'GET',
        signal: expect.any(AbortSignal),
      });
      expect(response.data).toEqual({ data: 'test' });
    });

    it('should pass through headers and timeout', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await get('https://api.example.com/test', {
        headers: { Authorization: 'Bearer token' },
        timeout: 5000,
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        method: 'GET',
        headers: { Authorization: 'Bearer token' },
        signal: expect.any(AbortSignal),
      });
    });
  });

  describe('post helper', () => {
    it('should make POST request with body', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ id: 123 }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const requestBody = JSON.stringify({ name: 'test' });
      const response = await post('https://api.example.com/items', requestBody);

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/items', {
        method: 'POST',
        body: requestBody,
        signal: expect.any(AbortSignal),
      });
      expect(response.data).toEqual({ id: 123 });
    });

    it('should make POST request without body', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ success: true }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await post('https://api.example.com/action');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/action', {
        method: 'POST',
        signal: expect.any(AbortSignal),
      });
    });
  });

  describe('error handling edge cases', () => {
    it('should handle unknown error types', async () => {
      mockFetch.mockRejectedValue('string error');

      await expect(makeRequest('https://api.example.com/test')).rejects.toThrow(NetworkError);
      await expect(makeRequest('https://api.example.com/test')).rejects.toThrow(
        'An unexpected error occurred during the request'
      );
    });

    it('should handle multiple request ID header formats', async () => {
      const testCases = [
        { header: 'x-trace-id', value: 'trace-123' },
        { header: 'x-correlation-id', value: 'corr-456' },
        { header: 'request-id', value: 'req-789' },
        { header: 'trace-id', value: 'tid-abc' },
      ];

      for (const { header, value } of testCases) {
        const mockResponse = {
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          headers: new Headers({
            'content-type': 'application/json',
            [header]: value,
          }),
          json: jest.fn().mockResolvedValue({ error: 'Bad request' }),
        };
        mockFetch.mockResolvedValue(mockResponse);

        try {
          await makeRequest('https://api.example.com/test');
        } catch (error) {
          expect(error).toBeInstanceOf(NetworkError);
          expect((error as NetworkError).requestId).toBe(value);
        }
      }
    });

    it('should clear timeout on successful response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await makeRequest('https://api.example.com/test', { timeout: 5000 });

      expect(clearTimeout).toHaveBeenCalled();
    });
  });
});
