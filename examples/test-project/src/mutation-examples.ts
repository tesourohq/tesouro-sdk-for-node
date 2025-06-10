#!/usr/bin/env tsx

/**
 * Mutation Examples Test
 * 
 * Tests the basic mutation examples against the real API
 */

import 'dotenv/config';
import { randomUUID } from 'crypto';
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
      transactionReference: randomUUID(),
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

// Example 2: Complete payment lifecycle (authorize -> capture -> refund)
async function completePaymentLifecycle() {
  const client = setupClient();

  console.log('🔄 Example 2: Complete Payment Lifecycle (Auth → Capture → Refund)...');

  try {
    // Step 1: Authorize the payment
    console.log('\n📋 Step 1: Authorizing payment...');
    
    const authInput: CustomerInitiatedTransactionAuthorizationInput = {
      acceptorId: 'f5f5dc3d-bc68-4f43-bcc5-dd8fe88fda76',
      transactionReference: randomUUID(),
      automaticCapture: 'NEVER', // Important: Don't auto-capture so we can manually capture later
      transactionAmountDetails: {
        totalAmount: 100.00,
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

    console.log(`💳 Authorizing $${authInput.transactionAmountDetails.totalAmount} ${authInput.transactionAmountDetails.currency} - Ref: ${authInput.transactionReference}`);

    const authResult = await client.authorizeCustomerInitiatedTransaction({
      authorizeCustomerInitiatedTransactionInput: authInput
    });

    const authResponse = authResult.data!.authorizeCustomerInitiatedTransaction.authorizationResponse;
    if (!authResponse) {
      throw new Error('No authorization response received');
    }

    console.log('✅ Step 1 Complete - Authorization successful!');
    console.log(`🆔 Transaction ID: ${authResponse.transactionId}`);
    console.log(`💰 Payment ID: ${authResponse.paymentId}`);

    // Step 2: Capture the authorization (full amount by default)
    console.log('\n📋 Step 2: Capturing the authorization...');
    
    const captureInput: CaptureAuthorizationInput = {
      acceptorId: 'f5f5dc3d-bc68-4f43-bcc5-dd8fe88fda76', // Same acceptor ID
      paymentId: authResponse.paymentId!,
      transactionReference: randomUUID()
      // Note: No transactionAmountDetails - API will capture the full authorized amount by default
    };

    console.log(`💰 Capturing full authorized amount for payment ${captureInput.paymentId} - Ref: ${captureInput.transactionReference}`);

    const captureResult = await client.captureAuthorization({
      captureAuthorizationInput: captureInput
    });

    const captureResponse = captureResult.data!.captureAuthorization.captureAuthorizationResponse;
    if (!captureResponse) {
      throw new Error('No capture response received');
    }

    console.log('✅ Step 2 Complete - Capture successful!');
    console.log(`🆔 Capture Transaction ID: ${captureResponse.transactionId}`);
    console.log(`💰 Capture Payment ID: ${captureResponse.paymentId}`);

    // Step 3: Partial refund of the captured payment
    console.log('\n📋 Step 3: Processing partial refund...');
    
    const refundInput: RefundPreviousPaymentInput = {
      acceptorId: 'f5f5dc3d-bc68-4f43-bcc5-dd8fe88fda76', // Same acceptor ID
      paymentId: captureResponse.paymentId!,
      transactionAmountDetails: {
        totalAmount: 25.00, // Partial refund of $25.00 out of $100.00
        currency: authInput.transactionAmountDetails.currency
      },
      transactionReference: randomUUID()
    };

    console.log(`💸 Refunding $${refundInput.transactionAmountDetails?.totalAmount} ${refundInput.transactionAmountDetails?.currency} from payment ${refundInput.paymentId} - Ref: ${refundInput.transactionReference}`);

    const refundResult = await client.refundPreviousPayment({
      refundPreviousPaymentInput: refundInput
    });

    const refundResponse = refundResult.data!.refundPreviousPayment.refundPreviousPaymentResponse;
    if (!refundResponse) {
      throw new Error('No refund response received');
    }

    console.log('✅ Step 3 Complete - Refund successful!');
    console.log(`🆔 Refund Transaction ID: ${refundResponse.transactionId}`);
    console.log(`💰 Refund Payment ID: ${refundResponse.paymentId}`);
    console.log(`📅 Refund Activity Date: ${refundResponse.activityDate}`);

    // Summary
    console.log('\n🎉 Complete payment lifecycle finished successfully!');
    console.log('📊 Transaction Summary:');
    console.log(`  ➡️  Authorized: $${authInput.transactionAmountDetails.totalAmount} ${authInput.transactionAmountDetails.currency}`);
    console.log(`  ➡️  Captured: Full authorized amount ($${authInput.transactionAmountDetails.totalAmount})`);
    console.log(`  ⬅️  Refunded: $${refundInput.transactionAmountDetails?.totalAmount} ${refundInput.transactionAmountDetails?.currency}`);
    console.log(`  💰 Net Amount: $${authInput.transactionAmountDetails.totalAmount - (refundInput.transactionAmountDetails?.totalAmount || 0)} ${authInput.transactionAmountDetails.currency}`);

    return {
      authorization: authResponse,
      capture: captureResponse,
      refund: refundResponse,
      summary: {
        authorized: authInput.transactionAmountDetails.totalAmount,
        captured: authInput.transactionAmountDetails.totalAmount, // Full amount captured
        refunded: refundInput.transactionAmountDetails?.totalAmount || 0,
        netAmount: authInput.transactionAmountDetails.totalAmount - (refundInput.transactionAmountDetails?.totalAmount || 0),
        currency: authInput.transactionAmountDetails.currency
      }
    };

  } catch (error) {
    console.error('❌ Payment lifecycle failed:', error);
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

    console.log('\n---\n');

    console.log('📝 Test 2: Complete payment lifecycle...');
    await completePaymentLifecycle();

    console.log('\n🎉 All mutation examples completed successfully!');

  } catch (error) {
    console.error('❌ Mutation examples test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMutationExamples();
}

export { testMutationExamples, simpleAuthorization, completePaymentLifecycle };