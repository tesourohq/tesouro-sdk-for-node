# Tesouro SDK for Node.js

A TypeScript-first GraphQL SDK for the Tesouro payment platform with built-in OAuth 2.0 authentication and comprehensive error handling.

[![npm version](https://badge.fury.io/js/@tesouro/tesouro-sdk-for-node.svg)](https://badge.fury.io/js/@tesouro/tesouro-sdk-for-node)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- 🚀 **TypeScript-first** - Full type safety with auto-generated types from GraphQL schema
- 🔐 **Automatic Authentication** - Built-in OAuth 2.0 client credentials flow with token refresh
- 📊 **GraphQL Native** - Strongly-typed GraphQL operations with automatic query generation
- ⚡ **Performance Optimized** - Concurrent request support and intelligent token management
- 🛡️ **Error Handling** - Comprehensive error types and validation
- 📚 **Well Documented** - Extensive examples and JSDoc comments
- 🧪 **Testing Ready** - Built-in testing utilities and mock support

## Quick Start

### Installation

```bash
npm install @tesouro/tesouro-sdk-for-node
```

### Basic Usage

```typescript
import { TesouroClient } from '@tesouro/tesouro-sdk-for-node';

// Initialize the client
const client = new TesouroClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

// Query payment transactions
const result = await client.paymentTransactions({
  input: {
    paging: { skip: 0, take: 10 },
    where: {
      transactionActivityDate: {
        gte: '2024-01-01',
        lte: '2024-01-31'
      }
    }
  }
});

console.log(`Found ${result.data?.paymentTransactions.items.length} transactions`);
```

### Process a Payment

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
        securityCode: { value: '123' }
      }
    }
  }
});

const authResponse = result.data?.authorizeCustomerInitiatedTransaction.authorizationResponse;
if (authResponse) {
  console.log(`Payment authorized! Transaction ID: ${authResponse.transactionId}`);
}
```

📖 **[Full Quick Start Guide →](docs/QUICKSTART.md)**

## Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Get up and running in minutes
- **[API Reference](docs/api/)** - Complete API documentation
- **[Examples](examples/)** - Working code examples for common use cases
- **[Test Project](examples/test-project/)** - Runnable examples and testing patterns

## Examples

The SDK includes comprehensive examples for common use cases:

### Query Patterns
- **[Basic Queries](examples/test-project/src/query.ts)** - Simple data retrieval
- **[Pagination](examples/test-project/src/pagination.ts)** - Handle large datasets
- **[Concurrent Requests](examples/test-project/src/concurrent-requests.ts)** - Parallel API calls

### Payment Operations
- **[Mutations](examples/test-project/src/mutations.ts)** - Payment authorization, capture, and refund
- **[Complete Payment Lifecycle](examples/test-project/src/mutations.ts)** - End-to-end payment processing

### Authentication & Security
- **[Authentication Patterns](examples/test-project/src/auth.ts)** - OAuth setup and token management
- **[Token Refresh](examples/test-project/src/token-refresh.ts)** - Advanced token handling strategies

### Running Examples

```bash
cd examples/test-project
npm install
cp .env.example .env  # Add your credentials
npm run test:query    # Test query operations
npm run test:auth     # Test authentication
npm run test:mutations # Test payment operations
```

## Configuration

### Environment Variables

Create a `.env` file in your project:

```env
TESOURO_CLIENT_ID=your-client-id
TESOURO_CLIENT_SECRET=your-client-secret
TESOURO_ENDPOINT=https://api.sandbox.tesouro.com/graphql
TESOURO_TOKEN_ENDPOINT=https://api.sandbox.tesouro.com/openid/connect/token
```

### Client Configuration

```typescript
const client = new TesouroClient({
  // Required
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  
  // Optional
  endpoint: 'https://api.sandbox.tesouro.com/graphql', // Defaults to sandbox
  tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token', // Auto-derived
  timeout: 30000, // Request timeout in ms
  headers: {
    'X-API-Version': '2024-01-01' // Default headers
  }
});
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```typescript
import { GraphQLError, NetworkError, SdkError } from '@tesouro/tesouro-sdk-for-node';

try {
  const result = await client.paymentTransactions(variables);
  
  if (result.errors?.length) {
    console.log('GraphQL validation errors:', result.errors);
  }
  
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network issue:', error.message);
  } else if (error instanceof GraphQLError) {
    console.error('API errors:', error.errors);
  } else if (error instanceof SdkError) {
    console.error('SDK error:', error.message);
  }
}
```

## TypeScript Support

The SDK is built with TypeScript and provides full type safety:

```typescript
import type {
  TesouroClient,
  QueryPaymentTransactionsArgs,
  PaymentTransactionCollection,
  CustomerInitiatedTransactionAuthorizationInput
} from '@tesouro/tesouro-sdk-for-node';

// All types are automatically generated from the GraphQL schema
const variables: QueryPaymentTransactionsArgs = {
  input: {
    paging: { skip: 0, take: 10 },
    where: {
      transactionActivityDate: {
        gte: '2024-01-01',
        lte: '2024-01-31'
      }
    }
  }
};
```

## Advanced Features

### Concurrent Requests

```typescript
const [transactions, summaries] = await Promise.all([
  client.paymentTransactions(transactionVariables),
  client.paymentTransactionSummaries(summaryVariables)
]);
```

### Custom Request Options

```typescript
const result = await client.paymentTransactions(variables, {
  timeout: 10000,
  headers: {
    'X-Request-ID': 'unique-request-id'
  }
});
```

### Token Management

```typescript
// Automatic refresh (recommended)
const client = new TesouroClient(config);

// Access to low-level auth if needed
import { AuthManager } from '@tesouro/tesouro-sdk-for-node';
const authManager = new AuthManager(authConfig);
```

## Development

### Prerequisites

- Node.js 16+ 
- npm 7+
- TypeScript 4.8+

### Setup

```bash
git clone https://github.com/tesouro/tesouro-sdk-for-node.git
cd tesouro-sdk-for-node
npm install
```

### Scripts

```bash
npm run build          # Build the project
npm run test           # Run all tests
npm run test:unit      # Run unit tests only
npm run test:integration # Run integration tests
npm run lint           # Lint code
npm run typecheck      # Type checking
npm run docs           # Generate documentation
```

### Testing

The SDK includes comprehensive test suites:

- **Unit Tests** - Fast, isolated component testing
- **Integration Tests** - Real API testing with mocked responses
- **Example Tests** - Verification that all examples work correctly

```bash
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 **Documentation**: [docs/](docs/) and [Tesouro API Docs](https://docs.tesouro.com)
- 📧 **Email**: support@tesouro.com

---

Made with ❤️ by the Tesouro team