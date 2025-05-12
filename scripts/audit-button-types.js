#!/usr/bin/env node

/**
 * Button Component Type Audit Script
 * 
 * This script analyzes Button components for 'any' type usage and generates a report
 * to help identify patterns and prioritize type remediation tasks.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BUTTON_DIRS = [
    'src/features/shared/Button',
    'src/features/**/Button',
    'src/components/**/Button'
];
const OUTPUT_DIR = 'reports';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'button-type-audit.json');
const SUMMARY_FILE = path.join(OUTPUT_DIR, 'button-type-audit-summary.md');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Run ESLint on button components to find 'any' type usage
 */
function runEslintAudit() {
    console.log('Running ESLint audit on Button components...');

    let results = [];

    try {
        // Run ESLint on each Button directory pattern
        BUTTON_DIRS.forEach(dirPattern => {
            try {
                const cmd = `npx eslint --ext .ts,.tsx ${dirPattern} --rule "@typescript-eslint/no-explicit-any: error" --format json`;
                const output = execSync(cmd, { encoding: 'utf-8' });

                if (output) {
                    const eslintResults = JSON.parse(output);
                    results = results.concat(eslintResults);
                }
            } catch (error) {
                // ESLint returns non-zero exit code when it finds issues
                if (error.stdout) {
                    const eslintResults = JSON.parse(error.stdout);
                    results = results.concat(eslintResults);
                }
            }
        });

        return results;
    } catch (error) {
        console.error('Error running ESLint audit:', error.message);
        return [];
    }
}

/**
 * Generate a report from ESLint results
 */
function generateReport(eslintResults) {
    console.log('Generating report...');

    // Extract and organize 'any' type warnings
    const anyTypeWarnings = [];
    let totalWarnings = 0;

    eslintResults.forEach(result => {
        const filePath = result.filePath;
        const fileName = path.basename(filePath);

        result.messages.forEach(message => {
            if (message.ruleId === '@typescript-eslint/no-explicit-any') {
                totalWarnings++;
                anyTypeWarnings.push({
                    file: filePath,
                    fileName,
                    line: message.line,
                    column: message.column,
                    message: message.message,
                    code: message.source
                });
            }
        });
    });

    // Group warnings by file
    const warningsByFile = {};
    anyTypeWarnings.forEach(warning => {
        if (!warningsByFile[warning.file]) {
            warningsByFile[warning.file] = [];
        }
        warningsByFile[warning.file].push(warning);
    });

    // Generate pattern analysis
    const patterns = identifyPatterns(anyTypeWarnings);

    // Compile final report
    const report = {
        totalFiles: eslintResults.length,
        totalWarnings,
        warningsByFile,
        patterns,
        timestamp: new Date().toISOString()
    };

    // Write to files
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
    generateSummaryMarkdown(report);

    console.log(`Audit complete. Found ${totalWarnings} 'any' type warnings in Button components.`);
    console.log(`Report saved to ${OUTPUT_FILE}`);
    console.log(`Summary saved to ${SUMMARY_FILE}`);

    return report;
}

/**
 * Identify common patterns in 'any' type usage
 */
function identifyPatterns(warnings) {
    // Event handler patterns
    const eventHandlerPattern = /\(\s*event\s*:\s*any\s*\)/;
    const propsPattern = /props\s*:\s*any/;
    const genericComponentPattern = /React\.Component<any/;
    const useStatePattern = /useState<any>/;

    const patterns = {
        eventHandlers: 0,
        props: 0,
        genericComponents: 0,
        useState: 0,
        other: 0
    };

    warnings.forEach(warning => {
        const code = warning.code || '';

        if (eventHandlerPattern.test(code)) {
            patterns.eventHandlers++;
        } else if (propsPattern.test(code)) {
            patterns.props++;
        } else if (genericComponentPattern.test(code)) {
            patterns.genericComponents++;
        } else if (useStatePattern.test(code)) {
            patterns.useState++;
        } else {
            patterns.other++;
        }
    });

    return patterns;
}

/**
 * Generate a markdown summary
 */
function generateSummaryMarkdown(report) {
    const { totalFiles, totalWarnings, warningsByFile, patterns } = report;

    // Format the files by warning count (descending)
    const filesSorted = Object.entries(warningsByFile)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([file, warnings]) => ({
            file,
            count: warnings.length
        }));

    // Create markdown content
    let markdown = `# Button Component Type Audit\n\n`;
    markdown += `*Generated on: ${new Date().toLocaleString()}*\n\n`;

    markdown += `## Summary\n\n`;
    markdown += `- **Total files scanned:** ${totalFiles}\n`;
    markdown += `- **Total 'any' type warnings:** ${totalWarnings}\n\n`;

    markdown += `## Pattern Analysis\n\n`;
    markdown += `| Pattern | Count | % of Total |\n`;
    markdown += `|---------|-------|------------|\n`;

    Object.entries(patterns).forEach(([pattern, count]) => {
        const percentage = ((count / totalWarnings) * 100).toFixed(1);
        markdown += `| ${pattern} | ${count} | ${percentage}% |\n`;
    });

    markdown += `\n## Files by Warning Count\n\n`;
    markdown += `| File | Warning Count |\n`;
    markdown += `|------|---------------|\n`;

    filesSorted.forEach(({ file, count }) => {
        const relativeFile = file.replace(process.cwd(), '');
        markdown += `| ${relativeFile} | ${count} |\n`;
    });

    markdown += `\n## Next Steps\n\n`;
    markdown += `1. Focus on high-count files first\n`;
    markdown += `2. Apply the ButtonProps discriminated union pattern\n`;
    markdown += `3. Replace event handler 'any' types with proper types from events.ts\n`;
    markdown += `4. Update component props to extend from base interfaces\n`;

    fs.writeFileSync(SUMMARY_FILE, markdown);
}

// Run the audit
const eslintResults = runEslintAudit();
generateReport(eslintResults); 