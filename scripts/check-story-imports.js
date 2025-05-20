#!/usr/bin/env node

/**
 * Story Import Pattern Checker
 * 
 * This script checks all Storybook story files for consistent import patterns
 * based on the component structure type.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Component structure types
const COMPONENT_TYPES = {
  A: 'Component in root directory',
  B: 'Component in components subdirectory',
  C: 'Feature component with direct structure',
  D: 'Component directly in components directory'
};

// Import patterns
const IMPORT_PATTERNS = {
  A: [
    "import { $COMPONENT } from '../$COMPONENT'",
    "import { $COMPONENT } from '../'"
  ],
  B: [
    "import { $COMPONENT } from '../components'",
    "import { $COMPONENT } from '../'"
  ],
  C: [
    "import { $COMPONENT } from '../$COMPONENT'",
    "import { $COMPONENT } from '../'"
  ],
  D: [
    "import { $COMPONENT } from '../../$COMPONENT'",
    "import { $COMPONENT } from '../../'"
  ]
};

// Find all story files
const findStoryFiles = () => {
  try {
    const result = execSync('find src -name "*.stories.tsx"').toString().trim();
    return result.split('\n');
  } catch (error) {
    console.error(`${colors.red}Error finding story files:${colors.reset}`, error.message);
    return [];
  }
};

// Determine component structure type
const determineComponentType = (storyPath) => {
  const dir = path.dirname(storyPath);
  const componentDir = path.dirname(dir);
  const componentName = path.basename(componentDir);
  
  // Special case for FormField which has a non-standard structure
  if (componentName === 'FormField') {
    return { type: 'B', componentName };
  }
  
  // Check if component is in a components subdirectory
  if (componentDir.includes('/components/') && !dir.includes('components/components')) {
    if (fs.existsSync(path.join(componentDir, `${componentName}.tsx`))) {
      return { type: 'C', componentName };
    } else if (fs.existsSync(path.join(path.dirname(componentDir), `${componentName}.tsx`))) {
      return { type: 'D', componentName };
    }
  }
  
  // Check if component is in components subdirectory
  if (fs.existsSync(path.join(componentDir, 'components', `${componentName}.tsx`))) {
    return { type: 'B', componentName };
  }
  
  // Default to type A
  if (fs.existsSync(path.join(componentDir, `${componentName}.tsx`))) {
    return { type: 'A', componentName };
  }
  
  return { type: null, componentName };
};

// Check import pattern
const checkImportPattern = (storyPath, componentType, componentName) => {
  try {
    const content = fs.readFileSync(storyPath, 'utf8');
    
    // Get the first few lines
    const firstLines = content.split('\n').slice(0, 10).join('\n');
    
    // Get expected import patterns
    const expectedPatterns = IMPORT_PATTERNS[componentType].map(pattern => 
      pattern.replace('$COMPONENT', componentName)
    );
    
    // Check if any of the expected patterns match
    const importMatch = expectedPatterns.some(pattern => 
      firstLines.includes(pattern) || firstLines.includes(pattern.replace("'", '"'))
    );
    
    // Check if curly braces are used
    const usesNamedImport = firstLines.includes(`import { ${componentName}`) ||
                             firstLines.includes(`import {${componentName}`);
    
    // Special case for components with default exports
    const isDefaultExportComponent = ['JourneyStep'].includes(componentName);
    const namedImportCheck = isDefaultExportComponent ? true : usesNamedImport;
    
    return {
      path: storyPath,
      componentName,
      type: componentType,
      importMatch,
      usesNamedImport: namedImportCheck,
      themeVariantsPattern: checkThemeVariantsPattern(content)
    };
  } catch (error) {
    console.error(`${colors.red}Error checking ${storyPath}:${colors.reset}`, error.message);
    return {
      path: storyPath,
      componentName,
      type: componentType,
      importMatch: false,
      usesNamedImport: false,
      themeVariantsPattern: null
    };
  }
};

// Check theme variants pattern
const checkThemeVariantsPattern = (content) => {
  const hasThemeVariants = content.includes('export const ThemeVariants');
  const hasThemedVariants = content.includes('export const ThemedVariants');
  
  if (!hasThemeVariants && !hasThemedVariants) return null;
  
  // Check if using JSX
  const usesJSX = (hasThemeVariants || hasThemedVariants) && 
                content.includes('render: () => (') && 
                content.includes('<div');
  
  // Check if using createElement
  const usesCreateElement = (hasThemeVariants || hasThemedVariants) && 
                         content.includes('React.createElement');
  
  // Check if correct name is used
  const usesCorrectName = hasThemeVariants && !hasThemedVariants;
  
  // Check if using data-theme
  const usesDataTheme = content.includes('data-theme=');
  
  if (usesJSX) {
    return {
      pattern: 'JSX',
      correctName: usesCorrectName,
      usesDataTheme
    };
  }
  if (usesCreateElement) return 'createElement';
  return 'unknown';
};

// Main function
const main = () => {
  console.log(`${colors.cyan}============ Story Import Pattern Checker ============${colors.reset}`);
  console.log(`Checking story import patterns against standards...`);
  
  const storyFiles = findStoryFiles();
  let detailedIssues = 0;
  
  if (storyFiles.length === 0) {
    console.log(`${colors.yellow}No story files found. Exiting.${colors.reset}`);
    return;
  }
  
  const results = [];
  
  storyFiles.forEach(storyPath => {
    const { type, componentName } = determineComponentType(storyPath);
    
    if (!type) {
      console.log(`${colors.yellow}Could not determine component type for ${storyPath}${colors.reset}`);
      detailedIssues++;
      return;
    }
    
    const checkResult = checkImportPattern(storyPath, type, componentName);
    results.push(checkResult);
    
    if (!checkResult.importMatch || !checkResult.usesNamedImport || 
        (checkResult.themeVariantsPattern && checkResult.themeVariantsPattern !== 'JSX')) {
      detailedIssues++;
    }
  });
  
  // Print summary
  console.log(`\n${colors.cyan}============ Summary ============${colors.reset}`);
  console.log(`Checked ${results.length} story files`);
  console.log(`Issues found: ${detailedIssues}`);
  
  // Print detailed results
  console.log(`\n${colors.cyan}============ Detailed Results ============${colors.reset}`);
  
  // Reset issue count to only use those calculated in the detailed checks
  detailedIssues = 0;
  
  results.forEach(result => {
    const typeName = `Type ${result.type}: ${COMPONENT_TYPES[result.type]}`;
    const hasImportIssue = !(result.importMatch && result.usesNamedImport);
    if (hasImportIssue) detailedIssues++;
    
    const status = hasImportIssue ? 
                  `${colors.red}✗ Incorrect${colors.reset}` : 
                  `${colors.green}✓ Correct${colors.reset}`;
    
    console.log(`\n${result.path}`);
    console.log(`  Component Name: ${result.componentName}`);
    console.log(`  Structure Type: ${typeName}`);
    console.log(`  Import Status: ${status}`);
    
    if (result.themeVariantsPattern) {
      let hasThemeIssue = false;
      let themeStatus;
      
      if (typeof result.themeVariantsPattern === 'string') {
        themeStatus = result.themeVariantsPattern === 'JSX' ? 
                    `${colors.green}✓ JSX (correct)${colors.reset}` : 
                    `${colors.red}✗ ${result.themeVariantsPattern} (update needed)${colors.reset}`;
        hasThemeIssue = result.themeVariantsPattern !== 'JSX';
      } else {
        themeStatus = result.themeVariantsPattern.pattern === 'JSX' ? 
                    `${colors.green}✓ JSX (correct)${colors.reset}` : 
                    `${colors.red}✗ ${result.themeVariantsPattern.pattern} (update needed)${colors.reset}`;
        hasThemeIssue = result.themeVariantsPattern.pattern !== 'JSX';
      }
      
      console.log(`  Theme Variants: ${themeStatus}`);
      if (hasThemeIssue) detailedIssues++;
      
      if (typeof result.themeVariantsPattern === 'object' && result.themeVariantsPattern.pattern === 'JSX') {
        // Check if using correct name
        const hasNameIssue = !result.themeVariantsPattern.correctName;
        const nameStatus = !hasNameIssue ? 
                         `${colors.green}✓ ThemeVariants (correct)${colors.reset}` : 
                         `${colors.red}✗ ThemedVariants (rename needed)${colors.reset}`;
        console.log(`  Name: ${nameStatus}`);
        if (hasNameIssue) detailedIssues++;
        
        // Check if using data-theme
        const hasDataThemeIssue = !result.themeVariantsPattern.usesDataTheme;
        const dataThemeStatus = !hasDataThemeIssue ? 
                             `${colors.green}✓ Yes (correct)${colors.reset}` : 
                             `${colors.red}✗ No (add data-theme)${colors.reset}`;
        console.log(`  Uses data-theme: ${dataThemeStatus}`);
        if (hasDataThemeIssue) detailedIssues++;
      }
    }
  });
  
  if (detailedIssues === 0) {
    console.log(`\n${colors.green}All story imports follow the standard patterns!${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}Found ${detailedIssues} issues to fix.${colors.reset}`);
    console.log(`Run this script again after fixing the issues.`);
  }
  
  // Helper function to suggest fixes for issues
  suggestFixes(results);
};

// Run the script
main();

// Helper function to suggest fixes for issues
function suggestFixes(results) {
  console.log(`\n${colors.cyan}============ Recommended Actions ============${colors.reset}`);
  
  // Group by issue type
  const needsNamedImport = results.filter(r => !r.usesNamedImport);
  const wrongImportPattern = results.filter(r => !r.importMatch && r.usesNamedImport);
  const needsJSXTheme = results.filter(r => {
    if (!r.themeVariantsPattern) return false;
    if (typeof r.themeVariantsPattern === 'string') {
      return r.themeVariantsPattern !== 'JSX';
    }
    return r.themeVariantsPattern.pattern !== 'JSX';
  });
  
  // Named import fixes
  if (needsNamedImport.length > 0) {
    console.log(`\n${colors.yellow}Components needing named imports:${colors.reset}`);
    needsNamedImport.forEach(r => {
      console.log(`  - ${r.path}`);
      console.log(`    Change: import ${r.componentName} from '../path'`);
      console.log(`    To:     import { ${r.componentName} } from '../path'`);
    });
  }
  
  // Import pattern fixes
  if (wrongImportPattern.length > 0) {
    console.log(`\n${colors.yellow}Components with incorrect import paths:${colors.reset}`);
    wrongImportPattern.forEach(r => {
      console.log(`  - ${r.path}`);
      console.log(`    Expected patterns for Type ${r.type}:`);
      IMPORT_PATTERNS[r.type].forEach(pattern => {
        console.log(`      ${pattern.replace('$COMPONENT', r.componentName)}`);
      });
    });
  }
  
  // Theme variants fixes
  if (needsJSXTheme.length > 0) {
    console.log(`\n${colors.yellow}Components needing JSX theme variants:${colors.reset}`);
    needsJSXTheme.forEach(r => {
      console.log(`  - ${r.path}`);
      if (typeof r.themeVariantsPattern === 'string') {
        console.log(`    Update ThemeVariants to use JSX pattern instead of ${r.themeVariantsPattern}`);
      } else {
        console.log(`    Update ThemeVariants to use JSX pattern`)
      }
    });
  }
  
  if (needsNamedImport.length === 0 && wrongImportPattern.length === 0 && needsJSXTheme.length === 0) {
    console.log(`${colors.green}No specific fixes needed - all patterns follow standards!${colors.reset}`);
  }
} 