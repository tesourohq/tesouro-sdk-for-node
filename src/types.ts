/**
 * Type definitions and validation for the Tesouro SDK
 *
 * This module defines all configuration interfaces, types, and validation
 * utilities used throughout the SDK.
 */

import { ClientCredentials } from './auth';

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
 * Type guard to check if a value is a valid string
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard to check if a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Type guard to check if a value is a valid positive number
 */
export function isValidPositiveNumber(value: unknown): value is number {
  return isValidNumber(value) && value > 0;
}

/**
 * Type guard to check if a value is a valid URL
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
 */
export function isValidClientCredentials(value: unknown): value is ClientCredentials {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const creds = value as Partial<ClientCredentials>;
  return isValidString(creds.clientId) && isValidString(creds.clientSecret);
}

/**
 * Validates client configuration and throws errors for invalid values
 * @param config - The configuration to validate
 * @throws Error if configuration is invalid
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
export function applyConfigDefaults(config: ClientConfig): Required<ClientConfig> {
  const endpoint = config.endpoint || process.env.TESOURO_ENDPOINT || DEFAULT_CONFIG.ENDPOINT;

  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    endpoint,
    timeout: config.timeout ?? DEFAULT_CONFIG.TIMEOUT,
    headers: config.headers ?? {},
    tokenEndpoint: config.tokenEndpoint ?? deriveTokenEndpoint(endpoint),
  };
}

/**
 * Derives the token endpoint URL from the GraphQL endpoint
 * @param graphqlEndpoint - The GraphQL endpoint URL
 * @returns The token endpoint URL
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
 * Validates request configuration
 * @param config - The request configuration to validate
 * @throws Error if configuration is invalid
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
