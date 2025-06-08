#!/usr/bin/env node

/**
 * COMPREHENSIVE CSS CONFLICT AUDIT TOOL
 * Detects all conflicts preventing design system tokens from applying
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CSSConflictAuditor {
  constructor() {
    this.conflicts = [];
    this.importOrder = [];
    this.specificity = new Map();
    this.tokenUsage = new Map();
    this.hardcodedValues = [];
  }

  // Find all CSS/SCSS files and their import order
  analyzeImportOrder() {
    console.log('\n🔍 ANALYZING CSS IMPORT ORDER...');
    
    try {
      // Find all TypeScript files that import CSS/SCSS
      const tsFiles = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
        .split('\n')
        .filter(f => f.trim());

      tsFiles.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        const imports = content.match(/import\s+['"].*\.(s?css)['"];?/g) || [];
        
        imports.forEach(imp => {
          const match = imp.match(/import\s+['"](.+\.(s?css))['"];?/);
          if (match) {
            this.importOrder.push({
              file,
              import: match[1],
              line: content.split('\n').findIndex(line => line.includes(imp)) + 1
            });
          }
        });
      });

      console.log(`Found ${this.importOrder.length} CSS imports`);
      
      // Check for problematic import patterns
      const problematicImports = this.importOrder.filter(imp => 
        imp.import.includes('PricingCard') || 
        imp.import.includes('Pricing.scss') ||
        imp.import.includes('design-system')
      );

      if (problematicImports.length > 0) {
        console.log('\n⚠️  POTENTIAL IMPORT CONFLICTS:');
        problematicImports.forEach(imp => {
          console.log(`   ${imp.file}:${imp.line} → ${imp.import}`);
        });
      }

    } catch (error) {
      console.error('Error analyzing import order:', error.message);
    }
  }

  // Find all hardcoded values that should be tokens
  findHardcodedValues() {
    console.log('\n🔍 SCANNING FOR HARDCODED VALUES...');
    
    const patterns = [
      { pattern: /rgba\(31,?\s*41,?\s*55[^)]*\)/g, type: 'background', token: '--pricing-card-bg' },
      { pattern: /space-y-[0-9]+/g, type: 'spacing', token: '--pricing-feature-list-spacing' },
      { pattern: /backdrop-blur-\w+/g, type: 'blur', token: '--pricing-card-backdrop-blur' },
      { pattern: /bg-gray-[0-9]+/g, type: 'background', token: 'design-system-color' },
      { pattern: /text-[0-9]+xl/g, type: 'typography', token: '--pricing-price-size' }
    ];

    try {
      const allFiles = execSync('find src -name "*.tsx" -o -name "*.ts" -o -name "*.scss" -o -name "*.css"', { encoding: 'utf8' })
        .split('\n')
        .filter(f => f.trim());

      allFiles.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        
        patterns.forEach(({ pattern, type, token }) => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              this.hardcodedValues.push({
                file,
                value: match,
                type,
                suggestedToken: token,
                line: content.split('\n').findIndex(line => line.includes(match)) + 1
              });
            });
          }
        });
      });

      console.log(`Found ${this.hardcodedValues.length} hardcoded values`);
      
      // Group by type
      const grouped = this.hardcodedValues.reduce((acc, item) => {
        acc[item.type] = acc[item.type] || [];
        acc[item.type].push(item);
        return acc;
      }, {});

      Object.entries(grouped).forEach(([type, items]) => {
        console.log(`\n⚠️  ${type.toUpperCase()} CONFLICTS (${items.length}):`);
        items.slice(0, 5).forEach(item => {
          console.log(`   ${item.file}:${item.line} → "${item.value}" (use ${item.suggestedToken})`);
        });
        if (items.length > 5) {
          console.log(`   ... and ${items.length - 5} more`);
        }
      });

    } catch (error) {
      console.error('Error scanning hardcoded values:', error.message);
    }
  }

  // Check CSS specificity conflicts
  analyzeSpecificity() {
    console.log('\n🔍 ANALYZING CSS SPECIFICITY CONFLICTS...');
    
    try {
      const scssFiles = execSync('find src -name "*.scss"', { encoding: 'utf8' })
        .split('\n')
        .filter(f => f.trim());

      const pricingSelectors = [];
      
      scssFiles.forEach(file => {
        if (!fs.existsSync(file)) return;
        
        const content = fs.readFileSync(file, 'utf8');
        
        // Find all selectors that target pricing
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('.pricing-card') || line.includes('.pricing-feature-list') || line.includes('space-y-')) {
            const selector = line.trim();
            if (selector.includes('{') || selector.includes(',')) {
              pricingSelectors.push({
                file,
                line: index + 1,
                selector: selector.replace(/\s*\{.*$/, ''),
                specificity: this.calculateSpecificity(selector)
              });
            }
          }
        });
      });

      // Sort by specificity (highest first)
      pricingSelectors.sort((a, b) => b.specificity - a.specificity);

      console.log(`Found ${pricingSelectors.length} pricing-related selectors`);
      
      if (pricingSelectors.length > 0) {
        console.log('\n⚠️  SPECIFICITY HIERARCHY (highest wins):');
        pricingSelectors.slice(0, 10).forEach(sel => {
          console.log(`   ${sel.specificity}: ${sel.selector} (${sel.file}:${sel.line})`);
        });
      }

    } catch (error) {
      console.error('Error analyzing specificity:', error.message);
    }
  }

  // Calculate rough CSS specificity
  calculateSpecificity(selector) {
    const ids = (selector.match(/#[\w-]+/g) || []).length * 100;
    const classes = (selector.match(/\.[\w-]+/g) || []).length * 10;
    const elements = (selector.match(/\b[a-z][\w-]*/g) || []).length * 1;
    return ids + classes + elements;
  }

  // Check token loading and availability
  checkTokenAvailability() {
    console.log('\n🔍 CHECKING DESIGN SYSTEM TOKEN LOADING...');
    
    try {
      const tokenFiles = [
        'src/styles/design-system/component-tokens.scss',
        'src/styles/design-system/_colors.scss',
        'src/styles/design-system/index.scss'
      ];

      tokenFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for pricing-specific tokens
          const pricingTokens = content.match(/--pricing-[\w-]+:/g) || [];
          console.log(`   ${file}: ${pricingTokens.length} pricing tokens`);
          
          if (pricingTokens.length > 0) {
            console.log(`      Tokens: ${pricingTokens.map(t => t.replace(':', '')).join(', ')}`);
          }
        } else {
          console.log(`   ❌ MISSING: ${file}`);
        }
      });

    } catch (error) {
      console.error('Error checking token availability:', error.message);
    }
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n📊 CSS CONFLICT AUDIT SUMMARY');
    console.log('=====================================');
    console.log(`Import order issues: ${this.importOrder.length}`);
    console.log(`Hardcoded values: ${this.hardcodedValues.length}`);
    console.log(`Specificity conflicts: ${this.specificity.size}`);
    
    // Priority recommendations
    console.log('\n🚀 PRIORITY FIXES:');
    
    // Find the most critical conflicts
    const criticalBackgrounds = this.hardcodedValues.filter(v => 
      v.type === 'background' && v.file.includes('Pricing')
    );
    
    const criticalSpacing = this.hardcodedValues.filter(v => 
      v.type === 'spacing' && v.file.includes('Pricing')
    );

    if (criticalBackgrounds.length > 0) {
      console.log(`\n1. FIX BACKGROUND CONFLICTS (${criticalBackgrounds.length} files):`);
      criticalBackgrounds.forEach(bg => {
        console.log(`   • ${bg.file}:${bg.line} - Replace "${bg.value}" with ${bg.suggestedToken}`);
      });
    }

    if (criticalSpacing.length > 0) {
      console.log(`\n2. FIX SPACING CONFLICTS (${criticalSpacing.length} files):`);
      criticalSpacing.forEach(spacing => {
        console.log(`   • ${spacing.file}:${spacing.line} - Replace "${spacing.value}" with CSS token`);
      });
    }

    console.log('\n3. VERIFY CSS IMPORT ORDER:');
    console.log('   • Design system tokens should load first');
    console.log('   • Component styles should load after tokens');
    console.log('   • Tailwind classes may override everything');
  }

  // Run complete audit
  audit() {
    console.log('🔍 COMPREHENSIVE CSS CONFLICT AUDIT');
    console.log('=====================================');
    
    this.analyzeImportOrder();
    this.findHardcodedValues();
    this.analyzeSpecificity();
    this.checkTokenAvailability();
    this.generateReport();
  }
}

// Run the audit
const auditor = new CSSConflictAuditor();
auditor.audit(); 