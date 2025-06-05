/**
 * Authentication Manager for OpenID Connect
 *
 * Handles token storage, validation, and refresh logic for the SDK
 */

/**
 * Client credentials for OAuth authentication
 */
export interface ClientCredentials {
  clientId: string;
  clientSecret: string;
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

  /**
   * Creates a new AuthManager instance
   * @param credentials - Client credentials for authentication
   */
  constructor(credentials: ClientCredentials) {
    this.credentials = { ...credentials };
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
}
