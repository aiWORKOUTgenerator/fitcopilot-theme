#!/usr/bin/env node

/**
 * Warning Report Comparison Tool
 * 
 * This script compares two ESLint warning reports to track progress in warning reduction.
 * 
 * Usage:
 * node scripts/compare-warning-reports.js baseline-report.json current-report.json
 */

const fs = require('fs');
const path = require('path');

// Validate arguments
if (process.argv.length < 4) {
    console.error('Usage: node compare-warning-reports.js <baseline-report.json> <current-report.json>');
    process.exit(1);
}

// Load reports
const baselinePath = path.resolve(process.argv[2]);
const currentPath = path.resolve(process.argv[3]);

if (!fs.existsSync(baselinePath)) {
    console.error(`Baseline report not found: ${baselinePath}`);
    process.exit(1);
}

if (!fs.existsSync(currentPath)) {
    console.error(`Current report not found: ${currentPath}`);
    process.exit(1);
}

const baselineReport = require(baselinePath);
const currentReport = require(currentPath);

// Calculate overall reduction
const totalReduction = baselineReport.totalWarnings - currentReport.totalWarnings;
const percentReduction = ((totalReduction / baselineReport.totalWarnings) * 100).toFixed(2);

console.log(`\nWarning Reduction Summary`);
console.log(`========================`);
console.log(`Baseline warnings: ${baselineReport.totalWarnings}`);
console.log(`Current warnings:  ${currentReport.totalWarnings}`);
console.log(`Reduction:         ${totalReduction} (${percentReduction}%)`);

// Compare rule-specific reductions
console.log(`\nTop Warning Reductions by Rule:`);
console.log(`============================`);

// Create map of baseline rules
const baselineRuleMap = baselineReport.topRules.reduce((acc, { rule, count }) => {
    acc[rule] = count;
    return acc;
}, {});

// Create map of current rules
const currentRuleMap = currentReport.topRules.reduce((acc, { rule, count }) => {
    acc[rule] = count;
    return acc;
}, {});

// Calculate reductions by rule
const reductionsByRule = [];
for (const rule in baselineRuleMap) {
    const baselineCount = baselineRuleMap[rule] || 0;
    const currentCount = currentRuleMap[rule] || 0;
    const reduction = baselineCount - currentCount;
    const rulePercentReduction = baselineCount > 0 ? ((reduction / baselineCount) * 100).toFixed(2) : '0.00';

    reductionsByRule.push({
        rule,
        reduction,
        percentReduction: rulePercentReduction,
        baselineCount,
        currentCount
    });
}

// Sort by highest reduction
reductionsByRule
    .sort((a, b) => b.reduction - a.reduction)
    .slice(0, 10)
    .forEach(({ rule, reduction, percentReduction, baselineCount, currentCount }) => {
        console.log(`${rule}:`);
        console.log(`  Baseline: ${baselineCount}, Current: ${currentCount}`);
        console.log(`  Reduction: ${reduction} (${percentReduction}%)`);
    });

// New rules that weren't in baseline
console.log(`\nNew Warning Rules (not in baseline):`);
console.log(`==================================`);
let newRulesFound = false;

currentReport.topRules.forEach(({ rule, count }) => {
    if (!(rule in baselineRuleMap)) {
        console.log(`${rule}: ${count} warnings`);
        newRulesFound = true;
    }
});

if (!newRulesFound) {
    console.log('No new warning rules found.');
}

// Generate Markdown report
const generateMarkdownReport = () => {
    const date = new Date().toISOString().split('T')[0];
    let markdown = `# Warning Reduction Report - ${date}\n\n`;

    markdown += `## Summary\n\n`;
    markdown += `- Baseline warnings: **${baselineReport.totalWarnings}**\n`;
    markdown += `- Current warnings: **${currentReport.totalWarnings}**\n`;
    markdown += `- Reduction: **${totalReduction}** (${percentReduction}%)\n\n`;

    markdown += `## Top Warning Reductions by Rule\n\n`;
    markdown += `| Rule | Baseline | Current | Reduction | % |\n`;
    markdown += `|------|----------|---------|-----------|---|\n`;

    reductionsByRule
        .sort((a, b) => b.reduction - a.reduction)
        .slice(0, 10)
        .forEach(({ rule, reduction, percentReduction, baselineCount, currentCount }) => {
            markdown += `| \`${rule}\` | ${baselineCount} | ${currentCount} | ${reduction} | ${percentReduction}% |\n`;
        });

    markdown += `\n## Remaining Top Warning Rules\n\n`;
    markdown += `| Rule | Count | % of Total |\n`;
    markdown += `|------|-------|------------|\n`;

    currentReport.topRules
        .slice(0, 10)
        .forEach(({ rule, count }) => {
            const percent = ((count / currentReport.totalWarnings) * 100).toFixed(1);
            markdown += `| \`${rule}\` | ${count} | ${percent}% |\n`;
        });

    markdown += `\n## Remaining Top Warning Files\n\n`;
    markdown += `| File | Count |\n`;
    markdown += `|------|-------|\n`;

    currentReport.topFiles
        .slice(0, 10)
        .forEach(({ file, count }) => {
            markdown += `| \`${file}\` | ${count} |\n`;
        });

    // Add problem directories section
    markdown += `\n## Remaining Top Warning Directories\n\n`;
    markdown += `| Directory | Count |\n`;
    markdown += `|-----------|-------|\n`;

    currentReport.topDirectories
        .slice(0, 5)
        .forEach(({ directory, count }) => {
            markdown += `| \`${directory}\` | ${count} |\n`;
        });

    // Add a section with recommendations
    markdown += `\n## Recommendations\n\n`;

    // Top rule to focus on
    const topRule = currentReport.topRules[0];
    if (topRule) {
        markdown += `### Focus on \`${topRule.rule}\`\n\n`;
        markdown += `This rule accounts for ${((topRule.count / currentReport.totalWarnings) * 100).toFixed(1)}% of all warnings.\n\n`;
    }

    // Top file to fix
    const topFile = currentReport.topFiles[0];
    if (topFile) {
        markdown += `### Fix \`${topFile.file}\`\n\n`;
        markdown += `This file has ${topFile.count} warnings and should be prioritized.\n\n`;
    }

    // Top directory to address
    const topDirectory = currentReport.topDirectories[0];
    if (topDirectory) {
        markdown += `### Address \`${topDirectory.directory}\` directory\n\n`;
        markdown += `This directory contains ${topDirectory.count} warnings across multiple files.\n\n`;
    }

    return markdown;
};

// Save markdown report
const markdownReport = generateMarkdownReport();
const reportDir = path.resolve('reports');

// Create reports directory if it doesn't exist
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

const reportPath = path.join(reportDir, `warning-reduction-${new Date().toISOString().split('T')[0]}.md`);
fs.writeFileSync(reportPath, markdownReport);
console.log(`\nDetailed report saved to ${reportPath}`);

// Also save a JSON version of the comparison
const comparisonData = {
    date: new Date().toISOString(),
    baseline: {
        path: baselinePath,
        totalWarnings: baselineReport.totalWarnings
    },
    current: {
        path: currentPath,
        totalWarnings: currentReport.totalWarnings
    },
    reduction: {
        absolute: totalReduction,
        percentage: parseFloat(percentReduction)
    },
    ruleReductions: reductionsByRule
};

const jsonReportPath = reportPath.replace('.md', '.json');
fs.writeFileSync(jsonReportPath, JSON.stringify(comparisonData, null, 2));
console.log(`Comparison data saved to ${jsonReportPath}`); 