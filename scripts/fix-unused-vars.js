#!/usr/bin/env node

/**
 * Fix Unused Variables Script
 * 
 * This script finds unused variables reported by ESLint and adds an underscore prefix to them.
 * It handles catch variables, function parameters, and object/array destructuring.
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

// Get unused variable warnings
const getUnusedVarsWarnings = (eslintOutput) => {
    const unusedVars = [];

    eslintOutput.forEach(fileResult => {
        const filePath = fileResult.filePath;

        fileResult.messages
            .filter(msg => msg.ruleId === '@typescript-eslint/no-unused-vars')
            .forEach(warning => {
                unusedVars.push({
                    filePath,
                    line: warning.line,
                    column: warning.column,
                    varName: warning.message.match(/'([^']+)'/)?.[1]
                });
            });
    });

    return unusedVars;
};

// Fix unused variables in a file
const fixUnusedVarsInFile = (filePath, unusedVars) => {
    if (unusedVars.length === 0) return;

    console.log(`Fixing ${unusedVars.length} unused variables in ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Group by line for efficiency
    const varsByLine = {};
    unusedVars.forEach(v => {
        if (!varsByLine[v.line]) varsByLine[v.line] = [];
        varsByLine[v.line].push(v);
    });

    // Process line by line
    Object.keys(varsByLine).forEach(lineNum => {
        const lineIndex = parseInt(lineNum) - 1;
        let line = lines[lineIndex];

        // Sort by column in descending order to avoid position shifts
        const varsInLine = varsByLine[lineNum].sort((a, b) => b.column - a.column);

        varsInLine.forEach(v => {
            if (!v.varName) return;

            // Handle different variable declaration patterns
            if (line.includes(`const ${v.varName}`) || line.includes(`let ${v.varName}`) || line.includes(`var ${v.varName}`)) {
                // Variable declaration
                line = line.replace(
                    new RegExp(`(const|let|var)\\s+${v.varName}\\b`),
                    `$1 _${v.varName}`
                );
            } else if (line.includes(`function ${v.varName}`) || line.match(new RegExp(`\\(([^)]*\\b${v.varName}\\b[^)]*)`))) {
                // Function declaration or parameter
                line = line.replace(
                    new RegExp(`\\b${v.varName}\\b(?![:\\.])`),
                    `_${v.varName}`
                );
            } else if (line.includes('{') && line.includes('}')) {
                // Object destructuring
                line = line.replace(
                    new RegExp(`\\b${v.varName}\\b(?!:)`),
                    `_${v.varName}`
                );
            } else if (line.includes('[') && line.includes(']')) {
                // Array destructuring
                line = line.replace(
                    new RegExp(`\\b${v.varName}\\b`),
                    `_${v.varName}`
                );
            } else {
                // Other cases
                line = line.replace(
                    new RegExp(`\\b${v.varName}\\b(?![:\\.])`),
                    `_${v.varName}`
                );
            }
        });

        lines[lineIndex] = line;
    });

    // Write changes back to file
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
};

// Main function
const main = () => {
    console.log('Getting ESLint warnings...');
    const eslintOutput = getEslintWarnings();

    console.log('Finding unused variables...');
    const unusedVars = getUnusedVarsWarnings(eslintOutput);

    console.log(`Found ${unusedVars.length} unused variables across ${new Set(unusedVars.map(v => v.filePath)).size} files`);

    // Group by file for efficiency
    const varsByFile = {};
    unusedVars.forEach(v => {
        if (!varsByFile[v.filePath]) varsByFile[v.filePath] = [];
        varsByFile[v.filePath].push(v);
    });

    // Fix each file
    Object.keys(varsByFile).forEach(filePath => {
        fixUnusedVarsInFile(filePath, varsByFile[filePath]);
    });

    console.log('Done!');
};

main(); 