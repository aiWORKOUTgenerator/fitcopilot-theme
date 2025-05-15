import fs from 'fs';
import path from 'path';
import { categorizeFailures, generateFailureReport } from './categorizeFailures';
import { collectTestResults } from './collectTestResults';
import { findSharedDependencies, generateDependencyReport } from './findSharedDependencies';

/**
 * Main function to run all analysis tools and generate reports
 * @param testPattern Optional pattern to filter tests
 */
export async function runTestAnalysis(testPattern?: string): Promise<void> {
    console.log('Starting test analysis...');

    // Create output directory
    const outputDir = path.resolve(process.cwd(), 'test-analysis');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        // Step 1: Collect test results
        console.log('Running tests and collecting results...');
        const results = collectTestResults(testPattern);

        console.log(`Tests completed. Found ${results.numFailedTests} failing tests out of ${results.numFailedTests + results.numPassedTests} total.`);

        // Step 2: Categorize failures
        console.log('Categorizing test failures...');
        const categories = categorizeFailures(results);

        // Step 3: Find shared dependencies
        console.log('Analyzing shared dependencies...');
        const dependencies = findSharedDependencies(categories);

        // Step 4: Generate reports
        console.log('Generating reports...');

        const failureReport = generateFailureReport(categories);
        fs.writeFileSync(path.join(outputDir, 'failure-report.md'), failureReport);

        const dependencyReport = generateDependencyReport(dependencies);
        fs.writeFileSync(path.join(outputDir, 'dependency-report.md'), dependencyReport);

        // Save raw data for further analysis
        fs.writeFileSync(
            path.join(outputDir, 'analysis-data.json'),
            JSON.stringify({
                results: {
                    numFailedTests: results.numFailedTests,
                    numPassedTests: results.numPassedTests,
                },
                categories,
                dependencies: {
                    highImpact: dependencies.highImpact,
                    // Simplify feature areas for JSON output
                    byFeatureArea: Object.fromEntries(
                        Object.entries(dependencies.byFeatureArea).map(([area, deps]) => [
                            area,
                            deps.map(d => ({ name: d.name, type: d.type, usageCount: d.usageCount }))
                        ])
                    )
                }
            }, null, 2)
        );

        console.log(`Analysis complete! Reports saved to ${outputDir}`);
        console.log(`- Failure report: ${path.join(outputDir, 'failure-report.md')}`);
        console.log(`- Dependency report: ${path.join(outputDir, 'dependency-report.md')}`);

    } catch (error) {
        console.error('Error during analysis:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    const testPattern = args.length > 0 ? args[0] : undefined;

    runTestAnalysis(testPattern)
        .then(() => {
            console.log('Analysis completed successfully');
        })
        .catch(error => {
            console.error('Analysis failed:', error);
            process.exit(1);
        });
} 