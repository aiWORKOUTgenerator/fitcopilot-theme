#!/usr/bin/env node
/**
 * Type Coverage Reporter
 * 
 * Generates TypeScript type coverage reports for the project.
 * Requires type-coverage package: npm install -D type-coverage
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration options
const CONFIG = {
    threshold: 95, // Minimum acceptable coverage percentage
    outputDir: './reports',
    jsonOutput: 'type-coverage.json',
    htmlOutput: 'type-coverage-report.html',
    detailedReport: true
};

/**
 * Run type-coverage and generate coverage report
 */
function generateTypeCoverageReport() {
    try {
        console.log('Generating type coverage report...');

        // Ensure reports directory exists
        if (!fs.existsSync(CONFIG.outputDir)) {
            fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        }

        // Build the command with detailed output if needed
        const detailFlag = CONFIG.detailedReport ? '--detail' : '';
        const cmd = `npx type-coverage ${detailFlag} --ignore-catch`;

        // Run type-coverage command and capture output
        const output = execSync(cmd).toString();

        // Parse the output to get coverage percentage
        // The output looks like: "26500 / 27000 (98.15%)"
        const coverageMatch = output.match(/(\d+)\s*\/\s*(\d+)\s*\((\d+\.\d+)%\)/);

        if (!coverageMatch) {
            throw new Error('Could not parse type coverage output');
        }

        const anyCount = parseInt(coverageMatch[2]) - parseInt(coverageMatch[1]);
        const coverage = parseFloat(coverageMatch[3]);

        // Generate report data
        const reportData = {
            timestamp: new Date().toISOString(),
            anyCount: anyCount,
            totalCount: parseInt(coverageMatch[2]),
            coverage: coverage,
            threshold: CONFIG.threshold,
            pass: coverage >= CONFIG.threshold
        };

        // Get detailed breakdown of files with 'any' types if requested
        if (CONFIG.detailedReport) {
            // Run the detail command to get per-file breakdown
            const detailOutput = execSync('npx type-coverage --detail --ignore-catch').toString();
            const detailLines = detailOutput.split('\n').filter(line => line.includes(':'));

            // Parse detailed output into file report
            const fileReports = [];
            detailLines.forEach(line => {
                // Example line: "src/app.ts:15:10 - Expression typed as any"
                const match = line.match(/([^:]+):(\d+):(\d+) - (.+)/);
                if (match) {
                    fileReports.push({
                        file: match[1],
                        line: parseInt(match[2]),
                        column: parseInt(match[3]),
                        message: match[4]
                    });
                }
            });

            // Group by file for better reporting
            const fileIndex = {};
            fileReports.forEach(report => {
                if (!fileIndex[report.file]) {
                    fileIndex[report.file] = [];
                }
                fileIndex[report.file].push(report);
            });

            // Add to report data
            reportData.fileReports = Object.keys(fileIndex)
                .map(file => ({
                    file,
                    anyCount: fileIndex[file].length,
                    details: fileIndex[file]
                }))
                .sort((a, b) => b.anyCount - a.anyCount);
        }

        // Write JSON report
        const jsonFilePath = path.join(CONFIG.outputDir, CONFIG.jsonOutput);
        fs.writeFileSync(jsonFilePath, JSON.stringify(reportData, null, 2));
        console.log(`JSON report written to ${jsonFilePath}`);

        // Generate and write HTML report
        const htmlFilePath = path.join(CONFIG.outputDir, CONFIG.htmlOutput);
        const html = generateHTMLReport(reportData);
        fs.writeFileSync(htmlFilePath, html);
        console.log(`HTML report written to ${htmlFilePath}`);

        // Log summary
        console.log(`\nType Coverage Summary:`);
        console.log(`- Coverage: ${coverage.toFixed(2)}% (${coverageMatch[1]} / ${coverageMatch[2]})`);
        console.log(`- Any types: ${anyCount}`);
        console.log(`- Threshold: ${CONFIG.threshold}%`);
        console.log(`- Status: ${reportData.pass ? '✅ PASS' : '❌ FAIL'}`);

        // Exit with error if below threshold
        if (!reportData.pass) {
            console.error(`\n❌ Type coverage ${coverage.toFixed(2)}% is below threshold of ${CONFIG.threshold}%`);
            process.exit(1);
        }

        return reportData;
    } catch (error) {
        console.error('Error generating type coverage report:', error);
        process.exit(1);
    }
}

/**
 * Generate HTML report from coverage data
 */
function generateHTMLReport(data) {
    const fileReportsHtml = data.fileReports ? generateFileReportsHtml(data.fileReports) : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript Type Coverage Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    h1 {
      margin-top: 0;
      font-weight: 600;
    }
    .summary {
      background: #f9f9f9;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .progress {
      width: 100%;
      background-color: #e0e0e0;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .progress-bar {
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
    }
    .pass {
      background-color: #4caf50;
    }
    .fail {
      background-color: #f44336;
    }
    .summary-data {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    }
    .summary-item {
      padding: 10px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary-item h3 {
      margin-top: 0;
      margin-bottom: 5px;
      font-size: 16px;
      color: #666;
    }
    .summary-item p {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .file-reports {
      margin-top: 30px;
    }
    .file-reports h2 {
      margin-top: 0;
      margin-bottom: 15px;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    tr:hover {
      background-color: #f9f9f9;
    }
    .file-name {
      font-family: monospace;
      word-break: break-all;
    }
    .count {
      text-align: right;
    }
    .timestamp {
      color: #666;
      font-size: 14px;
    }
    .status-indicator {
      display: inline-block;
      margin-left: 10px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>TypeScript Type Coverage Report
        <span class="status-indicator">${data.pass ? '✅' : '❌'}</span>
      </h1>
      <p class="timestamp">Generated on ${new Date(data.timestamp).toLocaleString()}</p>
    </header>
    
    <section class="summary">
      <div class="progress">
        <div class="progress-bar ${data.pass ? 'pass' : 'fail'}" style="width: ${data.coverage}%">
          ${data.coverage.toFixed(2)}%
        </div>
      </div>
      
      <div class="summary-data">
        <div class="summary-item">
          <h3>Coverage</h3>
          <p>${data.coverage.toFixed(2)}%</p>
        </div>
        <div class="summary-item">
          <h3>Any Types</h3>
          <p>${data.anyCount}</p>
        </div>
        <div class="summary-item">
          <h3>Total Nodes</h3>
          <p>${data.totalCount}</p>
        </div>
        <div class="summary-item">
          <h3>Threshold</h3>
          <p>${data.threshold}%</p>
        </div>
      </div>
    </section>
    
    ${fileReportsHtml}
  </div>
</body>
</html>
  `;
}

/**
 * Generate HTML table for file reports
 */
function generateFileReportsHtml(fileReports) {
    if (!fileReports || fileReports.length === 0) {
        return '';
    }

    const tableRows = fileReports
        .map(report => `
      <tr>
        <td class="file-name">${report.file}</td>
        <td class="count">${report.anyCount}</td>
      </tr>
    `)
        .join('');

    return `
    <section class="file-reports">
      <h2>Files with 'any' Types</h2>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th class="count">Count</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </section>
  `;
}

// Run the report generation
generateTypeCoverageReport(); 