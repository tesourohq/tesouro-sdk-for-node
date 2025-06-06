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
import type {
  User,
  Transaction,
  QueryGetUserArgs,
  QueryGetTransactionArgs,
  MutationCreateUserArgs,
} from './generated/types';

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
    return makeGraphQLRequest<TResult>(this.config.endpoint, query, {
      ...graphqlOptions,
      variables: variables as Record<string, unknown> | undefined,
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

  /**
   * Gets a user by their ID
   *
   * @param variables - Query variables including user ID
   * @param options - Additional request options
   * @returns Promise resolving to user data
   * @example
   * ```typescript
   * const user = await client.getUser({ id: '123' });
   * console.log(user.data?.name);
   * ```
   */
  async getUser(
    variables: QueryGetUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ getUser: User | null }>> {
    const query = `
      query GetUser($id: ID!) {
        getUser(id: $id) {
          id
          email
          name
          createdAt
          transactions {
            id
            amount
            currency
            status
            createdAt
          }
        }
      }
    `;

    return this.query<{ getUser: User | null }, QueryGetUserArgs>(query, variables, options);
  }

  /**
   * Gets a transaction by its ID
   *
   * @param variables - Query variables including transaction ID
   * @param options - Additional request options
   * @returns Promise resolving to transaction data
   */
  async getTransaction(
    variables: QueryGetTransactionArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ getTransaction: Transaction | null }>> {
    const query = `
      query GetTransaction($id: ID!) {
        getTransaction(id: $id) {
          id
          amount
          currency
          status
          createdAt
          updatedAt
          metadata
          user {
            id
            email
            name
          }
        }
      }
    `;

    return this.query<{ getTransaction: Transaction | null }, QueryGetTransactionArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * Creates a new user
   *
   * @param variables - Mutation variables including user input
   * @param options - Additional request options
   * @returns Promise resolving to created user data
   */
  async createUser(
    variables: MutationCreateUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ createUser: User }>> {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          email
          name
          createdAt
        }
      }
    `;

    return this.mutate<{ createUser: User }, MutationCreateUserArgs>(mutation, variables, options);
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
