/**
 * Tesouro SDK for Node.js
 * 
 * A TypeScript-first GraphQL SDK with OpenID Connect authentication
 */

// Export errors
export { 
  SdkError, 
  NetworkError, 
  GraphQLError,
  type GraphQLErrorPath,
  type GraphQLErrorExtensions 
} from './errors';

/**
 * Simple hello world function for initial setup verification
 * @returns A greeting message
 */
export function hello(): string {
  return 'Hello from Tesouro SDK!';
}

// Export version for programmatic access
export const version = '0.0.1';