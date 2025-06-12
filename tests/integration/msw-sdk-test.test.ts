/**
 * Test SDK with MSW for better fetch compatibility
 */

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ApiClient } from '../../src/client';

// Set up MSW server
const server = setupServer(
  // Token endpoint
  http.post('https://api.example.com/openid/connect/token', () => {
    console.log('MSW: Token request received');
    return HttpResponse.json({
      access_token: 'test-token-123',
      token_type: 'Bearer',
      expires_in: 3600,
    });
  }),

  // GraphQL endpoint
  http.post('https://api.example.com/graphql', ({ request }) => {
    const authHeader = request.headers.get('authorization');
    console.log('MSW: GraphQL request received, auth:', authHeader);

    if (!authHeader || authHeader !== 'Bearer test-token-123') {
      return HttpResponse.json(
        {
          errors: [{ message: 'Unauthorized' }],
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      data: { __typename: 'Query' },
    });
  })
);

describe('SDK with MSW', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should make authenticated requests successfully', async () => {
    const client = new ApiClient({
      clientId: 'test-client',
      clientSecret: 'test-secret',
      endpoint: 'https://api.example.com/graphql',
    });

    const result = await client.query('query { __typename }');

    expect(result.data).toEqual({ __typename: 'Query' });
  }, 10000);
});
