#!/bin/bash
# Script to verify that the React mount point is consistent across the codebase
# This can be used in pre-commit hooks or CI pipelines

echo "🔍 Checking for React mount point consistency..."

# Extract the root element ID from index.tsx
ROOT_ID=$(grep -o "rootElementId = '[^']*'" src/index.tsx | cut -d "'" -f 2)

if [ -z "$ROOT_ID" ]; then
  echo "❌ ERROR: Could not find rootElementId in src/index.tsx"
  exit 1
fi

echo "🔍 Looking for root element ID: '$ROOT_ID'"

# Check if the root element ID is referenced in the PHP template
PHP_ROOT=$(grep -l "<div id=\"$ROOT_ID\"" *.php)

if [ -z "$PHP_ROOT" ]; then
  echo "❌ ERROR: Could not find <div id=\"$ROOT_ID\"> in any PHP template"
  echo "Please ensure your PHP template contains: <div id=\"$ROOT_ID\"></div>"
  exit 1
else
  echo "✅ Found root element in: $PHP_ROOT"
fi

# Check for any alternative mount points in React code
ALT_MOUNT=$(grep -r "getElementById(" --include="*.tsx" --include="*.ts" src/ | grep -v "$ROOT_ID" | grep -v "section.id" | grep -v "demo-nav" | grep -v "homepage-demo-nav")

if [ -n "$ALT_MOUNT" ]; then
  echo "⚠️ WARNING: Alternative getElementById calls found:"
  echo "$ALT_MOUNT"
  echo "Please make sure all React initialization uses the consistent ID: '$ROOT_ID'"
else
  echo "✅ No alternative mount points found in React code!"
fi

echo "✅ Mount point verification completed"
exit 0 