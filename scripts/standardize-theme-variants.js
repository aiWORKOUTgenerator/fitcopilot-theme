#!/usr/bin/env node

/**
 * Theme Variants Standardization Script
 * 
 * This script identifies and standardizes theme variant patterns in Storybook story files.
 * It checks for:
 * 1. Consistent naming (ThemeVariants vs ThemedVariants)
 * 2. JSX pattern usage (vs React.createElement)
 * 3. data-theme attribute usage
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

// Check for theme variants in story file
const checkThemeVariants = (storyPath) => {
  try {
    const content = fs.readFileSync(storyPath, 'utf8');
    
    // Check for different theme variant patterns
    const hasThemeVariants = content.includes('export const ThemeVariants');
    const hasThemedVariants = content.includes('export const ThemedVariants');
    const hasIndividualVariants = 
      content.includes('Variant: Story') || 
      /[A-Za-z]+Theme: Story/.test(content);
    
    // If any theme variants exist, check the pattern
    if (hasThemeVariants || hasThemedVariants || hasIndividualVariants) {
      // Check if using JSX
      const usesJSX = content.includes('render: () => (') && 
                    content.includes('<div');
      
      // Check if using data-theme attribute
      const usesDataTheme = content.includes('data-theme=');
      
      return {
        path: storyPath,
        componentName: path.basename(storyPath, '.stories.tsx'),
        hasThemeVariants,
        hasThemedVariants,
        hasIndividualVariants,
        usesJSX,
        usesDataTheme
      };
    }
    
    return null;
  } catch (error) {
    console.error(`${colors.red}Error checking ${storyPath}:${colors.reset}`, error.message);
    return null;
  }
};

// Generate standardization suggestions
const generateSuggestions = (results) => {
  const suggestions = [];
  
  // Check for naming inconsistencies
  const themedVariants = results.filter(r => r.hasThemedVariants);
  if (themedVariants.length > 0) {
    suggestions.push({
      type: 'naming',
      message: 'Rename "ThemedVariants" to "ThemeVariants" for consistency',
      files: themedVariants.map(r => r.path)
    });
  }
  
  // Check for missing data-theme attributes
  const missingDataTheme = results.filter(r => !r.usesDataTheme);
  if (missingDataTheme.length > 0) {
    suggestions.push({
      type: 'data-theme',
      message: 'Add data-theme attributes to theme containers',
      files: missingDataTheme.map(r => r.path)
    });
  }
  
  // Check for individual variants that could be combined
  const individualVariants = results.filter(r => r.hasIndividualVariants && !r.hasThemeVariants && !r.hasThemedVariants);
  if (individualVariants.length > 0) {
    suggestions.push({
      type: 'consolidation',
      message: 'Consider consolidating theme variants into a single ThemeVariants story',
      files: individualVariants.map(r => r.path)
    });
  }
  
  return suggestions;
};

// Main function
const main = () => {
  console.log(`${colors.cyan}============ Theme Variants Standardization ============${colors.reset}`);
  console.log(`Checking story files for theme variant patterns...`);
  
  const storyFiles = findStoryFiles();
  
  if (storyFiles.length === 0) {
    console.log(`${colors.yellow}No story files found. Exiting.${colors.reset}`);
    return;
  }
  
  console.log(`Found ${storyFiles.length} story files.`);
  
  // Check each story file for theme variants
  const results = [];
  let themeVariantCount = 0;
  
  storyFiles.forEach(storyPath => {
    const result = checkThemeVariants(storyPath);
    if (result) {
      results.push(result);
      themeVariantCount++;
    }
  });
  
  // Print summary
  console.log(`\n${colors.cyan}============ Summary ============${colors.reset}`);
  console.log(`Found ${themeVariantCount} files with theme variants`);
  console.log(`- ThemeVariants pattern: ${results.filter(r => r.hasThemeVariants).length}`);
  console.log(`- ThemedVariants pattern: ${results.filter(r => r.hasThemedVariants).length}`);
  console.log(`- Individual variants pattern: ${results.filter(r => r.hasIndividualVariants && !r.hasThemeVariants && !r.hasThemedVariants).length}`);
  
  // Generate and print suggestions
  const suggestions = generateSuggestions(results);
  
  if (suggestions.length > 0) {
    console.log(`\n${colors.cyan}============ Standardization Suggestions ============${colors.reset}`);
    
    suggestions.forEach(suggestion => {
      console.log(`\n${colors.yellow}${suggestion.message}:${colors.reset}`);
      suggestion.files.forEach(file => {
        console.log(`  - ${file}`);
      });
    });
    
    // Print standardized JSX pattern
    console.log(`\n${colors.cyan}============ Standardized Pattern ============${colors.reset}`);
    console.log(`
export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>Default Theme</h3>
        <Component prop="value" />
      </div>
      
      <div data-theme="theme-variant">
        <h3>Theme Variant</h3>
        <Component prop="value" />
      </div>
    </div>
  )
};
    `);
  } else {
    console.log(`\n${colors.green}All theme variants follow standardized patterns!${colors.reset}`);
  }
  
  // Print detailed results
  console.log(`\n${colors.cyan}============ Detailed Results ============${colors.reset}`);
  
  results.forEach(result => {
    console.log(`\n${result.path}`);
    console.log(`  Component: ${result.componentName}`);
    
    // Determine variant pattern
    let pattern = 'Unknown';
    if (result.hasThemeVariants) {
      pattern = 'ThemeVariants';
    } else if (result.hasThemedVariants) {
      pattern = 'ThemedVariants';
    } else if (result.hasIndividualVariants) {
      pattern = 'Individual variants';
    }
    
    console.log(`  Pattern: ${pattern}`);
    console.log(`  Using JSX: ${result.usesJSX ? `${colors.green}Yes${colors.reset}` : `${colors.red}No${colors.reset}`}`);
    console.log(`  Using data-theme: ${result.usesDataTheme ? `${colors.green}Yes${colors.reset}` : `${colors.red}No${colors.reset}`}`);
  });
};

// Run the script
main(); 