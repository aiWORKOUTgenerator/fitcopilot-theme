#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@typescript-eslint/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Configuration
const SRC_DIR = path.resolve(process.cwd(), 'src');
const FILE_PATTERNS = ['**/*.ts', '**/*.tsx'];
const IGNORE_PATTERNS = ['**/node_modules/**', '**/*.d.ts', '**/dist/**'];

// Find all TypeScript/React files
const findTsFiles = () => {
    return FILE_PATTERNS.flatMap(pattern =>
        glob.sync(pattern, {
            cwd: SRC_DIR,
            ignore: IGNORE_PATTERNS,
            absolute: true
        })
    );
};

// Parse file and check for unused imports
const analyzeImports = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
            ecmaVersion: 2020,
            loc: true,
        });

        const imports = [];
        const usedIdentifiers = new Set();

        // First pass: collect all imports
        traverse(ast, {
            ImportDeclaration(path) {
                const source = path.node.source.value;
                path.node.specifiers.forEach(specifier => {
                    if (specifier.type === 'ImportSpecifier' || specifier.type === 'ImportDefaultSpecifier') {
                        const importedName = specifier.local.name;
                        imports.push({
                            name: importedName,
                            source,
                            used: false,
                            node: path.node,
                        });
                    }
                });
            },
        });

        // Second pass: collect all used identifiers
        traverse(ast, {
            Identifier(path) {
                // Skip import declarations to avoid counting the import itself as usage
                if (path.parent.type === 'ImportSpecifier' || path.parent.type === 'ImportDefaultSpecifier') {
                    return;
                }
                usedIdentifiers.add(path.node.name);
            },
        });

        // Mark used imports
        imports.forEach(imp => {
            if (usedIdentifiers.has(imp.name)) {
                imp.used = true;
            }
        });

        return {
            filePath,
            imports,
            unusedImports: imports.filter(imp => !imp.used),
        };
    } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error);
        return { filePath, imports: [], unusedImports: [] };
    }
};

// Sort and optimize imports in a file
const optimizeImports = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
            ecmaVersion: 2020,
        });

        // Track removed imports
        let removedCount = 0;

        // Find and remove unused imports
        traverse(ast, {
            ImportDeclaration(path) {
                // Check if all specifiers are unused
                const specifiers = path.node.specifiers;
                const unusedSpecifiers = specifiers.filter(specifier => {
                    if (specifier.local && specifier.local.name.startsWith('_')) {
                        return true; // Keep prefixed unused variables
                    }

                    // Check identifier usage
                    let isUsed = false;
                    traverse(ast, {
                        Identifier(idPath) {
                            if (idPath.node.name === specifier.local.name &&
                                idPath.parent.type !== 'ImportSpecifier' &&
                                idPath.parent.type !== 'ImportDefaultSpecifier') {
                                isUsed = true;
                                idPath.stop();
                            }
                        },
                    }, path.scope);

                    return !isUsed;
                });

                // If all specifiers are unused, remove the entire import
                if (unusedSpecifiers.length === specifiers.length) {
                    path.remove();
                    removedCount++;
                }
                // If some specifiers are unused, remove only those
                else if (unusedSpecifiers.length > 0) {
                    specifiers.forEach(specifier => {
                        if (unusedSpecifiers.includes(specifier)) {
                            path.get(`specifiers.${specifiers.indexOf(specifier)}`).remove();
                            removedCount++;
                        }
                    });
                }
            },
        });

        // Generate updated code if imports were removed
        if (removedCount > 0) {
            const { code } = generate(ast, {}, content);
            fs.writeFileSync(filePath, code);
            console.log(`✅ Optimized ${filePath} - removed ${removedCount} unused imports`);
            return { filePath, removedCount };
        }

        return { filePath, removedCount: 0 };
    } catch (error) {
        console.error(`Error optimizing ${filePath}:`, error);
        return { filePath, removedCount: 0 };
    }
};

// Main execution
const main = async () => {
    console.log('🔍 Finding TypeScript/React files...');
    const files = findTsFiles();
    console.log(`Found ${files.length} files to analyze`);

    let totalRemoved = 0;

    for (const file of files) {
        const result = optimizeImports(file);
        totalRemoved += result.removedCount;
    }

    console.log(`\n✅ Complete! Removed ${totalRemoved} unused imports across ${files.length} files`);
};

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 