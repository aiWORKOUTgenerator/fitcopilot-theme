#!/bin/bash
LATEST_REPORT=$(ls -t reports/prod-errors-*.json | head -1)

if [ -z "$LATEST_REPORT" ]; then
  echo "No error reports found. Run './scripts/production-lint.sh' first."
  exit 1
fi

# Create directories for each error type
mkdir -p errors/{parsing,unused-vars,explicit-any,console,other}

# Classify errors by type
cat "$LATEST_REPORT" | \
  node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
    
    // Categorized error collections
    const parsingErrors = [];
    const unusedVarsErrors = [];
    const explicitAnyErrors = [];
    const consoleErrors = [];
    const otherErrors = [];
    
    // Process each file and categorize errors
    data.forEach(file => {
      const filePath = file.filePath;
      const fileName = filePath.split('/').pop();
      
      file.messages.forEach(msg => {
        if (msg.severity !== 2) return; // Skip warnings
        
        const error = {
          file: filePath,
          line: msg.line,
          column: msg.column,
          rule: msg.ruleId,
          message: msg.message
        };
        
        // Categorize based on rule or message
        if (!msg.ruleId || msg.message.includes('parsing error')) {
          parsingErrors.push(error);
        } else if (msg.ruleId === '@typescript-eslint/no-unused-vars') {
          unusedVarsErrors.push(error);
        } else if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
          explicitAnyErrors.push(error);
        } else if (msg.ruleId === 'no-console' || msg.ruleId === 'fitcopilot/use-logger') {
          consoleErrors.push(error);
        } else {
          otherErrors.push(error);
        }
      });
    });
    
    // Write categorized errors to files
    fs.writeFileSync('errors/parsing/errors.json', JSON.stringify(parsingErrors, null, 2));
    fs.writeFileSync('errors/unused-vars/errors.json', JSON.stringify(unusedVarsErrors, null, 2));
    fs.writeFileSync('errors/explicit-any/errors.json', JSON.stringify(explicitAnyErrors, null, 2));
    fs.writeFileSync('errors/console/errors.json', JSON.stringify(consoleErrors, null, 2));
    fs.writeFileSync('errors/other/errors.json', JSON.stringify(otherErrors, null, 2));
    
    // Generate summary
    console.log('Error Classification Summary:');
    console.log(\`  Parsing Errors: \${parsingErrors.length}\`);
    console.log(\`  Unused Variables: \${unusedVarsErrors.length}\`);
    console.log(\`  Explicit Any Types: \${explicitAnyErrors.length}\`);
    console.log(\`  Console Usage: \${consoleErrors.length}\`);
    console.log(\`  Other Errors: \${otherErrors.length}\`);
    console.log(\`  Total Errors: \${parsingErrors.length + unusedVarsErrors.length + explicitAnyErrors.length + consoleErrors.length + otherErrors.length}\`);
  " 