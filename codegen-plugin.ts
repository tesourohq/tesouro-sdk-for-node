/**
 * Custom GraphQL Code Generator plugin for generating typed client methods
 *
 * This plugin generates strongly-typed methods for each GraphQL operation
 * that integrate with the ApiClient base infrastructure.
 */

import type { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import type {
  GraphQLSchema,
  OperationDefinitionNode,
  FieldDefinitionNode,
  DefinitionNode,
  GraphQLField,
  GraphQLObjectType,
} from 'graphql';
import { Kind, visit, isObjectType } from 'graphql';

/**
 * Configuration options for the client methods plugin
 */
export interface ClientMethodsPluginConfig {
  /** Prefix for generated method names (default: '') */
  methodPrefix?: string;
  /** Suffix for generated method names (default: '') */  
  methodSuffix?: string;
  /** Whether to generate JSDoc comments (default: true) */
  generateDocs?: boolean;
  /** Import path for the base client types (default: './client') */
  clientImportPath?: string;
}

/**
 * Information about a GraphQL operation extracted from the schema
 */
interface OperationInfo {
  /** Name of the operation (e.g., 'getUser') */
  name: string;
  /** Type of operation (query, mutation, subscription) */
  type: 'query' | 'mutation' | 'subscription';
  /** GraphQL operation string */
  operationString: string;
  /** TypeScript type name for variables (e.g., 'QueryGetUserArgs') */
  variablesType: string;
  /** TypeScript type name for the result (e.g., 'User') */
  resultType: string;
  /** Description from GraphQL schema */
  description?: string;
  /** Whether the operation requires variables */
  hasVariables: boolean;
}

/**
 * Custom GraphQL Code Generator plugin that generates client methods
 */
export const plugin: PluginFunction<ClientMethodsPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: ClientMethodsPluginConfig
): string => {
  // Apply default configuration
  const pluginConfig: Required<ClientMethodsPluginConfig> = {
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

/**
 * Extracts operation information from the GraphQL schema
 */
function extractOperationsFromSchema(schema: GraphQLSchema): OperationInfo[] {
  const operations: OperationInfo[] = [];

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
function createOperationInfo(
  fieldName: string,
  field: GraphQLField<any, any>,
  operationType: 'query' | 'mutation' | 'subscription'
): OperationInfo {
  // Generate the operation string
  const operationString = generateOperationString(fieldName, field, operationType);
  
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
function generateOperationString(
  fieldName: string,
  field: GraphQLField<any, any>,
  operationType: 'query' | 'mutation' | 'subscription'
): string {
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
  const fieldSelection = generateFieldSelection(field);

  return `
    ${operationType} ${operationTypeName}${capitalizedFieldName}${argsString} {
      ${fieldCall}${fieldSelection ? ` {\n        ${fieldSelection}\n      }` : ''}
    }
  `.trim();
}

/**
 * Generates field selection for a GraphQL field based on its return type
 */
function generateFieldSelection(field: GraphQLField<any, any>): string {
  // For now, generate a basic selection set
  // In a real implementation, you'd recursively build the selection based on the type
  const returnType = field.type;
  
  // Check if this is an object type that needs field selection
  if (isObjectType(returnType) || (returnType.toString().includes('!') && returnType.toString().includes('['))) {
    // For object types, we need some basic fields
    // This is a simplified approach - real implementation would introspect the type
    return '__typename\n        id';
  }
  
  // For scalar types, no selection needed
  return '';
}

/**
 * Generates the client methods code
 */
function generateClientMethods(
  operations: OperationInfo[],
  config: Required<ClientMethodsPluginConfig>
): string {
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
function generateImports(
  operations: OperationInfo[],
  config: Required<ClientMethodsPluginConfig>
): string {
  // Get unique type names needed for imports (excluding 'never')
  const typeNames = new Set<string>();
  
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
function generateMethodCode(
  operation: OperationInfo,
  config: Required<ClientMethodsPluginConfig>
): string {
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
function generateJSDoc(operation: OperationInfo): string {
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
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extract the result type name from a GraphQL type string
 */
function extractResultTypeName(typeString: string): string {
  // Remove GraphQL type modifiers (!, [, ])
  let cleanType = typeString.replace(/[![\]]/g, '');
  
  // Handle common scalar types
  const scalarMap: Record<string, string> = {
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

export default { plugin };