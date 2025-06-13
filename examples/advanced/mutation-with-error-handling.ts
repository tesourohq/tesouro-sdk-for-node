/**
 * Mutation with Error Handling Example
 * 
 * This example demonstrates how to execute GraphQL mutations using the 
 * generated client methods with comprehensive error handling strategies.
 */

import { 
  TesouroClient, 
  type MutationAuthorizeCustomerInitiatedTransactionArgs,
  type AuthorizeCustomerInitiatedTransactionInput,
  type TransactionAmountCurrencyCode,
  type GraphQLResult,
  GraphQLError,
  NetworkError,
  SdkError
} from '../../src/index';

// Setup client using the generated client
function setupClient(): TesouroClient {
  return new TesouroClient({
    clientId: process.env.TESOURO_CLIENT_ID!,
    clientSecret: process.env.TESOURO_CLIENT_SECRET!,
    endpoint: 'https://api.sandbox.tesouro.com/graphql',
    tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token'
  });
}

// Example 1: Basic mutation with error handling
export async function authorizePaymentWithErrorHandling(
  amount: number,
  currency: TransactionAmountCurrencyCode,
  cardNumber: string,
  merchantReference: string
) {
  const client = setupClient();

  try {
    // Prepare mutation input
    const input: AuthorizeCustomerInitiatedTransactionInput = {
      acceptorId: 'f5f5dc3d-bc68-4f43-bcc5-dd8fe88fda76', // Replace with your acceptor ID
      transactionReference: merchantReference,
      automaticCapture: 'NEVER',
      transactionAmountDetails: {
        totalAmount: amount,
        currency
      },
      paymentMethodDetails: {
        cardWithPanDetails: {
          accountNumber: cardNumber,
          paymentEntryMode: 'KEYED',
          expirationMonth: 12,
          expirationYear: 2025,
          securityCode: {
            value: '123'
          }
        }
      }
    };

    const variables: MutationAuthorizeCustomerInitiatedTransactionArgs = {
      authorizeCustomerInitiatedTransactionInput: input
    };

    console.log('🔄 Authorizing payment transaction...');
    console.log('💳 Transaction details:', {
      amount: `${amount} ${currency}`,
      merchantReference,
      automaticCapture: input.automaticCapture
    });

    // Execute the mutation - SDK will throw exceptions for any errors
    const result = await client.authorizeCustomerInitiatedTransaction(variables);

    // Process successful response
    const authResponse = result.data.authorizeCustomerInitiatedTransaction.authorizationResponse;
    
    console.log('✅ Payment authorization completed');
    console.log('📋 Authorization response:', JSON.stringify(authResponse, null, 2));
    
    return authResponse;

  } catch (error) {
    // Comprehensive error handling
    console.error('❌ Payment authorization failed:', error);
    
    if (error instanceof GraphQLError) {
      console.error('📝 GraphQL Error Details:');
      console.error(`  Message: ${error.message}`);
      console.error(`  Path: ${error.path?.join(' -> ')}`);
      console.error(`  Extensions:`, error.extensions);
      
      // Handle specific GraphQL error types
      if (error.extensions?.code === 'INSUFFICIENT_FUNDS') {
        console.error('💰 Insufficient funds - transaction declined');
      } else if (error.extensions?.code === 'INVALID_CARD') {
        console.error('💳 Invalid card details provided');
      } else if (error.extensions?.code === 'VALIDATION_ERROR') {
        console.error('📋 Validation error in input data');
      }
      
    } else if (error instanceof NetworkError) {
      console.error('🌐 Network Error Details:');
      console.error(`  Status: ${error.statusCode}`);
      console.error(`  Request ID: ${error.requestId}`);
      console.error(`  Retryable: ${error.isRetryable()}`);
      
      if (error.statusCode === 401) {
        console.error('🔐 Authentication failed - check credentials');
      } else if (error.statusCode === 403) {
        console.error('🚫 Authorization failed - insufficient permissions');
      } else if (error.statusCode && error.statusCode >= 500) {
        console.error('🔧 Server error - try again later');
      }
      
    } else if (error instanceof SdkError) {
      console.error('⚙️  SDK Error Details:');
      console.error(`  Message: ${error.message}`);
      console.error(`  Timestamp: ${error.timestamp}`);
      if (error.cause) {
        console.error(`  Caused by:`, error.cause);
      }
    } else {
      console.error('❓ Unexpected error type:', error);
    }
    
    throw error;
  }
}

// Example 2: Mutation with validation
export async function authorizePaymentWithValidation(
  amount: number,
  currency: TransactionAmountCurrencyCode,
  cardNumber: string,
  merchantReference: string
) {
  // Input validation
  const validationErrors: string[] = [];
  
  if (!amount || amount <= 0) {
    validationErrors.push('Amount must be greater than 0');
  }
  
  if (!currency || currency.length !== 3) {
    validationErrors.push('Currency must be a 3-character ISO code');
  }
  
  if (!cardNumber || cardNumber.trim().length === 0) {
    validationErrors.push('Card number is required');
  }
  
  if (!merchantReference || merchantReference.trim().length === 0) {
    validationErrors.push('Merchant reference is required');
  }
  
  if (validationErrors.length > 0) {
    console.error('❌ Validation errors:');
    validationErrors.forEach(error => console.error(`  - ${error}`));
    throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
  }
  
  console.log('✅ Input validation passed');
  
  // Proceed with the mutation
  return await authorizePaymentWithErrorHandling(
    amount,
    currency,
    cardNumber,
    merchantReference
  );
}

// Example 3: Mutation with detailed response handling
export async function authorizePaymentWithDetailedResponse(
  amount: number,
  currency: TransactionAmountCurrencyCode,
  cardNumber: string,
  merchantReference: string
) {
  try {
    const response = await authorizePaymentWithErrorHandling(
      amount,
      currency,
      cardNumber,
      merchantReference
    );
    
    // Analyze the response in detail
    console.log('\n📊 Detailed Response Analysis:');
    
    if (response) {
      console.log('✅ Authorization successful');
      
      if (response.transactionId) {
        console.log(`🆔 Transaction ID: ${response.transactionId}`);
      }
      
      if (response.paymentId) {
        console.log(`💳 Payment ID: ${response.paymentId}`);
      }
      
      if (response.activityDate) {
        console.log(`📅 Activity Date: ${response.activityDate}`);
      }
      
    } else {
      console.log('❌ Authorization failed - no response received');
    }
    
    return response;
    
  } catch (error) {
    console.error('❌ Failed to get detailed response:', error);
    throw error;
  }
}

// Example 4: Batch mutation with individual error handling
export async function authorizeMultiplePayments(
  payments: Array<{
    amount: number;
    currency: TransactionAmountCurrencyCode;
    cardNumber: string;
    merchantReference: string;
  }>
) {
  console.log(`🔄 Processing ${payments.length} payment authorizations...`);
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];
    console.log(`\n📋 Processing payment ${i + 1}/${payments.length}: ${payment.merchantReference}`);
    
    try {
      const result = await authorizePaymentWithValidation(
        payment.amount,
        payment.currency,
        payment.cardNumber,
        payment.merchantReference
      );
      
      results.push({
        index: i,
        merchantReference: payment.merchantReference,
        success: true,
        result
      });
      
      console.log(`✅ Payment ${i + 1} authorized successfully`);
      
    } catch (error) {
      console.log(`❌ Payment ${i + 1} failed: ${(error as any).message}`);
      
      errors.push({
        index: i,
        merchantReference: payment.merchantReference,
        success: false,
        error: (error as any).message
      });
    }
  }
  
  console.log('\n📊 Batch Processing Summary:');
  console.log(`✅ Successful: ${results.length}/${payments.length}`);
  console.log(`❌ Failed: ${errors.length}/${payments.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Failed payments:');
    errors.forEach(error => {
      console.log(`  - ${error.merchantReference}: ${error.error}`);
    });
  }
  
  return {
    successful: results,
    failed: errors,
    summary: {
      total: payments.length,
      successful: results.length,
      failed: errors.length,
      successRate: Math.round((results.length / payments.length) * 100)
    }
  };
}

// Example usage function
export async function runMutationExamples() {
  console.log('🧪 Testing Mutation with Error Handling Examples...\n');

  // Example payment data
  const testPayment = {
    amount: 100.50,
    currency: 'USD' as TransactionAmountCurrencyCode,
    cardNumber: '4100000000000001',
    merchantReference: `test-payment-${Date.now()}`
  };

  try {
    // Example 1: Basic mutation with error handling
    console.log('📝 Test 1: Basic payment authorization...');
    await authorizePaymentWithErrorHandling(
      testPayment.amount,
      testPayment.currency,
      testPayment.cardNumber,
      testPayment.merchantReference
    );
    console.log('\n---\n');

    // Example 2: Mutation with validation
    console.log('📝 Test 2: Payment authorization with validation...');
    await authorizePaymentWithValidation(
      testPayment.amount,
      testPayment.currency,
      testPayment.cardNumber,
      `${testPayment.merchantReference}-validated`
    );
    console.log('\n---\n');

    // Example 3: Detailed response handling
    console.log('📝 Test 3: Payment authorization with detailed response...');
    await authorizePaymentWithDetailedResponse(
      testPayment.amount,
      testPayment.currency,
      testPayment.cardNumber,
      `${testPayment.merchantReference}-detailed`
    );
    console.log('\n---\n');

    // Example 4: Batch processing
    console.log('📝 Test 4: Batch payment authorization...');
    const batchPayments = [
      { ...testPayment, merchantReference: `${testPayment.merchantReference}-batch-1` },
      { ...testPayment, merchantReference: `${testPayment.merchantReference}-batch-2` },
      { ...testPayment, amount: 0, merchantReference: `${testPayment.merchantReference}-batch-invalid` }, // This will fail validation
    ];
    
    await authorizeMultiplePayments(batchPayments);

    console.log('\n🎉 All mutation examples completed!');

  } catch (error) {
    console.error('❌ Mutation examples failed:', error);
  }
}