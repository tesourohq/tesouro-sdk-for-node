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
