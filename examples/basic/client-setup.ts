/**
 * Basic Client Setup Example
 * 
 * This example demonstrates how to initialize the Tesouro SDK client
 * with different configuration options.
 */

import { createClient, ApiClient, type ApiClientConfig } from '../../src/index';

// Example 1: Basic client setup with minimal configuration
export function createBasicClient(): ApiClient {
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql'
  };

  return createClient(config);
}

// Example 2: Client setup with custom token endpoint
export function createClientWithCustomTokenEndpoint(): ApiClient {
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token'
  };

  return createClient(config);
}

// Example 3: Client setup with existing access token
export function createClientWithExistingToken(): ApiClient {
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    accessToken: 'your-existing-access-token'
  };

  return createClient(config);
}

// Example 4: Client setup with custom headers and timeout
export function createClientWithCustomOptions(): ApiClient {
  const config: ApiClientConfig = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    timeout: 30000, // 30 seconds
    headers: {
      'User-Agent': 'MyApp/1.0.0',
      'X-Custom-Header': 'custom-value'
    }
  };

  return createClient(config);
}

// Example 5: Environment-based configuration
export function createClientFromEnvironment(): ApiClient {
  // Load configuration from environment variables
  const config: ApiClientConfig = {
    clientId: process.env.TESOURO_CLIENT_ID!,
    clientSecret: process.env.TESOURO_CLIENT_SECRET!,
    endpoint: process.env.TESOURO_ENDPOINT || 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: process.env.TESOURO_TOKEN_ENDPOINT || 'https://api.sandbox.tesouro.com/openid/connect/token'
  };

  // Validate required environment variables
  if (!config.clientId || !config.clientSecret) {
    throw new Error(
      'Missing required environment variables: TESOURO_CLIENT_ID and TESOURO_CLIENT_SECRET'
    );
  }

  return createClient(config);
}

// Example 6: Class-based client wrapper
export class TesouroApiWrapper {
  private client: ApiClient;

  constructor(config: ApiClientConfig) {
    this.client = createClient(config);
  }

  // Check if client is authenticated
  isAuthenticated(): boolean {
    return this.client.isAuthenticated();
  }

  // Get current access token
  getCurrentToken(): string | null {
    return this.client.getAccessToken();
  }

  // Manually refresh token
  async refreshToken(): Promise<void> {
    await this.client.refreshToken();
  }

  // Get the underlying client for direct access
  getClient(): ApiClient {
    return this.client;
  }

  // Get current configuration
  getConfig() {
    return this.client.getConfig();
  }
}

// Example usage
async function exampleUsage() {
  try {
    // Create client from environment
    const client = createClientFromEnvironment();
    
    // Check authentication status
    console.log('Is authenticated:', client.isAuthenticated());
    
    // Get configuration (read-only copy)
    const config = client.getConfig();
    console.log('Endpoint:', config.endpoint);
    console.log('Timeout:', config.timeout);
    
    // Manual token refresh if needed
    if (!client.isAuthenticated()) {
      console.log('Refreshing token...');
      await client.refreshToken();
      console.log('Token refreshed successfully');
    }
    
  } catch (error) {
    console.error('Failed to setup client:', error);
  }
}

// Export for testing or direct usage
export { exampleUsage };