/**
 * Step 24 Demo: Error Code Generation and Mapping
 * Demonstrates the functionality that should be generated from the schema
 */

// Manually created examples of what Step 24 should generate
const ErrorCodes = {
  /** ValidationFailureError */
  VALIDATION_FAILURE: 'VALIDATION_FAILURE',
  /** InternalServiceError */
  INTERNAL_SERVICE: 'INTERNAL_SERVICE',
  /** AcceptorNotFoundError */
  ACCEPTOR_NOT_FOUND: 'ACCEPTOR_NOT_FOUND',
  /** UnknownCardError */
  UNKNOWN_CARD: 'UNKNOWN_CARD',
  /** TokenNotFoundError */
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  /** InvalidTokenError */
  INVALID_TOKEN: 'INVALID_TOKEN',
  /** RouteNotFoundError */
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  /** RuleInViolationError */
  RULE_IN_VIOLATION: 'RULE_IN_VIOLATION',
  /** SyntaxOnNetworkResponseError */
  SYNTAX_ON_NETWORK_RESPONSE: 'SYNTAX_ON_NETWORK_RESPONSE',
  /** TimeoutOnNetworkResponseError */
  TIMEOUT_ON_NETWORK_RESPONSE: 'TIMEOUT_ON_NETWORK_RESPONSE',
  /** PriorPaymentNotFoundError */
  PRIOR_PAYMENT_NOT_FOUND: 'PRIOR_PAYMENT_NOT_FOUND',
} as const;

const ErrorCategories = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  SYSTEM: 'system',
  BUSINESS: 'business',
  NETWORK: 'network',
  UNKNOWN: 'unknown',
} as const;

// Manual mapping of operations to their possible errors (extracted from schema unions)
const OperationErrorMap = {
  // AuthorizeCustomerInitiatedTransactionError
  authorizeCustomerInitiatedTransaction: [
    'InternalServiceError',
    'AcceptorNotFoundError',
    'RuleInViolationError',
    'SyntaxOnNetworkResponseError',
    'TimeoutOnNetworkResponseError',
    'ValidationFailureError',
    'UnknownCardError',
    'TokenNotFoundError',
    'InvalidTokenError',
    'RouteNotFoundError',
  ],
  // CaptureAuthorizationError
  captureAuthorization: [
    'InternalServiceError',
    'RuleInViolationError',
    'SyntaxOnNetworkResponseError',
    'TimeoutOnNetworkResponseError',
    'ValidationFailureError',
    'PriorPaymentNotFoundError',
  ],
} as const;

class MockGraphQLErrorFactory {
  private static readonly codeToTypeMap = {
    [ErrorCodes.VALIDATION_FAILURE]: 'ValidationFailureError',
    [ErrorCodes.INTERNAL_SERVICE]: 'InternalServiceError',
    [ErrorCodes.ACCEPTOR_NOT_FOUND]: 'AcceptorNotFoundError',
    [ErrorCodes.UNKNOWN_CARD]: 'UnknownCardError',
    [ErrorCodes.TOKEN_NOT_FOUND]: 'TokenNotFoundError',
    [ErrorCodes.INVALID_TOKEN]: 'InvalidTokenError',
    [ErrorCodes.ROUTE_NOT_FOUND]: 'RouteNotFoundError',
    [ErrorCodes.RULE_IN_VIOLATION]: 'RuleInViolationError',
    [ErrorCodes.SYNTAX_ON_NETWORK_RESPONSE]: 'SyntaxOnNetworkResponseError',
    [ErrorCodes.TIMEOUT_ON_NETWORK_RESPONSE]: 'TimeoutOnNetworkResponseError',
    [ErrorCodes.PRIOR_PAYMENT_NOT_FOUND]: 'PriorPaymentNotFoundError',
  };

  private static readonly categoryToCodesMap = {
    [ErrorCategories.VALIDATION]: [
      ErrorCodes.VALIDATION_FAILURE,
      ErrorCodes.SYNTAX_ON_NETWORK_RESPONSE,
    ],
    [ErrorCategories.SYSTEM]: [ErrorCodes.INTERNAL_SERVICE],
    [ErrorCategories.BUSINESS]: [
      ErrorCodes.ACCEPTOR_NOT_FOUND,
      ErrorCodes.UNKNOWN_CARD,
      ErrorCodes.TOKEN_NOT_FOUND,
      ErrorCodes.INVALID_TOKEN,
      ErrorCodes.ROUTE_NOT_FOUND,
      ErrorCodes.RULE_IN_VIOLATION,
      ErrorCodes.PRIOR_PAYMENT_NOT_FOUND,
    ],
    [ErrorCategories.NETWORK]: [ErrorCodes.TIMEOUT_ON_NETWORK_RESPONSE],
  };

  static getErrorCodeForType(typeName: string): string | undefined {
    const entries = Object.entries(this.codeToTypeMap);
    const entry = entries.find(([_, type]) => type === typeName);
    return entry ? entry[0] : undefined;
  }

  static getCategoryForType(typeName: string): string | undefined {
    const errorCode = this.getErrorCodeForType(typeName);
    if (!errorCode) {
return undefined;
}

    const entries = Object.entries(this.categoryToCodesMap);
    const entry = entries.find(([_, codes]) => (codes as any).includes(errorCode));
    return entry ? entry[0] : undefined;
  }

  static isErrorInCategory(error: any, category: string): boolean {
    if (!error || !error.__typename) {
return false;
}
    const errorCategory = this.getCategoryForType(error.__typename);
    return errorCategory === category;
  }

  static filterErrorsByCategory(errors: any[], category: string): any[] {
    if (!Array.isArray(errors)) {
return [];
}

    return errors.filter((error) => this.isErrorInCategory(error, category));
  }
}

function getPossibleErrorsForOperation(operationName: string): readonly string[] {
  return (OperationErrorMap as any)[operationName] || [];
}

describe('Step 24: Error Code Generation Demo', () => {
  describe('Error Code Constants', () => {
    it('should provide error codes for all schema error types', () => {
      expect(ErrorCodes.VALIDATION_FAILURE).toBe('VALIDATION_FAILURE');
      expect(ErrorCodes.INTERNAL_SERVICE).toBe('INTERNAL_SERVICE');
      expect(ErrorCodes.ACCEPTOR_NOT_FOUND).toBe('ACCEPTOR_NOT_FOUND');
      expect(ErrorCodes.UNKNOWN_CARD).toBe('UNKNOWN_CARD');
    });

    it('should provide error categories', () => {
      expect(ErrorCategories.VALIDATION).toBe('validation');
      expect(ErrorCategories.SYSTEM).toBe('system');
      expect(ErrorCategories.BUSINESS).toBe('business');
      expect(ErrorCategories.NETWORK).toBe('network');
    });
  });

  describe('Operation Error Mappings', () => {
    it('should map operations to their possible errors', () => {
      const authErrors = getPossibleErrorsForOperation('authorizeCustomerInitiatedTransaction');

      expect(authErrors).toContain('ValidationFailureError');
      expect(authErrors).toContain('InternalServiceError');
      expect(authErrors).toContain('AcceptorNotFoundError');
      expect(authErrors).toContain('UnknownCardError');
      expect(authErrors.length).toBeGreaterThan(5);
    });

    it('should return empty array for unknown operations', () => {
      const unknownErrors = getPossibleErrorsForOperation('unknownOperation');
      expect(unknownErrors).toEqual([]);
    });
  });

  describe('Error Factory', () => {
    it('should get error code for error type', () => {
      expect(MockGraphQLErrorFactory.getErrorCodeForType('ValidationFailureError')).toBe(
        'VALIDATION_FAILURE'
      );
      expect(MockGraphQLErrorFactory.getErrorCodeForType('InternalServiceError')).toBe(
        'INTERNAL_SERVICE'
      );
      expect(MockGraphQLErrorFactory.getErrorCodeForType('UnknownType')).toBeUndefined();
    });

    it('should get category for error type', () => {
      expect(MockGraphQLErrorFactory.getCategoryForType('ValidationFailureError')).toBe(
        'validation'
      );
      expect(MockGraphQLErrorFactory.getCategoryForType('InternalServiceError')).toBe('system');
      expect(MockGraphQLErrorFactory.getCategoryForType('AcceptorNotFoundError')).toBe('business');
      expect(MockGraphQLErrorFactory.getCategoryForType('TimeoutOnNetworkResponseError')).toBe(
        'network'
      );
    });

    it('should check if error belongs to category', () => {
      const validationError = { __typename: 'ValidationFailureError', message: 'Test error' };
      const systemError = { __typename: 'InternalServiceError', message: 'System error' };
      const businessError = { __typename: 'AcceptorNotFoundError', message: 'Business error' };

      expect(MockGraphQLErrorFactory.isErrorInCategory(validationError, 'validation')).toBe(true);
      expect(MockGraphQLErrorFactory.isErrorInCategory(validationError, 'system')).toBe(false);

      expect(MockGraphQLErrorFactory.isErrorInCategory(systemError, 'system')).toBe(true);
      expect(MockGraphQLErrorFactory.isErrorInCategory(systemError, 'business')).toBe(false);

      expect(MockGraphQLErrorFactory.isErrorInCategory(businessError, 'business')).toBe(true);
      expect(MockGraphQLErrorFactory.isErrorInCategory(businessError, 'validation')).toBe(false);
    });

    it('should filter errors by category', () => {
      const errors = [
        { __typename: 'ValidationFailureError', message: 'Validation error' },
        { __typename: 'InternalServiceError', message: 'System error' },
        { __typename: 'AcceptorNotFoundError', message: 'Business error' },
        { __typename: 'ValidationFailureError', message: 'Another validation error' },
      ];

      const validationErrors = MockGraphQLErrorFactory.filterErrorsByCategory(errors, 'validation');
      const systemErrors = MockGraphQLErrorFactory.filterErrorsByCategory(errors, 'system');
      const businessErrors = MockGraphQLErrorFactory.filterErrorsByCategory(errors, 'business');

      expect(validationErrors).toHaveLength(2);
      expect(systemErrors).toHaveLength(1);
      expect(businessErrors).toHaveLength(1);

      expect(validationErrors[0].__typename).toBe('ValidationFailureError');
      expect(systemErrors[0].__typename).toBe('InternalServiceError');
      expect(businessErrors[0].__typename).toBe('AcceptorNotFoundError');
    });
  });

  describe('Payments Domain Categorization', () => {
    it('should correctly categorize payment-specific errors as business logic', () => {
      // These are business logic errors in payments context, not authentication errors
      expect(MockGraphQLErrorFactory.getCategoryForType('AcceptorNotFoundError')).toBe('business');
      expect(MockGraphQLErrorFactory.getCategoryForType('UnknownCardError')).toBe('business');
      expect(MockGraphQLErrorFactory.getCategoryForType('TokenNotFoundError')).toBe('business');
      expect(MockGraphQLErrorFactory.getCategoryForType('RouteNotFoundError')).toBe('business');
    });

    it('should distinguish validation from business errors', () => {
      expect(MockGraphQLErrorFactory.getCategoryForType('ValidationFailureError')).toBe(
        'validation'
      );
      expect(MockGraphQLErrorFactory.getCategoryForType('SyntaxOnNetworkResponseError')).toBe(
        'validation'
      );

      expect(MockGraphQLErrorFactory.getCategoryForType('AcceptorNotFoundError')).toBe('business');
      expect(MockGraphQLErrorFactory.getCategoryForType('RuleInViolationError')).toBe('business');
    });

    it('should categorize system and network errors correctly', () => {
      expect(MockGraphQLErrorFactory.getCategoryForType('InternalServiceError')).toBe('system');
      expect(MockGraphQLErrorFactory.getCategoryForType('TimeoutOnNetworkResponseError')).toBe(
        'network'
      );
    });
  });

  describe('Integration with SDK Error Handling', () => {
    it('should work with real GraphQL error responses', () => {
      // Simulate a real GraphQL error response
      const graphqlResponse = {
        data: null,
        errors: [
          {
            __typename: 'ValidationFailureError',
            message: 'Invalid card number',
            fieldName: 'accountNumber',
            errorDateTime: '2025-01-07T12:00:00Z',
          },
          {
            __typename: 'AcceptorNotFoundError',
            message: 'Acceptor not found',
            unknownAcceptorId: '12345678-1234-5678-9abc-123456789abc',
            errorDateTime: '2025-01-07T12:00:00Z',
          },
        ],
      };

      const validationErrors = MockGraphQLErrorFactory.filterErrorsByCategory(
        graphqlResponse.errors,
        'validation'
      );
      const businessErrors = MockGraphQLErrorFactory.filterErrorsByCategory(
        graphqlResponse.errors,
        'business'
      );

      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0].fieldName).toBe('accountNumber');

      expect(businessErrors).toHaveLength(1);
      expect(businessErrors[0].unknownAcceptorId).toBe('12345678-1234-5678-9abc-123456789abc');
    });

    it('should provide operation-specific error checking', () => {
      const errors = [
        { __typename: 'ValidationFailureError', message: 'Validation error' },
        { __typename: 'UnknownOperationError', message: 'Unknown error' },
      ];

      // Check if errors are relevant to a specific operation
      const authErrors = getPossibleErrorsForOperation('authorizeCustomerInitiatedTransaction');
      const relevantErrors = errors.filter((error) => authErrors.includes(error.__typename));

      expect(relevantErrors).toHaveLength(1);
      expect(relevantErrors[0].__typename).toBe('ValidationFailureError');
    });
  });
});
