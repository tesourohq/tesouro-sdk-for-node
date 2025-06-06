"use strict";
/**
 * Custom GraphQL Code Generator plugin for generating typed client methods
 *
 * This plugin generates strongly-typed methods for each GraphQL operation
 * that integrate with the ApiClient base infrastructure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
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
        ...config,
    };
    // Extract operations from the schema
    const operations = extractOperationsFromSchema(schema);
    // Generate the output code
    return generateClientMethods(operations, pluginConfig);
};
exports.plugin = plugin;
/**
 * Extracts operation information from the GraphQL schema
 */
function extractOperationsFromSchema(schema) {
    const operations = [];
    // Get the root operation types
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();
    // Extract query operations
    if (queryType) {
        const queryFields = queryType.getFields();
        for (const [fieldName, field] of Object.entries(queryFields)) {
            operations.push(createOperationInfo(fieldName, field, 'query'));
        }
    }
    // Extract mutation operations
    if (mutationType) {
        const mutationFields = mutationType.getFields();
        for (const [fieldName, field] of Object.entries(mutationFields)) {
            operations.push(createOperationInfo(fieldName, field, 'mutation'));
        }
    }
    // Extract subscription operations
    if (subscriptionType) {
        const subscriptionFields = subscriptionType.getFields();
        for (const [fieldName, field] of Object.entries(subscriptionFields)) {
            operations.push(createOperationInfo(fieldName, field, 'subscription'));
        }
    }
    return operations;
}
/**
 * Creates operation information from a GraphQL field
 */
function createOperationInfo(fieldName, field, operationType) {
    // Generate the operation string (this is a simplified version)
    const operationString = generateOperationString(fieldName, field, operationType);
    // Generate TypeScript type names
    const capitalizedFieldName = capitalize(fieldName);
    const operationTypeName = capitalize(operationType);
    const variablesType = `${operationTypeName}${capitalizedFieldName}Args`;
    const resultType = field.type.toString(); // Simplified - would need proper type mapping
    const hasVariables = field.args && field.args.length > 0;
    return {
        name: fieldName,
        type: operationType,
        operationString,
        variablesType: hasVariables ? variablesType : 'never',
        resultType: extractResultTypeName(resultType),
        description: field.description,
        hasVariables,
    };
}
/**
 * Generates a GraphQL operation string for a field
 */
function generateOperationString(fieldName, field, operationType) {
    const capitalizedFieldName = capitalize(fieldName);
    const operationTypeName = capitalize(operationType);
    // Build arguments string
    const args = field.args || [];
    const argsString = args.length > 0
        ? `(${args.map(arg => `$${arg.name}: ${arg.type}`).join(', ')})`
        : '';
    // Build field call
    const fieldCall = args.length > 0
        ? `${fieldName}(${args.map(arg => `${arg.name}: $${arg.name}`).join(', ')})`
        : fieldName;
    return `
    ${operationType} ${operationTypeName}${capitalizedFieldName}${argsString} {
      ${fieldCall} {
        # TODO: Add field selection based on return type
        __typename
      }
    }
  `.trim();
}
/**
 * Generates the client methods code
 */
function generateClientMethods(operations, config) {
    const imports = generateImports(operations, config);
    const methods = operations.map(op => generateMethodCode(op, config)).join('\n\n');
    // Generate a mixin class that extends ApiClient
    return `${imports}
import { ApiClient } from '${config.clientImportPath}';

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
function generateImports(operations, config) {
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
    const typeImports = Array.from(typeNames).join(', ');
    return `
import type { ClientRequestOptions, GraphQLResult } from '${config.clientImportPath}';
import type { ${typeImports} } from './types';
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
    const methodSignature = `
  async ${methodName}(
    ${variablesParam}${operation.hasVariables ? '\n    ' : ''}options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ ${operation.name}: ${operation.resultType} }>>`;
    // Generate method body
    const operationVar = operation.type === 'subscription' ? 'subscription' : (operation.type === 'query' ? 'query' : 'mutation');
    const methodCall = operation.type === 'subscription' ? 'mutate' : (operation.type === 'query' ? 'query' : 'mutate');
    const typeArg = operation.hasVariables ? operation.variablesType : 'never';
    const methodBody = `
  {
    const ${operationVar} = \`${operation.operationString}\`;
    
    return this.${methodCall}<
      { ${operation.name}: ${operation.resultType} },
      ${typeArg}
    >(${operationVar}, ${operation.hasVariables ? 'variables' : 'undefined'}, options);
  }`;
    return `${jsdoc}${methodSignature}${methodBody}`;
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
    // This is a simplified implementation
    // In a real implementation, you'd properly parse the GraphQL type
    return typeString.replace(/[![\]]/g, '');
}
exports.default = { plugin: exports.plugin };
