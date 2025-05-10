#!/usr/bin/env node

/**
 * Sass Color Audit Script
 * 
 * This script identifies deprecated Sass color functions in your codebase
 * and reports locations where they need to be updated.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Improved implementation of getChalk to handle different module formats
function getChalk() {
    // Basic coloring functions if chalk is not available
    const basicColors = {
        blue: (text) => `\x1b[34m${text}\x1b[0m`,
        green: (text) => `\x1b[32m${text}\x1b[0m`,
        yellow: (text) => `\x1b[33m${text}\x1b[0m`,
        red: (text) => `\x1b[31m${text}\x1b[0m`,
        cyan: (text) => `\x1b[36m${text}\x1b[0m`
    };

    try {
        // Try to use CommonJS require
        const chalk = require('chalk');
        // Make sure the loaded chalk actually has the expected functions
        if (typeof chalk.blue === 'function') {
            return chalk;
        }
        // If it's chalk but doesn't have the expected API, it might be ESM version
        return basicColors;
    } catch (e) {
        // Return basic coloring functions if chalk is not available
        return basicColors;
    }
}

const chalk = getChalk();
const SRC_DIR = path.resolve(__dirname, '../src');
const REPORT_FILE = path.resolve(__dirname, '../sass-color-report.json');

// Deprecated functions to search for
const DEPRECATED_FUNCTIONS = [
    { name: 'darken', pattern: /darken\s*\(\s*\$[\w-]+\s*,\s*[\d.]+%?\s*\)/g, replacement: 'color-utils.darken-safe' },
    { name: 'lighten', pattern: /lighten\s*\(\s*\$[\w-]+\s*,\s*[\d.]+%?\s*\)/g, replacement: 'color-utils.lighten-safe' },
    { name: 'saturate', pattern: /saturate\s*\(\s*\$[\w-]+\s*,\s*[\d.]+%?\s*\)/g, replacement: 'color-utils.adjust-saturation with positive value' },
    { name: 'desaturate', pattern: /desaturate\s*\(\s*\$[\w-]+\s*,\s*[\d.]+%?\s*\)/g, replacement: 'color-utils.adjust-saturation with negative value' }
];

// Function to find all SCSS files
function findScssFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            results = results.concat(findScssFiles(fullPath));
        } else if (file.name.endsWith('.scss')) {
            results.push(fullPath);
        }
    }

    return results;
}

// Function to analyze a file for deprecated functions
function analyzeFile(filePath) {
    const relPath = path.relative(SRC_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const results = [];

    for (const func of DEPRECATED_FUNCTIONS) {
        const matches = [...content.matchAll(func.pattern)];

        for (const match of matches) {
            // Get line number by counting new lines up to match index
            const lineNumber = content.substring(0, match.index).split('\n').length;

            results.push({
                function: func.name,
                usage: match[0],
                replacement: func.replacement,
                line: lineNumber,
                file: relPath
            });
        }
    }

    return results;
}

// Main execution
console.log(chalk.blue('Scanning for deprecated Sass color functions...'));

// Find all SCSS files
const scssFiles = findScssFiles(SRC_DIR);
console.log(chalk.green(`Found ${scssFiles.length} SCSS files to analyze.`));

// Analyze each file
let allResults = [];
for (const file of scssFiles) {
    const fileResults = analyzeFile(file);
    allResults = allResults.concat(fileResults);
}

// Group results by file
const resultsByFile = {};
for (const result of allResults) {
    if (!resultsByFile[result.file]) {
        resultsByFile[result.file] = [];
    }
    resultsByFile[result.file].push(result);
}

// Print summary
console.log(chalk.yellow(`\nFound ${allResults.length} usages of deprecated color functions across ${Object.keys(resultsByFile).length} files.\n`));

// Print detailed report
if (allResults.length > 0) {
    console.log(chalk.yellow('Detailed Report:'));

    for (const [file, results] of Object.entries(resultsByFile)) {
        console.log(chalk.cyan(`\nFile: ${file} (${results.length} occurrences)`));

        for (const result of results) {
            console.log(`  Line ${result.line}: ${chalk.red(result.usage)} -> ${chalk.green(result.replacement)}`);
        }
    }

    // Group by function name for summary
    const functionCounts = {};
    for (const result of allResults) {
        functionCounts[result.function] = (functionCounts[result.function] || 0) + 1;
    }

    console.log(chalk.yellow('\nSummary by Function:'));
    for (const [func, count] of Object.entries(functionCounts)) {
        console.log(`  ${chalk.red(func)}: ${count} occurrences`);
    }
}

// Save results to JSON file
fs.writeFileSync(
    REPORT_FILE,
    JSON.stringify({
        totalOccurrences: allResults.length,
        totalFiles: Object.keys(resultsByFile).length,
        byFunction: allResults.reduce((acc, curr) => {
            acc[curr.function] = (acc[curr.function] || 0) + 1;
            return acc;
        }, {}),
        details: resultsByFile
    }, null, 2)
);

console.log(chalk.blue(`\nFull report saved to ${REPORT_FILE}`));

// Provide command for running the replacer script
console.log(chalk.green('\nNext Steps:'));
console.log('1. Review the report to understand the scope of changes');
console.log('2. Update the codebase with new color utility functions');
console.log('3. Run this script again to verify all instances have been updated');

// Exit with error code if deprecated functions found
process.exit(allResults.length > 0 ? 1 : 0); 