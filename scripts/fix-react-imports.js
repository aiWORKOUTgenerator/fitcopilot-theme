#!/usr/bin/env node

/**
 * This script finds all Storybook story files that use JSX (render functions)
 * but don't import React, and adds the import statement.
 * It also fixes duplicate React imports.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all story files
const storyFiles = glob.sync('src/**/*.stories.{ts,tsx}');

console.log(`Found ${storyFiles.length} story files.`);
let fixedCount = 0;
let deduplicatedCount = 0;

storyFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check if file uses JSX but doesn't import React
  const usesJSX = content.includes('render: () => (');
  // Improved check for React imports - look anywhere in the file
  const hasReactImport = content.includes('import React');
  
  if (usesJSX && !hasReactImport) {
    console.log(`Adding React import to ${file}`);
    
    // Add React import at the top of the file
    const updatedContent = `import React from 'react';\n${content}`;
    fs.writeFileSync(file, updatedContent);
    fixedCount++;
  } 
  // Fix duplicate React imports
  else if (hasReactImport) {
    // Check for duplicate imports
    const lines = content.split('\n');
    const reactImportLines = lines.filter(line => line.includes('import React'));
    
    if (reactImportLines.length > 1) {
      console.log(`Fixing duplicate React imports in ${file}`);
      
      // Get all named imports
      const namedImports = new Set();
      reactImportLines.forEach(line => {
        const match = line.match(/import React,\s*{([^}]+)}/);
        if (match) {
          match[1].split(',').forEach(imp => {
            const trimmed = imp.trim();
            if (trimmed) namedImports.add(trimmed);
          });
        }
      });
      
      // Create a new single import with all named imports
      let newImport = 'import React';
      if (namedImports.size > 0) {
        newImport += `, { ${[...namedImports].join(', ')} }`;
      }
      newImport += " from 'react';";
      
      // Replace all React imports with the new one
      let processedContent = '';
      let skipLine = false;
      let addedNewImport = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import React')) {
          if (!addedNewImport) {
            processedContent += newImport + '\n';
            addedNewImport = true;
          }
          skipLine = true;
        } else if (skipLine && lines[i].trim() === '') {
          // Skip empty lines after import React
          skipLine = false;
        } else {
          skipLine = false;
          processedContent += lines[i] + '\n';
        }
      }
      
      fs.writeFileSync(file, processedContent);
      deduplicatedCount++;
    }
  }
});

console.log(`Added React imports to ${fixedCount} story files.`);
console.log(`Fixed duplicate React imports in ${deduplicatedCount} story files.`); 