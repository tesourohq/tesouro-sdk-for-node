import { ApiClient, createClient, type ApiClientConfig } from './client';
import { AuthManager } from './auth';
import { makeGraphQLRequest } from './graphql';
import { SdkError, GraphQLError, NetworkError } from './errors';

// Mock the graphql module
jest.mock('./graphql');
const mockMakeGraphQLRequest = makeGraphQLRequest as jest.MockedFunction<typeof makeGraphQLRequest>;

// Mock the auth module
jest.mock('./auth');
const MockAuthManager = AuthManager as jest.MockedClass<typeof AuthManager>;

describe('ApiClient', () => {
  const baseConfig: ApiClientConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    endpoint: 'https://api.example.com/graphql',
  };

  const mockAuthManager = {
    setToken: jest.fn(),
    clearToken: jest.fn(),
    getToken: jest.fn(),
    isTokenValid: jest.fn(),
    shouldRefreshToken: jest.fn(),
    getAuthorizationHeader: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    MockAuthManager.mockImplementation(() => mockAuthManager as any);
  });

  describe('constructor', () => {
    it('should create client with valid configuration', () => {
      const client = new ApiClient(baseConfig);
      expect(client).toBeInstanceOf(ApiClient);
      expect(MockAuthManager).toHaveBeenCalledWith({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      });
    });

    it('should apply configuration defaults', () => {
      const client = new ApiClient(baseConfig);
      const config = client.getConfig();

      expect(config.endpoint).toBe('https://api.example.com/graphql');
      expect(config.timeout).toBe(30000); // Default timeout
      expect(config.headers).toEqual({});
    });

    it('should set initial access token when provided', () => {
      const accessToken = 'test-access-token';
      new ApiClient({ ...baseConfig, accessToken });

      expect(mockAuthManager.setToken).toHaveBeenCalledWith(accessToken);
    });

    it('should parse JWT token and extract expiration', () => {
      // Create a simple JWT-like token (header.payload.signature)
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // Expires in 1 hour
      const token = `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;

      new ApiClient({ ...baseConfig, accessToken: token });

      expect(mockAuthManager.setToken).toHaveBeenCalledWith(token, expect.any(Date));
    });

    it('should handle malformed JWT tokens gracefully', () => {
      const malformedToken = 'not.a.valid.jwt.token';
      new ApiClient({ ...baseConfig, accessToken: malformedToken });

      expect(mockAuthManager.setToken).toHaveBeenCalledWith(malformedToken);
    });

    it('should throw error for invalid configuration', () => {
      const invalidConfig = {
        clientId: 'test-client',
        clientSecret: 'test-secret',
        endpoint: 'not-a-url',
      };

      expect(() => new ApiClient(invalidConfig)).toThrow();
    });
  });

  describe('request', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(baseConfig);
      mockAuthManager.isTokenValid.mockReturnValue(true);
      mockAuthManager.getAuthorizationHeader.mockReturnValue('Bearer test-token');
    });

    it('should make successful GraphQL request', async () => {
      const mockResult = {
        data: { user: { name: 'John' } },
        response: {} as any,
        requestId: 'req-123',
      };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      const query = 'query { user { name } }';
      const result = await client.request(query);

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        'https://api.example.com/graphql',
        query,
        {
          headers: {
            authorization: 'Bearer test-token',
          },
          timeout: 30000,
        }
      );
      expect(result).toBe(mockResult);
    });

    it('should include custom headers', async () => {
      const mockResult = { data: {}, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      const customHeaders = {
        'x-custom-header': 'custom-value',
        'content-type': 'application/json',
      };

      await client.request('query { test }', undefined, { headers: customHeaders });

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(customHeaders),
        })
      );
    });

    it('should pass through GraphQL options', async () => {
      const mockResult = { data: {}, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      await client.request(
        'query GetUser($id: ID!) { user(id: $id) { name } }',
        { id: '123' },
        {
          operationName: 'GetUser',
          timeout: 5000,
        }
      );

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          variables: { id: '123' },
          operationName: 'GetUser',
          timeout: 5000,
        })
      );
    });

    it('should skip authentication when includeAuth is false', async () => {
      const mockResult = { data: {}, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      await client.request('query { test }', undefined, { includeAuth: false });

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            authorization: expect.any(String),
          }),
        })
      );
    });

    it('should throw error when authentication required but not available', async () => {
      mockAuthManager.isTokenValid.mockReturnValue(false);
      mockAuthManager.shouldRefreshToken.mockReturnValue(false);

      await expect(client.request('query { test }')).rejects.toThrow(SdkError);
      await expect(client.request('query { test }')).rejects.toThrow('Authentication required');
    });

    it('should attempt token refresh when autoRefresh is enabled', async () => {
      mockAuthManager.isTokenValid.mockReturnValueOnce(false).mockReturnValueOnce(true);
      mockAuthManager.shouldRefreshToken.mockReturnValue(true);

      // Mock refreshToken to fail (since it's not implemented yet)
      const refreshTokenSpy = jest
        .spyOn(client, 'refreshToken')
        .mockRejectedValue(new SdkError('Token refresh not yet implemented'));

      const mockResult = { data: {}, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      await client.request('query { test }');

      expect(refreshTokenSpy).toHaveBeenCalled();
    });

    it('should re-throw GraphQL errors', async () => {
      const graphqlError = new GraphQLError('User not found');
      mockMakeGraphQLRequest.mockRejectedValue(graphqlError);

      await expect(client.request('query { test }')).rejects.toThrow(GraphQLError);
    });

    it('should re-throw network errors', async () => {
      const networkError = new NetworkError('Connection failed');
      mockMakeGraphQLRequest.mockRejectedValue(networkError);

      await expect(client.request('query { test }')).rejects.toThrow(NetworkError);
    });
  });

  describe('query', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(baseConfig);
      mockAuthManager.isTokenValid.mockReturnValue(true);
      mockAuthManager.getAuthorizationHeader.mockReturnValue('Bearer test-token');
    });

    it('should make query request with variables', async () => {
      const mockResult = { data: { user: { name: 'John' } }, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      const query = 'query GetUser($id: ID!) { user(id: $id) { name } }';
      const variables = { id: '123' };

      const result = await client.query(query, variables);

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        expect.any(String),
        query,
        expect.objectContaining({ variables })
      );
      expect(result).toBe(mockResult);
    });

    it('should accept additional options', async () => {
      const mockResult = { data: {}, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      await client.query('query { test }', undefined, {
        headers: { 'x-custom': 'value' },
        timeout: 5000,
      });

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'x-custom': 'value' }),
          timeout: 5000,
        })
      );
    });
  });

  describe('mutate', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(baseConfig);
      mockAuthManager.isTokenValid.mockReturnValue(true);
      mockAuthManager.getAuthorizationHeader.mockReturnValue('Bearer test-token');
    });

    it('should make mutation request with variables', async () => {
      const mockResult = { data: { createUser: { id: '123' } }, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      const mutation =
        'mutation CreateUser($input: UserInput!) { createUser(input: $input) { id } }';
      const variables = { input: { name: 'John' } };

      const result = await client.mutate(mutation, variables);

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        expect.any(String),
        mutation,
        expect.objectContaining({ variables })
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('token management', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(baseConfig);
    });

    it('should set access token', () => {
      const token = 'new-access-token';
      const expiresAt = new Date();

      client.setAccessToken(token, expiresAt);

      expect(mockAuthManager.setToken).toHaveBeenCalledWith(token, expiresAt);
    });

    it('should clear access token', () => {
      client.clearAccessToken();

      expect(mockAuthManager.clearToken).toHaveBeenCalled();
    });

    it('should get access token', () => {
      const expectedToken = 'current-token';
      mockAuthManager.getToken.mockReturnValue(expectedToken);

      const token = client.getAccessToken();

      expect(token).toBe(expectedToken);
      expect(mockAuthManager.getToken).toHaveBeenCalled();
    });

    it('should check authentication status', () => {
      mockAuthManager.isTokenValid.mockReturnValue(true);

      const isAuthenticated = client.isAuthenticated();

      expect(isAuthenticated).toBe(true);
      expect(mockAuthManager.isTokenValid).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient(baseConfig);
    });

    it('should throw error indicating OAuth implementation needed', async () => {
      await expect(client.refreshToken()).rejects.toThrow(SdkError);
      await expect(client.refreshToken()).rejects.toThrow('Token refresh not yet implemented');
    });
  });

  describe('getConfig', () => {
    it('should return read-only configuration copy', () => {
      const client = new ApiClient({
        ...baseConfig,
        timeout: 5000,
        headers: { 'x-custom': 'value' },
      });

      const config = client.getConfig();

      expect(config.timeout).toBe(5000);
      expect(config.headers).toEqual({ 'x-custom': 'value' });

      // Should be a copy, not the original reference
      expect(() => {
        (config as any).timeout = 10000;
      }).not.toThrow();
      // Original config should be unchanged
      expect(client.getConfig().timeout).toBe(5000);
    });
  });

  describe('getAuthManager', () => {
    it('should return auth manager instance', () => {
      const client = new ApiClient(baseConfig);
      const authManager = client.getAuthManager();

      expect(authManager).toBe(mockAuthManager);
    });
  });

  describe('createClient', () => {
    it('should create new client instance', () => {
      const client = createClient(baseConfig);

      expect(client).toBeInstanceOf(ApiClient);
    });

    it('should pass configuration to constructor', () => {
      const config = {
        ...baseConfig,
        timeout: 5000,
      };

      const client = createClient(config);

      expect(client.getConfig().timeout).toBe(5000);
    });
  });

  describe('configuration with defaults', () => {
    it('should merge default headers with request headers', async () => {
      const clientWithDefaults = new ApiClient({
        ...baseConfig,
        headers: {
          'x-default': 'default-value',
          'x-api-version': 'v1',
        },
      });

      mockAuthManager.isTokenValid.mockReturnValue(true);
      mockAuthManager.getAuthorizationHeader.mockReturnValue('Bearer test-token');

      const mockResult = { data: {}, response: {} as any };
      mockMakeGraphQLRequest.mockResolvedValue(mockResult);

      await clientWithDefaults.request('query { test }', undefined, {
        headers: {
          'x-custom': 'custom-value',
          'x-api-version': 'v2', // Should override default
        },
      });

      expect(mockMakeGraphQLRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          headers: {
            authorization: 'Bearer test-token',
            'x-custom': 'custom-value',
            'x-default': 'default-value',
            'x-api-version': 'v2', // Custom header should override default
          },
        })
      );
    });
  });
});
