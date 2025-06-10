"use strict";
/**
 * Custom GraphQL Code Generator plugin for generating typed client methods
 *
 * This plugin generates strongly-typed methods for each GraphQL operation
 * that integrate with the ApiClient base infrastructure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const graphql_1 = require("graphql");
/**
 * Custom GraphQL Code Generator plugin that generates client methods
 */
const plugin = (schema, documents, config) => {
    // Apply default configuration
    const pluginConfig = {
        methodPrefix: '',
        methodSuffix: '',
        generateDocs: true,
        clientImportPath: './client',
        maxFieldDepth: 10,
        ...config,
    };
    // Extract operations from the schema
    const operations = extractOperationsFromSchema(schema, pluginConfig);
    // Extract error types from the schema
    const errorTypes = extractErrorTypesFromSchema(schema);
    // Generate the output code
    return generateClientMethods(operations, errorTypes, pluginConfig);
};
exports.plugin = plugin;
/**
 * Extracts operation information from the GraphQL schema
 */
function extractOperationsFromSchema(schema, config) {
    const operations = [];
    // Get the root operation types
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();
    // Extract query operations
    if (queryType) {
        const queryFields = queryType.getFields();
        for (const [fieldName, field] of Object.entries(queryFields)) {
            operations.push(createOperationInfo(fieldName, field, 'query', schema, config));
        }
    }
    // Extract mutation operations
    if (mutationType) {
        const mutationFields = mutationType.getFields();
        for (const [fieldName, field] of Object.entries(mutationFields)) {
            operations.push(createOperationInfo(fieldName, field, 'mutation', schema, config));
        }
    }
    // Extract subscription operations
    if (subscriptionType) {
        const subscriptionFields = subscriptionType.getFields();
        for (const [fieldName, field] of Object.entries(subscriptionFields)) {
            operations.push(createOperationInfo(fieldName, field, 'subscription', schema, config));
        }
    }
    return operations;
}
/**
 * Extracts error type information from the GraphQL schema
 */
function extractErrorTypesFromSchema(schema) {
    const errorTypes = [];
    const typeMap = schema.getTypeMap();
    // Base error interface names we're looking for
    const baseErrorInterfaces = ['Error', 'ErrorBase', 'IGraphQlError'];
    for (const [typeName, type] of Object.entries(typeMap)) {
        // Skip built-in types
        if (typeName.startsWith('_'))
            continue;
        // Only process object types that look like errors
        if ((0, graphql_1.isObjectType)(type) && (typeName.endsWith('Error') || baseErrorInterfaces.includes(typeName))) {
            const errorInfo = createErrorTypeInfo(type, schema);
            if (errorInfo) {
                errorTypes.push(errorInfo);
            }
        }
    }
    return errorTypes;
}
/**
 * Creates error type information from a GraphQL object type
 */
function createErrorTypeInfo(type, schema) {
    const fields = type.getFields();
    const errorFields = [];
    // Determine base type by examining implemented interfaces
    let baseType = 'unknown';
    const interfaces = type.getInterfaces();
    for (const iface of interfaces) {
        if (iface.name === 'Error') {
            baseType = 'Error';
        }
        else if (iface.name === 'ErrorBase') {
            baseType = 'ErrorBase';
        }
        else if (iface.name === 'IGraphQlError') {
            baseType = 'IGraphQlError';
            break; // IGraphQlError is most specific
        }
    }
    // Extract field information
    for (const [fieldName, field] of Object.entries(fields)) {
        const fieldType = field.type;
        const isRequired = (0, graphql_1.isNonNullType)(fieldType);
        const namedType = (0, graphql_1.getNamedType)(fieldType);
        errorFields.push({
            name: fieldName,
            type: extractResultTypeName(fieldType.toString()),
            required: isRequired,
            description: field.description,
        });
    }
    return {
        name: type.name,
        baseType,
        description: type.description,
        fields: errorFields,
    };
}
/**
 * Creates operation information from a GraphQL field
 */
function createOperationInfo(fieldName, field, operationType, schema, config) {
    // Generate the operation string
    const operationString = generateOperationString(fieldName, field, operationType, schema, config);
    // Generate TypeScript type names following GraphQL codegen conventions
    const capitalizedFieldName = capitalize(fieldName);
    const operationTypeName = capitalize(operationType);
    // Use the same naming convention as GraphQL codegen
    const variablesType = `${operationTypeName}${capitalizedFieldName}Args`;
    const resultType = extractResultTypeName(field.type.toString());
    const hasVariables = field.args && field.args.length > 0;
    return {
        name: fieldName,
        type: operationType,
        operationString,
        variablesType: hasVariables ? variablesType : 'never',
        resultType,
        description: field.description,
        hasVariables,
    };
}
/**
 * Generates a GraphQL operation string for a field
 */
function generateOperationString(fieldName, field, operationType, schema, config) {
    const capitalizedFieldName = capitalize(fieldName);
    const operationTypeName = capitalize(operationType);
    // Build arguments string for operation definition
    const args = field.args || [];
    const argsString = args.length > 0
        ? `(${args.map(arg => `$${arg.name}: ${arg.type}`).join(', ')})`
        : '';
    // Build field call with arguments
    const fieldCall = args.length > 0
        ? `${fieldName}(${args.map(arg => `${arg.name}: $${arg.name}`).join(', ')})`
        : fieldName;
    // Generate field selection based on return type
    const fieldSelection = generateFieldSelection(field, schema, config);
    return `
    ${operationType} ${operationTypeName}${capitalizedFieldName}${argsString} {
      ${fieldCall} {
        ${fieldSelection || '__typename'}
      }
    }
  `.trim();
}
/**
 * Generates field selection for a GraphQL field based on its return type
 */
function generateFieldSelection(field, schema, config) {
    const returnType = (0, graphql_1.getNamedType)(field.type);
    // For scalar, enum, or other non-object types, no selection needed
    if ((0, graphql_1.isScalarType)(returnType) || (0, graphql_1.isEnumType)(returnType)) {
        return '';
    }
    // For object types, generate a complete field selection
    if ((0, graphql_1.isObjectType)(returnType)) {
        return generateObjectFieldSelection(returnType, schema, config);
    }
    // For union or interface types, generate a selection with fragments
    if ((0, graphql_1.isUnionType)(returnType) || (0, graphql_1.isInterfaceType)(returnType)) {
        return generateUnionInterfaceFieldSelection(returnType, schema, config);
    }
    // Fallback for unknown types
    return '__typename';
}
/**
 * Generates field selection for GraphQL object types including all scalar/enum fields
 */
function generateObjectFieldSelection(objectType, schema, config, visitedTypes = new Set(), depth = 0) {
    // Prevent infinite recursion with depth limit
    if (depth >= config.maxFieldDepth) {
        return '__typename';
    }
    // Detect cycles by checking if we're already processing this type
    if (visitedTypes.has(objectType.name)) {
        return '__typename';
    }
    const fields = objectType.getFields();
    const selectedFields = ['__typename'];
    // Add this type to the visited set for cycle detection
    const newVisitedTypes = new Set(visitedTypes);
    newVisitedTypes.add(objectType.name);
    // Include all scalar and enum fields, but skip fields that require arguments
    for (const [fieldName, fieldDef] of Object.entries(fields)) {
        // Skip fields that have required arguments (they need their own queries)
        if (fieldDef.args.length > 0) {
            continue;
        }
        
        // TODO: PRODEV-16141 - Temporary workaround for API bug in applicationCounts field
        // Remove this exclusion once the API bug is fixed
        if (fieldName === 'applicationCounts') {
            continue;
        }
        // Check for list types FIRST, but need to handle NonNull wrappers
        let currentType = fieldDef.type;
        // Unwrap NonNull to get to the actual type
        if ((0, graphql_1.isNonNullType)(currentType)) {
            currentType = currentType.ofType;
        }
        // Check if the field type is a list type (handles both nullable and non-nullable lists)
        // For `errors: [Error!]` - currentType is already the list type  
        // For `errors: [Error!]!` - currentType after unwrapping NonNull is the list type
        if ((0, graphql_1.isListType)(currentType)) {
            // Handle list/array types - get the inner type
            const innerType = (0, graphql_1.getNamedType)(fieldDef.type);
            if ((0, graphql_1.isObjectType)(innerType)) {
                // For arrays of objects, recursively generate selections for the inner type
                const nestedSelections = generateObjectFieldSelection(innerType, schema, config, newVisitedTypes, depth + 1);
                selectedFields.push(`${fieldName} {\n          ${nestedSelections.replace(/\n/g, '\n          ')}\n        }`);
            }
            else if ((0, graphql_1.isInterfaceType)(innerType)) {
                // For arrays of interfaces, generate selections for the interface
                const nestedSelections = generateUnionInterfaceFieldSelection(innerType, schema, config);
                selectedFields.push(`${fieldName} {\n          ${nestedSelections.replace(/\n/g, '\n          ')}\n        }`);
            }
            else if ((0, graphql_1.isUnionType)(innerType)) {
                // For arrays of unions, generate selections for the union
                const nestedSelections = generateUnionInterfaceFieldSelection(innerType, schema, config);
                selectedFields.push(`${fieldName} {\n          ${nestedSelections.replace(/\n/g, '\n          ')}\n        }`);
            }
            else {
                // For arrays of scalars/enums, just include the field name
                selectedFields.push(fieldName);
            }
        }
        else {
            // For non-list types, get the named type and check what it is
            const fieldType = (0, graphql_1.getNamedType)(fieldDef.type);
            if ((0, graphql_1.isScalarType)(fieldType) || (0, graphql_1.isEnumType)(fieldType)) {
                selectedFields.push(fieldName);
            }
            else if ((0, graphql_1.isObjectType)(fieldType)) {
                // For nested object types, recursively generate selections
                const nestedSelections = generateObjectFieldSelection(fieldType, schema, config, newVisitedTypes, depth + 1);
                selectedFields.push(`${fieldName} {\n          ${nestedSelections.replace(/\n/g, '\n          ')}\n        }`);
            }
            else if ((0, graphql_1.isInterfaceType)(fieldType)) {
                // For interface types, generate selections for the interface
                const nestedSelections = generateUnionInterfaceFieldSelection(fieldType, schema, config);
                selectedFields.push(`${fieldName} {\n          ${nestedSelections.replace(/\n/g, '\n          ')}\n        }`);
            }
            else if ((0, graphql_1.isUnionType)(fieldType)) {
                // For union types, generate selections for the union
                const nestedSelections = generateUnionInterfaceFieldSelection(fieldType, schema, config);
                selectedFields.push(`${fieldName} {\n          ${nestedSelections.replace(/\n/g, '\n          ')}\n        }`);
            }
        }
    }
    return selectedFields.join('\n        ');
}
/**
 * Generates field selection for union or interface types
 */
function generateUnionInterfaceFieldSelection(type, schema, config) {
    const selections = ['__typename'];
    if ((0, graphql_1.isInterfaceType)(type)) {
        // For interface types, include all interface fields
        const fields = type.getFields();
        for (const [fieldName, fieldDef] of Object.entries(fields)) {
            const fieldType = (0, graphql_1.getNamedType)(fieldDef.type);
            if ((0, graphql_1.isScalarType)(fieldType) || (0, graphql_1.isEnumType)(fieldType)) {
                selections.push(fieldName);
            }
        }
    }
    else if ((0, graphql_1.isUnionType)(type)) {
        // For union types, generate inline fragments for each possible type
        const possibleTypes = type.getTypes();
        for (const possibleType of possibleTypes) {
            if ((0, graphql_1.isObjectType)(possibleType)) {
                const fields = possibleType.getFields();
                const typeSelections = ['__typename'];
                // Add scalar and enum fields from this type
                for (const [fieldName, fieldDef] of Object.entries(fields)) {
                    const fieldType = (0, graphql_1.getNamedType)(fieldDef.type);
                    if ((0, graphql_1.isScalarType)(fieldType) || (0, graphql_1.isEnumType)(fieldType)) {
                        typeSelections.push(fieldName);
                    }
                }
                // Add inline fragment for this type
                selections.push(`... on ${possibleType.name} {\n          ${typeSelections.join('\n          ')}\n        }`);
            }
        }
    }
    return selections.join('\n        ');
}
/**
 * Generates the client methods code
 */
function generateClientMethods(operations, errorTypes, config) {
    const imports = generateImports(operations, errorTypes, config);
    const methods = operations.map(op => generateMethodCode(op, config)).join('\n\n');
    const errorUtilities = generateErrorUtilities(errorTypes);
    // Generate a mixin class that extends ApiClient
    return `${imports}
import { ApiClient } from '${config.clientImportPath}';

${errorUtilities}

/**
 * Generated client methods for GraphQL operations
 * Extends the base ApiClient with auto-generated typed methods
 */
export class GeneratedApiClient extends ApiClient {
${methods.split('\n').map(line => line ? `  ${line}` : '').join('\n')}
}

/**
 * Type-safe client with all generated methods
 */
export type TypedApiClient = GeneratedApiClient;`;
}
/**
 * Generates import statements for the generated code
 */
function generateImports(operations, errorTypes, config) {
    // Get unique type names needed for imports (excluding 'never')
    const typeNames = new Set();
    operations.forEach(op => {
        if (op.variablesType !== 'never') {
            typeNames.add(op.variablesType);
        }
        if (op.resultType !== 'never') {
            typeNames.add(op.resultType);
        }
    });
    // Add error types to imports
    errorTypes.forEach(errorType => {
        typeNames.add(errorType.name);
    });
    const typeImports = Array.from(typeNames).join(', ');
    return `
import type { ClientRequestOptions, GraphQLResult } from '${config.clientImportPath}';
import type { ${typeImports} } from './types';
  `.trim();
}
/**
 * Generates error handling utilities based on schema error types
 */
function generateErrorUtilities(errorTypes) {
    const errorTypeConstants = generateErrorTypeConstants(errorTypes);
    const typeGuards = generateErrorTypeGuards(errorTypes);
    const errorFactory = generateErrorFactory(errorTypes);
    const errorUtils = generateErrorUtils(errorTypes);
    return `
// Error handling utilities generated from GraphQL schema

${errorTypeConstants}

${typeGuards}

${errorFactory}

${errorUtils}
  `.trim();
}
/**
 * Generates error type constants
 */
function generateErrorTypeConstants(errorTypes) {
    const constants = errorTypes.map(error => `  ${error.name.toUpperCase()}: '${error.name}'`).join(',\n');
    return `
/**
 * GraphQL Error Type Constants
 */
export const GraphQLErrorTypes = {
${constants}
} as const;

export type GraphQLErrorType = (typeof GraphQLErrorTypes)[keyof typeof GraphQLErrorTypes];
  `.trim();
}
/**
 * Generates type guard functions for error types
 */
function generateErrorTypeGuards(errorTypes) {
    const guards = errorTypes.map(error => `
/**
 * Type guard for ${error.name}
 */
export function is${error.name}(error: any): error is ${error.name} {
  return error && typeof error === 'object' && error.__typename === '${error.name}';
}`).join('\n');
    return guards;
}
/**
 * Generates error factory for transforming GraphQL errors
 */
function generateErrorFactory(errorTypes) {
    const errorMap = errorTypes.map(error => `  [GraphQLErrorTypes.${error.name.toUpperCase()}]: '${error.name}'`).join(',\n');
    return `
/**
 * Factory for creating typed errors from GraphQL error responses
 */
export class GraphQLErrorFactory {
  private static readonly errorTypeMap = {
${errorMap}
  };

  /**
   * Creates a typed error object from a GraphQL error response
   */
  static createTypedError(error: any): any {
    if (!error || typeof error !== 'object') {
      return error;
    }

    const typeName = error.__typename;
    if (!typeName || !(typeName in this.errorTypeMap)) {
      return error;
    }

    // Return the error with proper typing
    return error;
  }

  /**
   * Checks if an error is a known GraphQL error type
   */
  static isKnownErrorType(typename: string): boolean {
    return Object.values(this.errorTypeMap).includes(typename);
  }

  /**
   * Transforms an array of GraphQL errors to typed errors
   */
  static transformErrors(errors: any[]): any[] {
    if (!Array.isArray(errors)) {
      return [];
    }
    
    return errors.map(error => this.createTypedError(error));
  }
}
  `.trim();
}
/**
 * Generates error utility functions
 */
function generateErrorUtils(errorTypes) {
    const hasErrorChecks = errorTypes.map(error => `
  /**
   * Checks if response contains ${error.name}
   */
  static has${error.name}(errors?: any[]): boolean {
    return Array.isArray(errors) && errors.some(error => is${error.name}(error));
  }`).join('\n');
    return `
/**
 * Utility functions for error handling
 */
export class ErrorUtils {
  /**
   * Checks if response contains any known error types
   */
  static hasKnownErrors(errors?: any[]): boolean {
    return Array.isArray(errors) && errors.some(error => 
      error && error.__typename && GraphQLErrorFactory.isKnownErrorType(error.__typename)
    );
  }

${hasErrorChecks}

  /**
   * Filters errors by type
   */
  static filterErrorsByType<T>(errors: any[], typeName: string): T[] {
    if (!Array.isArray(errors)) {
      return [];
    }
    
    return errors.filter(error => 
      error && error.__typename === typeName
    ) as T[];
  }

  /**
   * Gets first error of specific type
   */
  static getFirstErrorOfType<T>(errors: any[], typeName: string): T | undefined {
    const filtered = this.filterErrorsByType<T>(errors, typeName);
    return filtered.length > 0 ? filtered[0] : undefined;
  }
}
  `.trim();
}
/**
 * Generates the code for a single client method
 */
function generateMethodCode(operation, config) {
    const methodName = `${config.methodPrefix}${operation.name}${config.methodSuffix}`;
    // Generate JSDoc comment
    const jsdoc = config.generateDocs ? generateJSDoc(operation) : '';
    // Generate method signature
    const variablesParam = operation.hasVariables
        ? `variables: ${operation.variablesType},`
        : '';
    // Generate method body
    const methodCall = operation.type === 'query' ? 'query' : 'mutate';
    const variablesArg = operation.hasVariables ? 'variables' : 'undefined';
    // Try putting the entire method signature on one line with explicit brace positioning
    const params = operation.hasVariables
        ? `${variablesParam} options: Omit<ClientRequestOptions, 'variables'> = {}`
        : `options: Omit<ClientRequestOptions, 'variables'> = {}`;
    let methodLines = [];
    methodLines.push(`  async ${methodName}(${params}): Promise<GraphQLResult<{ ${operation.name}: ${operation.resultType} }>> {`);
    methodLines.push(`    const ${operation.type}String = \`${operation.operationString}\`;`);
    methodLines.push(`    `);
    methodLines.push(`    return this.${methodCall}<`);
    methodLines.push(`      { ${operation.name}: ${operation.resultType} },`);
    methodLines.push(`      ${operation.hasVariables ? operation.variablesType : 'never'}`);
    methodLines.push(`    >(${operation.type}String, ${variablesArg}, options);`);
    methodLines.push(`  }`);
    const methodSignatureAndBody = methodLines.join('\n');
    return `${jsdoc}\n${methodSignatureAndBody}`;
}
/**
 * Generates JSDoc comment for an operation
 */
function generateJSDoc(operation) {
    const description = operation.description || `${capitalize(operation.type)} operation for ${operation.name}`;
    return `
  /**
   * ${description}
   *
   * @param variables - ${operation.type} variables
   * @param options - Additional request options
   * @returns Promise resolving to ${operation.type} result
   */
  `;
}
/**
 * Utility function to capitalize a string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Extract the result type name from a GraphQL type string
 */
function extractResultTypeName(typeString) {
    // Remove GraphQL type modifiers (!, [, ])
    let cleanType = typeString.replace(/[![\]]/g, '');
    // Handle common scalar types
    const scalarMap = {
        'String': 'string',
        'Int': 'number',
        'Float': 'number',
        'Boolean': 'boolean',
        'ID': 'string',
        'DateTime': 'Date',
        'JSON': 'Record<string, any>',
    };
    return scalarMap[cleanType] || cleanType;
}
exports.default = { plugin: exports.plugin };
