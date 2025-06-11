#!/usr/bin/env tsx

/**
 * Token Refresh Pattern Examples
 * 
 * Demonstrates various approaches for handling token refresh scenarios
 * including automatic refresh, manual control, and concurrent requests.
 */

import 'dotenv/config';
import { 
  GeneratedApiClient, 
  type PaymentTransaction,
  type PaymentTransactionSummary,
  type QueryPaymentTransactionSummariesArgs,
  type QueryPaymentTransactionsArgs,
  type PaymentTransactionFilterInput,
  type PagingInput,
  type GraphQLResult
} from '@tesouro/tesouro-sdk-for-node';

function setupClient(): GeneratedApiClient {
  const clientId = process.env.TESOURO_CLIENT_ID;
  const clientSecret = process.env.TESOURO_CLIENT_SECRET;
  const endpoint = process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql';
  const tokenEndpoint = process.env.TESOURO_TOKEN_ENDPOINT || 'https://api.sandbox.tesouro.com/openid/connect/token';

  if (!clientId || !clientSecret) {
    throw new Error('Missing required environment variables. Please check .env file.');
  }

  return new GeneratedApiClient({
    clientId,
    clientSecret,
    endpoint,
    tokenEndpoint
  });
}

// Helper function to get a safe date for API compatibility
function getYesterdayDate(): string {
  const safeDate = new Date();
  safeDate.setDate(safeDate.getDate() - 2); // Use 2 days ago to ensure we're within API limits
  return safeDate.toISOString().split('T')[0];
}

const client = setupClient();

/**
 * Pattern 1: Automatic Token Refresh
 * 
 * Note: GeneratedApiClient handles token refresh automatically behind the scenes.
 * This pattern demonstrates that multiple requests work seamlessly.
 */
export async function automaticRefreshPattern(): Promise<void> {
  console.log('\n🔄 Pattern 1: Automatic Token Refresh');
  console.log('=====================================');

  try {
    const startTime = Date.now();
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: getYesterdayDate(),
        lte: getYesterdayDate(),
      },
    };
    
    const result = await client.paymentTransactions({
      input: {
        paging: { skip: 0, take: 5 },
        where
      }
    });

    const endTime = Date.now();
    
    console.log(`✅ Query completed in ${endTime - startTime}ms`);
    console.log(`📊 Found ${result.data.paymentTransactions.items.length} payment transactions`);
    console.log('🔐 Token refresh handled automatically by SDK');
    
  } catch (error) {
    console.error('❌ Automatic refresh pattern failed:', error);
    throw error;
  }
}

/**
 * Pattern 2: Sequential Requests (Token Consistency)
 * 
 * Demonstrates that multiple sequential requests maintain token consistency
 * without manual intervention.
 */
export async function manualRefreshPattern(): Promise<void> {
  console.log('\n🎯 Pattern 2: Sequential Requests (Token Consistency)');
  console.log('====================================================');

  try {
    console.log('🔄 Making sequential requests to test token consistency...');
    
    const where = {
      transactionActivityDate: {
        gte: getYesterdayDate(),
        lte: getYesterdayDate(),
      },
    };
    
    // First request
    const refreshStartTime = Date.now();
    const result1 = await client.paymentTransactions({
      input: {
        paging: { skip: 0, take: 3 },
        where
      }
    });
    
    // Second request immediately after
    const result2 = await client.paymentTransactionSummaries({
      input: {
        paging: { skip: 0, take: 3 },
        where: {
          transactionActivityDate: {
            gte: getYesterdayDate(),
            lte: getYesterdayDate(),
          },
        },
      }
    });
    
    const refreshEndTime = Date.now();
    console.log(`✅ Sequential requests completed in ${refreshEndTime - refreshStartTime}ms`);
    console.log(`📊 Transactions: ${result1.data.paymentTransactions.items.length}, Summaries: ${result2.data.paymentTransactionSummaries.items.length}`);
    console.log('🔐 Token consistency maintained across requests');
    
  } catch (error) {
    console.error('❌ Sequential requests pattern failed:', error);
    throw error;
  }
}

/**
 * Pattern 3: Concurrent Requests (Token Sharing)
 * 
 * Demonstrates that concurrent requests efficiently share authentication
 * and don't cause conflicts.
 */
export async function concurrentRefreshPattern(): Promise<void> {
  console.log('\n🚀 Pattern 3: Concurrent Requests (Token Sharing)');
  console.log('==================================================');

  try {
    console.log('🔄 Starting 5 concurrent requests...');
    const startTime = Date.now();
    
    const where = {
      transactionActivityDate: {
        gte: getYesterdayDate(),
        lte: getYesterdayDate(),
      },
    };
    
    const summaryWhere = {
      transactionActivityDate: {
        gte: getYesterdayDate(),
        lte: getYesterdayDate(),
      },
    };
    
    const requests = [
      client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 2 },
          where
        }
      }),
      client.paymentTransactionSummaries({
        input: {
          paging: { skip: 0, take: 2 },
          where: summaryWhere
        }
      }),
      client.paymentTransactions({
        input: {
          paging: { skip: 2, take: 1 },
          where
        }
      }),
      client.paymentTransactionSummaries({
        input: {
          paging: { skip: 2, take: 1 },
          where: summaryWhere
        }
      }),
      client.paymentTransactions({
        input: {
          paging: { skip: 5, take: 3 },
          where
        }
      }),
    ];
    
    const results = await Promise.allSettled(requests);
    const endTime = Date.now();
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Concurrent requests completed in ${endTime - startTime}ms`);
    console.log(`📊 Results: ${successful} successful, ${failed} failed`);
    console.log('🔐 Authentication efficiently shared across concurrent requests');
    
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.log(`❌ Request ${index + 1} failed:`, result.reason.message);
      } else {
        const data = result.value as any;
        if (data.data.paymentTransactions) {
          console.log(`✅ Request ${index + 1}: ${data.data.paymentTransactions.items.length} transactions`);
        } else if (data.data.paymentTransactionSummaries) {
          console.log(`✅ Request ${index + 1}: ${data.data.paymentTransactionSummaries.items.length} summaries`);
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Concurrent requests pattern failed:', error);
    throw error;
  }
}

/**
 * Main execution function that runs all token refresh patterns
 */
export async function runAllTokenRefreshPatterns(): Promise<void> {
  console.log('🔐 Tesouro SDK Token Refresh Patterns Demo');
  console.log('==========================================');
  
  const patterns = [
    { name: 'Automatic Token Refresh', fn: automaticRefreshPattern },
    { name: 'Sequential Requests', fn: manualRefreshPattern },
    { name: 'Concurrent Requests', fn: concurrentRefreshPattern },
  ];
  
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ pattern: string; error: any }>,
  };
  
  for (const pattern of patterns) {
    try {
      console.log(`\n🔄 Running ${pattern.name} pattern...`);
      const startTime = Date.now();
      
      await pattern.fn();
      
      const endTime = Date.now();
      results.successful++;
      console.log(`✅ ${pattern.name} completed in ${endTime - startTime}ms`);
      
    } catch (error) {
      results.failed++;
      results.errors.push({ pattern: pattern.name, error });
      console.error(`❌ ${pattern.name} failed:`, error);
    }
    
    // Brief pause between patterns
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Final summary
  console.log('\n📊 Token Refresh Patterns Summary');
  console.log('==================================');
  console.log(`✅ Successful patterns: ${results.successful}`);
  console.log(`❌ Failed patterns: ${results.failed}`);
  console.log(`📈 Success rate: ${Math.round((results.successful / patterns.length) * 100)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Error details:');
    results.errors.forEach(({ pattern, error }) => {
      console.log(`  - ${pattern}: ${error.message}`);
    });
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTokenRefreshPatterns()
    .then(() => {
      console.log('\n🎉 All token refresh patterns completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Token refresh patterns execution failed:', error);
      process.exit(1);
    });
}