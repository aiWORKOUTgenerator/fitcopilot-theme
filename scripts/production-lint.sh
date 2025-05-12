#!/bin/bash
OUTPUT_DIR="reports"
TIMESTAMP=$(date +%Y%m%d-%H%M)
mkdir -p $OUTPUT_DIR

# Run ESLint on production code only (excluding tests)
npx eslint "src/**/*.{ts,tsx}" \
  --ignore-pattern "**/*.{test,spec,stories}.{ts,tsx}" \
  --format json > "$OUTPUT_DIR/prod-errors-$TIMESTAMP.json"

# Generate summary
echo "Production Code ESLint Error Report ($TIMESTAMP)" > "$OUTPUT_DIR/prod-errors-$TIMESTAMP.txt"
echo "=========================================" >> "$OUTPUT_DIR/prod-errors-$TIMESTAMP.txt"
echo "" >> "$OUTPUT_DIR/prod-errors-$TIMESTAMP.txt"

# Extract error counts by rule
cat "$OUTPUT_DIR/prod-errors-$TIMESTAMP.json" | \
  node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    const errorsByRule = {};
    let totalErrors = 0;
    
    data.forEach(file => {
      file.messages.forEach(msg => {
        if (msg.severity === 2) { // Only count errors, not warnings
          totalErrors++;
          errorsByRule[msg.ruleId] = (errorsByRule[msg.ruleId] || 0) + 1;
        }
      });
    });
    
    console.log(\`Total Errors: \${totalErrors}\n\`);
    console.log('Errors by Rule:');
    Object.entries(errorsByRule)
      .sort((a, b) => b[1] - a[1])
      .forEach(([rule, count]) => {
        console.log(\`  \${rule}: \${count}\`);
      });
  " >> "$OUTPUT_DIR/prod-errors-$TIMESTAMP.txt"

# Generate file-specific report for top error files
cat "$OUTPUT_DIR/prod-errors-$TIMESTAMP.json" | \
  node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    const errorsByFile = {};
    
    data.forEach(file => {
      const errorCount = file.messages.filter(msg => msg.severity === 2).length;
      if (errorCount > 0) {
        errorsByFile[file.filePath] = errorCount;
      }
    });
    
    console.log('\nTop Files with Errors:');
    Object.entries(errorsByFile)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([file, count]) => {
        console.log(\`  \${file.split('/').slice(-3).join('/')}: \${count}\`);
      });
  " >> "$OUTPUT_DIR/prod-errors-$TIMESTAMP.txt"

cat "$OUTPUT_DIR/prod-errors-$TIMESTAMP.txt" 