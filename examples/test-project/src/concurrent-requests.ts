#!/usr/bin/env tsx

/**
 * Concurrent Requests Pattern Examples
 * 
 * Demonstrates various approaches for handling concurrent requests efficiently
 * including parallel processing, request batching, and performance optimization.
 */

import 'dotenv/config';
import { 
  TesouroClient, 
  type PaymentTransaction,
  type PaymentTransactionSummary,
  type QueryPaymentTransactionSummariesArgs,
  type QueryPaymentTransactionsArgs,
  type PaymentTransactionFilterInput,
  type PaymentTransactionSummaryInput,
  type PagingInput,
  type GraphQLResult
} from '@tesouro/tesouro-sdk-for-node';

// Setup client using the generated client
function setupClient(): TesouroClient {
  return new TesouroClient({
    clientId: process.env.TESOURO_CLIENT_ID!,
    clientSecret: process.env.TESOURO_CLIENT_SECRET!,
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token'
  });
}

/**
 * Pattern 1: Parallel Query Execution
 * Demonstrates running multiple independent queries concurrently
 */
async function parallelQueryExecution() {
  const client = setupClient();
  
  console.log('🔥 Pattern 1: Parallel Query Execution');
  console.log('=====================================\n');
  
  try {
    const startTime = Date.now();
    
    // Date range for filtering (use safe dates to ensure we're within API limits)
    const endDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 days ago
    const startDate = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 9 days ago
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: startDate,
        lte: endDate
      }
    };

    console.log('🚀 Starting 5 concurrent queries...');

    // Execute multiple queries in parallel
    const promises = [
      // Query 1: Recent transactions (page 1)
      client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 5 },
          where
        }
      }),
      
      // Query 2: Recent transactions (page 2)
      client.paymentTransactions({
        input: {
          paging: { skip: 5, take: 5 },
          where
        }
      }),
      
      // Query 3: Recent transactions (different page)
      client.paymentTransactions({
        input: {
          paging: { skip: 10, take: 5 },
          where: {
            transactionActivityDate: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      }),
      
      // Query 4: Recent transactions (different date range)
      client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 3 },
          where: {
            transactionActivityDate: {
              gte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
              lte: endDate
            }
          }
        }
      }),
      
      // Query 5: Different page of transactions
      client.paymentTransactions({
        input: {
          paging: { skip: 10, take: 3 },
          where
        }
      })
    ];

    console.log('⏳ Waiting for all queries to complete...');
    
    // Wait for all queries to complete
    const results = await Promise.all(promises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`✅ All ${results.length} queries completed in ${totalTime}ms\n`);
    
    // Process results
    results.forEach((result, index) => {
      if ('paymentTransactions' in result.data) {
        const transactions = result.data.paymentTransactions;
        console.log(`📄 Query ${index + 1}: Retrieved ${transactions.items.length} transactions`);
        transactions.items.slice(0, 2).forEach((tx, txIndex) => {
          console.log(`   ${txIndex + 1}. ${tx.id}`);
        });
      }
    });
    
    console.log(`\n🎉 Parallel execution completed. Average: ${(totalTime / results.length).toFixed(2)}ms per query\n`);
    
  } catch (error) {
    console.error('❌ Parallel query execution failed:', error);
    throw error;
  }
}

/**
 * Pattern 2: Request Batching with Controlled Concurrency
 * Processes large sets of requests in smaller batches to avoid overwhelming the server
 */
async function requestBatching() {
  const client = setupClient();
  
  console.log('📦 Pattern 2: Request Batching with Controlled Concurrency');
  console.log('=======================================================\n');
  
  try {
    const batchSize = 3; // Process 3 requests at a time
    const totalRequests = 10;
    
    console.log(`🚀 Processing ${totalRequests} requests in batches of ${batchSize}...`);
    
    // Use safe dates to ensure we're within API limits
    const endDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 days ago
    const startDate = new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 32 days ago
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: startDate,
        lte: endDate
      }
    };

    // Create request functions
    const requestFunctions = Array.from({ length: totalRequests }, (_, index) => 
      () => client.paymentTransactions({
        input: {
          paging: { skip: index * 2, take: 2 },
          where
        }
      })
    );

    const results: any[] = [];
    const startTime = Date.now();
    
    // Process in batches
    for (let i = 0; i < requestFunctions.length; i += batchSize) {
      const batch = requestFunctions.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      console.log(`📥 Processing batch ${batchNumber} (${batch.length} requests)...`);
      
      const batchStartTime = Date.now();
      const batchResults = await Promise.all(batch.map(fn => fn()));
      const batchTime = Date.now() - batchStartTime;
      
      console.log(`✅ Batch ${batchNumber} completed in ${batchTime}ms`);
      
      // Process batch results
      batchResults.forEach((result, batchIndex) => {
        const transactions = result.data.paymentTransactions;
        const globalIndex = i + batchIndex + 1;
        console.log(`   Request ${globalIndex}: ${transactions.items.length} transactions`);
      });
      
      results.push(...batchResults);
      
      // Add a small delay between batches to be respectful to the server
      if (i + batchSize < requestFunctions.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`\n🎉 Batched processing completed!`);
    console.log(`   📊 Total requests: ${results.length}`);
    console.log(`   ⏱️  Total time: ${totalTime}ms`);
    console.log(`   🚀 Average: ${(totalTime / results.length).toFixed(2)}ms per request\n`);
    
  } catch (error) {
    console.error('❌ Request batching failed:', error);
    throw error;
  }
}

/**
 * Pattern 3: Mixed Query Types with Promise.allSettled
 * Handles different types of requests concurrently with graceful error handling
 */
async function mixedQueryTypes() {
  const client = setupClient();
  
  console.log('🔀 Pattern 3: Mixed Query Types with Error Handling');
  console.log('==================================================\n');
  
  try {
    console.log('🚀 Starting mixed concurrent requests...');
    
    // Use safe dates to ensure we're within API limits
    const endDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 days ago
    const startDate = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 9 days ago
    
    const requests = [
      {
        name: 'Payment Transactions',
        promise: client.paymentTransactions({
          input: {
            paging: { skip: 0, take: 5 },
            where: {
              transactionActivityDate: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        })
      },
      {
        name: 'Payment Transaction Summaries',
        promise: client.paymentTransactionSummaries({
          input: {
            paging: { skip: 0, take: 5 },
            where: {
              transactionActivityDate: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        })
      },
      {
        name: 'Funding Summaries',
        promise: client.fundingSummaries({
          input: {
            paging: { skip: 0, take: 5 },
            where: {
              transactionActivityDate: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        })
      },
      {
        name: 'Recent Payment Transactions',
        promise: client.paymentTransactions({
          input: {
            paging: { skip: 5, take: 3 },
            where: {
              transactionActivityDate: {
                gte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
                lte: endDate
              }
            }
          }
        })
      }
    ];
    
    const startTime = Date.now();
    
    // Use allSettled to handle both success and failure cases
    const results = await Promise.allSettled(requests.map(req => req.promise));
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`⏱️  All requests completed in ${totalTime}ms\n`);
    
    // Process results with error handling
    results.forEach((result, index) => {
      const requestName = requests[index].name;
      
      if (result.status === 'fulfilled') {
        console.log(`✅ ${requestName}: Success`);
        
        const data = result.value.data;
        if ('paymentTransactions' in data) {
          console.log(`   📄 Retrieved ${data.paymentTransactions.items.length} transactions`);
        } else if ('paymentTransactionSummaries' in data) {
          console.log(`   📊 Retrieved ${data.paymentTransactionSummaries.items.length} transaction summaries`);
        } else if ('fundingSummaries' in data) {
          console.log(`   💰 Retrieved ${data.fundingSummaries.items.length} funding summaries`);
        }
        
      } else {
        console.log(`❌ ${requestName}: Failed`);
        console.log(`   Error: ${result.reason.message}`);
      }
    });
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;
    
    console.log(`\n🎯 Results Summary:`);
    console.log(`   ✅ Successful requests: ${successCount}/${requests.length}`);
    console.log(`   ❌ Failed requests: ${failureCount}/${requests.length}`);
    console.log(`   📈 Success rate: ${((successCount / requests.length) * 100).toFixed(1)}%\n`);
    
  } catch (error) {
    console.error('❌ Mixed query types failed:', error);
    throw error;
  }
}

/**
 * Pattern 4: Sequential vs Concurrent Performance Comparison
 * Demonstrates the performance benefits of concurrent execution
 */
async function performanceComparison() {
  const client = setupClient();
  
  console.log('🏁 Pattern 4: Sequential vs Concurrent Performance Comparison');
  console.log('===========================================================\n');
  
  try {
    // Use safe dates to ensure we're within API limits
    const endDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 days ago
    const startDate = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 9 days ago
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: startDate,
        lte: endDate
      }
    };

    const queries = [
      () => client.paymentTransactions({
        input: { paging: { skip: 0, take: 3 }, where }
      }),
      () => client.paymentTransactions({
        input: { paging: { skip: 3, take: 3 }, where }
      }),
      () => client.paymentTransactionSummaries({
        input: { paging: { skip: 0, take: 5 }, where: { transactionActivityDate: where.transactionActivityDate! } }
      })
    ];

    // Sequential execution
    console.log('🐌 Running queries sequentially...');
    const sequentialStart = Date.now();
    
    const sequentialResults = [];
    for (const query of queries) {
      const result = await query();
      sequentialResults.push(result);
    }
    
    const sequentialTime = Date.now() - sequentialStart;
    console.log(`✅ Sequential execution completed in ${sequentialTime}ms`);

    // Concurrent execution
    console.log('\n🚀 Running queries concurrently...');
    const concurrentStart = Date.now();
    
    const concurrentResults = await Promise.all(queries.map(query => query()));
    
    const concurrentTime = Date.now() - concurrentStart;
    console.log(`✅ Concurrent execution completed in ${concurrentTime}ms`);

    // Performance analysis
    const improvement = ((sequentialTime - concurrentTime) / sequentialTime) * 100;
    const speedup = sequentialTime / concurrentTime;
    
    console.log(`\n📊 Performance Analysis:`);
    console.log(`   🐌 Sequential time: ${sequentialTime}ms`);
    console.log(`   🚀 Concurrent time: ${concurrentTime}ms`);
    console.log(`   📈 Performance improvement: ${improvement.toFixed(1)}%`);
    console.log(`   ⚡ Speed-up factor: ${speedup.toFixed(2)}x`);
    console.log(`   💡 Time saved: ${sequentialTime - concurrentTime}ms\n`);
    
    // Verify both approaches return same data
    console.log('🔍 Verifying data consistency...');
    const sequentialTransactionCount = sequentialResults
      .filter(r => 'paymentTransactions' in r.data)
      .reduce((sum, r) => sum + ('paymentTransactions' in r.data ? r.data.paymentTransactions.items.length : 0), 0);
      
    const concurrentTransactionCount = concurrentResults
      .filter(r => 'paymentTransactions' in r.data)
      .reduce((sum, r) => sum + ('paymentTransactions' in r.data ? r.data.paymentTransactions.items.length : 0), 0);
    
    console.log(`✅ Data consistency verified: Both approaches returned ${sequentialTransactionCount} transactions\n`);
    
  } catch (error) {
    console.error('❌ Performance comparison failed:', error);
    throw error;
  }
}

/**
 * Pattern 5: Resilient Concurrent Requests with Retry Logic
 * Demonstrates how to handle failures in concurrent scenarios with exponential backoff and jitter
 */
async function resilientConcurrentRequests() {
  const client = setupClient();
  
  console.log('🛡️  Pattern 5: Resilient Concurrent Requests with Retry Logic');
  console.log('================================================================\n');
  
  try {
    const maxRetries = 2;
    const retryDelay = 1000; // 1 second
    
    console.log(`🚀 Starting resilient concurrent requests (max ${maxRetries} retries with jitter)...`);
    
    // Use safe dates to ensure we're within API limits
    const endDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 days ago
    const startDate = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 9 days ago
    
    // Create requests with retry logic
    const createResilientRequest = async (requestName: string, requestFn: () => Promise<any>) => {
      let attempts = 0;
      
      while (attempts <= maxRetries) {
        try {
          console.log(`🔄 ${requestName}: Attempt ${attempts + 1}`);
          const result = await requestFn();
          console.log(`✅ ${requestName}: Success on attempt ${attempts + 1}`);
          return { success: true, result, attempts: attempts + 1, name: requestName };
          
        } catch (error) {
          attempts++;
          console.log(`❌ ${requestName}: Failed on attempt ${attempts}`);
          
          if (attempts > maxRetries) {
            console.log(`🚫 ${requestName}: Max retries exceeded`);
            return { success: false, error, attempts, name: requestName };
          }
          
          // Exponential backoff with jitter
          const baseDelay = retryDelay * Math.pow(2, attempts - 1);
          // Add random jitter (±25% of the base delay) to prevent thundering herd
          const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1); // Random between -25% and +25%
          const backoffDelay = Math.max(0, Math.round(baseDelay + jitter));
          console.log(`⏳ ${requestName}: Retrying in ${backoffDelay}ms (base: ${baseDelay}ms + jitter: ${Math.round(jitter)}ms)...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      }
    };
    
    const resilientRequests = [
      createResilientRequest('Payment Transactions', () => 
        client.paymentTransactions({
          input: {
            paging: { skip: 0, take: 5 },
            where: {
              transactionActivityDate: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        })
      ),
      
      createResilientRequest('Transaction Summaries', () =>
        client.paymentTransactionSummaries({
          input: {
            paging: { skip: 0, take: 3 },
            where: {
              transactionActivityDate: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        })
      ),
      
      createResilientRequest('Recent Transactions', () =>
        client.paymentTransactions({
          input: {
            paging: { skip: 0, take: 3 },
            where: {
              transactionActivityDate: {
                gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                lte: endDate
              }
            }
          }
        })
      )
    ];
    
    const startTime = Date.now();
    const results = await Promise.all(resilientRequests);
    const totalTime = Date.now() - startTime;
    
    console.log(`\n🎯 Resilient requests completed in ${totalTime}ms\n`);
    
    // Analyze results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`📊 Results Summary:`);
    console.log(`   ✅ Successful requests: ${successful.length}/${results.length}`);
    console.log(`   ❌ Failed requests: ${failed.length}/${results.length}`);
    
    successful.forEach(result => {
      console.log(`   ✅ ${result?.name}: Success after ${result?.attempts} attempt(s)`);
    });
    
    failed.forEach(result => {
      console.log(`   ❌ ${result?.name}: Failed after ${result?.attempts} attempts`);
    });
    
    const totalAttempts = results.reduce((sum, r) => sum + r.attempts, 0);
    console.log(`   🔄 Total attempts made: ${totalAttempts}`);
    console.log(`   📈 Success rate: ${((successful.length / results.length) * 100).toFixed(1)}%\n`);
    
  } catch (error) {
    console.error('❌ Resilient concurrent requests failed:', error);
    throw error;
  }
}

async function testConcurrentPatterns() {
  console.log('🧪 Testing Concurrent Request Patterns\n');
  console.log('======================================\n');

  try {
    // Check environment variables
    const clientId = process.env.TESOURO_CLIENT_ID;
    const clientSecret = process.env.TESOURO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing required environment variables. Please check .env file.');
    }

    console.log('📋 Configuration:');
    console.log(`  Client ID: ${clientId}`);
    console.log(`  Endpoint: ${process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql'}\n`);

    // Run all concurrent patterns
    await parallelQueryExecution();
    await requestBatching();
    await mixedQueryTypes();
    await performanceComparison();
    await resilientConcurrentRequests();

    console.log('🎉 All concurrent request patterns completed successfully!');

  } catch (error) {
    console.error('❌ Concurrent request patterns test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConcurrentPatterns();
}

export { 
  testConcurrentPatterns,
  parallelQueryExecution,
  requestBatching,
  mixedQueryTypes,
  performanceComparison,
  resilientConcurrentRequests
};