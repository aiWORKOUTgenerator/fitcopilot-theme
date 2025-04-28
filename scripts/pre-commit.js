#!/usr/bin/env node

/**
 * Pre-commit hook script for the FitCopilot theme
 * This script performs basic linting and validation checks before allowing a commit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get staged files
const getStagedFiles = () => {
    try {
        const output = execSync('git diff --cached --name-only --diff-filter=ACMR').toString();
        return output.split('\n').filter(file => file.trim() !== '');
    } catch (error) {
        console.error('Error getting staged files:', error);
        process.exit(1);
    }
};

// Run TypeScript checks on TS/TSX files
const checkTypeScript = (files) => {
    const tsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

    if (tsFiles.length === 0) return;

    try {
        console.log('Running TypeScript checks...');
        execSync('npx tsc --noEmit', { stdio: 'inherit' });
        console.log('✅ TypeScript checks passed');
    } catch (error) {
        console.error('❌ TypeScript errors found');
        process.exit(1);
    }
};

// Run ESLint on JS/TS files
const lintFiles = (files) => {
    const jsFiles = files.filter(file =>
        file.endsWith('.js') ||
        file.endsWith('.jsx') ||
        file.endsWith('.ts') ||
        file.endsWith('.tsx')
    );

    if (jsFiles.length === 0) return;

    try {
        console.log('Running ESLint...');
        execSync(`npx eslint ${jsFiles.join(' ')}`, { stdio: 'inherit' });
        console.log('✅ ESLint checks passed');
    } catch (error) {
        console.error('❌ ESLint errors found');
        process.exit(1);
    }
};

// Check SCSS files
const lintStyles = (files) => {
    const scssFiles = files.filter(file => file.endsWith('.scss'));

    if (scssFiles.length === 0) return;

    try {
        console.log('Running stylelint...');
        execSync(`npx stylelint ${scssFiles.join(' ')}`, { stdio: 'inherit' });
        console.log('✅ Stylelint checks passed');
    } catch (error) {
        console.error('❌ Stylelint errors found');
        process.exit(1);
    }
};

// Main function
const main = () => {
    const stagedFiles = getStagedFiles();

    if (stagedFiles.length === 0) {
        console.log('No files to check');
        process.exit(0);
    }

    console.log(`Running pre-commit checks on ${stagedFiles.length} files...`);

    checkTypeScript(stagedFiles);
    lintFiles(stagedFiles);
    lintStyles(stagedFiles);

    console.log('✅ All checks passed!');
};

// Execute the script
main(); 