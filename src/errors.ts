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
   * Creates a new SdkError instance
   * @param message - The error message
   * @param cause - Optional underlying cause of the error
   */
  constructor(message: string, cause?: unknown) {
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
   */
  constructor(message: string, statusCode?: number, requestId?: string, cause?: unknown) {
    super(message, cause);

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
   * Determines if the error might be retryable based on status code
   * @returns true if the error might be retryable
   */
  isRetryable(): boolean {
    if (!this.statusCode) {
      // Network errors without status codes (timeouts, connection failures) might be retryable
      return true;
    }

    // Retry on server errors (5xx) and some client errors
    return (
      this.statusCode >= 500 ||
      this.statusCode === 408 || // Request Timeout
      this.statusCode === 429
    ); // Too Many Requests
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
   */
  constructor(
    message: string,
    path?: GraphQLErrorPath,
    extensions?: GraphQLErrorExtensions,
    cause?: unknown
  ) {
    super(message, cause);

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
   */
  constructor(
    message: string,
    statusCode: number,
    contentType?: string,
    requestId?: string,
    cause?: unknown
  ) {
    super(message, cause);

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
  requestId?: string;
  operationName?: string;
  variables?: Record<string, any>;
  timestamp: Date;
  endpoint?: string;
}

/**
 * Utility functions for error detection and transformation
 */
export class ErrorUtils {
  /**
   * Filters sensitive data from variables for error context
   */
  static sanitizeVariables(variables?: Record<string, any>): Record<string, any> {
    if (!variables || typeof variables !== 'object') {
      return {};
    }

    const sensitiveFields = /password|secret|token|key|credential|auth/i;
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(variables)) {
      if (sensitiveFields.test(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (value && typeof value === 'object') {
        sanitized[key] = this.sanitizeVariables(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Generates a unique request ID for tracking
   */
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
