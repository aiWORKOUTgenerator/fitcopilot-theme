#!/bin/bash

# Simple script to find and list files with exhaustive-deps warnings
echo "Finding files with exhaustive-deps warnings..."

# Run ESLint to find files with exhaustive-deps warnings, focusing only on src files
npx eslint "./src/**/*.{ts,tsx}" --rule "react-hooks/exhaustive-deps:warn" --format json > exhaustive_deps.json

echo "Processing results..."

# Process and display results
node -e "
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('exhaustive_deps.json', 'utf-8'));
  
  // Count total warnings
  let totalWarnings = 0;
  data.forEach(file => {
    const exhaustiveDeps = file.messages.filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps');
    totalWarnings += exhaustiveDeps.length;
  });
  
  // Get files with exhaustive-deps
  const filesWithExhaustiveDeps = data
    .filter(file => file.messages.some(msg => msg.ruleId === 'react-hooks/exhaustive-deps'))
    .map(file => ({
      path: file.filePath,
      count: file.messages.filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps').length,
      details: file.messages
        .filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps')
        .map(msg => ({
          line: msg.line,
          message: msg.message
        }))
    }))
    .sort((a, b) => b.count - a.count);
  
  console.log(\`Found \${filesWithExhaustiveDeps.length} source files with \${totalWarnings} exhaustive-deps warnings.\`);
  console.log();
  
  // Display top files with most warnings
  console.log('Files with exhaustive-deps warnings:');
  filesWithExhaustiveDeps.forEach(file => {
    console.log(\`  \${file.path} (\${file.count} warnings)\`);
    file.details.forEach(detail => {
      console.log(\`    - Line \${detail.line}: \${detail.message}\`);
    });
    console.log();
  });
  
  console.log('To fix these issues:');
  console.log('1. Add missing dependencies to the dependency array');
  console.log('2. Use useCallback/useMemo for functions and objects');
  console.log('3. Consider useRef for values that should not trigger re-renders');
  console.log();
  
  // Create report file
  const report = {
    totalFiles: filesWithExhaustiveDeps.length,
    totalWarnings,
    files: filesWithExhaustiveDeps.map(f => ({ 
      path: f.path, 
      count: f.count,
      details: f.details
    })),
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('reports/src-exhaustive-deps-report.json', JSON.stringify(report, null, 2));
  console.log('Detailed report saved to reports/src-exhaustive-deps-report.json');
"

# Clean up
rm exhaustive_deps.json
echo "Done." 