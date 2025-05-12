const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create reports directory if it doesn't exist
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
}

// Run ESLint and get current warning count
const getCurrentWarningCount = () => {
    try {
        console.log('Running ESLint to get current warning count...');
        const output = execSync('npx eslint "src/**/*.{ts,tsx}" --max-warnings=9999', { encoding: 'utf8', stdio: 'pipe' });

        // Parse the output to find warning count
        const warningMatch = output.match(/(\d+) warnings/);
        if (warningMatch && warningMatch[1]) {
            return parseInt(warningMatch[1], 10);
        }
        return 0;
    } catch (error) {
        // ESLint exits with code 1 when there are warnings, so we need to parse stdout from the error
        if (error.stdout) {
            const warningMatch = error.stdout.match(/(\d+) warnings/);
            if (warningMatch && warningMatch[1]) {
                return parseInt(warningMatch[1], 10);
            }
        }
        console.error('Error running ESLint:', error.message);
        return 0;
    }
};

// Categorize warnings by rule
const categorizeWarnings = () => {
    try {
        console.log('Categorizing warnings by rule...');
        const output = execSync(
            'npx eslint "src/**/*.{ts,tsx}" --max-warnings=9999 --format json',
            { encoding: 'utf8', stdio: 'pipe' }
        );

        const results = JSON.parse(output);
        const warningsByRule = {};

        // Count warnings by rule
        results.forEach(result => {
            result.messages.forEach(message => {
                if (message.severity === 1 && message.ruleId) {
                    warningsByRule[message.ruleId] = (warningsByRule[message.ruleId] || 0) + 1;
                }
            });
        });

        return warningsByRule;
    } catch (error) {
        // ESLint exits with code 1 when there are warnings
        if (error.stdout) {
            try {
                const results = JSON.parse(error.stdout);
                const warningsByRule = {};

                results.forEach(result => {
                    result.messages.forEach(message => {
                        if (message.severity === 1 && message.ruleId) {
                            warningsByRule[message.ruleId] = (warningsByRule[message.ruleId] || 0) + 1;
                        }
                    });
                });

                return warningsByRule;
            } catch (e) {
                console.error('Error parsing ESLint JSON output:', e.message);
            }
        }
        return {};
    }
};

// Get the most affected files
const getMostAffectedFiles = () => {
    try {
        console.log('Finding most affected files...');
        const output = execSync(
            'npx eslint "src/**/*.{ts,tsx}" --max-warnings=9999 --format json',
            { encoding: 'utf8', stdio: 'pipe' }
        );

        const results = JSON.parse(output);
        const fileWarnings = results
            .map(result => ({
                filePath: path.relative(process.cwd(), result.filePath),
                warningCount: result.messages.filter(m => m.severity === 1).length
            }))
            .filter(file => file.warningCount > 0)
            .sort((a, b) => b.warningCount - a.warningCount);

        return fileWarnings.slice(0, 10); // Top 10 files
    } catch (error) {
        if (error.stdout) {
            try {
                const results = JSON.parse(error.stdout);
                const fileWarnings = results
                    .map(result => ({
                        filePath: path.relative(process.cwd(), result.filePath),
                        warningCount: result.messages.filter(m => m.severity === 1).length
                    }))
                    .filter(file => file.warningCount > 0)
                    .sort((a, b) => b.warningCount - a.warningCount);

                return fileWarnings.slice(0, 10);
            } catch (e) {
                console.error('Error parsing ESLint JSON output for files:', e.message);
            }
        }
        return [];
    }
};

// Load baseline warning count from week 1 report
const getBaselineWarningCount = () => {
    try {
        const finalAnalysis = fs.readFileSync('reports/final-analysis.json', 'utf8');
        const data = JSON.parse(finalAnalysis);
        return data.summary.totalWarnings || 0;
    } catch (error) {
        console.warn('No baseline warning count found. Using 100 as default.');
        return 100; // Default if not found
    }
};

// Generate the progress report
const generateReport = () => {
    console.log('Generating warning reduction progress report...');

    // Get warning counts
    const baselineWarnings = getBaselineWarningCount();
    const currentWarnings = getCurrentWarningCount();
    const reductionPercent = baselineWarnings > 0
        ? Math.round(((baselineWarnings - currentWarnings) / baselineWarnings) * 100)
        : 0;

    // Get categorized warnings
    const warningsByRule = categorizeWarnings();
    const warningRules = Object.entries(warningsByRule)
        .sort((a, b) => b[1] - a[1])
        .map(([rule, count]) => ({ rule, count }));

    // Get most affected files
    const mostAffectedFiles = getMostAffectedFiles();

    // Build the report
    const report = {
        generatedAt: new Date().toISOString(),
        summary: {
            baselineWarnings,
            currentWarnings,
            reductionPercent,
            reductionCount: baselineWarnings - currentWarnings
        },
        warningRules,
        mostAffectedFiles
    };

    // Save as JSON
    fs.writeFileSync('reports/warning-reduction-progress.json', JSON.stringify(report, null, 2));

    // Generate Markdown report
    const markdown = `# ESLint Warning Reduction Progress

## Summary

- **Baseline Warnings**: ${baselineWarnings}
- **Current Warnings**: ${currentWarnings}
- **Reduction**: ${reductionPercent}% (${baselineWarnings - currentWarnings} warnings fixed)

## Warnings by Rule

| Rule | Count |
|------|-------|
${warningRules.map(({ rule, count }) => `| ${rule} | ${count} |`).join('\n')}

## Most Affected Files

| File | Warning Count |
|------|--------------|
${mostAffectedFiles.map(file => `| ${file.filePath} | ${file.warningCount} |`).join('\n')}

## Next Steps

1. Focus on fixing \`${warningRules[0]?.rule || 'N/A'}\` warnings, which have the highest count
2. Address issues in the most affected file: \`${mostAffectedFiles[0]?.filePath || 'N/A'}\`
3. Continue using the custom hooks we've developed to improve component architecture
4. Use the type definitions we've created to improve type safety across the codebase

## Recommendations

${reductionPercent >= 80
            ? '✅ We have successfully achieved our goal of reducing warnings by 80% or more!'
            : `We should continue working to reach our goal of 80% warning reduction. Currently at ${reductionPercent}%.`}

${currentWarnings === 0
            ? '🎉 All warnings have been eliminated! The codebase is now fully ESLint compliant.'
            : 'Further improvements can be made to eliminate all remaining warnings.'}

## Conclusion

The warning reduction effort has been ${reductionPercent >= 50 ? 'successful' : 'progressing'}, with a focus on improving type safety, component architecture, and code quality. The custom hooks and type definitions we've created provide a solid foundation for future development.
`;

    fs.writeFileSync('reports/warning-reduction-progress.md', markdown);

    console.log('Report generated successfully:');
    console.log('- reports/warning-reduction-progress.json');
    console.log('- reports/warning-reduction-progress.md');

    // Print summary to console
    console.log('\nWarning Reduction Summary:');
    console.log(`Baseline: ${baselineWarnings} warnings`);
    console.log(`Current: ${currentWarnings} warnings`);
    console.log(`Reduction: ${reductionPercent}% (${baselineWarnings - currentWarnings} warnings fixed)`);

    if (warningRules.length > 0) {
        console.log('\nTop 3 Warning Rules:');
        warningRules.slice(0, 3).forEach(({ rule, count }) => {
            console.log(`- ${rule}: ${count} warnings`);
        });
    }
};

// Run the report generator
generateReport(); 