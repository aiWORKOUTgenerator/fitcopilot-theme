const fs = require('fs');

// Create reports directory if it doesn't exist
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
}

// Load warning data
let data = [];
try {
    data = JSON.parse(fs.readFileSync('reports/eslint-warnings-categorized.json'));
} catch (error) {
    console.log('No warning data found. Run analyze-warnings.sh first.');
    process.exit(1);
}

// Define impact levels for different rules
const impactLevels = {
    // Type safety
    '@typescript-eslint/no-explicit-any': 'high',
    '@typescript-eslint/explicit-function-return-type': 'high',
    '@typescript-eslint/no-non-null-assertion': 'medium',

    // React Hooks
    'react-hooks/exhaustive-deps': 'high',
    'react-hooks/rules-of-hooks': 'high',

    // Unused variables and imports
    '@typescript-eslint/no-unused-vars': 'medium',
    'import/no-unused-modules': 'medium',

    // Potential bugs
    'no-console': 'medium',
    'prefer-const': 'low',
    'no-empty': 'medium',

    // Code style
    'import/order': 'low',
    'sort-imports': 'low',
    '@typescript-eslint/naming-convention': 'low'
};

// Set default impact level for rules not explicitly defined
function getImpactLevel(ruleId) {
    return impactLevels[ruleId] || 'medium';
}

// Calculate priority score based on count and impact
function getPriorityScore(count, impact) {
    const impactMultiplier = { high: 3, medium: 2, low: 1 };
    return count * impactMultiplier[impact];
}

// Build prioritization matrix
const prioritized = data.map(item => ({
    ruleId: item.ruleId,
    count: item.count,
    impact: getImpactLevel(item.ruleId),
    score: getPriorityScore(item.count, getImpactLevel(item.ruleId)),
    files: item.files
})).sort((a, b) => b.score - a.score);

// Generate JSON report
fs.writeFileSync('reports/warning-priorities.json', JSON.stringify(prioritized, null, 2));

// Print summary to console
console.log('ESLint Warning Prioritization:');
console.log('--------------------------------');
prioritized.slice(0, 10).forEach(item => {
    console.log(`${item.ruleId}: ${item.count} occurrences, ${item.impact} impact, score: ${item.score}`);
});

// Generate HTML report
const html = `<!DOCTYPE html>
<html>
<head>
  <title>ESLint Warning Prioritization</title>
  <style>
    body { font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; position: sticky; top: 0; }
    .high { background-color: #ffeded; }
    .medium { background-color: #fff9e6; }
    .low { background-color: #f0fff0; }
    h1, h2 { color: #333; }
    .summary { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>ESLint Warning Prioritization</h1>
  
  <div class="summary">
    <h2>Impact Categories</h2>
    <p><strong>High Impact:</strong> Potential bugs, type safety issues, and React hook problems</p>
    <p><strong>Medium Impact:</strong> Code quality and maintainability issues</p>
    <p><strong>Low Impact:</strong> Stylistic and formatting concerns</p>
  </div>
  
  <table>
    <tr>
      <th>Rule</th>
      <th>Count</th>
      <th>Impact</th>
      <th>Priority Score</th>
    </tr>
    ${prioritized.map(item => `
      <tr class="${item.impact}">
        <td>${item.ruleId}</td>
        <td>${item.count}</td>
        <td>${item.impact}</td>
        <td>${item.score}</td>
      </tr>
    `).join('')}
  </table>
</body>
</html>`;

fs.writeFileSync('reports/warning-priorities.html', html);
console.log('Prioritization reports generated:');
console.log('- reports/warning-priorities.json');
console.log('- reports/warning-priorities.html'); 