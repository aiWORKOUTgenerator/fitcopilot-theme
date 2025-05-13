#!/usr/bin/env node

/**
 * Script to automatically prefix unused variables with an underscore
 * 
 * Usage:
 *   node scripts/eslint/fix/prefix-unused-vars.js [--path=<path>]
 * 
 * Example:
 *   node scripts/eslint/fix/prefix-unused-vars.js --path=src/features/shared
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

// Run ESLint to find unused variables
const findUnusedVariables = (searchPath) => {
    try {
        const result = execSync(
            `npx eslint --no-eslintrc --config .eslintrc.js ${searchPath} ` +
            `--rule 'no-unused-vars: error' ` +
            `--format json`,
            { encoding: 'utf-8' }
        );
        return JSON.parse(result);
    } catch (error) {
        // ESLint returns non-zero exit code when there are warnings/errors
        return JSON.parse(error.stdout);
    }
};

// Extract variable names from ESLint messages
const extractUnusedVars = (eslintResults) => {
    const fileVars = {};

    eslintResults.forEach(result => {
        const filePath = result.filePath;

        if (!fileVars[filePath]) {
            fileVars[filePath] = [];
        }

        result.messages.forEach(message => {
            if (message.ruleId === 'no-unused-vars') {
                const varName = message.message.match(/'([^']+)'/);

                if (varName && varName[1]) {
                    // Store the variable name and location
                    fileVars[filePath].push({
                        name: varName[1],
                        line: message.line,
                        column: message.column
                    });
                }
            }
        });
    });

    return fileVars;
};

// Check if a variable already has underscore prefix
const hasUnderscorePrefix = (varName) => {
    return varName.startsWith('_');
};

// Apply underscore prefix to unused variables in files
const prefixUnusedVars = (fileVars) => {
    const fileCount = Object.keys(fileVars).length;
    let totalFixed = 0;
    let totalVars = 0;

    console.log(`\nProcessing ${fileCount} files with unused variables...`);

    for (const [filePath, variables] of Object.entries(fileVars)) {
        if (variables.length === 0) continue;

        totalVars += variables.length;
        let content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        // Create a mapping of variables to fix per line
        const lineVarsMap = {};
        variables.forEach(variable => {
            if (!lineVarsMap[variable.line]) {
                lineVarsMap[variable.line] = [];
            }
            lineVarsMap[variable.line].push(variable);
        });

        // Sort variables on each line by column in descending order
        // (process from right to left to avoid position shifts)
        Object.values(lineVarsMap).forEach(lineVars => {
            lineVars.sort((a, b) => b.column - a.column);
        });

        // Process lines from bottom to top to avoid line number shifts
        const lineNumbers = Object.keys(lineVarsMap).map(Number).sort((a, b) => b - a);

        for (const lineNum of lineNumbers) {
            const lineVars = lineVarsMap[lineNum];
            const line = lines[lineNum - 1]; // 1-indexed to 0-indexed

            let newLine = line;
            for (const variable of lineVars) {
                if (hasUnderscorePrefix(variable.name)) continue;

                // Find the actual variable in context
                const beforeContext = newLine.substring(0, variable.column - 1);
                const afterContext = newLine.substring(variable.column - 1);

                // Replace the variable with underscore prefix
                // This handles different declaration contexts
                const isDeclaration = beforeContext.match(/(const|let|var|function|class)\s+$/);
                const isParameter = beforeContext.match(/\(\s*$/) || beforeContext.match(/,\s*$/);
                const isDestructure = beforeContext.match(/{[^}]*$/);

                if (isDeclaration || isParameter || isDestructure) {
                    const newAfterContext = afterContext.replace(
                        new RegExp(`^${variable.name}\\b`),
                        `_${variable.name}`
                    );
                    newLine = beforeContext + newAfterContext;
                    totalFixed++;
                }
            }

            // Update the line in the file content
            lines[lineNum - 1] = newLine;
        }

        // Write updated content back to file
        const newContent = lines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf-8');

        console.log(`✓ Fixed ${variables.length} variables in ${path.relative(process.cwd(), filePath)}`);
    }

    return { totalFixed, totalVars };
};

// Main function
const main = () => {
    console.log(`Scanning for unused variables in ${targetPath}...`);

    const eslintResults = findUnusedVariables(targetPath);
    const fileVars = extractUnusedVars(eslintResults);

    // Filter out files with no unused variables
    const filesToFix = Object.entries(fileVars)
        .filter(([_, vars]) => vars.length > 0)
        .reduce((acc, [file, vars]) => {
            acc[file] = vars;
            return acc;
        }, {});

    if (Object.keys(filesToFix).length === 0) {
        console.log('No unused variables found!');
        return;
    }

    const { totalFixed, totalVars } = prefixUnusedVars(filesToFix);

    console.log(`\nSummary:`);
    console.log(`✓ Fixed ${totalFixed} unused variables out of ${totalVars} detected`);
    console.log(`✓ Processed ${Object.keys(filesToFix).length} files\n`);
};

main(); 