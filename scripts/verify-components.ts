/**
 * Component Verification Script
 * 
 * Runs ESLint on specified components and generates a verification report
 * showing component-level compliance with type safety standards.
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const execPromise = util.promisify(exec);

// Components to verify - extend as needed
const COMPONENTS_TO_VERIFY = [
    'src/features',
    'src/components/UI',
    'src/utils',
    'src/services',
    'src/hooks'
];

// Interface for component verification results
interface ComponentVerification {
    component: string;
    warningCount: number;
    errorCount: number;
    messages: Array<{
        ruleId: string;
        severity: number;
        message: string;
        line: number;
        column: number;
        nodeType: string;
        messageId: string;
        endLine?: number;
        endColumn?: number;
    }>;
    compliant: boolean;
}

// Interface for the verification report
interface VerificationReport {
    timestamp: string;
    summary: {
        totalComponents: number;
        compliantComponents: number;
        compliancePercentage: number;
        totalWarnings: number;
        totalErrors: number;
        typeSafetyScore: number;
    };
    components: ComponentVerification[];
    warningsByRule: Record<string, number>;
    recommendations: string[];
}

/**
 * Runs ESLint on a component and returns the verification results
 */
async function verifyComponent(componentPath: string): Promise<ComponentVerification> {
    try {
        // Run ESLint with JSON output format
        const { stdout } = await execPromise(`npx eslint ${componentPath} --format json`);
        const eslintResults = JSON.parse(stdout);

        // Calculate warnings and errors
        let warningCount = 0;
        let errorCount = 0;
        const messages: ComponentVerification['messages'] = [];

        eslintResults.forEach((result: any) => {
            warningCount += result.warningCount;
            errorCount += result.errorCount;

            result.messages.forEach((msg: any) => {
                messages.push({
                    ruleId: msg.ruleId || 'unknown',
                    severity: msg.severity,
                    message: msg.message,
                    line: msg.line,
                    column: msg.column,
                    nodeType: msg.nodeType || 'unknown',
                    messageId: msg.messageId || 'unknown',
                    endLine: msg.endLine,
                    endColumn: msg.endColumn
                });
            });
        });

        return {
            component: componentPath,
            warningCount,
            errorCount,
            messages,
            compliant: warningCount === 0 && errorCount === 0
        };
    } catch (error) {
        console.error(`Error verifying component ${componentPath}:`, error);
        return {
            component: componentPath,
            warningCount: 0,
            errorCount: 1,
            messages: [{
                ruleId: 'verification-error',
                severity: 2,
                message: `Failed to verify component: ${error}`,
                line: 0,
                column: 0,
                nodeType: 'unknown',
                messageId: 'verification-error'
            }],
            compliant: false
        };
    }
}

/**
 * Analyzes warnings by rule type to generate insights
 */
function analyzeWarnings(components: ComponentVerification[]): Record<string, number> {
    const warningsByRule: Record<string, number> = {};

    components.forEach(component => {
        component.messages.forEach(message => {
            const ruleId = message.ruleId || 'unknown';
            warningsByRule[ruleId] = (warningsByRule[ruleId] || 0) + 1;
        });
    });

    return warningsByRule;
}

/**
 * Generates recommendations based on the verification results
 */
function generateRecommendations(
    components: ComponentVerification[],
    warningsByRule: Record<string, number>
): string[] {
    const recommendations: string[] = [];

    // Add recommendations based on non-compliant components
    const nonCompliantComponents = components.filter(c => !c.compliant);
    if (nonCompliantComponents.length > 0) {
        recommendations.push(
            `Focus on fixing ${nonCompliantComponents.length} non-compliant components, starting with ones having the most warnings.`
        );
    }

    // Add recommendations based on common rule violations
    const sortedRules = Object.entries(warningsByRule)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    if (sortedRules.length > 0) {
        recommendations.push(
            `Address the most common ESLint rule violations: ${sortedRules
                .map(([rule, count]) => `${rule} (${count} occurrences)`)
                .join(', ')}.`
        );
    }

    // Add type safety specific recommendations
    if (warningsByRule['@typescript-eslint/no-explicit-any']) {
        recommendations.push(
            'Replace explicit "any" types with proper interfaces or type definitions.'
        );
    }

    if (warningsByRule['@typescript-eslint/no-unsafe-assignment'] ||
        warningsByRule['@typescript-eslint/no-unsafe-member-access']) {
        recommendations.push(
            'Improve type safety by adding proper type assertions or interface definitions for untyped data.'
        );
    }

    return recommendations;
}

/**
 * Calculates a type safety score based on verification results
 */
function calculateTypeSafetyScore(components: ComponentVerification[]): number {
    const totalFiles = components.length;
    const compliantFiles = components.filter(c => c.compliant).length;
    const totalWarningsAndErrors = components.reduce(
        (sum, c) => sum + c.warningCount + c.errorCount,
        0
    );

    // Base score on percentage of compliant files
    let score = (compliantFiles / totalFiles) * 100;

    // Reduce score based on average warnings per file
    const avgWarningsPerFile = totalWarningsAndErrors / totalFiles;
    score -= Math.min(avgWarningsPerFile * 2, 30); // Cap reduction at 30 points

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Main function to run the verification and generate a report
 */
async function runVerification(): Promise<void> {
    console.log('Starting component verification...');

    // Verify each component
    const verificationPromises = COMPONENTS_TO_VERIFY.map(verifyComponent);
    const components = await Promise.all(verificationPromises);

    // Generate report data
    const warningsByRule = analyzeWarnings(components);
    const recommendations = generateRecommendations(components, warningsByRule);
    const typeSafetyScore = calculateTypeSafetyScore(components);

    // Create summary
    const compliantComponents = components.filter(c => c.compliant).length;
    const totalWarnings = components.reduce((sum, c) => sum + c.warningCount, 0);
    const totalErrors = components.reduce((sum, c) => sum + c.errorCount, 0);

    const report: VerificationReport = {
        timestamp: new Date().toISOString(),
        summary: {
            totalComponents: components.length,
            compliantComponents,
            compliancePercentage: Math.round((compliantComponents / components.length) * 100),
            totalWarnings,
            totalErrors,
            typeSafetyScore
        },
        components,
        warningsByRule,
        recommendations
    };

    // Ensure reports directory exists
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Write report to file
    const reportPath = path.join(reportsDir, 'component-verification-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    generateHtmlReport(report, path.join(reportsDir, 'component-verification-report.html'));

    console.log(`Verification complete. Reports saved to:`);
    console.log(`- JSON: ${reportPath}`);
    console.log(`- HTML: ${path.join(reportsDir, 'component-verification-report.html')}`);

    // Print summary to console
    console.log('\nSUMMARY:');
    console.log(`Type Safety Score: ${typeSafetyScore}/100`);
    console.log(`Compliant Components: ${compliantComponents}/${components.length} (${Math.round((compliantComponents / components.length) * 100)}%)`);
    console.log(`Total Warnings: ${totalWarnings}`);
    console.log(`Total Errors: ${totalErrors}`);

    console.log('\nTOP RECOMMENDATIONS:');
    recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
    });
}

/**
 * Generates an HTML report for better visualization
 */
function generateHtmlReport(report: VerificationReport, outputPath: string): void {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Verification Report</title>
  <style>
    :root {
      --color-primary: #0078d4;
      --color-secondary: #2b88d8;
      --color-background: #f9f9f9;
      --color-text: #333;
      --color-success: #107c10;
      --color-warning: #ff8c00;
      --color-error: #d83b01;
      --color-border: #e0e0e0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: var(--color-text);
      background-color: var(--color-background);
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    h1, h2, h3 {
      color: var(--color-primary);
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .summary-card {
      background-color: white;
      border: 1px solid var(--color-border);
      border-radius: 5px;
      padding: 15px;
      text-align: center;
    }
    
    .summary-card h3 {
      margin-top: 0;
      font-size: 16px;
      color: var(--color-text);
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .score-high { color: var(--color-success); }
    .score-medium { color: var(--color-warning); }
    .score-low { color: var(--color-error); }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    
    th {
      background-color: var(--color-primary);
      color: white;
    }
    
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    .recommendations {
      background-color: #f0f7ff;
      border-left: 4px solid var(--color-secondary);
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .recommendations h2 {
      color: var(--color-secondary);
      margin-top: 0;
    }
    
    .recommendations ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }
    
    .badge-success { background-color: var(--color-success); }
    .badge-warning { background-color: var(--color-warning); }
    .badge-error { background-color: var(--color-error); }
    
    .rules-table td:nth-child(2) {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Component Verification Report</h1>
    <p>Generated on: ${new Date(report.timestamp).toLocaleString()}</p>
    
    <div class="summary">
      <div class="summary-card">
        <h3>Type Safety Score</h3>
        <div class="summary-value ${report.summary.typeSafetyScore >= 80 ? 'score-high' :
            report.summary.typeSafetyScore >= 50 ? 'score-medium' : 'score-low'
        }">${report.summary.typeSafetyScore}/100</div>
      </div>
      
      <div class="summary-card">
        <h3>Component Compliance</h3>
        <div class="summary-value ${report.summary.compliancePercentage >= 80 ? 'score-high' :
            report.summary.compliancePercentage >= 50 ? 'score-medium' : 'score-low'
        }">${report.summary.compliancePercentage}%</div>
        <div>${report.summary.compliantComponents}/${report.summary.totalComponents} components</div>
      </div>
      
      <div class="summary-card">
        <h3>Total Warnings</h3>
        <div class="summary-value ${report.summary.totalWarnings === 0 ? 'score-high' :
            report.summary.totalWarnings < 10 ? 'score-medium' : 'score-low'
        }">${report.summary.totalWarnings}</div>
      </div>
      
      <div class="summary-card">
        <h3>Total Errors</h3>
        <div class="summary-value ${report.summary.totalErrors === 0 ? 'score-high' : 'score-low'
        }">${report.summary.totalErrors}</div>
      </div>
    </div>
    
    <div class="recommendations">
      <h2>Recommendations</h2>
      <ul>
        ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
    
    <h2>Component Details</h2>
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Status</th>
          <th>Warnings</th>
          <th>Errors</th>
        </tr>
      </thead>
      <tbody>
        ${report.components.map(component => `
          <tr>
            <td>${component.component}</td>
            <td>
              <span class="badge ${component.compliant ? 'badge-success' : 'badge-error'}">
                ${component.compliant ? 'Compliant' : 'Non-Compliant'}
              </span>
            </td>
            <td>${component.warningCount}</td>
            <td>${component.errorCount}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <h2>ESLint Rule Violations</h2>
    <table class="rules-table">
      <thead>
        <tr>
          <th>Rule</th>
          <th>Occurrences</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(report.warningsByRule)
            .sort((a, b) => b[1] - a[1])
            .map(([rule, count]) => `
            <tr>
              <td>${rule}</td>
              <td>${count}</td>
            </tr>
          `).join('')}
      </tbody>
    </table>
    
    <h2>Detailed Warnings</h2>
    ${report.components.map(component => `
      <h3>${component.component} (${component.messages.length} issues)</h3>
      ${component.messages.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Line</th>
              <th>Column</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            ${component.messages.map(message => `
              <tr>
                <td>${message.ruleId}</td>
                <td>${message.line}</td>
                <td>${message.column}</td>
                <td>${message.message}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p>No issues found.</p>'}
    `).join('')}
  </div>
</body>
</html>
  `;

    fs.writeFileSync(outputPath, html);
}

// Run the verification process
runVerification().catch(error => {
    console.error('Verification failed:', error);
    process.exit(1);
}); 