const fs = require('fs');
const path = require('path');

// Parse TypeScript errors
function parseTypeScriptErrors(logPath) {
  try {
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').filter(line => line.includes('error TS'));
    
    const errors = lines.map(line => {
      const [filePath, errorInfo] = line.split('(');
      const [lineCol, errorDetails] = errorInfo ? errorInfo.split(')') : ['', errorInfo || ''];
      const [lineNum, colNum] = lineCol ? lineCol.split(',') : ['', ''];
      const [errorCode, errorMessage] = errorDetails ? errorDetails.split(':').map(s => s.trim()) : ['', ''];
      
      return {
        filePath: filePath ? filePath.trim() : '',
        line: parseInt(lineNum) || 0,
        column: parseInt(colNum) || 0,
        code: errorCode || '',
        message: errorMessage || errorDetails || '',
      };
    });

    return errors;
  } catch (err) {
    console.error('Error parsing TypeScript errors:', err);
    return [];
  }
}

// Parse ESLint errors
function parseESLintErrors(jsonPath) {
  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    const results = JSON.parse(content);
    
    const errors = [];
    results.forEach(result => {
      const filePath = result.filePath;
      result.messages.forEach(msg => {
        errors.push({
          filePath,
          line: msg.line || 0,
          column: msg.column || 0,
          code: msg.ruleId || '',
          message: msg.message || '',
          severity: msg.severity
        });
      });
    });
    
    return errors;
  } catch (err) {
    console.error('Error parsing ESLint errors:', err);
    return [];
  }
}

// Group errors by various criteria
function groupErrors(errors, groupingKey) {
  const groups = {};
  
  errors.forEach(error => {
    const key = error[groupingKey] || 'unknown';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(error);
  });
  
  return Object.entries(groups)
    .map(([key, items]) => ({ 
      key, 
      count: items.length,
      items
    }))
    .sort((a, b) => b.count - a.count);
}

// Analyze patterns in error messages
function analyzePatterns(tsErrors, eslintErrors) {
  // Common TypeScript error patterns
  const anyTypeErrors = tsErrors.filter(e => 
    e.message.includes('any') || e.code === 'TS7006' || e.code === 'TS7005'
  );
  
  const missingPropsErrors = tsErrors.filter(e => 
    e.message.includes('missing the following properties') || e.code === 'TS2739'
  );
  
  const incompatibleTypeErrors = tsErrors.filter(e => 
    e.message.includes('is not assignable to type') || e.code === 'TS2322'
  );
  
  // Common ESLint error patterns
  const unusedVarsErrors = eslintErrors.filter(e => 
    e.code === '@typescript-eslint/no-unused-vars' || e.code === 'no-unused-vars'
  );
  
  const explicitAnyErrors = eslintErrors.filter(e => 
    e.code === '@typescript-eslint/no-explicit-any'
  );
  
  const consoleErrors = eslintErrors.filter(e => 
    e.code === 'no-console'
  );
  
  const missingDepsErrors = eslintErrors.filter(e => 
    e.code === 'react-hooks/exhaustive-deps'
  );
  
  return {
    typescript: {
      anyTypeIssues: { count: anyTypeErrors.length, sample: anyTypeErrors.slice(0, 5) },
      missingProps: { count: missingPropsErrors.length, sample: missingPropsErrors.slice(0, 5) },
      incompatibleTypes: { count: incompatibleTypeErrors.length, sample: incompatibleTypeErrors.slice(0, 5) }
    },
    eslint: {
      unusedVariables: { count: unusedVarsErrors.length, sample: unusedVarsErrors.slice(0, 5) },
      explicitAny: { count: explicitAnyErrors.length, sample: explicitAnyErrors.slice(0, 5) },
      consoleStatements: { count: consoleErrors.length, sample: consoleErrors.slice(0, 5) },
      missingDependencies: { count: missingDepsErrors.length, sample: missingDepsErrors.slice(0, 5) }
    }
  };
}

// Main execution
function generateDashboard() {
  // Parse errors
  const tsErrors = parseTypeScriptErrors('analysis/errors/typescript-errors.log');
  const eslintErrors = parseESLintErrors('analysis/errors/eslint-errors.json');
  
  // Group by different criteria
  const outputData = {
    summary: {
      totalTsErrors: tsErrors.length,
      totalEslintErrors: eslintErrors.length
    },
    byErrorCode: {
      typescript: groupErrors(tsErrors, 'code'),
      eslint: groupErrors(eslintErrors, 'code')
    },
    byFilePath: {
      typescript: groupErrors(tsErrors, 'filePath'),
      eslint: groupErrors(eslintErrors, 'filePath')
    },
    patternAnalysis: analyzePatterns(tsErrors, eslintErrors)
  };
  
  // Write output to file
  fs.writeFileSync(
    'analysis/errors/error-dashboard.json', 
    JSON.stringify(outputData, null, 2)
  );
  
  // Create a summary file
  let summary = `# Error Analysis Summary\n\n`;
  summary += `## Error Counts\n`;
  summary += `- Total TypeScript Errors: ${tsErrors.length}\n`;
  summary += `- Total ESLint Errors: ${eslintErrors.length}\n\n`;
  
  summary += `## Top TypeScript Error Codes\n`;
  outputData.byErrorCode.typescript.slice(0, 10).forEach(group => {
    summary += `- ${group.key}: ${group.count} occurrences\n`;
  });
  
  summary += `\n## Top ESLint Rules Violated\n`;
  outputData.byErrorCode.eslint.slice(0, 10).forEach(group => {
    summary += `- ${group.key}: ${group.count} occurrences\n`;
  });
  
  summary += `\n## Most Problematic Files (TypeScript)\n`;
  outputData.byFilePath.typescript.slice(0, 10).forEach(group => {
    summary += `- ${group.key}: ${group.count} errors\n`;
  });
  
  summary += `\n## Most Problematic Files (ESLint)\n`;
  outputData.byFilePath.eslint.slice(0, 10).forEach(group => {
    summary += `- ${group.key}: ${group.count} errors\n`;
  });
  
  fs.writeFileSync('analysis/errors/error-summary.md', summary);
  
  console.log(`Generated error dashboard with ${tsErrors.length} TypeScript errors and ${eslintErrors.length} ESLint errors`);
}

// Run the dashboard generation
generateDashboard(); 