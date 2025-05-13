#!/usr/bin/env node

/**
 * ESLint Warning Pattern Analysis Script
 * 
 * This script analyzes ESLint warnings across the codebase and categorizes them
 * by component family, warning type, and severity. It generates a markdown report
 * that helps prioritize remediation efforts.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run ESLint and get the output
const runEslint = () => {
    try {
        const result = execSync('npx eslint src --format json', { encoding: 'utf-8' });
        return JSON.parse(result);
    } catch (error) {
        // ESLint returns non-zero exit code when there are warnings/errors
        return JSON.parse(error.stdout);
    }
};

// Group warnings by component family
const groupByComponentFamily = (eslintOutput) => {
    const componentFamilies = {};
    const warningsByType = {};

    eslintOutput.forEach(fileReport => {
        if (fileReport.messages.length === 0) return;

        const filePath = fileReport.filePath;
        const componentFamily = getComponentFamily(filePath);

        if (!componentFamilies[componentFamily]) {
            componentFamilies[componentFamily] = {
                count: 0,
                files: {},
                ruleViolations: {}
            };
        }

        fileReport.messages.forEach(message => {
            // Add to component family stats
            componentFamilies[componentFamily].count++;

            // Track by file
            if (!componentFamilies[componentFamily].files[filePath]) {
                componentFamilies[componentFamily].files[filePath] = 0;
            }
            componentFamilies[componentFamily].files[filePath]++;

            // Track by rule
            const ruleId = message.ruleId || 'syntax-error';
            if (!componentFamilies[componentFamily].ruleViolations[ruleId]) {
                componentFamilies[componentFamily].ruleViolations[ruleId] = 0;
            }
            componentFamilies[componentFamily].ruleViolations[ruleId]++;

            // Track total by rule type
            if (!warningsByType[ruleId]) {
                warningsByType[ruleId] = 0;
            }
            warningsByType[ruleId]++;
        });
    });

    return { componentFamilies, warningsByType };
};

// Determine component family from file path
const getComponentFamily = (filePath) => {
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Extract components/features
    if (normalizedPath.includes('/features/')) {
        const parts = normalizedPath.split('/features/')[1].split('/');
        if (parts.length >= 2) {
            return `features/${parts[0]}/${parts[1]}`;
        } else if (parts.length === 1) {
            return `features/${parts[0]}`;
        }
    }

    // Handle shared components
    if (normalizedPath.includes('/shared/')) {
        const parts = normalizedPath.split('/shared/')[1].split('/');
        if (parts.length >= 1) {
            return `shared/${parts[0]}`;
        }
    }

    // Handle utils, hooks, etc.
    if (normalizedPath.includes('/utils/')) {
        return 'utils';
    }

    if (normalizedPath.includes('/hooks/')) {
        return 'hooks';
    }

    if (normalizedPath.includes('/api/')) {
        return 'api';
    }

    // Default to the directory name
    const dirname = path.dirname(normalizedPath);
    const lastDir = dirname.split('/').pop();
    return lastDir || 'other';
};

// Generate markdown report
const generateReport = (componentFamilies, warningsByType) => {
    let markdown = '# ESLint Warning Pattern Analysis\n\n';

    // Add timestamp
    markdown += `_Generated on: ${new Date().toISOString()}_\n\n`;

    // Summary section
    markdown += '## Summary\n\n';

    const totalWarnings = Object.values(warningsByType).reduce((sum, count) => sum + count, 0);
    markdown += `Total warnings: **${totalWarnings}**\n\n`;

    // Warnings by type
    markdown += '## Warnings by Type\n\n';
    markdown += '| Rule | Count | % of Total |\n';
    markdown += '|------|-------|------------|\n';

    const sortedWarningTypes = Object.entries(warningsByType)
        .sort((a, b) => b[1] - a[1]);

    sortedWarningTypes.forEach(([ruleId, count]) => {
        const percentage = ((count / totalWarnings) * 100).toFixed(1);
        markdown += `| ${ruleId} | ${count} | ${percentage}% |\n`;
    });

    markdown += '\n';

    // Component families
    markdown += '## Component Families\n\n';
    markdown += '| Component Family | Warning Count | Top Issues |\n';
    markdown += '|------------------|---------------|------------|\n';

    const sortedFamilies = Object.entries(componentFamilies)
        .sort((a, b) => b[1].count - a[1].count);

    sortedFamilies.forEach(([family, data]) => {
        const topIssues = Object.entries(data.ruleViolations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([rule, count]) => `${rule} (${count})`)
            .join(', ');

        markdown += `| ${family} | ${data.count} | ${topIssues} |\n`;
    });

    markdown += '\n';

    // Detailed breakdown by component family
    markdown += '## Detailed Component Analysis\n\n';

    sortedFamilies.slice(0, 10).forEach(([family, data]) => {
        markdown += `### ${family}\n\n`;
        markdown += `Total warnings: ${data.count}\n\n`;

        markdown += '#### Rule Violations\n\n';
        markdown += '| Rule | Count |\n';
        markdown += '|------|-------|\n';

        const sortedRules = Object.entries(data.ruleViolations)
            .sort((a, b) => b[1] - a[1]);

        sortedRules.forEach(([rule, count]) => {
            markdown += `| ${rule} | ${count} |\n`;
        });

        markdown += '\n';

        markdown += '#### Files\n\n';
        markdown += '| File | Warning Count |\n';
        markdown += '|------|---------------|\n';

        const sortedFiles = Object.entries(data.files)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10 files

        sortedFiles.forEach(([file, count]) => {
            const shortPath = file.split('/src/')[1] || file;
            markdown += `| ${shortPath} | ${count} |\n`;
        });

        markdown += '\n';
    });

    // Remediation recommendations
    markdown += '## Remediation Recommendations\n\n';

    // Type safety issues
    const typeIssues = sortedWarningTypes.filter(([rule]) =>
        rule.includes('@typescript-eslint/no-explicit-any') ||
        rule.includes('@typescript-eslint/no-unsafe')
    );

    if (typeIssues.length > 0) {
        markdown += '### Type Safety Issues\n\n';
        markdown += 'Focus on applying the discriminated union pattern to these components:\n\n';

        const componentsByTypeIssues = [];

        Object.entries(componentFamilies).forEach(([family, data]) => {
            const typeIssueCount = typeIssues.reduce((sum, [rule]) => {
                return sum + (data.ruleViolations[rule] || 0);
            }, 0);

            if (typeIssueCount > 0) {
                componentsByTypeIssues.push({ family, count: typeIssueCount });
            }
        });

        componentsByTypeIssues
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .forEach(({ family, count }) => {
                markdown += `- ${family} (${count} type issues)\n`;
            });

        markdown += '\n';
    }

    // React hooks issues
    const hooksIssues = sortedWarningTypes.filter(([rule]) =>
        rule.includes('react-hooks')
    );

    if (hooksIssues.length > 0) {
        markdown += '### React Hooks Issues\n\n';
        markdown += 'Fix dependency arrays in these components:\n\n';

        const componentsByHooksIssues = [];

        Object.entries(componentFamilies).forEach(([family, data]) => {
            const hooksIssueCount = hooksIssues.reduce((sum, [rule]) => {
                return sum + (data.ruleViolations[rule] || 0);
            }, 0);

            if (hooksIssueCount > 0) {
                componentsByHooksIssues.push({ family, count: hooksIssueCount });
            }
        });

        componentsByHooksIssues
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .forEach(({ family, count }) => {
                markdown += `- ${family} (${count} hooks issues)\n`;
            });

        markdown += '\n';
    }

    // Console and unused issues
    const consoleIssues = sortedWarningTypes.filter(([rule]) =>
        rule.includes('no-console')
    );

    const unusedIssues = sortedWarningTypes.filter(([rule]) =>
        rule.includes('no-unused-vars')
    );

    if (consoleIssues.length > 0 || unusedIssues.length > 0) {
        markdown += '### Quick Wins\n\n';
        markdown += 'Apply automated fixes to these issues:\n\n';

        if (consoleIssues.length > 0) {
            const totalConsole = consoleIssues.reduce((sum, [_, count]) => sum + count, 0);
            markdown += `- Replace console statements with logger (${totalConsole} issues)\n`;
        }

        if (unusedIssues.length > 0) {
            const totalUnused = unusedIssues.reduce((sum, [_, count]) => sum + count, 0);
            markdown += `- Apply underscore prefix to unused variables (${totalUnused} issues)\n`;
        }

        markdown += '\n';
    }

    // Implementation plan
    markdown += '## Implementation Plan\n\n';
    markdown += '1. **Start with high-impact shared components**\n';
    markdown += '   - Button component family\n';
    markdown += '   - Form component family\n';
    markdown += '   - Card component family\n\n';

    markdown += '2. **Apply patterns systematically**\n';
    markdown += '   - Create type definitions first\n';
    markdown += '   - Apply discriminated unions for variants\n';
    markdown += '   - Implement type guards\n';
    markdown += '   - Update component implementations\n\n';

    markdown += '3. **Use automated scripts for repetitive fixes**\n';
    markdown += '   - Replace console with logger\n';
    markdown += '   - Prefix unused variables\n';
    markdown += '   - Fix missing dependencies in hooks\n\n';

    return markdown;
};

// Main function
const main = () => {
    console.error('Running ESLint analysis...');
    const eslintOutput = runEslint();

    console.error('Analyzing warnings...');
    const { componentFamilies, warningsByType } = groupByComponentFamily(eslintOutput);

    console.error('Generating report...');
    const report = generateReport(componentFamilies, warningsByType);

    // Output to stdout
    console.log(report);
};

main(); 