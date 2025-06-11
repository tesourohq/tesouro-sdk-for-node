/**
 * Tesouro SDK for Node.js
 *
 * A TypeScript-first GraphQL SDK with OpenID Connect authentication
 *
 * @version 0.0.1
 */

/**
 * Error handling classes and utilities
 * Comprehensive error types for GraphQL, network, and SDK-specific errors
 */
export {
  SdkError,
  NetworkError,
  GraphQLError,
  ResponseError,
  ErrorUtils,
  type GraphQLErrorPath,
  type GraphQLErrorExtensions,
  type ErrorContext,
} from './errors';

/**
 * Authentication management
 * OAuth 2.0 client credentials flow with automatic token refresh
 */
export { AuthManager, type ClientCredentials } from './auth';

/**
 * Configuration types and validation utilities
 * Type-safe configuration with validation helpers and defaults
 */
export {
  type ClientConfig,
  type AuthConfig,
  type RequestConfig,
  DEFAULT_CONFIG,
  validateClientConfig,
  validateRequestConfig,
  applyConfigDefaults,
  deriveTokenEndpoint,
} from './types';

/**
 * Low-level HTTP request utilities
 * Core HTTP functionality used by GraphQL layer
 */
export {
  makeRequest,
  get,
  post,
  mergeHeaders,
  DEFAULT_TIMEOUT,
  type RequestOptions,
  type HttpResponse,
} from './request';

/**
 * GraphQL request handling and utilities
 * GraphQL-specific request logic with error handling
 */
export {
  makeGraphQLRequest,
  formatGraphQLQuery,
  isValidGraphQLQuery,
  safeStringifyVariables,
  type GraphQLVariables,
  type GraphQLResponse,
  type GraphQLRequestOptions,
  type GraphQLResult,
  type GraphQLRequestBody,
} from './graphql';

/**
 * Base API client and factory functions
 * Core client infrastructure extended by generated client
 */
export { ApiClient, createClient, type ApiClientConfig, type ClientRequestOptions } from './client';

/**
 * Main SDK client and generated types
 * Auto-generated client with typed methods for all GraphQL operations
 */
export { TesouroClient } from './generated/client-methods';
export type * from './generated/types';

/**
 * Simple hello world function for initial setup verification
 * @returns A greeting message
 */
export function hello(): string {
  return 'Hello from Tesouro SDK!';
}

/**
 * SDK version for programmatic access
 * Current version of the Tesouro SDK
 */
export const version = '0.0.1';
