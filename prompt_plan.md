# GraphQL API SDK Implementation Blueprint

## Overall Architecture Overview

This project implements a Node.js SDK that provides a TypeScript-first wrapper around a GraphQL API. The SDK auto-generates strongly-typed methods from a GraphQL schema, handles OpenID Connect authentication transparently, and provides comprehensive error handling with support for Stage 6A GraphQL errors.

## Detailed Implementation Steps

### Step 1: Project Initialization ✅ **COMPLETED**
**Goal**: Create the foundational project structure with TypeScript and testing support.

```text
Create a new Node.js project with TypeScript support. Initialize the package.json with the project name "@tesouro/tesouro-sdk-for-node" and version "0.0.1". Set up TypeScript configuration with strict mode enabled and ES2020 target. Add a basic .gitignore file for Node.js projects. Create a simple placeholder index.ts file in the src directory that exports a hello world function. Add a basic test to verify the setup works correctly.

Key requirements:
- Use Node.js 16+ compatibility
- Enable strict TypeScript mode
- Configure for both CommonJS and ES module output (we'll refine this later)
- Include source maps for debugging

The package.json should include basic scripts for building and testing, though we'll expand these later.
```

### Step 2: Testing Framework Setup ✅ **COMPLETED**
**Goal**: Establish Jest with TypeScript support for test-driven development.

```text
Building on the existing project, set up Jest with TypeScript support using ts-jest. Configure Jest to work with TypeScript files, enable code coverage reporting, and set up the test environment for Node.js. Create a test directory structure that mirrors the src directory. Write a simple test for the placeholder function from step 1 to verify the testing setup works. Configure Jest to generate coverage reports in both text and lcov formats.

Key requirements:
- Use ts-jest for TypeScript transformation
- Enable coverage with threshold requirements (80% minimum)
- Configure module name mapping for clean imports
- Add test scripts to package.json
- Ensure tests can use async/await

Create a sample test that demonstrates the testing pattern we'll use throughout the project.
```

### Step 3: Error System Foundation ✅ **COMPLETED**
**Goal**: Implement the base error class hierarchy for consistent error handling.

```text
Create a comprehensive error system starting with a base SdkError class that extends the native Error class. Implement proper error prototype chain fixing for TypeScript. Add serialization support for errors so they can be logged effectively. Create the errors.ts file in the src directory with the base SdkError class.

The SdkError should:
- Properly set the error name
- Maintain the correct prototype chain
- Support error serialization to JSON
- Include a timestamp property

Write comprehensive unit tests that verify:
- Error instances are instanceof SdkError
- Error instances are instanceof Error
- The name property is set correctly
- Stack traces are preserved
- Errors can be serialized to JSON

Export the error classes from the main index.ts file.
```

### Step 4: Network and GraphQL Error Classes ✅ **COMPLETED**
**Goal**: Extend the error system with specific error types for network and GraphQL errors.

```text
Building on the base SdkError, implement NetworkError and GraphQLError classes. 

NetworkError should include:
- Optional statusCode property for HTTP status codes
- Optional requestId for tracing
- Timestamp of when the error occurred
- Method to determine if the error is retryable

GraphQLError should include:
- Error code from GraphQL extensions
- Path array showing where in the query the error occurred
- Extensions object for additional error metadata
- Proper typing for GraphQL error structure

Write unit tests that verify:
- All properties are set correctly
- Inheritance chain works properly
- Errors can be distinguished by type
- Serialization includes all relevant properties

These errors will form the foundation for our error transformation system.
```

### Step 5: Authentication Manager Structure ✅ **COMPLETED**
**Goal**: Create the authentication manager class with token storage capabilities.

```text
Implement an AuthManager class that will handle OpenID Connect authentication. Start with the basic structure and token storage mechanism. The manager should store tokens in memory (not localStorage) and track token expiration.

Create auth.ts with:
- AuthManager class with private token and expiry properties
- Constructor that accepts client credentials
- isTokenValid() method that checks if the current token is still valid
- Placeholder getToken() method that returns the token if valid
- Clear separation between public and private methods

Write unit tests that verify:
- Token storage works correctly
- Token validity checking handles various cases (no token, expired token, valid token)
- Token expiry calculation is accurate
- Manager properly encapsulates token data

Do not implement the actual OAuth flow yet - use mock tokens for testing.
```

### Step 6: Configuration Types and Validation ✅ **COMPLETED**
**Goal**: Define TypeScript types for SDK configuration with validation.

```text
Create a comprehensive type system for SDK configuration. Define interfaces for client configuration, authentication settings, and request options.

Create types.ts with:
- ClientConfig interface with required and optional properties
- AuthConfig interface for authentication settings
- RequestConfig for per-request options
- Proper JSDoc comments for all properties
- Type guards for runtime validation

The ClientConfig should include:
- clientId and clientSecret (required)
- endpoint URL (required with default)
- timeout in milliseconds (optional with default)
- Custom headers (optional)
- Retry configuration (optional)

Write unit tests that verify:
- Type guards work correctly
- Default values are applied properly
- Invalid configurations are rejected
- TypeScript types are properly exported

These types will be used throughout the SDK for type safety.
```

### Step 7: HTTP Request Wrapper ✅ **COMPLETED**
**Goal**: Implement a low-level HTTP request wrapper with timeout support.

```text
Create a request utility that wraps the native fetch API (or node-fetch for older Node versions) with timeout support, error handling, and request/response logging capabilities.

Create request.ts with:
- A makeRequest function that accepts URL, options, and timeout
- Timeout implementation using AbortController
- Proper error handling that creates NetworkError instances
- Response validation and JSON parsing
- Support for custom headers

Write unit tests that:
- Mock fetch to test various scenarios
- Verify timeout works correctly
- Test error transformation to NetworkError
- Validate successful responses are parsed correctly
- Ensure headers are properly merged

This wrapper will be used by the GraphQL client for all HTTP requests.
```

### Step 8: GraphQL Request Builder ✅ **COMPLETED**
**Goal**: Add GraphQL-specific request handling on top of the HTTP wrapper.

```text
Extend the request module to handle GraphQL-specific concerns like query formatting, variable handling, and GraphQL error detection.

Add to request.ts:
- GraphQL request function that uses the HTTP wrapper
- Proper query and variables formatting
- GraphQL response type definitions
- Initial GraphQL error detection
- Support for both queries and mutations

The function should:
- Set correct Content-Type header
- Format the request body with query and variables
- Detect GraphQL errors in the response
- Return typed responses

Write unit tests that verify:
- GraphQL queries are formatted correctly
- Variables are properly included
- GraphQL errors are detected
- Successful responses return data
- Network errors are still handled

This forms the core of our GraphQL communication layer.
```

### Step 9: Client Class Foundation ✅ **COMPLETED**
**Goal**: Create the main ApiClient class structure with configuration handling.

```text
Implement the main ApiClient class that users will instantiate to use the SDK. Start with the basic structure, configuration storage, and integration with the auth manager.

Create client.ts with:
- ApiClient class with typed configuration
- Constructor that validates and stores config
- Private properties for auth manager and config
- Base request method that integrates auth
- Proper encapsulation of internals

The client should:
- Validate configuration on instantiation
- Create and store an AuthManager instance
- Expose a clean public API
- Handle configuration defaults

Write unit tests that verify:
- Client instantiation with valid config
- Configuration validation rejects invalid inputs
- Auth manager is properly initialized
- Base request method exists and is private

This is the main entry point users will interact with.
```

### Step 10: Sample GraphQL Schema ✅ **COMPLETED**
**Goal**: Add a sample GraphQL schema for code generation testing.

```text
Create a sample GraphQL schema that demonstrates the types of operations the SDK will support. This schema will be used for code generation and testing.

Create schema.graphql with:
- User type with id, email, name, createdAt
- Transaction type with amount, currency, status
- Query operations: getUser, listTransactions
- Mutation operations: createUser, processTransaction
- Input types for mutations
- Custom scalar types (DateTime, JSON)
- Comments documenting each type and field

The schema should demonstrate:
- Basic CRUD operations
- List queries with filtering
- Nested types
- Enum types
- Error response patterns

Also create a simple script to validate the schema is syntactically correct.
```

### Step 11: GraphQL Code Generator Setup ✅ **COMPLETED**
**Goal**: Install and configure GraphQL Code Generator for type generation.

```text
Set up GraphQL Code Generator to generate TypeScript types from the GraphQL schema. Install necessary dependencies and create the configuration file.

Tasks:
- Install @graphql-codegen/cli and TypeScript plugins
- Create codegen.yml configuration file
- Configure plugins for TypeScript types and operations
- Set up scalar type mappings (DateTime -> Date, JSON -> Record<string, any>)
- Add codegen script to package.json
- Configure output to src/generated/

The configuration should:
- Generate types for all schema types
- Generate types for all operations
- Use proper naming conventions
- Avoid generating React-specific code
- Include helpful comments in generated code

Run the code generator and verify it produces expected output. The generated types will be the foundation for our type-safe API.
```

### Step 12: Generated Code Integration ✅ **COMPLETED**
**Goal**: Integrate generated types into the client class and establish the pattern for type usage.

```text
Integrate the generated GraphQL types into the existing client infrastructure. Update the client class to use these types and establish patterns for how generated code will be used throughout the SDK.

Updates needed:
- Import generated types in client.ts
- Create a base method that uses generated types
- Update request methods to be generic over response types
- Add type constraints for variables
- Ensure proper type inference works

Create a simple example method like:
- getUser that accepts GetUserQueryVariables
- Returns Promise<User>
- Uses the base request infrastructure

Write tests that verify:
- Type safety is maintained
- Generated types are properly imported
- Methods have correct signatures
- TypeScript compilation succeeds

This establishes the pattern for all auto-generated methods.
```

### Step 13: Custom Code Generator Plugin - Structure ✅ **COMPLETED**
**Goal**: Create the skeleton for a custom GraphQL Code Generator plugin.

```text
Create a custom plugin for GraphQL Code Generator that will generate method implementations for each GraphQL operation. Start with the basic plugin structure and configuration.

Create codegen-plugin.ts with:
- Basic plugin function signature
- Schema parsing logic outline
- Method to iterate through operations
- Template for generating method code
- Proper TypeScript types for the plugin

The plugin should:
- Export a valid codegen plugin
- Parse the schema to find all operations
- Prepare to generate one method per operation
- Include proper imports in generated code
- Follow the established patterns

Update codegen.yml to use the custom plugin. Test that the plugin runs without errors, even if it doesn't generate useful code yet.
```

### Step 14: Method Generation Implementation ✅ **COMPLETED**
**Goal**: Implement the actual method generation logic in the custom plugin.

```text
Complete the custom code generator plugin to generate fully typed methods for each GraphQL operation. The generated methods should integrate with the base client infrastructure.

Implement in the plugin:
- Parse queries and mutations from the schema
- Generate method signatures with proper types
- Create method bodies that call the base request
- Handle both queries and mutations appropriately
- Generate JSDoc comments from schema descriptions

Generated methods should follow this pattern:
```typescript
async getUser(variables: GetUserQueryVariables): Promise<User> {
  return this.request<User>('getUser', GetUserDocument, variables);
}
```

Update the client class to include a base request method that the generated methods can use. Test that generated methods have correct types and can be called.
```

### Step 15: OpenID Connect Token Exchange ✅ **COMPLETED**
**Goal**: Implement the actual OAuth token exchange in the auth manager.

```text
Implement the OpenID Connect token exchange flow in the AuthManager. This involves making a request to the token endpoint with client credentials and storing the resulting JWT.

Add to AuthManager:
- Token endpoint URL configuration
- refreshToken() method that performs the OAuth flow
- Proper error handling for auth failures
- Token parsing and expiry calculation
- Integration with the request wrapper

The implementation should:
- Use client_credentials grant type
- Send credentials in the request body
- Parse JWT response
- Calculate token expiry from expires_in
- Handle various error scenarios

Write comprehensive tests using mocked responses:
- Successful token exchange
- Auth server errors
- Network failures
- Invalid response formats
- Token parsing errors

This completes the core authentication functionality.
```

### Step 16: Automatic Token Refresh ✅ **COMPLETED**
**Goal**: Implement automatic token refresh logic with proper error handling.

```text
Enhance the AuthManager to automatically refresh tokens before they expire. Implement proper locking to prevent multiple simultaneous refresh attempts.

Add to AuthManager:
- Token refresh threshold (refresh 5 minutes before expiry)
- Refresh lock mechanism to prevent race conditions
- getToken() implementation that checks validity and refreshes
- Error handling with retry logic
- Token refresh metrics/logging

Key behaviors:
- Check if token needs refresh on each getToken() call
- Use Promise-based locking for concurrent requests
- Retry failed refreshes with backoff
- Clear token on permanent failures

Write tests for:
- Automatic refresh when token is near expiry
- Multiple concurrent requests only trigger one refresh
- Retry logic for temporary failures
- Fallback behavior for permanent failures

This ensures requests never fail due to expired tokens.
```

### Step 17: Request Authentication Integration ✅ **COMPLETED**
**Goal**: Integrate authentication with all GraphQL requests.

```text
Wire the authentication system into the GraphQL request flow. Every request should automatically include the authorization header with a valid token.

Update the request flow:
- Modify GraphQL request function to accept auth manager
- Get token before each request
- Add Authorization header with Bearer token
- Handle auth errors appropriately
- Implement token refresh on 401 responses

In the client class:
- Pass auth manager to request functions
- Ensure all generated methods use authenticated requests
- Add option to skip auth for specific requests

Write integration tests:
- Verify auth header is included
- Test token refresh on 401
- Ensure failed auth prevents requests
- Validate error handling

This completes the authentication integration.
```

### Step 18: Stage 6A Error Detection ✅ **COMPLETED**
**Goal**: Implement detection and parsing of Stage 6A GraphQL errors.

```text
Implement logic to detect and parse Stage 6A error responses from GraphQL mutations. These errors follow a specific pattern with error codes and additional metadata in extensions.

Add error detection:
- Check for errors array in GraphQL responses
- Parse error extensions for Stage 6A patterns
- Extract error codes, fields, and constraints
- Identify error types from codes

Stage 6A error patterns include:
- VALIDATION_ERROR with field information
- AUTHORIZATION_ERROR with required permissions
- RESOURCE_NOT_FOUND with resource details
- Custom business logic errors

Write tests with mock responses:
- Various Stage 6A error types
- Multiple errors in one response
- Mixed Stage 6A and regular errors
- Malformed error responses

This prepares for typed error transformation.
```

### Step 19: Typed Error Transformation ✅ **COMPLETED**
**Goal**: Transform Stage 6A errors into specific typed error classes.

```text
Create specific error classes for each Stage 6A error type and implement a factory that transforms raw GraphQL errors into these typed instances.

Create error subclasses:
- ValidationError with field and constraint properties
- AuthorizationError with required permission
- ResourceNotFoundError with resource type and ID
- Business logic error base class

Implement error factory:
- Map error codes to error classes
- Extract relevant properties from extensions
- Preserve original error information
- Handle unknown error types

The factory should create the most specific error type possible while falling back to GraphQLError for unknown types.

Write comprehensive tests:
- Each error type is created correctly
- Properties are properly extracted
- Unknown errors fall back appropriately
- Error inheritance chain is maintained

This provides strong typing for error handling.
```

### Step 20: Error Context Enhancement ✅ **COMPLETED**
**Goal**: Add request context and debugging information to errors.

```text
Enhance all errors with additional context to aid in debugging. This includes request IDs, timestamps, operation names, and relevant variables (with sensitive data removed).

Add to error system:
- Request context interface
- Context attachment to all errors
- Sensitive data filtering
- Operation name tracking
- Request ID generation

Implement safe variable logging:
- Remove password fields
- Mask API keys
- Truncate large payloads
- Preserve structure for debugging

Update error creation throughout the SDK to include context. Write tests to verify sensitive data is properly filtered while maintaining useful debugging information.

This greatly improves error debugging capabilities.
```

### Step 21: Build Configuration for Multiple Targets ✅ **COMPLETED**
**Goal**: Set up TypeScript configurations for CommonJS, ES modules, and type definitions.

```text
Create multiple TypeScript configuration files to support building for different module systems. The SDK needs to work with both CommonJS (require) and ES modules (import).

Create TypeScript configs:
- tsconfig.json (base configuration)
- tsconfig.cjs.json (CommonJS output)
- tsconfig.esm.json (ES modules output)
- tsconfig.types.json (type definitions only)

Configure each for:
- Appropriate module system
- Correct output directories
- Source map generation
- Declaration file generation

Update package.json with:
- Multiple build scripts
- Proper exports field
- Main, module, and types fields
- Conditional exports for different environments

Test that both import styles work correctly and TypeScript finds the types.
```

### Step 22: NPM Package Configuration ✅ **COMPLETED**
**Goal**: Complete package.json configuration for publishing.

```text
Finalize the package.json configuration for publishing to NPM. Set up all necessary fields, scripts, and package configuration.

Configure package.json with:
- Proper name and scope (@tesouro/tesouro-sdk-for-node)
- Description and keywords
- Author and license information
- Repository and bugs URLs
- Files array to control what's published
- Peer dependencies if needed
- Engine requirements (Node.js 16+)

Add scripts for:
- Clean build process
- Pre-publish build
- Version bumping
- Change log generation

Create .npmignore to exclude:
- Source files
- Test files  
- Configuration files
- Development dependencies

Test the package with npm pack to verify correct files are included.
```

### Step 23: Integration Test Suite
**Goal**: Create comprehensive integration tests that verify the full SDK flow.

```text
Implement integration tests that verify the complete SDK functionality from client instantiation through authenticated requests to error handling.

Create integration tests for:
- Full authentication flow with token refresh
- Query execution with type safety
- Mutation execution with error handling
- Stage 6A error transformation
- Timeout and network error handling
- Concurrent request handling

Use mock servers or interceptors to:
- Simulate the GraphQL endpoint
- Mock the OAuth token endpoint
- Generate various error scenarios
- Test edge cases

The tests should verify the SDK works correctly as a complete system rather than testing individual components.

This ensures the SDK works correctly when all components are integrated.
```

### Step 24: Code Generation Error Mapping
**Goal**: Enhance the code generator plugin to generate error type mappings.

```text
Extend the custom code generator plugin to analyze the schema and generate mappings between Stage 6A error codes and the typed error classes.

Add to the plugin:
- Parse schema for error code documentation
- Generate error code constants
- Create error factory mappings
- Generate error type guards
- Include error documentation

The plugin should look for patterns in the schema (comments, descriptions, or naming conventions) to identify which operations can return which errors.

Generate code like:
```typescript
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  // ... more codes
} as const;

export const errorFactoryMap = {
  [ErrorCodes.VALIDATION_ERROR]: ValidationError,
  // ... more mappings
};
```

This provides compile-time safety for error handling.
```

### Step 25: Usage Examples and Documentation
**Goal**: Create comprehensive examples showing SDK usage patterns.

```text
Create example code demonstrating common SDK usage patterns. These examples will serve as both documentation and integration tests.

Create examples for:
- Basic client setup and configuration
- Simple query execution
- Mutation with error handling
- Pagination patterns
- Concurrent requests
- Error recovery strategies
- Token refresh scenarios
- TypeScript type usage

Each example should:
- Be runnable (though may need mock server)
- Include error handling
- Show TypeScript benefits
- Follow best practices
- Include explanatory comments

Also create:
- Quick start guide
- API reference outline
- Migration guide structure
- Troubleshooting guide

These examples form the basis of the SDK documentation.
```

### Step 26: Final Integration and Polish
**Goal**: Wire everything together and ensure all components work as a cohesive system.

```text
Perform final integration of all components, ensuring generated code properly uses all the infrastructure we've built. Add polish and prepare for release.

Final integration tasks:
- Ensure generated methods use all error handling
- Verify authentication works with generated code
- Add logging/debugging capabilities
- Performance optimization
- Memory leak prevention
- Add request/response interceptors

Polish tasks:
- Consistent code formatting
- Complete JSDoc documentation
- Remove all TODO comments
- Add debug logging
- Implement telemetry hooks

Create final tests that:
- Use only the public API
- Verify all documented features work
- Test the actual generated client
- Ensure no breaking changes

Finally, create a release checklist and version 0.0.1 change log.

This completes the SDK implementation with all components properly integrated.
```

## Implementation Order Summary

The implementation follows a careful progression:
1. **Foundation** (Steps 1-2): Project setup and testing framework
2. **Core Components** (Steps 3-9): Errors, auth, requests, and client base
3. **Code Generation** (Steps 10-14): Schema, generator setup, and method generation  
4. **Authentication** (Steps 15-17): OAuth implementation and integration
5. **Error Handling** (Steps 18-20): Stage 6A errors and transformation
6. **Build & Package** (Steps 21-22): Multi-target builds and NPM setup
7. **Testing & Docs** (Steps 23-25): Integration tests and examples
8. **Final Polish** (Step 26): Complete integration and release prep

Each step builds on previous work with no orphaned code. The test-driven approach ensures reliability at each stage.