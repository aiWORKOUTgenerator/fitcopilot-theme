const fs = require('fs');

// Create reports directory if it doesn't exist
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
}

// Load file type reports
let tsxWarnings = [];
let tsWarnings = [];

try {
    tsxWarnings = JSON.parse(fs.readFileSync('reports/tsx-warnings.json'));
} catch (error) {
    console.log('TSX warnings not found. Run filetype-warnings.sh first.');
    process.exit(1);
}

try {
    tsWarnings = JSON.parse(fs.readFileSync('reports/ts-warnings.json'));
} catch (error) {
    console.log('TS warnings not found. Run filetype-warnings.sh first.');
    process.exit(1);
}

// Create combined dataset for comparison
const allRules = new Set([
    ...tsxWarnings.map(w => w.ruleId),
    ...tsWarnings.map(w => w.ruleId)
]);

const comparison = Array.from(allRules).map(rule => {
    const tsxCount = tsxWarnings.find(w => w.ruleId === rule)?.count || 0;
    const tsCount = tsWarnings.find(w => w.ruleId === rule)?.count || 0;

    return {
        rule,
        tsx: tsxCount,
        ts: tsCount,
        total: tsxCount + tsCount,
        ratio: tsxCount > 0 && tsCount > 0 ? (tsxCount / tsCount).toFixed(2) : 'N/A'
    };
}).sort((a, b) => b.total - a.total);

// Generate comparison report
fs.writeFileSync('reports/filetype-comparison.json', JSON.stringify(comparison, null, 2));

// Print summary to console
console.log('File Type Comparison Summary:');
console.log('---------------------------');
console.log(`Total rules: ${comparison.length}`);
console.log(`TSX-specific rules: ${comparison.filter(c => c.ts === 0).length}`);
console.log(`TS-specific rules: ${comparison.filter(c => c.tsx === 0).length}`);
console.log(`Shared rules: ${comparison.filter(c => c.tsx > 0 && c.ts > 0).length}`);

console.log('\nTop 10 warnings overall:');
comparison.slice(0, 10).forEach(item => {
    console.log(`${item.rule}: ${item.total} (TSX: ${item.tsx}, TS: ${item.ts})`);
});

// Generate HTML visualization
const html = `<!DOCTYPE html>
<html>
<head>
  <title>ESLint File Type Warning Comparison</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    canvas { max-width: 800px; height: 500px; margin: 0 auto 30px; }
    table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; position: sticky; top: 0; }
    h1, h2 { color: #333; }
    .summary { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .tsx { color: #36a2eb; }
    .ts { color: #ff6384; }
    .section { margin-bottom: 40px; }
    .chart-container { position: relative; margin: auto; height: 500px; }
  </style>
</head>
<body>
  <h1>File Type Warning Comparison</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Total rules: ${comparison.length}</p>
    <p><span class="tsx">TSX-specific rules:</span> ${comparison.filter(c => c.ts === 0).length}</p>
    <p><span class="ts">TS-specific rules:</span> ${comparison.filter(c => c.tsx === 0).length}</p>
    <p>Shared rules: ${comparison.filter(c => c.tsx > 0 && c.ts > 0).length}</p>
  </div>
  
  <div class="section">
    <h2>Top 10 Warnings by File Type</h2>
    <div class="chart-container">
      <canvas id="comparisonChart"></canvas>
    </div>
  </div>
  
  <div class="section">
    <h2>File Type Distribution</h2>
    <div class="chart-container" style="height: 300px;">
      <canvas id="distributionChart"></canvas>
    </div>
  </div>
  
  <h2>Detailed Comparison</h2>
  <table>
    <tr>
      <th>Rule</th>
      <th>TSX Files</th>
      <th>TS Files</th>
      <th>Total</th>
      <th>TSX:TS Ratio</th>
    </tr>
    ${comparison.map(item => `
      <tr>
        <td>${item.rule}</td>
        <td>${item.tsx}</td>
        <td>${item.ts}</td>
        <td>${item.total}</td>
        <td>${item.ratio}</td>
      </tr>
    `).join('')}
  </table>
  
  <script>
    // Top 10 comparison chart
    const data = ${JSON.stringify(comparison.slice(0, 10))};
    
    new Chart(document.getElementById('comparisonChart'), {
      type: 'bar',
      data: {
        labels: data.map(d => d.rule),
        datasets: [
          {
            label: 'TSX Files',
            data: data.map(d => d.tsx),
            backgroundColor: '#36a2eb'
          },
          {
            label: 'TS Files',
            data: data.map(d => d.ts),
            backgroundColor: '#ff6384'
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Top 10 Warnings by File Type' }
        }
      }
    });
    
    // Distribution pie chart
    const tsxTotal = ${tsxWarnings.reduce((sum, item) => sum + item.count, 0)};
    const tsTotal = ${tsWarnings.reduce((sum, item) => sum + item.count, 0)};
    
    new Chart(document.getElementById('distributionChart'), {
      type: 'pie',
      data: {
        labels: ['TSX Files', 'TS Files'],
        datasets: [{
          data: [tsxTotal, tsTotal],
          backgroundColor: ['#36a2eb', '#ff6384']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Warning Distribution by File Type' }
        }
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync('reports/filetype-comparison.html', html);
console.log('File type comparison reports generated:');
console.log('- reports/filetype-comparison.json');
console.log('- reports/filetype-comparison.html'); 