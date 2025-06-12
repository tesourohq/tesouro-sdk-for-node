# GraphQL API SDK Specification

## Overview

A Node.js SDK providing a thin wrapper over a GraphQL API, abstracting GraphQL complexity and providing a familiar JavaScript/TypeScript interface for third-party developers. The SDK will auto-generate strongly-typed methods from the GraphQL schema and handle authentication transparently.

## Core Requirements

### Language & Module Support
- **TypeScript** with full type definitions auto-generated from GraphQL schema
- **Modern async/await** syntax throughout
- **Dual module support**: CommonJS and ES modules
- **Node.js versions**: 16.x and above

### Architecture

```typescript
// Single client class pattern
import { ApiClient } from '@tesouro/sdk';

const client = new ApiClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  endpoint: 'https://api.sandbox.tesouro.com/graphql',
  timeout: 30000 // milliseconds
});

// Usage
const user = await client.getUser({ id: '123' });
const result = await client.createTransaction({ amount: 100, currency: 'USD' });
```

## Authentication

### OpenID Connect Flow
1. SDK exchanges client credentials for JWT token on first request
2. Stores token in memory (not localStorage)
3. Automatically refreshes token before expiration
4. Adds `Authorization: Bearer <token>` header to all GraphQL requests

### Implementation Details
```typescript
class AuthManager {
  private token: string | null = null;
  private tokenExpiry: Date | null = null;
  
  async getToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.token!;
    }
    return this.refreshToken();
  }
  
  private async refreshToken(): Promise<string> {
    // OpenID Connect token endpoint call
    // Store token and calculate expiry
  }
}
```

## Error Handling

### Error Class Hierarchy

```typescript
// Base error class
export class SdkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SdkError';
  }
}

// Network errors
export class NetworkError extends SdkError {
  statusCode?: number;
  requestId?: string;
  timestamp: Date;
  
  constructor(message: string, statusCode?: number, requestId?: string) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.requestId = requestId;
    this.timestamp = new Date();
  }
}

// GraphQL errors (Stage 6A)
export class GraphQLError extends SdkError {
  code: string;
  path?: (string | number)[];
  extensions?: Record<string, any>;
  
  constructor(error: GraphQLErrorType) {
    super(error.message);
    this.name = 'GraphQLError';
    this.code = error.extensions?.code || 'UNKNOWN_ERROR';
    this.path = error.path;
    this.extensions = error.extensions;
  }
}

// Specific Stage 6A errors (auto-generated)
export class ValidationError extends GraphQLError {
  field: string;
  constraint: string;
}

export class AuthorizationError extends GraphQLError {
  requiredPermission: string;
}

export class ResourceNotFoundError extends GraphQLError {
  resourceType: string;
  resourceId: string;
}
```

### Error Detection Logic

```typescript
private handleResponse(response: any) {
  // Check for Stage 6A errors in mutation responses
  if (response.errors && response.errors.length > 0) {
    const error = response.errors[0];
    throw this.createTypedError(error);
  }
  
  // Check for top-level GraphQL errors
  if (response.errors) {
    throw new GraphQLError(response.errors[0]);
  }
  
  return response.data;
}
```

## Code Generation

### GraphQL Code Generator Configuration

```yaml
# codegen.yml
overwrite: true
schema: "./schema.graphql"
generates:
  ./src/generated/index.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-generic-sdk
    config:
      # Generate types for all operations
      withHooks: false
      withComponent: false
      withHOC: false
      
      # Type generation settings
      scalars:
        DateTime: Date
        JSON: Record<string, any>
      
      # Naming conventions
      namingConvention:
        typeNames: pascal-case#pascalCase
        enumValues: UPPER_CASE#upperCase
```

### Custom Code Generator Plugin

```typescript
// codegen-plugin.ts
module.exports = {
  plugin: (schema, documents, config) => {
    // Generate method for each query/mutation
    const operations = [];
    
    // Parse schema and generate:
    // 1. Typed method signatures
    // 2. Implementation that calls base request method
    // 3. Error type mappings for Stage 6A errors
    
    return {
      prepend: ['// Auto-generated file. Do not edit.'],
      content: operations.join('\n')
    };
  }
};
```

## File Structure

```
package-root/
├── src/
│   ├── index.ts           # Main export file
│   ├── client.ts          # ApiClient class
│   ├── auth.ts            # Authentication logic
│   ├── errors.ts          # Base error classes
│   ├── request.ts         # HTTP/GraphQL request logic
│   └── generated/         # Auto-generated code
│       └── index.ts       # All generated types & methods
├── schema.graphql         # Checked-in GraphQL schema
├── codegen.yml           # GraphQL Code Generator config
├── tsconfig.json         # TypeScript configuration
├── package.json          # Package configuration
├── .gitignore
└── README.md
```

## Build Configuration

### Package.json

```json
{
  "name": "@tesouro/tesouro-sdk-for-node",
  "version": "0.0.1",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js",
      "import": "./dist/esm/index.js",
      "types": "./dist/types/index.d.ts"
    }
  },
  "scripts": {
    "codegen": "graphql-codegen",
    "build": "npm run codegen && npm run build:cjs && npm run build:esm && npm run build:types",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:esm": "tsc -p tsconfig.esm.json",
    "build:types": "tsc -p tsconfig.types.json",
    "test": "jest",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "graphql": "^16.0.0",
    "graphql-request": "^6.0.0",
    "jose": "^5.0.0"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.0",
    "@graphql-codegen/typescript": "^4.0.0",
    "@graphql-codegen/typescript-operations": "^4.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

### TypeScript Configuration

```json
// tsconfig.json (base)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## API Design Examples

### Generated Method Signatures

```typescript
// Auto-generated from GraphQL schema
export class ApiClient {
  // Queries
  async getUser(variables: GetUserQueryVariables): Promise<User> { }
  async listTransactions(variables: ListTransactionsQueryVariables): Promise<Transaction[]> { }
  async getRiskAssessment(variables: GetRiskAssessmentQueryVariables): Promise<RiskAssessment> { }
  
  // Mutations
  async createUser(variables: CreateUserMutationVariables): Promise<User> { }
  async processTransaction(variables: ProcessTransactionMutationVariables): Promise<TransactionResult> { }
  async updateRiskProfile(variables: UpdateRiskProfileMutationVariables): Promise<RiskProfile> { }
}

// Generated types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface CreateUserMutationVariables {
  input: CreateUserInput;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}
```

## Testing Strategy

### Unit Tests
- Mock OpenID Connect token endpoint
- Test token refresh logic
- Test error transformation (Stage 6A → SDK errors)
- Test request timeout handling

### Integration Tests
- Test against GraphQL schema using schema mocking
- Validate generated types match schema
- Test error scenarios with mocked error responses

### Example Test

```typescript
describe('ApiClient', () => {
  it('should handle Stage 6A validation errors', async () => {
    const client = new ApiClient({ /* config */ });
    
    // Mock response with Stage 6A error
    mockGraphQLResponse({
      data: null,
      errors: [{
        message: 'Email already exists',
        extensions: {
          code: 'VALIDATION_ERROR',
          field: 'email'
        }
      }]
    });
    
    await expect(client.createUser({ 
      input: { email: 'existing@example.com' } 
    })).rejects.toThrow(ValidationError);
  });
});
```

## Implementation Timeline

1. **Phase 1**: Core infrastructure (1 week)
   - Client class structure
   - Authentication manager
   - Base error classes

2. **Phase 2**: Code generation (1 week)
   - GraphQL Code Generator setup
   - Custom plugin for method generation
   - Stage 6A error type generation

3. **Phase 3**: Build & packaging (3 days)
   - Dual module build setup
   - TypeScript configurations
   - NPM package preparation

4. **Phase 4**: Testing & documentation (4 days)
   - Unit & integration tests
   - API documentation generation
   - Usage examples

## Security Considerations

- Client credentials stored securely (environment variables)
- Tokens stored only in memory
- No sensitive data in error messages
- Request timeout to prevent hanging connections

## Future Enhancements (Out of Scope)

- Retry logic with exponential backoff
- Request/response interceptors
- Caching layer
- Batch query support
- WebSocket subscriptions
- File upload support