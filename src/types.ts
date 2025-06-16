/**
 * Type definitions and validation for the Tesouro SDK
 *
 * This module defines all configuration interfaces, types, and validation
 * utilities used throughout the SDK.
 */

import { ClientCredentials } from './auth';

/**
 * Proxy configuration options
 */
export interface ProxyConfig {
  /** Proxy URL (e.g., 'http://proxy.example.com:8080') */
  url: string;
  /** Proxy authentication username */
  username?: string;
  /** Proxy authentication password */
  password?: string;
}

/**
 * SDK client configuration interface
 */
export interface ClientConfig {
  /** Client ID for OAuth authentication */
  clientId: string;
  /** Client secret for OAuth authentication */
  clientSecret: string;
  /** GraphQL endpoint URL (default: https://api.sandbox.tesouro.com/graphql) */
  endpoint?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Custom headers to include with requests */
  headers?: Record<string, string>;
  /** OAuth token endpoint URL (default: derived from endpoint) */
  tokenEndpoint?: string;
  /** Proxy configuration (overrides environment variables) */
  proxy?: ProxyConfig;
}

/**
 * Authentication-specific configuration
 */
export interface AuthConfig {
  /** Client credentials */
  credentials: ClientCredentials;
  /** OAuth token endpoint URL */
  tokenEndpoint: string;
  /** Request timeout for auth requests in milliseconds */
  timeout?: number;
  /** Custom headers for auth requests */
  headers?: Record<string, string>;
}

/**
 * Per-request configuration options
 */
export interface RequestConfig {
  /** Override default timeout for this request */
  timeout?: number;
  /** Additional headers for this request */
  headers?: Record<string, string>;
  /** Skip authentication for this request */
  skipAuth?: boolean;
  /** Request ID for tracing */
  requestId?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  /** Default GraphQL endpoint */
  ENDPOINT: 'https://api.sandbox.tesouro.com/graphql',
  /** Default request timeout (30 seconds) */
  TIMEOUT: 30000,
  /** Default auth timeout (10 seconds) */
  AUTH_TIMEOUT: 10000,
} as const;

/**
 * Type guard to check if a value is a valid non-empty string
 * Validates that the value is a string with at least one character
 *
 * @param value - The value to validate
 * @returns True if the value is a non-empty string
 * @example
 * ```typescript
 * isValidString("hello")      // true
 * isValidString("a")          // true
 * isValidString("")           // false (empty string)
 * isValidString(null)         // false
 * isValidString(undefined)    // false
 * isValidString(123)          // false
 * ```
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard to check if a value is a valid number
 * Validates that the value is a number and not NaN or infinite
 *
 * @param value - The value to validate
 * @returns True if the value is a valid, finite number
 * @example
 * ```typescript
 * isValidNumber(42)        // true
 * isValidNumber(3.14)      // true
 * isValidNumber(NaN)       // false
 * isValidNumber(Infinity)  // false
 * isValidNumber("42")      // false
 * ```
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Type guard to check if a value is a valid positive number
 * Validates that the value is a number greater than zero
 *
 * @param value - The value to validate
 * @returns True if the value is a positive number
 * @example
 * ```typescript
 * isValidPositiveNumber(42)    // true
 * isValidPositiveNumber(3.14)  // true
 * isValidPositiveNumber(0)     // false
 * isValidPositiveNumber(-5)    // false
 * isValidPositiveNumber("42")  // false
 * ```
 */
export function isValidPositiveNumber(value: unknown): value is number {
  return isValidNumber(value) && value > 0;
}

/**
 * Type guard to check if a value is a valid URL
 * Validates that the value is a string that can be parsed as a URL
 *
 * @param value - The value to validate
 * @returns True if the value is a valid URL string
 * @example
 * ```typescript
 * isValidUrl("https://api.example.com")     // true
 * isValidUrl("http://localhost:3000")       // true
 * isValidUrl("not-a-url")                   // false
 * isValidUrl(123)                           // false
 * isValidUrl("")                            // false
 * ```
 */
export function isValidUrl(value: unknown): value is string {
  if (!isValidString(value)) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type guard to check if a value is a valid headers object
 * Validates that the value is an object with string keys and string values
 *
 * @param value - The value to validate
 * @returns True if the value is a valid headers object
 * @example
 * ```typescript
 * isValidHeaders({"Content-Type": "application/json"})  // true
 * isValidHeaders({"Authorization": "Bearer token"})     // true
 * isValidHeaders({"key": 123})                         // false (non-string value)
 * isValidHeaders(["header1", "header2"])               // false (array)
 * isValidHeaders(null)                                 // false
 * ```
 */
export function isValidHeaders(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const headers = value as Record<string, unknown>;
  return Object.values(headers).every((v) => typeof v === 'string');
}

/**
 * Type guard to check if client credentials are valid
 * Validates that the value contains valid clientId and clientSecret
 *
 * @param value - The value to validate
 * @returns True if the value contains valid client credentials
 * @example
 * ```typescript
 * isValidClientCredentials({clientId: "id123", clientSecret: "secret456"})  // true
 * isValidClientCredentials({clientId: "", clientSecret: "secret"})          // false (empty clientId)
 * isValidClientCredentials({clientId: "id"})                               // false (missing clientSecret)
 * isValidClientCredentials(null)                                           // false
 * ```
 */
export function isValidClientCredentials(value: unknown): value is ClientCredentials {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const creds = value as Partial<ClientCredentials>;
  return isValidString(creds.clientId) && isValidString(creds.clientSecret);
}

/**
 * Validates client configuration and throws descriptive errors for invalid values
 * Performs comprehensive validation of all required and optional configuration fields
 *
 * @param config - The configuration object to validate
 * @throws {Error} When configuration is invalid with specific error messages
 * @example
 * ```typescript
 * // Valid configuration
 * validateClientConfig({
 *   clientId: "your-client-id",
 *   clientSecret: "your-client-secret",
 *   endpoint: "https://api.example.com/graphql"
 * });
 *
 * // Throws: "clientId must be a non-empty string"
 * validateClientConfig({
 *   clientId: "",
 *   clientSecret: "secret"
 * });
 * ```
 */
export function validateClientConfig(config: unknown): asserts config is ClientConfig {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Configuration must be an object');
  }

  const cfg = config as Partial<ClientConfig>;

  // Validate required fields
  if (!isValidString(cfg.clientId)) {
    throw new Error('clientId must be a non-empty string');
  }

  if (!isValidString(cfg.clientSecret)) {
    throw new Error('clientSecret must be a non-empty string');
  }

  // Validate optional fields
  if (cfg.endpoint !== undefined && !isValidUrl(cfg.endpoint)) {
    throw new Error('endpoint must be a valid URL');
  }

  if (cfg.timeout !== undefined && !isValidPositiveNumber(cfg.timeout)) {
    throw new Error('timeout must be a positive number');
  }

  if (cfg.headers !== undefined && !isValidHeaders(cfg.headers)) {
    throw new Error('headers must be a Record<string, string>');
  }

  if (cfg.tokenEndpoint !== undefined && !isValidUrl(cfg.tokenEndpoint)) {
    throw new Error('tokenEndpoint must be a valid URL');
  }
}

/**
 * Applies default values to client configuration
 * @param config - The input configuration
 * @returns Configuration with defaults applied
 */
export function applyConfigDefaults(
  config: ClientConfig
): Required<Omit<ClientConfig, 'proxy'>> & { proxy?: ProxyConfig } {
  const endpoint = config.endpoint || process.env.TESOURO_ENDPOINT || DEFAULT_CONFIG.ENDPOINT;

  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    endpoint,
    timeout: config.timeout ?? DEFAULT_CONFIG.TIMEOUT,
    headers: config.headers ?? {},
    tokenEndpoint: config.tokenEndpoint ?? deriveTokenEndpoint(endpoint),
    ...(config.proxy && { proxy: config.proxy }),
  };
}

/**
 * Derives the OAuth token endpoint URL from a GraphQL endpoint URL
 * Automatically constructs the token endpoint by replacing '/graphql' with '/openid/connect/token'
 *
 * @param graphqlEndpoint - The GraphQL endpoint URL
 * @returns The OAuth token endpoint URL
 * @throws {Error} When the GraphQL endpoint is not a valid URL
 * @example
 * ```typescript
 * deriveTokenEndpoint("https://api.example.com/graphql")
 * // Returns: "https://api.example.com/openid/connect/token"
 *
 * deriveTokenEndpoint("https://api.example.com/v1/graphql")
 * // Returns: "https://api.example.com/v1/openid/connect/token"
 *
 * deriveTokenEndpoint("invalid-url")
 * // Throws: "Cannot derive token endpoint from invalid GraphQL endpoint"
 * ```
 */
export function deriveTokenEndpoint(graphqlEndpoint: string): string {
  try {
    const url = new URL(graphqlEndpoint);
    // Replace /graphql with /openid/connect/token
    url.pathname = url.pathname.replace(/\/graphql\/?$/, '/openid/connect/token');
    return url.toString();
  } catch {
    throw new Error('Cannot derive token endpoint from invalid GraphQL endpoint');
  }
}

/**
 * Validates request configuration for individual requests
 * Checks optional request-level configuration parameters
 *
 * @param config - The request configuration object to validate
 * @throws {Error} When configuration contains invalid values
 * @example
 * ```typescript
 * // Valid request configuration
 * validateRequestConfig({
 *   timeout: 5000,
 *   headers: { "Custom-Header": "value" },
 *   skipAuth: false
 * });
 *
 * // Throws: "timeout must be a positive number"
 * validateRequestConfig({
 *   timeout: -1000
 * });
 * ```
 */
export function validateRequestConfig(config: unknown): asserts config is RequestConfig {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Request configuration must be an object');
  }

  const cfg = config as Partial<RequestConfig>;

  if (cfg.timeout !== undefined && !isValidPositiveNumber(cfg.timeout)) {
    throw new Error('timeout must be a positive number');
  }

  if (cfg.headers !== undefined && !isValidHeaders(cfg.headers)) {
    throw new Error('headers must be a Record<string, string>');
  }

  if (cfg.skipAuth !== undefined && typeof cfg.skipAuth !== 'boolean') {
    throw new Error('skipAuth must be a boolean');
  }

  if (cfg.requestId !== undefined && !isValidString(cfg.requestId)) {
    throw new Error('requestId must be a non-empty string');
  }
}
