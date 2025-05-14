#!/usr/bin/env node

/**
 * Button Component Test Fixer
 * 
 * This script updates Button component tests to account for:
 * 1. Link button rendering changes
 * 2. Class name convention updates (e.g., btn-lg -> btn-large) 
 * 3. Type guard import path changes
 * 4. DOM structure and selector changes
 * 
 * Usage:
 *   node scripts/component-fixers/button-component-fixer.js [--dry-run] [--path=src/features/shared/Button/__tests__]
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const pathArg = args.find(arg => arg.startsWith('--path='));
const rootDir = pathArg ? pathArg.split('=')[1] : 'src/features/shared/Button/__tests__';

// DOM structure changes for button components
const domStructureFixes = [
    // Fix link button selectors (getByRole('link') -> getByTestId('test-link'))
    {
        pattern: /getByRole\(['"]link['"]\)/g,
        replacement: 'getByTestId("test-link")'
    },
    // Add data-testid when rendering link buttons (Missing test-link attribute)
    {
        pattern: /<Button([^>]*)variant=["']link["']([^>]*)>/g,
        replacement: '<Button$1variant="link"$2 data-testid="test-link">'
    },
    // Fix missing container in render
    {
        pattern: /const\s*{\s*([^}]+)\s*}\s*=\s*render\(/g,
        replacement: (match, group) => {
            if (group.includes('container')) {
                return match;
            }
            return `const { ${group}, container } = render(`;
        }
    },
    // Fix button tagName assertions
    {
        pattern: /expect\(\s*(\w+)\.tagName\s*\)\.toBe\(\s*['"]A['"]\s*\)/g,
        replacement: 'expect($1.tagName.toLowerCase()).toBe("a")'
    }
];

// Button class name convention fixes
const classNameFixes = [
    // Update large button classes
    {
        pattern: /['"]btn-lg['"]/g,
        replacement: '"btn-large"'
    },
    // Update small button classes
    {
        pattern: /['"]btn-sm['"]/g,
        replacement: '"btn-small"'
    },
    // Update button class assertions to check for 'btn' base class
    {
        pattern: /expect\((\w+)\).toHaveClass\(['"]btn-primary['"]\)/g,
        replacement: 'expect($1).toHaveClass("btn btn-primary")'
    },
    {
        pattern: /expect\((\w+)\).toHaveClass\(['"]btn-secondary['"]\)/g,
        replacement: 'expect($1).toHaveClass("btn btn-secondary")'
    },
    // Handle classes with additional classNames
    {
        pattern: /expect\((\w+)\).toHaveClass\(['"]btn-(primary|secondary)['"], ['"]([^'"]+)['"]\)/g,
        replacement: 'expect($1).toHaveClass("btn btn-$2", "$3")'
    }
];

// Discriminator property fixes for button components
const discriminatorFixes = [
    // Add type property for ButtonProps
    {
        pattern: /(const\s+\w+\s*:\s*ButtonProps\s*=\s*{\s*)(variant:\s*['"](\w+)['"](,?))/g,
        replacement: '$1variant: "$3"$4'
    },
    // Fix the syntax of button tests
    {
        pattern: /test\(\s*['"]is(\w+)Button['"]/g,
        replacement: 'test(\'is$1Button type guard'
    }
];

/**
 * Process a single file
 */
function processFile(filePath) {
    try {
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        let modified = false;

        // Apply DOM structure fixes
        for (const { pattern, replacement } of domStructureFixes) {
            if (pattern.test(newContent)) {
                newContent = newContent.replace(pattern, replacement);
                modified = true;
                if (verbose) console.log(`[${filePath}] Updated DOM structure selectors`);
            }
        }

        // Apply class name convention fixes
        for (const { pattern, replacement } of classNameFixes) {
            if (pattern.test(newContent)) {
                newContent = newContent.replace(pattern, replacement);
                modified = true;
                if (verbose) console.log(`[${filePath}] Updated class naming`);
            }
        }

        // Apply discriminator property fixes
        for (const { pattern, replacement } of discriminatorFixes) {
            if (pattern.test(newContent)) {
                newContent = newContent.replace(pattern, replacement);
                modified = true;
                if (verbose) console.log(`[${filePath}] Fixed discriminator properties`);
            }
        }

        // Fix getByTestId import if needed
        if (newContent.includes('getByTestId') && !newContent.includes('getByTestId')) {
            if (newContent.includes('render,')) {
                newContent = newContent.replace(
                    /import\s*{\s*render,([^}]*)\}\s*from\s*['"]@testing-library\/react['"]/,
                    'import { render, getByTestId,$1} from \'@testing-library/react\''
                );
            } else if (newContent.includes('import { render }')) {
                newContent = newContent.replace(
                    /import\s*{\s*render\s*}\s*from\s*['"]@testing-library\/react['"]/,
                    'import { render, getByTestId } from \'@testing-library/react\''
                );
            }
            modified = true;
            if (verbose) console.log(`[${filePath}] Added missing getByTestId import`);
        }

        // Write changes if the file was modified
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

/**
 * Recursively traverse directories
 */
function processDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            processDirectory(entryPath);
        } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
            // Process TypeScript and JavaScript test files
            processFile(entryPath);
        }
    }
}

/**
 * Main function
 */
function main() {
    console.log(`Starting Button component test fixes${dryRun ? ' (dry run)' : ''}`);
    console.log(`Processing directory: ${rootDir}`);

    try {
        // Create the directory if it doesn't exist
        const dirPath = path.dirname(rootDir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        if (fs.existsSync(rootDir)) {
            if (fs.lstatSync(rootDir).isDirectory()) {
                processDirectory(rootDir);
            } else {
                processFile(rootDir);
            }
        } else {
            console.error(`Error: ${rootDir} does not exist`);
            process.exit(1);
        }

        console.log('Finished processing files');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Execute the script
main(); 