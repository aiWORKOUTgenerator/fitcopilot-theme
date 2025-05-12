const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get list of files with unused variable warnings
const getFilesWithUnusedVarsWarnings = () => {
    try {
        const eslintOutput = execSync(
            'npx eslint "src/**/*.{ts,tsx}" --rule "@typescript-eslint/no-unused-vars: error" --format json',
            { encoding: 'utf8' }
        );

        const results = JSON.parse(eslintOutput);
        return results
            .filter(result => result.messages.some(msg => msg.ruleId === '@typescript-eslint/no-unused-vars'))
            .map(result => ({
                filePath: result.filePath,
                messages: result.messages.filter(msg => msg.ruleId === '@typescript-eslint/no-unused-vars')
            }));
    } catch (error) {
        // If eslint exits with error (which it does when finding errors)
        const output = error.stdout;
        try {
            const results = JSON.parse(output);
            return results
                .filter(result => result.messages.some(msg => msg.ruleId === '@typescript-eslint/no-unused-vars'))
                .map(result => ({
                    filePath: result.filePath,
                    messages: result.messages.filter(msg => msg.ruleId === '@typescript-eslint/no-unused-vars')
                }));
        } catch (e) {
            console.error('Error parsing ESLint output:', e);
            return [];
        }
    }
};

// Fix unused variables by adding underscore prefix
const fixUnusedVars = (file) => {
    console.log(`Processing: ${file.filePath}`);

    // Read file content
    let content = fs.readFileSync(file.filePath, 'utf-8');
    let replacementsMade = 0;

    // Process file in reverse order to handle line number changes
    // (processing from bottom to top preserves line numbers)
    const sortedMessages = [...file.messages].sort((a, b) => b.line - a.line);

    for (const message of sortedMessages) {
        // Check if the message contains info about an unused variable
        const match = message.message.match(/'([^']+)' is defined but never used/);
        if (!match) continue;

        const variableName = match[1];

        // Get the line where the unused variable is defined
        const lines = content.split('\n');
        const line = lines[message.line - 1];

        // Find the variable in the line
        const variableRegex = new RegExp(`\\b${variableName}\\b(?!\\s*:)`);
        const variableMatch = line.match(variableRegex);

        if (variableMatch) {
            // Add an underscore prefix to the variable name
            const newLine = line.replace(variableRegex, `_${variableName}`);
            lines[message.line - 1] = newLine;

            // Update the content with the modified lines
            content = lines.join('\n');
            replacementsMade++;

            console.log(`  - Line ${message.line}: Renamed '${variableName}' to '_${variableName}'`);
        } else {
            console.log(`  ⚠️ Could not locate variable '${variableName}' on line ${message.line}`);
        }
    }

    if (replacementsMade > 0) {
        fs.writeFileSync(file.filePath, content);
        console.log(`  ✅ Made ${replacementsMade} replacements in ${file.filePath}`);
    } else {
        console.log(`  ℹ️ No replacements made in ${file.filePath}`);
    }
};

// Main function
const main = () => {
    console.log('Finding files with unused variable warnings...');
    const files = getFilesWithUnusedVarsWarnings();

    if (files.length === 0) {
        console.log('No files with unused variable warnings found.');
        return;
    }

    console.log(`Found ${files.length} files with unused variable warnings.`);

    // Process each file
    for (const file of files) {
        fixUnusedVars(file);
    }

    console.log('\nProcessing complete.');
    console.log('Run ESLint again to verify fixes.');
};

main(); 