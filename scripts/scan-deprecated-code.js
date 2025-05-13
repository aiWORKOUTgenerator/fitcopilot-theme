#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@typescript-eslint/parser');
const traverse = require('@babel/traverse').default;

// Configuration
const SRC_DIR = path.resolve(process.cwd(), 'src');
const FILE_PATTERNS = ['**/*.ts', '**/*.tsx'];
const IGNORE_PATTERNS = ['**/node_modules/**', '**/*.d.ts', '**/dist/**'];

// Patterns for deprecation detection
const DEPRECATION_PATTERNS = [
    // Function calls
    { pattern: /\.deprecated\(/, type: 'function-call', severity: 'high' },

    // JSDoc comments
    { pattern: /@deprecated/, type: 'comment', severity: 'high' },

    // TODO comments with removal date
    { pattern: /TODO.*remove.*by/i, type: 'comment', severity: 'medium' },

    // Explicit console warnings about deprecation
    { pattern: /console\.warn\(.*deprecated/i, type: 'console', severity: 'medium' },

    // Common naming patterns
    { pattern: /legacy|deprecated|old|outdated/i, type: 'naming', severity: 'low' },
];

// Custom rules for known deprecated APIs
const DEPRECATED_APIS = [
    // React
    { api: 'componentWillMount', replacement: 'componentDidMount or useEffect', package: 'react' },
    { api: 'componentWillReceiveProps', replacement: 'getDerivedStateFromProps or useEffect', package: 'react' },
    { api: 'componentWillUpdate', replacement: 'getSnapshotBeforeUpdate or useEffect', package: 'react' },
    { api: 'UNSAFE_componentWillMount', replacement: 'componentDidMount or useEffect', package: 'react' },
    { api: 'UNSAFE_componentWillReceiveProps', replacement: 'getDerivedStateFromProps or useEffect', package: 'react' },
    { api: 'UNSAFE_componentWillUpdate', replacement: 'getSnapshotBeforeUpdate or useEffect', package: 'react' },

    // DOM
    { api: 'document.all', replacement: 'document.getElementById or querySelector', package: 'dom' },
    { api: 'document.layers', replacement: 'standard DOM methods', package: 'dom' },

    // Custom project APIs
    { api: 'useDeprecatedAPI', replacement: 'useCurrentAPI', package: 'internal' },
    { api: 'legacyFormatter', replacement: 'formatValue', package: 'internal' },
];

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

// Basic string pattern matching for quick scan
const findDeprecationPatterns = (content, filePath) => {
    const findings = [];

    DEPRECATION_PATTERNS.forEach(({ pattern, type, severity }) => {
        const matches = content.match(new RegExp(pattern, 'g'));
        if (matches) {
            const lines = content.split('\n');
            let lineNumber = 1;
            let position = 0;

            matches.forEach(match => {
                const matchPosition = content.indexOf(match, position);
                position = matchPosition + match.length;

                // Find line number for this match
                while (lineNumber < lines.length) {
                    const lineEnd = content.indexOf('\n', content.lastIndexOf('\n', matchPosition - 1) + 1);
                    if (lineEnd >= matchPosition || lineEnd === -1) break;
                    lineNumber++;
                }

                findings.push({
                    filePath,
                    line: lineNumber,
                    pattern: pattern.toString(),
                    match: match.trim(),
                    type,
                    severity,
                });
            });
        }
    });

    return findings;
};

// More accurate AST-based scanning for deprecated APIs
const findDeprecatedAPIs = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
            ecmaVersion: 2020,
            loc: true,
        });

        const findings = [];

        // Find deprecated API usages via AST
        traverse(ast, {
            // Check for method calls
            MemberExpression(path) {
                if (path.node.property && path.node.property.name) {
                    const methodName = path.node.property.name;
                    const api = DEPRECATED_APIS.find(api => api.api === methodName);

                    if (api) {
                        findings.push({
                            filePath,
                            line: path.node.loc.start.line,
                            apiName: api.api,
                            replacement: api.replacement,
                            package: api.package,
                            type: 'api-usage',
                            severity: 'high',
                        });
                    }
                }
            },

            // Check for imports of deprecated APIs
            ImportDeclaration(path) {
                const source = path.node.source.value;
                path.node.specifiers.forEach(specifier => {
                    if (specifier.imported && specifier.imported.name) {
                        const importedName = specifier.imported.name;
                        const api = DEPRECATED_APIS.find(api =>
                            api.api === importedName && (
                                !api.package ||
                                source.includes(api.package)
                            )
                        );

                        if (api) {
                            findings.push({
                                filePath,
                                line: path.node.loc.start.line,
                                apiName: api.api,
                                replacement: api.replacement,
                                package: api.package,
                                type: 'import',
                                severity: 'high',
                            });
                        }
                    }
                });
            },

            // Check for lifecycle methods
            ClassMethod(path) {
                const methodName = path.node.key.name;
                const api = DEPRECATED_APIS.find(api => api.api === methodName);

                if (api) {
                    findings.push({
                        filePath,
                        line: path.node.loc.start.line,
                        apiName: api.api,
                        replacement: api.replacement,
                        package: api.package,
                        type: 'class-method',
                        severity: 'high',
                    });
                }
            },
        });

        return findings;
    } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error);
        return [];
    }
};

// Main execution
const main = async () => {
    console.log('🔍 Finding TypeScript/React files...');
    const files = findTsFiles();
    console.log(`Found ${files.length} files to analyze`);

    let allFindings = [];

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf-8');

            // Find string patterns first (faster)
            const patternFindings = findDeprecationPatterns(content, file);

            // Only do AST analysis if the file might contain deprecated APIs
            const apiFindings = patternFindings.length > 0 ?
                findDeprecatedAPIs(file) : [];

            allFindings = [...allFindings, ...patternFindings, ...apiFindings];
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }

    // Group by file for better output
    const findingsByFile = allFindings.reduce((acc, finding) => {
        const key = finding.filePath;
        if (!acc[key]) acc[key] = [];
        acc[key].push(finding);
        return acc;
    }, {});

    // Generate report
    const reportPath = path.join(process.cwd(), 'deprecated-code-report.json');
    fs.writeFileSync(
        reportPath,
        JSON.stringify({
            generatedAt: new Date().toISOString(),
            summary: {
                totalFiles: files.length,
                filesWithDeprecations: Object.keys(findingsByFile).length,
                totalDeprecations: allFindings.length,
                bySeverity: {
                    high: allFindings.filter(f => f.severity === 'high').length,
                    medium: allFindings.filter(f => f.severity === 'medium').length,
                    low: allFindings.filter(f => f.severity === 'low').length,
                }
            },
            findings: findingsByFile
        }, null, 2)
    );

    // Print summary
    console.log('\n📊 Scan Complete!');
    console.log(`Files scanned: ${files.length}`);
    console.log(`Files with deprecated code: ${Object.keys(findingsByFile).length}`);
    console.log(`Total deprecation findings: ${allFindings.length}`);
    console.log(`High severity: ${allFindings.filter(f => f.severity === 'high').length}`);
    console.log(`Medium severity: ${allFindings.filter(f => f.severity === 'medium').length}`);
    console.log(`Low severity: ${allFindings.filter(f => f.severity === 'low').length}`);
    console.log(`\nReport saved to: ${reportPath}`);
};

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 