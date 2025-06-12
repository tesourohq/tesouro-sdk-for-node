/**
 * Shared test utilities for integration tests
 * Provides common setup patterns to eliminate duplication
 */

import { ApiClient } from '../../src/client';
import {
  MswMockServer,
  createMswMockServer,
  waitForPendingRequests,
} from '../integration/msw-mock-server';

/**
 * Standard client configuration for integration tests
 */
export const TEST_CLIENT_CONFIG = {
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  endpoint: 'https://api.example.com/graphql',
} as const;

/**
 * Test context interface for integration tests
 */
export interface IntegrationTestContext {
  mockServer: MswMockServer;
  client: ApiClient;
}

/**
 * Sets up integration test environment with MSW mock server and API client
 * Use this in describe blocks that need the full integration test setup
 *
 * @example
 * ```typescript
 * describe('My Integration Tests', () => {
 *   const { getTestContext, setupIntegrationTest } = setupIntegrationTestSuite();
 *   setupIntegrationTest();
 *
 *   it('should work', async () => {
 *     const { client, mockServer } = getTestContext();
 *     // use client and mockServer
 *   });
 * });
 * ```
 */
export function setupIntegrationTestSuite() {
  let mockServer: MswMockServer;
  let client: ApiClient;

  const setupIntegrationTest = () => {
    beforeAll(() => {
      mockServer = createMswMockServer();
      mockServer.start();
    });

    beforeEach(() => {
      client = new ApiClient(TEST_CLIENT_CONFIG);
      mockServer.reset();
    });

    afterAll(async () => {
      mockServer.stop();
      await waitForPendingRequests();
    });
  };

  const getTestContext = (): IntegrationTestContext => ({
    mockServer,
    client,
  });

  return {
    setupIntegrationTest,
    getTestContext,
  };
}

/**
 * Creates a fresh API client for testing with the standard configuration
 */
export function createTestClient(overrides?: Partial<typeof TEST_CLIENT_CONFIG>): ApiClient {
  return new ApiClient({
    ...TEST_CLIENT_CONFIG,
    ...overrides,
  });
}
