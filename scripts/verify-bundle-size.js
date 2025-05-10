/**
 * Bundle Size Verification Script
 * 
 * This script analyzes the webpack stats to verify bundle sizes against performance budgets.
 * It can be run after a build to ensure that bundle sizes remain within acceptable limits.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Performance budgets in kilobytes
const BUDGETS = {
  'critical.css': 30,
  'homepage.js': 18, // Main JavaScript bundle
  'homepage.css': 200,
  'chunks/feature-registration': 50, // Registration feature chunks
  'chunks/variant': 20, // Variant chunks (any variant)
  'chunks/framework': 5, // Framework chunks (React)
  'chunks/vendor': 100 // Vendor chunks
};

// Helper to convert bytes to kilobytes
const toKB = (bytes) => Math.round(bytes / 1024);

// Check if bundle-stats.json exists
const statsPath = path.join(__dirname, '../bundle-report.json');

if (!fs.existsSync(statsPath)) {
  console.error(chalk.red('❌ Bundle stats file not found. Run webpack with ANALYZE=true first.'));
  process.exit(1);
}

try {
  // Read and parse stats file
  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  
  // Track violations
  const violations = [];
  let totalSize = 0;
  const assetsAnalyzed = [];
  
  // Process assets
  stats.assets.forEach(asset => {
    const name = asset.name;
    const sizeKB = toKB(asset.size);
    totalSize += asset.size;
    
    // Find matching budget (exact or pattern match)
    let budgetKey = Object.keys(BUDGETS).find(key => {
      if (name === key) return true;
      if (name.includes(key)) return true;
      return false;
    });
    
    if (budgetKey) {
      const budget = BUDGETS[budgetKey];
      assetsAnalyzed.push({
        name,
        sizeKB,
        budget,
        overBudget: sizeKB > budget
      });
      
      if (sizeKB > budget) {
        violations.push({
          name,
          sizeKB,
          budget,
          overage: sizeKB - budget
        });
      }
    }
  });
  
  // Log results
  console.log(chalk.bold('\n📊 Bundle Size Analysis\n'));
  
  // Report analyzed assets
  console.log(chalk.bold('Assets analyzed:'));
  assetsAnalyzed.forEach(asset => {
    const status = asset.overBudget 
      ? chalk.red(`${asset.sizeKB}KB (exceeds ${asset.budget}KB budget)`) 
      : chalk.green(`${asset.sizeKB}KB (under ${asset.budget}KB budget)`);
    
    console.log(`  - ${asset.name}: ${status}`);
  });
  
  // Total size
  console.log(chalk.bold(`\nTotal bundle size: ${toKB(totalSize)}KB`));
  
  // Report violations
  if (violations.length > 0) {
    console.log(chalk.red.bold('\n❌ Budget violations:'));
    violations.forEach(v => {
      console.log(chalk.red(`  - ${v.name}: ${v.sizeKB}KB exceeds budget by ${v.overage}KB (budget: ${v.budget}KB)`));
    });
    
    console.log(chalk.yellow('\nSuggestions to reduce bundle size:'));
    console.log('  • Review imports from large packages (use specific imports instead of whole library)');
    console.log('  • Move more components to dynamic imports with React.lazy()');
    console.log('  • Check for duplicate dependencies or components');
    console.log('  • Optimize image assets further');
    
    process.exit(1); // Exit with error code
  } else {
    console.log(chalk.green.bold('\n✅ All bundles are within size budgets!'));
  }
  
} catch (error) {
  console.error(chalk.red('Error parsing bundle stats:'), error);
  process.exit(1);
} 