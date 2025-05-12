#!/bin/bash

echo "Generating ESLint warning report..."
mkdir -p reports

npx eslint "src/**/*.{ts,tsx}" --max-warnings=9999 --format json | \
jq '.[] | select(.messages[0].severity == 1) | {filePath, ruleId: .messages[0].ruleId, message: .messages[0].message}' | \
jq -s 'group_by(.ruleId) | map({ruleId: .[0].ruleId, count: length, files: map(.filePath) | unique})' > \
reports/eslint-warnings-categorized.json

echo "Report generated at reports/eslint-warnings-categorized.json" 