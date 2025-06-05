import {
  makeGraphQLRequest,
  formatGraphQLQuery,
  isValidGraphQLQuery,
  safeStringifyVariables,
  type GraphQLResponse,
} from './graphql';
import { GraphQLError, NetworkError, ResponseError } from './errors';
import { makeRequest } from './request';

// Mock the request module
jest.mock('./request');
const mockMakeRequest = makeRequest as jest.MockedFunction<typeof makeRequest>;

describe('GraphQL Request Builder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('makeGraphQLRequest', () => {
    const testQuery = 'query GetUser($id: ID!) { user(id: $id) { name email } }';
    const testVariables = { id: '123' };

    it('should make successful GraphQL request', async () => {
      const mockResponseData = {
        data: { user: { name: 'John Doe', email: 'john@example.com' } },
      };

      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'x-request-id': 'req-123' }),
        data: mockResponseData,
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      const result = await makeGraphQLRequest('https://api.example.com/graphql', testQuery, {
        variables: testVariables,
        operationName: 'GetUser',
      });

      expect(mockMakeRequest).toHaveBeenCalledWith('https://api.example.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: testQuery,
          variables: testVariables,
          operationName: 'GetUser',
        }),
      });

      expect(result.data).toEqual({ user: { name: 'John Doe', email: 'john@example.com' } });
      expect(result.requestId).toBe('req-123');
    });

    it('should handle request without variables', async () => {
      const mockResponseData = {
        data: { users: [] },
      };

      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        data: mockResponseData,
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      await makeGraphQLRequest('https://api.example.com/graphql', 'query { users { name } }');

      expect(mockMakeRequest).toHaveBeenCalledWith('https://api.example.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: 'query { users { name } }',
        }),
      });
    });

    it('should merge custom headers', async () => {
      const mockResponseData = { data: { test: true } };
      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        data: mockResponseData,
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      await makeGraphQLRequest('https://api.example.com/graphql', testQuery, {
        headers: {
          Authorization: 'Bearer token',
          'Custom-Header': 'value',
        },
      });

      expect(mockMakeRequest).toHaveBeenCalledWith('https://api.example.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer token',
          'Custom-Header': 'value',
        },
        body: expect.any(String),
      });
    });

    it('should throw GraphQLError for GraphQL errors', async () => {
      const mockResponseData: GraphQLResponse = {
        errors: [
          {
            message: 'User not found',
            path: ['user'],
            extensions: { code: 'NOT_FOUND' },
          },
        ],
      };

      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'x-trace-id': 'trace-456' }),
        data: mockResponseData,
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery, {
          operationName: 'GetUser',
        })
      ).rejects.toThrow(GraphQLError);

      try {
        await makeGraphQLRequest('https://api.example.com/graphql', testQuery, {
          operationName: 'GetUser',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        const graphqlError = error as GraphQLError;
        expect(graphqlError.message).toBe('User not found');
        expect(graphqlError.path).toEqual(['user']);
        expect(graphqlError.extensions).toMatchObject({
          code: 'NOT_FOUND',
          requestId: 'trace-456',
          operationName: 'GetUser',
        });
      }
    });

    it('should throw GraphQLError for missing data field', async () => {
      const mockResponseData: GraphQLResponse = {
        // Missing data field
      };

      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        data: mockResponseData,
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow(GraphQLError);
      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow('GraphQL response missing data field');
    });

    it('should throw GraphQLError for invalid response structure', async () => {
      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        data: 'invalid response',
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow(GraphQLError);
      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow('Invalid GraphQL response: must be an object');
    });

    it('should throw GraphQLError for invalid errors format', async () => {
      const mockResponseData = {
        errors: 'not an array',
      };

      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        data: mockResponseData,
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow('Invalid GraphQL response: errors must be an array');
    });

    it('should re-throw network errors', async () => {
      const networkError = new NetworkError('Connection failed', 500);
      mockMakeRequest.mockRejectedValue(networkError);

      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow(NetworkError);
      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow('Connection failed');
    });

    it('should re-throw response errors', async () => {
      const responseError = new ResponseError('Invalid JSON', 200);
      mockMakeRequest.mockRejectedValue(responseError);

      await expect(
        makeGraphQLRequest('https://api.example.com/graphql', testQuery)
      ).rejects.toThrow(ResponseError);
    });

    it('should pass through request options', async () => {
      const mockResponseData = { data: { test: true } };
      const mockHttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        data: mockResponseData,
        response: new Response(),
      };

      mockMakeRequest.mockResolvedValue(mockHttpResponse);

      await makeGraphQLRequest('https://api.example.com/graphql', testQuery, {
        timeout: 5000,
        signal: new AbortController().signal,
      });

      expect(mockMakeRequest).toHaveBeenCalledWith('https://api.example.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: expect.any(String),
        timeout: 5000,
        signal: expect.any(AbortSignal),
      });
    });
  });

  describe('formatGraphQLQuery', () => {
    it('should format GraphQL query with proper spacing', () => {
      const input = `
        query GetUser($id: ID!) {
          user(id: $id) {
            name
            email
          }
        }
      `;

      const result = formatGraphQLQuery(input);
      expect(result).toBe('query GetUser($id: ID!) { user(id: $id) { name email } }');
    });

    it('should handle queries with no extra whitespace', () => {
      const input = 'query{user{name}}';
      const result = formatGraphQLQuery(input);
      expect(result).toBe('query { user { name } }');
    });

    it('should handle empty strings', () => {
      expect(formatGraphQLQuery('')).toBe('');
      expect(formatGraphQLQuery('   ')).toBe('');
    });

    it('should format mutations', () => {
      const input = `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id,
            name
          }
        }
      `;

      const result = formatGraphQLQuery(input);
      expect(result).toBe(
        'mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id, name } }'
      );
    });
  });

  describe('isValidGraphQLQuery', () => {
    it('should return true for valid query operations', () => {
      expect(isValidGraphQLQuery('query { user { name } }')).toBe(true);
      expect(isValidGraphQLQuery('query GetUser { user { name } }')).toBe(true);
      expect(isValidGraphQLQuery('{ user { name } }')).toBe(true); // Shorthand query
    });

    it('should return true for valid mutation operations', () => {
      expect(isValidGraphQLQuery('mutation { createUser { id } }')).toBe(true);
      expect(isValidGraphQLQuery('mutation CreateUser { createUser { id } }')).toBe(true);
    });

    it('should return true for valid subscription operations', () => {
      expect(isValidGraphQLQuery('subscription { userUpdated { id } }')).toBe(true);
    });

    it('should return true for fragment definitions', () => {
      expect(isValidGraphQLQuery('fragment UserInfo on User { name email }')).toBe(true);
    });

    it('should return false for invalid queries', () => {
      expect(isValidGraphQLQuery('')).toBe(false);
      expect(isValidGraphQLQuery('   ')).toBe(false);
      expect(isValidGraphQLQuery('not a graphql query')).toBe(false);
      expect(isValidGraphQLQuery('{ user { name }')).toBe(false); // Missing closing brace
      expect(isValidGraphQLQuery('user { name } }')).toBe(false); // Missing opening brace
      expect(isValidGraphQLQuery('{{ user { name } }}')).toBe(false); // Extra braces
    });

    it('should return false for non-string inputs', () => {
      expect(isValidGraphQLQuery(null as any)).toBe(false);
      expect(isValidGraphQLQuery(undefined as any)).toBe(false);
      expect(isValidGraphQLQuery(123 as any)).toBe(false);
      expect(isValidGraphQLQuery({} as any)).toBe(false);
    });
  });

  describe('safeStringifyVariables', () => {
    it('should stringify simple variables', () => {
      const variables = { id: '123', name: 'John' };
      const result = safeStringifyVariables(variables);
      expect(result).toContain('"id": "123"');
      expect(result).toContain('"name": "John"');
    });

    it('should redact sensitive fields', () => {
      const variables = {
        id: '123',
        password: 'secret123',
        apiKey: 'key123',
        accessToken: 'token123',
        name: 'John',
      };

      const result = safeStringifyVariables(variables);
      expect(result).toContain('"id": "123"');
      expect(result).toContain('"name": "John"');
      expect(result).toContain('"password": "[REDACTED]"');
      expect(result).toContain('"apiKey": "[REDACTED]"');
      expect(result).toContain('"accessToken": "[REDACTED]"');
    });

    it('should handle nested objects', () => {
      const variables = {
        user: {
          id: '123',
          credentials: {
            password: 'secret',
            apiKey: 'key123',
          },
          profile: {
            name: 'John',
            email: 'john@example.com',
          },
        },
      };

      const result = safeStringifyVariables(variables);
      expect(result).toContain('"name": "John"');
      expect(result).toContain('"email": "john@example.com"');
      expect(result).toContain('"password": "[REDACTED]"');
      expect(result).toContain('"apiKey": "[REDACTED]"');
    });

    it('should handle undefined variables', () => {
      expect(safeStringifyVariables(undefined)).toBe('{}');
    });

    it('should handle variables that cannot be stringified', () => {
      const variables: any = {};
      variables.circular = variables; // Create circular reference

      const result = safeStringifyVariables(variables);
      expect(result).toBe('[Unable to stringify variables]');
    });

    it('should detect various sensitive field patterns', () => {
      const variables = {
        userPassword: 'secret',
        authToken: 'token',
        secretKey: 'key',
        authorization: 'auth',
        credential: 'cred',
        refreshToken: 'refresh',
        normalField: 'safe',
      };

      const result = safeStringifyVariables(variables);
      expect(result).toContain('"normalField": "safe"');
      expect(result).toContain('"userPassword": "[REDACTED]"');
      expect(result).toContain('"authToken": "[REDACTED]"');
      expect(result).toContain('"secretKey": "[REDACTED]"');
      expect(result).toContain('"authorization": "[REDACTED]"');
      expect(result).toContain('"credential": "[REDACTED]"');
      expect(result).toContain('"refreshToken": "[REDACTED]"');
    });

    it('should preserve arrays and primitive values', () => {
      const variables = {
        ids: ['1', '2', '3'],
        count: 42,
        active: true,
        metadata: null,
      };

      const result = safeStringifyVariables(variables);
      expect(result).toContain('"ids": [\n    "1",\n    "2",\n    "3"\n  ]');
      expect(result).toContain('"count": 42');
      expect(result).toContain('"active": true');
      expect(result).toContain('"metadata": null');
    });
  });
});
