#!/bin/bash

# ESLint Tracking Script
# Creates a snapshot of current ESLint errors/warnings

# Set the directory of this script as the base directory
BASE_DIR="$(dirname "$0")/.."
REPORTS_DIR="$BASE_DIR/reports"

# Create reports directory if it doesn't exist
mkdir -p "$REPORTS_DIR"

# Generate a timestamp for the report
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_FILE="$REPORTS_DIR/eslint-$TIMESTAMP.json"
SUMMARY_FILE="$REPORTS_DIR/eslint-$TIMESTAMP-summary.txt"

echo "Generating ESLint report..."
npx eslint "src/**/*.{js,jsx,ts,tsx}" --format json > "$REPORT_FILE"

# Count errors and warnings
ERRORS=$(cat "$REPORT_FILE" | grep -o '"severity":2' | wc -l | tr -d ' ')
WARNINGS=$(cat "$REPORT_FILE" | grep -o '"severity":1' | wc -l | tr -d ' ')
TOTAL=$((ERRORS + WARNINGS))

# Generate summary
echo "ESLint Report Summary ($TIMESTAMP)" > "$SUMMARY_FILE"
echo "==================================" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "Total issues: $TOTAL" >> "$SUMMARY_FILE"
echo "Errors: $ERRORS" >> "$SUMMARY_FILE"
echo "Warnings: $WARNINGS" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

# Get top 10 rule violations
echo "Top rule violations:" >> "$SUMMARY_FILE"
cat "$REPORT_FILE" | grep -o '"ruleId":"[^"]*"' | sort | uniq -c | sort -nr | head -10 | sed 's/"ruleId":"/ - /' | sed 's/"$//' >> "$SUMMARY_FILE"

# Print summary to console
cat "$SUMMARY_FILE"

echo "Full report saved to $REPORT_FILE"
echo "Summary saved to $SUMMARY_FILE"

# Add baseline comparison if baseline exists
BASELINE_FILE="$REPORTS_DIR/eslint-baseline.json"
if [ -f "$BASELINE_FILE" ]; then
  COMPARISON_FILE="$REPORTS_DIR/eslint-comparison-$TIMESTAMP.txt"
  echo "Comparing with baseline..."
  
  # Count baseline errors and warnings
  BASELINE_ERRORS=$(cat "$BASELINE_FILE" | grep -o '"severity":2' | wc -l | tr -d ' ')
  BASELINE_WARNINGS=$(cat "$BASELINE_FILE" | grep -o '"severity":1' | wc -l | tr -d ' ')
  BASELINE_TOTAL=$((BASELINE_ERRORS + BASELINE_WARNINGS))
  
  # Calculate differences
  ERRORS_DIFF=$((BASELINE_ERRORS - ERRORS))
  WARNINGS_DIFF=$((BASELINE_WARNINGS - WARNINGS))
  TOTAL_DIFF=$((BASELINE_TOTAL - TOTAL))
  
  # Generate comparison report
  echo "ESLint Comparison Report ($TIMESTAMP)" > "$COMPARISON_FILE"
  echo "==================================" >> "$COMPARISON_FILE"
  echo "" >> "$COMPARISON_FILE"
  echo "Baseline vs Current:" >> "$COMPARISON_FILE"
  echo "Total issues: $BASELINE_TOTAL -> $TOTAL ($([ $TOTAL_DIFF -ge 0 ] && echo -n "+" || echo -n "")$TOTAL_DIFF)" >> "$COMPARISON_FILE"
  echo "Errors: $BASELINE_ERRORS -> $ERRORS ($([ $ERRORS_DIFF -ge 0 ] && echo -n "+" || echo -n "")$ERRORS_DIFF)" >> "$COMPARISON_FILE"
  echo "Warnings: $BASELINE_WARNINGS -> $WARNINGS ($([ $WARNINGS_DIFF -ge 0 ] && echo -n "+" || echo -n "")$WARNINGS_DIFF)" >> "$COMPARISON_FILE"
  
  # Print comparison to console
  cat "$COMPARISON_FILE"
  echo "Comparison saved to $COMPARISON_FILE"
fi 