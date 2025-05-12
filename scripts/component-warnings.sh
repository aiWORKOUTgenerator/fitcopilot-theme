#!/bin/bash

echo "Analyzing ESLint warnings by component type..."
mkdir -p reports

# Analyze warnings in UI components
echo "Analyzing UI components..."
npx eslint "src/components/UI/**/*.{ts,tsx}" --max-warnings=9999 --format json | \
jq '.[] | select(.messages[0].severity == 1) | {filePath, ruleId: .messages[0].ruleId}' | \
jq -s 'group_by(.filePath) | map({component: .[0].filePath, warnings: length, rules: map(.ruleId) | unique})' > \
reports/ui-component-warnings.json

echo "UI components with warnings: $(jq '. | length' reports/ui-component-warnings.json)"

# Analyze warnings in feature components
echo "Analyzing feature components..."
npx eslint "src/features/**/components/**/*.{ts,tsx}" --max-warnings=9999 --format json | \
jq '.[] | select(.messages[0].severity == 1) | {filePath, ruleId: .messages[0].ruleId}' | \
jq -s 'group_by(.filePath) | map({component: .[0].filePath, warnings: length, rules: map(.ruleId) | unique})' > \
reports/feature-component-warnings.json

echo "Feature components with warnings: $(jq '. | length' reports/feature-component-warnings.json)"

# Analyze warnings in layout components (if they exist)
if [ -d "src/components/Layout" ]; then
  echo "Analyzing layout components..."
  npx eslint "src/components/Layout/**/*.{ts,tsx}" --max-warnings=9999 --format json | \
  jq '.[] | select(.messages[0].severity == 1) | {filePath, ruleId: .messages[0].ruleId}' | \
  jq -s 'group_by(.filePath) | map({component: .[0].filePath, warnings: length, rules: map(.ruleId) | unique})' > \
  reports/layout-component-warnings.json
  
  echo "Layout components with warnings: $(jq '. | length' reports/layout-component-warnings.json)"
fi

# Print summary of components with most warnings
echo -e "\nTop 5 UI components with most warnings:"
jq -r 'sort_by(-.warnings) | .[0:5] | .[] | "\(.component): \(.warnings) warnings"' reports/ui-component-warnings.json

echo -e "\nTop 5 feature components with most warnings:"
jq -r 'sort_by(-.warnings) | .[0:5] | .[] | "\(.component): \(.warnings) warnings"' reports/feature-component-warnings.json

echo "Component analysis complete" 