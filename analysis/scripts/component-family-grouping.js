const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Load component hierarchy data from Day 1 analysis
function loadComponentData() {
  try {
    // Load component hierarchy
    const hierarchy = JSON.parse(fs.readFileSync('analysis/errors/component-hierarchy.json', 'utf8'));
    
    return {
      components: hierarchy.nodes,
      dependencies: hierarchy.edges
    };
  } catch (err) {
    console.error('Error loading component data:', err);
    return { components: [], dependencies: [] };
  }
}

// Extract component family information from file content
function analyzeComponentStructure(components) {
  console.log(`Analyzing ${components.length} components for family grouping...`);
  
  const families = {};
  const typePatterns = {};
  
  // First pass: identify component families by naming convention
  components.forEach(component => {
    const { id, path: componentPath, fullPath } = component;
    
    // Get component folder path and base name
    const folderPath = path.dirname(fullPath);
    const baseName = extractBaseComponentName(id);
    
    // Skip if this is an index file or other special case
    if (id === 'index' || id === 'types' || id === 'utils' || id === 'constants') {
      return;
    }
    
    // Check if this component belongs to a family
    const familyKey = determineComponentFamily(id, componentPath, folderPath);
    
    if (familyKey) {
      if (!families[familyKey]) {
        families[familyKey] = {
          name: familyKey,
          basePath: folderPath,
          components: [],
          variants: [],
          hasTypeDefinition: false,
          typeFiles: []
        };
      }
      
      // Add to family
      families[familyKey].components.push(component);
      
      // Check if this is a variant
      if (id !== familyKey && id.includes(familyKey)) {
        families[familyKey].variants.push({
          id,
          path: componentPath,
          variant: id.replace(familyKey, '')
        });
      }
    }
  });
  
  // Second pass: analyze type definitions in each family
  Object.values(families).forEach(family => {
    // Look for type files
    const typePath = path.join(family.basePath, 'types.ts');
    if (fs.existsSync(typePath)) {
      family.hasTypeDefinition = true;
      family.typeFiles.push('types.ts');
      
      // Analyze type patterns
      const typeContent = fs.readFileSync(typePath, 'utf8');
      family.typePatterns = analyzeTypePatterns(typeContent, family.name);
    }
    
    // Look for inline types in component files
    family.components.forEach(component => {
      try {
        const content = fs.readFileSync(component.fullPath, 'utf8');
        const inlineTypes = extractInlineTypes(content, component.id);
        
        if (inlineTypes.length > 0) {
          if (!family.inlineTypes) {
            family.inlineTypes = [];
          }
          
          family.inlineTypes.push({
            component: component.id,
            types: inlineTypes
          });
        }
      } catch (err) {
        console.error(`Error analyzing component ${component.id}:`, err);
      }
    });
  });
  
  return families;
}

// Extract base component name by removing variant prefixes/suffixes
function extractBaseComponentName(name) {
  // Common variant patterns
  const variantPrefixes = ['Primary', 'Secondary', 'Tertiary', 'Basic', 'Advanced', 'Small', 'Large'];
  const variantSuffixes = ['Item', 'List', 'Container', 'Wrapper', 'Group'];
  
  let baseName = name;
  
  // Remove variant prefixes
  for (const prefix of variantPrefixes) {
    if (name.startsWith(prefix) && name !== prefix) {
      baseName = name.substring(prefix.length);
      break;
    }
  }
  
  // Remove variant suffixes
  for (const suffix of variantSuffixes) {
    if (name.endsWith(suffix) && name !== suffix) {
      baseName = name.substring(0, name.length - suffix.length);
      break;
    }
  }
  
  return baseName;
}

// Determine which component family this component belongs to
function determineComponentFamily(name, componentPath, folderPath) {
  // Rule 1: If component is in a named folder matching its base name
  const folderName = path.basename(folderPath);
  if (name === folderName || name.includes(folderName)) {
    return folderName;
  }
  
  // Rule 2: Check for common component families
  const commonFamilies = ['Button', 'Card', 'Form', 'Modal', 'Nav', 'Menu', 'List', 'Table'];
  for (const family of commonFamilies) {
    if (name === family || name.includes(family)) {
      return family;
    }
  }
  
  // Rule 3: Check parent directory
  const parentDir = path.basename(path.dirname(folderPath));
  if (componentPath.includes(`${parentDir}/${folderName}`)) {
    return parentDir;
  }
  
  // If we can't determine family, return component name as singleton family
  return name;
}

// Analyze type patterns in type definition files
function analyzeTypePatterns(content, familyName) {
  const patterns = {
    hasDiscriminatedUnion: false,
    hasBaseInterface: false,
    hasExtendedInterfaces: false,
    hasTypeGuards: false,
    interfaces: [],
    types: [],
    typeGuards: []
  };
  
  // Check for base interface pattern
  const baseInterfaceRegex = new RegExp(`interface Base${familyName}Props`, 'i');
  patterns.hasBaseInterface = baseInterfaceRegex.test(content);
  
  // Extract interfaces
  const interfaceRegex = /interface\s+(\w+)/g;
  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    patterns.interfaces.push(match[1]);
  }
  
  // Check for extended interfaces
  const extendedInterfaceRegex = /interface\s+\w+\s+extends\s+\w+/;
  patterns.hasExtendedInterfaces = extendedInterfaceRegex.test(content);
  
  // Extract types
  const typeRegex = /type\s+(\w+)\s*=/g;
  while ((match = typeRegex.exec(content)) !== null) {
    patterns.types.push(match[1]);
  }
  
  // Check for discriminated union (look for '|' in type definitions)
  const unionTypeRegex = /type\s+\w+\s*=\s*[^|]*\|[^|]*/;
  patterns.hasDiscriminatedUnion = unionTypeRegex.test(content);
  
  // Check for type guards
  const typeGuardRegex = /function\s+\w+\s*\([^)]*\)\s*:\s*\w+\s+is\s+\w+/;
  patterns.hasTypeGuards = typeGuardRegex.test(content);
  
  return patterns;
}

// Extract inline type definitions from component file
function extractInlineTypes(content, componentName) {
  const inlineTypes = [];
  
  // Look for interface definitions
  const interfaceRegex = /interface\s+(\w+)\s*\{[^}]*\}/g;
  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    inlineTypes.push({
      name: match[1],
      kind: 'interface',
      inline: true
    });
  }
  
  // Look for type aliases
  const typeRegex = /type\s+(\w+)\s*=\s*[^;]+;/g;
  while ((match = typeRegex.exec(content)) !== null) {
    inlineTypes.push({
      name: match[1],
      kind: 'type',
      inline: true
    });
  }
  
  return inlineTypes;
}

// Analyze component usage patterns
function analyzeComponentUsage(components, dependencies) {
  const usagePatterns = {};
  
  // Count incoming dependencies for each component
  components.forEach(component => {
    const id = component.id;
    usagePatterns[id] = {
      component: id,
      incomingDeps: 0,
      outgoingDeps: 0,
      usedBy: [],
      uses: []
    };
  });
  
  // Calculate usage statistics
  dependencies.forEach(dep => {
    const { source, target } = dep;
    
    // Increment incoming deps for target
    if (usagePatterns[target]) {
      usagePatterns[target].incomingDeps++;
      usagePatterns[target].usedBy.push(source);
    }
    
    // Increment outgoing deps for source
    if (usagePatterns[source]) {
      usagePatterns[source].outgoingDeps++;
      usagePatterns[source].uses.push(target);
    }
  });
  
  // Sort by usage
  const sortedByUsage = Object.values(usagePatterns)
    .sort((a, b) => b.incomingDeps - a.incomingDeps);
  
  return {
    byComponent: usagePatterns,
    sortedByUsage
  };
}

// Generate component family report
function generateComponentFamilyReport(families, usagePatterns) {
  let report = '# Component Family Analysis\n\n';
  
  report += `Analyzed ${Object.keys(families).length} component families\n\n`;
  
  // Summary statistics
  const stats = {
    totalFamilies: Object.keys(families).length,
    withTypeDefinitions: 0,
    withVariants: 0,
    withDiscriminatedUnions: 0,
    withBaseInterfaces: 0,
    withTypeGuards: 0,
    averageVariantsPerFamily: 0
  };
  
  Object.values(families).forEach(family => {
    if (family.hasTypeDefinition) stats.withTypeDefinitions++;
    if (family.variants.length > 0) stats.withVariants++;
    if (family.typePatterns && family.typePatterns.hasDiscriminatedUnion) stats.withDiscriminatedUnions++;
    if (family.typePatterns && family.typePatterns.hasBaseInterface) stats.withBaseInterfaces++;
    if (family.typePatterns && family.typePatterns.hasTypeGuards) stats.withTypeGuards++;
  });
  
  stats.averageVariantsPerFamily = Object.values(families).reduce((sum, family) => 
    sum + family.variants.length, 0) / stats.totalFamilies;
  
  report += '## Summary Statistics\n\n';
  report += `- Total component families: ${stats.totalFamilies}\n`;
  report += `- Families with type definitions: ${stats.withTypeDefinitions} (${Math.round(stats.withTypeDefinitions/stats.totalFamilies*100)}%)\n`;
  report += `- Families with variants: ${stats.withVariants} (${Math.round(stats.withVariants/stats.totalFamilies*100)}%)\n`;
  report += `- Families using discriminated unions: ${stats.withDiscriminatedUnions} (${Math.round(stats.withDiscriminatedUnions/stats.totalFamilies*100)}%)\n`;
  report += `- Families using base interfaces: ${stats.withBaseInterfaces} (${Math.round(stats.withBaseInterfaces/stats.totalFamilies*100)}%)\n`;
  report += `- Families using type guards: ${stats.withTypeGuards} (${Math.round(stats.withTypeGuards/stats.totalFamilies*100)}%)\n`;
  report += `- Average variants per family: ${stats.averageVariantsPerFamily.toFixed(2)}\n\n`;
  
  // Detail section for each family
  report += '## Component Families\n\n';
  
  Object.entries(families)
    .sort((a, b) => {
      // Sort by number of variants first, then by family name
      return b[1].variants.length - a[1].variants.length || a[0].localeCompare(b[0]);
    })
    .forEach(([familyName, family]) => {
      report += `### ${familyName} (${family.components.length} components)\n\n`;
      
      report += `**Base Path:** ${family.basePath}\n`;
      
      if (family.variants.length > 0) {
        report += `**Variants:** ${family.variants.length}\n`;
        family.variants.forEach(variant => {
          // Get usage statistics for this variant
          const usage = usagePatterns.byComponent[variant.id];
          const usageInfo = usage ? ` - Used by ${usage.incomingDeps} components` : '';
          
          report += `- ${variant.id}${usageInfo}\n`;
        });
        report += '\n';
      }
      
      if (family.hasTypeDefinition) {
        report += '**Type System:**\n';
        report += `- Separate type definition: Yes (${family.typeFiles.join(', ')})\n`;
        
        if (family.typePatterns) {
          if (family.typePatterns.hasBaseInterface) {
            report += '- Base interface pattern: Yes\n';
          }
          
          if (family.typePatterns.hasExtendedInterfaces) {
            report += '- Extended interfaces pattern: Yes\n';
          }
          
          if (family.typePatterns.hasDiscriminatedUnion) {
            report += '- Discriminated union pattern: Yes\n';
          }
          
          if (family.typePatterns.hasTypeGuards) {
            report += '- Type guards: Yes\n';
          }
        }
      } else if (family.inlineTypes) {
        report += '**Type System:**\n';
        report += '- Inline types: Yes\n';
        report += `- Number of inline types: ${family.inlineTypes.reduce((sum, comp) => sum + comp.types.length, 0)}\n`;
      } else {
        report += '**Type System:** No type definitions found\n';
      }
      
      report += '\n';
    });
  
  // Most used components section
  report += '## Most Used Components\n\n';
  report += '| Component | Used By | Uses |\n';
  report += '|-----------|---------|------|\n';
  
  usagePatterns.sortedByUsage.slice(0, 20).forEach(usage => {
    report += `| ${usage.component} | ${usage.incomingDeps} | ${usage.outgoingDeps} |\n`;
  });
  
  fs.writeFileSync('analysis/errors/component-families.md', report);
  console.log('Generated component family report');
}

// Generate centralized type recommendations
function generateTypeRecommendations(families) {
  let report = '# TypeScript Type System Recommendations\n\n';
  
  report += 'Based on the analysis of component families, here are recommendations for standardizing the type system:\n\n';
  
  // Count existing patterns
  const patternCounts = {
    discriminatedUnions: 0,
    baseInterfaces: 0,
    extendedInterfaces: 0,
    typeGuards: 0,
    inlineTypes: 0
  };
  
  Object.values(families).forEach(family => {
    if (family.typePatterns) {
      if (family.typePatterns.hasDiscriminatedUnion) patternCounts.discriminatedUnions++;
      if (family.typePatterns.hasBaseInterface) patternCounts.baseInterfaces++;
      if (family.typePatterns.hasExtendedInterfaces) patternCounts.extendedInterfaces++;
      if (family.typePatterns.hasTypeGuards) patternCounts.typeGuards++;
    }
    
    if (family.inlineTypes) patternCounts.inlineTypes++;
  });
  
  // Generate recommendations
  report += '## 1. Type Organization Pattern\n\n';
  
  // Recommend central vs. distributed type organization
  if (patternCounts.inlineTypes > patternCounts.baseInterfaces) {
    report += '**Recommendation:** Move inline types to centralized type files\n\n';
    report += 'Many components are currently using inline type definitions. For consistency and reusability, these should be moved to separate type files.\n\n';
  } else {
    report += '**Recommendation:** Continue using separate type files for component families\n\n';
    report += 'The current pattern of using separate type files is good and should be continued for all component families.\n\n';
  }
  
  // Recommend base interface pattern
  report += '## 2. Interface Architecture\n\n';
  
  if (patternCounts.baseInterfaces > 0) {
    report += '**Recommendation:** Standardize on Base Interface + Extension pattern\n\n';
    report += 'Several component families are already using a base interface pattern. This should be standardized across all component families:\n\n';
    report += '```typescript\n';
    report += 'interface BaseButtonProps {\n';
    report += '  className?: string;\n';
    report += '  disabled?: boolean;\n';
    report += '  children: React.ReactNode;\n';
    report += '}\n\n';
    report += 'interface PrimaryButtonProps extends BaseButtonProps {\n';
    report += '  variant: "primary";\n';
    report += '  onClick: (event: ButtonClickEvent) => void;\n';
    report += '}\n\n';
    report += 'interface SecondaryButtonProps extends BaseButtonProps {\n';
    report += '  variant: "secondary";\n';
    report += '  onClick?: (event: ButtonClickEvent) => void;\n';
    report += '}\n\n';
    report += 'type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;\n';
    report += '```\n\n';
  }
  
  // Recommend discriminated unions
  report += '## 3. Variant Handling\n\n';
  
  if (patternCounts.discriminatedUnions > 0) {
    report += '**Recommendation:** Use discriminated unions for component variants\n\n';
    report += 'Several component families are using discriminated unions for variant handling. This pattern should be applied to all component families with variants:\n\n';
  } else {
    report += '**Recommendation:** Implement discriminated unions for component variants\n\n';
    report += 'Currently, few component families use proper discriminated unions. Implementing this pattern will improve type safety:\n\n';
  }
  
  report += '```typescript\n';
  report += 'type CardProps = ContentCardProps | ProfileCardProps | MediaCardProps;\n\n';
  report += '// Type guard for content card\n';
  report += 'function isContentCard(props: CardProps): props is ContentCardProps {\n';
  report += '  return props.variant === "content";\n';
  report += '}\n';
  report += '```\n\n';
  
  // Event handler recommendations
  report += '## 4. Event Handler Types\n\n';
  
  report += '**Recommendation:** Create centralized event type definitions\n\n';
  report += 'Event handler types should be defined in a central location (`src/types/events.ts`) and imported where needed:\n\n';
  report += '```typescript\n';
  report += '// In src/types/events.ts\n';
  report += 'export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;\n';
  report += 'export type ButtonClickHandler = (event: ButtonClickEvent) => void;\n\n';
  report += 'export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;\n';
  report += 'export type InputChangeHandler = (event: InputChangeEvent) => void;\n';
  report += '```\n\n';
  
  fs.writeFileSync('analysis/errors/type-recommendations.md', report);
  console.log('Generated type system recommendations');
}

// Main execution function
function runComponentFamilyAnalysis() {
  // Load component data
  const { components, dependencies } = loadComponentData();
  
  // Analyze component structure
  const families = analyzeComponentStructure(components);
  
  // Analyze component usage
  const usagePatterns = analyzeComponentUsage(components, dependencies);
  
  // Save analysis results
  const analysisResults = {
    families,
    usagePatterns
  };
  
  fs.writeFileSync(
    'analysis/errors/component-family-analysis.json',
    JSON.stringify(analysisResults, null, 2)
  );
  
  // Generate reports
  generateComponentFamilyReport(families, usagePatterns);
  generateTypeRecommendations(families);
  
  console.log('Component family analysis complete');
}

// Run the analysis
runComponentFamilyAnalysis(); 