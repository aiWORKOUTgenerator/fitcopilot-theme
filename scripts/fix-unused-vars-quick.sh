#!/bin/bash

# Simple script to find and list files with unused variable warnings
echo "Finding files with unused variable warnings..."

# Run ESLint to find files with unused vars warnings, focusing only on src files
npx eslint "./src/**/*.{ts,tsx}" --rule "@typescript-eslint/no-unused-vars:warn" --format json > unused_vars.json

echo "Processing results..."

# Process and display results
node -e "
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('unused_vars.json', 'utf-8'));
  
  // Count total warnings
  let totalWarnings = 0;
  data.forEach(file => {
    const unusedVars = file.messages.filter(msg => msg.ruleId === '@typescript-eslint/no-unused-vars');
    totalWarnings += unusedVars.length;
  });
  
  // Get files with unused vars
  const filesWithUnusedVars = data
    .filter(file => file.messages.some(msg => msg.ruleId === '@typescript-eslint/no-unused-vars'))
    .map(file => ({
      path: file.filePath,
      count: file.messages.filter(msg => msg.ruleId === '@typescript-eslint/no-unused-vars').length
    }))
    .sort((a, b) => b.count - a.count);
  
  console.log(\`Found \${filesWithUnusedVars.length} source files with \${totalWarnings} unused variable warnings.\`);
  console.log();
  
  // Display top files with most warnings
  console.log('Top 10 files with most unused variables:');
  filesWithUnusedVars.slice(0, 10).forEach(file => {
    console.log(\`  \${file.path} (\${file.count} warnings)\`);
  });
  
  console.log();
  console.log('To fix these issues:');
  console.log('1. Prefix unused variables with an underscore (_)');
  console.log('2. Remove unused imports');
  console.log('3. For intentionally unused function parameters, use _param naming convention');
  console.log();
  
  // Create report file
  const report = {
    totalFiles: filesWithUnusedVars.length,
    totalWarnings,
    topFiles: filesWithUnusedVars.slice(0, 20).map(f => ({ path: f.path, count: f.count })),
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('reports/src-unused-vars-report.json', JSON.stringify(report, null, 2));
  console.log('Detailed report saved to reports/src-unused-vars-report.json');
"

# Clean up
rm unused_vars.json
echo "Done." 