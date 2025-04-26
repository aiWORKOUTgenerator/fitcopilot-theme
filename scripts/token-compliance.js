#!/usr/bin/env node

/**
 * Design Token Compliance Script
 * 
 * Analyzes component SCSS files to determine the percentage of CSS properties 
 * using design tokens vs. hardcoded values
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Properties we want to check for token usage
const TRACKED_PROPERTIES = [
    'color',
    'background-color',
    'border-color',
    'box-shadow',
    'font-size',
    'line-height',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'width',
    'height',
    // Additional properties to track
    'background-position',
    'background-size',
    'transform',
    'transition',
    'animation',
    'animation-duration',
    'animation-delay',
    'border-radius',
    'opacity',
    'backdrop-filter',
    'filter',
    'text-shadow',
    'font-weight'
];

// Regular expressions
const PROPERTY_REGEX = new RegExp(`(${TRACKED_PROPERTIES.join('|')})\\s*:\\s*([^;]+);`, 'g');
const TOKEN_USAGE_REGEX = /var\(--[a-zA-Z0-9-]+\)/;

// Results storage
const results = {};
const componentResults = {};

// Find all SCSS files
const scssFiles = glob.sync('src/**/*.scss', { ignore: ['src/styles/theme.scss', 'src/styles/reset.scss'] });

let totalTokenUsage = 0;
let totalProperties = 0;

scssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(PROPERTY_REGEX)];

    if (matches.length === 0) return;

    const fileResults = {
        total: matches.length,
        tokens: 0,
        percentage: 0
    };

    matches.forEach(match => {
        const property = match[1];
        const value = match[2];

        if (TOKEN_USAGE_REGEX.test(value)) {
            fileResults.tokens++;
        }
    });

    fileResults.percentage = Math.round((fileResults.tokens / fileResults.total) * 100);
    results[file] = fileResults;

    totalTokenUsage += fileResults.tokens;
    totalProperties += fileResults.total;

    // Group by component
    const componentName = getComponentName(file);
    if (!componentResults[componentName]) {
        componentResults[componentName] = {
            total: 0,
            tokens: 0,
            percentage: 0,
            files: []
        };
    }

    componentResults[componentName].total += fileResults.total;
    componentResults[componentName].tokens += fileResults.tokens;
    componentResults[componentName].files.push(file);
    componentResults[componentName].percentage = Math.round(
        (componentResults[componentName].tokens / componentResults[componentName].total) * 100
    );
});

// Extract component name from file path
function getComponentName(filePath) {
    const parts = filePath.split('/');
    // Try to find the component folder
    const componentIndex = parts.findIndex(part =>
        part === 'components' || part === 'Button' || part === 'Tooltip' || part === 'Card'
    );

    if (componentIndex >= 0 && componentIndex < parts.length - 1) {
        return parts[componentIndex + 1];
    }

    // Fallback to the last directory name
    return parts[parts.length - 2] || 'Unknown';
}

// Generate report
console.log('=== Design Token Compliance Report ===\n');

console.log('Overall Token Usage:');
const overallPercentage = Math.round((totalTokenUsage / totalProperties) * 100);
console.log(`${totalTokenUsage}/${totalProperties} properties (${overallPercentage}%)\n`);

console.log('By Component:');
const sortedComponents = Object.entries(componentResults)
    .sort((a, b) => b[1].percentage - a[1].percentage);

sortedComponents.forEach(([component, data]) => {
    const status = data.percentage >= 90 ? '🟢' : data.percentage >= 70 ? '🟡' : '🔴';
    console.log(`${status} ${component}: ${data.percentage}% (${data.tokens}/${data.total})`);
});

console.log('\nDetailed File Results:');
Object.entries(results)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([file, data]) => {
        const status = data.percentage >= 90 ? '🟢' : data.percentage >= 70 ? '🟡' : '🔴';
        console.log(`${status} ${file}: ${data.percentage}% (${data.tokens}/${data.total})`);
    });

// Output results as JSON for potential integration with other tools
fs.writeFileSync(
    path.join(__dirname, '../token-compliance-report.json'),
    JSON.stringify({ overall: overallPercentage, components: componentResults, files: results }, null, 2)
);

console.log('\nDetailed report saved to token-compliance-report.json'); 