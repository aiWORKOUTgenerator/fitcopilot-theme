#!/usr/bin/env node

/**
 * Find Any Types Script
 * 
 * This script finds all uses of the 'any' type in TypeScript files
 * and organizes them by file.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get eslint output
const getEslintWarnings = () => {
    try {
        const output = execSync('npx eslint src --no-fix --format json', { encoding: 'utf8' });
        return JSON.parse(output);
    } catch (error) {
        // When ESLint finds issues, it exits with a non-zero code, but we still want the output
        return JSON.parse(error.stdout);
    }
};

// Get any type warnings
const getAnyTypeWarnings = (eslintOutput) => {
    const anyTypes = [];

    eslintOutput.forEach(fileResult => {
        const filePath = fileResult.filePath;

        fileResult.messages
            .filter(msg => msg.ruleId === '@typescript-eslint/no-explicit-any')
            .forEach(warning => {
                anyTypes.push({
                    filePath,
                    line: warning.line,
                    column: warning.column,
                    message: warning.message
                });
            });
    });

    return anyTypes;
};

// Get the code context for each any type
const getAnyTypeContexts = (anyTypes) => {
    const fileContents = {};
    const contexts = [];

    anyTypes.forEach(anyType => {
        const { filePath, line, column } = anyType;

        // Cache file contents to avoid reading the same file multiple times
        if (!fileContents[filePath]) {
            fileContents[filePath] = fs.readFileSync(filePath, 'utf8').split('\n');
        }

        const lines = fileContents[filePath];
        const startLine = Math.max(0, line - 3);
        const endLine = Math.min(lines.length - 1, line + 1);

        // Extract the code context
        const context = lines.slice(startLine, endLine + 1).join('\n');
        const lineContent = lines[line - 1];

        contexts.push({
            ...anyType,
            context,
            lineContent,
            fileName: path.basename(filePath)
        });
    });

    return contexts;
};

// Group warnings by file
const groupByFile = (contexts) => {
    const byFile = {};

    contexts.forEach(context => {
        if (!byFile[context.filePath]) {
            byFile[context.filePath] = [];
        }
        byFile[context.filePath].push(context);
    });

    return byFile;
};

// Print the report
const printReport = (groupedContexts) => {
    console.log('='.repeat(80));
    console.log(`FOUND ${Object.values(groupedContexts).flat().length} ANY TYPES IN ${Object.keys(groupedContexts).length} FILES`);
    console.log('='.repeat(80));

    Object.entries(groupedContexts).forEach(([filePath, contexts]) => {
        console.log(`\n[${contexts.length}] ${filePath}`);
        console.log('-'.repeat(80));

        contexts.forEach(({ line, column, lineContent }) => {
            console.log(`Line ${line}:${column}: ${lineContent.trim()}`);
        });
    });

    console.log('\n');
    console.log('='.repeat(80));
    console.log('RECOMMENDATIONS FOR FIXING:');
    console.log('='.repeat(80));
    console.log(`
1. For event handlers: 
   - Replace 'any' with specific event types from React
   Example: (e: any) => void → (e: React.MouseEvent<HTMLButtonElement>) => void

2. For unknown data types:
   - Use 'unknown' instead of 'any' and add type guards
   Example: function process(data: any) → function process(data: unknown)

3. For object types with unknown structure:
   - Use Record<string, unknown> instead of any
   Example: const config: any = {} → const config: Record<string, unknown> = {}

4. For arrays of unknown type:
   - Use unknown[] instead of any[]
   Example: const items: any[] = [] → const items: unknown[] = []

5. For function parameters:
   - Create appropriate interfaces or type aliases
   Example: function handleData(data: any) → function handleData(data: DataType)

6. For complex typings that need temporary any:
   - Use @ts-expect-error with a comment explaining why
   Example: // @ts-expect-error - API response format varies, will be validated at runtime
  `);
};

// Main function
const main = () => {
    console.log('Getting ESLint warnings...');
    const eslintOutput = getEslintWarnings();

    console.log('Finding any type usages...');
    const anyTypes = getAnyTypeWarnings(eslintOutput);

    if (anyTypes.length === 0) {
        console.log('No "any" type usages found.');
        return;
    }

    console.log('Getting context for each any type...');
    const contexts = getAnyTypeContexts(anyTypes);

    console.log('Generating report...');
    const groupedContexts = groupByFile(contexts);

    printReport(groupedContexts);
};

main(); 