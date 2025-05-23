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

// Process command line arguments
const args = process.argv.slice(2);
let targetComponent = null;
let targetPath = null;

// Parse command line arguments
args.forEach(arg => {
    if (arg.startsWith('--component=')) {
        targetComponent = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
        targetPath = arg;
    }
});

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
let scssFiles;
if (targetPath) {
    scssFiles = glob.sync(`${targetPath}/**/*.scss`, { ignore: ['src/styles/theme.scss', 'src/styles/reset.scss'] });
} else {
    scssFiles = glob.sync('src/**/*.scss', { ignore: ['src/styles/theme.scss', 'src/styles/reset.scss'] });
}

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

    // Check if the path contains the target component
    if (targetComponent && filePath.includes(targetComponent)) {
        return targetComponent;
    }

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

// Filter results by target component if specified
let filteredResults = { ...results };
let filteredComponentResults = { ...componentResults };

if (targetComponent) {
    filteredResults = {};
    Object.entries(results).forEach(([file, data]) => {
        if (file.includes(targetComponent)) {
            filteredResults[file] = data;
        }
    });

    filteredComponentResults = {};
    if (componentResults[targetComponent]) {
        filteredComponentResults[targetComponent] = componentResults[targetComponent];
    }
}

// Generate report
console.log('=== Design Token Compliance Report ===\n');

if (targetComponent) {
    console.log(`Report for component: ${targetComponent}\n`);
}

console.log('Overall Token Usage:');
const overallPercentage = Math.round((totalTokenUsage / totalProperties) * 100);
console.log(`${totalTokenUsage}/${totalProperties} properties (${overallPercentage}%)\n`);

console.log('By Component:');
const sortedComponents = Object.entries(filteredComponentResults)
    .sort((a, b) => b[1].percentage - a[1].percentage);

sortedComponents.forEach(([component, data]) => {
    const status = data.percentage >= 90 ? '🟢' : data.percentage >= 70 ? '🟡' : '🔴';
    console.log(`${status} ${component}: ${data.percentage}% (${data.tokens}/${data.total})`);
});

console.log('\nDetailed File Results:');
Object.entries(filteredResults)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([file, data]) => {
        const status = data.percentage >= 90 ? '🟢' : data.percentage >= 70 ? '🟡' : '🔴';
        console.log(`${status} ${file}: ${data.percentage}% (${data.tokens}/${data.total})`);
    });

// Output results as JSON for potential integration with other tools
const reportFileName = targetComponent ?
    `token-compliance-${targetComponent.toLowerCase()}-report.json` :
    'token-compliance-report.json';

fs.writeFileSync(
    path.join(__dirname, '..', reportFileName),
    JSON.stringify({
        overall: overallPercentage,
        components: filteredComponentResults,
        files: filteredResults
    }, null, 2)
);

console.log(`\nDetailed report saved to ${reportFileName}`); 