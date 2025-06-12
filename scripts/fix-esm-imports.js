#!/usr/bin/env node

/**
 * Fix ES module imports by adding .js extensions
 * This is needed because TypeScript doesn't automatically add extensions for ES modules
 */

const fs = require('fs');
const path = require('path');

function fixImportsInFile(filePath) {
  if (!filePath.endsWith('.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix relative imports (./something or ../something) to add .js extension
  content = content.replace(
    /from\s+['"](\.\/?[^'"]*?)['"];/g,
    (match, importPath) => {
      // Don't modify if already has .js extension
      if (importPath.endsWith('.js')) {
        return match;
      }
      modified = true;
      return match.replace(importPath, importPath + '.js');
    }
  );
  
  // Fix dynamic imports too
  content = content.replace(
    /import\s*\(\s*['"](\.\/?[^'"]*?)['"]\s*\)/g,
    (match, importPath) => {
      if (importPath.endsWith('.js')) {
        return match;
      }
      modified = true;
      return match.replace(importPath, importPath + '.js');
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in: ${filePath}`);
  }
}

function fixImportsInDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      fixImportsInDirectory(fullPath);
    } else if (entry.isFile()) {
      fixImportsInFile(fullPath);
    }
  }
}

// Fix imports in the dist/esm directory
const esmDir = path.join(__dirname, '../dist/esm');
if (fs.existsSync(esmDir)) {
  console.log('Fixing ES module imports...');
  fixImportsInDirectory(esmDir);
  console.log('ES module imports fixed!');
} else {
  console.log('No dist/esm directory found');
}