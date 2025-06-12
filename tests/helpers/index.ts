/**
 * Test helpers index
 * Provides convenient access to all test utilities
 */

// Integration test setup
export {
  setupIntegrationTestSuite,
  createTestClient,
  TEST_CLIENT_CONFIG,
  type IntegrationTestContext,
} from './integration-test-setup';

// Unit test mocks
export {
  createMockResponse,
  createMockHttpResponse,
  setupTimerMocks,
  cleanupTimerMocks,
  setupFetchMock,
  TEST_GRAPHQL_QUERY,
  TEST_GRAPHQL_VARIABLES,
  TEST_GRAPHQL_RESPONSE_DATA,
  TEST_GRAPHQL_ERROR_RESPONSE,
} from './unit-test-mocks';

// Test data fixtures
export {
  PAYMENT_TRANSACTION_SUMMARIES_QUERY,
  PAYMENT_TRANSACTION_SUMMARIES_VARIABLES,
  PAYMENT_TRANSACTION_SUMMARIES_RESPONSE,
  AUTHORIZE_TRANSACTION_MUTATION,
  AUTHORIZE_TRANSACTION_VARIABLES,
  AUTHORIZE_TRANSACTION_SUCCESS_RESPONSE,
  AUTHORIZE_TRANSACTION_FAILURE_RESPONSE,
  GRAPHQL_VALIDATION_ERROR_RESPONSE,
  NETWORK_ERROR_RESPONSE,
  AUTH_TOKEN_RESPONSE,
  createTestDateRange,
} from './test-data';
