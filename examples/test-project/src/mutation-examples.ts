#!/usr/bin/env tsx

/**
 * Mutation Examples Test
 * 
 * Tests the basic mutation examples against the real API
 */

import 'dotenv/config';
import { 
  GeneratedApiClient, 
  type MutationAuthorizeCustomerInitiatedTransactionArgs,
  type MutationCaptureAuthorizationArgs,
  type MutationRefundPreviousPaymentArgs,
  type CustomerInitiatedTransactionAuthorizationInput,
  type CaptureAuthorizationInput,
  type RefundPreviousPaymentInput,
  GraphQLError,
  NetworkError
} from '@tesouro/tesouro-sdk-for-node';

// Setup client using the generated client
function setupClient(): GeneratedApiClient {
  return new GeneratedApiClient({
    clientId: process.env.TESOURO_CLIENT_ID!,
    clientSecret: process.env.TESOURO_CLIENT_SECRET!,
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token'
  });
}

// Example 1: Simple authorization
async function simpleAuthorization() {
  const client = setupClient();

  console.log('🔄 Example 1: Simple Authorization...');

  try {
    const input: CustomerInitiatedTransactionAuthorizationInput = {
      acceptorId: 'f5f5dc3d-bc68-4f43-bcc5-dd8fe88fda76', // Replace with your acceptor ID
      transactionReference: `auth-${Date.now()}`,
      automaticCapture: 'NEVER',
      transactionAmountDetails: {
        totalAmount: 25.99,
        currency: 'USD'
      },
      paymentMethodDetails: {
        cardWithPanDetails: {
          accountNumber: '4100000000000001',
          paymentEntryMode: 'KEYED',
          expirationMonth: '12',
          expirationYear: '2025',
          securityCode: {
            value: '123'
          }
        }
      }
    };

    const variables: MutationAuthorizeCustomerInitiatedTransactionArgs = {
      authorizeCustomerInitiatedTransactionInput: input
    };

    console.log(`💳 Authorizing $${input.transactionAmountDetails.totalAmount} ${input.transactionAmountDetails.currency} - Ref: ${input.transactionReference}`);

    const result = await client.authorizeCustomerInitiatedTransaction(variables);
    const authResponse = result.data!.authorizeCustomerInitiatedTransaction.authorizationResponse;

    if (authResponse) {
      console.log('✅ Authorization successful!');
      console.log(`🆔 Transaction ID: ${authResponse.transactionId}`);
      console.log(`💰 Payment ID: ${authResponse.paymentId}`);
      console.log(`📅 Activity Date: ${authResponse.activityDate}`);
      
      return authResponse;
    } else {
      throw new Error('No authorization response received');
    }

  } catch (error) {
    console.error('❌ Authorization failed:', error);
    throw error;
  }
}

async function testMutationExamples() {
  console.log('🧪 Testing Simple Mutation Examples against API...\n');

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

    // Run the mutation examples
    console.log('📝 Test 1: Simple authorization...');
    await simpleAuthorization();

    console.log('\n🎉 Mutation examples test completed successfully!');

  } catch (error) {
    console.error('❌ Mutation examples test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMutationExamples();
}

export { testMutationExamples };