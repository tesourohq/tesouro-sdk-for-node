/**
 * Tesouro SDK for Node.js
 *
 * A TypeScript-first GraphQL SDK with OpenID Connect authentication
 *
 * @version 0.0.1
 */

// Export errors
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

// Export authentication
export { AuthManager, type ClientCredentials } from './auth';

// Export types and configuration
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

// Export request utilities
export {
  makeRequest,
  get,
  post,
  mergeHeaders,
  DEFAULT_TIMEOUT,
  type RequestOptions,
  type HttpResponse,
} from './request';

// Export GraphQL utilities
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

// Export client
export { ApiClient, createClient, type ApiClientConfig, type ClientRequestOptions } from './client';

// Export generated client and types
export { GeneratedApiClient } from './generated/client-methods';
export type * from './generated/types';

/**
 * Simple hello world function for initial setup verification
 * @returns A greeting message
 */
export function hello(): string {
  return 'Hello from Tesouro SDK!';
}

// Export version for programmatic access
export const version = '0.0.1';
