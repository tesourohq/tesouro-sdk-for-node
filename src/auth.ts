/**
 * Authentication Manager for OpenID Connect
 *
 * Handles token storage, validation, and refresh logic for the SDK
 */

import { post } from './request';
import { SdkError, NetworkError } from './errors';

/**
 * Client credentials for OAuth authentication
 */
export interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

/**
 * OAuth token response structure
 */
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

/**
 * Stored token information
 */
interface TokenInfo {
  accessToken: string;
  expiresAt: Date;
  tokenType?: string;
}

/**
 * Authentication Manager class
 *
 * Manages OpenID Connect authentication tokens with automatic refresh
 * and proper expiration handling.
 */
export class AuthManager {
  private token: TokenInfo | null = null;
  private readonly credentials: ClientCredentials;
  private tokenEndpoint: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  /**
   * Creates a new AuthManager instance
   * @param credentials - Client credentials for authentication
   * @param tokenEndpoint - Optional token endpoint URL
   */
  constructor(credentials: ClientCredentials, tokenEndpoint?: string) {
    this.credentials = { ...credentials };
    this.tokenEndpoint = tokenEndpoint || null;
  }

  /**
   * Checks if the current token is valid and not expired
   * @returns true if the token is valid and not expired
   */
  isTokenValid(): boolean {
    if (!this.token) {
      return false;
    }

    // Check if token is expired (with 30 second buffer)
    const now = new Date();
    const bufferTime = 30 * 1000; // 30 seconds in milliseconds
    const expirationBuffer = new Date(this.token.expiresAt.getTime() - bufferTime);

    return now < expirationBuffer;
  }

  /**
   * Gets the current access token if valid
   * @returns The access token or null if not available/valid
   */
  getToken(): string | null {
    if (!this.isTokenValid()) {
      return null;
    }

    return this.token?.accessToken || null;
  }

  /**
   * Gets a valid access token, automatically refreshing if needed
   * @param forceRefresh - Force refresh even if token is still valid
   * @returns Promise resolving to access token or null if refresh fails
   */
  async getValidToken(forceRefresh = false): Promise<string | null> {
    // If forcing refresh or token needs refresh, attempt to refresh
    if (forceRefresh || this.shouldRefreshToken()) {
      try {
        await this.refreshToken();
      } catch {
        // If refresh fails but we still have a valid token, return it
        if (this.isTokenValid()) {
          return this.token!.accessToken;
        }
        // Otherwise, return null to indicate no valid token available
        return null;
      }
    }

    // Return the current token if valid
    if (this.isTokenValid()) {
      return this.token!.accessToken;
    }

    return null;
  }

  /**
   * Clears the stored token
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * Sets a token manually (primarily for testing)
   * @param accessToken - The access token
   * @param expiresInSeconds - Token expiration time in seconds
   * @param tokenType - Optional token type (defaults to 'Bearer')
   */
  setToken(accessToken: string, expiresInSeconds: number, tokenType?: string): void;
  /**
   * Sets a token with a specific expiration date
   * @param accessToken - The access token
   * @param expiresAt - Token expiration date
   * @param tokenType - Optional token type (defaults to 'Bearer')
   */
  setToken(accessToken: string, expiresAt: Date, tokenType?: string): void;
  /**
   * Sets a token without expiration information (will use a default expiration)
   * @param accessToken - The access token
   * @param tokenType - Optional token type (defaults to 'Bearer')
   */
  setToken(accessToken: string, tokenType?: string): void;
  setToken(
    accessToken: string,
    expiresInSecondsOrDateOrTokenType?: number | Date | string,
    tokenType?: string
  ): void {
    let expiresAt: Date;
    let finalTokenType = 'Bearer';

    // Handle different overload signatures
    if (typeof expiresInSecondsOrDateOrTokenType === 'number') {
      // setToken(token, expiresInSeconds, tokenType?)
      expiresAt = new Date(Date.now() + expiresInSecondsOrDateOrTokenType * 1000);
      finalTokenType = tokenType || 'Bearer';
    } else if (expiresInSecondsOrDateOrTokenType instanceof Date) {
      // setToken(token, expiresAt, tokenType?)
      expiresAt = expiresInSecondsOrDateOrTokenType;
      finalTokenType = tokenType || 'Bearer';
    } else if (typeof expiresInSecondsOrDateOrTokenType === 'string') {
      // setToken(token, tokenType)
      expiresAt = new Date(Date.now() + 3600 * 1000); // Default to 1 hour
      finalTokenType = expiresInSecondsOrDateOrTokenType;
    } else {
      // setToken(token) - no expiration info
      expiresAt = new Date(Date.now() + 3600 * 1000); // Default to 1 hour
    }

    this.token = {
      accessToken,
      expiresAt,
      tokenType: finalTokenType,
    };
  }

  /**
   * Gets the client credentials (for internal use)
   * @returns A copy of the client credentials
   */
  getCredentials(): ClientCredentials {
    return { ...this.credentials };
  }

  /**
   * Gets token expiration information
   * @returns Token expiration date or null if no token
   */
  getTokenExpiration(): Date | null {
    return this.token?.expiresAt || null;
  }

  /**
   * Gets the time remaining until token expiration
   * @returns Milliseconds until expiration, or 0 if no token or expired
   */
  getTimeUntilExpiration(): number {
    if (!this.token) {
      return 0;
    }

    const now = new Date().getTime();
    const expiration = this.token.expiresAt.getTime();
    const remaining = expiration - now;

    return Math.max(0, remaining);
  }

  /**
   * Checks if the token needs refresh soon (within 5 minutes)
   * @returns true if token should be refreshed
   */
  shouldRefreshToken(): boolean {
    if (!this.token) {
      return true;
    }

    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return this.getTimeUntilExpiration() <= fiveMinutes;
  }

  /**
   * Gets the authorization header value for the current token
   * @returns Authorization header value or null if no valid token
   */
  getAuthorizationHeader(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const tokenType = this.token?.tokenType || 'Bearer';
    return `${tokenType} ${token}`;
  }

  /**
   * Sets the token endpoint URL for OAuth token exchange
   * @param endpoint - Token endpoint URL
   */
  setTokenEndpoint(endpoint: string): void {
    this.tokenEndpoint = endpoint;
  }

  /**
   * Gets the current token endpoint URL
   * @returns Token endpoint URL or null if not set
   */
  getTokenEndpoint(): string | null {
    return this.tokenEndpoint;
  }

  /**
   * Refreshes the access token using OAuth client credentials flow with retry logic
   * @param tokenEndpoint - Optional token endpoint (uses configured one if not provided)
   * @returns Promise that resolves when token is refreshed
   * @throws SdkError if refresh fails after all retries
   */
  async refreshToken(tokenEndpoint?: string): Promise<void> {
    // If there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start the refresh process with retry logic
    this.refreshPromise = this.performTokenRefreshWithRetry(tokenEndpoint);

    try {
      await this.refreshPromise;
    } finally {
      // Clear the promise when done (success or failure)
      this.refreshPromise = null;
    }
  }

  /**
   * Performs token refresh with exponential backoff retry
   * @param tokenEndpoint - Token endpoint URL to use
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   * @private
   */
  private async performTokenRefreshWithRetry(
    tokenEndpoint?: string,
    maxRetries: number = 3
  ): Promise<void> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.performTokenRefresh(tokenEndpoint);
        return; // Success, exit retry loop
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // If this was the last attempt, don't wait
        if (attempt === maxRetries) {
          break;
        }

        // Check if error is retryable
        if (error instanceof SdkError && !error.isRetryable()) {
          throw error; // Don't retry non-retryable errors
        }

        // Calculate backoff delay with jitter: base delay ± 25% random variance
        const exponentialDelayMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        const jitterMs = exponentialDelayMs * 0.25 * (Math.random() * 2 - 1); // ±25% jitter
        const delayMs = Math.max(0, exponentialDelayMs + jitterMs);

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    // All retries failed, throw the last error
    throw lastError || new SdkError('Token refresh failed after all retry attempts');
  }

  /**
   * Performs the actual token refresh
   * @param tokenEndpoint - Token endpoint URL to use
   * @private
   */
  private async performTokenRefresh(tokenEndpoint?: string): Promise<void> {
    const endpoint = tokenEndpoint || this.tokenEndpoint;

    if (!endpoint) {
      throw new SdkError(
        'Token endpoint not configured. Please set the token endpoint URL before attempting token refresh.'
      );
    }

    try {
      // Prepare the OAuth client credentials request
      const body = new URLSearchParams();
      body.append('grant_type', 'client_credentials');
      body.append('client_id', this.credentials.clientId);
      body.append('client_secret', this.credentials.clientSecret);

      // Make the token request
      const response = await post(endpoint, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        timeout: 10000, // 10 second timeout for auth requests
      });

      // Parse the response
      if (!response.data || typeof response.data !== 'object') {
        throw new SdkError('Invalid token response: expected JSON object');
      }

      const tokenData = response.data as TokenResponse;

      // Validate required fields
      if (!tokenData.access_token) {
        throw new SdkError('Invalid token response: missing access_token');
      }

      if (!tokenData.expires_in || tokenData.expires_in <= 0) {
        throw new SdkError('Invalid token response: missing or invalid expires_in');
      }

      // Store the new token
      this.setToken(tokenData.access_token, tokenData.expires_in, tokenData.token_type || 'Bearer');
    } catch (error) {
      // Clear any existing token on refresh failure
      this.clearToken();

      if (error instanceof NetworkError) {
        throw new SdkError(`Failed to refresh access token: ${error.message}`, error);
      }

      if (error instanceof SdkError) {
        throw error;
      }

      throw new SdkError('Unexpected error during token refresh', error);
    }
  }
}
