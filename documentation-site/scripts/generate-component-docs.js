#!/usr/bin/env node

/**
 * Component Documentation Generator
 * 
 * This script scans the source code for React components and generates
 * documentation markdown files based on JSDoc comments and TypeScript interfaces.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const prettier = require('prettier');
const doctrine = require('doctrine');
const ts = require('typescript');

// Configuration
const SOURCE_DIR = path.resolve(__dirname, '../../src');
const OUTPUT_DIR = path.resolve(__dirname, '../components');
const FEATURES_DIR = path.join(SOURCE_DIR, 'features');
const COMPONENTS_DIR = path.join(SOURCE_DIR, 'components');

// Create necessary directories
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDirectoryExists(OUTPUT_DIR);

// Helper function to extract JSDoc comments
const extractJSDocComment = (fileContent, componentName) => {
    const regex = new RegExp(`\\/\\*\\*[\\s\\S]*?\\*\\/[\\s\\n]*export const ${componentName}`);
    const match = fileContent.match(regex);

    if (match && match[0]) {
        const jsDocMatch = match[0].match(/\/\*\*([\s\S]*?)\*\//);
        if (jsDocMatch && jsDocMatch[1]) {
            return doctrine.parse(jsDocMatch[1], { unwrap: true });
        }
    }

    return null;
};

// Helper function to extract TypeScript interface for props
const extractPropsInterface = (fileContent, componentName) => {
    // This is a simplified approach - for a robust solution you'd want to use TypeScript's compiler API
    const regex = new RegExp(`export interface ${componentName}Props[\\s\\S]*?\\}`);
    const match = fileContent.match(regex);

    if (match && match[0]) {
        return match[0];
    }

    return null;
};

// Generate documentation for a component file
const generateComponentDoc = (componentFile) => {
    const fileContent = fs.readFileSync(componentFile, 'utf8');
    const fileName = path.basename(componentFile, path.extname(componentFile));

    // Extract component name (assuming it matches file name)
    const componentName = fileName;

    // Extract JSDoc comment for the component
    const jsDocComment = extractJSDocComment(fileContent, componentName);

    // Extract props interface
    const propsInterface = extractPropsInterface(fileContent, componentName);

    // Determine component category
    let category = 'ui';
    if (componentFile.includes('/features/')) {
        category = 'features';
    } else if (componentFile.includes('/Layout/')) {
        category = 'layout';
    }

    // Determine relative path from src directory
    const relativePath = path.relative(SOURCE_DIR, componentFile);

    // Create markdown content
    let markdown = `---
sidebar_position: 1
---

# ${componentName}

${jsDocComment ? jsDocComment.description : 'No description available'}

## Import

\`\`\`tsx
import { ${componentName} } from '${relativePath.replace('.tsx', '')}';
\`\`\`

## Props

${propsInterface ? `\`\`\`tsx
${propsInterface}
\`\`\`` : 'This component does not accept any props.'}

## Usage

\`\`\`tsx
import React from 'react';
import { ${componentName} } from '${relativePath.replace('.tsx', '')}';

const Example = () => (
  <${componentName} />
);
\`\`\`

## Storybook

View this component in Storybook for interactive examples and additional documentation.
`;

    // Format markdown with prettier
    return prettier.format(markdown, { parser: 'markdown' });
};

// Generate documentation for all components
const generateAllDocs = () => {
    // Find all component files
    const featureComponents = glob.sync(`${FEATURES_DIR}/**/*.tsx`);
    const uiComponents = glob.sync(`${COMPONENTS_DIR}/**/*.tsx`);
    const allComponents = [...featureComponents, ...uiComponents];

    // Generate docs for each component
    allComponents.forEach(componentFile => {
        try {
            const fileName = path.basename(componentFile, path.extname(componentFile));

            // Skip non-component files
            if (fileName.includes('.test') || fileName.includes('.stories') || fileName === 'index') {
                return;
            }

            // Determine output directory based on component location
            let outputSubDir = '';
            if (componentFile.includes('/features/')) {
                const featureMatch = componentFile.match(/\/features\/([^/]+)/);
                if (featureMatch && featureMatch[1]) {
                    outputSubDir = path.join('features', featureMatch[1].toLowerCase());
                }
            } else if (componentFile.includes('/Layout/')) {
                outputSubDir = 'layout';
            } else {
                outputSubDir = 'ui';
            }

            const outputDir = path.join(OUTPUT_DIR, outputSubDir);
            ensureDirectoryExists(outputDir);

            // Generate and write markdown
            const markdown = generateComponentDoc(componentFile);
            const outputFile = path.join(outputDir, `${fileName}.md`);
            fs.writeFileSync(outputFile, markdown);

            console.log(`Generated documentation for ${fileName}`);
        } catch (error) {
            console.error(`Error generating docs for ${componentFile}:`, error);
        }
    });
};

// Run the generator
generateAllDocs(); 