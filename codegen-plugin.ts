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
  GraphQLType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLScalarType,
  GraphQLEnumType,
} from 'graphql';
import { 
  Kind, 
  visit, 
  isObjectType, 
  isScalarType, 
  isEnumType, 
  isListType, 
  isNonNullType,
  isUnionType,
  isInterfaceType,
  getNamedType,
} from 'graphql';

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
  /** Maximum depth for field selection generation (default: 10) */
  maxFieldDepth?: number;
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
    maxFieldDepth: 10,
    ...config,
  };

  // Extract operations from the schema
  const operations = extractOperationsFromSchema(schema, pluginConfig);

  // Generate the output code
  return generateClientMethods(operations, pluginConfig);
};

/**
 * Extracts operation information from the GraphQL schema
 */
function extractOperationsFromSchema(schema: GraphQLSchema, config: Required<ClientMethodsPluginConfig>): OperationInfo[] {
  const operations: OperationInfo[] = [];

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
 * Creates operation information from a GraphQL field
 */
function createOperationInfo(
  fieldName: string,
  field: GraphQLField<any, any>,
  operationType: 'query' | 'mutation' | 'subscription',
  schema: GraphQLSchema,
  config: Required<ClientMethodsPluginConfig>
): OperationInfo {
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
function generateOperationString(
  fieldName: string,
  field: GraphQLField<any, any>,
  operationType: 'query' | 'mutation' | 'subscription',
  schema: GraphQLSchema,
  config: Required<ClientMethodsPluginConfig>
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
function generateFieldSelection(field: GraphQLField<any, any>, schema: GraphQLSchema, config: Required<ClientMethodsPluginConfig>): string {
  const returnType = getNamedType(field.type);
  
  // For scalar, enum, or other non-object types, no selection needed
  if (isScalarType(returnType) || isEnumType(returnType)) {
    return '';
  }
  
  // For object types, generate a complete field selection
  if (isObjectType(returnType)) {
    return generateObjectFieldSelection(returnType, schema, config);
  }
  
  // For union or interface types, generate a selection with fragments
  if (isUnionType(returnType) || isInterfaceType(returnType)) {
    return generateUnionInterfaceFieldSelection(returnType, schema, config);
  }
  
  // Fallback for unknown types
  return '__typename';
}

/**
 * Generates field selection for GraphQL object types including all scalar/enum fields
 */
function generateObjectFieldSelection(
  objectType: GraphQLObjectType, 
  schema: GraphQLSchema, 
  config: Required<ClientMethodsPluginConfig>,
  visitedTypes: Set<string> = new Set(),
  depth: number = 0
): string {
  // Prevent infinite recursion with depth limit
  if (depth >= config.maxFieldDepth) {
    return '__typename';
  }
  
  // Detect cycles by checking if we're already processing this type
  if (visitedTypes.has(objectType.name)) {
    return '__typename';
  }
  
  const fields = objectType.getFields();
  const selectedFields: string[] = ['__typename'];
  
  // Add this type to the visited set for cycle detection
  const newVisitedTypes = new Set(visitedTypes);
  newVisitedTypes.add(objectType.name);
  
  // Include all scalar and enum fields
  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const fieldType = getNamedType(fieldDef.type);
    
    if (isScalarType(fieldType) || isEnumType(fieldType)) {
      selectedFields.push(fieldName);
    } else if (isObjectType(fieldType)) {
      // For nested object types, recursively generate selections
      const nestedSelections = generateObjectFieldSelection(
        fieldType, 
        schema, 
        config, 
        newVisitedTypes, 
        depth + 1
      );
      selectedFields.push(`${fieldName} {\n          ${nestedSelections.replace(/\n/g, '\n          ')}\n        }`);
    }
  }
  
  return selectedFields.join('\n        ');
}

/**
 * Generates field selection for union or interface types
 */
function generateUnionInterfaceFieldSelection(type: GraphQLUnionType | GraphQLInterfaceType, schema: GraphQLSchema, config: Required<ClientMethodsPluginConfig>): string {
  const selections = ['__typename'];
  
  if (isInterfaceType(type)) {
    // For interface types, include all interface fields
    const fields = type.getFields();
    
    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      const fieldType = getNamedType(fieldDef.type);
      if (isScalarType(fieldType) || isEnumType(fieldType)) {
        selections.push(fieldName);
      }
    }
  }
  
  return selections.join('\n        ');
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