#!/usr/bin/env node

/**
 * Sass Color Migration Script
 * 
 * This script helps migrate deprecated Sass color functions to modern alternatives
 * from our color utilities module.
 */

const fs = require('fs');
const path = require('path');

// Fix chalk import for ESM
function getChalk() {
    try {
        // Try to use CommonJS require
        return require('chalk');
    } catch (e) {
        // Return basic coloring functions if chalk is not available
        return {
            blue: (text) => `\x1b[34m${text}\x1b[0m`,
            green: (text) => `\x1b[32m${text}\x1b[0m`,
            yellow: (text) => `\x1b[33m${text}\x1b[0m`,
            red: (text) => `\x1b[31m${text}\x1b[0m`,
            cyan: (text) => `\x1b[36m${text}\x1b[0m`
        };
    }
}

const chalk = getChalk();
const SRC_DIR = path.resolve(__dirname, '../src');
const REPORT_FILE = path.resolve(__dirname, '../sass-color-report.json');

// Function to add the required import to a file
function addImportToFile(filePath, content) {
    const importStatement = '@use "src/styles/utils/color-utils" as color-utils;\n';

    // Check if the import is already there
    if (content.includes(importStatement) || content.includes('@use "src/styles/utils')) {
        return content;
    }

    // Find the right spot to add the import
    // Usually at the top or after other @use/@import statements
    let lines = content.split('\n');
    let insertIndex = 0;

    // Find the last import/use statement
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('@import') || lines[i].startsWith('@use') || lines[i].startsWith('@forward')) {
            insertIndex = i + 1;
        }
    }

    // Insert the import statement
    lines.splice(insertIndex, 0, importStatement);

    return lines.join('\n');
}

// Function to replace darken function
function replaceDarken(content) {
    return content.replace(/darken\s*\(\s*(\$[\w-]+)\s*,\s*([\d.]+%?)\s*\)/g, 'color-utils.darken-safe($1, $2)');
}

// Function to replace lighten function
function replaceLighten(content) {
    return content.replace(/lighten\s*\(\s*(\$[\w-]+)\s*,\s*([\d.]+%?)\s*\)/g, 'color-utils.lighten-safe($1, $2)');
}

// Function to replace saturate function
function replaceSaturate(content) {
    return content.replace(/saturate\s*\(\s*(\$[\w-]+)\s*,\s*([\d.]+%?)\s*\)/g, 'color-utils.adjust-saturation($1, $2)');
}

// Function to replace desaturate function
function replaceDesaturate(content) {
    return content.replace(/desaturate\s*\(\s*(\$[\w-]+)\s*,\s*([\d.]+%?)\s*\)/g, (match, color, amount) => {
        // Remove % if present for the number conversion
        const numericAmount = amount.endsWith('%') ? amount.substring(0, amount.length - 1) : amount;
        // Make the amount negative and add % back if it was there
        const negativeAmount = `-${numericAmount}${amount.endsWith('%') ? '%' : ''}`;
        return `color-utils.adjust-saturation(${color}, ${negativeAmount})`;
    });
}

// Function to process a file and make replacements
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let updatedContent = content;
    let changesCount = 0;

    // Check for each deprecated function
    const hasDarken = content.includes('darken(');
    const hasLighten = content.includes('lighten(');
    const hasSaturate = content.includes('saturate(');
    const hasDesaturate = content.includes('desaturate(');

    if (hasDarken || hasLighten || hasSaturate || hasDesaturate) {
        // First add the import if needed
        updatedContent = addImportToFile(filePath, updatedContent);

        // Apply replacements
        if (hasDarken) {
            const beforeDarken = updatedContent;
            updatedContent = replaceDarken(updatedContent);
            if (beforeDarken !== updatedContent) changesCount++;
        }

        if (hasLighten) {
            const beforeLighten = updatedContent;
            updatedContent = replaceLighten(updatedContent);
            if (beforeLighten !== updatedContent) changesCount++;
        }

        if (hasSaturate) {
            const beforeSaturate = updatedContent;
            updatedContent = replaceSaturate(updatedContent);
            if (beforeSaturate !== updatedContent) changesCount++;
        }

        if (hasDesaturate) {
            const beforeDesaturate = updatedContent;
            updatedContent = replaceDesaturate(updatedContent);
            if (beforeDesaturate !== updatedContent) changesCount++;
        }

        // Write changes back to file
        if (updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent);
            return changesCount;
        }
    }

    return 0;
}

// Function to process all files based on the report
function processAllFiles() {
    if (!fs.existsSync(REPORT_FILE)) {
        console.error(chalk.red(`Error: Report file not found at ${REPORT_FILE}`));
        console.log(chalk.yellow('Run the sass-color-audit.js script first to generate the report.'));
        process.exit(1);
    }

    const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));
    const filesToProcess = Object.keys(report.details).map(relPath => path.join(SRC_DIR, relPath));

    console.log(chalk.blue(`Migrating deprecated color functions in ${filesToProcess.length} files...`));

    let totalChanges = 0;
    let filesChanged = 0;

    for (const file of filesToProcess) {
        const changes = processFile(file);
        if (changes > 0) {
            filesChanged++;
            totalChanges += changes;
            console.log(chalk.green(`Updated ${path.relative(SRC_DIR, file)} - ${changes} changes`));
        }
    }

    console.log(chalk.yellow(`\nMigration complete: ${totalChanges} changes made across ${filesChanged} files.`));
    console.log(chalk.cyan('\nNext steps:'));
    console.log('1. Run the audit script again to verify all instances have been migrated:');
    console.log('   node scripts/sass-color-audit.js');
    console.log('2. Test your application to ensure visual consistency');
    console.log('3. Commit the changes');
}

// Function to process a single file
function processSingleFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`Error: File not found at ${filePath}`));
        process.exit(1);
    }

    console.log(chalk.blue(`Migrating deprecated color functions in ${filePath}...`));

    const changes = processFile(filePath);
    console.log(chalk.yellow(`\nMigration complete: ${changes} changes made.`));

    if (changes > 0) {
        console.log(chalk.green('File updated successfully!'));
    } else {
        console.log(chalk.cyan('No changes were made. The file might not contain deprecated functions or they might not match the expected patterns.'));
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    // Process all files in the report
    processAllFiles();
} else if (args[0] === '--help' || args[0] === '-h') {
    console.log('Usage:');
    console.log('  node sass-color-migrate.js             # Process all files in the sass-color-report.json');
    console.log('  node sass-color-migrate.js <file-path> # Process a single file');
    console.log('  node sass-color-migrate.js --help      # Show this help message');
} else {
    // Process a single file
    processSingleFile(args[0]);
} 