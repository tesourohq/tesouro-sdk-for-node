#!/usr/bin/env node

const fs = require('fs');
const { buildSchema } = require('graphql');

async function validateSchema() {
  try {
    // Read the sample schema file
    const schemaContent = fs.readFileSync('./sample-schema.graphql', 'utf8');
    
    // Try to build the schema
    const schema = buildSchema(schemaContent);
    
    console.log('✅ Schema is syntactically valid');
    console.log(`📊 Schema contains ${Object.keys(schema.getTypeMap()).length} types`);
    
    // List the main types
    const types = schema.getTypeMap();
    const customTypes = Object.keys(types).filter(name => 
      !name.startsWith('__') && 
      !['String', 'Int', 'Float', 'Boolean', 'ID'].includes(name)
    );
    
    console.log('📋 Custom types found:');
    customTypes.forEach(type => {
      console.log(`   - ${type}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Schema validation failed:');
    console.error(error.message);
    return false;
  }
}

// Run validation
validateSchema().then(success => {
  process.exit(success ? 0 : 1);
});