/**
 * Main API client for the Tesouro SDK
 *
 * Provides a high-level interface for interacting with GraphQL APIs
 * with built-in authentication, error handling, and request management.
 */

import { AuthManager, type ClientCredentials } from './auth';
import {
  makeGraphQLRequest,
  type GraphQLRequestOptions,
  type GraphQLResult,
  isMutation,
} from './graphql';
import {
  type ClientConfig,
  validateClientConfig,
  applyConfigDefaults,
  deriveTokenEndpoint,
} from './types';

// Re-export types that generated code needs
export type { GraphQLResult } from './graphql';
import { SdkError, NetworkError } from './errors';
// Note: Real schema types will be imported as needed

/**
 * Generate User-Agent header value for SDK requests
 */
function generateUserAgent(): string {
  return 'tesouro-sdk-for-node';
}

/**
 * Configuration options for initializing the API client
 */
export interface ApiClientConfig extends ClientConfig {
  /** Optional initial access token */
  accessToken?: string;
}

/**
 * Options for making GraphQL requests
 */
export interface ClientRequestOptions extends Omit<GraphQLRequestOptions, 'headers'> {
  /** Additional headers to include with the request */
  headers?: Record<string, string>;
  /** Whether to automatically refresh expired tokens (default: true) */
  autoRefresh?: boolean;
  /** Whether to include authentication headers (default: true) */
  includeAuth?: boolean;
}

/**
 * Main API client class for the Tesouro SDK
 *
 * Provides a high-level interface for making authenticated GraphQL requests
 * with automatic token management and comprehensive error handling.
 */
export class ApiClient {
  private readonly config: Required<ClientConfig>;
  private readonly authManager: AuthManager;

  /**
   * Creates a new API client instance
   *
   * @param config - Client configuration including credentials and endpoint
   */
  constructor(config: ApiClientConfig) {
    // Validate and apply defaults to configuration
    validateClientConfig(config);
    this.config = applyConfigDefaults(config);

    // Initialize authentication manager
    const credentials: ClientCredentials = {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    };

    // Derive token endpoint from GraphQL endpoint if not provided
    const tokenEndpoint = config.tokenEndpoint || deriveTokenEndpoint(this.config.endpoint);
    this.authManager = new AuthManager(credentials, tokenEndpoint);

    // Set initial access token if provided
    if (config.accessToken) {
      // Parse token to extract expiration (basic JWT parsing)
      const tokenParts = config.accessToken.split('.');
      if (tokenParts.length === 3) {
        try {
          // Use Buffer for base64 decoding in Node.js
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
          if (payload.exp) {
            const expiresAt = new Date(payload.exp * 1000);
            this.authManager.setToken(config.accessToken, expiresAt);
          } else {
            this.authManager.setToken(config.accessToken);
          }
        } catch {
          // If token parsing fails, set without expiration
          this.authManager.setToken(config.accessToken);
        }
      } else {
        // Non-JWT token, set without expiration
        this.authManager.setToken(config.accessToken);
      }
    }
  }

  /**
   * Makes a GraphQL request to the configured endpoint
   *
   * @param query - GraphQL query string
   * @param variables - GraphQL variables (typed)
   * @param options - Request options including headers
   * @returns Promise resolving to GraphQL result
   * @throws SdkError for authentication or configuration issues
   * @throws GraphQLError for GraphQL-specific errors
   * @throws NetworkError for network-related issues
   */
  async request<TResult = unknown, TVariables = Record<string, unknown>>(
    query: string,
    variables?: TVariables,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<TResult>> {
    const { headers = {}, autoRefresh = true, includeAuth = true, ...graphqlOptions } = options;

    // Start with default headers from configuration
    const requestHeaders = { ...this.config.headers };

    // Add SDK User-Agent header (can be overridden by custom headers)
    requestHeaders['user-agent'] = generateUserAgent();

    // Add custom headers (these should override defaults)
    Object.assign(requestHeaders, headers);

    // Add authentication if enabled (this should override everything)
    if (includeAuth) {
      await this.ensureAuthenticated(autoRefresh);
      const authHeader = this.authManager.getAuthorizationHeader();
      if (authHeader) {
        requestHeaders.authorization = authHeader;
      }
    }

    // Make GraphQL request with 401 retry logic
    try {
      return await makeGraphQLRequest<TResult>(this.config.endpoint, query, {
        ...graphqlOptions,
        variables: variables as Record<string, unknown> | undefined,
        headers: requestHeaders,
        timeout: graphqlOptions.timeout || this.config.timeout,
      });
    } catch (error: unknown) {
      // Handle retryable errors by attempting token refresh
      // For financial safety, we only retry mutations on authentication errors (401)
      // because they guarantee the operation was rejected before processing
      const isMutationOperation = isMutation(query);
      const shouldRetry =
        includeAuth &&
        autoRefresh &&
        (isMutationOperation
          ? this.isSafeToRetryForMutation(error)
          : error instanceof NetworkError && error.statusCode === 401);

      if (shouldRetry) {
        try {
          // Force refresh the token
          await this.refreshToken();

          // Update the authorization header with the new token
          const newAuthHeader = this.authManager.getAuthorizationHeader();
          if (newAuthHeader) {
            requestHeaders.authorization = newAuthHeader;
          }
        } catch (refreshError) {
          // If token refresh fails, create a new error that explains the authentication failure
          throw new SdkError(
            'Authentication failed: received 401 Unauthorized response and automatic token refresh failed',
            refreshError
          );
        }

        // Retry the request with the new token
        return await makeGraphQLRequest<TResult>(this.config.endpoint, query, {
          ...graphqlOptions,
          variables: variables as Record<string, unknown> | undefined,
          headers: requestHeaders,
          timeout: graphqlOptions.timeout || this.config.timeout,
        });
      }

      // Re-throw all other errors
      throw error;
    }
  }

  /**
   * Makes a GraphQL query request
   *
   * @param query - GraphQL query string
   * @param variables - Query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */
  async query<TResult = unknown, TVariables = Record<string, unknown>>(
    query: string,
    variables?: TVariables,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<TResult>> {
    return this.request<TResult, TVariables>(query, variables, options);
  }

  /**
   * Makes a GraphQL mutation request
   *
   * @param mutation - GraphQL mutation string
   * @param variables - Mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */
  async mutate<TResult = unknown, TVariables = Record<string, unknown>>(
    mutation: string,
    variables?: TVariables,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<TResult>> {
    return this.request<TResult, TVariables>(mutation, variables, options);
  }

  // Generated methods will extend this class via TesouroClient

  /**
   * Sets a new access token
   *
   * @param token - Access token string
   * @param expiresAt - Optional expiration date
   */
  setAccessToken(token: string, expiresAt?: Date): void {
    if (expiresAt) {
      this.authManager.setToken(token, expiresAt);
    } else {
      this.authManager.setToken(token);
    }
  }

  /**
   * Clears the current access token
   */
  clearAccessToken(): void {
    this.authManager.clearToken();
  }

  /**
   * Gets the current access token if available and valid
   *
   * @returns Current access token or null
   */
  getAccessToken(): string | null {
    return this.authManager.getToken();
  }

  /**
   * Checks if the client is currently authenticated
   *
   * @returns True if authenticated with valid token
   */
  isAuthenticated(): boolean {
    return this.authManager.isTokenValid();
  }

  /**
   * Gets the current configuration
   *
   * @returns Client configuration (read-only copy)
   */
  getConfig(): Readonly<Required<ClientConfig>> {
    return { ...this.config };
  }

  /**
   * Determines if an error is safe to retry for mutations
   *
   * Only authentication errors (401) are considered safe to retry for mutations
   * because they indicate the request was rejected before processing.
   *
   * @param error - The error to check
   * @returns True if the error is safe to retry for mutations
   */
  private isSafeToRetryForMutation(error: unknown): boolean {
    // Only 401 authentication errors are safe to retry for mutations
    // because they mean the request was rejected before any processing occurred
    return error instanceof NetworkError && error.statusCode === 401;
  }

  /**
   * Gets the authentication manager instance
   *
   * @returns Authentication manager (for advanced usage)
   */
  getAuthManager(): AuthManager {
    return this.authManager;
  }

  /**
   * Refreshes the access token using client credentials
   *
   * @returns Promise resolving when token is refreshed
   * @throws SdkError if refresh fails
   */
  async refreshToken(): Promise<void> {
    try {
      await this.authManager.refreshToken();
    } catch (error) {
      if (error instanceof SdkError) {
        throw error;
      }
      throw new SdkError('Failed to refresh access token', error);
    }
  }

  /**
   * Ensures the client has a valid authentication token
   *
   * @param autoRefresh - Whether to automatically refresh expired tokens
   * @throws SdkError if authentication is required but not available
   */
  private async ensureAuthenticated(autoRefresh: boolean): Promise<void> {
    // If we have a valid token, we're good
    if (this.authManager.isTokenValid()) {
      return;
    }

    // If auto-refresh is enabled and token should be refreshed
    if (autoRefresh && this.authManager.shouldRefreshToken()) {
      try {
        await this.refreshToken();
        return;
      } catch {
        // If refresh fails, continue to check if we can still use the token
        if (this.authManager.isTokenValid()) {
          return;
        }
      }
    }

    // If we still don't have a valid token, throw an error
    if (!this.authManager.isTokenValid()) {
      throw new SdkError(
        'Authentication required but no valid access token available. ' +
          'Please set an access token or implement OAuth token refresh.'
      );
    }
  }
}

/**
 * Creates a new API client instance with the provided configuration
 *
 * @param config - Client configuration
 * @returns New API client instance
 */
export function createClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
