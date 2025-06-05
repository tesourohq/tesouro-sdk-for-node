import { AuthManager, ClientCredentials } from './auth';

describe('AuthManager', () => {
  const mockCredentials: ClientCredentials = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
  };

  let authManager: AuthManager;

  beforeEach(() => {
    authManager = new AuthManager(mockCredentials);
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

      // Wait a small amount
      await new Promise((resolve) => setTimeout(resolve, 100));

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
});
