#!/bin/bash

# Script to track ESLint errors over time
# Creates a JSON report with the current date in the filename

# Exit on error
set -e

# Create reports directory if it doesn't exist
mkdir -p reports

# Generate a date-stamped filename
DATE=$(date +%Y%m%d)
REPORT_FILE="reports/eslint-$DATE.json"

# Run ESLint and save the report
echo "Generating ESLint report: $REPORT_FILE"
npx eslint "src/**/*.{js,jsx,ts,tsx}" --format json > "$REPORT_FILE"

# Also summarize the errors in a readable format
SUMMARY_FILE="reports/eslint-summary-$DATE.txt"
echo "ESLint Summary Report - $(date)" > "$SUMMARY_FILE"
echo "=================================" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

# Extract error counts by type
echo "Error counts by rule:" >> "$SUMMARY_FILE"
cat "$REPORT_FILE" | grep "ruleId" | sort | uniq -c | sort -nr >> "$SUMMARY_FILE"

echo "" >> "$SUMMARY_FILE"
echo "Total files with issues: $(cat "$REPORT_FILE" | grep "filePath" | wc -l)" >> "$SUMMARY_FILE"
echo "Report generated at: $REPORT_FILE"
echo "Summary available at: $SUMMARY_FILE" 