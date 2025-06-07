import {
  SdkError,
  NetworkError,
  GraphQLError,
  ResponseError,
  ErrorUtils,
  type GraphQLErrorPath,
  type GraphQLErrorExtensions,
} from './errors';

describe('SdkError', () => {
  describe('constructor', () => {
    it('should create an error with the correct message', () => {
      const message = 'Test error message';
      const error = new SdkError(message);

      expect(error.message).toBe(message);
    });

    it('should set the correct name', () => {
      const error = new SdkError('test');
      expect(error.name).toBe('SdkError');
    });

    it('should set timestamp', () => {
      const beforeCreate = new Date();
      const error = new SdkError('test');
      const afterCreate = new Date();

      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should store cause when provided', () => {
      const cause = new Error('underlying error');
      const error = new SdkError('test', cause);

      expect((error as any).cause).toBe(cause);
    });

    it('should not have cause property when not provided', () => {
      const error = new SdkError('test');
      expect((error as any).cause).toBeUndefined();
    });
  });

  describe('instanceof checks', () => {
    it('should be instanceof SdkError', () => {
      const error = new SdkError('test');
      expect(error instanceof SdkError).toBe(true);
    });

    it('should be instanceof Error', () => {
      const error = new SdkError('test');
      expect(error instanceof Error).toBe(true);
    });

    it('should maintain proper prototype chain', () => {
      const error = new SdkError('test');
      expect(Object.getPrototypeOf(error)).toBe(SdkError.prototype);
    });
  });

  describe('stack trace', () => {
    it('should preserve stack trace', () => {
      const error = new SdkError('test');
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
      expect(error.stack).toContain('SdkError');
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON correctly', () => {
      const message = 'test message';
      const error = new SdkError(message);
      const json = error.toJSON();

      expect(json).toMatchObject({
        name: 'SdkError',
        message: message,
        timestamp: error.timestamp.toISOString(),
        stack: error.stack,
      });
    });

    it('should include cause in JSON when present', () => {
      const cause = { message: 'underlying error' };
      const error = new SdkError('test', cause);
      const json = error.toJSON();

      expect(json.cause).toBe(cause);
    });

    it('should not include cause in JSON when not present', () => {
      const error = new SdkError('test');
      const json = error.toJSON();

      expect(json).not.toHaveProperty('cause');
    });
  });

  describe('toString', () => {
    it('should return formatted string representation', () => {
      const message = 'test message';
      const error = new SdkError(message);
      const string = error.toString();

      expect(string).toBe(`SdkError: ${message} (${error.timestamp.toISOString()})`);
    });
  });

  describe('inheritance', () => {
    class CustomError extends SdkError {
      constructor(message: string) {
        super(message);
      }
    }

    it('should support inheritance with correct name', () => {
      const error = new CustomError('test');
      expect(error.name).toBe('CustomError');
      expect(error instanceof CustomError).toBe(true);
      expect(error instanceof SdkError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should serialize inherited errors correctly', () => {
      const error = new CustomError('test');
      const json = error.toJSON();

      expect(json.name).toBe('CustomError');
    });
  });
});

describe('NetworkError', () => {
  describe('constructor', () => {
    it('should create a network error with message only', () => {
      const message = 'Network connection failed';
      const error = new NetworkError(message);

      expect(error.message).toBe(message);
      expect(error.name).toBe('NetworkError');
      expect(error.statusCode).toBeUndefined();
      expect(error.requestId).toBeUndefined();
    });

    it('should create a network error with status code', () => {
      const message = 'Server error';
      const statusCode = 500;
      const error = new NetworkError(message, statusCode);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
    });

    it('should create a network error with request ID', () => {
      const message = 'Request failed';
      const statusCode = 404;
      const requestId = 'req-123';
      const error = new NetworkError(message, statusCode, requestId);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.requestId).toBe(requestId);
    });

    it('should create a network error with cause', () => {
      const message = 'Network error';
      const cause = new Error('underlying error');
      const error = new NetworkError(message, 500, 'req-123', cause);

      expect(error.cause).toBe(cause);
    });
  });

  describe('inheritance', () => {
    it('should be instanceof NetworkError', () => {
      const error = new NetworkError('test');
      expect(error instanceof NetworkError).toBe(true);
    });

    it('should be instanceof SdkError', () => {
      const error = new NetworkError('test');
      expect(error instanceof SdkError).toBe(true);
    });

    it('should be instanceof Error', () => {
      const error = new NetworkError('test');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('isRetryable', () => {
    it('should be retryable for errors without status code', () => {
      const error = new NetworkError('timeout');
      expect(error.isRetryable()).toBe(true);
    });

    it('should be retryable for 5xx status codes', () => {
      const error500 = new NetworkError('server error', 500);
      const error502 = new NetworkError('bad gateway', 502);
      const error503 = new NetworkError('service unavailable', 503);

      expect(error500.isRetryable()).toBe(true);
      expect(error502.isRetryable()).toBe(true);
      expect(error503.isRetryable()).toBe(true);
    });

    it('should be retryable for 408 (timeout)', () => {
      const error = new NetworkError('timeout', 408);
      expect(error.isRetryable()).toBe(true);
    });

    it('should be retryable for 429 (rate limit)', () => {
      const error = new NetworkError('rate limited', 429);
      expect(error.isRetryable()).toBe(true);
    });

    it('should not be retryable for 4xx client errors (except 408, 429)', () => {
      const error400 = new NetworkError('bad request', 400);
      const error401 = new NetworkError('unauthorized', 401);
      const error404 = new NetworkError('not found', 404);

      expect(error400.isRetryable()).toBe(false);
      expect(error401.isRetryable()).toBe(false);
      expect(error404.isRetryable()).toBe(false);
    });
  });

  describe('serialization', () => {
    it('should serialize with all properties', () => {
      const error = new NetworkError('test', 500, 'req-123');
      const json = error.toJSON();

      expect(json).toMatchObject({
        name: 'NetworkError',
        message: 'test',
        statusCode: 500,
        requestId: 'req-123',
        retryable: true,
      });
    });

    it('should exclude undefined properties', () => {
      const error = new NetworkError('test');
      const json = error.toJSON();

      expect(json).not.toHaveProperty('statusCode');
      expect(json).not.toHaveProperty('requestId');
      expect(json.retryable).toBe(true);
    });
  });
});

describe('GraphQLError', () => {
  describe('constructor', () => {
    it('should create a GraphQL error with message only', () => {
      const message = 'GraphQL validation error';
      const error = new GraphQLError(message);

      expect(error.message).toBe(message);
      expect(error.name).toBe('GraphQLError');
      expect(error.code).toBeUndefined();
      expect(error.path).toBeUndefined();
      expect(error.extensions).toBeUndefined();
    });

    it('should create a GraphQL error with path', () => {
      const message = 'Field error';
      const path: GraphQLErrorPath = ['user', 'profile', 'email'];
      const error = new GraphQLError(message, path);

      expect(error.message).toBe(message);
      expect(error.path).toEqual(path);
    });

    it('should create a GraphQL error with extensions', () => {
      const message = 'Validation failed';
      const extensions: GraphQLErrorExtensions = {
        code: 'VALIDATION_ERROR',
        field: 'email',
        constraint: 'required',
      };
      const error = new GraphQLError(message, undefined, extensions);

      expect(error.message).toBe(message);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.extensions).toEqual(extensions);
    });

    it('should create a GraphQL error with all parameters', () => {
      const message = 'Access denied';
      const path: GraphQLErrorPath = ['user', 0, 'email'];
      const extensions: GraphQLErrorExtensions = {
        code: 'AUTHORIZATION_ERROR',
        permission: 'READ_USER',
      };
      const cause = new Error('underlying auth error');
      const error = new GraphQLError(message, path, extensions, cause);

      expect(error.message).toBe(message);
      expect(error.path).toEqual(path);
      expect(error.code).toBe('AUTHORIZATION_ERROR');
      expect(error.extensions).toEqual(extensions);
      expect(error.cause).toBe(cause);
    });
  });

  describe('inheritance', () => {
    it('should be instanceof GraphQLError', () => {
      const error = new GraphQLError('test');
      expect(error instanceof GraphQLError).toBe(true);
    });

    it('should be instanceof SdkError', () => {
      const error = new GraphQLError('test');
      expect(error instanceof SdkError).toBe(true);
    });

    it('should be instanceof Error', () => {
      const error = new GraphQLError('test');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('serialization', () => {
    it('should serialize with all properties', () => {
      const path: GraphQLErrorPath = ['user', 'profile'];
      const extensions: GraphQLErrorExtensions = {
        code: 'VALIDATION_ERROR',
        field: 'email',
      };
      const error = new GraphQLError('test', path, extensions);
      const json = error.toJSON();

      expect(json).toMatchObject({
        name: 'GraphQLError',
        message: 'test',
        code: 'VALIDATION_ERROR',
        path: path,
        extensions: extensions,
      });
    });

    it('should exclude undefined properties', () => {
      const error = new GraphQLError('test');
      const json = error.toJSON();

      expect(json).not.toHaveProperty('code');
      expect(json).not.toHaveProperty('path');
      expect(json).not.toHaveProperty('extensions');
    });
  });

  describe('toString', () => {
    it('should format error with path and code', () => {
      const path: GraphQLErrorPath = ['user', 'email'];
      const extensions: GraphQLErrorExtensions = { code: 'VALIDATION_ERROR' };
      const error = new GraphQLError('Invalid email', path, extensions);
      const string = error.toString();

      expect(string).toContain('GraphQLError: Invalid email');
      expect(string).toContain('at path: user.email');
      expect(string).toContain('(code: VALIDATION_ERROR)');
    });

    it('should format error without path or code', () => {
      const error = new GraphQLError('Generic error');
      const string = error.toString();

      expect(string).toContain('GraphQLError: Generic error');
      expect(string).not.toContain('at path:');
      expect(string).not.toContain('(code:');
    });

    it('should handle numeric path elements', () => {
      const path: GraphQLErrorPath = ['users', 0, 'email'];
      const error = new GraphQLError('Invalid email', path);
      const string = error.toString();

      expect(string).toContain('at path: users.0.email');
    });
  });
});

describe('ResponseError', () => {
  describe('constructor', () => {
    it('should create a response error with status code', () => {
      const message = 'Invalid JSON response';
      const statusCode = 200;
      const error = new ResponseError(message, statusCode);

      expect(error.message).toBe(message);
      expect(error.name).toBe('ResponseError');
      expect(error.statusCode).toBe(statusCode);
      expect(error.contentType).toBeUndefined();
      expect(error.requestId).toBeUndefined();
    });

    it('should create a response error with all parameters', () => {
      const message = 'Failed to parse response';
      const statusCode = 200;
      const contentType = 'application/json; charset=utf-8';
      const requestId = 'req-789';
      const cause = new Error('JSON syntax error');

      const error = new ResponseError(message, statusCode, contentType, requestId, cause);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.contentType).toBe(contentType);
      expect(error.requestId).toBe(requestId);
      expect(error.cause).toBe(cause);
    });
  });

  describe('inheritance', () => {
    it('should be instanceof ResponseError', () => {
      const error = new ResponseError('test', 200);
      expect(error instanceof ResponseError).toBe(true);
    });

    it('should be instanceof SdkError', () => {
      const error = new ResponseError('test', 200);
      expect(error instanceof SdkError).toBe(true);
    });

    it('should be instanceof Error', () => {
      const error = new ResponseError('test', 200);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('serialization', () => {
    it('should serialize with all properties', () => {
      const error = new ResponseError('Parse error', 200, 'application/json', 'req-123');
      const json = error.toJSON();

      expect(json).toMatchObject({
        name: 'ResponseError',
        message: 'Parse error',
        statusCode: 200,
        contentType: 'application/json',
        requestId: 'req-123',
      });
    });

    it('should exclude undefined properties', () => {
      const error = new ResponseError('Parse error', 500);
      const json = error.toJSON();

      expect(json.statusCode).toBe(500);
      expect(json).not.toHaveProperty('contentType');
      expect(json).not.toHaveProperty('requestId');
    });
  });
});

describe('ErrorUtils', () => {
  describe('sanitizeVariables', () => {
    it('should redact sensitive fields', () => {
      const variables = {
        email: 'test@example.com',
        password: 'secret123',
        apiKey: 'key-456',
        name: 'John Doe',
      };

      const sanitized = ErrorUtils.sanitizeVariables(variables);

      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.apiKey).toBe('[REDACTED]');
      expect(sanitized.name).toBe('John Doe');
    });

    it('should handle invalid inputs', () => {
      expect(ErrorUtils.sanitizeVariables(undefined)).toEqual({});
      expect(ErrorUtils.sanitizeVariables(null as any)).toEqual({});
      expect(ErrorUtils.sanitizeVariables('not an object' as any)).toEqual({});
    });
  });

  describe('generateRequestId', () => {
    it('should generate unique request IDs', () => {
      const id1 = ErrorUtils.generateRequestId();
      const id2 = ErrorUtils.generateRequestId();

      expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });
});
