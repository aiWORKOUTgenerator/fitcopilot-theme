const fs = require('fs');
const path = require('path');

// Load error data from Day 1 analysis
function loadAnalysisData() {
  try {
    const errorDashboard = JSON.parse(fs.readFileSync('analysis/errors/error-dashboard.json', 'utf8'));
    const componentHierarchy = JSON.parse(fs.readFileSync('analysis/errors/component-hierarchy.json', 'utf8'));
    const patterns = JSON.parse(fs.readFileSync('analysis/errors/pattern-analysis.json', 'utf8'));
    
    return {
      errors: {
        typescript: errorDashboard.byErrorCode.typescript.flatMap(group => group.items),
        eslint: errorDashboard.byErrorCode.eslint.flatMap(group => group.items)
      },
      components: componentHierarchy.nodes,
      dependencies: componentHierarchy.edges,
      patterns
    };
  } catch (err) {
    console.error('Error loading analysis data:', err);
    return { errors: { typescript: [], eslint: [] }, components: [], dependencies: [], patterns: {} };
  }
}

// Categorize errors into detailed subcategories
function categorizeErrors(data) {
  const { errors, components } = data;
  const allErrors = [...errors.typescript, ...errors.eslint];
  
  // Create detailed categorization system
  const categorization = {
    typeSafety: {
      anyType: {
        inProps: [],
        inEventHandlers: [],
        inState: [],
        inAPI: [],
        other: []
      },
      missingInterfaces: {
        props: [],
        state: [],
        api: [],
        other: []
      },
      incompatibleTypes: {
        assignment: [],
        functionArgs: [],
        returnValues: [],
        jsx: []
      },
      discriminatedUnions: {
        missingTypeGuards: [],
        incorrectDiscriminators: [],
        other: []
      }
    },
    eventHandling: {
      incorrectEventTypes: [],
      missingEventHandlers: [],
      eventPropagation: []
    },
    reactHooks: {
      dependencies: {
        missing: [],
        unnecessary: [],
        stale: []
      },
      stateTyping: {
        incorrect: [],
        missing: []
      },
      effectTypes: []
    },
    propTypes: {
      missing: [],
      incorrect: [],
      optional: []
    },
    codeStyle: {
      unusedVariables: [],
      consoleStatements: [],
      formattingIssues: []
    },
    apiIntegration: {
      responseTyping: [],
      requestTyping: [],
      dataTransformation: []
    }
  };
  
  // Helper function to categorize TypeScript errors
  function categorizeTypeScriptError(error) {
    const { code, message, filePath } = error;
    
    // Any type related issues
    if (message.includes('any') || code === 'TS7006' || code === 'TS7005') {
      if (message.includes('props')) {
        categorization.typeSafety.anyType.inProps.push(error);
      } else if (message.match(/\bevent|\be\b|\bev\b|\bonChange|\bonClick/)) {
        categorization.typeSafety.anyType.inEventHandlers.push(error);
      } else if (message.includes('useState') || message.includes('state')) {
        categorization.typeSafety.anyType.inState.push(error);
      } else if (message.includes('api') || message.includes('response') || message.includes('fetch')) {
        categorization.typeSafety.anyType.inAPI.push(error);
      } else {
        categorization.typeSafety.anyType.other.push(error);
      }
    }
    
    // Missing interface issues
    else if (code === 'TS2741' || message.includes('missing the following properties')) {
      if (message.includes('props') || message.includes('component')) {
        categorization.propTypes.missing.push(error);
      } else if (message.includes('state')) {
        categorization.reactHooks.stateTyping.missing.push(error);
      } else if (message.includes('api') || message.includes('response')) {
        categorization.apiIntegration.responseTyping.push(error);
      } else {
        categorization.typeSafety.missingInterfaces.other.push(error);
      }
    }
    
    // Type incompatibility issues
    else if (code === 'TS2322' || message.includes('is not assignable to type')) {
      if (message.includes('=')) {
        categorization.typeSafety.incompatibleTypes.assignment.push(error);
      } else if (message.includes('argument') || message.includes('parameter')) {
        categorization.typeSafety.incompatibleTypes.functionArgs.push(error);
      } else if (message.includes('return')) {
        categorization.typeSafety.incompatibleTypes.returnValues.push(error);
      } else if (message.includes('JSX') || message.includes('<')) {
        categorization.typeSafety.incompatibleTypes.jsx.push(error);
      } else if (message.includes('props')) {
        categorization.propTypes.incorrect.push(error);
      }
    }
    
    // Discriminated union issues
    else if (code === 'TS2339' && message.includes('Property') && message.includes('does not exist on type')) {
      categorization.typeSafety.discriminatedUnions.missingTypeGuards.push(error);
    }
    
    // Event handling issues
    else if (code === 'TS2769' && message.match(/\bevent|\be\b|\bev\b/)) {
      categorization.eventHandling.incorrectEventTypes.push(error);
    }
    
    // Optional prop issues
    else if (message.includes('undefined') && message.includes('props')) {
      categorization.propTypes.optional.push(error);
    }
    
    // Add more categorizations as needed...
  }
  
  // Helper function to categorize ESLint errors
  function categorizeESLintError(error) {
    const { code, message, filePath } = error;
    
    // Unused variables
    if (code === '@typescript-eslint/no-unused-vars' || code === 'no-unused-vars') {
      categorization.codeStyle.unusedVariables.push(error);
    }
    
    // Explicit any usage
    else if (code === '@typescript-eslint/no-explicit-any') {
      // Determine context based on line content
      if (message.includes('event') || message.includes('handler')) {
        categorization.typeSafety.anyType.inEventHandlers.push(error);
      } else if (message.includes('props')) {
        categorization.typeSafety.anyType.inProps.push(error);
      } else if (message.includes('state')) {
        categorization.typeSafety.anyType.inState.push(error);
      } else if (message.includes('api') || message.includes('response')) {
        categorization.typeSafety.anyType.inAPI.push(error);
      } else {
        categorization.typeSafety.anyType.other.push(error);
      }
    }
    
    // Console statements
    else if (code === 'no-console') {
      categorization.codeStyle.consoleStatements.push(error);
    }
    
    // React hooks dependencies
    else if (code === 'react-hooks/exhaustive-deps') {
      if (message.includes('Unnecessary')) {
        categorization.reactHooks.dependencies.unnecessary.push(error);
      } else {
        categorization.reactHooks.dependencies.missing.push(error);
      }
    }
    
    // Add more categorizations as needed...
  }
  
  // Categorize all errors
  errors.typescript.forEach(categorizeTypeScriptError);
  errors.eslint.forEach(categorizeESLintError);
  
  return categorization;
}

// Group components by feature area
function groupComponentsByFeature(data) {
  const { components } = data;
  const featureGroups = {};
  
  components.forEach(component => {
    const path = component.path;
    
    // Extract feature area from path
    let featureArea = 'Other';
    
    if (path.includes('features/')) {
      const match = path.match(/features\/([^\/]+)/);
      if (match && match[1]) {
        featureArea = match[1];
      }
    } else if (path.includes('components/')) {
      featureArea = 'Common UI';
    } else if (path.includes('hooks/')) {
      featureArea = 'Hooks';
    } else if (path.includes('utils/')) {
      featureArea = 'Utilities';
    } else if (path.includes('api/')) {
      featureArea = 'API';
    } else if (path.includes('context/')) {
      featureArea = 'Context';
    }
    
    // Group by feature area
    if (!featureGroups[featureArea]) {
      featureGroups[featureArea] = [];
    }
    
    featureGroups[featureArea].push(component);
  });
  
  return featureGroups;
}

// Analyze component variant patterns
function analyzeComponentVariants(data) {
  const { components, dependencies } = data;
  const variants = {};
  
  // Identify component families with variants
  components.forEach(component => {
    const path = component.path;
    const name = component.id;
    
    // Check if component is part of a component family by name
    // For example: Button, PrimaryButton, SecondaryButton are likely variants
    const baseName = name.replace(/Primary|Secondary|Tertiary|Basic|Advanced|Simple|Large|Small|Featured|Compact/g, '');
    
    if (baseName !== name) {
      // This might be a variant
      if (!variants[baseName]) {
        variants[baseName] = {
          baseComponent: null,
          variants: []
        };
      }
      
      variants[baseName].variants.push({
        name,
        path,
        variant: name.replace(baseName, '')
      });
    } else {
      // Check if this is a base component for previously identified variants
      if (variants[name]) {
        variants[name].baseComponent = {
          name,
          path
        };
      }
    }
  });
  
  // Analyze naming patterns in the codebase
  const patternAnalysis = {
    componentFamilies: Object.keys(variants).length,
    variants: Object.values(variants).reduce((count, family) => count + family.variants.length, 0),
    typePatterns: {
      discriminatedUnions: 0,
      extensionPattern: 0,
      inlineTypes: 0
    }
  };
  
  return { variants, patternAnalysis };
}

// Create a prioritization matrix for error patterns
function createPrioritizationMatrix(data, categorization) {
  const { patterns, components, dependencies } = data;
  const priorityMatrix = [];
  
  // Calculate scores for each error category
  Object.entries(categorization).forEach(([category, subcategories]) => {
    Object.entries(subcategories).forEach(([subcategory, errors]) => {
      if (Array.isArray(errors) && errors.length > 0) {
        // Simple case: subcategory contains error array
        const score = calculatePriorityScore(category, subcategory, errors, data);
        priorityMatrix.push(score);
      } else if (typeof errors === 'object') {
        // Nested case: subcategory contains further categorization
        Object.entries(errors).forEach(([subSubcategory, subErrors]) => {
          if (Array.isArray(subErrors) && subErrors.length > 0) {
            const score = calculatePriorityScore(
              category, 
              `${subcategory}.${subSubcategory}`, 
              subErrors, 
              data
            );
            priorityMatrix.push(score);
          }
        });
      }
    });
  });
  
  // Sort by total score (descending)
  priorityMatrix.sort((a, b) => b.totalScore - a.totalScore);
  
  return priorityMatrix;
}

// Calculate priority score for a group of errors
function calculatePriorityScore(category, subcategory, errors, data) {
  // Frequency: 1-5 based on number of errors
  const frequency = Math.min(5, Math.ceil(errors.length / 10));
  
  // Downstream impact: 1-5 based on affected components
  let impact = 1;
  const affectedComponents = new Set();
  errors.forEach(error => {
    const filePath = error.filePath;
    // Check if this is a foundation component
    const foundationComponent = data.components.find(c => 
      filePath.includes(c.path) && c.dependents && c.dependents >= 3
    );
    if (foundationComponent) {
      impact = Math.max(impact, 4); // High impact if foundation component affected
      
      // Add all dependent components
      data.dependencies.forEach(dep => {
        if (dep.target === foundationComponent.id) {
          affectedComponents.add(dep.source);
        }
      });
    } else {
      affectedComponents.add(filePath);
    }
  });
  impact = Math.max(impact, Math.min(5, Math.ceil(affectedComponents.size / 5)));
  
  // Implementation complexity: 1-5
  let complexity = 3; // Default moderate complexity
  if (subcategory.includes('any')) {
    complexity = 4; // Replacing any types is complex
  } else if (subcategory.includes('discriminated')) {
    complexity = 5; // Implementing discriminated unions is most complex
  } else if (subcategory.includes('unused')) {
    complexity = 1; // Fixing unused variables is simple
  } else if (subcategory.includes('console')) {
    complexity = 1; // Replacing console statements is simple
  }
  
  // Business value: 1-5 based on error visibility to end users
  let businessValue = 3; // Default moderate value
  if (category === 'typeSafety' && (subcategory.includes('event') || subcategory.includes('props'))) {
    businessValue = 5; // High value for user-facing components
  } else if (category === 'apiIntegration') {
    businessValue = 5; // High value for data handling
  } else if (category === 'codeStyle') {
    businessValue = 2; // Lower value for code style issues
  }
  
  // Total score is weighted average
  const totalScore = (frequency * 0.3) + (impact * 0.3) + (businessValue * 0.25) + (complexity * 0.15);
  
  return {
    category,
    subcategory,
    count: errors.length,
    frequency,
    impact,
    complexity,
    businessValue,
    totalScore,
    affectedFiles: [...new Set(errors.map(e => e.filePath))].slice(0, 5)
  };
}

// Generate the dependency chain analysis
function analyzeDependencyChains(data, categorization) {
  const { components, dependencies } = data;
  const dependencyChains = [];
  
  // Find foundational components (with many dependents)
  const foundationComponents = components
    .filter(c => c.dependents && c.dependents >= 3)
    .sort((a, b) => b.dependents - a.dependents);
  
  // Analyze error propagation from foundation components
  foundationComponents.forEach(component => {
    // Find direct dependents
    const directDependents = dependencies
      .filter(d => d.target === component.id)
      .map(d => d.source);
    
    // Find errors in this component
    const componentErrors = findErrorsInComponent(component.path, categorization);
    
    // If this component has errors, analyze propagation
    if (Object.values(componentErrors).some(errors => errors.length > 0)) {
      const chain = {
        component: component.id,
        path: component.path,
        dependents: component.dependents,
        directDependents,
        errors: componentErrors,
        propagationImpact: calculatePropagationImpact(componentErrors, component.dependents)
      };
      
      dependencyChains.push(chain);
    }
  });
  
  // Sort by propagation impact (descending)
  dependencyChains.sort((a, b) => b.propagationImpact - a.propagationImpact);
  
  return dependencyChains;
}

// Helper to find errors in a specific component
function findErrorsInComponent(componentPath, categorization) {
  const componentErrors = {
    typeSafety: [],
    eventHandling: [],
    reactHooks: [],
    propTypes: [],
    codeStyle: [],
    apiIntegration: []
  };
  
  // Helper to extract errors from category
  function extractErrors(category, errors) {
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        if (error.filePath.includes(componentPath)) {
          componentErrors[category].push(error);
        }
      });
    } else if (typeof errors === 'object') {
      Object.values(errors).forEach(subErrors => {
        extractErrors(category, subErrors);
      });
    }
  }
  
  // Extract errors for each category
  Object.entries(categorization).forEach(([category, subcategories]) => {
    extractErrors(category, subcategories);
  });
  
  return componentErrors;
}

// Calculate propagation impact score
function calculatePropagationImpact(componentErrors, dependents) {
  // Count total errors
  const errorCount = Object.values(componentErrors)
    .reduce((count, errors) => count + errors.length, 0);
  
  // Impact is a function of error count and number of dependents
  return errorCount * Math.log2(dependents + 1);
}

// Main execution function
function runDeepAnalysis() {
  console.log('Loading analysis data...');
  const data = loadAnalysisData();
  
  console.log('Performing deep error categorization...');
  const categorization = categorizeErrors(data);
  
  console.log('Grouping components by feature...');
  const featureGroups = groupComponentsByFeature(data);
  
  console.log('Analyzing component variants...');
  const { variants, patternAnalysis } = analyzeComponentVariants(data);
  
  console.log('Creating prioritization matrix...');
  const priorityMatrix = createPrioritizationMatrix(data, categorization);
  
  console.log('Analyzing dependency chains...');
  const dependencyChains = analyzeDependencyChains(data, categorization);
  
  // Save results
  const analysisResults = {
    categorization,
    featureGroups,
    variants,
    patternAnalysis,
    priorityMatrix,
    dependencyChains
  };
  
  fs.writeFileSync(
    'analysis/errors/deep-analysis.json',
    JSON.stringify(analysisResults, null, 2)
  );
  
  // Generate summary reports
  generateCategoryReport(categorization);
  generateFeatureGroupReport(featureGroups);
  generatePriorityReport(priorityMatrix);
  generateDependencyChainReport(dependencyChains);
  
  console.log('Deep analysis complete. Results saved to analysis/errors/deep-analysis.json');
}

// Generate error category report
function generateCategoryReport(categorization) {
  let report = '# Detailed Error Categories\n\n';
  
  Object.entries(categorization).forEach(([category, subcategories]) => {
    report += `## ${category}\n\n`;
    
    Object.entries(subcategories).forEach(([subcategory, errors]) => {
      if (Array.isArray(errors)) {
        report += `### ${subcategory} (${errors.length} errors)\n\n`;
        if (errors.length > 0) {
          report += 'Examples:\n';
          errors.slice(0, 3).forEach(error => {
            report += `- ${error.filePath}:${error.line} - ${error.message}\n`;
          });
          report += '\n';
        }
      } else if (typeof errors === 'object') {
        report += `### ${subcategory}\n\n`;
        
        Object.entries(errors).forEach(([subSubcategory, subErrors]) => {
          if (Array.isArray(subErrors)) {
            report += `#### ${subSubcategory} (${subErrors.length} errors)\n\n`;
            if (subErrors.length > 0) {
              report += 'Examples:\n';
              subErrors.slice(0, 3).forEach(error => {
                report += `- ${error.filePath}:${error.line} - ${error.message}\n`;
              });
              report += '\n';
            }
          }
        });
      }
    });
  });
  
  fs.writeFileSync('analysis/errors/category-report.md', report);
}

// Generate feature group report
function generateFeatureGroupReport(featureGroups) {
  let report = '# Component Feature Groups\n\n';
  
  Object.entries(featureGroups).forEach(([feature, components]) => {
    report += `## ${feature} (${components.length} components)\n\n`;
    
    // Group by subdirectories
    const subgroups = {};
    components.forEach(component => {
      const path = component.path;
      const match = path.match(/\/[^\/]+\/([^\/]+)/);
      const subgroup = match ? match[1] : 'Other';
      
      if (!subgroups[subgroup]) {
        subgroups[subgroup] = [];
      }
      
      subgroups[subgroup].push(component);
    });
    
    // List components by subgroup
    Object.entries(subgroups).forEach(([subgroup, components]) => {
      report += `### ${subgroup}\n\n`;
      
      components.forEach(component => {
        report += `- **${component.id}** (${component.path})`;
        if (component.dependents && component.dependents > 0) {
          report += ` - ${component.dependents} dependents`;
        }
        report += '\n';
      });
      
      report += '\n';
    });
  });
  
  fs.writeFileSync('analysis/errors/feature-groups.md', report);
}

// Generate priority report
function generatePriorityReport(priorityMatrix) {
  let report = '# Error Remediation Priority Matrix\n\n';
  
  report += '| Category | Subcategory | Count | Frequency | Impact | Complexity | Business Value | Priority Score |\n';
  report += '|----------|-------------|-------|-----------|--------|------------|----------------|---------------|\n';
  
  priorityMatrix.forEach(item => {
    report += `| ${item.category} | ${item.subcategory} | ${item.count} | ${item.frequency} | ${item.impact} | ${item.complexity} | ${item.businessValue} | ${item.totalScore.toFixed(2)} |\n`;
  });
  
  report += '\n## Top 10 Priority Items\n\n';
  
  priorityMatrix.slice(0, 10).forEach((item, index) => {
    report += `### ${index + 1}. ${item.category} - ${item.subcategory}\n\n`;
    report += `**Score:** ${item.totalScore.toFixed(2)} (Frequency: ${item.frequency}, Impact: ${item.impact}, Complexity: ${item.complexity}, Business Value: ${item.businessValue})\n\n`;
    
    report += 'Affected files:\n';
    item.affectedFiles.forEach(file => {
      report += `- ${file}\n`;
    });
    
    report += '\n';
  });
  
  fs.writeFileSync('analysis/errors/priority-matrix.md', report);
}

// Generate dependency chain report
function generateDependencyChainReport(dependencyChains) {
  let report = '# Error Dependency Chain Analysis\n\n';
  
  report += 'This report identifies foundation components with errors and their impact on dependent components.\n\n';
  
  dependencyChains.forEach((chain, index) => {
    report += `## ${index + 1}. ${chain.component} (${chain.path})\n\n`;
    report += `**Dependents:** ${chain.dependents} components depend on this\n`;
    report += `**Propagation Impact:** ${chain.propagationImpact.toFixed(2)}\n\n`;
    
    report += '### Error Summary\n\n';
    Object.entries(chain.errors).forEach(([category, errors]) => {
      if (errors.length > 0) {
        report += `- **${category}:** ${errors.length} errors\n`;
      }
    });
    
    report += '\n### Direct Dependents\n\n';
    chain.directDependents.slice(0, 10).forEach(dependent => {
      report += `- ${dependent}\n`;
    });
    
    if (chain.directDependents.length > 10) {
      report += `- ... and ${chain.directDependents.length - 10} more\n`;
    }
    
    report += '\n';
  });
  
  fs.writeFileSync('analysis/errors/dependency-chains.md', report);
}

// Run the analysis
runDeepAnalysis(); 