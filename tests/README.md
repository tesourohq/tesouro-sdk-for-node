# Test Organization

This directory contains all tests for the Tesouro SDK, organized by test type for better maintainability.

## Directory Structure

```
tests/
├── unit/           # Unit tests for individual modules
│   ├── auth.test.ts        # Authentication manager tests
│   ├── client.test.ts      # API client tests  
│   ├── errors.test.ts      # Error system tests
│   ├── graphql.test.ts     # GraphQL utilities tests
│   ├── index.test.ts       # Main module exports tests
│   ├── request.test.ts     # HTTP request wrapper tests
│   └── types.test.ts       # Type validation tests
├── integration/    # Integration tests (end-to-end flows)
│   └── (future integration tests)
├── build/          # Build system verification tests
│   └── build.test.ts       # Multi-target build tests
└── setup.ts        # Global test setup and utilities
```

## Test Types

### Unit Tests (`tests/unit/`)
- Test individual modules in isolation
- Use mocks for dependencies
- Focus on specific functionality and edge cases
- Should be fast and reliable

### Integration Tests (`tests/integration/`)
- Test complete workflows and module interactions
- Use real implementations where possible
- Test authentication flows, error handling, etc.
- May be slower but test real-world scenarios

### Build Tests (`tests/build/`)
- Verify build system outputs
- Test module formats (CommonJS, ESM, TypeScript declarations)
- Ensure package.json configuration is correct
- Validate that built artifacts work correctly

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm test -- tests/unit

# Run only build tests  
npm test -- tests/build

# Run specific test file
npm test -- tests/unit/auth.test.ts

# Run tests in watch mode
npm run test:watch
```

## Coverage

Test coverage reports are generated in the `coverage/` directory. The project maintains:
- 95% minimum coverage for functions
- 80% minimum coverage for branches, lines, and statements  
- Generated code and re-export files are excluded from coverage requirements