#!/usr/bin/env node

/**
 * Script to generate a progress report on ESLint warning reduction
 * Compares current ESLint warnings with the baseline to track progress
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const BASELINE_FILE = 'eslint-baseline.json';
const OUTPUT_DIR = 'docs';
const REPORT_FILE = path.join(OUTPUT_DIR, 'eslint-progress-report.md');

// Run ESLint and get the current warnings
const getCurrentEslintWarnings = () => {
    try {
        const result = execSync('npx eslint src --format json', { encoding: 'utf-8' });
        return JSON.parse(result);
    } catch (error) {
        // ESLint returns non-zero exit code when there are warnings/errors
        return JSON.parse(error.stdout);
    }
};

// Load the baseline ESLint warnings
const loadBaseline = () => {
    try {
        if (fs.existsSync(BASELINE_FILE)) {
            const data = fs.readFileSync(BASELINE_FILE, 'utf-8');
            return JSON.parse(data);
        }
        console.error(`Baseline file ${BASELINE_FILE} not found. Creating new baseline...`);
        const current = getCurrentEslintWarnings();
        fs.writeFileSync(BASELINE_FILE, JSON.stringify(current, null, 2));
        return current;
    } catch (error) {
        console.error(`Error loading baseline: ${error.message}`);
        process.exit(1);
    }
};

// Count warnings by rule and get total
const countWarnings = (eslintResults) => {
    const counts = {};
    let total = 0;

    eslintResults.forEach(result => {
        result.messages.forEach(message => {
            const ruleId = message.ruleId || 'syntax-error';
            counts[ruleId] = (counts[ruleId] || 0) + 1;
            total++;
        });
    });

    return { counts, total };
};

// Group warnings by category
const categorizeWarnings = (warningCounts) => {
    const categories = {
        'Type Safety': 0,
        'React Hooks': 0,
        'Unused Variables': 0,
        'Console Usage': 0,
        'Other': 0
    };

    Object.entries(warningCounts).forEach(([rule, count]) => {
        if (!rule) return;

        if (rule.includes('@typescript-eslint/no-explicit-any') ||
            rule.includes('@typescript-eslint/no-unsafe')) {
            categories['Type Safety'] += count;
        } else if (rule.includes('react-hooks')) {
            categories['React Hooks'] += count;
        } else if (rule.includes('no-unused-vars')) {
            categories['Unused Variables'] += count;
        } else if (rule.includes('no-console')) {
            categories['Console Usage'] += count;
        } else {
            categories['Other'] += count;
        }
    });

    return categories;
};

// Generate a markdown progress report
const generateReport = (baseline, current) => {
    const baselineCounts = countWarnings(baseline);
    const currentCounts = countWarnings(current);

    const baselineCategories = categorizeWarnings(baselineCounts.counts);
    const currentCategories = categorizeWarnings(currentCounts.counts);

    // Calculate overall progress
    const totalReduction = baselineCounts.total - currentCounts.total;
    const percentReduction = (totalReduction / baselineCounts.total * 100).toFixed(1);

    // Generate report content
    let report = '# ESLint Warning Remediation Progress Report\n\n';
    report += `_Generated on: ${new Date().toISOString()}_\n\n`;

    report += '## Summary\n\n';
    report += `- Initial warning count: **${baselineCounts.total}**\n`;
    report += `- Current warning count: **${currentCounts.total}**\n`;
    report += `- Warnings fixed: **${totalReduction}**\n`;
    report += `- Progress: **${percentReduction}%**\n\n`;

    // Progress by category
    report += '## Progress by Category\n\n';
    report += '| Category | Initial Count | Current Count | Fixed | Progress |\n';
    report += '|----------|---------------|--------------|-------|----------|\n';

    Object.entries(baselineCategories).forEach(([category, baselineCount]) => {
        const currentCount = currentCategories[category] || 0;
        const fixed = baselineCount - currentCount;
        const progress = baselineCount > 0
            ? (fixed / baselineCount * 100).toFixed(1) + '%'
            : 'N/A';

        report += `| ${category} | ${baselineCount} | ${currentCount} | ${fixed} | ${progress} |\n`;
    });

    report += '\n';

    // Top remaining issues
    report += '## Top Remaining Issues\n\n';
    report += '| Rule | Count | % of Total |\n';
    report += '|------|-------|------------|\n';

    const sortedRules = Object.entries(currentCounts.counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    sortedRules.forEach(([rule, count]) => {
        const percentage = (count / currentCounts.total * 100).toFixed(1);
        report += `| ${rule || 'unknown'} | ${count} | ${percentage}% |\n`;
    });

    report += '\n';

    // Most improved rules
    report += '## Most Improved Rules\n\n';
    report += '| Rule | Initial Count | Current Count | Fixed | Progress |\n';
    report += '|------|---------------|--------------|-------|----------|\n';

    const improvements = [];

    Object.entries(baselineCounts.counts).forEach(([rule, baselineCount]) => {
        const currentCount = currentCounts.counts[rule] || 0;
        const fixed = baselineCount - currentCount;
        const progress = (fixed / baselineCount * 100).toFixed(1);

        if (fixed > 0) {
            improvements.push({ rule, baselineCount, currentCount, fixed, progress });
        }
    });

    improvements
        .sort((a, b) => b.fixed - a.fixed)
        .slice(0, 10)
        .forEach(({ rule, baselineCount, currentCount, fixed, progress }) => {
            report += `| ${rule || 'unknown'} | ${baselineCount} | ${currentCount} | ${fixed} | ${progress}% |\n`;
        });

    report += '\n';

    // Recommendations for next steps
    report += '## Recommendations\n\n';

    // Find categories with highest remaining counts
    const priorityCategories = Object.entries(currentCategories)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, count]) => count > 0)
        .slice(0, 3)
        .map(([category]) => category);

    report += '### Focus Areas\n\n';
    priorityCategories.forEach(category => {
        report += `- **${category}**: ${currentCategories[category]} remaining warnings\n`;
    });

    report += '\n';

    // Specific rule recommendations
    report += '### Specific Rules to Address\n\n';
    sortedRules.slice(0, 5).forEach(([rule, count]) => {
        report += `- ${rule}: ${count} warnings\n`;
    });

    report += '\n';

    // Success areas
    report += '### Success Areas\n\n';

    const successCategories = Object.entries(baselineCategories)
        .map(([category, baselineCount]) => {
            const currentCount = currentCategories[category] || 0;
            const progress = baselineCount > 0
                ? ((baselineCount - currentCount) / baselineCount * 100)
                : 0;
            return { category, progress };
        })
        .filter(({ progress }) => progress >= 50)
        .sort((a, b) => b.progress - a.progress);

    if (successCategories.length > 0) {
        successCategories.forEach(({ category, progress }) => {
            report += `- **${category}**: ${progress.toFixed(1)}% complete\n`;
        });
    } else {
        report += '- No categories have reached 50% completion yet\n';
    }

    return report;
};

// Main function
const main = () => {
    console.log('Generating ESLint progress report...');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load baseline and get current warnings
    const baseline = loadBaseline();
    const current = getCurrentEslintWarnings();

    // Generate and save report
    const report = generateReport(baseline, current);
    fs.writeFileSync(REPORT_FILE, report);

    console.log(`Progress report generated at ${REPORT_FILE}`);

    // Output the report to stdout as well
    console.log('\n--- REPORT PREVIEW ---\n');
    console.log(report);
};

main(); 