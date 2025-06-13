#!/usr/bin/env tsx

/**
 * Token Refresh Pattern Examples
 * 
 * Demonstrates comprehensive token management strategies including:
 * - Automatic refresh with retry logic
 * - Manual refresh control
 * - Concurrent request handling during refresh
 * - Error handling and fallback strategies
 * - Token lifecycle monitoring
 */

import 'dotenv/config';
import { 
  TesouroClient, 
  type PaymentTransaction,
  type PaymentTransactionSummary,
  type QueryPaymentTransactionSummariesArgs,
  type QueryPaymentTransactionsArgs,
  type PaymentTransactionFilterInput,
  type PagingInput,
  type GraphQLResult
} from '@tesouro/tesouro-sdk-for-node';

// Helper function to get a safe date for API compatibility
function getSafeDateForAPI(): string {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 2); // 2 days ago to avoid timezone issues
  return endDate.toISOString().split('T')[0];
}

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

// Create a single client instance for patterns that need consistent auth state
const client = setupClient();

/**
 * Pattern 1: Automatic Token Refresh
 * 
 * The TesouroClient automatically handles token refresh when tokens are near expiration.
 * This is the most common pattern for production applications.
 */
export async function automaticRefreshPattern(): Promise<void> {
  console.log('\n🔄 Pattern 1: Automatic Token Refresh');
  console.log('=====================================');

  try {
    // The client will automatically refresh tokens when needed
    const startTime = Date.now();
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: getSafeDateForAPI(),
        lte: getSafeDateForAPI(),
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
export async function sequentialRequestPattern(): Promise<void> {
  console.log('\n🎯 Pattern 2: Sequential Requests (Token Consistency)');
  console.log('====================================================');

  try {
    console.log('🔄 Making sequential requests to test token consistency...');
    
    const where = {
      transactionActivityDate: {
        gte: getSafeDateForAPI(),
        lte: getSafeDateForAPI(),
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
            gte: getSafeDateForAPI(),
            lte: getSafeDateForAPI(),
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
        gte: getSafeDateForAPI(),
        lte: getSafeDateForAPI(),
      },
    };
    
    const summaryWhere = {
      transactionActivityDate: {
        gte: getSafeDateForAPI(),
        lte: getSafeDateForAPI(),
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
 * Pattern 4: Token Refresh Error Handling and Fallback
 * 
 * Demonstrates robust error handling when token refresh fails,
 * including retry logic and graceful degradation.
 */
export async function errorHandlingPattern(): Promise<void> {
  console.log('\n🛡️ Pattern 4: Token Refresh Error Handling');
  console.log('===========================================');

  // Create a client with invalid credentials to simulate auth failures
  const testClient = new TesouroClient({
    clientId: 'invalid-client-id',
    clientSecret: 'invalid-client-secret',
    endpoint: process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: process.env.TESOURO_TOKEN_ENDPOINT || 'https://api.sandbox.tesouro.com/openid/connect/token'
  });

  try {
    console.log('🔄 Attempting request with invalid credentials...');
    
    const result = await testClient.paymentTransactions({
      input: {
        paging: { skip: 0, take: 1 },
        where: {
          transactionActivityDate: {
            gte: getSafeDateForAPI(),
            lte: getSafeDateForAPI(),
          },
        }
      }
    });
    
    // This shouldn't happen with invalid credentials
    console.log('⚠️ Unexpected success with invalid credentials');
    
  } catch (error: any) {
    console.log('❌ Expected authentication error occurred');
    console.log(`🔍 Error type: ${error.constructor.name}`);
    console.log(`📝 Error message: ${error.message}`);
    
    // Check if error is retryable based on error type
    if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
      console.log('🔄 Error is authentication-related - could implement fallback logic');
    } else {
      console.log('🚫 Error is not retryable - permanent failure');
    }
    
    // Demonstrate fallback to valid client
    console.log('\n🔄 Falling back to valid client...');
    try {
      const fallbackResult = await client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 1 },
          where: {
            transactionActivityDate: {
              gte: getSafeDateForAPI(),
              lte: getSafeDateForAPI(),
            },
          }
        }
      });
      
      console.log(`✅ Fallback successful: ${fallbackResult.data.paymentTransactions.items.length} transactions`);
      
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
    }
  }
}

/**
 * Pattern 5: Request Retry with Exponential Backoff
 * 
 * Demonstrates implementing retry logic with exponential backoff for
 * handling temporary authentication failures.
 */
export async function retryWithBackoffPattern(): Promise<void> {
  console.log('\n🔄 Pattern 5: Request Retry with Exponential Backoff');
  console.log('===================================================');

  try {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second
    
    // Function to make request with retry logic
    const makeRequestWithRetry = async (attempt = 1): Promise<any> => {
      try {
        console.log(`🔄 Attempt ${attempt} to fetch payment transactions...`);
        
        const result = await client.paymentTransactions({
          input: {
            paging: { skip: 0, take: 3 },
            where: {
              transactionActivityDate: {
                gte: getSafeDateForAPI(),
                lte: getSafeDateForAPI(),
              },
            }
          }
        });
        
        console.log(`✅ Request successful on attempt ${attempt}`);
        return result;
        
      } catch (error: any) {
        console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
        
        if (attempt >= maxRetries) {
          console.log(`🚫 Max retries (${maxRetries}) exceeded`);
          throw error;
        }
        
        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt - 1);
        // Add jitter to prevent thundering herd
        const jitter = Math.random() * 0.25 * delay;
        const totalDelay = Math.round(delay + jitter);
        
        console.log(`⏳ Retrying in ${totalDelay}ms (exponential backoff with jitter)...`);
        await new Promise(resolve => setTimeout(resolve, totalDelay));
        
        return makeRequestWithRetry(attempt + 1);
      }
    };
    
    console.log('🚀 Starting request with retry logic...');
    const startTime = Date.now();
    
    const result = await makeRequestWithRetry();
    
    const endTime = Date.now();
    console.log(`✅ Request completed in ${endTime - startTime}ms`);
    console.log(`📊 Retrieved ${result.data.paymentTransactions.items.length} transactions`);
    
  } catch (error) {
    console.error('❌ Retry with backoff pattern failed:', error);
    throw error;
  }
}

/**
 * Pattern 6: Proactive Token Management Simulation
 * 
 * Demonstrates implementing a proactive refresh strategy that makes
 * multiple requests over time to demonstrate token management.
 */
export async function proactiveTokenManagementPattern(): Promise<void> {
  console.log('\n⚡ Pattern 6: Proactive Token Management Simulation');
  console.log('=================================================');

  try {
    console.log('🔍 Simulating long-running process with multiple requests...');
    
    // Make requests over time to demonstrate token management
    const totalRequests = 5;
    const timeBetweenRequests = 2000; // 2 seconds
    
    for (let i = 1; i <= totalRequests; i++) {
      console.log(`\n📊 Request ${i}/${totalRequests} at ${new Date().toLocaleTimeString()}:`);
      
      try {
        const requestStart = Date.now();
        
        const result = await client.paymentTransactionSummaries({
          input: {
            paging: { skip: 0, take: 2 },
            where: {
              transactionActivityDate: {
                gte: getSafeDateForAPI(),
                lte: getSafeDateForAPI(),
              },
            }
          }
        });
        
        const requestTime = Date.now() - requestStart;
        console.log(`✅ Request ${i} successful in ${requestTime}ms: ${result.data.paymentTransactionSummaries.items.length} summaries`);
        
        // Show request timing pattern
        if (requestTime > 1000) {
          console.log('🔄 Longer response time - likely included token refresh');
        } else {
          console.log('⚡ Fast response - using cached token');
        }
        
      } catch (error) {
        console.error(`❌ Request ${i} failed:`, error);
      }
      
      // Wait before next request (except for last one)
      if (i < totalRequests) {
        console.log(`⏳ Waiting ${timeBetweenRequests}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, timeBetweenRequests));
      }
    }
    
    console.log('\n🎉 Proactive token management pattern completed');
    console.log('💡 Notice how the SDK efficiently manages tokens across multiple requests over time');
    
  } catch (error) {
    console.error('❌ Proactive token management pattern failed:', error);
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
    { name: 'Automatic Refresh', fn: automaticRefreshPattern },
    { name: 'Sequential Requests', fn: sequentialRequestPattern },
    { name: 'Concurrent Requests', fn: concurrentRefreshPattern },
    { name: 'Error Handling', fn: errorHandlingPattern },
    { name: 'Retry with Backoff', fn: retryWithBackoffPattern },
    { name: 'Proactive Token Management', fn: proactiveTokenManagementPattern },
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
// Use process.argv check for compatibility with both CommonJS and ESM
const isMainModule = (() => {
  try {
    return process.argv[1] && process.argv[1].endsWith('token-refresh.ts');
  } catch {
    return false;
  }
})();

if (isMainModule) {
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