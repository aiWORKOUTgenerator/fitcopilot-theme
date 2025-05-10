#!/usr/bin/env ts-node

import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

/**
 * Standardize barrel (index.ts) files across the codebase
 * to ensure consistent export patterns
 */

const rootDir = path.resolve(__dirname, '../src');
let fixCount = 0;
let barrelCount = 0;

/**
 * Get all barrel files (index.ts) in the project
 */
function getBarrelFiles(): string[] {
    return glob.sync('**/index.ts', {
        cwd: rootDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**']
    });
}

/**
 * Get all TypeScript/React files in a directory (excluding the barrel file itself)
 */
function getDirectoryFiles(dir: string): string[] {
    return fs.readdirSync(dir)
        .filter(file =>
            (file.endsWith('.ts') || file.endsWith('.tsx')) &&
            file !== 'index.ts' &&
            !file.endsWith('.test.ts') &&
            !file.endsWith('.test.tsx') &&
            !file.endsWith('.stories.tsx')
        )
        .map(file => path.join(dir, file));
}

/**
 * Extract export names from a file
 */
function getExportsFromFile(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const exports: string[] = [];

    // Match default exports
    const defaultExportMatch = content.match(/export\s+default\s+(?:(?:function|class|const|let|var)\s+)?([A-Za-z0-9_]+)/);
    if (defaultExportMatch && defaultExportMatch[1]) {
        exports.push(defaultExportMatch[1]);
    }

    // Match named exports
    const namedExportMatches = content.matchAll(/export\s+(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z0-9_]+)/g);
    for (const match of namedExportMatches) {
        if (match[1]) {
            exports.push(match[1]);
        }
    }

    // Match direct named exports
    const directExportMatches = content.matchAll(/export\s+{\s*([^}]+)\s*}/g);
    for (const match of directExportMatches) {
        if (match[1]) {
            const names = match[1].split(',').map(n => n.trim().split(' as ')[0].trim());
            exports.push(...names);
        }
    }

    return exports;
}

/**
 * Generate standardized barrel content for a directory
 */
function generateBarrelContent(dir: string): string {
    const files = getDirectoryFiles(dir);
    const imports: string[] = [];
    const namedExports: string[] = [];
    const defaultExports: string[] = [];

    files.forEach(file => {
        const fileName = path.basename(file, path.extname(file));
        const exports = getExportsFromFile(file);

        if (exports.length === 0) {
            return;
        }

        // Check for default export
        if (exports.includes(fileName)) {
            // Add import for default export
            imports.push(`import ${fileName} from './${fileName}';`);
            defaultExports.push(fileName);
        }

        // Add imports for all named exports
        const otherExports = exports.filter(e => e !== fileName);
        if (otherExports.length > 0) {
            imports.push(`import { ${otherExports.join(', ')} } from './${fileName}';`);
            namedExports.push(...otherExports);
        }
    });

    let content = imports.join('\n') + '\n\n';

    // Add named exports
    if (namedExports.length > 0) {
        content += `export { ${namedExports.join(', ')} };\n`;
    }

    // Add default exports re-export
    if (defaultExports.length > 0) {
        defaultExports.forEach(exportName => {
            content += `export { default as ${exportName} } from './${exportName}';\n`;
        });
    }

    // Also export all from subdirectories
    fs.readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .forEach(subdir => {
            // Skip certain directories
            if (!['__tests__', '__snapshots__', 'node_modules'].includes(subdir.name)) {
                content += `export * from './${subdir.name}';\n`;
            }
        });

    return content;
}

/**
 * Process a barrel file
 */
function processBarrel(barrelPath: string): void {
    barrelCount++;
    const dir = path.dirname(barrelPath);
    const newContent = generateBarrelContent(dir);
    const currentContent = fs.readFileSync(barrelPath, 'utf-8');

    if (newContent.trim() !== currentContent.trim()) {
        console.log(chalk.yellow(`Updating: ${path.relative(rootDir, barrelPath)}`));
        fs.writeFileSync(barrelPath, newContent);
        fixCount++;
    }
}

/**
 * Main function
 */
function main() {
    console.log(chalk.blue('Standardizing barrel files...\n'));

    const barrelFiles = getBarrelFiles();
    barrelFiles.forEach(processBarrel);

    console.log(chalk.green(`\nDone! Processed ${barrelCount} barrel files and updated ${fixCount} files.`));
}

main(); 