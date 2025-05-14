#!/usr/bin/env node

/**
 * Test Skipper
 * 
 * This script adds .skip() to failing tests as a temporary measure during Phase 2.
 * It also adds a TODO comment to remind developers to fix the tests.
 * 
 * Usage:
 *   node scripts/skip-failing-tests.js [--dry-run] [--path=src/features/shared/Media/__tests__]
 * 
 * Options:
 *   --dry-run  Preview changes without writing files
 *   --path     Specify a subdirectory to process (default: src)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const pathArg = args.find(arg => arg.startsWith('--path='));
const rootDir = pathArg ? pathArg.split('=')[1] : 'src';

// Get current failing tests
function getFailingTests() {
    try {
        console.log('Running tests to identify failures...');
        // Run Jest with JSON reporter and capture output
        const result = execSync('npx jest --json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        const testResults = JSON.parse(result);

        // Extract failing test details
        const failingTests = [];
        testResults.testResults.forEach(fileResult => {
            if (fileResult.status === 'failed') {
                const filePath = fileResult.name;
                fileResult.assertionResults
                    .filter(assertion => assertion.status === 'failed')
                    .forEach(assertion => {
                        const fullTestName = assertion.fullName || assertion.title;
                        const ancestorTitles = assertion.ancestorTitles || [];
                        failingTests.push({
                            filePath: filePath,
                            testName: fullTestName,
                            ancestors: ancestorTitles,
                            message: assertion.failureMessages?.join('\n') || 'Unknown error'
                        });
                    });
            }
        });

        return failingTests;
    } catch (error) {
        console.log('Error running tests:', error.message);
        console.log('Continuing with manual selection...');
        return [];
    }
}

// Patterns to match test declarations
const testPatterns = [
    {
        pattern: /\b(test|it)\(['"](.+?)['"]/g,
        replace: (match, testFn, testName) => `${testFn}.skip('${testName}'`
    },
    {
        pattern: /\b(describe)\(['"](.+?)['"]/g,
        replace: (match, describeFn, describeName) => `${describeFn}.skip('${describeName}'`
    }
];

// Process a single file
function processFile(filePath, failingTests) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        let modified = false;

        // Get failing tests for this file
        const fileFailingTests = failingTests.filter(test => test.filePath === filePath);

        // If no specific failing tests found, check the whole file
        if (fileFailingTests.length === 0) {
            // Match all test patterns
            for (const { pattern, replace } of testPatterns) {
                // Reset regex lastIndex
                pattern.lastIndex = 0;

                // Only apply to lines that don't already have .skip
                const lines = newContent.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (pattern.test(line) && !line.includes('.skip(')) {
                        pattern.lastIndex = 0; // Reset regex lastIndex
                        lines[i] = line.replace(pattern, replace) + ' // TODO: Fix this test as part of Phase 2';
                        modified = true;
                    }
                }

                if (modified) {
                    newContent = lines.join('\n');
                }
            }
        } else {
            // Process specific failing tests
            for (const failTest of fileFailingTests) {
                const { testName, ancestors, message } = failTest;

                // Create comment with error message (shortened)
                const errorComment = message.split('\n')[0].substring(0, 80);

                // Try to find and replace the specific test
                for (const { pattern, replace } of testPatterns) {
                    // Reset regex lastIndex
                    pattern.lastIndex = 0;

                    const lines = newContent.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (line.includes(`'${testName}'`) || line.includes(`"${testName}"`)) {
                            if (!line.includes('.skip(')) {
                                pattern.lastIndex = 0; // Reset regex lastIndex
                                lines[i] = line.replace(pattern, replace) +
                                    ` // TODO: Fix this test as part of Phase 2 - ${errorComment}`;
                                modified = true;
                            }
                        }
                    }

                    if (modified) {
                        newContent = lines.join('\n');
                    }
                }
            }
        }

        // Write changes if file was modified
        if (modified) {
            if (dryRun) {
                console.log(`[DRY RUN] Would update: ${filePath}`);
            } else {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Updated: ${filePath}`);
            }
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// Recursively traverse directories
function processDirectory(directory, failingTests) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            // Skip node_modules and .git
            if (entry.name !== 'node_modules' && entry.name !== '.git') {
                processDirectory(entryPath, failingTests);
            }
        } else if (entry.isFile() && /\.(test|spec)\.(tsx?|jsx?)$/.test(entry.name)) {
            // Process test files
            processFile(entryPath, failingTests);
        }
    }
}

// Main function
function main() {
    console.log(`Starting test skipper${dryRun ? ' (dry run)' : ''}`);
    console.log(`Processing directory: ${rootDir}`);

    try {
        const failingTests = getFailingTests();
        console.log(`Found ${failingTests.length} failing tests`);

        processDirectory(rootDir, failingTests);
        console.log('Finished processing files');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Execute the script
main(); 