/**
 * Proxy Configuration Example
 * 
 * This example demonstrates how to configure the Tesouro SDK client
 * to work through HTTP proxies in different scenarios.
 */

import { createClient, ApiClient, type ApiClientConfig } from '@tesouro/tesouro-sdk-for-node';

// Example 1: Client with explicit proxy configuration
export function createClientWithProxy(): ApiClient {
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    proxy: {
      url: 'http://proxy.company.com:8080'
    }
  };

  return createClient(config);
}

// Example 2: Client with authenticated proxy
export function createClientWithAuthenticatedProxy(): ApiClient {
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    proxy: {
      url: 'http://proxy.company.com:8080',
      username: 'proxy-username',
      password: 'proxy-password'
    }
  };

  return createClient(config);
}

// Example 3: Client using environment variables for proxy
export function createClientWithEnvironmentProxy(): ApiClient {
  // The SDK will automatically detect these environment variables:
  // - HTTPS_PROXY (preferred for HTTPS requests)
  // - HTTP_PROXY (fallback for HTTP requests)
  // - https_proxy (lowercase alternative)
  // - http_proxy (lowercase alternative)
  
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql'
    // No proxy config needed - will use environment variables
  };

  return createClient(config);
}

// Example 4: Client that overrides environment proxy with explicit config
export function createClientOverridingEnvironmentProxy(): ApiClient {
  // Even if HTTPS_PROXY environment variable is set,
  // explicit proxy configuration takes precedence
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    proxy: {
      url: 'http://different-proxy.company.com:3128'
    }
  };

  return createClient(config);
}

// Example 5: Environment-based proxy configuration with validation
export function createClientWithEnvironmentProxyValidation(): ApiClient {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  
  if (proxyUrl) {
    console.log(`Using proxy from environment: ${proxyUrl}`);
  } else {
    console.log('No proxy configured in environment variables');
  }

  const config: ApiClientConfig = {
    clientId: process.env.TESOURO_CLIENT_ID!,
    clientSecret: process.env.TESOURO_CLIENT_SECRET!,
    endpoint: process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql'
    // Proxy will be automatically detected from environment
  };

  return createClient(config);
}

// Example 6: Class-based wrapper with proxy support
export class ProxyAwareTesouroClient {
  private client: ApiClient;
  private proxyConfig?: {
    url: string;
    username?: string;
    password?: string;
  };

  constructor(config: ApiClientConfig, proxyConfig?: {
    url: string;
    username?: string;
    password?: string;
  }) {
    this.proxyConfig = proxyConfig;
    
    const clientConfig: ApiClientConfig = {
      ...config,
      ...(proxyConfig && { proxy: proxyConfig })
    };

    this.client = createClient(clientConfig);
  }

  // Get current proxy configuration
  getProxyConfig() {
    const config = this.client.getConfig();
    return config.proxy;
  }

  // Check if proxy is configured
  isProxyConfigured(): boolean {
    return !!this.getProxyConfig();
  }

  // Get the underlying client
  getClient(): ApiClient {
    return this.client;
  }

  // Test connectivity through proxy
  async testConnection(): Promise<boolean> {
    try {
      // Try a simple introspection query to test connectivity
      await this.client.query(`
        query TestConnection {
          __typename
        }
      `);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Example usage with different proxy scenarios
export async function demonstrateProxyUsage() {
  console.log('=== Proxy Configuration Examples ===\n');

  try {
    // Example 1: Environment-based proxy
    console.log('1. Testing environment-based proxy...');
    process.env.HTTPS_PROXY = 'http://proxy.example.com:8080';
    
    const envClient = createClientWithEnvironmentProxy();
    console.log('✓ Client created with environment proxy');
    console.log('  Proxy detected from environment:', process.env.HTTPS_PROXY);
    
    // Example 2: Explicit proxy configuration
    console.log('\n2. Testing explicit proxy configuration...');
    const explicitClient = createClientWithProxy();
    const config = explicitClient.getConfig();
    console.log('✓ Client created with explicit proxy');
    console.log('  Proxy URL:', config.proxy?.url);
    
    // Example 3: Authenticated proxy
    console.log('\n3. Testing authenticated proxy...');
    const authClient = createClientWithAuthenticatedProxy();
    const authConfig = authClient.getConfig();
    console.log('✓ Client created with authenticated proxy');
    console.log('  Proxy URL:', authConfig.proxy?.url);
    console.log('  Has authentication:', !!(authConfig.proxy?.username && authConfig.proxy?.password));
    
    // Example 4: Using wrapper class
    console.log('\n4. Testing proxy wrapper class...');
    const wrapperClient = new ProxyAwareTesouroClient(
      {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        endpoint: 'https://api.sandbox.tesouro.com/graphql'
      },
      {
        url: 'http://wrapper-proxy.example.com:8080',
        username: 'proxy-user',
        password: 'proxy-pass'
      }
    );
    
    console.log('✓ Wrapper client created');
    console.log('  Is proxy configured:', wrapperClient.isProxyConfigured());
    console.log('  Proxy config:', wrapperClient.getProxyConfig());
    
    // Note: In a real environment, you would test actual connectivity
    // console.log('  Connection test:', await wrapperClient.testConnection());
    
  } catch (error) {
    console.error('Error in proxy demonstration:', error);
  } finally {
    // Clean up environment
    delete process.env.HTTPS_PROXY;
  }
}

// Export for testing or direct usage
export { demonstrateProxyUsage };

// Example environment setup script
export function printProxyEnvironmentGuide() {
  console.log(`
=== Proxy Environment Variables Setup ===

To use proxy with environment variables, set one of these:

Linux/macOS:
  export HTTPS_PROXY=http://proxy.company.com:8080
  export HTTP_PROXY=http://proxy.company.com:8080

Windows:
  set HTTPS_PROXY=http://proxy.company.com:8080
  set HTTP_PROXY=http://proxy.company.com:8080

With authentication:
  export HTTPS_PROXY=http://username:password@proxy.company.com:8080

Priority order:
  1. HTTPS_PROXY (highest priority for HTTPS requests)
  2. HTTP_PROXY
  3. https_proxy (lowercase)
  4. http_proxy (lowercase)

Note: Explicit proxy configuration in the client always overrides environment variables.
`);
}