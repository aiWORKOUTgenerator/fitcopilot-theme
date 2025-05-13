#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ESLINT_CMD = 'npx eslint --format json';
const SRC_DIR = path.resolve(process.cwd(), 'src');

// Rule patterns that may represent false positives
const FALSE_POSITIVE_PATTERNS = [
    // React hooks exhaustive deps for intentional patterns
    {
        rule: 'react-hooks/exhaustive-deps',
        patterns: [
            { regex: /useCallback\(\(\).+=>.*dispatch\(/, message: 'Intentional dispatch optimization' },
            { regex: /useCallback\(\(\).+=>.*navigate\(/, message: 'Intentional navigation optimization' },
            { regex: /useEffect\(\(\).+{.+?}, \[\]/, message: 'Component mount/unmount effect' },
        ]
    },
    // Unused variables in destructuring that are required by API
    {
        rule: '@typescript-eslint/no-unused-vars',
        patterns: [
            { regex: /const {.+?_.+?}.+?= props/, message: 'Required prop destructuring' },
            { regex: /function.+?\(.+?_.+?:.+?\)/, message: 'Required parameter in function signature' },
        ]
    }
];

// Get ESLint warnings
const getEslintWarnings = () => {
    try {
        const output = execSync(`${ESLINT_CMD} ${SRC_DIR}`, { encoding: 'utf-8' });
        return JSON.parse(output);
    } catch (error) {
        // ESLint returns non-zero exit code when there are warnings/errors
        if (error.stdout) {
            return JSON.parse(error.stdout);
        }
        console.error('Failed to run ESLint:', error);
        process.exit(1);
    }
};

// Check if a warning matches false positive patterns
const isFalsePositive = (warning, fileContent) => {
    const rulePatterns = FALSE_POSITIVE_PATTERNS.find(p => p.rule === warning.ruleId);
    if (!rulePatterns) return false;

    // Get the line of code with context
    const lines = fileContent.split('\n');
    const lineIndex = warning.line - 1;
    const lineContent = lines[lineIndex];

    // Check if any pattern matches
    return rulePatterns.patterns.some(pattern => pattern.regex.test(lineContent));
};

// Add ESLint directive to disable a rule for a specific line
const addEslintDirective = (filePath, warnings) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Group warnings by line to avoid adding multiple directives
    const warningsByLine = {};
    warnings.forEach(warning => {
        if (!warningsByLine[warning.line]) {
            warningsByLine[warning.line] = [];
        }
        warningsByLine[warning.line].push(warning);
    });

    // Track changes
    let changes = 0;

    // Process lines in reverse to avoid affecting line numbers
    Object.entries(warningsByLine)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .forEach(([line, lineWarnings]) => {
            const lineIndex = Number(line) - 1;
            const rules = lineWarnings.map(w => w.ruleId);

            // Check if directive already exists
            if (lineIndex > 0 && lines[lineIndex - 1].includes('eslint-disable-next-line')) {
                // Update existing directive
                const existingDirective = lines[lineIndex - 1];
                const existingRules = existingDirective.match(/eslint-disable-next-line(.+)/)[1].trim();

                const allRules = [...new Set([
                    ...existingRules.split(',').map(r => r.trim()),
                    ...rules
                ])].filter(Boolean);

                lines[lineIndex - 1] = `// eslint-disable-next-line ${allRules.join(', ')}`;
                changes++;
            } else {
                // Add new directive
                lines.splice(lineIndex, 0, `// eslint-disable-next-line ${rules.join(', ')}`);
                changes++;
            }
        });

    // Save changes if any were made
    if (changes > 0) {
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`✅ Added ${changes} ESLint directives to ${filePath}`);
        return changes;
    }

    return 0;
};

// Main execution
const main = async () => {
    console.log('🔍 Running ESLint to find warnings...');
    const results = getEslintWarnings();

    let totalDirectives = 0;
    let totalFalsePositives = 0;

    for (const result of results) {
        const filePath = result.filePath;

        // Skip files with no warnings
        if (result.messages.length === 0) continue;

        // Get file content
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Filter warnings to likely false positives
        const falsePositives = result.messages.filter(warning =>
            isFalsePositive(warning, fileContent)
        );

        totalFalsePositives += falsePositives.length;

        // Add ESLint directives for false positives
        if (falsePositives.length > 0) {
            const directives = addEslintDirective(filePath, falsePositives);
            totalDirectives += directives;
        }
    }

    console.log(`\n✅ Complete! Added ${totalDirectives} ESLint directives for ${totalFalsePositives} false positive warnings`);
};

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 