/**
 * Simple Query Execution Example
 * 
 * This example demonstrates how to execute GraphQL queries using the 
 * generated client methods and TypeScript types from the Tesouro SDK.
 */

import { 
  TesouroClient, 
  type PaymentTransactionCollection,
  type QueryPaymentTransactionsArgs,
  type PaymentTransactionFilterInput,
  type PagingInput,
  type GraphQLResult
} from '../../src/index';

// Setup client using the generated client
function setupClient(): TesouroClient {
  return new TesouroClient({
    clientId: process.env.TESOURO_CLIENT_ID!,
    clientSecret: process.env.TESOURO_CLIENT_SECRET!,
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token'
  });
}

// Example 1: Simple payment transactions query with minimal parameters
export async function getRecentPaymentTransactions() {
  const client = setupClient();

  try {
    // Define pagination
    const paging: PagingInput = {
      skip: 0,
      take: 10
    };

    // Define basic filter - API requires at least one of: TransactionActivityDate, PaymentId, TransactionReference, TransactionId
    // Date range requires both gte and lte
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: thirtyDaysAgo,
        lte: today
      }
    };

    // Create the query variables using the generated types
    const variables: QueryPaymentTransactionsArgs = {
      input: {
        paging,
        where
      }
    };

    // Execute the query using the generated method
    const result: GraphQLResult<{ paymentTransactions: PaymentTransactionCollection }> = 
      await client.paymentTransactions(variables);

    if (result.data?.paymentTransactions) {
      const transactions = result.data.paymentTransactions;
      console.log(`Found ${transactions.items.length} transactions`);
      console.log('Transactions:', JSON.stringify(transactions.items, null, 2));
      console.log('Has next page:', transactions.pageInfo.hasNextPage);
      return transactions;
    } else {
      console.error('No data returned from query');
      return null;
    }

  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
}

// Example 2: Filtered payment transactions query
export async function getFilteredPaymentTransactions() {
  const client = setupClient();

  try {
    // Define pagination for larger result set
    const paging: PagingInput = {
      skip: 0,
      take: 25
    };

    // Create a filter for specific transaction criteria
    const where: PaymentTransactionFilterInput = {
      // Filter by transaction activity date (last 30 days)
      transactionActivityDate: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        lte: new Date().toISOString().split('T')[0] // Today
      },
      // Filter by transaction type
      transactionType: {
        in: ['AUTHORIZATION', 'SALE']
      },
      // Filter by payment brand
      paymentBrand: {
        in: ['VISA', 'MASTERCARD']
      }
    };

    const variables: QueryPaymentTransactionsArgs = {
      input: {
        paging,
        where
      }
    };

    const result = await client.paymentTransactions(variables);

    if (result.data?.paymentTransactions) {
      const transactions = result.data.paymentTransactions;
      console.log(`Found ${transactions.items.length} filtered transactions`);
      
      // Log some details about each transaction
      transactions.items.forEach(transaction => {
        console.log(`Transaction ${transaction.id}:`);
        console.log(`  Response: ${transaction.processorResponseMessage}`);
        console.log(`  Type: ${transaction.transactionType}`);
        console.log(`  Response Type: ${transaction.responseType || 'N/A'}`);
        console.log(`  Date: ${transaction.transactionDateTime}`);
      });

      return transactions;
    } else {
      console.error('No data returned from query');
      return null;
    }

  } catch (error) {
    console.error('Filtered query failed:', error);
    throw error;
  }
}

// Example 3: Paginated query to get all transactions
export async function getAllPaymentTransactionsPaginated() {
  const client = setupClient();
  const allTransactions: any[] = [];
  let skip = 0;
  const take = 50;
  let hasMore = true;

  try {
    while (hasMore) {
      console.log(`Fetching transactions ${skip} to ${skip + take}...`);

      const paging: PagingInput = { skip, take };
      const where: PaymentTransactionFilterInput = {
        transactionActivityDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
          lte: new Date().toISOString().split('T')[0] // Today
        }
      };

      const variables: QueryPaymentTransactionsArgs = {
        input: { paging, where }
      };

      const result = await client.paymentTransactions(variables);

      if (result.data?.paymentTransactions) {
        const transactions = result.data.paymentTransactions;
        allTransactions.push(...transactions.items);
        
        console.log(`Retrieved ${transactions.items.length} transactions in this batch`);
        
        // Check if there are more pages
        hasMore = transactions.pageInfo.hasNextPage;
        skip += take;

        // Safety limit to prevent infinite loops in examples
        if (allTransactions.length >= 200) {
          console.log('Stopping at 200 transactions for example purposes');
          break;
        }
      } else {
        console.log('No more transactions or query failed');
        hasMore = false;
      }
    }

    console.log(`Total transactions retrieved: ${allTransactions.length}`);
    return allTransactions;

  } catch (error) {
    console.error('Paginated query failed:', error);
    throw error;
  }
}

// Example 4: Query with custom headers and timeout
export async function getPaymentTransactionsWithCustomOptions() {
  const client = setupClient();

  try {
    const variables: QueryPaymentTransactionsArgs = {
      input: {
        paging: { skip: 0, take: 10 },
        where: {
          transactionActivityDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
            lte: new Date().toISOString().split('T')[0] // Today
          }
        }
      }
    };

    // Use custom request options
    const result = await client.paymentTransactions(variables, {
      headers: {
        'X-Request-ID': `req-${Date.now()}`,
        'X-Client-Version': '1.0.0'
      },
      timeout: 15000, // 15 seconds
      autoRefresh: true, // Automatically refresh tokens if needed
      includeAuth: true  // Include authentication headers
    });

    if (result.data?.paymentTransactions) {
      console.log('Query with custom options successful');
      return result.data.paymentTransactions;
    }

  } catch (error) {
    console.error('Custom options query failed:', error);
    throw error;
  }
}

// Example 5: Error handling with typed responses
export async function queryWithProperErrorHandling() {
  const client = setupClient();

  try {
    const variables: QueryPaymentTransactionsArgs = {
      input: {
        paging: { skip: 0, take: 5 },
        where: {
          // Include required filter + potentially problematic acceptor ID
          transactionActivityDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            lte: new Date().toISOString().split('T')[0] // Today
          },
          acceptorId: {
            eq: '00000000-0000-0000-0000-000000000000'
          }
        }
      }
    };

    const result = await client.paymentTransactions(variables);

    // Note: GraphQL errors are handled by the SDK and thrown as exceptions
    // If we reach this point, the query was successful

    // Process successful data
    if (result.data?.paymentTransactions) {
      console.log('Query completed successfully');
      return result.data.paymentTransactions;
    }

  } catch (error) {
    console.error('Query execution failed:', error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        console.error('Authentication error - check credentials');
      } else if (error.message.includes('403')) {
        console.error('Authorization error - insufficient permissions');
      } else if (error.message.includes('timeout')) {
        console.error('Request timeout - try increasing timeout value');
      }
    }
    
    throw error;
  }
}

// Example usage function
export async function runQueryExamples() {
  console.log('🧪 Testing Payment Transactions Queries...\n');

  try {
    // Example 1: Basic query
    console.log('📝 Test 1: Recent payment transactions...');
    await getRecentPaymentTransactions();
    console.log('\n---\n');

    // Example 2: Filtered query
    console.log('📝 Test 2: Filtered payment transactions...');
    await getFilteredPaymentTransactions();
    console.log('\n---\n');

    // Example 3: Paginated query
    console.log('📝 Test 3: Paginated payment transactions...');
    await getAllPaymentTransactionsPaginated();
    console.log('\n---\n');

    // Example 4: Custom options
    console.log('📝 Test 4: Query with custom options...');
    await getPaymentTransactionsWithCustomOptions();
    console.log('\n---\n');

    // Example 5: Error handling
    console.log('📝 Test 5: Error handling example...');
    await queryWithProperErrorHandling();

    console.log('\n🎉 All query examples completed!');

  } catch (error) {
    console.error('❌ Query examples failed:', error);
  }
}