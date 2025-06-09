/**
 * MSW-based mock server utilities for integration tests
 * Provides proper HTTP boundary mocking for true integration testing
 */

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export interface MockServerConfig {
  baseUrl: string;
  authUrl: string;
  graphqlPath: string;
  tokenPath: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface PaymentTransactionSummary {
  transactionActivityDate: string;
  transactionType: string;
  transactionCount: number;
  transactionAmount: number;
  acceptor: {
    id: string;
    businessName: string;
  };
  organization: {
    id: string;
    businessName: string;
  };
  conveyedStatus: string;
  transactionCurrency: string;
  paymentFundingSource: string;
  presenterId: string;
}

export interface AuthorizationResponse {
  transactionId: string;
  paymentId: string;
  activityDate: string;
  timestampUtc: string;
  networkResponseDetails: {
    responseCode: string;
    responseDescription: string;
  };
  advice: {
    captureAdvice: string;
  };
  isDuplicateRequest: boolean;
  duration: number;
}

export class MswMockServer {
  private config: MockServerConfig;
  private server: ReturnType<typeof setupServer>;
  private requestCounter = 0;
  private currentToken: string | null = null;
  private tokenExpiry: number = 0;
  private authFailure = false;
  private graphqlFailure = false;
  private networkDelay = 0;

  constructor(config: MockServerConfig) {
    this.config = config;
    this.server = setupServer();
    this.setupHandlers();
  }

  /**
   * Set up all HTTP handlers for authentication and GraphQL endpoints
   */
  private setupHandlers(): void {
    const handlers = [
      // Token endpoint handler
      http.post(`${this.config.authUrl}${this.config.tokenPath}`, async ({ request }) => {
        // Add network delay if configured
        if (this.networkDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.networkDelay));
        }

        if (this.authFailure) {
          return HttpResponse.json(
            { error: 'server_error', error_description: 'Authentication server error' },
            { status: 500 }
          );
        }

        const body = await request.text();
        const params = new URLSearchParams(body);
        const grantType = params.get('grant_type');
        const clientId = params.get('client_id');
        const clientSecret = params.get('client_secret');

        if (grantType !== 'client_credentials' || !clientId || !clientSecret) {
          return HttpResponse.json(
            { error: 'invalid_request', error_description: 'Invalid request parameters' },
            { status: 400 }
          );
        }

        // Generate new token
        this.currentToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.tokenExpiry = Date.now() + 3600000; // 1 hour

        const response: AuthTokenResponse = {
          access_token: this.currentToken,
          token_type: 'Bearer',
          expires_in: 3600,
          scope: 'read write',
        };

        return HttpResponse.json(response, {
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': `auth-${Date.now()}`,
          },
        });
      }),

      // GraphQL endpoint handler
      http.post(`${this.config.baseUrl}${this.config.graphqlPath}`, async ({ request }) => {
        this.requestCounter++;

        // Add network delay if configured
        if (this.networkDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.networkDelay));
        }

        if (this.graphqlFailure) {
          return HttpResponse.json(
            { errors: [{ message: 'GraphQL server error' }] },
            { status: 500 }
          );
        }

        // Check authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return HttpResponse.json(
            {
              errors: [{ message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' } }],
            },
            { status: 401 }
          );
        }

        const token = authHeader.replace('Bearer ', '');

        // Reject manual tokens that don't follow expected format (for testing fallback behavior)
        if (
          token === 'manual-token-123' ||
          (token.startsWith('manual-') && !token.startsWith('mock_token_'))
        ) {
          return HttpResponse.json(
            {
              errors: [
                { message: 'Invalid token format', extensions: { code: 'UNAUTHENTICATED' } },
              ],
            },
            { status: 401 }
          );
        }

        // Check if token is expired or invalid
        if (
          token !== this.currentToken ||
          (this.tokenExpiry > 0 && Date.now() > this.tokenExpiry)
        ) {
          return HttpResponse.json(
            {
              errors: [
                { message: 'Token expired or invalid', extensions: { code: 'UNAUTHENTICATED' } },
              ],
            },
            { status: 401 }
          );
        }

        const body = await request.text();
        let query, variables, operationName;

        try {
          ({ query, variables, operationName } = JSON.parse(body));
        } catch {
          return HttpResponse.json(
            {
              errors: [
                { message: 'Invalid JSON in request body', extensions: { code: 'BAD_REQUEST' } },
              ],
            },
            { status: 400 }
          );
        }

        const response = this.handleGraphQLRequest(query, variables, operationName);

        return HttpResponse.json(response, {
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': `gql-${this.requestCounter}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          },
        });
      }),
    ];

    this.server.use(...handlers);
  }

  /**
   * Handle GraphQL requests and return appropriate mock responses
   */
  private handleGraphQLRequest(
    query: string,
    variables: Record<string, unknown>,
    operationName?: string
  ): Record<string, unknown> {
    // Handle paymentTransactionSummaries query
    if (query.includes('paymentTransactionSummaries')) {
      const summaries: PaymentTransactionSummary[] = [];
      const itemCount = (variables?.input as any)?.paging?.take || 10;

      for (let i = 0; i < Math.min(itemCount, 5); i++) {
        summaries.push({
          transactionActivityDate: '2025-01-07',
          transactionType: 'AUTHORIZATION',
          transactionCount: this.requestCounter + i,
          transactionAmount: 100.0 * (this.requestCounter + i),
          acceptor: {
            id: '12345678-1234-5678-9abc-123456789abc',
            businessName: `Test Merchant ${this.requestCounter + i}`,
          },
          organization: {
            id: '87654321-4321-8765-dcba-987654321abc',
            businessName: `Test Organization ${this.requestCounter + i}`,
          },
          conveyedStatus: 'CONVEYED',
          transactionCurrency: 'USD',
          paymentFundingSource: 'CREDIT',
          presenterId: `presenter-${this.requestCounter + i}`,
        });
      }

      return {
        data: {
          paymentTransactionSummaries: {
            pageInfo: {
              hasNextPage: summaries.length === itemCount,
              hasPreviousPage: false,
              startCursor: 'start',
              endCursor: 'end',
            },
            items: summaries,
          },
        },
      };
    }

    // Handle authorizeCustomerInitiatedTransaction mutation
    if (query.includes('authorizeCustomerInitiatedTransaction')) {
      const authResponse: AuthorizationResponse = {
        transactionId: `txn-${this.requestCounter}-${Date.now()}`,
        paymentId: `pay-${this.requestCounter}-${Date.now()}`,
        activityDate: '2025-01-07',
        timestampUtc: new Date().toISOString(),
        networkResponseDetails: {
          responseCode: '00',
          responseDescription: 'APPROVED',
        },
        advice: {
          captureAdvice: 'NO_CAPTURE_ADVICE',
        },
        isDuplicateRequest: false,
        duration: 100 + this.requestCounter,
      };

      return {
        data: {
          authorizeCustomerInitiatedTransaction: {
            authorizationResponse: authResponse,
            errors: null,
          },
        },
      };
    }

    // Handle simple introspection queries
    if (
      query.includes('__typename') &&
      !query.includes('paymentTransactionSummaries') &&
      !query.includes('authorizeCustomerInitiatedTransaction')
    ) {
      return {
        data: {
          __typename: 'Query',
        },
      };
    }

    // Handle test error scenarios
    if (query.includes('errorTest') || operationName === 'ErrorTest') {
      return {
        errors: [
          {
            message: 'Test validation error',
            locations: [{ line: 2, column: 3 }],
            path: ['errorTest'],
            extensions: {
              code: 'VALIDATION_ERROR',
              field: 'testField',
              constraint: 'REQUIRED',
              timestamp: new Date().toISOString(),
            },
          },
        ],
      };
    }

    // Default response for unknown queries
    return {
      data: {
        test: `mock response ${this.requestCounter}`,
        requestNumber: this.requestCounter,
      },
    };
  }

  /**
   * Start the mock server
   */
  start(): void {
    this.server.listen({ onUnhandledRequest: 'error' });
  }

  /**
   * Stop the mock server
   */
  stop(): void {
    this.server.close();
  }

  /**
   * Reset all handlers to default state
   */
  resetHandlers(): void {
    this.server.resetHandlers();
    this.setupHandlers();
  }

  /**
   * Configure server to fail authentication
   */
  setAuthFailure(shouldFail: boolean): void {
    this.authFailure = shouldFail;
  }

  /**
   * Configure server to fail GraphQL requests
   */
  setGraphQLFailure(shouldFail: boolean): void {
    this.graphqlFailure = shouldFail;
  }

  /**
   * Add network delay to all requests
   */
  setNetworkDelay(delay: number): void {
    this.networkDelay = delay;
  }

  /**
   * Expire the current token
   */
  expireToken(): void {
    this.tokenExpiry = Date.now() - 1000;
  }

  /**
   * Get the current token
   */
  getCurrentToken(): string | null {
    return this.currentToken;
  }

  /**
   * Check if current token is valid
   */
  isTokenValid(): boolean {
    return this.currentToken !== null && Date.now() < this.tokenExpiry;
  }

  /**
   * Reset all mock state
   */
  reset(): void {
    this.requestCounter = 0;
    this.currentToken = null;
    this.tokenExpiry = 0;
    this.authFailure = false;
    this.graphqlFailure = false;
    this.networkDelay = 0;
    this.resetHandlers();
  }

  /**
   * Get request counter for verification
   */
  getRequestCounter(): number {
    return this.requestCounter;
  }
}

/**
 * Create a mock server with default configuration
 */
export function createMswMockServer(): MswMockServer {
  const config: MockServerConfig = {
    baseUrl: 'https://api.example.com',
    authUrl: 'https://api.example.com',
    graphqlPath: '/graphql',
    tokenPath: '/openid/connect/token',
  };

  return new MswMockServer(config);
}

/**
 * Utility to wait for all pending MSW handlers to complete
 */
export async function waitForPendingRequests(): Promise<void> {
  // Wait a small amount for any pending HTTP requests to complete
  await new Promise((resolve) => setTimeout(resolve, 10));
}
