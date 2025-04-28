/**
 * Token Compliance Report Generator
 * 
 * This script generates a token compliance report in Markdown format,
 * which can be added to documentation, GitHub wikis, or dashboards.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to format a date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Get current date
const date = new Date();
const dateFormatted = formatDate(date);

// Run the token compliance script and capture output
function getComplianceData() {
    try {
        const output = execSync('node scripts/token-compliance.js').toString();
        return output;
    } catch (error) {
        console.error('Error running compliance script:', error);
        return '';
    }
}

// Parse the compliance data to extract key information
function parseComplianceData(data) {
    const lines = data.split('\n');
    let overall = '';
    let byComponent = [];
    let currentSection = '';

    for (const line of lines) {
        if (line.includes('Overall Token Usage:')) {
            overall = line.trim();
        } else if (line.includes('By Component:')) {
            currentSection = 'byComponent';
        } else if (currentSection === 'byComponent' && line.trim() && !line.includes('Detailed File Results:')) {
            byComponent.push(line.trim());
        }
    }

    return {
        overall,
        byComponent,
        rawData: data
    };
}

// Generate Markdown report
function generateMarkdownReport(complianceData) {
    const { overall, byComponent, rawData } = complianceData;

    const report = `# Token Compliance Report - ${dateFormatted}

## Summary

${overall}

## Compliance by Component

${byComponent.join('\n')}

## Full Report

<details>
<summary>Click to expand full report</summary>

\`\`\`
${rawData}
\`\`\`

</details>

## Trend

Add a trend chart here to track progress over time.

## Current Priority Components

| Component | Assignee | Current % | Target Date |
|-----------|----------|-----------|-------------|
| UI        | TBD      | 62%       | TBD         |
| PersonalTraining | TBD | 7%      | TBD         |
| Training  | TBD      | 6%        | TBD         |
| Features  | TBD      | 2%        | TBD         |
| Pricing   | TBD      | 2%        | TBD         |

## Recently Completed Components

| Component | Completed By | Date |
|-----------|--------------|------|
| Hero      | Team         | ${dateFormatted} |
| HeroButton| Team         | ${dateFormatted} |

`;

    return report;
}

// Save the report to a file
function saveReport(report) {
    const reportDir = path.join(process.cwd(), 'docs', 'reports');

    // Create reports directory if it doesn't exist
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `token-compliance-${dateFormatted}.md`);
    fs.writeFileSync(reportPath, report);

    // Always save a copy as latest.md
    const latestPath = path.join(reportDir, 'token-compliance-latest.md');
    fs.writeFileSync(latestPath, report);

    console.log(`Report saved to ${reportPath}`);
    console.log(`Latest report saved to ${latestPath}`);
}

// Main function
function main() {
    console.log('Generating token compliance report...');
    const data = getComplianceData();
    const parsedData = parseComplianceData(data);
    const report = generateMarkdownReport(parsedData);
    saveReport(report);
    console.log('Report generation complete.');
}

main(); 