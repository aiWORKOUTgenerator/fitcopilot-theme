#!/usr/bin/env node

/**
 * Simplified Sass Color Migration Script
 * 
 * This script helps migrate deprecated Sass color functions to modern alternatives
 * from our color utilities module, without any external dependencies.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');

// Log with colors
const log = {
    info: (msg) => console.log(`\x1b[34m${msg}\x1b[0m`),
    success: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
    warning: (msg) => console.log(`\x1b[33m${msg}\x1b[0m`),
    error: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`)
};

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
    let content;

    try {
        content = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        log.error(`Error reading file ${filePath}: ${error.message}`);
        return 0;
    }

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
            try {
                fs.writeFileSync(filePath, updatedContent);
                return changesCount;
            } catch (error) {
                log.error(`Error writing file ${filePath}: ${error.message}`);
                return 0;
            }
        }
    }

    return 0;
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    log.error('Please provide a file path to process.');
    log.info('Usage: node sass-color-migrate-simple.js <file-path>');
    process.exit(1);
}

const filePath = args[0];
if (!fs.existsSync(filePath)) {
    log.error(`File not found: ${filePath}`);
    process.exit(1);
}

log.info(`Processing file: ${filePath}`);
const changes = processFile(filePath);

if (changes > 0) {
    log.success(`Successfully updated ${filePath} with ${changes} changes.`);
} else {
    log.warning('No changes were made. The file might not contain deprecated functions or they might not match the expected patterns.');
}

process.exit(0); 