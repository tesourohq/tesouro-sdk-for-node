/**
 * HTTP request utilities for the Tesouro SDK
 *
 * Provides a wrapper around the native fetch API with timeout support,
 * error handling, proxy support, and proper NetworkError creation.
 */

import { ProxyAgent, type Dispatcher } from 'undici';
import { NetworkError, ResponseError, ErrorUtils } from './errors';
import type { ProxyConfig } from './types';

/**
 * HTTP request options interface
 */
export interface RequestOptions {
  /** Request method (GET, POST, etc.) */
  method?: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body */
  body?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** AbortController signal for cancellation */
  signal?: AbortSignal;
  /** Proxy configuration */
  proxy?: ProxyConfig;
}

/**
 * HTTP response interface
 */
export interface HttpResponse<T = unknown> {
  /** Response status code */
  status: number;
  /** Response status text */
  statusText: string;
  /** Response headers */
  headers: Headers;
  /** Parsed response data */
  data: T;
  /** Original response object */
  response: Response;
}

/**
 * Default request timeout in milliseconds
 */
export const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Detects proxy configuration from environment variables
 * Supports HTTP_PROXY, HTTPS_PROXY, http_proxy, https_proxy
 *
 * @returns Proxy URL if found, undefined otherwise
 */
function detectProxyFromEnvironment(): string | undefined {
  return (
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.http_proxy
  );
}

/**
 * Creates a proxy agent from proxy configuration
 *
 * @param proxyConfig - Proxy configuration
 * @returns ProxyAgent instance
 */
function createProxyAgent(proxyConfig: ProxyConfig): ProxyAgent {
  const { url, username, password } = proxyConfig;

  let proxyUrl = url;

  // Add authentication if provided
  if (username && password) {
    const urlObj = new URL(url);
    urlObj.username = username;
    urlObj.password = password;
    proxyUrl = urlObj.toString();
  }

  return new ProxyAgent(proxyUrl);
}

/**
 * Makes an HTTP request with timeout support and error handling
 *
 * @param url - The URL to request
 * @param options - Request options including timeout
 * @returns Promise resolving to the HTTP response
 * @throws NetworkError for network-related failures
 */
export async function makeRequest<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<HttpResponse<T>> {
  const { timeout = DEFAULT_TIMEOUT, signal, proxy, ...fetchOptions } = options;

  // Setup proxy configuration
  let dispatcher: Dispatcher | undefined;

  // Use explicit proxy config if provided
  if (proxy) {
    dispatcher = createProxyAgent(proxy);
  } else {
    // Check environment variables for proxy
    const envProxyUrl = detectProxyFromEnvironment();
    if (envProxyUrl) {
      dispatcher = createProxyAgent({ url: envProxyUrl });
    }
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Combine user signal with timeout signal
  let combinedSignal = controller.signal;
  if (signal) {
    // Create a combined signal that aborts when either signal is aborted
    const combinedController = new AbortController();
    const abortBoth = () => combinedController.abort();

    signal.addEventListener('abort', abortBoth);
    controller.signal.addEventListener('abort', abortBoth);

    combinedSignal = combinedController.signal;
  }

  try {
    // Make the HTTP request
    const fetchInit: any = {
      ...fetchOptions,
      signal: combinedSignal,
    };

    if (dispatcher) {
      fetchInit.dispatcher = dispatcher;
    }

    const response = await fetch(url, fetchInit);

    // Clear the timeout since request completed
    clearTimeout(timeoutId);

    // Parse response body
    let data: T;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        data = (await response.json()) as T;
      } catch (parseError) {
        throw new ResponseError(
          'Failed to parse JSON response',
          response.status,
          contentType,
          ErrorUtils.extractRequestId(response),
          parseError
        );
      }
    } else if (contentType.includes('text/')) {
      data = (await response.text()) as unknown as T;
    } else {
      // For other content types, return as ArrayBuffer
      data = (await response.arrayBuffer()) as unknown as T;
    }

    // Check for HTTP error status codes
    if (!response.ok) {
      const requestId = ErrorUtils.extractRequestId(response);
      throw new NetworkError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        requestId,
        { response: data }
      );
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data,
      response,
    };
  } catch (error) {
    // Clear timeout on any error
    clearTimeout(timeoutId);

    // Handle specific error types
    if (error instanceof NetworkError || error instanceof ResponseError) {
      // Re-throw SDK errors as-is
      throw error;
    }

    if (error instanceof Error) {
      // Handle abort/timeout errors
      if (error.name === 'AbortError') {
        if (controller.signal.aborted && !signal?.aborted) {
          throw new NetworkError(`Request timeout after ${timeout}ms`, undefined, undefined, error);
        }
        throw new NetworkError('Request was aborted', undefined, undefined, error);
      }

      // Handle other fetch errors (network failures, etc.)
      if (error.message.includes('fetch')) {
        throw new NetworkError(
          `Network request failed: ${error.message}`,
          undefined,
          undefined,
          error
        );
      }
    }

    // Fallback for unknown errors
    throw new NetworkError(
      'An unexpected error occurred during the request',
      undefined,
      undefined,
      error
    );
  }
}

/**
 * Merges headers objects, with later objects taking precedence
 *
 * @param headers - Header objects to merge
 * @returns Merged headers object
 */
export function mergeHeaders(
  ...headers: (Record<string, string> | undefined)[]
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const headerObj of headers) {
    if (headerObj) {
      Object.assign(result, headerObj);
    }
  }

  return result;
}

/**
 * Creates a GET request with the specified options
 *
 * @param url - The URL to request
 * @param options - Request options
 * @returns Promise resolving to the HTTP response
 */
export async function get<T = unknown>(
  url: string,
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<HttpResponse<T>> {
  return makeRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * Creates a POST request with the specified options
 *
 * @param url - The URL to request
 * @param body - Request body
 * @param options - Request options
 * @returns Promise resolving to the HTTP response
 */
export async function post<T = unknown>(
  url: string,
  body?: string,
  options: Omit<RequestOptions, 'method'> = {}
): Promise<HttpResponse<T>> {
  return makeRequest<T>(url, { ...options, method: 'POST', body });
}
