#!/usr/bin/env node

import * as parser from '@typescript-eslint/typescript-estree';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

interface ExportIssue {
    file: string;
    exportName: string;
    type: 'missing' | 'mismatch' | 'circular';
    importedBy?: string;
}

interface ImportMap {
    [key: string]: {
        imports: {
            name: string;
            source: string;
        }[];
        exports: string[];
    };
}

const rootDir = path.resolve(__dirname, '../src');
const issues: ExportIssue[] = [];
const importMap: ImportMap = {};

/**
 * Recursively scan directory for TypeScript/JavaScript files
 */
function scanDirectory(dir: string): string[] {
    const files: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...scanDirectory(fullPath));
        } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name) && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test.tsx')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Parse file to extract imports and exports
 */
function parseFile(filePath: string) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const ast = parser.parse(content, {
            jsx: true,
            loc: true,
        });

        const relativePath = path.relative(rootDir, filePath);
        importMap[relativePath] = { imports: [], exports: [] };

        // Process all AST nodes
        function processNode(node: any) {
            // Check for imports
            if (node.type === 'ImportDeclaration') {
                const source = node.source.value;

                node.specifiers.forEach((specifier: any) => {
                    if (specifier.type === 'ImportSpecifier' || specifier.type === 'ImportDefaultSpecifier') {
                        const name = specifier.local.name;
                        importMap[relativePath].imports.push({ name, source });
                    }
                });
            }

            // Check for exports
            if (node.type === 'ExportNamedDeclaration') {
                if (node.specifiers.length > 0) {
                    node.specifiers.forEach((specifier: any) => {
                        importMap[relativePath].exports.push(specifier.exported.name);
                    });
                }

                // Class, function, or variable declaration exports
                if (node.declaration) {
                    if (node.declaration.id) {
                        importMap[relativePath].exports.push(node.declaration.id.name);
                    } else if (node.declaration.declarations) {
                        node.declaration.declarations.forEach((decl: any) => {
                            importMap[relativePath].exports.push(decl.id.name);
                        });
                    }
                }
            }

            // Default exports
            if (node.type === 'ExportDefaultDeclaration') {
                importMap[relativePath].exports.push('default');
            }

            // Re-exports
            if (node.type === 'ExportAllDeclaration') {
                if (node.exported) {
                    importMap[relativePath].exports.push(node.exported.name);
                } else {
                    importMap[relativePath].exports.push('*');
                }
            }

            // Process children
            for (const key in node) {
                if (node[key] && typeof node[key] === 'object') {
                    if (Array.isArray(node[key])) {
                        node[key].forEach((child: any) => {
                            if (child && typeof child === 'object') {
                                processNode(child);
                            }
                        });
                    } else {
                        processNode(node[key]);
                    }
                }
            }
        }

        ast.body.forEach(processNode);
    } catch (error) {
        console.error(`Error parsing ${filePath}:`, error);
    }
}

/**
 * Validate all imports against exports
 */
function validateImports() {
    for (const filePath in importMap) {
        const fileInfo = importMap[filePath];

        fileInfo.imports.forEach(importInfo => {
            const { name, source } = importInfo;

            // Skip node_modules imports
            if (!source.startsWith('.') && !source.startsWith('/')) {
                return;
            }

            const resolvedSource = resolveImportPath(source, filePath);
            if (!resolvedSource || !importMap[resolvedSource]) {
                return; // Can't validate if we can't find the source file
            }

            const sourceExports = importMap[resolvedSource].exports;

            // Check if the import exists in the source's exports
            if (!sourceExports.includes(name) && name !== 'default' && !sourceExports.includes('*')) {
                issues.push({
                    file: resolvedSource,
                    exportName: name,
                    type: 'missing',
                    importedBy: filePath
                });
            }
        });
    }
}

/**
 * Resolve the absolute path of an import
 */
function resolveImportPath(importPath: string, fromFile: string): string | null {
    const fromDir = path.dirname(path.join(rootDir, fromFile));

    // Handle relative imports
    if (importPath.startsWith('.')) {
        let fullPath = path.resolve(fromDir, importPath);

        // Check various extensions and index files
        const extensions = ['.ts', '.tsx', '.js', '.jsx'];
        const filesToCheck = [
            fullPath,
            ...extensions.map(ext => fullPath + ext),
            ...extensions.map(ext => path.join(fullPath, 'index' + ext))
        ];

        for (const file of filesToCheck) {
            const relativePath = path.relative(rootDir, file);
            if (importMap[relativePath]) {
                return relativePath;
            }
        }
    }

    return null;
}

/**
 * Print report of found issues
 */
function printReport() {
    console.log(chalk.blueBright('\n===== Import/Export Validation Report =====\n'));

    if (issues.length === 0) {
        console.log(chalk.green('✓ No import/export issues found!'));
        return;
    }

    const missingExports = issues.filter(issue => issue.type === 'missing');

    console.log(chalk.yellow(`Found ${missingExports.length} missing exports:\n`));

    missingExports.forEach(issue => {
        console.log(chalk.red(`• Missing export '${issue.exportName}' in ${issue.file}`));
        console.log(chalk.gray(`  Imported by: ${issue.importedBy}`));
    });

    // Specific warnings mentioned in the build warnings
    const specificWarnings = missingExports.filter(issue =>
        issue.exportName === 'FloatingIcons' ||
        issue.exportName === 'MediaContainerProps' ||
        issue.exportName === 'Hero' ||
        issue.exportName === 'useNavigate'
    );

    if (specificWarnings.length > 0) {
        console.log(chalk.yellowBright('\n----- Critical Warnings -----\n'));

        specificWarnings.forEach(issue => {
            console.log(chalk.redBright(`• Critical: Missing export '${issue.exportName}' in ${issue.file}`));
            console.log(chalk.gray(`  Imported by: ${issue.importedBy}`));

            if (issue.exportName === 'useNavigate') {
                console.log(chalk.cyan('  Note: May need react-router-dom version update'));
            }
        });
    }
}

/**
 * Main execution
 */
console.log(chalk.blue('Scanning for TypeScript/JavaScript files...'));
const files = scanDirectory(rootDir);
console.log(chalk.green(`Found ${files.length} files to analyze.`));

console.log(chalk.blue('Parsing files and extracting imports/exports...'));
files.forEach(parseFile);

console.log(chalk.blue('Validating imports against exports...'));
validateImports();

printReport();

// Save issues to a report file for CI/CD
fs.writeFileSync(
    path.resolve(__dirname, '../import-export-report.json'),
    JSON.stringify(issues, null, 2)
);

console.log(chalk.blue('\nReport saved to import-export-report.json')); 