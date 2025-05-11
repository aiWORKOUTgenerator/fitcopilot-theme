#!/usr/bin/env node

/**
 * Script to compare two ESLint reports and show progress
 * Usage: node scripts/compare-eslint-reports.js reports/eslint-baseline.json reports/eslint-current.json
 */

const fs = require('fs');
const path = require('path');

// Check arguments
if (process.argv.length < 4) {
    console.error('Usage: node compare-eslint-reports.js <baseline-report> <current-report>');
    process.exit(1);
}

const baselineReportPath = process.argv[2];
const currentReportPath = process.argv[3];

// Check if files exist
if (!fs.existsSync(baselineReportPath)) {
    console.error(`Baseline report not found: ${baselineReportPath}`);
    process.exit(1);
}

if (!fs.existsSync(currentReportPath)) {
    console.error(`Current report not found: ${currentReportPath}`);
    process.exit(1);
}

// Read and parse reports
const baselineReport = JSON.parse(fs.readFileSync(baselineReportPath, 'utf8'));
const currentReport = JSON.parse(fs.readFileSync(currentReportPath, 'utf8'));

// Extract error counts by rule
function countErrorsByRule(report) {
    const counts = {};

    report.forEach(file => {
        file.messages.forEach(message => {
            const rule = message.ruleId || 'other';
            counts[rule] = (counts[rule] || 0) + 1;
        });
    });

    return counts;
}

const baselineCounts = countErrorsByRule(baselineReport);
const currentCounts = countErrorsByRule(currentReport);

// Calculate total errors
const baselineTotal = Object.values(baselineCounts).reduce((sum, count) => sum + count, 0);
const currentTotal = Object.values(currentCounts).reduce((sum, count) => sum + count, 0);

// Generate comparison report
console.log('=== ESLint Error Comparison Report ===');
console.log(`Baseline: ${baselineReportPath}`);
console.log(`Current:  ${currentReportPath}`);
console.log();

console.log('=== Summary ===');
console.log(`Baseline total errors: ${baselineTotal}`);
console.log(`Current total errors:  ${currentTotal}`);

const difference = baselineTotal - currentTotal;
const percentChange = baselineTotal ? (difference / baselineTotal * 100).toFixed(2) : 0;

console.log(`Difference:           ${difference > 0 ? '+' : ''}${difference} (${percentChange}%)`);
console.log();

// Show detailed breakdown by rule
console.log('=== Breakdown by Rule ===');
console.log('Rule                                     | Baseline | Current | Difference');
console.log('------------------------------------------|----------|---------|------------');

// Get all unique rules from both reports
const allRules = [...new Set([...Object.keys(baselineCounts), ...Object.keys(currentCounts)])].sort();

allRules.forEach(rule => {
    const baseline = baselineCounts[rule] || 0;
    const current = currentCounts[rule] || 0;
    const diff = baseline - current;
    const percentDiff = baseline ? (diff / baseline * 100).toFixed(2) : 0;

    // Format the output to align columns
    const ruleStr = rule.padEnd(42);
    const baselineStr = String(baseline).padStart(8);
    const currentStr = String(current).padStart(7);
    const diffStr = `${diff > 0 ? '+' : ''}${diff} (${percentDiff}%)`.padStart(12);

    console.log(`${ruleStr}| ${baselineStr} | ${currentStr} | ${diffStr}`);
});

// Show file count comparison
const baselineFileCount = baselineReport.length;
const currentFileCount = currentReport.length;

console.log();
console.log('=== File Count ===');
console.log(`Files with issues in baseline: ${baselineFileCount}`);
console.log(`Files with issues in current:  ${currentFileCount}`);
console.log(`Difference:                   ${baselineFileCount - currentFileCount}`);

// Save the report to a file
const reportDir = path.dirname(currentReportPath);
const reportName = `comparison-${path.basename(baselineReportPath, '.json')}-vs-${path.basename(currentReportPath, '.json')}.txt`;
const reportPath = path.join(reportDir, reportName);

fs.writeFileSync(reportPath, `
=== ESLint Error Comparison Report ===
Baseline: ${baselineReportPath}
Current:  ${currentReportPath}

=== Summary ===
Baseline total errors: ${baselineTotal}
Current total errors:  ${currentTotal}
Difference:           ${difference > 0 ? '+' : ''}${difference} (${percentChange}%)

=== Breakdown by Rule ===
${'Rule'.padEnd(42)}| ${'Baseline'.padStart(8)} | ${'Current'.padStart(7)} | ${'Difference'.padStart(12)}
${''.padEnd(42, '-')}|${''.padEnd(10, '-')}|${''.padEnd(9, '-')}|${''.padEnd(14, '-')}
${allRules.map(rule => {
    const baseline = baselineCounts[rule] || 0;
    const current = currentCounts[rule] || 0;
    const diff = baseline - current;
    const percentDiff = baseline ? (diff / baseline * 100).toFixed(2) : 0;

    const ruleStr = rule.padEnd(42);
    const baselineStr = String(baseline).padStart(8);
    const currentStr = String(current).padStart(7);
    const diffStr = `${diff > 0 ? '+' : ''}${diff} (${percentDiff}%)`.padStart(12);

    return `${ruleStr}| ${baselineStr} | ${currentStr} | ${diffStr}`;
}).join('\n')}

=== File Count ===
Files with issues in baseline: ${baselineFileCount}
Files with issues in current:  ${currentFileCount}
Difference:                   ${baselineFileCount - currentFileCount}
`);

console.log();
console.log(`Report saved to: ${reportPath}`); 