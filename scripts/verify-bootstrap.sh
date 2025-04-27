#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🔍 Checking if React bootstrap code is included in the build..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "❌ dist directory does not exist. Run 'npm run build' first."
  exit 1
fi

# Check for the bootstrap message in the dist files
if ! grep -q "🚀 React bootstrap running from src/index.tsx" dist/*.js; then
  echo "❌ Bootstrap code missing from dist! Make sure webpack.entry points to src/index.tsx"
  
  # Check the webpack config to identify the issue
  ENTRY_FILE=$(grep -o "'./src/[^']*" webpack.config.js | head -1)
  if [ "$ENTRY_FILE" != "'./src/index.tsx" ]; then
    echo "⚠️ Found incorrect webpack entry: $ENTRY_FILE"
    echo "⚠️ Please update webpack.config.js to use './src/index.tsx' as the entry point."
  else
    echo "⚠️ Webpack entry appears correct but bootstrap code is still missing."
    echo "⚠️ Check that src/index.tsx contains the bootstrap console.log message."
  fi
  
  exit 1
else
  echo "✅ Bootstrap code found in the build!"
fi

# Verify that webpack is configured to use src/index.tsx as entry
if ! grep -q "./src/index.tsx" webpack.config.js; then
  echo "⚠️ Warning: './src/index.tsx' not found in webpack.config.js"
  echo "⚠️ Make sure the entry point is correctly set to src/index.tsx"
  exit 1
else
  echo "✅ Webpack configured with correct entry point!"
fi

echo "✅ All bootstrap verification checks passed!"
exit 0 