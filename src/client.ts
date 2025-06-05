/**
 * Main API client for the Tesouro SDK
 *
 * Provides a high-level interface for interacting with GraphQL APIs
 * with built-in authentication, error handling, and request management.
 */

import { AuthManager, type ClientCredentials } from './auth';
import { makeGraphQLRequest, type GraphQLRequestOptions, type GraphQLResult } from './graphql';
import { type ClientConfig, validateClientConfig, applyConfigDefaults } from './types';
import { SdkError } from './errors';

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
    this.authManager = new AuthManager(credentials);

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
   * @param options - Request options including variables and headers
   * @returns Promise resolving to GraphQL result
   * @throws SdkError for authentication or configuration issues
   * @throws GraphQLError for GraphQL-specific errors
   * @throws NetworkError for network-related issues
   */
  async request<T = unknown>(
    query: string,
    options: ClientRequestOptions = {}
  ): Promise<GraphQLResult<T>> {
    const { headers = {}, autoRefresh = true, includeAuth = true, ...graphqlOptions } = options;

    // Start with default headers from configuration
    const requestHeaders = { ...this.config.headers };

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

    // Make GraphQL request
    return makeGraphQLRequest<T>(this.config.endpoint, query, {
      ...graphqlOptions,
      headers: requestHeaders,
      timeout: graphqlOptions.timeout || this.config.timeout,
    });
  }

  /**
   * Makes a GraphQL query request
   *
   * @param query - GraphQL query string
   * @param variables - Query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */
  async query<T = unknown>(
    query: string,
    variables?: Record<string, unknown>,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<T>> {
    return this.request<T>(query, { ...options, variables });
  }

  /**
   * Makes a GraphQL mutation request
   *
   * @param mutation - GraphQL mutation string
   * @param variables - Mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */
  async mutate<T = unknown>(
    mutation: string,
    variables?: Record<string, unknown>,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<T>> {
    return this.request<T>(mutation, { ...options, variables });
  }

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
      // This would typically make a request to the token endpoint
      // For now, we'll throw an error indicating this needs OAuth implementation
      throw new SdkError(
        'Token refresh not yet implemented. OAuth client credentials flow will be added in a future step.'
      );
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
