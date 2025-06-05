# GraphQL SDK Implementation Checklist

## Phase 1: Foundation (Steps 1-2)

### Step 1: Project Initialization
- [ ] Create new directory for project
- [ ] Initialize npm with `npm init`
- [ ] Set package name to `@tesouro/tesouro-sdk-for-node`
- [ ] Set version to `0.0.1`
- [ ] Install TypeScript as dev dependency
- [ ] Create `tsconfig.json` with strict mode enabled
- [ ] Set TypeScript target to ES2020
- [ ] Create `.gitignore` file
  - [ ] Add node_modules
  - [ ] Add dist/
  - [ ] Add coverage/
  - [ ] Add .env files
- [ ] Create `src/` directory
- [ ] Create `src/index.ts` with hello world function
- [ ] Add build script to package.json
- [ ] Add test script placeholder to package.json
- [ ] Write basic test to verify setup
- [ ] Verify TypeScript compilation works
- [ ] Commit initial project structure

### Step 2: Testing Framework Setup
- [ ] Install Jest and ts-jest as dev dependencies
- [ ] Install @types/jest
- [ ] Create `jest.config.js`
  - [ ] Configure ts-jest preset
  - [ ] Set test environment to node
  - [ ] Enable coverage collection
  - [ ] Set coverage thresholds (80% minimum)
  - [ ] Configure coverage reporters (text, lcov)
- [ ] Create `tests/` directory structure
- [ ] Create sample test file `tests/index.test.ts`
- [ ] Update test script in package.json
- [ ] Add test:watch script
- [ ] Add test:coverage script
- [ ] Verify Jest runs with TypeScript
- [ ] Run coverage report
- [ ] Commit testing setup

## Phase 2: Core Components (Steps 3-9)

### Step 3: Error System Foundation
- [ ] Create `src/errors.ts`
- [ ] Implement base `SdkError` class
  - [ ] Extend native Error class
  - [ ] Fix prototype chain for TypeScript
  - [ ] Add error name property
  - [ ] Add timestamp property
  - [ ] Implement toJSON() method
- [ ] Create `tests/errors.test.ts`
  - [ ] Test instanceof SdkError
  - [ ] Test instanceof Error
  - [ ] Test error name is set correctly
  - [ ] Test stack trace preservation
  - [ ] Test JSON serialization
- [ ] Export SdkError from index.ts
- [ ] Run tests and verify coverage
- [ ] Commit error foundation

### Step 4: Network and GraphQL Error Classes
- [ ] Add `NetworkError` class to errors.ts
  - [ ] Add statusCode property
  - [ ] Add requestId property
  - [ ] Add timestamp property
  - [ ] Add isRetryable() method
- [ ] Add `GraphQLError` class to errors.ts
  - [ ] Add code property
  - [ ] Add path property
  - [ ] Add extensions property
  - [ ] Define GraphQL error type interface
- [ ] Update tests for NetworkError
  - [ ] Test all properties
  - [ ] Test inheritance
  - [ ] Test retryable logic
- [ ] Update tests for GraphQLError
  - [ ] Test all properties
  - [ ] Test inheritance
  - [ ] Test type safety
- [ ] Export new error classes
- [ ] Run tests and verify coverage
- [ ] Commit extended error system

### Step 5: Authentication Manager Structure
- [ ] Create `src/auth.ts`
- [ ] Create `AuthManager` class
  - [ ] Add private token property
  - [ ] Add private tokenExpiry property
  - [ ] Add constructor with client credentials
  - [ ] Implement isTokenValid() method
  - [ ] Add placeholder getToken() method
- [ ] Create `tests/auth.test.ts`
  - [ ] Test token storage
  - [ ] Test token validity checking (no token)
  - [ ] Test token validity checking (expired token)
  - [ ] Test token validity checking (valid token)
  - [ ] Test token expiry calculation
  - [ ] Test encapsulation
- [ ] Use mock tokens for testing
- [ ] Export AuthManager from index.ts
- [ ] Run tests and verify coverage
- [ ] Commit auth manager structure

### Step 6: Configuration Types and Validation
- [ ] Create `src/types.ts`
- [ ] Define `ClientConfig` interface
  - [ ] Add required: clientId, clientSecret, endpoint
  - [ ] Add optional: timeout, headers, retry config
  - [ ] Add JSDoc comments
- [ ] Define `AuthConfig` interface
- [ ] Define `RequestConfig` interface
- [ ] Create type guard functions
  - [ ] isValidClientConfig()
  - [ ] isValidAuthConfig()
- [ ] Create config validation utilities
  - [ ] Apply default values
  - [ ] Validate required fields
- [ ] Create `tests/types.test.ts`
  - [ ] Test type guards
  - [ ] Test default value application
  - [ ] Test invalid config rejection
- [ ] Export types from index.ts
- [ ] Run tests and verify coverage
- [ ] Commit configuration types

### Step 7: HTTP Request Wrapper
- [ ] Create `src/request.ts`
- [ ] Implement `makeRequest` function
  - [ ] Accept URL, options, timeout
  - [ ] Implement AbortController for timeout
  - [ ] Handle fetch errors
  - [ ] Create NetworkError on failure
  - [ ] Parse JSON responses
  - [ ] Support custom headers
- [ ] Create `tests/request.test.ts`
  - [ ] Mock global fetch
  - [ ] Test successful requests
  - [ ] Test timeout handling
  - [ ] Test network errors
  - [ ] Test JSON parsing
  - [ ] Test header merging
- [ ] Handle node-fetch for older Node versions
- [ ] Export request utilities
- [ ] Run tests and verify coverage
- [ ] Commit HTTP wrapper

### Step 8: GraphQL Request Builder
- [ ] Extend `src/request.ts` with GraphQL support
- [ ] Add `graphqlRequest` function
  - [ ] Format GraphQL request body
  - [ ] Set Content-Type header
  - [ ] Handle query and variables
  - [ ] Detect GraphQL errors
  - [ ] Return typed responses
- [ ] Define GraphQL types
  - [ ] GraphQLResponse interface
  - [ ] GraphQLError interface
  - [ ] GraphQLRequestOptions
- [ ] Update tests for GraphQL
  - [ ] Test query formatting
  - [ ] Test variable inclusion
  - [ ] Test error detection
  - [ ] Test successful data return
- [ ] Export GraphQL utilities
- [ ] Run tests and verify coverage
- [ ] Commit GraphQL request layer

### Step 9: Client Class Foundation
- [ ] Create `src/client.ts`
- [ ] Create `ApiClient` class
  - [ ] Add typed constructor
  - [ ] Store configuration
  - [ ] Create AuthManager instance
  - [ ] Add private request method
  - [ ] Validate config in constructor
- [ ] Create `tests/client.test.ts`
  - [ ] Test valid instantiation
  - [ ] Test invalid config rejection
  - [ ] Test auth manager creation
  - [ ] Test configuration storage
  - [ ] Test encapsulation
- [ ] Update index.ts to export ApiClient
- [ ] Run tests and verify coverage
- [ ] Commit client foundation

## Phase 3: Code Generation (Steps 10-14)

### Step 10: Sample GraphQL Schema
- [ ] Create `schema.graphql` in project root
- [ ] Define User type
  - [ ] id, email, name, createdAt fields
- [ ] Define Transaction type
  - [ ] amount, currency, status fields
- [ ] Add Query operations
  - [ ] getUser(id: ID!): User
  - [ ] listTransactions(filter: TransactionFilter): [Transaction!]!
- [ ] Add Mutation operations
  - [ ] createUser(input: CreateUserInput!): User!
  - [ ] processTransaction(input: ProcessTransactionInput!): TransactionResult!
- [ ] Define input types
  - [ ] CreateUserInput
  - [ ] ProcessTransactionInput
  - [ ] TransactionFilter
- [ ] Add custom scalars
  - [ ] DateTime
  - [ ] JSON
- [ ] Add enum types
- [ ] Add field descriptions
- [ ] Create schema validation script
- [ ] Verify schema is valid
- [ ] Commit sample schema

### Step 11: GraphQL Code Generator Setup
- [ ] Install @graphql-codegen/cli
- [ ] Install TypeScript plugins
  - [ ] @graphql-codegen/typescript
  - [ ] @graphql-codegen/typescript-operations
- [ ] Create `codegen.yml`
  - [ ] Set schema path
  - [ ] Configure output to src/generated/
  - [ ] Add scalar mappings
  - [ ] Configure naming conventions
  - [ ] Disable React-specific generation
- [ ] Add codegen script to package.json
- [ ] Create src/generated directory
- [ ] Run code generator
- [ ] Verify generated types
- [ ] Add generated/ to .gitignore
- [ ] Commit codegen setup

### Step 12: Generated Code Integration
- [ ] Import generated types in client.ts
- [ ] Create example method using generated types
  - [ ] Implement getUser method
  - [ ] Use GetUserQueryVariables type
  - [ ] Return Promise<User>
- [ ] Update base request to be generic
- [ ] Add type constraints for variables
- [ ] Create integration test
  - [ ] Test type safety
  - [ ] Test method signature
  - [ ] Test TypeScript compilation
- [ ] Verify type inference works
- [ ] Run tests
- [ ] Commit type integration

### Step 13: Custom Code Generator Plugin - Structure
- [ ] Create `codegen-plugin.ts`
- [ ] Implement basic plugin structure
  - [ ] Export plugin function
  - [ ] Accept schema parameter
  - [ ] Return object with content
- [ ] Add schema parsing outline
  - [ ] Iterate through operations
  - [ ] Prepare method templates
- [ ] Define plugin TypeScript types
- [ ] Update codegen.yml to use plugin
- [ ] Test plugin runs without errors
- [ ] Verify plugin is called
- [ ] Commit plugin skeleton

### Step 14: Method Generation Implementation
- [ ] Complete method generation logic
- [ ] Parse queries from schema
  - [ ] Extract operation names
  - [ ] Get variable types
  - [ ] Get return types
- [ ] Parse mutations from schema
- [ ] Generate method signatures
  - [ ] Use proper variable types
  - [ ] Use proper return types
  - [ ] Add async keyword
- [ ] Generate method bodies
  - [ ] Call base request method
  - [ ] Pass operation document
  - [ ] Include variables
- [ ] Generate JSDoc from descriptions
- [ ] Update client base request method
- [ ] Test generated methods
  - [ ] Verify signatures
  - [ ] Test compilation
  - [ ] Test runtime behavior
- [ ] Run full code generation
- [ ] Commit method generation

## Phase 4: Authentication (Steps 15-17)

### Step 15: OpenID Connect Token Exchange
- [ ] Update AuthManager with OAuth implementation
- [ ] Add token endpoint URL config
- [ ] Implement refreshToken() method
  - [ ] Build token request
  - [ ] Use client_credentials grant
  - [ ] Send POST request
  - [ ] Parse JWT response
  - [ ] Calculate expiry from expires_in
- [ ] Add error handling
  - [ ] Auth server errors
  - [ ] Network failures
  - [ ] Invalid responses
- [ ] Create comprehensive tests
  - [ ] Mock token endpoint
  - [ ] Test successful exchange
  - [ ] Test auth errors
  - [ ] Test network errors
  - [ ] Test response parsing
- [ ] Integrate with request wrapper
- [ ] Run tests
- [ ] Commit OAuth implementation

### Step 16: Automatic Token Refresh
- [ ] Add refresh threshold (5 minutes)
- [ ] Implement refresh lock mechanism
  - [ ] Use Promise-based locking
  - [ ] Prevent concurrent refreshes
- [ ] Complete getToken() implementation
  - [ ] Check token validity
  - [ ] Check refresh threshold
  - [ ] Trigger refresh if needed
  - [ ] Return valid token
- [ ] Add retry logic
  - [ ] Exponential backoff
  - [ ] Max retry attempts
- [ ] Add token clearing on failure
- [ ] Write comprehensive tests
  - [ ] Test auto-refresh
  - [ ] Test concurrent requests
  - [ ] Test retry logic
  - [ ] Test failure handling
- [ ] Add logging/metrics
- [ ] Run tests
- [ ] Commit token refresh

### Step 17: Request Authentication Integration
- [ ] Update GraphQL request to accept auth manager
- [ ] Modify request flow
  - [ ] Get token before request
  - [ ] Add Authorization header
  - [ ] Format as Bearer token
- [ ] Handle 401 responses
  - [ ] Detect unauthorized
  - [ ] Trigger token refresh
  - [ ] Retry request once
- [ ] Update client class
  - [ ] Pass auth to requests
  - [ ] Update generated methods
- [ ] Add auth skip option
- [ ] Write integration tests
  - [ ] Verify auth header
  - [ ] Test 401 handling
  - [ ] Test refresh on 401
  - [ ] Test auth failures
- [ ] Run all tests
- [ ] Commit auth integration

## Phase 5: Error Handling (Steps 18-20)

### Step 18: Stage 6A Error Detection
- [ ] Add Stage 6A detection logic
- [ ] Check for errors array in responses
- [ ] Parse error extensions
  - [ ] Extract error codes
  - [ ] Extract field info
  - [ ] Extract constraints
- [ ] Identify Stage 6A patterns
  - [ ] VALIDATION_ERROR
  - [ ] AUTHORIZATION_ERROR
  - [ ] RESOURCE_NOT_FOUND
  - [ ] Business logic errors
- [ ] Create detection utilities
- [ ] Write tests with mocks
  - [ ] Test each error type
  - [ ] Test multiple errors
  - [ ] Test mixed errors
  - [ ] Test malformed errors
- [ ] Run tests
- [ ] Commit error detection

### Step 19: Typed Error Transformation
- [ ] Create specific error classes
  - [ ] ValidationError class
  - [ ] AuthorizationError class
  - [ ] ResourceNotFoundError class
  - [ ] BusinessError base class
- [ ] Add typed properties
  - [ ] Field and constraint for validation
  - [ ] Permission for authorization
  - [ ] Resource info for not found
- [ ] Implement error factory
  - [ ] Map codes to classes
  - [ ] Extract properties
  - [ ] Preserve original error
  - [ ] Handle unknown types
- [ ] Write transformation tests
  - [ ] Test each transformation
  - [ ] Test property extraction
  - [ ] Test fallback behavior
  - [ ] Test inheritance
- [ ] Export error classes
- [ ] Run tests
- [ ] Commit typed errors

### Step 20: Error Context Enhancement
- [ ] Define request context interface
- [ ] Add context to all errors
  - [ ] Request ID
  - [ ] Timestamp
  - [ ] Operation name
  - [ ] Sanitized variables
- [ ] Implement sensitive data filtering
  - [ ] Remove passwords
  - [ ] Mask API keys
  - [ ] Truncate large data
  - [ ] Preserve structure
- [ ] Add request ID generation
- [ ] Update error creation
  - [ ] NetworkError context
  - [ ] GraphQLError context
  - [ ] Stage 6A context
- [ ] Write context tests
  - [ ] Test data filtering
  - [ ] Test context attachment
  - [ ] Test ID generation
- [ ] Run tests
- [ ] Commit error context

## Phase 6: Build & Package (Steps 21-22)

### Step 21: Build Configuration for Multiple Targets
- [ ] Create base tsconfig.json
  - [ ] Set common options
  - [ ] Enable strict mode
  - [ ] Configure paths
- [ ] Create tsconfig.cjs.json
  - [ ] Extend base config
  - [ ] Set module to commonjs
  - [ ] Output to dist/cjs
- [ ] Create tsconfig.esm.json
  - [ ] Extend base config
  - [ ] Set module to esnext
  - [ ] Output to dist/esm
- [ ] Create tsconfig.types.json
  - [ ] Extend base config
  - [ ] Only emit declarations
  - [ ] Output to dist/types
- [ ] Update package.json
  - [ ] Add main field (cjs)
  - [ ] Add module field (esm)
  - [ ] Add types field
  - [ ] Add exports field
- [ ] Add build scripts
  - [ ] build:cjs
  - [ ] build:esm
  - [ ] build:types
  - [ ] build (all)
- [ ] Test both import styles
- [ ] Verify TypeScript finds types
- [ ] Commit build config

### Step 22: NPM Package Configuration
- [ ] Update package.json metadata
  - [ ] Set description
  - [ ] Add keywords
  - [ ] Add author
  - [ ] Add license (MIT or appropriate)
  - [ ] Add repository field
  - [ ] Add bugs URL
  - [ ] Add homepage
- [ ] Configure files array
  - [ ] Include dist/
  - [ ] Include README.md
  - [ ] Include LICENSE
  - [ ] Exclude tests
  - [ ] Exclude source maps (optional)
- [ ] Add engines field
  - [ ] Node.js >= 16
- [ ] Add scripts
  - [ ] clean script
  - [ ] prepublishOnly
  - [ ] version script
- [ ] Create .npmignore
  - [ ] Exclude src/
  - [ ] Exclude tests/
  - [ ] Exclude config files
  - [ ] Exclude .env files
- [ ] Run npm pack
- [ ] Verify package contents
- [ ] Check package size
- [ ] Commit npm config

## Phase 7: Testing & Documentation (Steps 23-25)

### Step 23: Integration Test Suite
- [ ] Create tests/integration directory
- [ ] Set up mock servers
  - [ ] Mock GraphQL endpoint
  - [ ] Mock OAuth endpoint
- [ ] Write auth flow tests
  - [ ] Test full token exchange
  - [ ] Test token refresh
  - [ ] Test concurrent auth
- [ ] Write query tests
  - [ ] Test typed queries
  - [ ] Test error handling
  - [ ] Test timeouts
- [ ] Write mutation tests
  - [ ] Test mutations
  - [ ] Test Stage 6A errors
  - [ ] Test validation
- [ ] Test error scenarios
  - [ ] Network failures
  - [ ] Auth failures
  - [ ] GraphQL errors
- [ ] Test edge cases
  - [ ] Large payloads
  - [ ] Slow responses
  - [ ] Malformed data
- [ ] Run integration tests
- [ ] Verify coverage
- [ ] Commit integration tests

### Step 24: Code Generation Error Mapping
- [ ] Extend code generator plugin
- [ ] Parse schema for error patterns
  - [ ] Look for error codes
  - [ ] Find error descriptions
  - [ ] Map to operations
- [ ] Generate error constants
  - [ ] Export ErrorCodes enum
  - [ ] Add error messages
- [ ] Generate error mappings
  - [ ] Map codes to classes
  - [ ] Export factory map
- [ ] Generate type guards
  - [ ] isValidationError()
  - [ ] isAuthorizationError()
  - [ ] etc.
- [ ] Include in generated output
- [ ] Test error mappings
- [ ] Update integration tests
- [ ] Run full generation
- [ ] Commit error mapping

### Step 25: Usage Examples and Documentation
- [ ] Create examples/ directory
- [ ] Write basic setup example
  - [ ] Client instantiation
  - [ ] Configuration options
- [ ] Write query example
  - [ ] Simple query
  - [ ] Query with variables
  - [ ] Error handling
- [ ] Write mutation example
  - [ ] Create operation
  - [ ] Handle Stage 6A errors
  - [ ] Show typed errors
- [ ] Write pagination example
- [ ] Write concurrent requests example
- [ ] Write error recovery example
- [ ] Write TypeScript example
  - [ ] Show type inference
  - [ ] Show type safety
- [ ] Create README.md
  - [ ] Installation instructions
  - [ ] Quick start
  - [ ] Configuration options
  - [ ] API overview
- [ ] Create CONTRIBUTING.md
- [ ] Create CHANGELOG.md
- [ ] Test all examples
- [ ] Commit documentation

## Phase 8: Final Polish (Step 26)

### Step 26: Final Integration and Polish
- [ ] Verify all components integrated
  - [ ] Generated code uses error handling
  - [ ] Auth works with generated methods
  - [ ] Types flow through system
- [ ] Add debug logging
  - [ ] Request logging
  - [ ] Response logging
  - [ ] Error logging
  - [ ] Performance metrics
- [ ] Performance optimization
  - [ ] Review object allocations
  - [ ] Check for memory leaks
  - [ ] Optimize hot paths
- [ ] Add interceptors
  - [ ] Request interceptor
  - [ ] Response interceptor
  - [ ] Error interceptor
- [ ] Code quality
  - [ ] Run linter
  - [ ] Format all code
  - [ ] Remove TODO comments
  - [ ] Add missing JSDoc
- [ ] Final testing
  - [ ] Run all unit tests
  - [ ] Run integration tests
  - [ ] Test real GraphQL endpoint (if available)
  - [ ] Memory leak testing
  - [ ] Performance testing
- [ ] Documentation review
  - [ ] Proofread README
  - [ ] Check examples work
  - [ ] Verify API docs complete
- [ ] Create release
  - [ ] Tag version 0.0.1
  - [ ] Create release notes
  - [ ] Update CHANGELOG
- [ ] Final npm pack test
- [ ] 🎉 Ready for release!

## Post-Release Tasks

### Immediate Post-Release
- [ ] Publish to npm
- [ ] Create GitHub release
- [ ] Announce release
- [ ] Monitor for issues

### First Week
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Update documentation
- [ ] Plan version 0.0.2

### Future Enhancements (Track Separately)
- [ ] Retry logic with exponential backoff
- [ ] Request/response interceptors
- [ ] Caching layer
- [ ] Batch query support
- [ ] WebSocket subscriptions
- [ ] File upload support
