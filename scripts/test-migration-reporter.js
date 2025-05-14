/**
 * Test Migration Reporter
 * 
 * Custom Jest reporter that tracks test migration progress and
 * categorizes failures by component.
 */

const fs = require('fs');
const path = require('path');

class TestMigrationReporter {
    constructor(globalConfig, reporterOptions) {
        this._globalConfig = globalConfig;
        this._options = reporterOptions;

        // Options 
        this._outputFile = reporterOptions.outputFile || 'test-migration-status.json';
        this._outputDir = reporterOptions.outputDir || './reports';

        // Ensure output directory exists
        if (!fs.existsSync(this._outputDir)) {
            fs.mkdirSync(this._outputDir, { recursive: true });
        }

        // Initialize counters
        this._componentResults = {
            Media: { total: 0, passed: 0, failed: 0, skipped: 0 },
            Button: { total: 0, passed: 0, failed: 0, skipped: 0 },
            Card: { total: 0, passed: 0, failed: 0, skipped: 0 },
            Other: { total: 0, passed: 0, failed: 0, skipped: 0 }
        };

        this._failedTests = [];
    }

    /**
     * Called when all tests complete
     */
    onRunComplete(contexts, results) {
        // Process test results
        this._processResults(results);

        // Print summary to console
        this._printSummary(results);

        // Write report file
        this._writeReport(results);
    }

    /**
     * Process test results and categorize by component
     */
    _processResults(results) {
        results.testResults.forEach(testFile => {
            const filePath = testFile.testFilePath;
            let component = 'Other';

            // Determine component
            if (filePath.includes('/Media/')) {
                component = 'Media';
            } else if (filePath.includes('/Button/')) {
                component = 'Button';
            } else if (filePath.includes('/Card/')) {
                component = 'Card';
            }

            // Process individual test results
            testFile.testResults.forEach(test => {
                this._componentResults[component].total++;

                switch (test.status) {
                    case 'passed':
                        this._componentResults[component].passed++;
                        break;
                    case 'failed':
                        this._componentResults[component].failed++;
                        this._failedTests.push({
                            component,
                            name: test.title,
                            path: filePath,
                            failureMessage: test.failureMessages.join('\n')
                        });
                        break;
                    case 'pending':
                        this._componentResults[component].skipped++;
                        break;
                }
            });
        });
    }

    /**
     * Print summary to console
     */
    _printSummary(results) {
        const totalTests = results.numTotalTests;
        const passedTests = results.numPassedTests;
        const failedTests = results.numFailedTests;
        const skippedTests = results.numPendingTests;
        const progress = ((passedTests / (totalTests - skippedTests)) * 100).toFixed(2);

        console.log('\n====== TEST MIGRATION PROGRESS ======');
        console.log(`Progress: ${progress}% (${passedTests}/${totalTests - skippedTests})`);
        console.log(`Total: ${totalTests}, Passed: ${passedTests}, Failed: ${failedTests}, Skipped: ${skippedTests}`);

        // Print component breakdown
        console.log('\n==== COMPONENT STATUS BREAKDOWN ====');
        Object.entries(this._componentResults).forEach(([component, stats]) => {
            const componentProgress = stats.total === 0 ?
                '0.00' : ((stats.passed / (stats.total - stats.skipped)) * 100).toFixed(2);

            console.log(`${component}: ${componentProgress}% (${stats.passed}/${stats.total - stats.skipped})`);
            console.log(`  Total: ${stats.total}, Passed: ${stats.passed}, Failed: ${stats.failed}, Skipped: ${stats.skipped}`);
        });
        console.log('====================================');
    }

    /**
     * Write report file
     */
    _writeReport(results) {
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                total: results.numTotalTests,
                passed: results.numPassedTests,
                failed: results.numFailedTests,
                skipped: results.numPendingTests,
                progress: ((results.numPassedTests / (results.numTotalTests - results.numPendingTests)) * 100).toFixed(2)
            },
            components: this._componentResults,
            failedTests: this._failedTests
        };

        // Write the report file
        const outputPath = path.join(this._outputDir, this._outputFile);
        fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 2));
        console.log(`\nTest migration report written to: ${outputPath}`);
    }
}

module.exports = TestMigrationReporter; 