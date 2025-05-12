const fs = require('fs');

// Create reports directory if it doesn't exist
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
}

// Try to load all analysis reports, with graceful fallbacks
let categorized = [];
let priorities = [];
let patterns = {};
let fileComparison = [];
let uiComponents = [];
let featureComponents = [];

try {
    categorized = JSON.parse(fs.readFileSync('reports/eslint-warnings-categorized.json'));
} catch (error) {
    console.log('Warning: eslint-warnings-categorized.json not found.');
    categorized = [];
}

try {
    priorities = JSON.parse(fs.readFileSync('reports/warning-priorities.json'));
} catch (error) {
    console.log('Warning: warning-priorities.json not found.');
    priorities = [];
}

try {
    patterns = JSON.parse(fs.readFileSync('reports/warning-patterns.json'));
} catch (error) {
    console.log('Warning: warning-patterns.json not found.');
    patterns = {};
}

try {
    fileComparison = JSON.parse(fs.readFileSync('reports/filetype-comparison.json'));
} catch (error) {
    console.log('Warning: filetype-comparison.json not found.');
    fileComparison = [];
}

try {
    uiComponents = JSON.parse(fs.readFileSync('reports/ui-component-warnings.json'));
} catch (error) {
    console.log('Warning: ui-component-warnings.json not found.');
    uiComponents = [];
}

try {
    featureComponents = JSON.parse(fs.readFileSync('reports/feature-component-warnings.json'));
} catch (error) {
    console.log('Warning: feature-component-warnings.json not found.');
    featureComponents = [];
}

// Generate recommendations based on analysis
function generateRecommendations() {
    const highPriorityRules = priorities.filter(p => p.impact === 'high').map(p => p.ruleId);
    const mostFrequentRules = categorized.sort((a, b) => b.count - a.count).slice(0, 5).map(r => r.ruleId);

    // Determine which patterns to focus on first
    const patternPriorities = Object.entries(patterns)
        .sort((a, b) => b[1] - a[1])
        .map(([pattern, count]) => pattern);

    // Get problematic components
    const problematicUIComponents = uiComponents
        .sort((a, b) => b.warnings - a.warnings)
        .slice(0, 5)
        .map(c => c.component);

    const problematicFeatureComponents = featureComponents
        .sort((a, b) => b.warnings - a.warnings)
        .slice(0, 5)
        .map(c => c.component);

    return {
        highPriorityRules,
        mostFrequentRules,
        patternPriorities,
        problematicUIComponents,
        problematicFeatureComponents,
        recommendations: [
            {
                area: 'Type Safety',
                actions: [
                    'Create standardized type definitions for common patterns',
                    'Replace explicit "any" types with proper interfaces',
                    'Implement type guards for conditional logic',
                    'Add return type annotations to functions',
                    'Create shared interface files for component props'
                ]
            },
            {
                area: 'React Hooks',
                actions: [
                    'Review dependency arrays in useEffect hooks',
                    'Create custom hooks for common patterns',
                    'Implement useMemo for expensive computations',
                    'Fix missing dependencies in useCallback',
                    'Add eslint-disable comments only where truly needed'
                ]
            },
            {
                area: 'Unused Variables',
                actions: [
                    'Add underscore prefix to intentionally unused parameters',
                    'Remove truly unused variables',
                    'Create utility functions for repeated patterns',
                    'Fix destructuring to only extract needed properties',
                    'Implement proper TypeScript interfaces to avoid type-only imports'
                ]
            },
            {
                area: 'Component Structure',
                actions: [
                    'Apply consistent prop naming across component variants',
                    'Fix console statements in UI components',
                    'Implement proper typing for event handlers',
                    'Update Button components to use consistent event types',
                    'Fix accessibility warnings in interactive components'
                ]
            }
        ]
    };
}

const recommendations = generateRecommendations();

// Generate comprehensive report
const finalReport = {
    summary: {
        totalWarnings: categorized.reduce((sum, item) => sum + item.count, 0),
        uniqueRules: categorized.length,
        highPriorityCount: priorities.filter(p => p.impact === 'high')
            .reduce((sum, item) => sum + item.count, 0),
        tsxVsTsRatio: fileComparison.length > 0 ?
            fileComparison.reduce((sum, item) => sum + item.tsx, 0) /
            fileComparison.reduce((sum, item) => sum + item.ts, 0) : 'N/A'
    },
    priorityRules: recommendations.highPriorityRules,
    frequentRules: recommendations.mostFrequentRules,
    patternPriorities: recommendations.patternPriorities,
    problematicComponents: {
        ui: recommendations.problematicUIComponents,
        feature: recommendations.problematicFeatureComponents
    },
    actionPlan: recommendations.recommendations
};

// Save as JSON
fs.writeFileSync('reports/final-analysis.json', JSON.stringify(finalReport, null, 2));

// Generate markdown report
const markdown = `# ESLint Warning Analysis: Final Report

## Summary

- **Total Warnings**: ${finalReport.summary.totalWarnings || 'N/A'}
- **Unique Rules**: ${finalReport.summary.uniqueRules || 'N/A'}
- **High Priority Warnings**: ${finalReport.summary.highPriorityCount || 'N/A'}
- **TSX:TS Warning Ratio**: ${typeof finalReport.summary.tsxVsTsRatio === 'number' ? finalReport.summary.tsxVsTsRatio.toFixed(2) : 'N/A'}

## High Priority Rules

${finalReport.priorityRules.length > 0 ? finalReport.priorityRules.map(rule => `- \`${rule}\``).join('\n') : '- No high priority rules identified'}

## Most Frequent Rules

${finalReport.frequentRules.length > 0 ? finalReport.frequentRules.map(rule => `- \`${rule}\``).join('\n') : '- No rules frequency data available'}

## Common Patterns

${finalReport.patternPriorities.length > 0 ? finalReport.patternPriorities.map(pattern => `- ${pattern}`).join('\n') : '- No pattern data available'}

## Problematic Components

### UI Components
${finalReport.problematicComponents.ui.length > 0 ? finalReport.problematicComponents.ui.map(comp => `- ${comp}`).join('\n') : '- No UI component data available'}

### Feature Components
${finalReport.problematicComponents.feature.length > 0 ? finalReport.problematicComponents.feature.map(comp => `- ${comp}`).join('\n') : '- No feature component data available'}

## Recommended Action Plan

${finalReport.actionPlan.map(area => `
### ${area.area}

${area.actions.map(action => `- ${action}`).join('\n')}
`).join('\n')}

## Next Steps

1. Create a detailed implementation plan for Week 2
2. Prioritize high-impact rules with automated fixes
3. Develop type libraries for common patterns
4. Implement focused fixes for component-specific issues
5. Update ESLint configuration to better match codebase patterns
`;

fs.writeFileSync('reports/final-analysis.md', markdown);

// Generate Week 2 implementation plan
const week2Plan = `# Week 2: Warning Reduction Implementation Plan

## Focus Areas

Based on our Week 1 analysis, we will focus on these key areas:

1. **Type Safety Improvements** - ${finalReport.summary.highPriorityCount || 'Unknown'} high-priority warnings
2. **React Hook Dependency Fixes** - ${finalReport.priorityRules.includes('react-hooks/exhaustive-deps') ? 'High priority' : 'Medium priority'}
3. **Unused Variable Resolution** - ${finalReport.patternPriorities.includes('unusedProps') ? 'High frequency pattern' : 'Medium frequency pattern'}
4. **Component-Specific Fixes** - Targeting the most problematic components identified

## Daily Implementation Plan

### Monday: Type System Enhancement

- Create shared type definitions for common patterns
- Implement proper interfaces for API responses
- Replace explicit \`any\` types in UI components

### Tuesday: React Hook Optimizations

- Fix exhaustive dependencies in useEffect hooks
- Create custom hooks for common patterns
- Implement proper cleanup functions

### Wednesday: Unused Variable Resolution

- Add underscore prefix to intentionally unused parameters
- Remove truly unused variables
- Create utility functions for repeated patterns

### Thursday: Component-Specific Fixes

- Address warnings in high-priority components
- Implement fixes for feature-specific issues
- Update PropTypes with proper TypeScript interfaces

### Friday: Verification & Progress Assessment

- Run comprehensive ESLint check
- Compare warning counts against baseline
- Document patterns and solutions for team reference

## Expected Outcomes

- 50% reduction in overall warning count
- 80% reduction in high-priority warnings
- Improved type safety across all components
- Standardized patterns for React hooks and event handlers
`;

fs.writeFileSync('reports/week2-implementation-plan.md', week2Plan);

console.log('Final analysis and Week 2 plan generated:');
console.log('- reports/final-analysis.json');
console.log('- reports/final-analysis.md');
console.log('- reports/week2-implementation-plan.md'); 