# Tesouro SDK Quick Start Guide

Get up and running with the Tesouro SDK for Node.js in minutes.

## Installation

```bash
npm install @tesouro/tesouro-sdk-for-node
```

## Basic Setup

```typescript
import { TesouroClient } from '@tesouro/tesouro-sdk-for-node';

const client = new TesouroClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});
```

**💡 Working Example:** [Basic Setup](../examples/test-project/src/setup.ts)

## Your First Query

Retrieve payment transactions from the last month:

```typescript
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  .toISOString().split('T')[0];
const today = new Date().toISOString().split('T')[0];

const result = await client.paymentTransactions({
  input: {
    paging: { skip: 0, take: 10 },
    where: {
      transactionActivityDate: {
        gte: thirtyDaysAgo,
        lte: today
      }
    }
  }
});

if (result.data?.paymentTransactions) {
  console.log(`Found ${result.data.paymentTransactions.items.length} transactions`);
}
```

**💡 Working Example:** [Query Patterns](../examples/test-project/src/query.ts)

## Your First Mutation

Authorize a customer payment:

```typescript
import { randomUUID } from 'crypto';

const result = await client.authorizeCustomerInitiatedTransaction({
  authorizeCustomerInitiatedTransactionInput: {
    acceptorId: 'your-acceptor-id',
    transactionReference: randomUUID(),
    automaticCapture: 'NEVER',
    transactionAmountDetails: {
      totalAmount: 25.99,
      currency: 'USD'
    },
    paymentMethodDetails: {
      cardWithPanDetails: {
        accountNumber: '4100000000000001',
        paymentEntryMode: 'KEYED',
        expirationMonth: '12',
        expirationYear: '2025',
        securityCode: {
          value: '123'
        }
      }
    }
  }
});

const authResponse = result.data?.authorizeCustomerInitiatedTransaction.authorizationResponse;
if (authResponse) {
  console.log(`Authorization successful! Transaction ID: ${authResponse.transactionId}`);
}
```

**💡 Working Example:** [Mutation Patterns](../examples/test-project/src/mutations.ts)

## Authentication

The SDK handles OAuth 2.0 authentication automatically:

```typescript
// Automatic token management - no manual intervention needed
const client = new TesouroClient({
  clientId: process.env.TESOURO_CLIENT_ID!,
  clientSecret: process.env.TESOURO_CLIENT_SECRET!
});

// Token refresh happens automatically before expiration
const result = await client.paymentTransactions(variables);
```

**💡 Working Example:** [Authentication Patterns](../examples/test-project/src/auth.ts)

## Configuration Options

### Request-level Options

```typescript
const result = await client.paymentTransactions(variables, {
  timeout: 10000, // 10 second timeout
  headers: {
    'X-Request-ID': 'unique-request-id',
    'X-Client-Version': '1.0.0'
  }
});
```

### Client-level Configuration

```typescript
const client = new TesouroClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  timeout: 30000, // Global timeout
  headers: {
    'X-API-Version': '2024-01-01' // Default header for all requests
  }
});
```

**💡 Working Example:** [Authentication Patterns](../examples/test-project/src/auth.ts)

## Pagination

Handle large datasets with automatic pagination:

```typescript
let allTransactions = [];
let hasNextPage = true;
let skip = 0;
const take = 100;

while (hasNextPage) {
  const result = await client.paymentTransactions({
    input: {
      paging: { skip, take },
      where: {
        transactionActivityDate: {
          gte: thirtyDaysAgo,
          lte: today
        }
      }
    }
  });

  if (result.data?.paymentTransactions) {
    allTransactions.push(...result.data.paymentTransactions.items);
    hasNextPage = result.data.paymentTransactions.pageInfo.hasNextPage;
    skip += take;
  } else {
    break;
  }
}

console.log(`Retrieved ${allTransactions.length} total transactions`);
```

**💡 Working Example:** [Pagination Patterns](../examples/test-project/src/pagination.ts)

## Error Handling

The SDK provides comprehensive error handling:

```typescript
import { GraphQLError, NetworkError } from '@tesouro/tesouro-sdk-for-node';

try {
  const result = await client.paymentTransactions(variables);
  
  if (result.errors && result.errors.length > 0) {
    console.log('GraphQL errors:', result.errors);
  }
  
  if (result.data?.paymentTransactions) {
    console.log('Success:', result.data.paymentTransactions);
  }
  
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof GraphQLError) {
    console.error('GraphQL error:', error.errors);
  } else {
    console.error('Unknown error:', error);
  }
}
```

**💡 Working Example:** [Query Patterns](../examples/test-project/src/query.ts)

## Concurrent Requests

Handle multiple simultaneous requests efficiently:

```typescript
const [transactionsResult, summariesResult] = await Promise.all([
  client.paymentTransactions({
    input: {
      paging: { skip: 0, take: 10 },
      where: { transactionActivityDate: { gte: thirtyDaysAgo, lte: today } }
    }
  }),
  client.paymentTransactionSummaries({
    input: {
      paging: { skip: 0, take: 10 },
      where: { transactionActivityDate: { gte: thirtyDaysAgo, lte: today } }
    }
  })
]);

console.log(`Transactions: ${transactionsResult.data?.paymentTransactions.items.length}`);
console.log(`Summaries: ${summariesResult.data?.paymentTransactionSummaries.items.length}`);
```

**💡 Working Example:** [Concurrent Request Patterns](../examples/test-project/src/concurrent-requests.ts)

## Token Refresh Management

For advanced use cases, manage token refresh manually:

```typescript
// Automatic refresh (recommended)
const client = new TesouroClient(config);

// Manual refresh (advanced)
try {
  const result = await client.paymentTransactions(variables);
} catch (error) {
  if (error.message.includes('unauthorized') || error.message.includes('token')) {
    // Token might be expired, client will automatically retry with fresh token
    console.log('Token refresh handled automatically');
  }
}
```

**💡 Working Example:** [Token Refresh Patterns](../examples/test-project/src/token-refresh.ts)

## Environment Setup

Create a `.env` file in your project root:

```env
TESOURO_CLIENT_ID=your-client-id
TESOURO_CLIENT_SECRET=your-client-secret
TESOURO_ENDPOINT=https://api.sandbox.tesouro.com/graphql
TESOURO_TOKEN_ENDPOINT=https://api.sandbox.tesouro.com/openid/connect/token
```

## TypeScript Support

The SDK is built with TypeScript and provides full type safety:

```typescript
import type {
  TesouroClient,
  QueryPaymentTransactionsArgs,
  PaymentTransactionCollection,
  MutationAuthorizeCustomerInitiatedTransactionArgs,
  CustomerInitiatedTransactionAuthorizationInput
} from '@tesouro/tesouro-sdk-for-node';

// All method parameters and return types are fully typed
const variables: QueryPaymentTransactionsArgs = {
  input: {
    paging: { skip: 0, take: 10 },
    where: {
      transactionActivityDate: {
        gte: thirtyDaysAgo,
        lte: today
      }
    }
  }
};
```

## Next Steps

- 📖 Explore the [complete examples](../examples/test-project/src/) directory
- 🔧 Check out [authentication patterns](../examples/test-project/src/auth.ts)
- 🚀 Review [pagination strategies](../examples/test-project/src/pagination.ts)
- ⚡ Learn about [concurrent requests](../examples/test-project/src/concurrent-requests.ts)
- 🔄 Understand [token refresh management](../examples/test-project/src/token-refresh.ts)

## Need Help?

- Review the [examples](../examples/) directory for complete working code
- Check the [test project](../examples/test-project/) for runnable demonstrations
- Look at the [API documentation](https://docs.tesouro.com) for detailed endpoint reference