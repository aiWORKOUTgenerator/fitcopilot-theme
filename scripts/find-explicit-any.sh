#!/bin/bash

# Simple script to find and list files with explicit-any warnings
echo "Finding files with explicit-any warnings..."

# Run ESLint to find files with explicit-any warnings, focusing only on src files
npx eslint "./src/**/*.{ts,tsx}" --rule "@typescript-eslint/no-explicit-any:warn" --format json > explicit_any.json

echo "Processing results..."

# Process and display results
node -e "
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('explicit_any.json', 'utf-8'));
  
  // Count total warnings
  let totalWarnings = 0;
  data.forEach(file => {
    const explicitAny = file.messages.filter(msg => msg.ruleId === '@typescript-eslint/no-explicit-any');
    totalWarnings += explicitAny.length;
  });
  
  // Get files with explicit-any
  const filesWithExplicitAny = data
    .filter(file => file.messages.some(msg => msg.ruleId === '@typescript-eslint/no-explicit-any'))
    .map(file => ({
      path: file.filePath,
      count: file.messages.filter(msg => msg.ruleId === '@typescript-eslint/no-explicit-any').length
    }))
    .sort((a, b) => b.count - a.count);
  
  console.log(\`Found \${filesWithExplicitAny.length} source files with \${totalWarnings} explicit-any warnings.\`);
  console.log();
  
  // Display top files with most warnings
  console.log('Top 10 files with most explicit-any warnings:');
  filesWithExplicitAny.slice(0, 10).forEach(file => {
    console.log(\`  \${file.path} (\${file.count} warnings)\`);
  });
  
  console.log();
  console.log('To fix these issues:');
  console.log('1. Create proper interfaces for the data structures');
  console.log('2. Use unknown + type guards where appropriate');
  console.log('3. Use generics for flexible typing');
  console.log();
  
  // Create report file
  const report = {
    totalFiles: filesWithExplicitAny.length,
    totalWarnings,
    topFiles: filesWithExplicitAny.slice(0, 20).map(f => ({ path: f.path, count: f.count })),
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('reports/src-explicit-any-report.json', JSON.stringify(report, null, 2));
  console.log('Detailed report saved to reports/src-explicit-any-report.json');
"

# Clean up
rm explicit_any.json
echo "Done." 