#!/usr/bin/env node

/**
 * Script to replace console statements with structured logger calls
 * 
 * Usage:
 *   node scripts/eslint/fix/replace-console-with-logger.js [--path=<path>]
 * 
 * Example:
 *   node scripts/eslint/fix/replace-console-with-logger.js --path=src/features/shared
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
let targetPath = 'src';

for (const arg of args) {
    if (arg.startsWith('--path=')) {
        targetPath = arg.split('=')[1];
    }
}

// Run ESLint to find console statements
const findConsoleStatements = (searchPath) => {
    try {
        const result = execSync(
            `npx eslint --no-eslintrc --config .eslintrc.js ${searchPath} ` +
            `--rule 'no-console: error' ` +
            `--format json`,
            { encoding: 'utf-8' }
        );
        return JSON.parse(result);
    } catch (error) {
        // ESLint returns non-zero exit code when there are warnings/errors
        return JSON.parse(error.stdout);
    }
};

// Extract console statements from ESLint messages
const extractConsoleStatements = (eslintResults) => {
    const fileConsole = {};

    eslintResults.forEach(result => {
        const filePath = result.filePath;

        if (!fileConsole[filePath]) {
            fileConsole[filePath] = [];
        }

        result.messages.forEach(message => {
            if (message.ruleId === 'no-console') {
                fileConsole[filePath].push({
                    line: message.line,
                    column: message.column,
                    type: message.message.includes('console.log') ? 'log' :
                        message.message.includes('console.info') ? 'info' :
                            message.message.includes('console.warn') ? 'warn' :
                                message.message.includes('console.error') ? 'error' : 'debug'
                });
            }
        });
    });

    return fileConsole;
};

// Check if file already imports logger
const hasLoggerImport = (content) => {
    return content.includes('import logger') || content.includes('import { logger }');
};

// Add logger import to a file
const addLoggerImport = (content) => {
    // Find the last import statement
    const importRegex = /import .+ from ['"'].+['"'];?(?=\n)/g;
    const imports = [...content.matchAll(importRegex)];

    if (imports.length === 0) {
        // No imports found, add at the beginning
        return `import logger from '../../utils/logger';\n\n${content}`;
    }

    // Find the position after the last import
    const lastImport = imports[imports.length - 1];
    const position = lastImport.index + lastImport[0].length;

    // Add import after last existing import
    return (
        content.substring(0, position + 1) +
        '\nimport logger from \'../../utils/logger\';' +
        content.substring(position + 1)
    );
};

// Replace console statements with logger calls
const replaceConsoleStatements = (fileConsole) => {
    const fileCount = Object.keys(fileConsole).length;
    let totalReplaced = 0;
    let totalStatements = 0;

    console.log(`\nProcessing ${fileCount} files with console statements...`);

    for (const [filePath, statements] of Object.entries(fileConsole)) {
        if (statements.length === 0) continue;

        totalStatements += statements.length;
        let content = fs.readFileSync(filePath, 'utf-8');

        // Check if we need to add logger import
        let needsImport = !hasLoggerImport(content);

        // Find all console statements in the file content
        const consoleRegex = /console\.(log|info|warn|error|debug)\s*\(\s*([^)]*)\)/g;

        // Replace console statements with logger calls
        const replacedContent = content.replace(consoleRegex, (match, consoleType, args) => {
            totalReplaced++;

            // Map console level to logger level
            const loggerLevel = consoleType === 'log' ? 'info' : consoleType;

            // Parse arguments - this is a simple approach and may need refinement
            // for complex cases with object literals, template literals, etc.
            const argsList = args.trim();

            if (!argsList) {
                return `logger.${loggerLevel}('${loggerLevel} message')`;
            }

            // Check if there's already an object context
            if (argsList.includes(',')) {
                // Format first string arg as message and rest as context
                const firstComma = argsList.indexOf(',');
                const firstArg = argsList.substring(0, firstComma).trim();
                const restArgs = argsList.substring(firstComma + 1).trim();

                // If first arg is a string (quoted), use it as message
                if ((firstArg.startsWith('"') && firstArg.endsWith('"')) ||
                    (firstArg.startsWith("'") && firstArg.endsWith("'"))) {
                    return `logger.${loggerLevel}(${firstArg}, ${restArgs})`;
                }

                // Otherwise, use default message and all args as context
                return `logger.${loggerLevel}('${loggerLevel} message', { value: ${firstArg}, ${restArgs} })`;
            }

            // Single argument
            // If it's a string (quoted), use as message
            if ((argsList.startsWith('"') && argsList.endsWith('"')) ||
                (argsList.startsWith("'") && argsList.endsWith("'"))) {
                return `logger.${loggerLevel}(${argsList})`;
            }

            // If it's an object literal, use as context with default message
            if (argsList.startsWith('{') && argsList.endsWith('}')) {
                return `logger.${loggerLevel}('${loggerLevel} message', ${argsList})`;
            }

            // For other types (variables, expressions), wrap in context object
            return `logger.${loggerLevel}('${loggerLevel} message', { value: ${argsList} })`;
        });

        // Add logger import if needed
        const finalContent = needsImport && totalReplaced > 0
            ? addLoggerImport(replacedContent)
            : replacedContent;

        // Only write if changes were made
        if (finalContent !== content) {
            fs.writeFileSync(filePath, finalContent, 'utf-8');
            console.log(`✓ Replaced ${statements.length} console statements in ${path.relative(process.cwd(), filePath)}`);
        }
    }

    return { totalReplaced, totalStatements };
};

// Main function
const main = () => {
    console.log(`Scanning for console statements in ${targetPath}...`);

    const eslintResults = findConsoleStatements(targetPath);
    const fileConsole = extractConsoleStatements(eslintResults);

    // Filter out files with no console statements
    const filesToFix = Object.entries(fileConsole)
        .filter(([_, statements]) => statements.length > 0)
        .reduce((acc, [file, statements]) => {
            acc[file] = statements;
            return acc;
        }, {});

    if (Object.keys(filesToFix).length === 0) {
        console.log('No console statements found!');
        return;
    }

    const { totalReplaced, totalStatements } = replaceConsoleStatements(filesToFix);

    console.log(`\nSummary:`);
    console.log(`✓ Replaced ${totalReplaced} console statements out of ${totalStatements} detected`);
    console.log(`✓ Processed ${Object.keys(filesToFix).length} files\n`);
};

main(); 