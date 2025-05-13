#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');
const ts = require('typescript');

// Configuration
const MIN_COVERAGE_THRESHOLD = 85; // Minimum acceptable type coverage percentage
const REPORT_PATH = path.resolve(process.cwd(), 'type-coverage-report.json');
const SRC_DIR = path.resolve(process.cwd(), 'src');
const FILE_PATTERNS = ['**/*.ts', '**/*.tsx'];
const IGNORE_PATTERNS = ['**/node_modules/**', '**/*.d.ts', '**/dist/**', '**/*.test.ts', '**/*.test.tsx'];

// Find explicit any types in files
const checkTypeCoverage = () => {
    // Find TypeScript files
    const files = FILE_PATTERNS.flatMap(pattern =>
        glob.sync(pattern, {
            cwd: SRC_DIR,
            ignore: IGNORE_PATTERNS,
            absolute: true
        })
    );

    const results = {
        totalFiles: files.length,
        filesWithAny: 0,
        totalAnyCount: 0,
        byFile: {},
        byDirectory: {},
        coverage: 0
    };

    // Parse tsconfig to get compiler options
    const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    const compilerOptions = ts.parseJsonConfigFileContent(
        tsconfig,
        ts.sys,
        path.dirname(tsconfigPath)
    ).options;

    // Create and analyze program
    const program = ts.createProgram(files, compilerOptions);
    const checker = program.getTypeChecker();

    // For each source file in the program
    for (const sourceFile of program.getSourceFiles()) {
        if (!files.includes(sourceFile.fileName)) continue;

        const relativePath = path.relative(process.cwd(), sourceFile.fileName);
        const anyCount = scanForAnyTypes(sourceFile, checker);

        if (anyCount > 0) {
            results.filesWithAny++;
            results.totalAnyCount += anyCount;
            results.byFile[relativePath] = anyCount;

            // Track by directory
            const directory = path.dirname(relativePath);
            if (!results.byDirectory[directory]) {
                results.byDirectory[directory] = { files: 0, anyCount: 0 };
            }
            results.byDirectory[directory].files++;
            results.byDirectory[directory].anyCount += anyCount;
        }
    }

    // Calculate coverage percentage (files without any / total files)
    results.coverage = ((results.totalFiles - results.filesWithAny) / results.totalFiles) * 100;

    return results;
};

// Scan a source file for explicit any types
const scanForAnyTypes = (sourceFile, checker) => {
    let anyCount = 0;

    const visit = (node) => {
        // Check type annotations
        if (
            (ts.isTypeReferenceNode(node) && node.typeName.getText() === 'any') ||
            (ts.isKeywordTypeNode(node) && node.kind === ts.SyntaxKind.AnyKeyword)
        ) {
            anyCount++;
        }

        // Check variable declarations
        if (ts.isVariableDeclaration(node) && node.type && ts.isTypeReferenceNode(node.type)) {
            if (node.type.typeName.getText() === 'any') {
                anyCount++;
            }
        }

        // Check parameter types
        if (ts.isParameter(node) && node.type && ts.isTypeReferenceNode(node.type)) {
            if (node.type.typeName.getText() === 'any') {
                anyCount++;
            }
        }

        // Check function return types
        if ((ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) &&
            node.type && ts.isTypeReferenceNode(node.type)) {
            if (node.type.typeName.getText() === 'any') {
                anyCount++;
            }
        }

        ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return anyCount;
};

// Generate report
const generateReport = (results) => {
    const report = {
        timestamp: new Date().toISOString(),
        results: results,
        passThreshold: results.coverage >= MIN_COVERAGE_THRESHOLD
    };

    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    return report;
};

// Main execution
const main = async () => {
    console.log('🔍 Checking TypeScript type coverage...');
    const results = checkTypeCoverage();
    const report = generateReport(results);

    console.log(`📊 Type Coverage Report:`);
    console.log(`Files analyzed: ${results.totalFiles}`);
    console.log(`Files with 'any' types: ${results.filesWithAny}`);
    console.log(`Total 'any' type occurrences: ${results.totalAnyCount}`);
    console.log(`Type coverage: ${results.coverage.toFixed(2)}%`);
    console.log(`Threshold: ${MIN_COVERAGE_THRESHOLD}%`);
    console.log(`Status: ${report.passThreshold ? '✅ PASS' : '❌ FAIL'}`);

    // Fail if coverage is below threshold
    if (!report.passThreshold) {
        console.error(`Type coverage is below the minimum threshold of ${MIN_COVERAGE_THRESHOLD}%`);
        process.exit(1);
    }
};

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 