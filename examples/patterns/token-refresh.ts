/**
 * Tesouro SDK Token Refresh Patterns
 * 
 * Demonstrates comprehensive token management strategies including:
 * - Automatic refresh with retry logic
 * - Manual refresh control
 * - Concurrent request handling during refresh
 * - Error handling and fallback strategies
 * - Token lifecycle monitoring
 */

import { TesouroClient, type PaymentTransaction, type PaymentTransactionSummary } from '@tesouro/tesouro-sdk-for-node';

// Helper function to get yesterday's date for API compatibility
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// Basic client setup for all patterns
const client = new TesouroClient({
  clientId: process.env.TESOURO_CLIENT_ID || 'your-client-id',
  clientSecret: process.env.TESOURO_CLIENT_SECRET || 'your-client-secret',
  endpoint: 'https://api.sandbox.tesouro.com/graphql',
  tokenEndpoint: process.env.TESOURO_TOKEN_ENDPOINT || 'https://api.sandbox.tesouro.com/openid/connect/token',
});

/**
 * Pattern 1: Automatic Token Refresh
 * 
 * The SDK automatically handles token refresh when tokens are near expiration.
 * This is the most common pattern for production applications.
 */
export async function automaticRefreshPattern(): Promise<void> {
  console.log('\n🔄 Pattern 1: Automatic Token Refresh');
  console.log('=====================================');

  try {
    // The client will automatically refresh tokens when needed
    const startTime = Date.now();
    
    const result = await client.paymentTransactions({
      input: {
        paging: { skip: 0, take: 5 },
        where: {
          transactionActivityDate: {
            gte: getYesterdayDate(),
            lte: getYesterdayDate(),
          },
        },
      },
    });

    const endTime = Date.now();
    
    console.log(`✅ Query completed in ${endTime - startTime}ms`);
    console.log(`📊 Found ${result.data.paymentTransactions.items.length} payment transactions`);
    console.log(`🔐 Token status: ${client.isAuthenticated() ? 'Valid' : 'Invalid'}`);
    
    const authManager = client.getAuthManager();
    if (authManager.getTokenExpiration()) {
      const timeUntilExpiration = authManager.getTimeUntilExpiration();
      console.log(`⏰ Token expires in ${Math.round(timeUntilExpiration / 1000 / 60)} minutes`);
    }
    
  } catch (error) {
    console.error('❌ Automatic refresh pattern failed:', error);
    throw error;
  }
}

/**
 * Pattern 2: Manual Token Refresh Control
 * 
 * Demonstrates explicit token refresh control for scenarios where you need
 * to manage the refresh timing manually.
 */
export async function manualRefreshPattern(): Promise<void> {
  console.log('\n🎯 Pattern 2: Manual Token Refresh Control');
  console.log('==========================================');

  try {
    const authManager = client.getAuthManager();
    
    // Check current token status
    console.log(`🔍 Initial token valid: ${client.isAuthenticated()}`);
    
    // Force a token refresh
    console.log('🔄 Forcing token refresh...');
    const refreshStartTime = Date.now();
    
    await client.refreshToken();
    
    const refreshEndTime = Date.now();
    console.log(`✅ Token refreshed in ${refreshEndTime - refreshStartTime}ms`);
    console.log(`🔐 New token available: ${client.isAuthenticated() ? 'Yes' : 'No'}`);
    
    if (authManager.getTokenExpiration()) {
      const expiration = authManager.getTokenExpiration()!;
      console.log(`⏰ New token expires at: ${expiration.toLocaleString()}`);
    }
    
    // Now make a request with the fresh token
    const result = await client.paymentTransactionSummaries({
      input: {
        paging: { skip: 0, take: 3 },
        where: {
          transactionActivityDate: {
            gte: getYesterdayDate(),
            lte: getYesterdayDate(),
          },
        },
      },
    });
    
    console.log(`📊 Query successful with fresh token: ${result.data.paymentTransactionSummaries.items.length} summaries`);
    
  } catch (error) {
    console.error('❌ Manual refresh pattern failed:', error);
    throw error;
  }
}

/**
 * Pattern 3: Concurrent Requests During Token Refresh
 * 
 * Demonstrates how the SDK handles multiple concurrent requests when
 * a token refresh is needed, ensuring only one refresh occurs.
 */
export async function concurrentRefreshPattern(): Promise<void> {
  console.log('\n🚀 Pattern 3: Concurrent Requests During Refresh');
  console.log('================================================');

  try {
    // Clear the token to force refresh on first request
    client.clearAccessToken();
    console.log('🧹 Cleared token to simulate refresh scenario');
    
    // Launch multiple concurrent requests that will all need token refresh
    console.log('🔄 Starting 5 concurrent requests...');
    const startTime = Date.now();
    
    const requests = [
      client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 2 },
          where: { transactionActivityDate: { gte: getYesterdayDate(), lte: getYesterdayDate() } },
        },
      }),
      client.paymentTransactionSummaries({
        input: {
          paging: { skip: 0, take: 2 },
          where: { transactionActivityDate: { gte: getYesterdayDate(), lte: getYesterdayDate() } },
        },
      }),
      client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 1 },
          where: { transactionActivityDate: { gte: getYesterdayDate(), lte: getYesterdayDate() } },
        },
      }),
      client.paymentTransactionSummaries({
        input: {
          paging: { skip: 0, take: 1 },
          where: { transactionActivityDate: { gte: getYesterdayDate(), lte: getYesterdayDate() } },
        },
      }),
      client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 3 },
          where: { transactionActivityDate: { gte: getYesterdayDate(), lte: getYesterdayDate() } },
        },
      }),
    ];
    
    // Wait for all requests to complete
    const results = await Promise.allSettled(requests);
    const endTime = Date.now();
    
    // Analyze results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Concurrent requests completed in ${endTime - startTime}ms`);
    console.log(`📊 Results: ${successful} successful, ${failed} failed`);
    console.log(`🔐 Final token status: ${client.isAuthenticated() ? 'Valid' : 'Invalid'}`);
    
    // Show details of any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.log(`❌ Request ${index + 1} failed:`, result.reason.message);
      } else {
        const data = result.value.data as any;
        const itemCount = data.paymentTransactions?.items?.length || data.paymentTransactionSummaries?.items?.length || 0;
        console.log(`✅ Request ${index + 1}: ${itemCount} items`);
      }
    });
    
  } catch (error) {
    console.error('❌ Concurrent refresh pattern failed:', error);
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
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: process.env.TESOURO_TOKEN_ENDPOINT || 'https://api.sandbox.tesouro.com/openid/connect/token',
  });

  try {
    console.log('🔄 Attempting request with invalid credentials...');
    
    const result = await testClient.paymentTransactions({
      input: {
        paging: { skip: 0, take: 1 },
        where: {
          transactionActivityDate: {
            gte: getYesterdayDate(),
            lte: getYesterdayDate(),
          },
        },
      },
    });
    
    // This shouldn't happen with invalid credentials
    console.log('⚠️ Unexpected success with invalid credentials');
    
  } catch (error: any) {
    console.log('❌ Expected authentication error occurred');
    console.log(`🔍 Error type: ${error.constructor.name}`);
    console.log(`📝 Error message: ${error.message}`);
    
    // Check if error is retryable
    if (error.isRetryable && error.isRetryable()) {
      console.log('🔄 Error is retryable - could implement fallback logic');
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
              gte: getYesterdayDate(),
              lte: getYesterdayDate(),
            },
          },
        },
      });
      
      console.log(`✅ Fallback successful: ${fallbackResult.data.paymentTransactions.items.length} transactions`);
      
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
    }
  }
}

/**
 * Pattern 5: Token Lifecycle Monitoring
 * 
 * Demonstrates how to monitor token lifecycle events and implement
 * proactive refresh strategies.
 */
export async function lifecycleMonitoringPattern(): Promise<void> {
  console.log('\n📊 Pattern 5: Token Lifecycle Monitoring');
  console.log('========================================');

  try {
    const authManager = client.getAuthManager();
    
    // Function to display current token status
    const displayTokenStatus = () => {
      const isValid = client.isAuthenticated();
      const expiration = authManager.getTokenExpiration();
      const timeUntilExpiration = authManager.getTimeUntilExpiration();
      const shouldRefresh = authManager.shouldRefreshToken();
      
      console.log(`🔐 Token Valid: ${isValid}`);
      if (expiration) {
        console.log(`⏰ Expires: ${expiration.toLocaleString()}`);
        console.log(`⏳ Time until expiration: ${Math.round(timeUntilExpiration / 1000 / 60)} minutes`);
      }
      console.log(`🔄 Should refresh: ${shouldRefresh}`);
    };

    // Initial status
    console.log('📋 Initial token status:');
    displayTokenStatus();
    
    // Ensure we have a valid token
    if (!client.isAuthenticated()) {
      await client.refreshToken();
    }
    
    console.log('\n📋 After ensuring valid token:');
    displayTokenStatus();
    
    // Simulate token monitoring over time
    console.log('\n🔍 Monitoring token lifecycle...');
    
    // Make some requests while monitoring
    const monitoringPromises = [];
    
    // Request every 2 seconds for 10 seconds
    for (let i = 0; i < 5; i++) {
      monitoringPromises.push(
        new Promise<void>(resolve => {
          setTimeout(async () => {
            try {
              console.log(`\n📊 Request ${i + 1} at ${new Date().toLocaleTimeString()}:`);
              
              const result = await client.paymentTransactions({
                input: {
                  paging: { skip: 0, take: 1 },
                  where: {
                    transactionActivityDate: {
                      gte: getYesterdayDate(),
                      lte: getYesterdayDate(),
                    },
                  },
                },
              });
              
              console.log(`✅ Request ${i + 1} successful: ${result.data.paymentTransactions.items.length} items`);
              displayTokenStatus();
              
            } catch (error) {
              console.error(`❌ Request ${i + 1} failed:`, error);
            }
            resolve();
          }, i * 2000);
        })
      );
    }
    
    await Promise.all(monitoringPromises);
    
    console.log('\n📋 Final token status:');
    displayTokenStatus();
    
  } catch (error) {
    console.error('❌ Lifecycle monitoring pattern failed:', error);
    throw error;
  }
}

/**
 * Pattern 6: Proactive Token Refresh Strategy
 * 
 * Demonstrates implementing a proactive refresh strategy that refreshes
 * tokens before they expire to avoid request delays.
 */
export async function proactiveRefreshPattern(): Promise<void> {
  console.log('\n⚡ Pattern 6: Proactive Token Refresh Strategy');
  console.log('=============================================');

  try {
    const authManager = client.getAuthManager();
    
    // Function to check if we should proactively refresh
    const shouldProactivelyRefresh = (): boolean => {
      const timeUntilExpiration = authManager.getTimeUntilExpiration();
      // Refresh if less than 10 minutes remaining
      return timeUntilExpiration < (10 * 60 * 1000);
    };

    // Ensure we have a token first
    if (!client.isAuthenticated()) {
      await client.refreshToken();
    }
    
    console.log('🔍 Checking if proactive refresh is needed...');
    
    if (shouldProactivelyRefresh()) {
      console.log('🔄 Proactively refreshing token...');
      const refreshStart = Date.now();
      
      await client.refreshToken();
      
      const refreshEnd = Date.now();
      console.log(`✅ Proactive refresh completed in ${refreshEnd - refreshStart}ms`);
    } else {
      console.log('✅ Token is fresh enough, no proactive refresh needed');
    }
    
    // Now execute a batch of requests with confidence
    console.log('\n🚀 Executing batch requests with fresh token...');
    const batchStart = Date.now();
    
    const batchRequests = [
      client.paymentTransactions({
        input: {
          paging: { skip: 0, take: 2 },
          where: { transactionActivityDate: { gte: getYesterdayDate(), lte: getYesterdayDate() } },
        },
      }),
      client.paymentTransactionSummaries({
        input: {
          paging: { skip: 0, take: 2 },
          where: { transactionActivityDate: { gte: getYesterdayDate(), lte: getYesterdayDate() } },
        },
      }),
    ];
    
    const batchResults = await Promise.allSettled(batchRequests);
    const batchEnd = Date.now();
    
    const batchSuccessful = batchResults.filter(r => r.status === 'fulfilled').length;
    
    console.log(`✅ Batch completed in ${batchEnd - batchStart}ms`);
    console.log(`📊 Batch results: ${batchSuccessful}/${batchRequests.length} successful`);
    
    // Display final token status
    const finalExpiration = authManager.getTimeUntilExpiration();
    console.log(`⏰ Token remaining time: ${Math.round(finalExpiration / 1000 / 60)} minutes`);
    
  } catch (error) {
    console.error('❌ Proactive refresh pattern failed:', error);
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
    { name: 'Manual Refresh Control', fn: manualRefreshPattern },
    { name: 'Concurrent Refresh', fn: concurrentRefreshPattern },
    { name: 'Error Handling', fn: errorHandlingPattern },
    { name: 'Lifecycle Monitoring', fn: lifecycleMonitoringPattern },
    { name: 'Proactive Refresh', fn: proactiveRefreshPattern },
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
if (require.main === module) {
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