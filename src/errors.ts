/**
 * Base error class for the Tesouro SDK
 *
 * Provides a foundation for all SDK errors with consistent structure,
 * proper prototype chain handling, and serialization support.
 */
export class SdkError extends Error {
  /**
   * Timestamp when the error was created
   */
  public readonly timestamp: Date;

  /**
   * Optional underlying cause of the error
   */
  public readonly cause?: unknown;

  /**
   * Request context for debugging
   */
  public readonly context?: ErrorContext;

  /**
   * Creates a new SdkError instance
   * @param message - The error message
   * @param cause - Optional underlying cause of the error
   * @param context - Optional request context for debugging
   */
  constructor(message: string, cause?: unknown, context?: ErrorContext) {
    super(message);

    // Set the error name to the class name
    this.name = this.constructor.name;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture timestamp
    this.timestamp = new Date();

    // Preserve stack trace (V8 specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Store the cause if provided
    if (cause !== undefined) {
      Object.defineProperty(this, 'cause', {
        value: cause,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }

    // Store the context if provided
    if (context !== undefined) {
      Object.defineProperty(this, 'context', {
        value: context,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }
  }

  /**
   * Converts the error to a JSON-serializable object
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    const result: Record<string, any> = {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };

    if (this.cause !== undefined) {
      result.cause = this.cause;
    }

    if (this.context !== undefined) {
      result.context = {
        ...this.context,
        timestamp: this.context.timestamp.toISOString(),
      };
    }

    return result;
  }

  /**
   * Determines if the error might be retryable
   * @returns true if the error might be retryable
   */
  isRetryable(): boolean {
    // Configuration errors are not retryable
    if (
      this.message.includes('not configured') ||
      this.message.includes('configuration') ||
      this.message.includes('invalid configuration')
    ) {
      return false;
    }

    // Token response validation errors might be transient, so they're retryable
    if (
      this.message.includes('Invalid token response') ||
      this.message.includes('Failed to refresh access token') ||
      this.message.includes('Unexpected error during token refresh')
    ) {
      return true;
    }

    // Most other SdkErrors are not retryable by default
    return false;
  }

  /**
   * Returns a string representation of the error
   * @returns Formatted error string
   */
  toString(): string {
    return `${this.name}: ${this.message} (${this.timestamp.toISOString()})`;
  }
}

/**
 * Error class for network-related issues
 *
 * Represents errors that occur during HTTP requests, including
 * timeouts, connection failures, and HTTP status errors.
 */
export class NetworkError extends SdkError {
  /**
   * HTTP status code (if available)
   */
  public readonly statusCode?: number;

  /**
   * Request ID for tracing (if available)
   */
  public readonly requestId?: string;

  /**
   * Creates a new NetworkError instance
   * @param message - The error message
   * @param statusCode - Optional HTTP status code
   * @param requestId - Optional request ID for tracing
   * @param cause - Optional underlying cause of the error
   * @param context - Optional request context for debugging
   */
  constructor(
    message: string,
    statusCode?: number,
    requestId?: string,
    cause?: unknown,
    context?: ErrorContext
  ) {
    super(message, cause, context);

    Object.defineProperty(this, 'statusCode', {
      value: statusCode,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(this, 'requestId', {
      value: requestId,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  /**
   * Determines if the error might be retryable based on status code and operation type
   * @returns true if the error might be retryable
   */
  isRetryable(): boolean {
    // For mutations, only authentication errors (401) are safe to retry
    // because they guarantee the operation was rejected before processing
    if (this.context?.operationType === 'mutation') {
      return this.statusCode === 401;
    }

    // For queries and other operations, use standard retry logic
    if (!this.statusCode) {
      // Network errors without status codes (timeouts, connection failures) might be retryable
      return true;
    }

    // Retry on server errors (5xx) and some client errors
    return (
      this.statusCode >= 500 ||
      this.statusCode === 408 || // Request Timeout
      this.statusCode === 429 || // Too Many Requests
      this.statusCode === 401 // Unauthorized (safe for all operations)
    );
  }

  /**
   * Converts the error to a JSON-serializable object
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    const result = super.toJSON();

    if (this.statusCode !== undefined) {
      result.statusCode = this.statusCode;
    }

    if (this.requestId !== undefined) {
      result.requestId = this.requestId;
    }

    result.retryable = this.isRetryable();

    return result;
  }
}

/**
 * GraphQL error path type
 */
export type GraphQLErrorPath = (string | number)[];

/**
 * GraphQL error extensions
 */
export interface GraphQLErrorExtensions {
  code?: string;
  [key: string]: any;
}

/**
 * Error class for GraphQL-specific issues
 *
 * Represents errors returned by the GraphQL server, including
 * validation errors, execution errors, and custom business logic errors.
 */
export class GraphQLError extends SdkError {
  /**
   * Error code from GraphQL extensions
   */
  public readonly code?: string;

  /**
   * Path array showing where in the query the error occurred
   */
  public readonly path?: GraphQLErrorPath;

  /**
   * Extensions object for additional error metadata
   */
  public readonly extensions?: GraphQLErrorExtensions;

  /**
   * Creates a new GraphQLError instance
   * @param message - The error message
   * @param path - Path array showing where the error occurred
   * @param extensions - Extensions object with additional metadata
   * @param cause - Optional underlying cause of the error
   * @param context - Optional request context for debugging
   */
  constructor(
    message: string,
    path?: GraphQLErrorPath,
    extensions?: GraphQLErrorExtensions,
    cause?: unknown,
    context?: ErrorContext
  ) {
    super(message, cause, context);

    Object.defineProperty(this, 'code', {
      value: extensions?.code,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(this, 'path', {
      value: path,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(this, 'extensions', {
      value: extensions,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  /**
   * Converts the error to a JSON-serializable object
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    const result = super.toJSON();

    if (this.code !== undefined) {
      result.code = this.code;
    }

    if (this.path !== undefined) {
      result.path = this.path;
    }

    if (this.extensions !== undefined) {
      result.extensions = this.extensions;
    }

    return result;
  }

  /**
   * Returns a string representation of the error with path information
   * @returns Formatted error string
   */
  toString(): string {
    const base = super.toString();
    const pathStr = this.path ? ` at path: ${this.path.join('.')}` : '';
    const codeStr = this.code ? ` (code: ${this.code})` : '';
    return `${base}${pathStr}${codeStr}`;
  }
}

/**
 * Error class for response parsing issues
 *
 * Represents errors that occur when parsing response data,
 * such as invalid JSON or unexpected response formats.
 */
export class ResponseError extends SdkError {
  /**
   * HTTP status code of the response
   */
  public readonly statusCode!: number;

  /**
   * Content type of the response
   */
  public readonly contentType?: string;

  /**
   * Request ID for tracing (if available)
   */
  public readonly requestId?: string;

  /**
   * Creates a new ResponseError instance
   * @param message - The error message
   * @param statusCode - HTTP status code of the response
   * @param contentType - Content type of the response
   * @param requestId - Optional request ID for tracing
   * @param cause - Optional underlying cause of the error
   * @param context - Optional request context for debugging
   */
  constructor(
    message: string,
    statusCode: number,
    contentType?: string,
    requestId?: string,
    cause?: unknown,
    context?: ErrorContext
  ) {
    super(message, cause, context);

    Object.defineProperty(this, 'statusCode', {
      value: statusCode,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(this, 'contentType', {
      value: contentType,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(this, 'requestId', {
      value: requestId,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  /**
   * Converts the error to a JSON-serializable object
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    const result = super.toJSON();

    result.statusCode = this.statusCode;

    if (this.contentType !== undefined) {
      result.contentType = this.contentType;
    }

    if (this.requestId !== undefined) {
      result.requestId = this.requestId;
    }

    return result;
  }
}

/**
 * Request context for error debugging
 */
export interface ErrorContext {
  /** Unique identifier for the request */
  requestId?: string;
  /** GraphQL operation name */
  operationName?: string;
  /** GraphQL operation type (query, mutation, subscription) */
  operationType?: 'query' | 'mutation' | 'subscription';
  /** Request variables (sanitized) */
  variables?: Record<string, any>;
  /** Timestamp when the error occurred */
  timestamp: Date;
  /** API endpoint URL */
  endpoint?: string;
  /** HTTP method used */
  method?: string;
  /** Response status code if available */
  statusCode?: number;
  /** Duration of the request in milliseconds */
  duration?: number;
  /** User agent string */
  userAgent?: string;
}

/**
 * Utility functions for error detection and transformation
 */
export class ErrorUtils {
  /**
   * Creates error context from request information
   */
  static createErrorContext(options: {
    requestId?: string;
    operationName?: string;
    operationType?: 'query' | 'mutation' | 'subscription';
    variables?: Record<string, any>;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    duration?: number;
    userAgent?: string;
  }): ErrorContext {
    return {
      requestId: options.requestId || this.generateRequestId(),
      operationName: options.operationName,
      operationType: options.operationType,
      variables: options.variables ? this.sanitizeVariables(options.variables) : undefined,
      timestamp: new Date(),
      endpoint: options.endpoint,
      method: options.method || 'POST',
      statusCode: options.statusCode,
      duration: options.duration,
      userAgent: options.userAgent,
    };
  }

  /**
   * Filters sensitive data from variables for error context
   */
  static sanitizeVariables(variables?: Record<string, any>): Record<string, any> {
    if (!variables || typeof variables !== 'object') {
      return {};
    }

    return this.sanitizeObject(variables);
  }

  /**
   * Recursively sanitizes an object, removing sensitive data
   */
  private static sanitizeObject(obj: Record<string, any>, depth = 0): Record<string, any> {
    // Prevent infinite recursion
    if (depth > 10) {
      return { '[MAX_DEPTH_REACHED]': true };
    }

    const sensitiveFields =
      /password|secret|token|key|credential|auth|apikey|api_key|access_token|refresh_token|bearer|authorization|cvv|cvc|ssn|social|pin/i;
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      try {
        if (sensitiveFields.test(key)) {
          sanitized[key] = '[REDACTED]';
        } else if (value === null || value === undefined) {
          sanitized[key] = value;
        } else if (Array.isArray(value)) {
          // Sanitize arrays
          sanitized[key] = value.map((item) => {
            if (typeof item === 'object' && item !== null) {
              return this.sanitizeObject(item, depth + 1);
            }
            return item;
          });
        } else if (typeof value === 'object') {
          sanitized[key] = this.sanitizeObject(value, depth + 1);
        } else if (typeof value === 'string' && value.length > 1000) {
          // Truncate very long strings
          sanitized[key] = `${value.substring(0, 1000)}... [TRUNCATED]`;
        } else {
          sanitized[key] = value;
        }
      } catch {
        // If we can't sanitize a value, mark it as unsanitizable
        sanitized[key] = '[UNSANITIZABLE]';
      }
    }

    return sanitized;
  }

  /**
   * Safely stringifies a value for logging
   */
  static safeStringify(value: any, maxLength = 5000): string {
    try {
      const stringified = JSON.stringify(value, null, 2);
      if (stringified.length > maxLength) {
        return `${stringified.substring(0, maxLength)}... [TRUNCATED]`;
      }
      return stringified;
    } catch {
      return '[UNSTRINGIFIABLE]';
    }
  }

  /**
   * Generates a unique request ID for tracking
   */
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extracts operation name from GraphQL query
   */
  static extractOperationName(query: string): string | undefined {
    try {
      // Simple regex to extract operation name
      const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/i);
      return match ? match[1] : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Measures execution duration for request context
   */
  static measureDuration(startTime: number): number {
    return Date.now() - startTime;
  }

  /**
   * Detects GraphQL operation type from query string
   */
  static detectOperationType(query: string): 'query' | 'mutation' | 'subscription' | undefined {
    if (typeof query !== 'string' || !query.trim()) {
      return undefined;
    }

    const trimmedQuery = query.trim();

    if (/^\s*mutation\b/i.test(trimmedQuery)) {
      return 'mutation';
    } else if (/^\s*subscription\b/i.test(trimmedQuery)) {
      return 'subscription';
    } else if (/^\s*query\b/i.test(trimmedQuery) || /^\s*{/.test(trimmedQuery)) {
      return 'query';
    }

    return undefined;
  }

  /**
   * Extracts request ID from HTTP response headers for tracing
   *
   * @param response - HTTP response object or Headers object
   * @returns Request ID if found, undefined otherwise
   */
  static extractRequestId(
    response: Response | Headers | { headers?: Headers }
  ): string | undefined {
    let headers: Headers | undefined;

    if (response instanceof Response) {
      headers = response.headers;
    } else if (response instanceof Headers) {
      headers = response;
    } else if (response && typeof response === 'object' && 'headers' in response) {
      // Handle mock objects that have a headers property
      headers = (response as any).headers;
    }

    if (!headers || typeof headers.get !== 'function') {
      return undefined;
    }

    // Check for request ID headers in order of preference
    // Following common standards for request tracing
    const requestIdHeaders = [
      'x-request-id',
      'x-trace-id',
      'x-correlation-id',
      'request-id',
      'trace-id',
    ];

    for (const header of requestIdHeaders) {
      const value = headers.get(header);
      if (value) {
        return value;
      }
    }

    return undefined;
  }
}
