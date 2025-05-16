const fs = require('fs');
const path = require('path');

// Load analysis data from previous scripts
function loadAnalysisData() {
  try {
    // Try to load deep analysis if it exists
    const deepAnalysisPath = 'analysis/errors/deep-analysis.json';
    
    if (fs.existsSync(deepAnalysisPath)) {
      console.log('Loading deep analysis data...');
      return JSON.parse(fs.readFileSync(deepAnalysisPath, 'utf8'));
    }
    
    // Otherwise, load the basic analysis data
    console.log('Loading basic analysis data...');
    const errorDashboard = JSON.parse(fs.readFileSync('analysis/errors/error-dashboard.json', 'utf8'));
    const componentHierarchy = JSON.parse(fs.readFileSync('analysis/errors/component-hierarchy.json', 'utf8'));
    const patterns = JSON.parse(fs.readFileSync('analysis/errors/pattern-analysis.json', 'utf8'));
    
    // If dependency chain analysis exists, load it too
    let dependencyChainAnalysis = null;
    const dependencyChainPath = 'analysis/errors/dependency-chain-analysis.json';
    
    if (fs.existsSync(dependencyChainPath)) {
      dependencyChainAnalysis = JSON.parse(fs.readFileSync(dependencyChainPath, 'utf8'));
    }
    
    return {
      errors: {
        typescript: errorDashboard.byErrorCode.typescript.flatMap(group => group.items),
        eslint: errorDashboard.byErrorCode.eslint.flatMap(group => group.items)
      },
      components: componentHierarchy.nodes,
      dependencies: componentHierarchy.edges,
      patterns,
      dependencyChainAnalysis
    };
  } catch (err) {
    console.error('Error loading analysis data:', err);
    return { 
      errors: { typescript: [], eslint: [] }, 
      components: [], 
      dependencies: [], 
      patterns: {}, 
      dependencyChainAnalysis: null 
    };
  }
}

// Create a detailed prioritization matrix
function createPrioritizationMatrix(data) {
  console.log('Creating prioritization matrix...');
  
  // If deep analysis already has a priority matrix, use it
  if (data.priorityMatrix) {
    console.log('Using existing priority matrix from deep analysis...');
    return data.priorityMatrix;
  }
  
  // Otherwise, calculate it from scratch
  console.log('Calculating priority matrix from scratch...');
  
  // Define error pattern categories
  const errorPatterns = [
    // Type safety patterns
    {
      id: 'anyTypeInProps',
      category: 'Type Safety',
      name: 'Any Type in Props',
      description: 'Usage of any types in component props',
      frequency: calculateFrequency(data, 'typeSafety.anyType.inProps'),
      impact: 5, // High impact on type safety
      complexity: 3, // Moderate complexity to fix
      businessValue: 4 // Significant value for maintainability
    },
    {
      id: 'anyTypeInEventHandlers',
      category: 'Type Safety',
      name: 'Any Type in Event Handlers',
      description: 'Usage of any types in event handlers',
      frequency: calculateFrequency(data, 'typeSafety.anyType.inEventHandlers'),
      impact: 5, // High impact on type safety
      complexity: 4, // Higher complexity due to event handler specifics
      businessValue: 4 // Significant value for maintainability
    },
    {
      id: 'discriminatedUnionMissing',
      category: 'Type Safety',
      name: 'Missing Discriminated Unions',
      description: 'Components with variants that should use discriminated unions',
      frequency: calculateFrequency(data, 'typeSafety.discriminatedUnions.missingTypeGuards'),
      impact: 5, // High impact on type safety
      complexity: 5, // High complexity to implement properly
      businessValue: 5 // High value for component correctness
    },
    
    // React patterns
    {
      id: 'missingDependencies',
      category: 'React Hooks',
      name: 'Missing Hook Dependencies',
      description: 'useEffect hooks with missing dependencies',
      frequency: calculateFrequency(data, 'reactHooks.dependencies.missing'),
      impact: 3, // Moderate impact (can cause stale closures)
      complexity: 2, // Relatively simple to fix
      businessValue: 3 // Moderate value (prevents subtle bugs)
    },
    {
      id: 'incorrectPropTypes',
      category: 'Type Safety',
      name: 'Incorrect Prop Types',
      description: 'Components with incorrect or incompatible prop types',
      frequency: calculateFrequency(data, 'propTypes.incorrect'),
      impact: 4, // High impact on type safety
      complexity: 3, // Moderate complexity
      businessValue: 4 // High value for component correctness
    },
    
    // Code style
    {
      id: 'unusedVariables',
      category: 'Code Style',
      name: 'Unused Variables',
      description: 'Variables defined but never used',
      frequency: calculateFrequency(data, 'codeStyle.unusedVariables'),
      impact: 2, // Low impact on functionality
      complexity: 1, // Very simple to fix
      businessValue: 2 // Low business value but good coding practice
    },
    {
      id: 'consoleStatements',
      category: 'Code Style',
      name: 'Console Statements',
      description: 'Use of console.log instead of proper logger',
      frequency: calculateFrequency(data, 'codeStyle.consoleStatements'),
      impact: 2, // Low impact on functionality
      complexity: 1, // Very simple to fix
      businessValue: 2 // Moderate value for production code quality
    },
    
    // API integration
    {
      id: 'apiResponseTyping',
      category: 'API Integration',
      name: 'API Response Type Safety',
      description: 'Proper typing of API responses',
      frequency: calculateFrequency(data, 'apiIntegration.responseTyping'),
      impact: 5, // High impact on data handling
      complexity: 4, // Complex due to varying API responses
      businessValue: 5 // High value for data integrity
    }
  ];
  
  // Calculate total score for each pattern
  const priorityMatrix = errorPatterns.map(pattern => {
    // Calculate score (weighted average)
    const totalScore = (
      (pattern.frequency * 0.3) + // 30% weight on frequency
      (pattern.impact * 0.3) +    // 30% weight on impact
      (pattern.businessValue * 0.25) + // 25% weight on business value
      (pattern.complexity * 0.15)  // 15% weight on complexity (inverse)
    );
    
    return {
      ...pattern,
      totalScore,
      // Find affected files if available
      affectedFiles: findAffectedFiles(data, pattern.id)
    };
  });
  
  // Sort by total score (descending)
  priorityMatrix.sort((a, b) => b.totalScore - a.totalScore);
  
  return priorityMatrix;
}

// Calculate frequency score (1-5) for an error pattern
function calculateFrequency(data, patternPath) {
  // Try to get count from deep analysis
  if (data.categorization) {
    const parts = patternPath.split('.');
    let current = data.categorization;
    
    for (const part of parts) {
      if (!current[part]) {
        return 0; // Path doesn't exist
      }
      current = current[part];
    }
    
    if (Array.isArray(current)) {
      // Convert count to 1-5 scale
      return Math.min(5, Math.ceil(current.length / 10));
    }
  }
  
  // Fallback: try to find from pattern analysis
  if (data.patterns) {
    // Try to match pattern to one in patterns object
    const patternId = patternPath.split('.').pop();
    
    for (const category in data.patterns) {
      for (const pattern in data.patterns[category]) {
        if (pattern.toLowerCase().includes(patternId.toLowerCase())) {
          const count = data.patterns[category][pattern].count || 0;
          return Math.min(5, Math.ceil(count / 10));
        }
      }
    }
  }
  
  return 1; // Default to low frequency if not found
}

// Find affected files for a pattern
function findAffectedFiles(data, patternId) {
  // Try to find from priority matrix if it exists in deep analysis
  if (data.priorityMatrix) {
    const existingPattern = data.priorityMatrix.find(p => p.id === patternId);
    if (existingPattern && existingPattern.affectedFiles) {
      return existingPattern.affectedFiles;
    }
  }
  
  // Try to find from pattern analysis
  if (data.patterns) {
    for (const category in data.patterns) {
      for (const pattern in data.patterns[category]) {
        if (pattern.toLowerCase().includes(patternId.toLowerCase())) {
          if (data.patterns[category][pattern].affectedFiles) {
            return data.patterns[category][pattern].affectedFiles.map(f => f.file);
          }
        }
      }
    }
  }
  
  return [];
}

// Generate implementation plan based on the prioritization matrix
function generateImplementationPlan(priorityMatrix) {
  console.log('Generating implementation plan...');
  
  let report = '# TypeScript Error Remediation: Implementation Plan\n\n';
  
  report += '## Priority Matrix\n\n';
  report += '| Pattern | Category | Frequency | Impact | Complexity | Business Value | Priority Score |\n';
  report += '|---------|----------|-----------|--------|------------|----------------|---------------|\n';
  
  priorityMatrix.forEach(pattern => {
    report += `| ${pattern.name} | ${pattern.category} | ${pattern.frequency} | ${pattern.impact} | ${pattern.complexity} | ${pattern.businessValue} | ${pattern.totalScore.toFixed(2)} |\n`;
  });
  
  report += '\n## Implementation Phases\n\n';
  
  // Group patterns by category for implementation phases
  const categories = {
    'Type Safety': [],
    'React Hooks': [],
    'Code Style': [],
    'API Integration': []
  };
  
  priorityMatrix.forEach(pattern => {
    if (categories[pattern.category]) {
      categories[pattern.category].push(pattern);
    } else {
      categories['Other'] = categories['Other'] || [];
      categories['Other'].push(pattern);
    }
  });
  
  // Phase 1: Foundation Components
  report += '### Phase 1: Foundation Component Type Safety\n\n';
  report += 'Focus on fixing type safety issues in foundation components that many others depend on.\n\n';
  
  report += '**Patterns to Address:**\n\n';
  categories['Type Safety'].slice(0, 3).forEach(pattern => {
    report += `- **${pattern.name}** (Score: ${pattern.totalScore.toFixed(2)})\n`;
    report += `  - ${pattern.description}\n`;
    
    if (pattern.affectedFiles && pattern.affectedFiles.length > 0) {
      report += '  - Key files to target:\n';
      pattern.affectedFiles.slice(0, 5).forEach(file => {
        report += `    - ${file}\n`;
      });
    }
    
    report += '\n';
  });
  
  // Phase 2: Event Handling and React Hooks
  report += '### Phase 2: Event Handling and React Hooks\n\n';
  report += 'After establishing type safety in foundation components, focus on event handling and React hook issues.\n\n';
  
  report += '**Patterns to Address:**\n\n';
  [...categories['Type Safety'].slice(3, 5), ...categories['React Hooks']].forEach(pattern => {
    report += `- **${pattern.name}** (Score: ${pattern.totalScore.toFixed(2)})\n`;
    report += `  - ${pattern.description}\n`;
    
    if (pattern.affectedFiles && pattern.affectedFiles.length > 0) {
      report += '  - Key files to target:\n';
      pattern.affectedFiles.slice(0, 3).forEach(file => {
        report += `    - ${file}\n`;
      });
    }
    
    report += '\n';
  });
  
  // Phase 3: API Integration
  report += '### Phase 3: API Integration Type Safety\n\n';
  report += 'Ensure proper typing of API responses and requests to prevent runtime errors.\n\n';
  
  report += '**Patterns to Address:**\n\n';
  categories['API Integration'].forEach(pattern => {
    report += `- **${pattern.name}** (Score: ${pattern.totalScore.toFixed(2)})\n`;
    report += `  - ${pattern.description}\n`;
    
    if (pattern.affectedFiles && pattern.affectedFiles.length > 0) {
      report += '  - Key files to target:\n';
      pattern.affectedFiles.slice(0, 3).forEach(file => {
        report += `    - ${file}\n`;
      });
    }
    
    report += '\n';
  });
  
  // Phase 4: Code Style and Cleanup
  report += '### Phase 4: Code Style and Final Cleanup\n\n';
  report += 'Address lower-priority code style issues and remaining type errors.\n\n';
  
  report += '**Patterns to Address:**\n\n';
  categories['Code Style'].forEach(pattern => {
    report += `- **${pattern.name}** (Score: ${pattern.totalScore.toFixed(2)})\n`;
    report += `  - ${pattern.description}\n`;
    
    if (pattern.affectedFiles && pattern.affectedFiles.length > 0) {
      report += '  - Key files to target:\n';
      pattern.affectedFiles.slice(0, 3).forEach(file => {
        report += `    - ${file}\n`;
      });
    }
    
    report += '\n';
  });
  
  // Implementation strategy
  report += '## Implementation Strategy\n\n';
  
  report += '### Pattern-Based Templates\n\n';
  report += 'For each error pattern, develop template solutions to apply consistently:\n\n';
  
  report += '#### Template: Discriminated Union Pattern\n\n';
  report += '```typescript\n';
  report += '// File: src/types/[component].ts\n';
  report += 'interface BaseComponentProps {\n';
  report += '  className?: string;\n';
  report += '  // Common props\n';
  report += '}\n\n';
  report += 'interface PrimaryVariantProps extends BaseComponentProps {\n';
  report += '  variant: "primary";\n';
  report += '  // Primary-specific props\n';
  report += '}\n\n';
  report += 'interface SecondaryVariantProps extends BaseComponentProps {\n';
  report += '  variant: "secondary";\n';
  report += '  // Secondary-specific props\n';
  report += '}\n\n';
  report += 'type ComponentProps = PrimaryVariantProps | SecondaryVariantProps;\n\n';
  report += '// Type guards\n';
  report += 'export function isPrimaryVariant(props: ComponentProps): props is PrimaryVariantProps {\n';
  report += '  return props.variant === "primary";\n';
  report += '}\n';
  report += '```\n\n';
  
  report += '#### Template: Event Handler Types\n\n';
  report += '```typescript\n';
  report += '// File: src/types/events.ts\n';
  report += 'export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;\n';
  report += 'export type ButtonClickHandler = (event: ButtonClickEvent) => void;\n\n';
  report += 'export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;\n';
  report += 'export type InputChangeHandler = (event: InputChangeEvent) => void;\n';
  report += '```\n\n';
  
  report += '### Cross-Component Dependencies\n\n';
  report += 'When working on a component, ensure changes propagate to all dependent components:\n\n';
  report += '1. Identify all components that depend on the one being modified\n';
  report += '2. Update dependent components to match new type definitions\n';
  report += '3. Test the entire component family together\n\n';
  
  // Write the implementation plan
  fs.writeFileSync('analysis/errors/implementation-plan.md', report);
  console.log('Generated implementation plan');
  
  return report;
}

// Main execution function
function createPrioritizationAndPlan() {
  // Load analysis data
  const data = loadAnalysisData();
  
  // Create prioritization matrix
  const priorityMatrix = createPrioritizationMatrix(data);
  
  // Save prioritization matrix
  fs.writeFileSync(
    'analysis/errors/detailed-priority-matrix.json',
    JSON.stringify(priorityMatrix, null, 2)
  );
  
  // Generate implementation plan
  generateImplementationPlan(priorityMatrix);
  
  console.log('Prioritization matrix and implementation plan complete');
}

// Run the analysis
createPrioritizationAndPlan(); 