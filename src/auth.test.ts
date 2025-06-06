import { AuthManager, ClientCredentials } from './auth';
import { NetworkError } from './errors';
import { post } from './request';

// Mock the request module
jest.mock('./request', () => ({
  post: jest.fn(),
}));

const mockPost = post as jest.MockedFunction<typeof post>;

// Helper function to create mock HTTP responses
function createMockResponse<T>(data: T, status = 200, statusText = 'OK') {
  return {
    status,
    statusText,
    headers: new Headers(),
    data,
    response: new Response(),
  };
}

describe('AuthManager', () => {
  const mockCredentials: ClientCredentials = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
  };

  let authManager: AuthManager;

  beforeEach(() => {
    // Use fake timers to control setTimeout delays
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.useRealTimers();
  });

  beforeEach(() => {
    authManager = new AuthManager(mockCredentials);
    mockPost.mockClear();
  });

  describe('constructor', () => {
    it('should store credentials correctly', () => {
      const credentials = authManager.getCredentials();
      expect(credentials).toEqual(mockCredentials);
      expect(credentials).not.toBe(mockCredentials); // Should be a copy
    });

    it('should initialize with no token', () => {
      expect(authManager.isTokenValid()).toBe(false);
      expect(authManager.getToken()).toBeNull();
    });
  });

  describe('token validation', () => {
    it('should return false when no token is set', () => {
      expect(authManager.isTokenValid()).toBe(false);
    });

    it('should return true for valid, non-expired token', () => {
      authManager.setToken('valid-token', 3600); // 1 hour
      expect(authManager.isTokenValid()).toBe(true);
    });

    it('should return false for expired token', () => {
      authManager.setToken('expired-token', -100); // Expired 100 seconds ago
      expect(authManager.isTokenValid()).toBe(false);
    });

    it('should return false for token expiring within 30 seconds', () => {
      authManager.setToken('expiring-token', 15); // Expires in 15 seconds
      expect(authManager.isTokenValid()).toBe(false);
    });

    it('should return true for token expiring in more than 30 seconds', () => {
      authManager.setToken('valid-token', 60); // Expires in 60 seconds
      expect(authManager.isTokenValid()).toBe(true);
    });
  });

  describe('getToken', () => {
    it('should return null when no token is set', () => {
      expect(authManager.getToken()).toBeNull();
    });

    it('should return null when token is invalid', () => {
      authManager.setToken('expired-token', -100);
      expect(authManager.getToken()).toBeNull();
    });

    it('should return token when valid', () => {
      const token = 'valid-access-token';
      authManager.setToken(token, 3600);
      expect(authManager.getToken()).toBe(token);
    });
  });

  describe('setToken', () => {
    it('should store token with correct expiration', () => {
      const token = 'test-token';
      const expiresIn = 3600;
      const beforeSet = new Date();

      authManager.setToken(token, expiresIn);

      const afterSet = new Date();
      const expiration = authManager.getTokenExpiration();

      expect(expiration).toBeDefined();
      expect(expiration!.getTime()).toBeGreaterThanOrEqual(beforeSet.getTime() + expiresIn * 1000);
      expect(expiration!.getTime()).toBeLessThanOrEqual(afterSet.getTime() + expiresIn * 1000);
    });

    it('should store token with default Bearer type', () => {
      authManager.setToken('test-token', 3600);
      expect(authManager.isTokenValid()).toBe(true);
    });

    it('should store token with custom type', () => {
      authManager.setToken('test-token', 3600, 'Custom');
      expect(authManager.isTokenValid()).toBe(true);
    });
  });

  describe('clearToken', () => {
    it('should clear stored token', () => {
      authManager.setToken('test-token', 3600);
      expect(authManager.isTokenValid()).toBe(true);

      authManager.clearToken();
      expect(authManager.isTokenValid()).toBe(false);
      expect(authManager.getToken()).toBeNull();
    });
  });

  describe('getCredentials', () => {
    it('should return a copy of credentials', () => {
      const credentials = authManager.getCredentials();
      expect(credentials).toEqual(mockCredentials);
      expect(credentials).not.toBe(mockCredentials);
    });

    it('should not allow mutation of original credentials', () => {
      const credentials = authManager.getCredentials();
      credentials.clientId = 'modified';

      const freshCredentials = authManager.getCredentials();
      expect(freshCredentials.clientId).toBe(mockCredentials.clientId);
    });
  });

  describe('getTokenExpiration', () => {
    it('should return null when no token is set', () => {
      expect(authManager.getTokenExpiration()).toBeNull();
    });

    it('should return expiration date when token is set', () => {
      const expiresIn = 3600;
      const beforeSet = new Date();

      authManager.setToken('test-token', expiresIn);

      const expiration = authManager.getTokenExpiration();
      expect(expiration).toBeInstanceOf(Date);
      expect(expiration!.getTime()).toBeGreaterThan(beforeSet.getTime());
    });
  });

  describe('getTimeUntilExpiration', () => {
    it('should return 0 when no token is set', () => {
      expect(authManager.getTimeUntilExpiration()).toBe(0);
    });

    it('should return 0 for expired token', () => {
      authManager.setToken('expired-token', -100);
      expect(authManager.getTimeUntilExpiration()).toBe(0);
    });

    it('should return positive value for valid token', () => {
      authManager.setToken('valid-token', 3600);
      const timeRemaining = authManager.getTimeUntilExpiration();

      expect(timeRemaining).toBeGreaterThan(0);
      expect(timeRemaining).toBeLessThanOrEqual(3600 * 1000);
    });

    it('should decrease over time', async () => {
      authManager.setToken('valid-token', 10);
      const initialTime = authManager.getTimeUntilExpiration();

      // Advance fake timers by 100ms
      jest.advanceTimersByTime(100);

      const laterTime = authManager.getTimeUntilExpiration();
      expect(laterTime).toBeLessThan(initialTime);
    });
  });

  describe('shouldRefreshToken', () => {
    it('should return true when no token is set', () => {
      expect(authManager.shouldRefreshToken()).toBe(true);
    });

    it('should return true when token expires within 5 minutes', () => {
      authManager.setToken('expiring-token', 4 * 60); // 4 minutes
      expect(authManager.shouldRefreshToken()).toBe(true);
    });

    it('should return false when token expires in more than 5 minutes', () => {
      authManager.setToken('valid-token', 10 * 60); // 10 minutes
      expect(authManager.shouldRefreshToken()).toBe(false);
    });

    it('should return true for expired token', () => {
      authManager.setToken('expired-token', -100);
      expect(authManager.shouldRefreshToken()).toBe(true);
    });
  });

  describe('credential security', () => {
    it('should not expose credentials reference', () => {
      const creds1 = authManager.getCredentials();
      const creds2 = authManager.getCredentials();

      expect(creds1).not.toBe(creds2);
      expect(creds1).toEqual(creds2);
    });

    it('should maintain credential immutability', () => {
      const originalCredentials = authManager.getCredentials();
      originalCredentials.clientSecret = 'hacked';

      const currentCredentials = authManager.getCredentials();
      expect(currentCredentials.clientSecret).toBe(mockCredentials.clientSecret);
    });
  });

  describe('token endpoint management', () => {
    it('should set and get token endpoint', () => {
      const endpoint = 'https://auth.example.com/oauth/token';
      authManager.setTokenEndpoint(endpoint);
      expect(authManager.getTokenEndpoint()).toBe(endpoint);
    });

    it('should accept token endpoint in constructor', () => {
      const endpoint = 'https://auth.example.com/oauth/token';
      const managerWithEndpoint = new AuthManager(mockCredentials, endpoint);
      expect(managerWithEndpoint.getTokenEndpoint()).toBe(endpoint);
    });
  });

  describe('OAuth token refresh', () => {
    const tokenEndpoint = 'https://auth.example.com/oauth/token';
    const mockTokenResponse = {
      access_token: 'new-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'read write',
    };

    beforeEach(() => {
      authManager.setTokenEndpoint(tokenEndpoint);
    });

    it('should successfully refresh token', async () => {
      mockPost.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      await authManager.refreshToken();

      expect(mockPost).toHaveBeenCalledWith(
        tokenEndpoint,
        'grant_type=client_credentials&client_id=test-client-id&client_secret=test-client-secret',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          timeout: 10000,
        }
      );

      expect(authManager.isTokenValid()).toBe(true);
      expect(authManager.getToken()).toBe('new-access-token');
    });

    it('should refresh token with custom endpoint parameter', async () => {
      const customEndpoint = 'https://custom.auth.com/token';
      mockPost.mockResolvedValueOnce(createMockResponse(mockTokenResponse));

      await authManager.refreshToken(customEndpoint);

      expect(mockPost).toHaveBeenCalledWith(customEndpoint, expect.any(String), expect.any(Object));
    });

    it('should throw error when no token endpoint configured', async () => {
      const managerWithoutEndpoint = new AuthManager(mockCredentials);

      await expect(managerWithoutEndpoint.refreshToken()).rejects.toThrow(
        'Token endpoint not configured'
      );
    });

    it('should handle invalid token response format', async () => {
      // Mock all retry attempts to fail with invalid response
      mockPost.mockResolvedValue(createMockResponse('invalid response'));

      // Start the refresh and advance timers simultaneously
      const refreshPromise = expect(authManager.refreshToken()).rejects.toThrow(
        'Invalid token response: expected JSON object'
      );

      // Fast-forward through all retry delays
      await jest.runAllTimersAsync();

      // Wait for the assertion to complete
      await refreshPromise;

      expect(authManager.getToken()).toBeNull();
    });

    it('should handle missing access_token in response', async () => {
      mockPost.mockResolvedValue(
        createMockResponse({
          token_type: 'Bearer',
          expires_in: 3600,
        })
      );

      // Start the refresh and advance timers simultaneously
      const refreshPromise = expect(authManager.refreshToken()).rejects.toThrow(
        'Invalid token response: missing access_token'
      );

      // Fast-forward through all retry delays
      await jest.runAllTimersAsync();

      // Wait for the assertion to complete
      await refreshPromise;

      expect(authManager.getToken()).toBeNull();
    });

    it('should handle missing expires_in in response', async () => {
      mockPost.mockResolvedValue(
        createMockResponse({
          access_token: 'test-token',
          token_type: 'Bearer',
        })
      );

      // Start the refresh and advance timers simultaneously
      const refreshPromise = expect(authManager.refreshToken()).rejects.toThrow(
        'Invalid token response: missing or invalid expires_in'
      );

      // Fast-forward through all retry delays
      await jest.runAllTimersAsync();

      // Wait for the assertion to complete
      await refreshPromise;

      expect(authManager.getToken()).toBeNull();
    });

    it('should handle network errors', async () => {
      const networkError = new NetworkError('Connection failed');
      mockPost.mockRejectedValue(networkError);

      // Start the refresh and advance timers simultaneously
      const refreshPromise = expect(authManager.refreshToken()).rejects.toThrow(
        'Failed to refresh access token: Connection failed'
      );

      // Fast-forward through all retry delays
      await jest.runAllTimersAsync();

      // Wait for the assertion to complete
      await refreshPromise;

      expect(authManager.getToken()).toBeNull();
    });

    it('should handle unexpected errors', async () => {
      const unexpectedError = new Error('Something went wrong');
      mockPost.mockRejectedValue(unexpectedError);

      // Start the refresh and advance timers simultaneously
      const refreshPromise = expect(authManager.refreshToken()).rejects.toThrow(
        'Unexpected error during token refresh'
      );

      // Fast-forward through all retry delays
      await jest.runAllTimersAsync();

      // Wait for the assertion to complete
      await refreshPromise;

      expect(authManager.getToken()).toBeNull();
    });

    it('should prevent concurrent refresh attempts', async () => {
      let resolveFirst: (value: any) => void;
      const firstPromise = new Promise<ReturnType<typeof createMockResponse>>((resolve) => {
        resolveFirst = resolve;
      });

      mockPost.mockImplementationOnce(() => firstPromise);

      // Start two refresh attempts simultaneously
      const promise1 = authManager.refreshToken();
      const promise2 = authManager.refreshToken();

      // Resolve the first request
      resolveFirst!(createMockResponse(mockTokenResponse));

      // Both promises should resolve to the same result
      await Promise.all([promise1, promise2]);

      // post should only have been called once
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it('should clear existing token on refresh failure', async () => {
      // Set an existing token
      authManager.setToken('existing-token', 3600);
      expect(authManager.getToken()).toBe('existing-token');

      // Mock a failed refresh for all retry attempts
      mockPost.mockRejectedValue(new Error('Refresh failed'));

      // Start the refresh and advance timers simultaneously
      const refreshPromise = expect(authManager.refreshToken()).rejects.toThrow(
        'Unexpected error during token refresh'
      );

      // Fast-forward through all retry delays
      await jest.runAllTimersAsync();

      // Wait for the assertion to complete
      await refreshPromise;

      // Token should be cleared
      expect(authManager.getToken()).toBeNull();
    });

    it('should use custom token type from response', async () => {
      const customTokenResponse = {
        ...mockTokenResponse,
        token_type: 'Custom',
      };

      mockPost.mockResolvedValueOnce(createMockResponse(customTokenResponse));

      await authManager.refreshToken();

      expect(authManager.getAuthorizationHeader()).toBe('Custom new-access-token');
    });
  });
});
