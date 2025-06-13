#!/usr/bin/env tsx

/**
 * Pagination Patterns Example
 * 
 * Demonstrates various approaches to handle paginated GraphQL queries
 * including simple pagination, auto-pagination, streaming, and bulk fetching.
 */

import 'dotenv/config';
import { 
  TesouroClient, 
  type PaymentTransaction,
  type PaymentTransactionCollection,
  type QueryPaymentTransactionsArgs,
  type PaymentTransactionFilterInput,
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
 * Pattern 1: Simple Manual Pagination
 * Basic pagination where you manually handle page navigation
 */
async function simpleManualPagination() {
  const client = setupClient();
  
  console.log('📄 Pattern 1: Simple Manual Pagination');
  console.log('=====================================\n');
  
  try {
    const pageSize = 5;
    let currentPage = 0;
    let hasMorePages = true;
    
    // Date range for filtering (last 30 days)
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: thirtyDaysAgo,
        lte: today
      }
    };
    
    while (hasMorePages) {
      console.log(`📖 Fetching page ${currentPage + 1} (${pageSize} items per page)...`);
      
      const paging: PagingInput = {
        skip: currentPage * pageSize,
        take: pageSize
      };
      
      const variables: QueryPaymentTransactionsArgs = {
        input: { paging, where }
      };
      
      const result = await client.paymentTransactions(variables);
      const collection = result.data.paymentTransactions;
      
      if (collection.items.length > 0) {
        console.log(`✅ Retrieved ${collection.items.length} transactions`);
        console.log(`   Page Info: hasNext=${collection.pageInfo.hasNextPage}, hasPrev=${collection.pageInfo.hasPreviousPage}`);
        
        // Process items
        collection.items.forEach((transaction, index) => {
          console.log(`   ${currentPage * pageSize + index + 1}. Transaction: ${transaction.id || 'N/A'} (${transaction.transactionType})`);
        });
        console.log();
        
        // Check if we should continue
        hasMorePages = collection.pageInfo.hasNextPage && collection.items.length === pageSize;
        currentPage++;
        
        // Safety check to prevent infinite loops in demo
        if (currentPage >= 3) {
          console.log('🛑 Stopping demo after 3 pages...\n');
          break;
        }
      } else {
        console.log('📭 No more transactions found\n');
        hasMorePages = false;
      }
    }
    
    console.log(`🎉 Manual pagination completed. Retrieved ${currentPage} pages.\n`);
    
  } catch (error) {
    console.error('❌ Manual pagination failed:', error);
    throw error;
  }
}

/**
 * Pattern 2: Auto-Pagination Iterator
 * Automatically iterates through all pages using an async generator
 */
async function* createPaginatedIterator(
  client: TesouroClient,
  queryFn: (paging: PagingInput) => Promise<GraphQLResult<{ paymentTransactions: PaymentTransactionCollection }>>,
  pageSize: number = 10
): AsyncGenerator<PaymentTransaction[], void, unknown> {
  let currentPage = 0;
  let hasMorePages = true;
  
  while (hasMorePages) {
    const paging: PagingInput = {
      skip: currentPage * pageSize,
      take: pageSize
    };
    
    const result = await queryFn(paging);
    const collection = result.data.paymentTransactions;
    
    if (collection.items.length > 0) {
      yield collection.items;
      hasMorePages = collection.pageInfo.hasNextPage && collection.items.length === pageSize;
      currentPage++;
    } else {
      hasMorePages = false;
    }
  }
}

async function autoPaginationWithIterator() {
  const client = setupClient();
  
  console.log('🔄 Pattern 2: Auto-Pagination with Iterator');
  console.log('==========================================\n');
  
  try {
    // Date range for filtering
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: thirtyDaysAgo,
        lte: today
      }
    };
    
    // Create query function for the iterator
    const queryFn = async (paging: PagingInput) => {
      const variables: QueryPaymentTransactionsArgs = {
        input: { paging, where }
      };
      return client.paymentTransactions(variables);
    };
    
    const iterator = createPaginatedIterator(client, queryFn, 3);
    let pageNumber = 1;
    let totalItems = 0;
    
    console.log('🚀 Starting auto-pagination...');
    
    for await (const page of iterator) {
      console.log(`📖 Page ${pageNumber}: Retrieved ${page.length} transactions`);
      
      page.forEach((transaction, index) => {
        console.log(`   ${totalItems + index + 1}. Transaction: ${transaction.id || 'N/A'} (${transaction.transactionType})`);
      });
      
      totalItems += page.length;
      pageNumber++;
      
      // Safety check to prevent infinite loops in demo
      if (pageNumber > 3) {
        console.log('🛑 Stopping demo after 3 pages...\n');
        break;
      }
    }
    
    console.log(`🎉 Auto-pagination completed. Total items: ${totalItems}\n`);
    
  } catch (error) {
    console.error('❌ Auto-pagination failed:', error);
    throw error;
  }
}

/**
 * Pattern 3: Streaming Pagination
 * Processes items as they arrive without storing all in memory
 */
async function streamingPagination() {
  const client = setupClient();
  
  console.log('🌊 Pattern 3: Streaming Pagination');
  console.log('=================================\n');
  
  try {
    const pageSize = 4;
    let processedCount = 0;
    let pageNumber = 1;
    
    // Date range for filtering
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: thirtyDaysAgo,
        lte: today
      }
    };
    
    // Stream processor function
    const processTransaction = (transaction: PaymentTransaction, globalIndex: number) => {
      // Simulate processing work
      console.log(`🔄 Processing transaction ${globalIndex}: ${transaction.id || 'N/A'} (${transaction.transactionType})`);
      
      // Here you could:
      // - Transform the data
      // - Save to database
      // - Send to external service
      // - Aggregate statistics
      
      return true; // Return false to stop processing
    };
    
    console.log('🚀 Starting streaming pagination...');
    
    const queryFn = async (paging: PagingInput) => {
      const variables: QueryPaymentTransactionsArgs = {
        input: { paging, where }
      };
      return client.paymentTransactions(variables);
    };
    
    const iterator = createPaginatedIterator(client, queryFn, pageSize);
    
    for await (const page of iterator) {
      console.log(`\n📄 Streaming page ${pageNumber} (${page.length} items):`);
      
      for (const transaction of page) {
        const shouldContinue = processTransaction(transaction, processedCount + 1);
        processedCount++;
        
        if (!shouldContinue) {
          console.log('⏹️  Processing stopped by handler');
          return;
        }
      }
      
      pageNumber++;
      
      // Add a small delay to demonstrate streaming
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Safety check for demo
      if (pageNumber > 3) {
        console.log('\n🛑 Stopping demo after 3 pages...');
        break;
      }
    }
    
    console.log(`\n🎉 Streaming completed. Processed ${processedCount} transactions.\n`);
    
  } catch (error) {
    console.error('❌ Streaming pagination failed:', error);
    throw error;
  }
}

/**
 * Pattern 4: Bulk Fetching with Optimization
 * Fetches larger pages and provides memory-efficient processing
 */
async function bulkFetchingPattern() {
  const client = setupClient();
  
  console.log('📦 Pattern 4: Bulk Fetching with Optimization');
  console.log('============================================\n');
  
  try {
    const bulkSize = 20; // Larger page size for efficiency
    let totalProcessed = 0;
    let pageNumber = 1;
    
    // Date range for filtering
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: sevenDaysAgo,
        lte: today
      }
    };
    
    console.log(`🚀 Starting bulk fetch (${bulkSize} items per request)...`);
    
    const startTime = Date.now();
    
    const queryFn = async (paging: PagingInput) => {
      const requestStart = Date.now();
      const variables: QueryPaymentTransactionsArgs = {
        input: { paging, where }
      };
      
      const result = await client.paymentTransactions(variables);
      const requestTime = Date.now() - requestStart;
      
      console.log(`⚡ Request ${pageNumber} completed in ${requestTime}ms`);
      return result;
    };
    
    const iterator = createPaginatedIterator(client, queryFn, bulkSize);
    
    for await (const page of iterator) {
      console.log(`📦 Bulk page ${pageNumber}: ${page.length} transactions`);
      
      // Process in chunks for memory efficiency
      const chunkSize = 5;
      for (let i = 0; i < page.length; i += chunkSize) {
        const chunk = page.slice(i, i + chunkSize);
        console.log(`   📝 Processing chunk ${Math.floor(i / chunkSize) + 1}: ${chunk.length} items`);
        
        // Simulate batch processing
        await Promise.all(chunk.map(async (transaction, index) => {
          // Simulate async processing work
          await new Promise(resolve => setTimeout(resolve, 10));
          console.log(`     ✓ Processed: ${transaction.id || `Item ${totalProcessed + i + index + 1}`} (${transaction.transactionType})`);
        }));
      }
      
      totalProcessed += page.length;
      pageNumber++;
      
      // Memory optimization: force garbage collection hint
      if (global.gc) {
        global.gc();
      }
      
      // Safety check for demo
      if (pageNumber > 2) {
        console.log('\n🛑 Stopping demo after 2 bulk pages...');
        break;
      }
    }
    
    const totalTime = Date.now() - startTime;
    const avgItemsPerSecond = totalProcessed / (totalTime / 1000);
    
    console.log(`\n🎉 Bulk processing completed!`);
    console.log(`   📊 Total processed: ${totalProcessed} transactions`);
    console.log(`   ⏱️  Total time: ${totalTime}ms`);
    console.log(`   🚀 Average: ${avgItemsPerSecond.toFixed(2)} items/second\n`);
    
  } catch (error) {
    console.error('❌ Bulk fetching failed:', error);
    throw error;
  }
}

/**
 * Helper function for retry logic with exponential backoff
 */
async function fetchPageWithRetry(
  client: TesouroClient,
  paging: PagingInput,
  where: PaymentTransactionFilterInput,
  pageNumber: number,
  maxRetries: number,
  retryCount: { value: number }
): Promise<PaymentTransactionCollection> {
  let attempts = 0;
  
  while (attempts <= maxRetries) {
    try {
      const variables: QueryPaymentTransactionsArgs = {
        input: { paging, where }
      };
      
      console.log(`🔄 Attempt ${attempts + 1} for page ${pageNumber} (skip: ${paging.skip}, take: ${paging.take})`);
      
      const result = await client.paymentTransactions(variables, {
        timeout: 10000 // 10 second timeout
      });
      
      console.log(`✅ Page ${pageNumber} fetched successfully`);
      return result.data.paymentTransactions;
      
    } catch (error) {
      attempts++;
      retryCount.value++;
      
      console.log(`❌ Attempt ${attempts} failed:`, error instanceof Error ? error.message : error);
      
      if (attempts > maxRetries) {
        console.log(`🚫 Max retries (${maxRetries}) exceeded for page ${pageNumber}`);
        throw error;
      }
      
      // Exponential backoff
      const backoffMs = Math.pow(2, attempts - 1) * 1000;
      console.log(`⏳ Retrying in ${backoffMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  
  throw new Error('Should not reach here');
}

/**
 * Pattern 5: Advanced Pagination with Error Recovery
 * Demonstrates robust pagination with retry logic and error handling
 */
async function advancedPaginationWithRetry(): Promise<void> {
  const client = setupClient();
  
  console.log('🛡️  Pattern 5: Advanced Pagination with Error Recovery');
  console.log('====================================================\n');
  
  try {
    const pageSize = 3;
    let totalProcessed = 0;
    let pageNumber = 1;
    const retryCount = { value: 0 }; // Use object to pass by reference
    const maxRetries = 3;
    
    // Date range for filtering
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const where: PaymentTransactionFilterInput = {
      transactionActivityDate: {
        gte: thirtyDaysAgo,
        lte: today
      }
    };
    
    console.log('🚀 Starting resilient pagination with retry logic...');
    
    // Pagination loop with retry logic
    let hasMorePages = true;
    
    while (hasMorePages && pageNumber <= 3) { // Safety limit for demo
      const paging: PagingInput = {
        skip: (pageNumber - 1) * pageSize,
        take: pageSize
      };
      
      try {
        const collection = await fetchPageWithRetry(client, paging, where, pageNumber, maxRetries, retryCount);
        
        if (collection.items.length > 0) {
          console.log(`📖 Page ${pageNumber}: ${collection.items.length} transactions`);
          
          // Process items
          collection.items.forEach((transaction, index) => {
            console.log(`   ${totalProcessed + index + 1}. ${transaction.id || 'N/A'} (${transaction.transactionType})`);
          });
          
          totalProcessed += collection.items.length;
          hasMorePages = collection.pageInfo.hasNextPage && collection.items.length === pageSize;
          pageNumber++;
          
        } else {
          console.log('📭 No more transactions found');
          hasMorePages = false;
        }
        
      } catch (error) {
        console.log(`💥 Failed to fetch page ${pageNumber} after all retries. Stopping pagination.`);
        throw error;
      }
    }
    
    console.log(`\n🎉 Resilient pagination completed!`);
    console.log(`   📊 Total processed: ${totalProcessed} transactions`);
    console.log(`   🔄 Total retries: ${retryCount.value}`);
    console.log(`   📄 Pages fetched: ${pageNumber - 1}\n`);
    
  } catch (error) {
    console.error('❌ Advanced pagination failed:', error);
    throw error;
  }
}

async function testPaginationPatterns() {
  console.log('🧪 Testing Pagination Patterns\n');
  console.log('==============================\n');

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

    // Run all pagination patterns
    await simpleManualPagination();
    await autoPaginationWithIterator();
    await streamingPagination();
    await bulkFetchingPattern();
    await advancedPaginationWithRetry();

    console.log('🎉 All pagination patterns completed successfully!');

  } catch (error) {
    console.error('❌ Pagination patterns test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
// Use require.main check for compatibility with both CommonJS and ESM
const isMainModule = (() => {
  try {
    // Check if we're running as the main module
    return process.argv[1] && process.argv[1].endsWith('pagination.ts');
  } catch {
    return false;
  }
})();

if (isMainModule) {
  testPaginationPatterns();
}

export { 
  testPaginationPatterns,
  simpleManualPagination,
  autoPaginationWithIterator,
  streamingPagination,
  bulkFetchingPattern,
  advancedPaginationWithRetry,
  createPaginatedIterator
};