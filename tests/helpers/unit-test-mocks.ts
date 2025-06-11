/**
 * Shared mock utilities for unit tests
 * Provides common mock patterns to eliminate duplication
 */

/**
 * Standard fetch mock response builder
 */
export function createMockResponse(
  data: any,
  options: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    contentType?: string;
  } = {}
) {
  const {
    status = 200,
    statusText = 'OK',
    headers = {},
    contentType = 'application/json',
  } = options;

  const allHeaders = new Headers({
    'content-type': contentType,
    ...headers,
  });

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: allHeaders,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(typeof data === 'string' ? data : JSON.stringify(data)),
  };
}

/**
 * Standard HTTP response for request module tests
 */
export function createMockHttpResponse(
  data: any,
  options: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    requestId?: string;
  } = {}
) {
  const { status = 200, statusText = 'OK', headers = {}, requestId = 'req-123' } = options;

  return {
    status,
    statusText,
    headers: new Headers({ 'x-request-id': requestId, ...headers }),
    data,
    response: new Response(),
  };
}

/**
 * Sets up timer mocks for async timeout tests
 * Call this in beforeEach for tests that use setTimeout/clearTimeout
 */
export function setupTimerMocks() {
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useFakeTimers();
  jest.spyOn(global, 'clearTimeout');
  jest.spyOn(global, 'setTimeout');
}

/**
 * Cleans up timer mocks
 * Call this in afterEach for tests that use timer mocks
 */
export function cleanupTimerMocks() {
  jest.useRealTimers();
  jest.restoreAllMocks();
}

/**
 * Sets up fetch mock with automatic cleanup
 * Returns the mock function for direct access
 */
export function setupFetchMock() {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  return mockFetch;
}

/**
 * Standard GraphQL query for testing
 */
export const TEST_GRAPHQL_QUERY = 'query GetUser($id: ID!) { user(id: $id) { name email } }';

/**
 * Standard GraphQL variables for testing
 */
export const TEST_GRAPHQL_VARIABLES = { id: '123' };

/**
 * Standard GraphQL response data for testing
 */
export const TEST_GRAPHQL_RESPONSE_DATA = {
  data: { user: { name: 'John Doe', email: 'john@example.com' } },
};

/**
 * Standard GraphQL error response for testing
 */
export const TEST_GRAPHQL_ERROR_RESPONSE = {
  errors: [
    {
      message: 'User not found',
      extensions: {
        code: 'NOT_FOUND',
        field: 'id',
      },
    },
  ],
};
