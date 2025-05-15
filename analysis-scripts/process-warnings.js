/**
 * ESLint Warning Processor
 * Analyzes ESLint JSON output and generates reports
 */

const fs = require('fs');
const path = require('path');

// Read ESLint JSON output
const eslintOutputPath = path.join(__dirname, 'eslint-output.json');
const eslintOutput = JSON.parse(fs.readFileSync(eslintOutputPath, 'utf8'));

// Group warnings by type and file
const warningsByType = {};
const warningsByFile = {};
const fileLineCount = {};

// Process the warnings
eslintOutput.forEach(result => {
    const filePath = result.filePath;
    const relPath = path.relative(process.cwd(), filePath);

    // Count lines in file for density calculation
    if (!fileLineCount[relPath]) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            fileLineCount[relPath] = content.split('\n').length;
        } catch (error) {
            console.error(`Error reading file ${filePath}: ${error.message}`);
            fileLineCount[relPath] = 1; // Default to avoid division by zero
        }
    }

    // Process messages
    result.messages.forEach(message => {
        const ruleId = message.ruleId || 'unknown';

        // Add to warnings by type
        if (!warningsByType[ruleId]) {
            warningsByType[ruleId] = [];
        }
        warningsByType[ruleId].push({
            file: relPath,
            line: message.line,
            message: message.message
        });

        // Add to warnings by file
        if (!warningsByFile[relPath]) {
            warningsByFile[relPath] = [];
        }
        warningsByFile[relPath].push({
            rule: ruleId,
            line: message.line,
            message: message.message
        });
    });
});

// Calculate warning density (warnings per 100 lines)
const warningDensity = {};
Object.keys(warningsByFile).forEach(file => {
    warningDensity[file] = (warningsByFile[file].length / fileLineCount[file]) * 100;
});

// Sort files by warning count
const filesSortedByWarningCount = Object.entries(warningsByFile)
    .sort((a, b) => b[1].length - a[1].length);

// Sort warning types by frequency
const warningTypesSortedByCount = Object.entries(warningsByType)
    .sort((a, b) => b[1].length - a[1].length);

// Sort files by density
const filesSortedByDensity = Object.entries(warningDensity)
    .sort((a, b) => b[1] - a[1]);

// Generate markdown report
function generateMarkdownReport() {
    let report = `# ESLint Warning Analysis Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;

    // Summary section
    const totalWarnings = Object.values(warningsByType).reduce((sum, warnings) => sum + warnings.length, 0);
    const totalFiles = Object.keys(warningsByFile).length;

    report += `## Summary\n\n`;
    report += `- **Total Warnings**: ${totalWarnings}\n`;
    report += `- **Files with Warnings**: ${totalFiles}\n`;
    report += `- **Warning Types**: ${Object.keys(warningsByType).length}\n\n`;

    // Warning types section
    report += `## Warning Types by Frequency\n\n`;
    report += `| Rule ID | Count | Description |\n`;
    report += `|---------|-------|-------------|\n`;

    warningTypesSortedByCount.forEach(([ruleId, warnings]) => {
        // Get a sample warning message for description
        const sampleMessage = warnings[0]?.message || '';
        report += `| ${ruleId} | ${warnings.length} | ${sampleMessage.slice(0, 50)}${sampleMessage.length > 50 ? '...' : ''} |\n`;
    });

    report += `\n`;

    // Files with most warnings
    report += `## Top 10 Files by Warning Count\n\n`;
    report += `| File | Warnings | Lines | Density (per 100 lines) |\n`;
    report += `|------|----------|-------|------------------------|\n`;

    filesSortedByWarningCount.slice(0, 10).forEach(([file, warnings]) => {
        const lines = fileLineCount[file] || 1;
        const density = ((warnings.length / lines) * 100).toFixed(2);
        report += `| ${file} | ${warnings.length} | ${lines} | ${density} |\n`;
    });

    report += `\n`;

    // Files with highest warning density
    report += `## Top 10 Files by Warning Density\n\n`;
    report += `| File | Density (per 100 lines) | Warnings | Lines |\n`;
    report += `|------|--------------------------|----------|-------|\n`;

    filesSortedByDensity.slice(0, 10).forEach(([file, density]) => {
        const warnings = warningsByFile[file].length;
        const lines = fileLineCount[file] || 1;
        report += `| ${file} | ${density.toFixed(2)} | ${warnings} | ${lines} |\n`;
    });

    report += `\n`;

    // File details section - for top problematic files
    report += `## Detailed Warnings for Top 5 Files\n\n`;

    filesSortedByWarningCount.slice(0, 5).forEach(([file, warnings]) => {
        report += `### ${file}\n\n`;
        report += `${warnings.length} warnings, ${fileLineCount[file] || 'unknown'} lines\n\n`;
        report += `| Line | Rule | Message |\n`;
        report += `|------|------|--------|\n`;

        warnings.forEach(warning => {
            const escapedMessage = warning.message.replace(/\|/g, '\\|');
            report += `| ${warning.line} | ${warning.rule} | ${escapedMessage} |\n`;
        });

        report += `\n`;
    });

    // Write report to file
    const reportPath = path.join(__dirname, 'reports', 'eslint-warnings-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`Markdown report written to ${reportPath}`);
}

// Generate CSV reports
function generateCsvReports() {
    // Warnings by file CSV
    let csvByFile = 'File,Warnings,Lines,Density\n';
    filesSortedByWarningCount.forEach(([file, warnings]) => {
        const lines = fileLineCount[file] || 1;
        const density = ((warnings.length / lines) * 100).toFixed(2);
        csvByFile += `"${file}",${warnings.length},${lines},${density}\n`;
    });

    const fileReportPath = path.join(__dirname, 'reports', 'warnings-by-file.csv');
    fs.writeFileSync(fileReportPath, csvByFile);
    console.log(`CSV report by file written to ${fileReportPath}`);

    // Warnings by type CSV
    let csvByType = 'Rule,Count\n';
    warningTypesSortedByCount.forEach(([ruleId, warnings]) => {
        csvByType += `"${ruleId}",${warnings.length}\n`;
    });

    const typeReportPath = path.join(__dirname, 'reports', 'warnings-by-type.csv');
    fs.writeFileSync(typeReportPath, csvByType);
    console.log(`CSV report by type written to ${typeReportPath}`);
}

// Generate reports
generateMarkdownReport();
generateCsvReports(); 