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

## Concurrent Requests Patterns (`concurrent-requests.ts`)

Demonstrates 5 comprehensive approaches for handling concurrent requests efficiently:

### 1. 🔥 Parallel Query Execution
Execute multiple independent queries simultaneously:
- Multiple queries run at the same time
- Shared authentication across requests
- Performance metrics and timing
- Best for: Independent data fetching operations

### 2. 📦 Request Batching with Controlled Concurrency
Process large sets of requests in smaller, manageable batches:
- Configurable batch sizes
- Prevents server overload
- Rate limiting friendly
- Progress tracking
- Best for: Large volumes of requests

### 3. 🔀 Mixed Query Types with Error Handling
Handle different types of requests concurrently with graceful error handling:
- Promise.allSettled for fault tolerance
- Mixed query and mutation operations
- Individual request failure handling
- Success rate analytics
- Best for: Diverse operations with varying reliability

### 4. 🏁 Sequential vs Concurrent Performance Comparison
Demonstrates the performance benefits of concurrent execution:
- Side-by-side timing comparison
- Performance improvement metrics
- Speed-up factor analysis
- Data consistency verification
- Best for: Performance optimization decisions

### 5. 🛡️ Resilient Concurrent Requests with Retry Logic
Handle failures in concurrent scenarios with automatic recovery:
- Exponential backoff retry strategy
- Per-request failure tracking
- Configurable retry limits
- Detailed failure analysis
- Best for: Production environments with network instability

## Usage

```bash
# Run all concurrent request patterns
npx tsx examples/patterns/concurrent-requests.ts

# Or import specific patterns
import { parallelQueryExecution, requestBatching } from './examples/patterns/concurrent-requests';
```

## Token Refresh Patterns (`token-refresh.ts`)

Demonstrates 6 comprehensive token management strategies for robust authentication:

### 1. 🔄 Automatic Token Refresh
Built-in SDK functionality for seamless token management:
- Transparent token refresh
- Expiration buffer handling
- Zero-intervention authentication
- Best for: Standard production applications

### 2. 🎯 Manual Token Refresh Control
Explicit control over when and how tokens are refreshed:
- Force refresh capabilities
- Token status monitoring
- Refresh timing control
- Best for: Applications requiring precise auth control

### 3. 🚀 Concurrent Requests During Token Refresh
Handle multiple requests during token refresh scenarios:
- Single refresh for multiple waiting requests
- Concurrent request coordination
- Thread-safe token management
- Best for: High-concurrency applications

### 4. 🛡️ Token Refresh Error Handling and Fallback
Robust error handling when authentication fails:
- Retry logic with exponential backoff
- Fallback authentication strategies
- Error classification and handling
- Best for: Applications requiring high availability

### 5. 📊 Token Lifecycle Monitoring
Monitor and track token status throughout its lifecycle:
- Real-time token status tracking
- Expiration monitoring
- Lifecycle event handling
- Best for: Applications requiring auth visibility

### 6. ⚡ Proactive Token Refresh Strategy
Refresh tokens before they expire to prevent request delays:
- Predictive refresh timing
- Request delay prevention
- Batch request optimization
- Best for: Performance-critical applications

## Usage

```bash
# Run all token refresh patterns
npx tsx examples/patterns/token-refresh.ts

# Or import specific patterns
import { automaticRefreshPattern, proactiveRefreshPattern } from './examples/patterns/token-refresh';
```