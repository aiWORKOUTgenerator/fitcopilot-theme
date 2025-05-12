const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get list of files with exhaustive deps warnings
const getFilesWithHookWarnings = () => {
    try {
        const eslintOutput = execSync(
            'npx eslint "src/**/*.{ts,tsx}" --rule "react-hooks/exhaustive-deps: error" --format json',
            { encoding: 'utf8' }
        );

        const results = JSON.parse(eslintOutput);
        return results
            .filter(result => result.messages.some(msg => msg.ruleId === 'react-hooks/exhaustive-deps'))
            .map(result => ({
                filePath: result.filePath,
                messages: result.messages.filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps')
            }));
    } catch (error) {
        // If eslint exits with error (which it does when finding errors)
        const output = error.stdout;
        try {
            const results = JSON.parse(output);
            return results
                .filter(result => result.messages.some(msg => msg.ruleId === 'react-hooks/exhaustive-deps'))
                .map(result => ({
                    filePath: result.filePath,
                    messages: result.messages.filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps')
                }));
        } catch (e) {
            console.error('Error parsing ESLint output:', e);
            return [];
        }
    }
};

// Create report with hook issues
const createHookReport = (files) => {
    let report = '# React Hooks Dependency Analysis\n\n';

    // Group by file
    report += `## Files with hook dependency issues: ${files.length}\n\n`;

    files.forEach(file => {
        const relativePath = path.relative(process.cwd(), file.filePath);
        report += `### ${relativePath}\n\n`;

        file.messages.forEach(message => {
            report += `- **Line ${message.line}:** ${message.message}\n`;

            // Extract suggestion from the message if available
            const missingDeps = message.message.match(/The following dependencies are missing: (.+)/);
            if (missingDeps && missingDeps[1]) {
                report += `  - Missing dependencies: \`${missingDeps[1]}\`\n`;
            }
        });

        report += '\n';
    });

    report += '## Common Issues and Solutions\n\n';
    report += '1. **Missing dependencies**: Add all variables used inside the hook to the dependency array\n';
    report += '2. **Object or array dependencies**: Convert to primitive values or memoize with useMemo\n';
    report += '3. **Function dependencies**: Move function inside the hook or memoize with useCallback\n';
    report += '4. **Props in dependency array**: Ensure props are memoized or used directly\n';
    report += '5. **Constants outside dependency array**: Move constants outside the component or useEffect\n';
    report += '6. **Deliberately skipping dependencies**: For specific cases, add an eslint-disable comment\n';

    // Create the reports directory if it doesn't exist
    if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports');
    }

    fs.writeFileSync('reports/react-hooks-analysis.md', report);
    console.log('Report generated: reports/react-hooks-analysis.md');
};

// Generate quick fixes for common hook dependencies issues
const suggestFixes = (files) => {
    console.log('\n=== Suggested Fixes ===\n');

    files.forEach(file => {
        const relativePath = path.relative(process.cwd(), file.filePath);
        console.log(`\nFile: ${relativePath}`);

        // Read file content
        const content = fs.readFileSync(file.filePath, 'utf-8');
        const lines = content.split('\n');

        file.messages.forEach(message => {
            console.log(`\n  Line ${message.line}: ${message.message}`);

            // Show the problematic code
            const codeSnippet = lines.slice(Math.max(0, message.line - 2), message.line + 3).join('\n');
            console.log('\n  Code snippet:');
            console.log('  ' + codeSnippet.replace(/\n/g, '\n  '));

            // Extract missing dependencies
            const missingDeps = message.message.match(/The following dependencies are missing: (.+)/);
            if (missingDeps && missingDeps[1]) {
                const missing = missingDeps[1];
                console.log('\n  Suggested fix:');

                if (missing.includes('function')) {
                    console.log('  - Wrap the function in useCallback:');
                    console.log('    const handleAction = useCallback(() => {\n      // function body\n    }, [dependencies]);');
                } else if (missing.includes('props')) {
                    console.log('  - Extract required props to dependency array:');
                    console.log('    useEffect(() => {\n      // effect body\n    }, [prop1, prop2, prop3]);');
                } else if (missing.includes('array') || missing.includes('object')) {
                    console.log('  - Memoize the object/array with useMemo:');
                    console.log('    const memoizedValue = useMemo(() => {\n      return { /* object properties */ };\n    }, [dependencies]);');
                } else {
                    console.log('  - Add missing dependencies to the array:');
                    console.log(`    useEffect(() => {\n      // effect body\n    }, [${missing}]);`);
                }
            }
        });
    });
};

// Main function
const main = () => {
    console.log('Finding files with React hooks exhaustive dependencies warnings...');
    const files = getFilesWithHookWarnings();

    if (files.length === 0) {
        console.log('No files with hook dependency issues found.');
        return;
    }

    console.log(`Found ${files.length} files with hook dependency issues.`);
    createHookReport(files);
    suggestFixes(files);

    console.log('\nAnalysis complete. Check reports/react-hooks-analysis.md for a detailed report.');
    console.log('Common solutions:');
    console.log('1. Add missing variables to dependency array');
    console.log('2. Use useCallback for functions used in effect');
    console.log('3. Use useMemo for objects or arrays in dependency');
    console.log('4. Move dependencies outside the component if they never change');
    console.log('5. Add eslint-disable comment for intentional exclusions');
};

main(); 