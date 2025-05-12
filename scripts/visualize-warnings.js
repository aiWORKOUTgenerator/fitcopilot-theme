const fs = require('fs');

// Create reports directory if it doesn't exist
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
}

// Load warning data or use empty array if file doesn't exist
let data = [];
try {
    data = JSON.parse(fs.readFileSync('reports/eslint-warnings-categorized.json'));
} catch (error) {
    console.log('No warning data found. Run analyze-warnings.sh first.');
    process.exit(1);
}

const sorted = data.sort((a, b) => b.count - a.count);

console.log('ESLint Warning Distribution:');
console.log('----------------------------');
sorted.forEach(item => {
    console.log(`${item.ruleId}: ${item.count} occurrences`);
});

// Generate HTML report with collapsible sections
const html = `<!DOCTYPE html>
<html>
<head>
  <title>ESLint Warning Analysis</title>
  <style>
    body { font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .rule { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
    .rule-header { background: #f5f5f5; padding: 10px; cursor: pointer; display: flex; justify-content: space-between; }
    .rule-files { padding: 10px; display: none; }
    .count { font-weight: bold; }
    .high { color: #d73a4a; }
    .medium { color: #ff9800; }
    .low { color: #28a745; }
    h1, h2 { color: #333; }
    .summary { background: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
  </style>
  <script>
    function toggleFiles(id) {
      const element = document.getElementById(id);
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  </script>
</head>
<body>
  <h1>ESLint Warning Analysis</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Total warnings: ${sorted.reduce((sum, item) => sum + item.count, 0)}</p>
    <p>Unique rules: ${sorted.length}</p>
  </div>
  
  ${sorted.map((item, index) => `
    <div class="rule">
      <div class="rule-header" onclick="toggleFiles('files-${index}')">
        <span>${item.ruleId}</span>
        <span class="count ${item.count > 30 ? 'high' : item.count > 10 ? 'medium' : 'low'}">${item.count}</span>
      </div>
      <div class="rule-files" id="files-${index}">
        <ul>
          ${item.files.map(file => `<li>${file}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('')}
  
</body>
</html>`;

fs.writeFileSync('reports/warning-distribution.html', html);
console.log('HTML report generated at reports/warning-distribution.html'); 