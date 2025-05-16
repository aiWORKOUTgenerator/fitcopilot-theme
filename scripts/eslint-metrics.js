#!/usr/bin/env node
/**
 * ESLint Metrics Generator
 * 
 * Generates metrics about ESLint warnings for CI/CD integration.
 * This script analyzes all TypeScript files and categorizes warnings
 * to track progress in eliminating 'any' types and other issues.
 */

const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');

async function generateMetrics() {
    console.log('Generating ESLint metrics...');

    // Initialize ESLint
    const eslint = new ESLint();
    const results = await eslint.lintFiles(['src/**/*.{ts,tsx}']);

    // Initialize metrics object
    const metrics = {
        timestamp: new Date().toISOString(),
        summary: {
            total: 0,
            anyType: 0,
            unusedVars: 0,
            consoleStatements: 0,
            otherWarnings: 0
        },
        byDirectory: {},
        byFile: {},
        byRule: {}
    };

    // Process results
    results.forEach(result => {
        const filePath = result.filePath;
        const relativePath = path.relative(process.cwd(), filePath);
        const directory = relativePath.split(path.sep)[1] || 'root'; // Get top-level directory in src/

        // Skip files with no warnings
        if (result.messages.length === 0) {
            return;
        }

        // Initialize directory metrics if needed
        if (!metrics.byDirectory[directory]) {
            metrics.byDirectory[directory] = { total: 0, anyType: 0, unusedVars: 0, consoleStatements: 0, otherWarnings: 0 };
        }

        // Initialize file metrics
        metrics.byFile[relativePath] = { total: 0, rules: {} };

        // Process each warning message
        result.messages.forEach(msg => {
            // Skip if there's no rule ID (these are usually parsing errors)
            if (!msg.ruleId) {
                return;
            }

            // Update total count
            metrics.summary.total++;
            metrics.byDirectory[directory].total++;
            metrics.byFile[relativePath].total++;

            // Initialize rule count if needed
            if (!metrics.byRule[msg.ruleId]) {
                metrics.byRule[msg.ruleId] = 0;
            }
            if (!metrics.byFile[relativePath].rules[msg.ruleId]) {
                metrics.byFile[relativePath].rules[msg.ruleId] = 0;
            }

            // Update rule counts
            metrics.byRule[msg.ruleId]++;
            metrics.byFile[relativePath].rules[msg.ruleId]++;

            // Update specific rule categories
            if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
                metrics.summary.anyType++;
                metrics.byDirectory[directory].anyType++;
            } else if (msg.ruleId === '@typescript-eslint/no-unused-vars') {
                metrics.summary.unusedVars++;
                metrics.byDirectory[directory].unusedVars++;
            } else if (msg.ruleId === 'no-console') {
                metrics.summary.consoleStatements++;
                metrics.byDirectory[directory].consoleStatements++;
            } else {
                metrics.summary.otherWarnings++;
                metrics.byDirectory[directory].otherWarnings++;
            }
        });
    });

    // Output directory with the most warnings (helpful for prioritization)
    const sortedDirectories = Object.entries(metrics.byDirectory)
        .sort((a, b) => b[1].total - a[1].total);

    // Get files with the most 'any' types
    const anyTypeFiles = Object.entries(metrics.byFile)
        .filter(([_, data]) => data.rules['@typescript-eslint/no-explicit-any'] > 0)
        .sort((a, b) => {
            const countA = a[1].rules['@typescript-eslint/no-explicit-any'] || 0;
            const countB = b[1].rules['@typescript-eslint/no-explicit-any'] || 0;
            return countB - countA;
        })
        .slice(0, 10)
        .map(([file, data]) => ({
            file,
            count: data.rules['@typescript-eslint/no-explicit-any'] || 0
        }));

    // Add top offenders to metrics
    metrics.topOffenders = {
        directories: sortedDirectories.slice(0, 5).map(([dir, data]) => ({ directory: dir, warnings: data.total })),
        anyTypeFiles: anyTypeFiles
    };

    // Write metrics to file
    const outputPath = './eslint-metrics.json';
    fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2));

    // Log summary to console
    console.log(`ESLint Metrics Summary:`);
    console.log(`- Total warnings: ${metrics.summary.total}`);
    console.log(`- 'any' type warnings: ${metrics.summary.anyType}`);
    console.log(`- Unused variables: ${metrics.summary.unusedVars}`);
    console.log(`- Console statements: ${metrics.summary.consoleStatements}`);
    console.log(`- Other warnings: ${metrics.summary.otherWarnings}`);
    console.log(`Metrics written to ${outputPath}`);

    return metrics;
}

// Run metrics generation
generateMetrics().catch(error => {
    console.error('Error generating ESLint metrics:', error);
    process.exitCode = 1;
}); 