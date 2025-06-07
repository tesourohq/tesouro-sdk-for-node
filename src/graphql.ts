/**
 * GraphQL request handling for the Tesouro SDK
 *
 * Provides GraphQL-specific request building, error detection,
 * and response handling on top of the HTTP request wrapper.
 */

import { makeRequest, type RequestOptions, type HttpResponse } from './request';
import { GraphQLError, ErrorUtils, type ErrorContext } from './errors';

/**
 * GraphQL request variables type
 */
export type GraphQLVariables = Record<string, unknown> | undefined;

/**
 * Raw GraphQL error from server response
 */
export interface RawGraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

/**
 * GraphQL response structure
 */
export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: RawGraphQLError[];
  extensions?: Record<string, unknown>;
}

/**
 * GraphQL request body structure
 */
export interface GraphQLRequestBody {
  query: string;
  variables?: GraphQLVariables;
  operationName?: string;
}

/**
 * GraphQL-specific request options
 */
export interface GraphQLRequestOptions extends Omit<RequestOptions, 'method' | 'body'> {
  /** Operation name for debugging and logging */
  operationName?: string;
  /** Custom variables for the GraphQL query */
  variables?: GraphQLVariables;
}

/**
 * GraphQL request result
 */
export interface GraphQLResult<T = unknown> {
  /** Response data if successful */
  data: T;
  /** HTTP response information */
  response: HttpResponse<GraphQLResponse<T>>;
  /** Request ID for tracing */
  requestId?: string;
}

/**
 * Makes a GraphQL request to the specified endpoint
 *
 * @param url - GraphQL endpoint URL
 * @param query - GraphQL query string
 * @param options - Request options including variables
 * @returns Promise resolving to GraphQL result
 * @throws GraphQLError for GraphQL-specific errors
 * @throws NetworkError for network-related issues
 */
export async function makeGraphQLRequest<T = unknown>(
  url: string,
  query: string,
  options: GraphQLRequestOptions = {}
): Promise<GraphQLResult<T>> {
  const { variables, operationName, ...requestOptions } = options;
  const startTime = Date.now();

  // Extract operation name from query if not provided
  const finalOperationName = operationName || ErrorUtils.extractOperationName(query);

  // Prepare GraphQL request body
  const requestBody: GraphQLRequestBody = {
    query: query.trim(),
    ...(variables && { variables }),
    ...(finalOperationName && { operationName: finalOperationName }),
  };

  // Set up headers for GraphQL request
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...requestOptions.headers,
  };

  // Generate request ID for tracking
  const requestId = ErrorUtils.generateRequestId();

  try {
    // Make HTTP request
    const httpResponse = await makeRequest<GraphQLResponse<T>>(url, {
      ...requestOptions,
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const duration = ErrorUtils.measureDuration(startTime);

    // Extract request ID from response (prefer server-provided ID)
    const serverRequestId =
      extractRequestId(httpResponse.response) || extractRequestIdFromHeaders(httpResponse.headers);
    const finalRequestId = serverRequestId || requestId;

    // Create error context for potential errors
    const errorContext = ErrorUtils.createErrorContext({
      requestId: finalRequestId,
      operationName: finalOperationName,
      variables,
      endpoint: url,
      method: 'POST',
      statusCode: httpResponse.response.status,
      duration,
      userAgent: (headers as any)['User-Agent'],
    });

    // Validate GraphQL response structure
    validateGraphQLResponse(httpResponse.data);

    // Check for GraphQL errors
    if (httpResponse.data.errors && httpResponse.data.errors.length > 0) {
      throw createGraphQLError(httpResponse.data.errors[0], errorContext);
    }

    // Ensure we have data
    if (httpResponse.data.data === undefined) {
      throw new GraphQLError(
        'GraphQL response missing data field',
        undefined,
        { code: 'MISSING_DATA' },
        undefined,
        errorContext
      );
    }

    return {
      data: httpResponse.data.data,
      response: httpResponse,
      requestId: finalRequestId,
    };
  } catch (error) {
    // If it's already one of our errors, re-throw as-is
    if (error instanceof GraphQLError) {
      throw error;
    }

    // For other errors, just re-throw as-is
    // NetworkError and other errors already have their own context handling
    throw error;
  }
}

/**
 * Extracts request ID from HTTP response for tracing
 *
 * @param response - HTTP response object
 * @returns Request ID if found
 */
function extractRequestId(response: Response): string | undefined {
  const requestIdHeaders = [
    'x-request-id',
    'x-trace-id',
    'x-correlation-id',
    'request-id',
    'trace-id',
  ];

  for (const header of requestIdHeaders) {
    const value = response.headers.get(header);
    if (value) {
      return value;
    }
  }

  return undefined;
}

/**
 * Extracts request ID from Headers object for tracing
 *
 * @param headers - Headers object
 * @returns Request ID if found
 */
function extractRequestIdFromHeaders(headers: Headers): string | undefined {
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

/**
 * Validates GraphQL response structure
 *
 * @param response - Response data to validate
 * @throws GraphQLError if response structure is invalid
 */
function validateGraphQLResponse(response: unknown): asserts response is GraphQLResponse {
  if (typeof response !== 'object' || response === null) {
    throw new GraphQLError('Invalid GraphQL response: must be an object', undefined, {
      code: 'INVALID_RESPONSE_FORMAT',
    });
  }

  const graphqlResponse = response as Partial<GraphQLResponse>;

  // Response must have either data or errors
  if (graphqlResponse.data === undefined && !graphqlResponse.errors) {
    throw new GraphQLError('GraphQL response missing data field', undefined, {
      code: 'MISSING_DATA',
    });
  }

  // If errors exist, validate structure
  if (graphqlResponse.errors) {
    if (!Array.isArray(graphqlResponse.errors)) {
      throw new GraphQLError('Invalid GraphQL response: errors must be an array', undefined, {
        code: 'INVALID_ERRORS_FORMAT',
      });
    }

    // Validate each error has required message field
    for (const error of graphqlResponse.errors) {
      if (typeof error !== 'object' || error === null || typeof error.message !== 'string') {
        throw new GraphQLError(
          'Invalid GraphQL response: each error must have a message',
          undefined,
          { code: 'INVALID_ERROR_STRUCTURE' }
        );
      }
    }
  }
}

/**
 * Creates a GraphQLError from a raw GraphQL error with enhanced context
 *
 * @param rawError - Raw GraphQL error from server
 * @param context - Error context for debugging
 * @returns GraphQLError instance
 */
function createGraphQLError(rawError: RawGraphQLError, context: ErrorContext): GraphQLError {
  const extensions = {
    ...rawError.extensions,
    requestId: context.requestId,
    operationName: context.operationName,
  };

  return new GraphQLError(rawError.message, rawError.path, extensions, undefined, context);
}

/**
 * Utility function to strip whitespace and format GraphQL queries
 *
 * @param query - Raw GraphQL query string
 * @returns Formatted query string
 */
export function formatGraphQLQuery(query: string): string {
  return query
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\s*{\s*/g, ' { ') // Format opening braces
    .replace(/\s*}\s*/g, ' } ') // Format closing braces
    .replace(/\s*,\s*/g, ', ') // Format commas
    .replace(/\s*:\s*/g, ': ') // Format colons
    .replace(/\s+/g, ' ') // Clean up any double spaces
    .trim();
}

/**
 * Validates that a string is a valid GraphQL operation
 *
 * @param query - Query string to validate
 * @returns True if query appears to be valid GraphQL
 */
export function isValidGraphQLQuery(query: string): boolean {
  if (typeof query !== 'string' || !query.trim()) {
    return false;
  }

  const trimmedQuery = query.trim();

  // Check for basic GraphQL operation keywords
  const operationPattern = /^(query|mutation|subscription|fragment|\{)/i;
  if (!operationPattern.test(trimmedQuery)) {
    return false;
  }

  // Basic brace matching
  const openBraces = (trimmedQuery.match(/{/g) || []).length;
  const closeBraces = (trimmedQuery.match(/}/g) || []).length;

  // Check for valid structure - must have equal braces and proper structure
  if (openBraces !== closeBraces || openBraces === 0) {
    return false;
  }

  // Check for double braces at start (invalid)
  if (/^\s*{{/.test(trimmedQuery)) {
    return false;
  }

  return true;
}

/**
 * Safely stringifies variables for logging, removing sensitive data
 *
 * @param variables - GraphQL variables to stringify
 * @returns Safe string representation
 */
export function safeStringifyVariables(variables: GraphQLVariables): string {
  if (!variables) {
    return '{}';
  }

  try {
    // Create a copy and redact sensitive fields
    const sanitized = sanitizeVariables(variables);
    return JSON.stringify(sanitized, null, 2);
  } catch {
    return '[Unable to stringify variables]';
  }
}

/**
 * Sanitizes variables by removing or masking sensitive data
 *
 * @param variables - Variables to sanitize
 * @returns Sanitized variables
 */
function sanitizeVariables(variables: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'auth',
    'credential',
    'apikey',
    'accesstoken',
    'refreshtoken',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(variables)) {
    const lowerKey = key.toLowerCase();
    // Check for sensitive field patterns with special handling for 'credentials' vs 'credential'
    const isSensitive = sensitiveFields.some((field) => {
      // Special case: don't match 'credential' in 'credentials' when it's likely a container object
      if (field === 'credential' && lowerKey === 'credentials') {
        return false;
      }
      // General case: field appears in the key
      return lowerKey.includes(field);
    });

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeVariables(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
