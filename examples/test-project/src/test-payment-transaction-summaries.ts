#!/usr/bin/env tsx

import 'dotenv/config';
import { GeneratedApiClient } from '@tesouro/tesouro-sdk-for-node';

async function testPaymentTransactionSummaries() {
  console.log('🧪 Testing paymentTransactionSummaries with applicationCounts fix...\n');

  try {
    const client = new GeneratedApiClient({
      clientId: process.env.TESOURO_CLIENT_ID!,
      clientSecret: process.env.TESOURO_CLIENT_SECRET!,
      endpoint: 'https://api.sandbox.tesouro.com/graphql',
      tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token'
    });

    console.log('🚀 Calling paymentTransactionSummaries...');
    
    // Show what we're requesting
    console.log('\n📋 Request Details:');
    console.log('Variables:', JSON.stringify({
      input: {
        paging: { skip: 0, take: 5 },
        where: {
          transactionActivityDate: {
            gte: '2025-06-03',
            lte: '2025-06-09'
          }
        }
      }
    }, null, 2));

    const result = await client.paymentTransactionSummaries({
      input: {
        paging: { skip: 0, take: 5 },
        where: {
          transactionActivityDate: {
            gte: '2025-06-03',
            lte: '2025-06-09'
          }
        }
      }
    });

    console.log('\n📥 Response Data:');
    console.log(JSON.stringify(result, null, 2));

    console.log('\n✅ SUCCESS! Retrieved', result.data.paymentTransactionSummaries.items.length, 'summaries');
    if (result.data.paymentTransactionSummaries.items.length > 0) {
      console.log('First summary:', result.data.paymentTransactionSummaries.items[0]);
    }

  } catch (error: any) {
    console.error('\n❌ FAILED:', error.message);
    
    console.log('\n🔍 Debugging Information:');
    console.log('Error type:', typeof error);
    console.log('Error constructor:', error.constructor.name);
    
    if (error.errors) {
      console.error('\n📋 GraphQL Errors:');
      console.error(JSON.stringify(error.errors, null, 2));
    }
    if (error.extensions) {
      console.error('\n📋 Error Extensions:');
      console.error(JSON.stringify(error.extensions, null, 2));
    }
    if (error.response) {
      console.error('\n📋 HTTP Response:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      if (error.response.data) {
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    console.error('\n📋 Full Error Object:');
    console.error(JSON.stringify(error, null, 2));
  }
}

testPaymentTransactionSummaries();