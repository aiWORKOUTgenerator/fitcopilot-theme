#!/bin/bash

echo "Analyzing warnings by file type..."
mkdir -p reports

# Analyze TSX files
echo "Analyzing TSX files..."
npx eslint "src/**/*.tsx" --max-warnings=9999 --format json | \
jq '.[] | select(.messages[0].severity == 1) | {filePath, ruleId: .messages[0].ruleId}' | \
jq -s 'group_by(.ruleId) | map({ruleId: .[0].ruleId, count: length})' > \
reports/tsx-warnings.json

# Analyze TS files
echo "Analyzing TS files..."
npx eslint "src/**/*.ts" --max-warnings=9999 --format json | \
jq '.[] | select(.messages[0].severity == 1) | {filePath, ruleId: .messages[0].ruleId}' | \
jq -s 'group_by(.ruleId) | map({ruleId: .[0].ruleId, count: length})' > \
reports/ts-warnings.json

# Count total warnings by file type
TSX_WARNINGS=$(jq 'map(.count) | add' reports/tsx-warnings.json)
TS_WARNINGS=$(jq 'map(.count) | add' reports/ts-warnings.json)

echo "Summary:"
echo "- TSX files: $TSX_WARNINGS warnings"
echo "- TS files: $TS_WARNINGS warnings"
echo "- Total: $(($TSX_WARNINGS + $TS_WARNINGS)) warnings"

# Print most common warnings by file type
echo -e "\nTop 5 warnings in TSX files:"
jq -r 'sort_by(-.count) | .[0:5] | .[] | "\(.ruleId): \(.count) occurrences"' reports/tsx-warnings.json

echo -e "\nTop 5 warnings in TS files:"
jq -r 'sort_by(-.count) | .[0:5] | .[] | "\(.ruleId): \(.count) occurrences"' reports/ts-warnings.json

echo "File type analysis complete" 