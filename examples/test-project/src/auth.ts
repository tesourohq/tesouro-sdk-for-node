#!/usr/bin/env tsx

/**
 * Basic Authentication Example
 * 
 * Demonstrates basic authentication flow with the Tesouro SDK
 */

import 'dotenv/config';
import { TesouroClient } from '@tesouro/tesouro-sdk-for-node';

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

async function testAuthentication() {
  console.log('🔐 Testing Basic Authentication');
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

    // Create client
    const client = setupClient();
    console.log('✅ Client created successfully');

    // Test authentication with a simple query
    console.log('🔄 Testing authentication with a simple query...\n');
    
    // Use a safe date range for testing
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 2); // 2 days ago to avoid timezone issues
    
    const result = await client.paymentTransactionSummaries({
      input: {
        paging: { skip: 0, take: 1 },
        where: {
          transactionActivityDate: {
            gte: endDate.toISOString().split('T')[0],
            lte: endDate.toISOString().split('T')[0]
          }
        }
      }
    });

    console.log('🎉 Authentication successful!');
    console.log(`📊 Retrieved ${result.data.paymentTransactionSummaries.items.length} transaction summaries`);
    console.log(`📄 Page info: hasNext=${result.data.paymentTransactionSummaries.pageInfo.hasNextPage}`);

    if (result.data.paymentTransactionSummaries.items.length > 0) {
      const firstItem = result.data.paymentTransactionSummaries.items[0];
      console.log(`💳 First transaction: ${firstItem.transactionCount} transactions on ${firstItem.transactionActivityDate}`);
    }

    console.log('\n✅ Authentication example completed successfully!');

  } catch (error) {
    console.error('❌ Authentication failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
// Use process.argv check for compatibility with both CommonJS and ESM
const isMainModule = (() => {
  try {
    return process.argv[1] && process.argv[1].endsWith('auth.ts');
  } catch {
    return false;
  }
})();

if (isMainModule) {
  testAuthentication();
}

export { testAuthentication };