const fs = require('fs');
const path = require('path');

// Load errors from the dashboard if it exists, otherwise load directly from log files
function loadErrors() {
  try {
    if (fs.existsSync('analysis/errors/error-dashboard.json')) {
      console.log('Loading errors from dashboard...');
      const dashboard = JSON.parse(fs.readFileSync('analysis/errors/error-dashboard.json', 'utf8'));
      const tsErrors = dashboard.byErrorCode.typescript.flatMap(group => group.items);
      const eslintErrors = dashboard.byErrorCode.eslint.flatMap(group => group.items);
      return { tsErrors, eslintErrors };
    } else {
      console.log('Dashboard not found, loading from original files...');
      // Fallback to loading from original files
      const tsErrors = loadTypeScriptErrors();
      const eslintErrors = loadESLintErrors();
      return { tsErrors, eslintErrors };
    }
  } catch (err) {
    console.error('Error loading errors:', err);
    return { tsErrors: [], eslintErrors: [] };
  }
}

// Load TypeScript errors directly
function loadTypeScriptErrors() {
  try {
    const content = fs.readFileSync('analysis/errors/typescript-errors.log', 'utf8');
    const lines = content.split('\n').filter(line => line.includes('error TS'));
    
    return lines.map(line => {
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
  } catch (err) {
    console.error('Error loading TypeScript errors:', err);
    return [];
  }
}

// Load ESLint errors directly
function loadESLintErrors() {
  try {
    const content = fs.readFileSync('analysis/errors/eslint-errors.json', 'utf8');
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
    console.error('Error loading ESLint errors:', err);
    return [];
  }
}

// Define pattern detectors for recurring error patterns
const patternDetectors = {
  // Type safety patterns
  anyInProps: error => 
    error.code === 'TS7006' && 
    error.message.includes('props') && 
    error.message.includes('any'),
    
  anyInEventHandlers: error => 
    (error.code === 'TS7006' || error.code === '@typescript-eslint/no-explicit-any') && 
    (error.message.match(/\b(event|e|ev)\b/) || error.message.match(/\bonChange|\bonClick|\bonSubmit/)) &&
    error.message.includes('any'),
    
  missingPropTypes: error => 
    error.code === 'TS2741' && 
    error.message.includes('missing the following properties'),
    
  incompatiblePropTypes: error => 
    error.code === 'TS2322' && 
    error.message.includes('Type') && 
    error.message.includes('is not assignable to type'),
    
  // React patterns
  missingDependencies: error => 
    error.code === 'react-hooks/exhaustive-deps',
    
  unusedDependencies: error => 
    error.code === 'react-hooks/exhaustive-deps' && 
    error.message.includes('Unnecessary dependency'),
    
  // Code style patterns
  unusedVariables: error => 
    error.code === '@typescript-eslint/no-unused-vars' || 
    error.code === 'no-unused-vars',
    
  consoleStatements: error => 
    error.code === 'no-console',
    
  // Event handling patterns
  incorrectEventType: error => 
    error.code === 'TS2769' && 
    error.message.match(/\b(event|e|ev)\b/) &&
    error.message.includes('is not assignable to parameter of type'),
    
  // Advanced patterns
  discriminatedUnionMissing: error => 
    error.code === 'TS2339' && 
    error.message.includes('Property') && 
    error.message.includes('does not exist on type'),
    
  // Missing return types
  missingReturnType: error => 
    error.code === '@typescript-eslint/explicit-function-return-type' || 
    error.code === '@typescript-eslint/explicit-module-boundary-types',
    
  // API-related errors
  apiTypeMismatch: error => 
    (error.code === 'TS2322' || error.code === 'TS2345') && 
    (error.message.includes('api') || error.message.includes('response') || error.message.includes('data')),
};

// Apply pattern detectors to errors
function detectPatterns() {
  const { tsErrors, eslintErrors } = loadErrors();
  console.log(`Analyzing ${tsErrors.length} TypeScript errors and ${eslintErrors.length} ESLint errors`);
  
  const patterns = {};
  
  // Initialize pattern counts
  Object.keys(patternDetectors).forEach(pattern => {
    patterns[pattern] = {
      count: 0,
      files: {},
      examples: []
    };
  });
  
  // Process TypeScript errors
  tsErrors.forEach(error => {
    Object.entries(patternDetectors).forEach(([pattern, detector]) => {
      if (detector(error)) {
        patterns[pattern].count++;
        if (!patterns[pattern].files[error.filePath]) {
          patterns[pattern].files[error.filePath] = 0;
        }
        patterns[pattern].files[error.filePath]++;
        
        if (patterns[pattern].examples.length < 3) {
          patterns[pattern].examples.push(error);
        }
      }
    });
  });
  
  // Process ESLint errors
  eslintErrors.forEach(error => {
    Object.entries(patternDetectors).forEach(([pattern, detector]) => {
      if (detector(error)) {
        patterns[pattern].count++;
        if (!patterns[pattern].files[error.filePath]) {
          patterns[pattern].files[error.filePath] = 0;
        }
        patterns[pattern].files[error.filePath]++;
        
        if (patterns[pattern].examples.length < 3) {
          patterns[pattern].examples.push(error);
        }
      }
    });
  });
  
  // Convert files dict to sorted array
  Object.keys(patterns).forEach(pattern => {
    patterns[pattern].affectedFiles = Object.entries(patterns[pattern].files)
      .map(([file, count]) => ({ file, count }))
      .sort((a, b) => b.count - a.count);
      
    delete patterns[pattern].files;
  });
  
  // Group patterns into categories
  const categorizedPatterns = {
    typeSafety: {
      anyInProps: patterns.anyInProps,
      anyInEventHandlers: patterns.anyInEventHandlers,
      missingPropTypes: patterns.missingPropTypes,
      incompatiblePropTypes: patterns.incompatiblePropTypes,
      discriminatedUnionMissing: patterns.discriminatedUnionMissing
    },
    reactHooks: {
      missingDependencies: patterns.missingDependencies,
      unusedDependencies: patterns.unusedDependencies
    },
    eventHandling: {
      incorrectEventType: patterns.incorrectEventType
    },
    codeStyle: {
      unusedVariables: patterns.unusedVariables,
      consoleStatements: patterns.consoleStatements,
      missingReturnType: patterns.missingReturnType
    },
    apiIntegration: {
      apiTypeMismatch: patterns.apiTypeMismatch
    }
  };
  
  // Write pattern analysis to file
  fs.writeFileSync(
    'analysis/errors/pattern-analysis.json',
    JSON.stringify(categorizedPatterns, null, 2)
  );
  
  // Generate markdown summary
  let markdown = '# Error Pattern Analysis\n\n';
  
  Object.entries(categorizedPatterns).forEach(([category, patterns]) => {
    markdown += `## ${category}\n\n`;
    
    Object.entries(patterns).forEach(([pattern, data]) => {
      markdown += `### ${pattern} (${data.count} occurrences)\n\n`;
      
      if (data.examples.length > 0) {
        markdown += 'Example errors:\n';
        data.examples.forEach(example => {
          markdown += `- ${example.filePath}:${example.line} - ${example.message}\n`;
        });
        markdown += '\n';
      }
      
      if (data.affectedFiles.length > 0) {
        markdown += 'Top affected files:\n';
        data.affectedFiles.slice(0, 5).forEach(file => {
          markdown += `- ${file.file} (${file.count} errors)\n`;
        });
        markdown += '\n';
      }
    });
  });
  
  // Add remediation strategy recommendations
  markdown += '## Remediation Strategies\n\n';
  
  markdown += '### Type Safety Issues\n\n';
  markdown += '1. **anyInProps & anyInEventHandlers**: Replace with proper interfaces using discriminated unions\n';
  markdown += '   - Create centralized event handler types in `src/types/events.ts`\n';
  markdown += '   - Implement component-specific event handler types that extend base types\n\n';
  
  markdown += '2. **missingPropTypes & incompatiblePropTypes**: Create comprehensive prop interfaces\n';
  markdown += '   - Implement base interfaces for component families\n';
  markdown += '   - Use extension for variant-specific properties\n';
  markdown += '   - Add proper JSDoc documentation\n\n';
  
  markdown += '3. **discriminatedUnionMissing**: Implement proper type guards\n';
  markdown += '   - Create discriminated union types with clear discriminator properties\n';
  markdown += '   - Implement type guard functions using the `is` type predicate\n';
  markdown += '   - Apply type narrowing before accessing variant-specific properties\n\n';
  
  fs.writeFileSync(
    'analysis/errors/pattern-analysis.md',
    markdown
  );
  
  // Generate implementation priority list
  const priorityList = [];
  
  // Add each pattern with its priority score
  Object.entries(patterns).forEach(([pattern, data]) => {
    // Calculate priority based on frequency, complexity, and impact
    const frequency = data.count;
    const complexity = getPatternComplexity(pattern);
    const impact = getPatternImpact(pattern);
    
    const priorityScore = (frequency * 0.5) + (impact * 0.3) + (complexity * 0.2);
    
    priorityList.push({
      pattern,
      frequency,
      complexity,
      impact,
      priorityScore,
      affectedFiles: data.affectedFiles.slice(0, 10)
    });
  });
  
  // Sort by priority score (descending)
  priorityList.sort((a, b) => b.priorityScore - a.priorityScore);
  
  // Write priority list to file
  fs.writeFileSync(
    'analysis/errors/implementation-priorities.json',
    JSON.stringify(priorityList, null, 2)
  );
  
  // Generate priority report
  let priorityReport = '# Implementation Priorities\n\n';
  priorityReport += '| Pattern | Frequency | Impact | Complexity | Priority Score |\n';
  priorityReport += '|---------|-----------|--------|------------|---------------|\n';
  
  priorityList.forEach(item => {
    priorityReport += `| ${item.pattern} | ${item.frequency} | ${item.impact} | ${item.complexity} | ${item.priorityScore.toFixed(2)} |\n`;
  });
  
  fs.writeFileSync(
    'analysis/errors/implementation-priorities.md',
    priorityReport
  );
  
  console.log('Generated pattern analysis and implementation priorities');
}

// Helper function to get pattern complexity (1-5 scale)
function getPatternComplexity(pattern) {
  const complexityMap = {
    anyInProps: 3,
    anyInEventHandlers: 4,
    missingPropTypes: 2,
    incompatiblePropTypes: 3,
    missingDependencies: 2,
    unusedDependencies: 1,
    unusedVariables: 1,
    consoleStatements: 1,
    incorrectEventType: 3,
    discriminatedUnionMissing: 5,
    missingReturnType: 2,
    apiTypeMismatch: 4
  };
  
  return complexityMap[pattern] || 3;
}

// Helper function to get pattern impact (1-5 scale)
function getPatternImpact(pattern) {
  const impactMap = {
    anyInProps: 5,
    anyInEventHandlers: 5,
    missingPropTypes: 4,
    incompatiblePropTypes: 4,
    missingDependencies: 3,
    unusedDependencies: 2,
    unusedVariables: 2,
    consoleStatements: 2,
    incorrectEventType: 4,
    discriminatedUnionMissing: 5,
    missingReturnType: 3,
    apiTypeMismatch: 5
  };
  
  return impactMap[pattern] || 3;
}

// Run the pattern detection
detectPatterns(); 