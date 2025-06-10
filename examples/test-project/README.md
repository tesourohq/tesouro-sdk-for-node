# Tesouro SDK Test Project

This is a test project for manually testing the Tesouro SDK with real API endpoints.

## Setup

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your real Tesouro API credentials:
   ```
   TESOURO_CLIENT_ID=your-actual-client-id
   TESOURO_CLIENT_SECRET=your-actual-client-secret
   TESOURO_ENDPOINT=https://api.sandbox.tesouro.com/graphql
   TESOURO_TOKEN_ENDPOINT=https://api.sandbox.tesouro.com/openid/connect/token
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Available Tests

- `npm run test:basic` - Tests basic client setup and authentication
- `npm run test:query` - Tests simple GraphQL query execution
- `npm run test:mutation` - Tests mutation with error handling
- `npm run test:auth` - Tests authentication scenarios
- `npm run test:pagination` - Tests comprehensive pagination patterns (5 different approaches)

## Development

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Run the main index.ts file

## Notes

- The `.env` file is gitignored to prevent committing secrets
- This project uses the local SDK via `file:../../` dependency
- Make sure to build the main SDK first with `npm run build` in the root directory