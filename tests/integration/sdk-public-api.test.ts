/**
 * Integration tests for SDK public API methods using HTTP boundary mocking
 * Tests the actual public interface that users will interact with
 */

import { ApiClient } from '../../src/client';
import { MswMockServer, createMswMockServer, waitForPendingRequests } from './msw-mock-server';

describe('SDK Public API Integration Tests', () => {
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

  describe('Query Method', () => {
    it('should execute paymentTransactionSummaries query with full type safety', async () => {
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
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
              conveyedStatus
              transactionCurrency
              paymentFundingSource
              presenterId
            }
          }
        }
      `;

      const variables = {
        input: {
          paging: { skip: 0, take: 10 },
          where: {
            transactionActivityDate: { gte: '2025-01-01' },
            transactionType: ['AUTHORIZATION', 'CAPTURE'],
            conveyedStatus: ['CONVEYED', 'PENDING'],
          },
        },
      };

      const result = await client.query(query, variables);

      // Verify result structure
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('requestId');

      // Verify data content
      const summaries = (result.data as any).paymentTransactionSummaries;
      expect(summaries).toHaveProperty('pageInfo');
      expect(summaries).toHaveProperty('items');
      expect(Array.isArray(summaries.items)).toBe(true);
      expect(summaries.items.length).toBeGreaterThan(0);

      // Verify page info
      expect(summaries.pageInfo).toHaveProperty('hasNextPage');
      expect(summaries.pageInfo).toHaveProperty('hasPreviousPage');
      expect(summaries.pageInfo).toHaveProperty('startCursor');
      expect(summaries.pageInfo).toHaveProperty('endCursor');

      // Verify item structure
      const firstItem = summaries.items[0];
      expect(firstItem.transactionActivityDate).toBe('2025-01-07');
      expect(firstItem.transactionType).toBe('AUTHORIZATION');
      expect(typeof firstItem.transactionCount).toBe('number');
      expect(typeof firstItem.transactionAmount).toBe('number');
      expect(firstItem.acceptor).toHaveProperty('id');
      expect(firstItem.acceptor).toHaveProperty('businessName');
      expect(firstItem.organization).toHaveProperty('id');
      expect(firstItem.organization).toHaveProperty('businessName');
      expect(firstItem.conveyedStatus).toBe('CONVEYED');
      expect(firstItem.transactionCurrency).toBe('USD');
      expect(firstItem.paymentFundingSource).toBe('CREDIT');

      // Verify response metadata
      expect(result.response.status).toBe(200);
      expect(result.requestId).toMatch(/^gql-/);
    });

    it('should execute simple queries with minimal parameters', async () => {
      const query = `query { __typename }`;

      const result = await client.query(query);

      expect(result.data).toBeDefined();
      expect((result.data as any).__typename).toBe('Query');
      expect(result.requestId).toBeDefined();
    });

    it('should handle query with custom timeout', async () => {
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

      const result = await client.query(query, variables, { timeout: 5000 });

      expect(result.data).toBeDefined();
      expect(
        (result.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);
    });
  });

  describe('Mutate Method', () => {
    it('should execute authorizeCustomerInitiatedTransaction mutation with full type safety', async () => {
      const mutation = `
        mutation AuthorizeTransaction($authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput!) {
          authorizeCustomerInitiatedTransaction(authorizeCustomerInitiatedTransactionInput: $authorizeCustomerInitiatedTransactionInput) {
            authorizationResponse {
              transactionId
              paymentId
              activityDate
              timestampUtc
              networkResponseDetails {
                responseCode
                responseDescription
              }
              advice {
                captureAdvice
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
          merchantReference: `api-test-${Date.now()}`,
          amount: 250.0,
          currency: 'USD',
          paymentMethod: {
            cardWithPanDetails: {
              accountNumber: '4111111111111111',
              expirationMonth: 12,
              expirationYear: 25,
              cvv: '123',
            },
          },
          billingAddress: {
            streetAddress: '123 Test St',
            city: 'Test City',
            state: 'TS',
            postalCode: '12345',
            country: 'US',
          },
        },
      };

      const result = await client.mutate(mutation, variables);

      // Verify result structure
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('requestId');

      // Verify mutation data
      const authResult = (result.data as any).authorizeCustomerInitiatedTransaction;
      expect(authResult).toHaveProperty('authorizationResponse');
      expect(authResult).toHaveProperty('errors');

      // Verify authorization response
      const authResponse = authResult.authorizationResponse;
      expect(authResponse.transactionId).toMatch(/^txn-/);
      expect(authResponse.paymentId).toMatch(/^pay-/);
      expect(authResponse.activityDate).toBe('2025-01-07');
      expect(authResponse.timestampUtc).toBeDefined();
      expect(new Date(authResponse.timestampUtc)).toBeInstanceOf(Date);

      // Verify network response details
      expect(authResponse.networkResponseDetails.responseCode).toBe('00');
      expect(authResponse.networkResponseDetails.responseDescription).toBe('APPROVED');

      // Verify advice
      expect(authResponse.advice.captureAdvice).toBe('NO_CAPTURE_ADVICE');

      // Verify other fields
      expect(authResponse.isDuplicateRequest).toBe(false);
      expect(typeof authResponse.duration).toBe('number');
      expect(authResponse.duration).toBeGreaterThan(0);

      // Verify no errors
      expect(authResult.errors).toBeNull();

      // Verify response metadata
      expect(result.response.status).toBe(200);
      expect(result.requestId).toMatch(/^gql-/);
    });

    it('should handle mutation with minimal required parameters', async () => {
      const mutation = `
        mutation AuthorizeTransaction($authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput!) {
          authorizeCustomerInitiatedTransaction(authorizeCustomerInitiatedTransactionInput: $authorizeCustomerInitiatedTransactionInput) {
            authorizationResponse {
              transactionId
              networkResponseDetails {
                responseCode
              }
            }
          }
        }
      `;

      const variables = {
        authorizeCustomerInitiatedTransactionInput: {
          acceptorId: '12345678-1234-5678-9abc-123456789abc',
          merchantReference: `minimal-test-${Date.now()}`,
          amount: 10.0,
          currency: 'USD',
        },
      };

      const result = await client.mutate(mutation, variables);

      expect(result.data).toBeDefined();
      const authResult = (result.data as any).authorizeCustomerInitiatedTransaction;
      expect(authResult.authorizationResponse.transactionId).toMatch(/^txn-/);
      expect(authResult.authorizationResponse.networkResponseDetails.responseCode).toBe('00');
    });
  });

  describe('Request Method (Generic)', () => {
    it('should handle generic GraphQL requests', async () => {
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

      const result = await client.request(query, variables);

      expect(result.data).toBeDefined();
      expect(
        (result.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);
    });

    it('should handle requests with operation name', async () => {
      const query = `
        query GetPaymentSummary($input: PaymentTransactionSummaryInput!) {
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

      const result = await client.request(query, variables, { operationName: 'GetPaymentSummary' });

      expect(result.data).toBeDefined();
      expect(
        (result.data as any).paymentTransactionSummaries.items[0].transactionCount
      ).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle GraphQL validation errors', async () => {
      const query = `
        query ErrorTest {
          errorTest {
            field
          }
        }
      `;

      await expect(client.query(query)).rejects.toThrow('Test validation error');
    });

    it('should handle authentication errors', async () => {
      mockServer.setAuthFailure(true);

      const query = `query { __typename }`;

      await expect(client.query(query, undefined, { timeout: 1000 })).rejects.toThrow();
    }, 10000);

    it('should handle network timeouts', async () => {
      mockServer.setNetworkDelay(2000);

      const query = `query { __typename }`;

      await expect(client.query(query, undefined, { timeout: 500 })).rejects.toThrow();
    });

    it('should handle GraphQL server errors', async () => {
      mockServer.setGraphQLFailure(true);

      const query = `query { __typename }`;

      await expect(client.query(query)).rejects.toThrow();
    });
  });

  describe('Configuration and Options', () => {
    it('should work with custom headers', async () => {
      const query = `query { __typename }`;

      const result = await client.query(query, undefined, {
        headers: {
          'X-Custom-Header': 'test-value',
          'X-Client-Version': '1.0.0',
        },
      });

      expect(result.data).toBeDefined();
      expect((result.data as any).__typename).toBe('Query');
    });

    it('should handle requests with custom endpoint configuration', async () => {
      // Create client with custom configuration
      const customClient = new ApiClient({
        ...clientConfig,
        timeout: 10000,
      });

      const query = `query { __typename }`;

      const result = await customClient.query(query);

      expect(result.data).toBeDefined();
      expect((result.data as any).__typename).toBe('Query');
    });

    it('should fallback to normal auth when manual token fails', async () => {
      const clientWithManualToken = new ApiClient({
        ...clientConfig,
        accessToken: 'manual-token-123',
      });

      const query = `query { __typename }`;

      // When manual token fails, SDK should fallback to normal authentication
      const result = await clientWithManualToken.query(query);

      expect(result.data).toBeDefined();
      expect((result.data as any).__typename).toBe('Query');
      expect(result.requestId).toBeDefined();
    });
  });

  describe('Advanced Usage Patterns', () => {
    it('should handle complex nested queries', async () => {
      const query = `
        query GetComplexPaymentData($input: PaymentTransactionSummaryInput!) {
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
              conveyedStatus
              transactionCurrency
              paymentFundingSource
              presenterId
            }
          }
        }
      `;

      const variables = {
        input: {
          paging: { skip: 0, take: 5 },
          where: {
            transactionActivityDate: { gte: '2025-01-01', lte: '2025-12-31' },
            transactionType: ['AUTHORIZATION'],
            conveyedStatus: ['CONVEYED'],
            transactionCurrency: ['USD'],
          },
          orderBy: [
            { field: 'transactionActivityDate', direction: 'DESC' },
            { field: 'transactionAmount', direction: 'ASC' },
          ],
        },
      };

      const result = await client.query(query, variables);

      expect(result.data).toBeDefined();
      const summaries = (result.data as any).paymentTransactionSummaries;
      expect(Array.isArray(summaries.items)).toBe(true);
      expect(summaries.items.length).toBeGreaterThan(0);
      expect(summaries.pageInfo).toBeDefined();
    });

    it('should handle mutations with complex input structures', async () => {
      const mutation = `
        mutation ComplexAuthorization($authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput!) {
          authorizeCustomerInitiatedTransaction(authorizeCustomerInitiatedTransactionInput: $authorizeCustomerInitiatedTransactionInput) {
            authorizationResponse {
              transactionId
              paymentId
              networkResponseDetails {
                responseCode
                responseDescription
              }
              advice {
                captureAdvice
              }
            }
            errors
          }
        }
      `;

      const variables = {
        authorizeCustomerInitiatedTransactionInput: {
          acceptorId: '12345678-1234-5678-9abc-123456789abc',
          merchantReference: `complex-${Date.now()}`,
          amount: 500.0,
          currency: 'USD',
          paymentMethod: {
            cardWithPanDetails: {
              accountNumber: '4111111111111111',
              expirationMonth: 12,
              expirationYear: 25,
              cvv: '123',
            },
          },
          billingAddress: {
            streetAddress: '456 Complex Ave',
            city: 'Integration City',
            state: 'IC',
            postalCode: '54321',
            country: 'US',
          },
          metadata: {
            customField1: 'value1',
            customField2: 'value2',
          },
        },
      };

      const result = await client.mutate(mutation, variables);

      expect(result.data).toBeDefined();
      const authResult = (result.data as any).authorizeCustomerInitiatedTransaction;
      expect(authResult.authorizationResponse.transactionId).toMatch(/^txn-/);
      expect(authResult.authorizationResponse.networkResponseDetails.responseCode).toBe('00');
      expect(authResult.errors).toBeNull();
    });

    it('should support query result streaming (pagination)', async () => {
      const query = `
        query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
          paymentTransactionSummaries(input: $input) {
            pageInfo {
              hasNextPage
              endCursor
            }
            items {
              transactionCount
              transactionAmount
            }
          }
        }
      `;

      // Simulate pagination by making multiple requests
      const results = [];
      let hasNextPage = true;
      let skip = 0;
      const take = 2;

      while (hasNextPage && results.length < 6) {
        const variables = {
          input: {
            paging: { skip, take },
            where: { transactionActivityDate: { gte: '2025-01-01' } },
          },
        };

        const result = await client.query(query, variables);
        const summaries = (result.data as any).paymentTransactionSummaries;

        results.push(...summaries.items);
        hasNextPage = summaries.pageInfo.hasNextPage && skip < 4; // Limit for test
        skip += take;
      }

      expect(results.length).toBeGreaterThan(0);
      results.forEach((item) => {
        expect(item.transactionCount).toBeGreaterThan(0);
        expect(item.transactionAmount).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle rapid sequential requests', async () => {
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

      // Execute 10 requests rapidly in sequence
      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = await client.query(query, variables);
        results.push(result);
      }

      expect(results).toHaveLength(10);
      results.forEach((result) => {
        expect(result.data).toBeDefined();
        expect(
          (result.data as any).paymentTransactionSummaries.items[0].transactionCount
        ).toBeGreaterThan(0);
      });
    });

    it('should maintain performance under load', async () => {
      const query = `query { __typename }`;

      const startTime = Date.now();

      // Execute 20 concurrent requests
      const promises = Array.from({ length: 20 }, () => client.query(query));
      const results = await Promise.all(promises);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // All should succeed
      expect(results).toHaveLength(20);
      results.forEach((result) => {
        expect((result.data as any).__typename).toBe('Query');
      });

      // Should complete in reasonable time
      expect(duration).toBeLessThan(5000); // 5 second max for 20 concurrent requests
    });
  });
});
