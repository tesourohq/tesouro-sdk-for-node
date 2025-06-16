import {
  ClientConfig,
  ProxyConfig,
  DEFAULT_CONFIG,
  isValidString,
  isValidNumber,
  isValidPositiveNumber,
  isValidUrl,
  isValidHeaders,
  isValidClientCredentials,
  validateClientConfig,
  validateRequestConfig,
  applyConfigDefaults,
  deriveTokenEndpoint,
} from '../../src/types';

describe('Type Guards', () => {
  describe('isValidString', () => {
    it('should return true for non-empty strings', () => {
      expect(isValidString('hello')).toBe(true);
      expect(isValidString('a')).toBe(true);
      expect(isValidString(' ')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(isValidString('')).toBe(false);
    });

    it('should return false for non-strings', () => {
      expect(isValidString(null)).toBe(false);
      expect(isValidString(undefined)).toBe(false);
      expect(isValidString(123)).toBe(false);
      expect(isValidString({})).toBe(false);
      expect(isValidString([])).toBe(false);
    });
  });

  describe('isValidNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(42)).toBe(true);
      expect(isValidNumber(-10)).toBe(true);
      expect(isValidNumber(3.14)).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isValidNumber('123')).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
    });
  });

  describe('isValidPositiveNumber', () => {
    it('should return true for positive numbers', () => {
      expect(isValidPositiveNumber(1)).toBe(true);
      expect(isValidPositiveNumber(42)).toBe(true);
      expect(isValidPositiveNumber(3.14)).toBe(true);
    });

    it('should return false for zero and negative numbers', () => {
      expect(isValidPositiveNumber(0)).toBe(false);
      expect(isValidPositiveNumber(-1)).toBe(false);
      expect(isValidPositiveNumber(-42)).toBe(false);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidPositiveNumber(NaN)).toBe(false);
      expect(isValidPositiveNumber(Infinity)).toBe(false);
      expect(isValidPositiveNumber('123')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://api.sandbox.tesouro.com/graphql')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('should return false for non-strings', () => {
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
      expect(isValidUrl(123)).toBe(false);
    });
  });

  describe('isValidHeaders', () => {
    it('should return true for valid headers objects', () => {
      expect(isValidHeaders({})).toBe(true);
      expect(isValidHeaders({ 'Content-Type': 'application/json' })).toBe(true);
      expect(isValidHeaders({ 'X-API-Key': 'secret', Authorization: 'Bearer token' })).toBe(true);
    });

    it('should return false for objects with non-string values', () => {
      expect(isValidHeaders({ 'Content-Length': 123 })).toBe(false);
      expect(isValidHeaders({ Custom: null })).toBe(false);
      expect(isValidHeaders({ Nested: { key: 'value' } })).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isValidHeaders(null)).toBe(false);
      expect(isValidHeaders('headers')).toBe(false);
      expect(isValidHeaders([])).toBe(false);
    });
  });

  describe('isValidClientCredentials', () => {
    it('should return true for valid credentials', () => {
      expect(
        isValidClientCredentials({
          clientId: 'test-id',
          clientSecret: 'test-secret',
        })
      ).toBe(true);
    });

    it('should return false for missing fields', () => {
      expect(isValidClientCredentials({})).toBe(false);
      expect(isValidClientCredentials({ clientId: 'test' })).toBe(false);
      expect(isValidClientCredentials({ clientSecret: 'test' })).toBe(false);
    });

    it('should return false for invalid field types', () => {
      expect(
        isValidClientCredentials({
          clientId: '',
          clientSecret: 'test',
        })
      ).toBe(false);
      expect(
        isValidClientCredentials({
          clientId: 'test',
          clientSecret: 123,
        })
      ).toBe(false);
    });
  });
});

describe('Configuration Validation', () => {
  describe('validateClientConfig', () => {
    it('should pass for valid configuration', () => {
      const config = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
      };
      expect(() => validateClientConfig(config)).not.toThrow();
    });

    it('should pass for configuration with optional fields', () => {
      const config = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
        endpoint: 'https://api.example.com/graphql',
        timeout: 5000,
        headers: { 'X-API-Key': 'secret' },
        tokenEndpoint: 'https://api.example.com/token',
      };
      expect(() => validateClientConfig(config)).not.toThrow();
    });

    it('should throw for missing required fields', () => {
      expect(() => validateClientConfig({})).toThrow('clientId must be a non-empty string');
      expect(() => validateClientConfig({ clientId: 'test' })).toThrow(
        'clientSecret must be a non-empty string'
      );
    });

    it('should throw for invalid field types', () => {
      expect(() =>
        validateClientConfig({
          clientId: '',
          clientSecret: 'test',
        })
      ).toThrow('clientId must be a non-empty string');

      expect(() =>
        validateClientConfig({
          clientId: 'test',
          clientSecret: 'secret',
          endpoint: 'not-a-url',
        })
      ).toThrow('endpoint must be a valid URL');

      expect(() =>
        validateClientConfig({
          clientId: 'test',
          clientSecret: 'secret',
          timeout: -100,
        })
      ).toThrow('timeout must be a positive number');
    });

    it('should throw for non-object input', () => {
      expect(() => validateClientConfig(null)).toThrow('Configuration must be an object');
      expect(() => validateClientConfig('string')).toThrow('Configuration must be an object');
    });
  });

  describe('validateRequestConfig', () => {
    it('should pass for valid request configuration', () => {
      const config = {
        timeout: 5000,
        headers: { 'X-Request-ID': '123' },
        skipAuth: true,
        requestId: 'req-456',
      };
      expect(() => validateRequestConfig(config)).not.toThrow();
    });

    it('should pass for empty configuration', () => {
      expect(() => validateRequestConfig({})).not.toThrow();
    });

    it('should throw for invalid field types', () => {
      expect(() =>
        validateRequestConfig({
          timeout: -100,
        })
      ).toThrow('timeout must be a positive number');

      expect(() =>
        validateRequestConfig({
          headers: { 'X-Count': 123 },
        })
      ).toThrow('headers must be a Record<string, string>');

      expect(() =>
        validateRequestConfig({
          skipAuth: 'yes',
        })
      ).toThrow('skipAuth must be a boolean');

      expect(() =>
        validateRequestConfig({
          requestId: '',
        })
      ).toThrow('requestId must be a non-empty string');
    });
  });
});

describe('Configuration Utilities', () => {
  describe('deriveTokenEndpoint', () => {
    it('should derive token endpoint from GraphQL endpoint', () => {
      expect(deriveTokenEndpoint('https://api.example.com/graphql')).toBe(
        'https://api.example.com/openid/connect/token'
      );

      expect(deriveTokenEndpoint('https://api.sandbox.tesouro.com/graphql/')).toBe(
        'https://api.sandbox.tesouro.com/openid/connect/token'
      );
    });

    it('should handle different URL structures', () => {
      expect(deriveTokenEndpoint('https://localhost:8080/api/graphql')).toBe(
        'https://localhost:8080/api/openid/connect/token'
      );
    });

    it('should throw for invalid URLs', () => {
      expect(() => deriveTokenEndpoint('not-a-url')).toThrow();
    });
  });

  describe('applyConfigDefaults', () => {
    it('should apply default values', () => {
      const config: ClientConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
      };

      const result = applyConfigDefaults(config);

      expect(result).toEqual({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        endpoint: DEFAULT_CONFIG.ENDPOINT,
        timeout: DEFAULT_CONFIG.TIMEOUT,
        headers: {},
        tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token',
      });
    });

    it('should preserve provided values', () => {
      const config: ClientConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
        endpoint: 'https://custom.api.com/graphql',
        timeout: 5000,
        headers: { 'X-API-Key': 'secret' },
        tokenEndpoint: 'https://custom.api.com/token',
      };

      const result = applyConfigDefaults(config);

      expect(result).toEqual(config);
    });

    it('should use environment variable for endpoint if available', () => {
      const originalEnv = process.env.TESOURO_ENDPOINT;
      process.env.TESOURO_ENDPOINT = 'https://env.api.com/graphql';

      try {
        const config: ClientConfig = {
          clientId: 'test-id',
          clientSecret: 'test-secret',
        };

        const result = applyConfigDefaults(config);
        expect(result.endpoint).toBe('https://env.api.com/graphql');
      } finally {
        if (originalEnv) {
          process.env.TESOURO_ENDPOINT = originalEnv;
        } else {
          delete process.env.TESOURO_ENDPOINT;
        }
      }
    });
  });
});

describe('Default Configuration', () => {
  it('should have correct default values', () => {
    expect(DEFAULT_CONFIG.ENDPOINT).toBe('https://api.sandbox.tesouro.com/graphql');
    expect(DEFAULT_CONFIG.TIMEOUT).toBe(30000);
    expect(DEFAULT_CONFIG.AUTH_TIMEOUT).toBe(10000);
  });
});

describe('Proxy Configuration', () => {
  describe('proxy config in ClientConfig', () => {
    it('should accept valid proxy configuration', () => {
      const config: ClientConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
        proxy: {
          url: 'http://proxy.example.com:8080',
          username: 'user',
          password: 'pass',
        },
      };

      expect(() => validateClientConfig(config)).not.toThrow();
    });

    it('should accept proxy config without authentication', () => {
      const config: ClientConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
        proxy: {
          url: 'http://proxy.example.com:8080',
        },
      };

      expect(() => validateClientConfig(config)).not.toThrow();
    });

    it('should work without proxy configuration', () => {
      const config: ClientConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
      };

      expect(() => validateClientConfig(config)).not.toThrow();
    });

    it('should preserve proxy config in applyConfigDefaults', () => {
      const proxyConfig: ProxyConfig = {
        url: 'http://proxy.example.com:8080',
        username: 'user',
        password: 'pass',
      };

      const config: ClientConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
        proxy: proxyConfig,
      };

      const result = applyConfigDefaults(config);
      expect(result.proxy).toEqual(proxyConfig);
    });

    it('should not include proxy in defaults when not provided', () => {
      const config: ClientConfig = {
        clientId: 'test-id',
        clientSecret: 'test-secret',
      };

      const result = applyConfigDefaults(config);
      expect(result.proxy).toBeUndefined();
    });
  });
});
