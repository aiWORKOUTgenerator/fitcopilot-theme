const fs = require('fs');
const path = require('path');

// Create reports directory if it doesn't exist
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
}

// Load component warnings
let uiComponents = [];
let featureComponents = [];
let layoutComponents = [];

try {
    uiComponents = JSON.parse(fs.readFileSync('reports/ui-component-warnings.json'));
} catch (error) {
    console.log('UI component warnings not found. Run component-warnings.sh first.');
}

try {
    featureComponents = JSON.parse(fs.readFileSync('reports/feature-component-warnings.json'));
} catch (error) {
    console.log('Feature component warnings not found. Run component-warnings.sh first.');
}

try {
    if (fs.existsSync('reports/layout-component-warnings.json')) {
        layoutComponents = JSON.parse(fs.readFileSync('reports/layout-component-warnings.json'));
    }
} catch (error) {
    // Layout components are optional
}

const allComponents = [...uiComponents, ...featureComponents, ...layoutComponents];

if (allComponents.length === 0) {
    console.log('No component warnings found. Run component-warnings.sh first.');
    process.exit(1);
}

// Identify warning patterns
const patternAnalysis = {
    unusedProps: 0,
    anyTypes: 0,
    hooksExhaustiveDeps: 0,
    implicitType: 0,
    unnecessaryEscape: 0,
    importOrder: 0,
    preferConst: 0,
    consoleStatements: 0,
    accessibility: 0,
    other: 0
};

// Map rules to categories
const ruleCategories = {
    '@typescript-eslint/no-unused-vars': 'unusedProps',
    '@typescript-eslint/no-explicit-any': 'anyTypes',
    'react-hooks/exhaustive-deps': 'hooksExhaustiveDeps',
    '@typescript-eslint/explicit-function-return-type': 'implicitType',
    'no-useless-escape': 'unnecessaryEscape',
    'import/order': 'importOrder',
    'prefer-const': 'preferConst',
    'no-console': 'consoleStatements',
    'jsx-a11y/': 'accessibility'
};

function categorizeRule(rule) {
    for (const [rulePattern, category] of Object.entries(ruleCategories)) {
        if (rule.includes(rulePattern)) {
            return category;
        }
    }
    return 'other';
}

// Count patterns
const componentTypePatterns = {
    UI: { total: 0, patterns: { ...patternAnalysis } },
    Feature: { total: 0, patterns: { ...patternAnalysis } },
    Layout: { total: 0, patterns: { ...patternAnalysis } }
};

// Process UI components
uiComponents.forEach(comp => {
    componentTypePatterns.UI.total += comp.warnings;
    comp.rules.forEach(rule => {
        const category = categorizeRule(rule);
        componentTypePatterns.UI.patterns[category]++;
        patternAnalysis[category]++;
    });
});

// Process Feature components
featureComponents.forEach(comp => {
    componentTypePatterns.Feature.total += comp.warnings;
    comp.rules.forEach(rule => {
        const category = categorizeRule(rule);
        componentTypePatterns.Feature.patterns[category]++;
        patternAnalysis[category]++;
    });
});

// Process Layout components
layoutComponents.forEach(comp => {
    componentTypePatterns.Layout.total += comp.warnings;
    comp.rules.forEach(rule => {
        const category = categorizeRule(rule);
        componentTypePatterns.Layout.patterns[category]++;
        patternAnalysis[category]++;
    });
});

// Generate JSON reports
fs.writeFileSync('reports/warning-patterns.json', JSON.stringify(patternAnalysis, null, 2));
fs.writeFileSync('reports/component-type-patterns.json', JSON.stringify(componentTypePatterns, null, 2));

// Print summary to console
console.log('Warning Pattern Distribution:');
console.log('----------------------------');
Object.entries(patternAnalysis)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, value]) => {
        console.log(`${key}: ${value} occurrences`);
    });

// Generate chart data
const chartData = Object.entries(patternAnalysis)
    .map(([key, value]) => ({ name: key, value }))
    .sort((a, b) => b.value - a.value);

// Generate HTML report with charts
const chartHtml = `<!DOCTYPE html>
<html>
<head>
  <title>ESLint Warning Pattern Analysis</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .chart-container { max-width: 800px; margin: 0 auto 30px; }
    .section { margin-bottom: 40px; }
    h1, h2 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    .summary { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>ESLint Warning Pattern Analysis</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Total patterns analyzed: ${Object.values(patternAnalysis).reduce((sum, val) => sum + val, 0)}</p>
    <p>Component warnings analyzed: ${allComponents.length}</p>
  </div>
  
  <div class="section">
    <h2>Overall Pattern Distribution</h2>
    <div class="chart-container">
      <canvas id="patternChart"></canvas>
    </div>
    
    <table>
      <tr>
        <th>Pattern</th>
        <th>Count</th>
        <th>Percentage</th>
      </tr>
      ${chartData.map(item => {
    const percentage = ((item.value / Object.values(patternAnalysis).reduce((sum, val) => sum + val, 0)) * 100).toFixed(1);
    return `
          <tr>
            <td>${item.name}</td>
            <td>${item.value}</td>
            <td>${percentage}%</td>
          </tr>
        `;
}).join('')}
    </table>
  </div>
  
  <div class="section">
    <h2>Pattern Distribution by Component Type</h2>
    <div class="chart-container">
      <canvas id="componentTypeChart"></canvas>
    </div>
  </div>
  
  <script>
    // Overall pattern chart
    const patternData = ${JSON.stringify(chartData)};
    
    new Chart(document.getElementById('patternChart'), {
      type: 'pie',
      data: {
        labels: patternData.map(d => d.name),
        datasets: [{
          data: patternData.map(d => d.value),
          backgroundColor: [
            '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#c9cbcf',
            '#ff9f40', '#ffcd56', '#7cd992', '#4dbde6', '#cab0e3'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Warning Patterns Distribution' }
        }
      }
    });
    
    // Component type comparison chart
    const componentTypes = ${JSON.stringify(Object.keys(componentTypePatterns))};
    const patternTypes = ${JSON.stringify(Object.keys(patternAnalysis))};
    
    const typeData = {
      labels: componentTypes,
      datasets: patternTypes.map((pattern, index) => {
        const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#c9cbcf', 
                        '#ff9f40', '#ffcd56', '#7cd992', '#4dbde6'];
        return {
          label: pattern,
          data: componentTypes.map(type => componentTypePatterns[type].patterns[pattern]),
          backgroundColor: colors[index % colors.length]
        };
      })
    };
    
    new Chart(document.getElementById('componentTypeChart'), {
      type: 'bar',
      data: typeData,
      options: {
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        },
        plugins: {
          title: { display: true, text: 'Warning Patterns by Component Type' }
        }
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync('reports/warning-patterns.html', chartHtml);
console.log('Pattern analysis complete:');
console.log('- reports/warning-patterns.json');
console.log('- reports/component-type-patterns.json');
console.log('- reports/warning-patterns.html'); 