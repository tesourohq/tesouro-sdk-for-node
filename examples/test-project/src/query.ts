#!/usr/bin/env tsx

/**
 * Simple Query Test
 * 
 * Tests the paymentTransactions query using generated types and methods
 */

import 'dotenv/config';
import { 
  TesouroClient, 
  type PaymentTransactionCollection,
  type QueryPaymentTransactionsArgs,
  type PaymentTransactionFilterInput,
  type PagingInput,
  type GraphQLResult
} from '@tesouro/tesouro-sdk-for-node';

function setupClient(): TesouroClient {
  const clientId = process.env.TESOURO_CLIENT_ID;
  const clientSecret = process.env.TESOURO_CLIENT_SECRET;
  const endpoint = process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql';
  const tokenEndpoint = process.env.TESOURO_TOKEN_ENDPOINT || 'https://api.sandbox.tesouro.com/openid/connect/token';

  if (!clientId || !clientSecret) {
    throw new Error('Missing required environment variables. Please check .env file.');
  }

  return new TesouroClient({
    clientId,
    clientSecret,
    endpoint,
    tokenEndpoint
  });
}

async function testPaymentTransactionsQuery() {
  console.log('🧪 Testing Payment Transactions Query...\n');

  try {
    const client = setupClient();

    // Test 1: Basic query
    console.log('📝 Test 1: Basic payment transactions query...');
    try {
      const paging: PagingInput = {
        skip: 0,
        take: 10
      };

      // API requires at least one of: TransactionActivityDate, PaymentId, TransactionReference, TransactionId
      // Date range requires both gte and lte
      // Date scalar expects YYYY-MM-DD format (string)
      const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const where: PaymentTransactionFilterInput = {
        transactionActivityDate: {
          gte: thirtyDaysAgo,
          lte: today
        }
      };

      const variables: QueryPaymentTransactionsArgs = {
        input: {
          paging,
          where
        }
      };

      console.log('Executing query with variables:', JSON.stringify(variables, null, 2));

      const result: GraphQLResult<{ paymentTransactions: PaymentTransactionCollection }> = 
        await client.paymentTransactions(variables);

      if (result.data?.paymentTransactions) {
        const transactions = result.data.paymentTransactions;
        console.log('✅ Query successful');
        console.log('📊 Response data:', JSON.stringify(transactions, null, 2));
        console.log(`📄 Has next page: ${transactions.pageInfo.hasNextPage}`);
        console.log(`📄 Has previous page: ${transactions.pageInfo.hasPreviousPage}`);

        // Check if items array exists (the generated query might not include items)
        if (transactions.items && Array.isArray(transactions.items)) {
          console.log(`📊 Found ${transactions.items.length} transactions`);
          
          // Show first transaction details if available
          if (transactions.items.length > 0) {
            const firstTransaction = transactions.items[0];
            console.log('\n💳 First transaction details:');
            console.log(`  Transaction data:`, firstTransaction);
          }
        } else {
          console.log('⚠️  Items array not available in response (check generated query)');
        }
      } else {
        console.log('❓ No data returned');
      }
    } catch (error) {
      console.log('❌ Basic query failed:', error);
    }

    console.log('\n---\n');

    // Test 2: Query with custom headers
    console.log('📝 Test 2: Query with custom headers...');
    try {
      const variables: QueryPaymentTransactionsArgs = {
        input: {
          paging: { skip: 0, take: 3 },
          where: {
            transactionActivityDate: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
              lte: new Date().toISOString().split('T')[0] // Today
            }
          }
        }
      };

      const result = await client.paymentTransactions(variables, {
        headers: {
          'X-Request-ID': `test-req-${Date.now()}`,
          'X-Client-Version': '1.0.0'
        },
        timeout: 10000
      });

      if (result.data?.paymentTransactions) {
        console.log('✅ Query with custom headers successful');
        console.log(`📊 Retrieved ${result.data.paymentTransactions.items.length} transactions`);
        
        // Check response headers
        console.log('\n🔍 Response headers analysis:');
        const responseHeaders = result.response.headers;
        
        // Show key response headers
        const contentType = responseHeaders.get('content-type');
        const authBy = responseHeaders.get('x-authenticated-by');
        const date = responseHeaders.get('date');
        const contentLength = responseHeaders.get('content-length');
        
        console.log(`  📄 Content-Type: ${contentType}`);
        console.log(`  🔐 Authentication: ${authBy}`);
        console.log(`  📅 Date: ${date}`);
        console.log(`  📏 Content-Length: ${contentLength} bytes`);
        
        // Note about custom headers (useful for documentation)
        console.log('\n  📝 Note: Custom request headers are sent but not echoed back by the API');
      } else {
        console.log('❓ No custom headers data returned');
      }
    } catch (error) {
      console.log('❌ Custom headers query failed:', error);
    }

    console.log('\n---\n');

    // Test 3: Invalid filter values (error handling demonstration)
    console.log('📝 Test 3: Invalid filter values (error demonstration)...');
    try {
      // This will demonstrate API validation errors by providing incomplete date range
      // The API requires both gte and lte for transactionActivityDate, but we'll only provide lte
      const invalidWhere = {
        transactionActivityDate: {
          lte: new Date().toISOString().split('T')[0] // Only providing lte, missing required gte
          // Missing gte field - this should cause a validation error
        }
      } as PaymentTransactionFilterInput;

      const variables: QueryPaymentTransactionsArgs = {
        input: {
          paging: { skip: 0, take: 10 },
          where: invalidWhere
        }
      };

      console.log('🚫 Attempting query with incomplete date range (missing gte field)...');
      console.log('📋 Filter being sent:', JSON.stringify(invalidWhere, null, 2));
      
      const result = await client.paymentTransactions(variables);
      
      // This should not execute due to API validation error
      console.log('❓ Unexpected success - API accepted incomplete date range:', result.data);
      
    } catch (error) {
      console.log('✅ Expected error caught - demonstrating API validation:');
      
      if (error instanceof Error) {
        console.log(`  🔍 Error Type: ${error.constructor.name}`);
        console.log(`  📝 Error Message: ${error.message}`);
        
        // Check if it's a validation error related to date range
        if (error.message.includes('gte') || error.message.includes('date') || error.message.includes('range')) {
          console.log('  ✅ This is a date range validation error as expected');
          console.log('  📚 This demonstrates how the SDK handles API business rule violations');
        }
        
        // Show additional error properties if available (GraphQL errors)
        if ('errors' in error && Array.isArray((error as any).errors)) {
          console.log('  📋 API Validation Errors:');
          (error as any).errors.forEach((err: any, index: number) => {
            console.log(`    ${index + 1}. ${err.message || err}`);
            if (err.extensions) {
              console.log(`       Extensions:`, JSON.stringify(err.extensions, null, 6));
            }
          });
        }
        
        console.log('  💡 Tip: Always provide both gte and lte when filtering by transactionActivityDate');
      } else {
        console.log('  ❓ Unknown error type:', error);
      }
    }

    console.log('\n🎉 All payment transaction query tests completed!');

  } catch (error) {
    console.error('❌ Query test setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testPaymentTransactionsQuery();
}

export { testPaymentTransactionsQuery };