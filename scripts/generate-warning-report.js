#!/usr/bin/env node

/**
 * ESLint Warning Report Generator
 * 
 * This script analyzes the codebase for ESLint warnings and generates a detailed report
 * to help track progress in eliminating warnings.
 * 
 * Usage:
 * node scripts/generate-warning-report.js [--summary] [--detailed] [--output=filename]
 * 
 * Options:
 *   --summary     Only show summary counts (default: false)
 *   --detailed    Show detailed warning information with code snippets (default: false)
 *   --output      Specify output file (default: eslint-warnings-report.json)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.replace('--', '').split('=');
        acc[key] = value || true;
    }
    return acc;
}, {});

// Output configuration
const outputFilename = args.output || 'eslint-warnings-report.json';
const summaryOnly = args.summary === true;
const detailedReport = args.detailed === true;

console.log('Generating ESLint warning report...');

// Run ESLint with JSON format to get structured output
try {
    const eslintCommand = 'npx eslint "src/**/*.{ts,tsx}" --format json';
    const eslintOutput = execSync(eslintCommand, { encoding: 'utf8' });
    const eslintResults = JSON.parse(eslintOutput);

    // Process results
    const warnings = [];
    let totalWarnings = 0;
    const ruleWarnings = {};
    const fileWarnings = {};
    const directoryWarnings = {};

    eslintResults.forEach(result => {
        const filePath = result.filePath;
        const relativeFilePath = path.relative(process.cwd(), filePath);
        const directory = path.dirname(relativeFilePath);

        // Count directory warnings
        directoryWarnings[directory] = (directoryWarnings[directory] || 0) + result.warningCount;

        // Process individual warnings
        result.messages.forEach(message => {
            if (message.severity === 1) { // Warning severity
                totalWarnings++;

                // Count rule warnings
                ruleWarnings[message.ruleId] = (ruleWarnings[message.ruleId] || 0) + 1;

                // Count file warnings
                fileWarnings[relativeFilePath] = (fileWarnings[relativeFilePath] || 0) + 1;

                // Add to detailed warnings if not in summary mode
                if (!summaryOnly) {
                    warnings.push({
                        rule: message.ruleId,
                        message: message.message,
                        line: message.line,
                        column: message.column,
                        file: relativeFilePath,
                        ...(detailedReport ? {
                            code: message.source,
                            suggestions: message.suggestions
                        } : {})
                    });
                }
            }
        });
    });

    // Sort and limit top items
    const topRules = Object.entries(ruleWarnings)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([rule, count]) => ({ rule, count }));

    const topFiles = Object.entries(fileWarnings)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([file, count]) => ({ file, count }));

    const topDirectories = Object.entries(directoryWarnings)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([directory, count]) => ({ directory, count }));

    // Create the report
    const report = {
        generatedAt: new Date().toISOString(),
        totalWarnings,
        topRules,
        topFiles,
        topDirectories,
        // Only include detailed warnings if not in summary mode
        ...(summaryOnly ? {} : { warnings: detailedReport ? warnings : warnings.slice(0, 100) })
    };

    // Write report to file
    fs.writeFileSync(outputFilename, JSON.stringify(report, null, 2));

    // Print summary to console
    console.log(`\nESLint Warning Report Summary:`);
    console.log(`Total warnings: ${totalWarnings}`);
    console.log(`\nTop Rules:`);
    topRules.forEach(({ rule, count }) => {
        console.log(`  ${rule}: ${count} warnings`);
    });

    console.log(`\nTop Files (by warning count):`);
    topFiles.slice(0, 5).forEach(({ file, count }) => {
        console.log(`  ${file}: ${count} warnings`);
    });

    console.log(`\nReport saved to ${outputFilename}`);

    if (detailedReport) {
        console.log(`\nDetailed warnings included in the report.`);
    }

    // Generate markdown report
    const markdownReport = generateMarkdownReport(report);
    fs.writeFileSync(outputFilename.replace('.json', '.md'), markdownReport);
    console.log(`Markdown report saved to ${outputFilename.replace('.json', '.md')}`);

} catch (error) {
    console.error('Error generating ESLint warning report:', error.message);
    process.exit(1);
}

/**
 * Generate a markdown report from the JSON data
 */
function generateMarkdownReport(report) {
    const { totalWarnings, topRules, topFiles, topDirectories, warnings } = report;

    let markdown = `# ESLint Warning Report\n\n`;
    markdown += `Generated: ${new Date().toLocaleString()}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `Total warnings: **${totalWarnings}**\n\n`;

    markdown += `## Top ESLint Rules\n\n`;
    markdown += `| Rule | Warning Count |\n`;
    markdown += `|------|---------------|\n`;
    topRules.forEach(({ rule, count }) => {
        markdown += `| \`${rule}\` | ${count} |\n`;
    });

    markdown += `\n## Top Files by Warning Count\n\n`;
    markdown += `| File | Warning Count |\n`;
    markdown += `|------|---------------|\n`;
    topFiles.forEach(({ file, count }) => {
        markdown += `| \`${file}\` | ${count} |\n`;
    });

    markdown += `\n## Top Directories by Warning Count\n\n`;
    markdown += `| Directory | Warning Count |\n`;
    markdown += `|-----------|---------------|\n`;
    topDirectories.forEach(({ directory, count }) => {
        markdown += `| \`${directory}\` | ${count} |\n`;
    });

    if (warnings && warnings.length > 0) {
        markdown += `\n## Warning Samples\n\n`;
        const sampleWarnings = warnings.slice(0, 20);
        sampleWarnings.forEach((warning, index) => {
            markdown += `### ${index + 1}. ${warning.rule} in ${warning.file}:${warning.line}\n\n`;
            markdown += `${warning.message}\n\n`;
            if (warning.code) {
                markdown += "```typescript\n";
                markdown += warning.code + "\n";
                markdown += "```\n\n";
            }
        });
    }

    return markdown;
} 