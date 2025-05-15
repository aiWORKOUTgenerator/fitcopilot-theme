/**
 * Utility File Identifier
 * Analyzes import patterns to identify high-impact utility files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all source files
console.log('Scanning source files...');
const sourceFiles = glob.sync('src/**/*.{ts,tsx}');
console.log(`Found ${sourceFiles.length} source files to analyze.`);

// Track file imports and files that import a particular file
const importCount = {};
const dependents = {};
const warningsByFile = {};

// Try to load the ESLint results if available
try {
    const eslintOutputPath = path.join(__dirname, 'eslint-output.json');
    if (fs.existsSync(eslintOutputPath)) {
        const eslintOutput = JSON.parse(fs.readFileSync(eslintOutputPath, 'utf8'));
        eslintOutput.forEach(result => {
            const filePath = result.filePath;
            const relPath = path.relative(process.cwd(), filePath);
            warningsByFile[relPath] = result.messages.length;
        });
        console.log(`Loaded warning counts for ${Object.keys(warningsByFile).length} files.`);
    }
} catch (error) {
    console.error('Error loading ESLint results:', error.message);
}

// Analyze imports in each file
console.log('Analyzing imports...');
sourceFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const importMatches = content.match(/import .* from ['"](.*)['"]/g) || [];

        importMatches.forEach(importLine => {
            const match = importLine.match(/from ['"](.*)['"]/) || [];
            if (match[1]) {
                // Normalize path
                let importPath = match[1];

                // Skip external packages
                if (!importPath.startsWith('.') && !importPath.startsWith('src/')) return;

                try {
                    // Resolve relative imports to full path
                    let fullPath;
                    if (importPath.startsWith('.')) {
                        // Relative path - resolve from current file
                        fullPath = path.resolve(path.dirname(file), importPath);
                    } else {
                        // Path starting with src/ - resolve from project root
                        fullPath = path.resolve(importPath);
                    }

                    // Add extensions if missing
                    const resolvedPath = resolveImportPath(fullPath);
                    if (!resolvedPath) return; // Skip if we can't resolve the path

                    // Get relative path from project root
                    const relPath = path.relative(process.cwd(), resolvedPath);

                    // Count imports
                    if (!importCount[relPath]) {
                        importCount[relPath] = 0;
                        dependents[relPath] = [];
                    }
                    importCount[relPath]++;

                    // Track dependent files
                    const relFile = path.relative(process.cwd(), file);
                    if (!dependents[relPath].includes(relFile)) {
                        dependents[relPath].push(relFile);
                    }
                } catch (error) {
                    // Skip imports we can't resolve
                }
            }
        });
    } catch (error) {
        console.error(`Error analyzing ${file}: ${error.message}`);
    }
});

// Try to resolve import path to actual file
function resolveImportPath(importPath) {
    // Check common extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];

    // Check if path exists as is
    if (fs.existsSync(importPath)) return importPath;

    // Try adding extensions
    for (const ext of extensions) {
        const pathWithExt = `${importPath}${ext}`;
        if (fs.existsSync(pathWithExt)) return pathWithExt;
    }

    // Try index files
    for (const ext of extensions) {
        const indexPath = path.join(importPath, `index${ext}`);
        if (fs.existsSync(indexPath)) return indexPath;
    }

    // Couldn't resolve
    return null;
}

// Calculate an impact score
function calculateImpactScore(file) {
    const importers = dependents[file] ? dependents[file].length : 0;
    const warningCount = warningsByFile[file] || 0;

    // Score = (# of imports) × (1 + warning count / 10)
    // This weights files both by usage and warning density
    return importers * (1 + warningCount / 10);
}

// Identify most imported files
const topUtilityFiles = Object.keys(importCount)
    .filter(file => {
        // Only consider utility-like files
        return file.includes('utils') ||
            file.includes('helpers') ||
            file.includes('services') ||
            file.includes('hooks') ||
            file.includes('context');
    })
    .map(file => ({
        file,
        imports: importCount[file],
        importers: dependents[file] ? dependents[file].length : 0,
        warnings: warningsByFile[file] || 0,
        impactScore: calculateImpactScore(file)
    }))
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 20);

// Generate utility file report
console.log('Generating utility file report...');
const utilityReport = `# High-Impact Utility Files

These files are imported most frequently and should be prioritized for remediation.

## Top Utility Files by Impact Score

Impact score combines the number of importing files and the warning count to prioritize for greatest effect.

| File | Impact Score | Importers | Warnings | 
|------|-------------|-----------|----------|
${topUtilityFiles.map(({ file, impactScore, importers, warnings }) =>
    `| ${file} | ${impactScore.toFixed(1)} | ${importers} | ${warnings} |`
).join('\n')}

## Files by Import Count

| File | Importing Files |
|------|----------------|
${topUtilityFiles.sort((a, b) => b.importers - a.importers)
        .map(({ file, importers }) => `| ${file} | ${importers} |`).join('\n')}

## Files by Warning Count

| File | Warnings |
|------|----------|
${topUtilityFiles.sort((a, b) => b.warnings - a.warnings)
        .filter(({ warnings }) => warnings > 0)
        .map(({ file, warnings }) => `| ${file} | ${warnings} |`).join('\n')}

## Dependent File Details

This section shows which files depend on the most imported utility files.

${topUtilityFiles.slice(0, 5).map(({ file, importers }) => `
### ${file} (imported by ${importers} files)

${dependents[file].slice(0, 10).map(dep => `- ${dep}`).join('\n')}
${dependents[file].length > 10 ? `\n...and ${dependents[file].length - 10} more files` : ''}
`).join('\n')}
`;

fs.writeFileSync(
    path.join(__dirname, 'reports', 'utility-files.md'),
    utilityReport
);
console.log(`Utility file report written to ${path.join('analysis-scripts', 'reports', 'utility-files.md')}`);

// Generate CSV report for utility files
console.log('Generating utility files CSV...');
const utilityCSV = `File,ImpactScore,Importers,Warnings\n` +
    topUtilityFiles.sort((a, b) => b.impactScore - a.impactScore)
        .map(({ file, impactScore, importers, warnings }) =>
            `"${file}",${impactScore.toFixed(1)},${importers},${warnings}`
        ).join('\n');

fs.writeFileSync(
    path.join(__dirname, 'reports', 'utility-files.csv'),
    utilityCSV
);
console.log(`Utility file CSV written to ${path.join('analysis-scripts', 'reports', 'utility-files.csv')}`);

console.log('Utility file analysis complete!'); 