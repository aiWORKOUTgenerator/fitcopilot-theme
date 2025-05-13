#!/usr/bin/env node

/**
 * ESLint Warning Analysis Script
 * 
 * This script analyzes the codebase for ESLint warnings related to the no-explicit-any rule.
 * It generates a report on the progress made in reducing these warnings and identifies
 * remaining files that need attention.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk') || { green: (s) => s, red: (s) => s, blue: (s) => s, yellow: (s) => s };

// Configuration
const sourceDir = path.resolve(__dirname, '../src');
const baselineWarningCount = 156; // Initial count before remediation began

// Utility functions
function countOccurrences(content, pattern) {
    const regex = new RegExp(pattern, 'g');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
}

function formatPercentage(value) {
    return `${Math.round(value * 100)}%`;
}

// Find any type usage in the codebase
function analyzeAnyUsage() {
    console.log(chalk.blue('Analyzing any type usage in the codebase...'));

    const results = {
        totalFiles: 0,
        filesWithAny: 0,
        totalAnyUsage: 0,
        byType: {
            variables: 0,
            parameters: 0,
            returnTypes: 0,
            generics: 0,
            typeCasts: 0,
        },
        byDirectory: {},
    };

    function scanDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                scanDir(fullPath);
            } else if (/\.(ts|tsx)$/.test(entry.name)) {
                results.totalFiles++;

                const content = fs.readFileSync(fullPath, 'utf-8');

                // Count any usage
                const anyUsage = countOccurrences(content, /\bany\b/g);

                if (anyUsage > 0) {
                    results.filesWithAny++;
                    results.totalAnyUsage += anyUsage;

                    // Track by directory
                    const relativePath = path.relative(sourceDir, dir);
                    const dirKey = relativePath || 'root';

                    if (!results.byDirectory[dirKey]) {
                        results.byDirectory[dirKey] = {
                            files: 0,
                            anyUsage: 0,
                        };
                    }

                    results.byDirectory[dirKey].files++;
                    results.byDirectory[dirKey].anyUsage += anyUsage;

                    // Track by type
                    if (countOccurrences(content, /: any\b/g)) {
                        results.byType.variables += countOccurrences(content, /: any\b/g);
                    }

                    if (countOccurrences(content, /\(\w+: any\b/g)) {
                        results.byType.parameters += countOccurrences(content, /\(\w+: any\b/g);
                    }

                    if (countOccurrences(content, /\): any\b/g)) {
                        results.byType.returnTypes += countOccurrences(content, /\): any\b/g);
                    }

                    if (countOccurrences(content, /<any>/g)) {
                        results.byType.generics += countOccurrences(content, /<any>/g);
                    }

                    if (countOccurrences(content, /as any\b/g)) {
                        results.byType.typeCasts += countOccurrences(content, /as any\b/g);
                    }
                }
            }
        }
    }

    scanDir(sourceDir);
    return results;
}

// Generate the report
function generateReport(results) {
    const reductionPercentage = 1 - (results.totalAnyUsage / baselineWarningCount);

    console.log('\n' + chalk.blue('===== ESLint Warning Remediation Progress Report ====='));
    console.log(chalk.blue(`Total TypeScript files: ${results.totalFiles}`));
    console.log(chalk.blue(`Files with 'any' type: ${results.filesWithAny} (${formatPercentage(results.filesWithAny / results.totalFiles)})`));
    console.log(chalk.blue(`Total 'any' type usage: ${results.totalAnyUsage}`));
    console.log(chalk.blue(`Reduction from baseline: ${baselineWarningCount - results.totalAnyUsage} (${formatPercentage(reductionPercentage)})`));

    console.log('\n' + chalk.blue('===== Usage by Type ====='));
    console.log(chalk.blue(`Variables: ${results.byType.variables}`));
    console.log(chalk.blue(`Parameters: ${results.byType.parameters}`));
    console.log(chalk.blue(`Return types: ${results.byType.returnTypes}`));
    console.log(chalk.blue(`Generics: ${results.byType.generics}`));
    console.log(chalk.blue(`Type casts: ${results.byType.typeCasts}`));

    console.log('\n' + chalk.blue('===== Top Directories with 'any' Usage ====='));

    const sortedDirs = Object.entries(results.byDirectory)
        .sort((a, b) => b[1].anyUsage - a[1].anyUsage)
        .slice(0, 10);

    sortedDirs.forEach(([dir, stats]) => {
        console.log(chalk.blue(`${dir}: ${stats.anyUsage} occurrences in ${stats.files} files`));
    });

    console.log('\n' + chalk.blue('===== Remediation Status ====='));
    if (reductionPercentage >= 0.5) {
        console.log(chalk.green(`✓ Target Achieved: ${formatPercentage(reductionPercentage)} reduction (target: 50%)`));
    } else {
        console.log(chalk.red(`✗ Target Not Met: ${formatPercentage(reductionPercentage)} reduction (target: 50%)`));
    }

    const remainingBudget = baselineWarningCount * 0.5 - (baselineWarningCount - results.totalAnyUsage);

    if (remainingBudget > 0) {
        console.log(chalk.red(`${Math.ceil(remainingBudget)} more 'any' occurrences need to be fixed to reach the 50% target`));
    } else {
        console.log(chalk.green(`Exceeded target by ${Math.abs(Math.floor(remainingBudget))} occurrences`));
    }
}

// Main execution
const results = analyzeAnyUsage();
generateReport(results); 