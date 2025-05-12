#!/bin/bash

FEATURE=$1
if [ -z "$FEATURE" ]; then
  echo "Usage: $0 <feature-name>"
  echo "Example: $0 Homepage"
  exit 1
fi

# Check if the feature directory exists
if [ ! -d "src/features/$FEATURE" ]; then
  echo "Error: Feature directory 'src/features/$FEATURE' does not exist"
  echo "Available features:"
  ls -1 src/features/
  exit 1
fi

echo "Analyzing warnings in $FEATURE feature..."
mkdir -p reports

npx eslint "src/features/$FEATURE/**/*.{ts,tsx}" --max-warnings=9999 --format json | \
jq '.[] | select(.messages[0].severity == 1) | {filePath, ruleId: .messages[0].ruleId}' | \
jq -s 'group_by(.ruleId) | map({ruleId: .[0].ruleId, count: length, files: map(.filePath) | unique})' > \
reports/feature-warnings-$FEATURE.json

# Print summary
echo "==== $FEATURE Warning Summary ===="
jq -r '.[] | "\(.ruleId): \(.count) occurrences"' reports/feature-warnings-$FEATURE.json | sort -rn -k2 -t:

echo "Report generated at reports/feature-warnings-$FEATURE.json" 