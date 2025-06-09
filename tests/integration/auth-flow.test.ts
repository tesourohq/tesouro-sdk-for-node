/**
 * Integration tests for authentication flow using HTTP boundary mocking
 * Tests actual SDK behavior without mocking internal functions
 */

import { ApiClient } from '../../src/client';
import { MswMockServer, createMswMockServer, waitForPendingRequests } from './msw-mock-server';

describe('Authentication Flow Integration', () => {
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

  describe('Initial Authentication', () => {
    it('should authenticate and make GraphQL request successfully', async () => {
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
            }
          }
        }
      `;

      const variables = {
        input: {
          paging: { skip: 0, take: 5 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      };

      const result = await client.query(query, variables);

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
    });

    it('should handle authentication failure gracefully', async () => {
      mockServer.setAuthFailure(true);

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

      await expect(client.query(query, variables, { timeout: 1000 })).rejects.toThrow();
    }, 10000);

    it('should retry authentication on 401 response', async () => {
      // First, let's get a token
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

      await client.query(query, variables);

      // Expire the token
      mockServer.expireToken();

      // Make another request - should trigger re-authentication
      const result = await client.query(query, variables);

      expect(result.data).toBeDefined();
      const summaries = (result.data as any).paymentTransactionSummaries;
      expect(Array.isArray(summaries.items)).toBe(true);
      expect(summaries.items[0].transactionCount).toBeGreaterThan(0);
    });
  });

  describe('Token Management', () => {
    it('should reuse valid tokens for multiple requests', async () => {
      const query1 = `
        query GetPaymentSummary1($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { transactionCount }
          }
        }
      `;

      const query2 = `
        query GetPaymentSummary2($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            items { transactionAmount }
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

      await client.query(query1, variables);
      await client.query(query2, variables);

      // Should have made 2 GraphQL requests but reused auth
      const endCounter = mockServer.getRequestCounter();
      expect(endCounter - startCounter).toBe(2);
    });

    it('should handle concurrent requests during authentication', async () => {
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

      const variables = {
        input: {
          paging: { skip: 0, take: 1 },
          where: { transactionActivityDate: { gte: '2025-01-01' } },
        },
      };

      // Start multiple requests simultaneously
      const requests = [
        client.query(query, variables),
        client.query(query, variables),
        client.query(query, variables),
      ];

      const results = await Promise.all(requests);

      // All requests should succeed
      results.forEach((result) => {
        expect(result.data).toBeDefined();
        const summaries = (result.data as any).paymentTransactionSummaries;
        expect(Array.isArray(summaries.items)).toBe(true);
        expect(summaries.items[0].transactionCount).toBeGreaterThan(0);
      });
    });
  });

  describe('Mutation Authentication', () => {
    it('should authenticate for mutations successfully', async () => {
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

      const variables = {
        authorizeCustomerInitiatedTransactionInput: {
          acceptorId: '12345678-1234-5678-9abc-123456789abc',
          merchantReference: 'test-transaction-001',
          amount: 100.0,
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

      const result = await client.mutate(mutation, variables);

      expect(result.data).toBeDefined();
      const authResult = (result.data as any).authorizeCustomerInitiatedTransaction;
      expect(authResult.authorizationResponse).toBeDefined();
      expect(authResult.authorizationResponse.transactionId).toMatch(/^txn-/);
      expect(authResult.authorizationResponse.paymentId).toMatch(/^pay-/);
      expect(authResult.authorizationResponse.networkResponseDetails.responseCode).toBe('00');
      expect(authResult.authorizationResponse.networkResponseDetails.responseDescription).toBe(
        'APPROVED'
      );
      expect(authResult.authorizationResponse.isDuplicateRequest).toBe(false);
      expect(authResult.errors).toBeNull();
    });

    it('should handle mixed queries and mutations with shared authentication', async () => {
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
          merchantReference: 'mixed-test',
          amount: 50.0,
          currency: 'USD',
        },
      };

      // Execute query first
      const queryResult = await client.query(query, queryVariables);
      expect(
        (queryResult.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);

      // Then mutation (should reuse auth)
      const mutationResult = await client.mutate(mutation, mutationVariables);
      expect(
        (mutationResult.data as any).authorizeCustomerInitiatedTransaction.authorizationResponse
          .transactionId
      ).toMatch(/^txn-/);

      // Then another query (should still reuse auth)
      const queryResult2 = await client.query(query, queryVariables);
      expect(
        (queryResult2.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle network timeouts during authentication', async () => {
      mockServer.setNetworkDelay(2000); // 2 second delay

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

      // This should timeout due to default timeout being less than 2000ms
      await expect(client.query(query, variables, { timeout: 500 })).rejects.toThrow();
    });

    it('should clear token on authentication failure and retry', async () => {
      // First successful request
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

      await client.query(query, variables);

      // Simulate auth server failure
      mockServer.setAuthFailure(true);

      // Clear the client's token to force re-authentication
      client.clearAccessToken();

      // This should fail
      await expect(client.query(query, variables)).rejects.toThrow();

      // Fix auth server and reset
      mockServer.setAuthFailure(false);

      // Should work again (will get new token)
      const result = await client.query(query, variables);
      expect(
        (result.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);
    }, 10000);

    it('should handle GraphQL errors with proper error transformation', async () => {
      const query = `
        query ErrorTest {
          errorTest {
            field
          }
        }
      `;

      await expect(client.query(query)).rejects.toThrow('Test validation error');
    });
  });
});
