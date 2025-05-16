#!/usr/bin/env node
/**
 * Check New Any Types
 * 
 * Detects newly introduced 'any' types in PR changed files.
 * Usage: node check-new-any-types.js file1.ts file2.ts ...
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get changed files from command line arguments
const changedFiles = process.argv.slice(2);

if (changedFiles.length === 0) {
    console.log('No files specified. Usage: node check-new-any-types.js file1.ts file2.ts ...');
    process.exit(0);
}

/**
 * Regular expressions to detect 'any' type usage
 */
const ANY_TYPE_PATTERNS = [
    /:\s*any\b/, // Type annotation: any
    /<any>/, // Generic type <any>
    /as\s+any\b/, // Type assertion as any
    /\[\]\s*as\s+any\b/, // Empty array as any
    /:\s*Array<any>/, // Array<any>
    /:\s*Record<string,\s*any>/, // Record<string, any>
    /:\s*Map<\w+,\s*any>/, // Map<K, any>
    /:\s*Promise<any>/, // Promise<any>
];

/**
 * Acceptable patterns we won't flag (exceptions)
 */
const EXCEPTIONS = [
    /\/\/.*any/, // any in a comment
    /\*.*any/, // any in a multiline comment
    /eslint-disable.*@typescript-eslint\/no-explicit-any/, // ESLint disable comment
    /@ts-ignore.*any/, // TS ignore comment
    /import.*any.*from/, // import statement
];

/**
 * Check for new 'any' types in the specified files
 */
function checkForNewAnyTypes() {
    let anyTypesFound = false;
    const violations = [];

    console.log(`Checking ${changedFiles.length} files for new 'any' types...`);

    changedFiles.forEach(file => {
        // Skip non-TypeScript files
        if (!file.endsWith('.ts') && !file.endsWith('.tsx')) {
            return;
        }

        try {
            // Get git diff for the file
            const diff = execSync(`git diff origin/main...HEAD -- "${file}"`).toString();

            // Process diff to find added lines with 'any' types
            const lines = diff.split('\n');
            const addedLines = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Only check added lines (those starting with +)
                if (line.startsWith('+') && !line.startsWith('+++')) {
                    const code = line.substring(1); // Remove the leading +

                    // Check if this line has an 'any' type
                    const hasAnyType = ANY_TYPE_PATTERNS.some(pattern => pattern.test(code));

                    // Check if this is an exception we should ignore
                    const isException = EXCEPTIONS.some(pattern => pattern.test(code));

                    if (hasAnyType && !isException) {
                        addedLines.push({
                            content: code,
                            line: i + 1 // Line number in diff
                        });
                    }
                }
            }

            // If we found any 'any' types, record them
            if (addedLines.length > 0) {
                anyTypesFound = true;
                violations.push({
                    file,
                    lines: addedLines
                });
            }
        } catch (error) {
            // If git diff fails, it might be a new file
            if (error.message.includes('fatal: Bad revision')) {
                try {
                    // Check the entire file for new files
                    const content = fs.readFileSync(file, 'utf-8');
                    const lines = content.split('\n');
                    const anyLines = [];

                    lines.forEach((line, index) => {
                        const hasAnyType = ANY_TYPE_PATTERNS.some(pattern => pattern.test(line));
                        const isException = EXCEPTIONS.some(pattern => pattern.test(line));

                        if (hasAnyType && !isException) {
                            anyLines.push({
                                content: line,
                                line: index + 1 // Line number in file
                            });
                        }
                    });

                    if (anyLines.length > 0) {
                        anyTypesFound = true;
                        violations.push({
                            file,
                            lines: anyLines,
                            isNewFile: true
                        });
                    }
                } catch (readError) {
                    console.error(`Error reading file ${file}:`, readError.message);
                }
            } else {
                console.error(`Error checking diff for ${file}:`, error.message);
            }
        }
    });

    // If any violations were found, report them
    if (violations.length > 0) {
        console.error('\n❌ PR check failed: New any types were introduced.\n');

        violations.forEach(violation => {
            console.error(`File: ${violation.file}${violation.isNewFile ? ' (new file)' : ''}`);
            violation.lines.forEach(line => {
                console.error(`  Line ${line.line}: ${line.content.trim()}`);
            });
            console.error('');
        });

        console.error('Please use proper types according to our type safety patterns:');
        console.error('- See docs/type-safety-patterns.md for guidance');
        console.error('- Consider using Record<string, unknown> instead of any for objects');
        console.error('- Use unknown with type guards for values of uncertain type');
        console.error('- Create proper interfaces for complex structures');
        console.error('- Use Partial<T> for incomplete structures of known types');

        // Exit with error code to fail CI check
        process.exit(1);
    } else {
        console.log('✅ No new any types found in changed files.');
    }
}

// Run the check
checkForNewAnyTypes(); 