/**
 * Simple Mutations Example
 * 
 * This example demonstrates basic GraphQL mutations for common payment flows
 * using the generated client methods and TypeScript types.
 */

import { 
  TesouroClient, 
  type MutationAuthorizeCustomerInitiatedTransactionArgs,
  type MutationCaptureAuthorizationArgs,
  type MutationRefundPreviousPaymentArgs,
  type AuthorizeCustomerInitiatedTransactionInput,
  type CaptureAuthorizationInput,
  type RefundPreviousPaymentInput,
  GraphQLError,
  NetworkError
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

// Example 1: Simple authorization
export async function simpleAuthorization() {
  const client = setupClient();

  console.log('🔄 Example 1: Simple Authorization...');

  try {
    const input: AuthorizeCustomerInitiatedTransactionInput = {
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

// Example 2: Authorization followed by capture
export async function authorizationAndCapture() {
  const client = setupClient();

  console.log('🔄 Example 2: Authorization + Capture Flow...');

  try {
    // Step 1: Authorize
    console.log('📋 Step 1: Authorizing payment...');
    
    const authInput: AuthorizeCustomerInitiatedTransactionInput = {
      acceptorId: 'f5f5dc3d-bc68-4f43-bcc5-dd8fe88fda76', // Replace with your acceptor ID
      transactionReference: `auth-capture-${Date.now()}`,
      automaticCapture: 'NEVER',
      transactionAmountDetails: {
        totalAmount: 45.00,
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

    const authResult = await client.authorizeCustomerInitiatedTransaction({
      authorizeCustomerInitiatedTransactionInput: authInput
    });

    const authResponse = authResult.data!.authorizeCustomerInitiatedTransaction.authorizationResponse;
    if (!authResponse) {
      throw new Error('No authorization response received');
    }
    console.log(`✅ Authorization successful - ID: ${authResponse.transactionId}`);

    // Step 2: Capture the authorization
    console.log('📋 Step 2: Capturing authorization...');
    
    const captureInput: CaptureAuthorizationInput = {
      acceptorId: '12345678-1234-1234-1234-123456789012', // Same acceptor ID
      paymentId: authResponse.paymentId!,
      transactionAmountDetails: {
        totalAmount: authInput.transactionAmountDetails.totalAmount, // Capture full amount
        currency: authInput.transactionAmountDetails.currency
      },
      transactionReference: `capture-${Date.now()}`
    };

    const captureResult = await client.captureAuthorization({
      captureAuthorizationInput: captureInput
    });

    const captureResponse = captureResult.data!.captureAuthorization.captureAuthorizationResponse;
    if (!captureResponse) {
      throw new Error('No capture response received');
    }
    console.log(`✅ Capture successful - Payment ID: ${captureResponse.paymentId}`);
    console.log(`📅 Activity Date: ${captureResponse.activityDate}`);

    return {
      authorization: authResponse,
      capture: captureResponse
    };

  } catch (error) {
    console.error('❌ Authorization + Capture flow failed:', error);
    throw error;
  }
}

// Example 3: Full payment lifecycle (auth -> capture -> refund)
export async function fullPaymentLifecycle() {
  const client = setupClient();

  console.log('🔄 Example 3: Full Payment Lifecycle (Auth → Capture → Refund)...');

  try {
    // Step 1: Authorize
    console.log('📋 Step 1: Authorizing payment...');
    
    const authInput: CustomerInitiatedTransactionAuthorizationInput = {
      acceptorId: 'f5f5dc3d-bc68-4f43-bcc5-dd8fe88fda76', // Replace with your acceptor ID
      transactionReference: `lifecycle-auth-${Date.now()}`,
      automaticCapture: 'NEVER',
      transactionAmountDetails: {
        totalAmount: 75.50,
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

    const authResult = await client.authorizeCustomerInitiatedTransaction({
      authorizeCustomerInitiatedTransactionInput: authInput
    });

    const authResponse = authResult.data!.authorizeCustomerInitiatedTransaction.authorizationResponse;
    if (!authResponse) {
      throw new Error('No authorization response received');
    }
    console.log(`✅ Step 1 Complete - Authorization ID: ${authResponse.transactionId}`);

    // Step 2: Capture the authorization
    console.log('📋 Step 2: Capturing authorization...');
    
    const captureInput: CaptureAuthorizationInput = {
      acceptorId: '12345678-1234-1234-1234-123456789012', // Same acceptor ID
      paymentId: authResponse.paymentId!,
      transactionAmountDetails: {
        totalAmount: authInput.transactionAmountDetails.totalAmount,
        currency: authInput.transactionAmountDetails.currency
      },
      transactionReference: `lifecycle-capture-${Date.now()}`
    };

    const captureResult = await client.captureAuthorization({
      captureAuthorizationInput: captureInput
    });

    const captureResponse = captureResult.data!.captureAuthorization.captureAuthorizationResponse;
    if (!captureResponse) {
      throw new Error('No capture response received');
    }
    console.log(`✅ Step 2 Complete - Capture Payment ID: ${captureResponse.paymentId}`);

    // Step 3: Refund the payment
    console.log('📋 Step 3: Refunding payment...');
    
    const refundInput: RefundPreviousPaymentInput = {
      acceptorId: '12345678-1234-1234-1234-123456789012', // Same acceptor ID
      paymentId: captureResponse.paymentId!,
      transactionAmountDetails: {
        totalAmount: 30.00, // Partial refund
        currency: authInput.transactionAmountDetails.currency
      },
      transactionReference: `lifecycle-refund-${Date.now()}`
    };

    const refundResult = await client.refundPreviousPayment({
      refundPreviousPaymentInput: refundInput
    });

    const refundResponse = refundResult.data!.refundPreviousPayment.refundPreviousPaymentResponse;
    if (!refundResponse) {
      throw new Error('No refund response received');
    }
    console.log(`✅ Step 3 Complete - Refund Payment ID: ${refundResponse.paymentId}`);
    console.log(`📅 Activity Date: ${refundResponse.activityDate}`);

    console.log('\n🎉 Full payment lifecycle completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`  Authorized: $${authInput.transactionAmountDetails.totalAmount}`);
    console.log(`  Captured: $${captureInput.transactionAmountDetails?.totalAmount || 0}`);
    console.log(`  Refunded: $${refundInput.transactionAmountDetails?.totalAmount || 0}`);
    console.log(`  Net Amount: $${(captureInput.transactionAmountDetails?.totalAmount || 0) - (refundInput.transactionAmountDetails?.totalAmount || 0)}`);

    return {
      authorization: authResponse,
      capture: captureResponse,
      refund: refundResponse
    };

  } catch (error) {
    console.error('❌ Full payment lifecycle failed:', error);
    throw error;
  }
}

// Example 4: Handling validation errors (missing required field)
export async function handleValidationError() {
  const client = setupClient();

  console.log('🔄 Example 4: Handling Validation Errors...');

  try {
    // Intentionally create invalid input (missing required fields)
    const invalidInput: AuthorizeCustomerInitiatedTransactionInput = {
      // Missing acceptorId (required field)
      transactionReference: `validation-test-${Date.now()}`,
      automaticCapture: 'NEVER',
      transactionAmountDetails: {
        totalAmount: 50.00,
        currency: 'USD'
      },
      paymentMethodDetails: {
        cardWithPanDetails: {
          accountNumber: '', // Invalid: empty account number
          paymentEntryMode: 'KEYED',
          expirationMonth: '12',
          expirationYear: '2025',
          securityCode: {
            value: '123'
          }
        }
      }
    } as AuthorizeCustomerInitiatedTransactionInput; // Type assertion to bypass TypeScript validation

    console.log('💳 Attempting authorization with invalid input...');
    console.log('⚠️  Note: This should fail due to missing acceptorId and empty account number');

    const result = await client.authorizeCustomerInitiatedTransaction({
      authorizeCustomerInitiatedTransactionInput: invalidInput
    });

    // This shouldn't be reached if validation works properly
    console.log('⚠️ Unexpected: Authorization succeeded despite invalid input');
    return result.data!.authorizeCustomerInitiatedTransaction.authorizationResponse;

  } catch (error) {
    console.log('✅ Expected error occurred - demonstrating error handling:');
    
    if (error instanceof GraphQLError) {
      console.log('📝 GraphQL Validation Error:');
      console.log(`  Message: ${error.message}`);
      console.log(`  Path: ${error.path?.join(' → ')}`);
      
      if (error.extensions) {
        console.log(`  Error Code: ${error.extensions.code}`);
        console.log(`  Extensions:`, JSON.stringify(error.extensions, null, 2));
      }
      
      // Handle specific validation error types
      if (error.extensions?.code === 'VALIDATION_ERROR') {
        console.log('🔍 This is a validation error - check input fields');
      }
      
    } else if (error instanceof NetworkError) {
      console.log('🌐 Network Error:');
      console.log(`  Status: ${error.statusCode}`);
      console.log(`  Message: ${error.message}`);
      
    } else {
      console.log('❓ Other Error Type:');
      console.log(`  Type: ${error.constructor.name}`);
      console.log(`  Message: ${error.message}`);
    }
    
    console.log('\n💡 In a real application, you would:');
    console.log('  - Validate input before sending requests');
    console.log('  - Show user-friendly error messages');
    console.log('  - Log errors for debugging');
    console.log('  - Possibly retry with corrected data');
    
    // Re-throw to demonstrate error propagation
    throw error;
  }
}

// Example usage function
export async function runSimpleMutationExamples() {
  console.log('🧪 Testing Simple Mutation Examples...\n');

  try {
    // Example 1: Simple authorization
    console.log('📝 Test 1: Simple authorization...');
    await simpleAuthorization();
    console.log('\n---\n');

    // Example 2: Authorization and capture
    console.log('📝 Test 2: Authorization + Capture...');
    await authorizationAndCapture();
    console.log('\n---\n');

    // Example 3: Full lifecycle
    console.log('📝 Test 3: Full payment lifecycle...');
    await fullPaymentLifecycle();
    console.log('\n---\n');

    // Example 4: Error handling (this will throw an error)
    console.log('📝 Test 4: Error handling...');
    try {
      await handleValidationError();
    } catch (error) {
      console.log('✅ Error handling example completed (error was expected)');
    }

    console.log('\n🎉 All simple mutation examples completed!');

  } catch (error) {
    console.error('❌ Simple mutation examples failed:', error);
  }
}