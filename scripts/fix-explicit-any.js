const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get list of files with any type warnings
const getFilesWithAnyTypeWarnings = () => {
    try {
        const eslintOutput = execSync(
            'npx eslint "src/**/*.{ts,tsx}" --rule "@typescript-eslint/no-explicit-any: error" --format json',
            { encoding: 'utf8' }
        );

        const results = JSON.parse(eslintOutput);
        return results
            .filter(result => result.messages.some(msg => msg.ruleId === '@typescript-eslint/no-explicit-any'))
            .map(result => result.filePath);
    } catch (error) {
        // If eslint exits with error (which it does when finding errors)
        const output = error.stdout;
        try {
            const results = JSON.parse(output);
            return results
                .filter(result => result.messages.some(msg => msg.ruleId === '@typescript-eslint/no-explicit-any'))
                .map(result => result.filePath);
        } catch (e) {
            console.error('Error parsing ESLint output:', e);
            return [];
        }
    }
};

// Replacement map for common any types
const typeReplacements = {
    // Event handlers
    '(event: any)': '(event: React.SyntheticEvent)',
    'event: any': 'event: React.SyntheticEvent',
    'React.ChangeEvent<any>': 'React.ChangeEvent<HTMLElement>',
    'MouseEvent<any>': 'MouseEvent<HTMLElement>',

    // Common response types
    'Promise<any>': 'Promise<unknown>',
    'ApiResponse<any>': 'ApiResponse<unknown>',

    // Function parameters
    '(props: any)': '(props: Record<string, unknown>)',
    'props: any': 'props: Record<string, unknown>',

    // Component state
    'useState<any>': 'useState<unknown>',
    'useReducer<any>': 'useReducer<unknown>',

    // Array types
    'any[]': 'unknown[]',
    'Array<any>': 'Array<unknown>',

    // Object types
    'Record<string, any>': 'Record<string, unknown>',
    'Record<number, any>': 'Record<number, unknown>',
    'Record<any, any>': 'Record<string, unknown>',

    // React component types
    'React.FC<any>': 'React.FC<Record<string, unknown>>',

    // Object literals
    'const data: any = {': 'const data: Record<string, unknown> = {',
    'const options: any = {': 'const options: Record<string, unknown> = {',
};

// Process a file to replace any types
const processFile = (filePath) => {
    console.log(`Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let replacementsMade = 0;

    // Replace any types with better alternatives
    for (const [anyType, replacement] of Object.entries(typeReplacements)) {
        const regex = new RegExp(anyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);

        if (matches) {
            content = content.replace(regex, replacement);
            replacementsMade += matches.length;
            console.log(`  - Replaced ${matches.length} occurrences of "${anyType}" with "${replacement}"`);
        }
    }

    // If replacements were made, write back to the file
    if (replacementsMade > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Made ${replacementsMade} replacements in ${filePath}`);
    } else {
        console.log(`  ⚠️ No automatic replacements in ${filePath}, manual review needed`);
    }
};

// Main function
const main = () => {
    console.log('Finding files with explicit "any" type warnings...');
    const files = getFilesWithAnyTypeWarnings();

    if (files.length === 0) {
        console.log('No files with explicit "any" type warnings found.');
        return;
    }

    console.log(`Found ${files.length} files with explicit "any" type warnings`);

    // Process each file
    files.forEach(processFile);

    console.log('\nProcessing complete. Please review the changes and run ESLint again to check for remaining issues.');
};

main(); 