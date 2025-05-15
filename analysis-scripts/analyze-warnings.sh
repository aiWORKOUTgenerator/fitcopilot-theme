#!/bin/bash

# Create reports directory if it doesn't exist
mkdir -p analysis-scripts/reports

# Run ESLint with JSON formatter and save output
echo "Generating ESLint JSON output..."
npx eslint --format json src > analysis-scripts/eslint-output.json

# Run warning processor
echo "Processing warnings..."
node analysis-scripts/process-warnings.js

echo "Analysis complete. Reports available in analysis-scripts/reports/" 