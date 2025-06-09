#!/usr/bin/env tsx

/**
 * Basic Setup Test
 * 
 * Tests basic client configuration and initialization
 */

import 'dotenv/config';
import { createClient } from '@tesouro/tesouro-sdk-for-node';

async function testBasicSetup() {
  console.log('🧪 Testing Basic Client Setup...\n');

  try {
    // Load environment variables
    const clientId = process.env.TESOURO_CLIENT_ID;
    const clientSecret = process.env.TESOURO_CLIENT_SECRET;
    const endpoint = process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql';
    const tokenEndpoint = process.env.TESOURO_TOKEN_ENDPOINT || 'https://api.sandbox.tesouro.com/openid/connect/token';

    if (!clientId || !clientSecret) {
      throw new Error('Missing required environment variables. Please check .env file.');
    }

    console.log('📋 Configuration:');
    console.log(`  Client ID: ${clientId}`);
    console.log(`  Endpoint: ${endpoint}`);
    console.log(`  Token Endpoint: ${tokenEndpoint}\n`);

    // Create client
    const client = createClient({
      clientId,
      clientSecret,
      endpoint,
      tokenEndpoint
    });

    console.log('✅ Client created successfully');

    // Check initial auth status
    console.log(`🔐 Initial auth status: ${client.isAuthenticated() ? 'Authenticated' : 'Not authenticated'}`);

    // Get configuration
    const config = client.getConfig();
    console.log('⚙️  Client configuration:');
    console.log(`  Timeout: ${config.timeout}ms`);
    console.log(`  Headers: ${JSON.stringify(config.headers, null, 2)}`);

    // Test token refresh
    console.log('\n🔄 Testing token refresh...');
    await client.refreshToken();
    console.log('✅ Token refresh successful');

    // Check auth status after refresh
    console.log(`🔐 Auth status after refresh: ${client.isAuthenticated() ? 'Authenticated' : 'Not authenticated'}`);

    // Get token (without exposing it)
    const token = client.getAccessToken();
    console.log(`🎫 Token available: ${token ? 'Yes' : 'No'}`);
    if (token) {
      console.log(`   Token length: ${token.length} characters`);
    }

    console.log('\n🎉 Basic setup test completed successfully!');

  } catch (error) {
    console.error('❌ Basic setup test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBasicSetup();
}

export { testBasicSetup };