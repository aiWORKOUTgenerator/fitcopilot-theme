#!/usr/bin/env node

/**
 * Component Type Pattern Generator
 * 
 * This script generates React component files following our standardized type patterns.
 * It creates:
 * - Component implementation file
 * - Type definitions file
 * - Type guards file
 * 
 * Usage:
 * node scripts/generate-type-patterns.js --component=Button --variants=primary,secondary,text --discriminator=variant
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key.replace(/^--/, '')] = value;
    return acc;
}, {});

// Required arguments
const componentName = args.component;
const variants = (args.variants || '').split(',');
const discriminator = args.discriminator || 'variant';

// Validate required arguments
if (!componentName) {
    console.error('Error: --component argument is required');
    process.exit(1);
}

if (!variants || variants.length < 2 || variants.some(v => !v)) {
    console.error('Error: --variants argument must contain at least two valid variants (comma-separated)');
    process.exit(1);
}

// Format names for template
const ComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
const componentFileName = componentName.toLowerCase();
const variantA = variants[0];
const variantB = variants[1];
const VariantA = variantA.charAt(0).toUpperCase() + variantA.slice(1);
const VariantB = variantB.charAt(0).toUpperCase() + variantB.slice(1);

// Paths for output files
const componentsDir = path.resolve(__dirname, '../src/features/shared', ComponentName);
const typesDir = path.resolve(__dirname, '../src/types');
const typeGuardsDir = path.resolve(__dirname, '../src/utils/typeGuards');

// Create directories if they don't exist
if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

if (!fs.existsSync(typeGuardsDir)) {
    fs.mkdirSync(typeGuardsDir, { recursive: true });
}

// Read template files
const componentTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/component.tsx.template'), 'utf8');
const typesTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/types.ts.template'), 'utf8');
const typeGuardsTemplate = fs.readFileSync(path.resolve(__dirname, 'templates/typeGuards.ts.template'), 'utf8');

// Replace template placeholders
const fillTemplate = (template) => {
    return template
        .replace(/\{\{ComponentName\}\}/g, ComponentName)
        .replace(/\{\{componentName\}\}/g, componentFileName)
        .replace(/\{\{component-name\}\}/g, componentFileName.replace(/([A-Z])/g, '-$1').toLowerCase())
        .replace(/\{\{VariantA\}\}/g, VariantA)
        .replace(/\{\{VariantB\}\}/g, VariantB)
        .replace(/\{\{variantA\}\}/g, variantA)
        .replace(/\{\{variantB\}\}/g, variantB)
        .replace(/\{\{variant-a\}\}/g, variantA.replace(/([A-Z])/g, '-$1').toLowerCase())
        .replace(/\{\{variant-b\}\}/g, variantB.replace(/([A-Z])/g, '-$1').toLowerCase())
        .replace(/\{\{discriminator\}\}/g, discriminator)
        .replace(/\{\{variantAProperty\}\}/g, `${variantA}Prop`)
        .replace(/\{\{variantBProperty\}\}/g, `${variantB}Prop`);
};

// Generate component files
const componentContent = fillTemplate(componentTemplate);
const typesContent = fillTemplate(typesTemplate);
const typeGuardsContent = fillTemplate(typeGuardsTemplate);

// Write files
fs.writeFileSync(path.join(componentsDir, `${ComponentName}.tsx`), componentContent);
fs.writeFileSync(path.join(typesDir, `${componentFileName}.ts`), typesContent);
fs.writeFileSync(path.join(typeGuardsDir, `${componentFileName}TypeGuards.ts`), typeGuardsContent);

// Create empty SCSS file
fs.writeFileSync(path.join(componentsDir, `${componentFileName}.scss`), `// Styles for the ${ComponentName} component\n\n.${componentFileName} {\n  // Base styles\n\n  // Variants\n  &--${variantA} {\n    // ${variantA} specific styles\n  }\n\n  &--${variantB} {\n    // ${variantB} specific styles\n  }\n}\n`);

// Create index file
fs.writeFileSync(path.join(componentsDir, 'index.ts'), `export * from './${ComponentName}';\nexport { default } from './${ComponentName}';\n`);

// Update events.ts with new event handler types
const eventsPath = path.join(typesDir, 'events.ts');
if (fs.existsSync(eventsPath)) {
    let eventsContent = fs.readFileSync(eventsPath, 'utf8');

    // Check if the handler already exists
    if (!eventsContent.includes(`${ComponentName}ClickHandler`)) {
        // Add new handler type at the end of the file, before the last closing comment
        const newHandlerType = `/**\n * ${ComponentName} event handler types\n */\nexport type ${ComponentName}ClickHandler = (event: React.MouseEvent<HTMLDivElement>) => void;\n`;

        // Insert before the last export
        const lastExportIndex = eventsContent.lastIndexOf('export type');
        if (lastExportIndex !== -1) {
            eventsContent = eventsContent.slice(0, lastExportIndex) +
                newHandlerType + '\n' +
                eventsContent.slice(lastExportIndex);
            fs.writeFileSync(eventsPath, eventsContent);
        }
    }
}

console.log(`
Successfully generated ${ComponentName} component files:
- ${path.join(componentsDir, `${ComponentName}.tsx`)}
- ${path.join(typesDir, `${componentFileName}.ts`)}
- ${path.join(typeGuardsDir, `${componentFileName}TypeGuards.ts`)}
- ${path.join(componentsDir, `${componentFileName}.scss`)}
- ${path.join(componentsDir, 'index.ts')}

Next steps:
1. Review the generated files and customize as needed
2. Implement the component-specific rendering logic
3. Add any additional variants or properties
`); 