/**
 * Shared test data and queries for consistent testing
 * Provides common test fixtures to eliminate duplication
 */

/**
 * Standard payment transaction query for testing
 */
export const PAYMENT_TRANSACTION_SUMMARIES_QUERY = `
  query GetPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
    paymentTransactionSummaries(input: $input) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        amount
        currency
        status
        createdAt
      }
    }
  }
`;

/**
 * Standard payment transaction query variables
 */
export const PAYMENT_TRANSACTION_SUMMARIES_VARIABLES = {
  input: {
    paging: { skip: 0, take: 10 },
    where: {
      transactionActivityDate: {
        gte: '2023-01-01',
        lte: '2023-12-31',
      },
    },
  },
};

/**
 * Standard payment transaction response data
 */
export const PAYMENT_TRANSACTION_SUMMARIES_RESPONSE = {
  data: {
    paymentTransactionSummaries: {
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
      items: [
        {
          id: 'txn-1',
          amount: 100.0,
          currency: 'USD',
          status: 'COMPLETED',
          createdAt: '2023-06-01T10:00:00Z',
        },
        {
          id: 'txn-2',
          amount: 250.5,
          currency: 'USD',
          status: 'PENDING',
          createdAt: '2023-06-01T11:00:00Z',
        },
      ],
    },
  },
};

/**
 * Standard authorization mutation for testing
 */
export const AUTHORIZE_TRANSACTION_MUTATION = `
  mutation AuthorizeTransaction($input: AuthorizeTransactionInput!) {
    authorizeTransaction(input: $input) {
      id
      status
      authorizationCode
      errors {
        code
        message
        field
      }
    }
  }
`;

/**
 * Standard authorization mutation variables
 */
export const AUTHORIZE_TRANSACTION_VARIABLES = {
  input: {
    amount: 100.0,
    currency: 'USD',
    cardToken: 'card_token_123',
    merchantReference: 'order_12345',
  },
};

/**
 * Standard authorization success response
 */
export const AUTHORIZE_TRANSACTION_SUCCESS_RESPONSE = {
  data: {
    authorizeTransaction: {
      id: 'auth-123',
      status: 'APPROVED',
      authorizationCode: 'AUTH001',
      errors: [],
    },
  },
};

/**
 * Standard authorization failure response
 */
export const AUTHORIZE_TRANSACTION_FAILURE_RESPONSE = {
  data: {
    authorizeTransaction: {
      id: null,
      status: 'DECLINED',
      authorizationCode: null,
      errors: [
        {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Card has insufficient funds',
          field: 'amount',
        },
      ],
    },
  },
};

/**
 * Standard GraphQL validation error response
 */
export const GRAPHQL_VALIDATION_ERROR_RESPONSE = {
  errors: [
    {
      message: 'Variable "$input" got invalid value; Expected non-nullable type',
      extensions: {
        code: 'GRAPHQL_VALIDATION_FAILED',
        exception: {
          stacktrace: ['GraphQLError: Validation error'],
        },
      },
    },
  ],
};

/**
 * Standard network error for testing
 */
export const NETWORK_ERROR_RESPONSE = {
  message: 'Network request failed',
  code: 'NETWORK_ERROR',
  statusCode: 500,
};

/**
 * Standard auth token response for testing
 */
export const AUTH_TOKEN_RESPONSE = {
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  token_type: 'Bearer',
  expires_in: 3600,
  scope: 'api:read api:write',
};

/**
 * Creates a date range for testing that's safe for API limits
 */
export function createTestDateRange(daysAgo: number = 7) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 2); // 2 days ago to avoid timezone issues

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  return {
    gte: startDate.toISOString().split('T')[0],
    lte: endDate.toISOString().split('T')[0],
  };
}
