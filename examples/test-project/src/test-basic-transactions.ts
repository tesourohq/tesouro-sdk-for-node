#!/usr/bin/env tsx

import 'dotenv/config';
import { GeneratedApiClient } from '@tesouro/tesouro-sdk-for-node';

async function testBasicTransactions() {
  console.log('🧪 Testing basic paymentTransactions...\n');

  try {
    const client = new GeneratedApiClient({
      clientId: process.env.TESOURO_CLIENT_ID!,
      clientSecret: process.env.TESOURO_CLIENT_SECRET!,
      endpoint: 'https://api.sandbox.tesouro.com/graphql',
      tokenEndpoint: 'https://api.sandbox.tesouro.com/openid/connect/token'
    });

    console.log('🚀 Calling paymentTransactions...');
    
    const result = await client.paymentTransactions({
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

    console.log('✅ SUCCESS! Retrieved', result.data.paymentTransactions.items.length, 'transactions');

  } catch (error) {
    console.error('❌ FAILED:', error);
  }
}

testBasicTransactions();