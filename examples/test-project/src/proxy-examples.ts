#!/usr/bin/env tsx

/**
 * Proxy Configuration Examples for Test Project
 * 
 * This file demonstrates various proxy configurations with the Tesouro SDK.
 * Run with: npm run test:proxy
 */

import 'dotenv/config';
import { createClient, type ApiClientConfig } from '@tesouro/tesouro-sdk-for-node';

// Configure these based on your environment
const CLIENT_CONFIG = {
  clientId: process.env.TESOURO_CLIENT_ID || 'demo-client-id',
  clientSecret: process.env.TESOURO_CLIENT_SECRET || 'demo-client-secret',
  endpoint: process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql',
};

/**
 * Example 1: Basic proxy configuration
 */
async function basicProxyExample() {
  console.log('\n=== Basic Proxy Example ===');
  
  const config: ApiClientConfig = {
    ...CLIENT_CONFIG,
    proxy: {
      url: 'http://proxy.example.com:8080'
    }
  };

  const client = createClient(config);
  const clientConfig = client.getConfig();
  
  console.log('✓ Client created with proxy configuration');
  console.log('  Proxy URL:', clientConfig.proxy?.url);
  console.log('  Endpoint:', clientConfig.endpoint);
  
  // In a real environment, you could test the connection:
  // try {
  //   const result = await client.query('query { __typename }');
  //   console.log('✓ Connection test successful');
  // } catch (error) {
  //   console.log('✗ Connection test failed:', error.message);
  // }
}

/**
 * Example 2: Authenticated proxy configuration
 */
async function authenticatedProxyExample() {
  console.log('\n=== Authenticated Proxy Example ===');
  
  const config: ApiClientConfig = {
    ...CLIENT_CONFIG,
    proxy: {
      url: 'http://proxy.company.com:8080',
      username: 'proxy-username',
      password: 'proxy-password'
    }
  };

  const client = createClient(config);
  const clientConfig = client.getConfig();
  
  console.log('✓ Client created with authenticated proxy');
  console.log('  Proxy URL:', clientConfig.proxy?.url);
  console.log('  Has authentication:', !!(clientConfig.proxy?.username && clientConfig.proxy?.password));
  console.log('  Username:', clientConfig.proxy?.username);
  // Note: Password is not logged for security
}

/**
 * Example 3: Environment variable proxy detection
 */
async function environmentProxyExample() {
  console.log('\n=== Environment Variable Proxy Example ===');
  
  // Set up environment variables (in real usage, these would be set externally)
  const originalProxy = process.env.HTTPS_PROXY;
  process.env.HTTPS_PROXY = 'http://env-proxy.example.com:3128';
  
  try {
    const config: ApiClientConfig = {
      ...CLIENT_CONFIG
      // No proxy config - will be detected from environment
    };

    const client = createClient(config);
    
    console.log('✓ Client created with environment proxy detection');
    console.log('  HTTPS_PROXY environment variable:', process.env.HTTPS_PROXY);
    console.log('  Client endpoint:', client.getConfig().endpoint);
    
    // The proxy is used internally but not exposed in getConfig()
    // since it comes from environment variables
    
  } finally {
    // Restore original environment
    if (originalProxy) {
      process.env.HTTPS_PROXY = originalProxy;
    } else {
      delete process.env.HTTPS_PROXY;
    }
  }
}

/**
 * Example 4: Proxy priority demonstration
 */
async function proxyPriorityExample() {
  console.log('\n=== Proxy Priority Example ===');
  
  // Set environment variable
  const originalProxy = process.env.HTTPS_PROXY;
  process.env.HTTPS_PROXY = 'http://env-proxy.example.com:8080';
  
  try {
    // Explicit proxy config should override environment
    const config: ApiClientConfig = {
      ...CLIENT_CONFIG,
      proxy: {
        url: 'http://explicit-proxy.example.com:9090'
      }
    };

    const client = createClient(config);
    const clientConfig = client.getConfig();
    
    console.log('✓ Explicit proxy configuration overrides environment');
    console.log('  Environment HTTPS_PROXY:', process.env.HTTPS_PROXY);
    console.log('  Explicit proxy URL:', clientConfig.proxy?.url);
    console.log('  → Explicit configuration takes precedence');
    
  } finally {
    // Restore original environment
    if (originalProxy) {
      process.env.HTTPS_PROXY = originalProxy;
    } else {
      delete process.env.HTTPS_PROXY;
    }
  }
}

/**
 * Example 5: Multiple environment variable detection
 */
async function multipleEnvironmentExample() {
  console.log('\n=== Multiple Environment Variables Example ===');
  
  // Save original values
  const originalHttpsProxy = process.env.HTTPS_PROXY;
  const originalHttpProxy = process.env.HTTP_PROXY;
  
  try {
    // Test priority: HTTPS_PROXY > HTTP_PROXY
    process.env.HTTP_PROXY = 'http://http-proxy.example.com:8080';
    process.env.HTTPS_PROXY = 'http://https-proxy.example.com:8080';
    
    const config: ApiClientConfig = {
      ...CLIENT_CONFIG
    };

    const client = createClient(config);
    
    console.log('✓ Multiple environment variables detected');
    console.log('  HTTP_PROXY:', process.env.HTTP_PROXY);
    console.log('  HTTPS_PROXY:', process.env.HTTPS_PROXY);
    console.log('  → HTTPS_PROXY takes precedence for HTTPS requests');
    
    // Test with only HTTP_PROXY
    delete process.env.HTTPS_PROXY;
    
    const client2 = createClient(config);
    console.log('\n✓ Fallback to HTTP_PROXY when HTTPS_PROXY not set');
    console.log('  HTTP_PROXY:', process.env.HTTP_PROXY);
    console.log('  HTTPS_PROXY:', process.env.HTTPS_PROXY || '(not set)');
    
  } finally {
    // Restore original environment
    if (originalHttpsProxy) {
      process.env.HTTPS_PROXY = originalHttpsProxy;
    } else {
      delete process.env.HTTPS_PROXY;
    }
    
    if (originalHttpProxy) {
      process.env.HTTP_PROXY = originalHttpProxy;
    } else {
      delete process.env.HTTP_PROXY;
    }
  }
}

/**
 * Example 6: Real-world corporate proxy scenario
 */
async function corporateProxyExample() {
  console.log('\n=== Corporate Proxy Scenario ===');
  
  // Simulate corporate environment setup
  const corporateConfig: ApiClientConfig = {
    ...CLIENT_CONFIG,
    // Corporate proxy with authentication
    proxy: {
      url: 'http://corporate-proxy.company.com:8080',
      username: process.env.PROXY_USERNAME || 'employee-id',
      password: process.env.PROXY_PASSWORD || 'employee-password'
    },
    // Longer timeout for proxy environments
    timeout: 45000, // 45 seconds
    // Custom headers that might be required
    headers: {
      'User-Agent': 'CorporateApp/1.0.0',
      'X-Corporate-ID': 'dept-finance'
    }
  };

  const client = createClient(corporateConfig);
  const config = client.getConfig();
  
  console.log('✓ Corporate proxy configuration');
  console.log('  Proxy URL:', config.proxy?.url);
  console.log('  Timeout:', config.timeout, 'ms');
  console.log('  Custom headers:', Object.keys(config.headers || {}).join(', '));
  console.log('  Has proxy auth:', !!(config.proxy?.username));
}

/**
 * Main function to run all examples
 */
async function runProxyExamples() {
  console.log('🚀 Starting Proxy Configuration Examples');
  console.log('==========================================');
  
  try {
    await basicProxyExample();
    await authenticatedProxyExample();
    await environmentProxyExample();
    await proxyPriorityExample();
    await multipleEnvironmentExample();
    await corporateProxyExample();
    
    console.log('\n✅ All proxy examples completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error running proxy examples:', error);
    process.exit(1);
  }
}

/**
 * Helper function to print proxy setup instructions
 */
function printProxySetupInstructions() {
  console.log(`
📋 Proxy Setup Instructions
============================

Environment Variables (automatic detection):
  export HTTPS_PROXY=http://proxy.company.com:8080
  export HTTP_PROXY=http://proxy.company.com:8080
  
With authentication:
  export HTTPS_PROXY=http://username:password@proxy.company.com:8080

Explicit Configuration (JavaScript/TypeScript):
  const client = createClient({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    proxy: {
      url: 'http://proxy.company.com:8080',
      username: 'optional-username',
      password: 'optional-password'
    }
  });

Priority Order:
  1. Explicit proxy configuration (highest)
  2. HTTPS_PROXY environment variable
  3. HTTP_PROXY environment variable
  4. https_proxy environment variable (lowercase)
  5. http_proxy environment variable (lowercase)

Testing:
  npm run proxy-examples
`);
}

// Export functions for individual testing
export {
  basicProxyExample,
  authenticatedProxyExample,
  environmentProxyExample,
  proxyPriorityExample,
  multipleEnvironmentExample,
  corporateProxyExample,
  printProxySetupInstructions
};

// Run if called directly
// Use process.argv check for compatibility with both CommonJS and ESM
const isMainModule = (() => {
  try {
    return process.argv[1] && process.argv[1].endsWith('proxy-examples.ts');
  } catch {
    return false;
  }
})();

if (isMainModule) {
  printProxySetupInstructions();
  runProxyExamples();
}