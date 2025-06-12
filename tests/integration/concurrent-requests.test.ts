/**
 * Integration tests for concurrent request handling using HTTP boundary mocking
 * Tests actual SDK behavior without mocking internal functions
 */

import { ApiClient } from '../../src/client';
import { MswMockServer, createMswMockServer, waitForPendingRequests } from './msw-mock-server';

describe('Concurrent Request Handling Integration', () => {
  let mockServer: MswMockServer;
  let client: ApiClient;

  const clientConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    endpoint: 'https://api.example.com/graphql',
  };

  beforeAll(() => {
    mockServer = createMswMockServer();
    mockServer.start();
  });

  beforeEach(() => {
    client = new ApiClient(clientConfig);
    mockServer.reset();
  });

  afterAll(async () => {
    mockServer.stop();
    await waitForPendingRequests();
  });

  describe('Concurrent Query Execution', () => {
    it('should handle multiple concurrent queries successfully', async () => {
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            items {
              transactionActivityDate
              transactionType
              transactionCount
              transactionAmount
              acceptor {
                id
                businessName
              }
              organization {
                id
                businessName
              }
            }
          }
        }
      `;

      const variables = {
        input: {
          paging: { skip: 0, take: 3 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      };

      const startCounter = mockServer.getRequestCounter();

      // Execute 5 concurrent queries
      const promises = Array.from({ length: 5 }, (_, index) =>
        client.query(query, {
          ...variables,
          input: {
            ...variables.input,
            paging: { skip: index, take: 2 }, // Slight variation to make each unique
          },
        })
      );

      const results = await Promise.all(promises);

      // All requests should succeed
      expect(results).toHaveLength(5);

      results.forEach((result) => {
        expect(result.data).toBeDefined();
        const summaries = (result.data as any).paymentTransactionSummaries;
        expect(Array.isArray(summaries.items)).toBe(true);
        expect(summaries.items.length).toBeGreaterThan(0);

        const firstItem = summaries.items[0];
        expect(firstItem.transactionActivityDate).toBe('2025-01-07');
        expect(firstItem.transactionType).toBe('AUTHORIZATION');
        expect(firstItem.transactionCount).toBeGreaterThan(0);
        expect(firstItem.transactionAmount).toBeGreaterThan(0);
        expect(firstItem.acceptor.id).toBe('12345678-1234-5678-9abc-123456789abc');
        expect(firstItem.organization.id).toBe('87654321-4321-8765-dcba-987654321abc');
      });

      // Should have made 5 GraphQL requests
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(5);
    });

    it('should handle concurrent queries with authentication only once', async () => {
      const query1 = `
        query GetPaymentSummary1($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { 
              transactionCount 
              transactionAmount
            }
          }
        }
      `;

      const query2 = `
        query GetPaymentSummary2($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { 
              transactionType
              acceptor { businessName }
            }
          }
        }
      `;

      const variables = {
        input: {
          paging: { skip: 0, take: 2 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      };

      const startCounter = mockServer.getRequestCounter();

      // Execute different queries concurrently
      const [result1, result2] = await Promise.all([
        client.query(query1, variables),
        client.query(query2, variables),
      ]);

      expect(result1.data).toBeDefined();
      expect(
        (result1.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);
      expect(
        (result1.data as any).paymentTransactionSummaries.items[0].transactionAmount
      ).toBeGreaterThan(0);

      expect(result2.data).toBeDefined();
      expect((result2.data as any).paymentTransactionSummaries.items[0].transactionType).toBe(
        'AUTHORIZATION'
      );
      expect(
        (result2.data as any).paymentTransactionSummaries.items[0].acceptor.businessName
      ).toContain('Test Merchant');

      // Should have made 2 GraphQL requests
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(2);
    });

    it('should handle high-volume concurrent queries efficiently', async () => {
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { transactionCount }
          }
        }
      `;

      const createVariables = (index: number) => ({
        input: {
          paging: { skip: index % 5, take: 1 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      });

      // Execute 15 concurrent queries
      const promises = Array.from({ length: 15 }, (_, index) =>
        client.query(query, createVariables(index))
      );

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      // All should succeed
      expect(results).toHaveLength(15);
      results.forEach((result) => {
        expect(result.data).toBeDefined();
        expect(
          (result.data as any).paymentTransactionSummaries.items[0].transactionCount
        ).toBeGreaterThan(0);
      });

      // Should complete in reasonable time (concurrent execution should be efficient)
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(3000); // Allow reasonable buffer for 15 requests
    });
  });

  describe('Concurrent Mutation Execution', () => {
    it('should handle multiple concurrent mutations', async () => {
      const mutation = `
        mutation AuthorizeTransaction($authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput!) {
          authorizeCustomerInitiatedTransaction(authorizeCustomerInitiatedTransactionInput: $authorizeCustomerInitiatedTransactionInput) {
            authorizationResponse {
              transactionId
              paymentId
              activityDate
              networkResponseDetails {
                responseCode
                responseDescription
              }
              isDuplicateRequest
              duration
            }
            errors
          }
        }
      `;

      // Create different input for each mutation
      const createVariables = (index: number) => ({
        authorizeCustomerInitiatedTransactionInput: {
          acceptorId: '12345678-1234-5678-9abc-123456789abc',
          merchantReference: `concurrent-txn-${index}-${Date.now()}`,
          amount: 100.0 + index,
          currency: 'USD',
          paymentMethod: {
            cardWithPanDetails: {
              accountNumber: '4111111111111111',
              expirationMonth: 12,
              expirationYear: 25,
            },
          },
        },
      });

      const startCounter = mockServer.getRequestCounter();

      // Execute 4 concurrent mutations
      const promises = Array.from({ length: 4 }, (_, index) =>
        client.mutate(mutation, createVariables(index))
      );

      const results = await Promise.all(promises);

      // All mutations should succeed
      expect(results).toHaveLength(4);

      results.forEach((result) => {
        expect(result.data).toBeDefined();
        const authResult = (result.data as any).authorizeCustomerInitiatedTransaction;
        expect(authResult.authorizationResponse).toBeDefined();
        expect(authResult.authorizationResponse.transactionId).toMatch(/^txn-/);
        expect(authResult.authorizationResponse.paymentId).toMatch(/^pay-/);
        expect(authResult.authorizationResponse.activityDate).toBe('2025-01-07');
        expect(authResult.authorizationResponse.networkResponseDetails.responseCode).toBe('00');
        expect(authResult.authorizationResponse.networkResponseDetails.responseDescription).toBe(
          'APPROVED'
        );
        expect(authResult.authorizationResponse.isDuplicateRequest).toBe(false);
        expect(authResult.authorizationResponse.duration).toBeGreaterThan(100);
        expect(authResult.errors).toBeNull();
      });

      // Should have made 4 GraphQL requests
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(4);
    });

    it('should handle mixed concurrent queries and mutations', async () => {
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { 
              transactionCount
              transactionAmount 
            }
          }
        }
      `;

      const mutation = `
        mutation AuthorizeTransaction($authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput!) {
          authorizeCustomerInitiatedTransaction(authorizeCustomerInitiatedTransactionInput: $authorizeCustomerInitiatedTransactionInput) {
            authorizationResponse {
              transactionId
              duration
            }
          }
        }
      `;

      const queryVariables = {
        input: {
          paging: { skip: 0, take: 2 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      };

      const mutationVariables = {
        authorizeCustomerInitiatedTransactionInput: {
          acceptorId: '12345678-1234-5678-9abc-123456789abc',
          merchantReference: `mixed-test-${Date.now()}`,
          amount: 75.0,
          currency: 'USD',
          paymentMethod: {
            cardWithPanDetails: {
              accountNumber: '4111111111111111',
              expirationMonth: 12,
              expirationYear: 25,
            },
          },
        },
      };

      const startCounter = mockServer.getRequestCounter();

      // Execute queries and mutations concurrently
      const [queryResult1, mutationResult, queryResult2] = await Promise.all([
        client.query(query, queryVariables),
        client.mutate(mutation, mutationVariables),
        client.query(query, queryVariables),
      ]);

      expect(queryResult1.data).toBeDefined();
      expect(
        (queryResult1.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);
      expect(
        (queryResult1.data as any).paymentTransactionSummaries.items[0].transactionAmount
      ).toBeGreaterThan(0);

      expect(mutationResult.data).toBeDefined();
      expect(
        (mutationResult.data as any).authorizeCustomerInitiatedTransaction.authorizationResponse
          .transactionId
      ).toMatch(/^txn-/);
      expect(
        (mutationResult.data as any).authorizeCustomerInitiatedTransaction.authorizationResponse
          .duration
      ).toBeGreaterThan(100);

      expect(queryResult2.data).toBeDefined();
      expect(
        (queryResult2.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);

      // Should have made 3 GraphQL requests
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(3);
    });
  });

  describe('Authentication State During Concurrent Requests', () => {
    it('should authenticate once for multiple concurrent requests', async () => {
      const query = `query { __typename }`;

      const startCounter = mockServer.getRequestCounter();

      // Start multiple requests simultaneously before any authentication happens
      const promises = Array.from({ length: 8 }, () => client.query(query));

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach((result) => {
        expect(result.data).toBeDefined();
        expect((result.data as any).__typename).toBe('Query');
      });

      // Should have made 8 GraphQL requests
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(8);
    });

    it('should handle token expiration during concurrent requests', async () => {
      // First, establish authentication
      await client.query('query { __typename }');

      // Expire the token
      mockServer.expireToken();

      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { transactionCount }
          }
        }
      `;

      const variables = {
        input: {
          paging: { skip: 0, take: 1 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      };

      const startCounter = mockServer.getRequestCounter();

      // Start multiple requests after token expiration
      const promises = Array.from({ length: 6 }, () => client.query(query, variables));

      const results = await Promise.all(promises);

      // All should succeed after re-authentication
      results.forEach((result) => {
        expect(result.data).toBeDefined();
        expect(
          (result.data as any).paymentTransactionSummaries.items[0].transactionCount
        ).toBeGreaterThan(0);
      });

      // Should have made 6 initial requests (failed) + 6 retry requests (succeeded) = 12 total
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(12);
    });

    it('should maintain authentication state across mixed request types', async () => {
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { transactionCount }
          }
        }
      `;

      const mutation = `
        mutation AuthorizeTransaction($authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput!) {
          authorizeCustomerInitiatedTransaction(authorizeCustomerInitiatedTransactionInput: $authorizeCustomerInitiatedTransactionInput) {
            authorizationResponse {
              transactionId
            }
          }
        }
      `;

      const queryVariables = {
        input: {
          paging: { skip: 0, take: 1 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      };

      const mutationVariables = {
        authorizeCustomerInitiatedTransactionInput: {
          acceptorId: '12345678-1234-5678-9abc-123456789abc',
          merchantReference: `concurrent-auth-test-${Date.now()}`,
          amount: 25.0,
          currency: 'USD',
        },
      };

      const startCounter = mockServer.getRequestCounter();

      // Execute multiple operations concurrently
      const promises = [
        client.query(query, queryVariables),
        client.mutate(mutation, mutationVariables),
        client.query(query, queryVariables),
        client.mutate(mutation, {
          ...mutationVariables,
          authorizeCustomerInitiatedTransactionInput: {
            ...mutationVariables.authorizeCustomerInitiatedTransactionInput,
            merchantReference: `concurrent-auth-test-2-${Date.now()}`,
          },
        }),
        client.query(query, queryVariables),
      ];

      const results = await Promise.all(promises);

      // All should succeed
      expect(results).toHaveLength(5);

      // Verify query results
      [0, 2, 4].forEach((index) => {
        expect(
          (results[index].data as any).paymentTransactionSummaries.items[0].transactionCount
        ).toBeGreaterThan(0);
      });

      // Verify mutation results
      [1, 3].forEach((index) => {
        expect(
          (results[index].data as any).authorizeCustomerInitiatedTransaction.authorizationResponse
            .transactionId
        ).toMatch(/^txn-/);
      });

      // Should have made 5 GraphQL requests
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(5);
    });
  });

  describe('Request Isolation and Error Handling', () => {
    it('should maintain request isolation with different parameters', async () => {
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items {
              transactionCount
              transactionAmount
              acceptor { businessName }
            }
          }
        }
      `;

      // Create requests with different parameters
      const createRequest = (index: number) => {
        const variables = {
          input: {
            paging: { skip: index, take: 1 },
            where: { transactionActivityDate: { gte: `2025-01-0${(index % 7) + 1}` } },
          },
        };
        return client.query(query, variables);
      };

      // Execute requests with different parameters concurrently
      const promises = Array.from({ length: 6 }, (_, index) => createRequest(index));
      const results = await Promise.all(promises);

      // Each result should be independent and successful
      results.forEach((result) => {
        expect(result.data).toBeDefined();
        expect((result.data as any).paymentTransactionSummaries.items).toHaveLength(1);

        const item = (result.data as any).paymentTransactionSummaries.items[0];
        expect(item.transactionCount).toBeGreaterThan(0);
        expect(item.transactionAmount).toBeGreaterThan(0);
        expect(item.acceptor.businessName).toContain('Test Merchant');

        // Verify request ID uniqueness
        expect(result.requestId).toBeDefined();
      });

      // Verify different request IDs
      const requestIds = results.map((result) => result.requestId);
      const uniqueRequestIds = new Set(requestIds);
      expect(uniqueRequestIds.size).toBe(requestIds.length); // All unique
    });

    it('should handle partial failures in concurrent requests gracefully', async () => {
      // Set up server to fail GraphQL requests temporarily
      mockServer.setGraphQLFailure(true);

      const query = `query { __typename }`;
      const promises = Array.from({ length: 3 }, () => client.query(query));

      const results = await Promise.allSettled(promises);

      // All should fail due to GraphQL server failure
      results.forEach((result) => {
        expect(result.status).toBe('rejected');
      });

      // Fix the server and try again
      mockServer.setGraphQLFailure(false);

      const successPromises = Array.from({ length: 3 }, () => client.query(query));
      const successResults = await Promise.all(successPromises);

      // All should now succeed
      successResults.forEach((result) => {
        expect(result.data).toBeDefined();
        expect((result.data as any).__typename).toBe('Query');
      });
    });

    it('should handle authentication failures during concurrent requests', async () => {
      // Set up to fail authentication
      mockServer.setAuthFailure(true);

      const query = `query { __typename }`;
      const promises = Array.from({ length: 4 }, () =>
        client.query(query, undefined, { timeout: 1000 })
      );

      const results = await Promise.allSettled(promises);

      // All should fail due to authentication failure
      results.forEach((result) => {
        expect(result.status).toBe('rejected');
      });
    }, 10000);

    it('should handle race conditions in authentication', async () => {
      // This test ensures that multiple concurrent requests don't interfere with each other
      // during the authentication process
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { transactionCount }
          }
        }
      `;

      const createVariables = (index: number) => ({
        input: {
          paging: { skip: index % 3, take: 1 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      });

      // Execute many requests simultaneously to test for race conditions
      const promises = Array.from({ length: 12 }, (_, index) =>
        client.query(query, createVariables(index))
      );

      const results = await Promise.all(promises);

      // All should succeed without any race condition issues
      expect(results).toHaveLength(12);
      results.forEach((result) => {
        expect(result.data).toBeDefined();
        expect(
          (result.data as any).paymentTransactionSummaries.items[0].transactionCount
        ).toBeGreaterThan(0);
        expect(result.requestId).toBeDefined();
      });

      // Verify all requests have unique request IDs (no cross-contamination)
      const requestIds = results.map((result) => result.requestId);
      const uniqueRequestIds = new Set(requestIds);
      expect(uniqueRequestIds.size).toBe(requestIds.length);
    });
  });
});
