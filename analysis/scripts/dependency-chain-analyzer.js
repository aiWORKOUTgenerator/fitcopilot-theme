const fs = require('fs');
const path = require('path');

// Load necessary data from previous analyses
function loadAnalysisData() {
  try {
    const errorDashboard = JSON.parse(fs.readFileSync('analysis/errors/error-dashboard.json', 'utf8'));
    const componentHierarchy = JSON.parse(fs.readFileSync('analysis/errors/component-hierarchy.json', 'utf8'));
    const deepAnalysisPath = 'analysis/errors/deep-analysis.json';
    
    let deepAnalysis = null;
    if (fs.existsSync(deepAnalysisPath)) {
      deepAnalysis = JSON.parse(fs.readFileSync(deepAnalysisPath, 'utf8'));
    }
    
    return {
      errors: {
        typescript: errorDashboard.byErrorCode.typescript.flatMap(group => group.items),
        eslint: errorDashboard.byErrorCode.eslint.flatMap(group => group.items)
      },
      components: componentHierarchy.nodes,
      dependencies: componentHierarchy.edges,
      deepAnalysis
    };
  } catch (err) {
    console.error('Error loading analysis data:', err);
    return { 
      errors: { typescript: [], eslint: [] }, 
      components: [], 
      dependencies: [], 
      deepAnalysis: null 
    };
  }
}

// Build a dependency graph from components and their dependencies
function buildDependencyGraph(components, dependencies) {
  const graph = {};
  
  // Initialize graph with all components
  components.forEach(comp => {
    graph[comp.id] = {
      id: comp.id,
      path: comp.path,
      fullPath: comp.fullPath,
      dependents: [],
      dependencies: [],
      errors: []
    };
  });
  
  // Add dependencies to the graph
  dependencies.forEach(dep => {
    const { source, target } = dep;
    
    if (graph[source]) {
      graph[source].dependencies.push(target);
    }
    
    if (graph[target]) {
      graph[target].dependents.push(source);
    }
  });
  
  return graph;
}

// Assign errors to components in the dependency graph
function assignErrorsToComponents(graph, errors) {
  const allErrors = [...errors.typescript, ...errors.eslint];
  
  // For each error, find the component it belongs to
  allErrors.forEach(error => {
    const filePath = error.filePath;
    
    // Find component that matches this file path
    const matchingComponent = Object.values(graph).find(comp => 
      filePath.includes(comp.path) && comp.path.length > 0
    );
    
    if (matchingComponent) {
      matchingComponent.errors.push(error);
    }
  });
  
  // Count errors for each component
  Object.values(graph).forEach(comp => {
    comp.errorCount = comp.errors.length;
  });
  
  return graph;
}

// Find critical dependency chains where errors propagate
function findCriticalDependencyChains(graph) {
  const criticalChains = [];
  
  // Start from components with errors
  const errorComponents = Object.values(graph)
    .filter(comp => comp.errorCount > 0)
    .sort((a, b) => b.errorCount - a.errorCount);
  
  // For each component with errors, trace its downstream impact
  errorComponents.forEach(comp => {
    // Skip if this component doesn't have dependents (no downstream impact)
    if (comp.dependents.length === 0) {
      return;
    }
    
    // Calculate the impact of this component's errors
    const impact = calculateErrorImpact(comp, graph);
    
    if (impact.score > 0) {
      criticalChains.push({
        component: comp.id,
        path: comp.path,
        errorCount: comp.errorCount,
        dependentCount: comp.dependents.length,
        impactScore: impact.score,
        impactedComponents: impact.impactedComponents
      });
    }
  });
  
  // Sort chains by impact score
  criticalChains.sort((a, b) => b.impactScore - a.impactScore);
  
  return criticalChains;
}

// Calculate the impact of a component's errors on its dependents
function calculateErrorImpact(component, graph) {
  const visited = new Set();
  const impactedComponents = [];
  
  // Recursive function to traverse the dependency graph
  function traverseDependents(compId, depth = 1) {
    if (visited.has(compId)) {
      return 0;
    }
    
    visited.add(compId);
    const comp = graph[compId];
    
    if (!comp) {
      return 0;
    }
    
    let impact = 0;
    
    // The impact diminishes with depth but increases with the number of dependents
    const depthFactor = 1 / Math.pow(2, depth - 1);
    
    // For each dependent, calculate impact
    comp.dependents.forEach(depId => {
      const dependent = graph[depId];
      
      if (dependent) {
        impactedComponents.push({
          id: dependent.id,
          path: dependent.path,
          depth
        });
        
        // Impact is based on the dependent's own dependents
        const dependentImpact = (1 + (dependent.dependents.length * 0.2)) * depthFactor;
        impact += dependentImpact;
        
        // Recursively traverse deeper dependents
        impact += traverseDependents(depId, depth + 1);
      }
    });
    
    return impact;
  }
  
  // Calculate the total impact score
  const errorImpact = component.errorCount * traverseDependents(component.id);
  
  return {
    score: errorImpact,
    impactedComponents
  };
}

// Group errors by component family
function groupErrorsByFamily(graph, components) {
  const familyGroups = {};
  
  // Extract family name from component path
  function extractFamily(path) {
    if (path.includes('features/')) {
      const match = path.match(/features\/([^\/]+)/);
      return match ? match[1] : 'Other';
    } else if (path.includes('components/')) {
      return 'Common Components';
    } else if (path.includes('hooks/')) {
      return 'Hooks';
    } else if (path.includes('utils/')) {
      return 'Utilities';
    } else {
      return 'Other';
    }
  }
  
  // Group components by family
  Object.values(graph).forEach(comp => {
    const family = extractFamily(comp.path);
    
    if (!familyGroups[family]) {
      familyGroups[family] = {
        name: family,
        components: [],
        errors: [],
        errorCount: 0,
        impactScore: 0
      };
    }
    
    familyGroups[family].components.push(comp);
    familyGroups[family].errors.push(...comp.errors);
    familyGroups[family].errorCount += comp.errorCount;
  });
  
  // Calculate impact score for each family based on dependencies outside the family
  Object.values(familyGroups).forEach(family => {
    let externalDependentCount = 0;
    
    family.components.forEach(comp => {
      // Count dependents that are outside this family
      const externalDependents = comp.dependents.filter(depId => {
        const depComp = graph[depId];
        if (!depComp) return false;
        
        const depFamily = extractFamily(depComp.path);
        return depFamily !== family.name;
      });
      
      externalDependentCount += externalDependents.length;
    });
    
    // Impact is a function of error count and external dependencies
    family.impactScore = family.errorCount * Math.log2(externalDependentCount + 1);
  });
  
  // Sort families by impact score
  return Object.values(familyGroups).sort((a, b) => b.impactScore - a.impactScore);
}

// Analyze dependency structure for error propagation patterns
function analyzeErrorPropagationPatterns(graph, criticalChains) {
  const propagationPatterns = {
    // Error ripple effect: errors in one component affect many others
    rippleEffects: [],
    
    // Error hubs: components with both many errors and many dependents
    errorHubs: [],
    
    // Foundation errors: errors in commonly used utility/helper components
    foundationErrors: [],
    
    // Isolated errors: errors in components with few or no dependents
    isolatedErrors: []
  };
  
  // Find ripple effect components (high impact score)
  propagationPatterns.rippleEffects = criticalChains
    .filter(chain => chain.impactScore > 10)
    .slice(0, 10);
  
  // Find error hubs (many errors, many dependents)
  propagationPatterns.errorHubs = Object.values(graph)
    .filter(comp => comp.errorCount > 5 && comp.dependents.length > 3)
    .sort((a, b) => (b.errorCount * b.dependents.length) - (a.errorCount * a.dependents.length))
    .slice(0, 10)
    .map(comp => ({
      component: comp.id,
      path: comp.path,
      errorCount: comp.errorCount,
      dependentCount: comp.dependents.length,
      score: comp.errorCount * comp.dependents.length
    }));
  
  // Find foundation errors (utility, context, common components with errors)
  propagationPatterns.foundationErrors = Object.values(graph)
    .filter(comp => {
      const isFoundation = comp.path.includes('utils/') || 
                          comp.path.includes('context/') || 
                          comp.path.includes('hooks/') ||
                          comp.dependents.length > 5;
      return isFoundation && comp.errorCount > 0;
    })
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 10)
    .map(comp => ({
      component: comp.id,
      path: comp.path,
      errorCount: comp.errorCount,
      dependentCount: comp.dependents.length,
      isUtility: comp.path.includes('utils/'),
      isContext: comp.path.includes('context/'),
      isHook: comp.path.includes('hooks/')
    }));
  
  // Find isolated errors (errors with minimal propagation)
  propagationPatterns.isolatedErrors = Object.values(graph)
    .filter(comp => comp.errorCount > 0 && comp.dependents.length === 0)
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 10)
    .map(comp => ({
      component: comp.id,
      path: comp.path,
      errorCount: comp.errorCount
    }));
  
  return propagationPatterns;
}

// Generate dependency chain analysis report
function generateDependencyChainReport(criticalChains, familyGroups, propagationPatterns) {
  let report = '# Dependency Chain Analysis\n\n';
  
  report += 'This report identifies critical error dependency chains where errors in one component can affect multiple dependent components.\n\n';
  
  // Critical chain section
  report += '## Critical Error Chains\n\n';
  report += 'These components have errors that impact many other components:\n\n';
  report += '| Component | Path | Errors | Dependents | Impact Score |\n';
  report += '|-----------|------|--------|------------|-------------|\n';
  
  criticalChains.slice(0, 10).forEach(chain => {
    report += `| ${chain.component} | ${chain.path} | ${chain.errorCount} | ${chain.dependentCount} | ${chain.impactScore.toFixed(2)} |\n`;
  });
  
  report += '\n';
  
  // Component family section
  report += '## Component Family Analysis\n\n';
  report += 'Error distribution by component family:\n\n';
  report += '| Family | Components | Total Errors | External Impact |\n';
  report += '|--------|------------|--------------|----------------|\n';
  
  familyGroups.slice(0, 10).forEach(family => {
    report += `| ${family.name} | ${family.components.length} | ${family.errorCount} | ${family.impactScore.toFixed(2)} |\n`;
  });
  
  report += '\n';
  
  // Error propagation patterns
  report += '## Error Propagation Patterns\n\n';
  
  // Ripple effects
  report += '### Ripple Effect Components\n\n';
  report += 'These components have errors that propagate widely throughout the codebase:\n\n';
  
  propagationPatterns.rippleEffects.forEach((ripple, index) => {
    report += `${index + 1}. **${ripple.component}** (${ripple.path})\n`;
    report += `   - Errors: ${ripple.errorCount}\n`;
    report += `   - Dependents: ${ripple.dependentCount}\n`;
    report += `   - Impact Score: ${ripple.impactScore.toFixed(2)}\n`;
    report += `   - Impacted Components: ${ripple.impactedComponents.length}\n\n`;
  });
  
  // Error hubs
  report += '### Error Hub Components\n\n';
  report += 'These components have both many errors and many dependents:\n\n';
  
  propagationPatterns.errorHubs.forEach((hub, index) => {
    report += `${index + 1}. **${hub.component}** (${hub.path})\n`;
    report += `   - Errors: ${hub.errorCount}\n`;
    report += `   - Dependents: ${hub.dependentCount}\n`;
    report += `   - Hub Score: ${hub.score.toFixed(2)}\n\n`;
  });
  
  // Foundation errors
  report += '### Foundation Component Errors\n\n';
  report += 'These utility, context, or widely-used components have errors:\n\n';
  
  propagationPatterns.foundationErrors.forEach((foundation, index) => {
    const type = foundation.isUtility ? 'Utility' : 
                (foundation.isContext ? 'Context' : 
                (foundation.isHook ? 'Hook' : 'Common Component'));
    
    report += `${index + 1}. **${foundation.component}** (${foundation.path})\n`;
    report += `   - Type: ${type}\n`;
    report += `   - Errors: ${foundation.errorCount}\n`;
    report += `   - Dependents: ${foundation.dependentCount}\n\n`;
  });
  
  // Isolated errors
  report += '### Isolated Error Components\n\n';
  report += 'These components have errors but minimal propagation impact:\n\n';
  
  propagationPatterns.isolatedErrors.forEach((isolated, index) => {
    report += `${index + 1}. **${isolated.component}** (${isolated.path})\n`;
    report += `   - Errors: ${isolated.errorCount}\n`;
    report += `   - Propagation: None (no dependents)\n\n`;
  });
  
  // Remediation strategy section
  report += '## Remediation Strategy Recommendations\n\n';
  
  report += '### 1. Foundation First Approach\n\n';
  report += 'Fix errors in foundation components first, as they have the highest propagation impact:\n\n';
  report += '- Utility functions\n';
  report += '- Context providers\n';
  report += '- Shared hooks\n';
  report += '- Common UI components\n\n';
  
  report += '### 2. Error Hub Targeting\n\n';
  report += 'After fixing foundation components, target error hubs to maximize impact:\n\n';
  report += '- Components with both high error counts and many dependents\n';
  report += '- Components at the root of critical error chains\n\n';
  
  report += '### 3. Family-Based Approach\n\n';
  report += 'Fix related components together to maintain consistency:\n\n';
  report += '- Group fixes by component family\n';
  report += '- Create consistent type patterns within families\n\n';
  
  report += '### 4. Isolated Error Cleanup\n\n';
  report += 'Finally, clean up isolated errors with minimal dependencies:\n\n';
  report += '- These can be fixed independently without risk of breakage\n';
  report += '- Good candidates for parallel work streams\n\n';
  
  fs.writeFileSync('analysis/errors/dependency-chain-report.md', report);
  console.log('Generated dependency chain report');
  
  return report;
}

// Generate dependency graph visualization data
function generateDependencyVisualizationData(graph, criticalChains) {
  // Prepare data in D3 format
  const nodes = [];
  const links = [];
  
  // Create nodes
  Object.values(graph).forEach(comp => {
    // Find if this component is part of a critical chain
    const criticalChain = criticalChains.find(chain => chain.component === comp.id);
    
    nodes.push({
      id: comp.id,
      path: comp.path,
      errors: comp.errorCount,
      dependents: comp.dependents.length,
      group: criticalChain ? 1 : (comp.errorCount > 0 ? 2 : 3),
      impactScore: criticalChain ? criticalChain.impactScore : 0
    });
  });
  
  // Create links
  Object.values(graph).forEach(comp => {
    comp.dependencies.forEach(depId => {
      links.push({
        source: comp.id,
        target: depId,
        value: 1
      });
    });
  });
  
  // Create visualization data
  const visualizationData = {
    nodes,
    links
  };
  
  fs.writeFileSync(
    'analysis/errors/dependency-visualization.json', 
    JSON.stringify(visualizationData, null, 2)
  );
  
  console.log('Generated dependency visualization data');
}

// Main execution function
function runDependencyChainAnalysis() {
  console.log('Loading analysis data...');
  const data = loadAnalysisData();
  
  console.log('Building dependency graph...');
  const graph = buildDependencyGraph(data.components, data.dependencies);
  
  console.log('Assigning errors to components...');
  const graphWithErrors = assignErrorsToComponents(graph, data.errors);
  
  console.log('Identifying critical dependency chains...');
  const criticalChains = findCriticalDependencyChains(graphWithErrors);
  
  console.log('Grouping errors by component family...');
  const familyGroups = groupErrorsByFamily(graphWithErrors, data.components);
  
  console.log('Analyzing error propagation patterns...');
  const propagationPatterns = analyzeErrorPropagationPatterns(graphWithErrors, criticalChains);
  
  // Save results
  const analysisResults = {
    criticalChains,
    familyGroups,
    propagationPatterns
  };
  
  fs.writeFileSync(
    'analysis/errors/dependency-chain-analysis.json',
    JSON.stringify(analysisResults, null, 2)
  );
  
  // Generate reports
  generateDependencyChainReport(criticalChains, familyGroups, propagationPatterns);
  generateDependencyVisualizationData(graphWithErrors, criticalChains);
  
  console.log('Dependency chain analysis complete');
}

// Run the analysis
runDependencyChainAnalysis(); 