# SDK Usage Patterns

This directory contains advanced usage patterns and best practices for the Tesouro SDK.

## Pagination Patterns (`pagination.ts`)

Demonstrates 5 comprehensive pagination strategies for handling large datasets efficiently:

### 1. 🔢 Simple Manual Pagination
Basic pagination where you manually control page navigation:
- Explicit page management
- Clear loop control
- Easy to understand and debug
- Best for: Simple cases where you need full control

### 2. 🔄 Auto-Pagination Iterator  
Uses async generators for seamless iteration through all pages:
- Automatic page management
- Memory efficient
- Clean, readable code
- Best for: When you need to process all data

### 3. 🌊 Streaming Pagination
Processes items as they arrive without storing all in memory:
- Real-time processing
- Low memory footprint
- Interruptible processing
- Best for: Large datasets, real-time processing

### 4. 📦 Bulk Fetching with Optimization
Fetches larger pages for better performance:
- Reduced API calls
- Better throughput
- Memory optimization hints
- Performance metrics
- Best for: High-volume data processing

### 5. 🛡️ Advanced Pagination with Error Recovery
Robust pagination with retry logic and error handling:
- Exponential backoff retry
- Error recovery strategies
- Resilient to network issues
- Comprehensive error logging
- Best for: Production environments, unreliable networks

## Usage

```bash
# Run all pagination patterns
npx tsx examples/patterns/pagination.ts

# Or import specific patterns
import { simpleManualPagination, createPaginatedIterator } from './examples/patterns/pagination';
```

## Key Features Demonstrated

- **Type Safety**: Full TypeScript support with generated types
- **Error Handling**: Comprehensive error scenarios and recovery
- **Performance**: Optimized for different use cases
- **Memory Management**: Efficient memory usage for large datasets
- **Real-world Patterns**: Production-ready code examples

## Environment Setup

Create a `.env` file with:
```
TESOURO_CLIENT_ID=your_client_id
TESOURO_CLIENT_SECRET=your_client_secret
TESOURO_ENDPOINT=https://api.sandbox.tesouro.com/graphql
TESOURO_TOKEN_ENDPOINT=https://api.sandbox.tesouro.com/openid/connect/token
```

## API Structure

The examples work with the GraphQL schema's pagination structure:

```graphql
type PaymentTransactionCollection {
  items: [PaymentTransaction!]!
  pageInfo: PageInfo!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

input PagingInput {
  skip: Int!
  take: Int!
}
```

All patterns use the `paymentTransactions` query which requires date range filtering and demonstrates real-world pagination scenarios.