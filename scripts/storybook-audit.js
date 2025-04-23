#!/usr/bin/env node

/**
 * Storybook Component Coverage Audit
 * 
 * This script analyzes the codebase to identify components without corresponding
 * Storybook stories and produces a report with recommendations.
 * 
 * Usage: npm run storybook:audit
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const COMPONENT_PATTERNS = [
    'src/**/*.tsx',
    'src/**/*.jsx',
];
const EXCLUDE_PATTERNS = [
    'src/**/*.stories.tsx',
    'src/**/*.stories.jsx',
    'src/**/*.test.tsx',
    'src/**/*.test.jsx',
    'src/**/*.spec.tsx',
    'src/**/*.spec.jsx',
    'src/**/index.tsx',
    'src/**/index.jsx',
];

/**
 * Finds all component files in the codebase
 */
function findComponentFiles() {
    let allFiles = [];

    COMPONENT_PATTERNS.forEach(pattern => {
        const files = glob.sync(pattern, { cwd: path.resolve(__dirname, '..') });
        allFiles = allFiles.concat(files);
    });

    // Filter out excluded files
    EXCLUDE_PATTERNS.forEach(pattern => {
        const excludedFiles = glob.sync(pattern, { cwd: path.resolve(__dirname, '..') });
        allFiles = allFiles.filter(file => !excludedFiles.includes(file));
    });

    // Additionally filter out any files with .stories. in their name
    allFiles = allFiles.filter(file => !file.includes('.stories.'));

    return allFiles;
}

/**
 * Finds all story files in the codebase
 */
function findStoryFiles() {
    return glob.sync('src/**/*.stories.{tsx,jsx}', { cwd: path.resolve(__dirname, '..') });
}

/**
 * Extracts component name from a file path
 */
function getComponentName(filePath) {
    const fileName = path.basename(filePath, path.extname(filePath));
    return fileName;
}

/**
 * Checks if a component has a corresponding story
 */
function hasStory(componentPath, storyFiles) {
    const componentDir = path.dirname(componentPath);
    const componentName = getComponentName(componentPath);
    const storyPath = path.join(componentDir, `${componentName}.stories.tsx`);
    const storyPathJsx = path.join(componentDir, `${componentName}.stories.jsx`);

    return storyFiles.includes(storyPath) || storyFiles.includes(storyPathJsx);
}

/**
 * Extracts component display name from file path
 */
function getDisplayName(filePath) {
    const relativePath = path.relative(SRC_DIR, filePath);
    return path.join(path.dirname(relativePath), path.basename(filePath, path.extname(filePath)));
}

/**
 * Print audit report to console
 */
function printReport(components, storiesCount) {
    const total = components.length;
    const missing = components.filter(c => !c.hasStory);
    const covered = total - missing.length;
    const coverage = Math.round((covered / total) * 100);

    console.log('\n\n📊 STORYBOOK COMPONENT COVERAGE AUDIT\n');
    console.log(`Total Components: ${total}`);
    console.log(`Components with Stories: ${covered}`);
    console.log(`Components Missing Stories: ${missing.length}`);
    console.log(`Coverage: ${coverage}%\n`);

    if (missing.length > 0) {
        console.log('Components Missing Stories:\n');

        missing.forEach(component => {
            console.log(`- ${component.name} (${component.displayName})`);
        });

        console.log('\nRecommended Next Steps:\n');
        console.log('1. Create stories for the components listed above');
        console.log('2. Ensure each story covers default state, variants, and edge cases');
        console.log('3. Run this audit again to verify improved coverage');
    } else {
        console.log('🎉 Congratulations! All components have corresponding stories.');
    }
}

/**
 * Main function
 */
function main() {
    try {
        const componentFiles = findComponentFiles();
        const storyFiles = findStoryFiles();

        const components = componentFiles.map(file => {
            const componentName = getComponentName(file);
            const displayName = getDisplayName(file);
            return {
                path: file,
                name: componentName,
                displayName: displayName,
                hasStory: hasStory(file, storyFiles)
            };
        });

        printReport(components, storyFiles.length);
    } catch (error) {
        console.error('Error running audit:', error);
    }
}

// Run the script
main(); 