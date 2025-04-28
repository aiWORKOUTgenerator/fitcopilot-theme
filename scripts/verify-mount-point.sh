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
  # Uncomment below to make this a fatal error rather than just a warning
  # exit 1
else
  echo "✅ No alternative mount points found in React code!"
fi

# Check for unauthorized createRoot/render calls (should only be in index.tsx)
# First, get all files that contain createRoot except index.tsx
FILES_WITH_CREATE_ROOT=$(grep -l "createRoot" --include="*.tsx" --include="*.ts" src/ | grep -v "src/index.tsx")

if [ -n "$FILES_WITH_CREATE_ROOT" ]; then
  echo "❌ ERROR: Unauthorized React bootstrap detected in files:"
  echo "$FILES_WITH_CREATE_ROOT"
  echo "Only src/index.tsx should initialize React with createRoot!"
  exit 1
else
  echo "✅ React bootstrap only found in src/index.tsx!"
fi

# Also check for legacy ReactDOM.render calls
LEGACY_RENDER=$(grep -r "ReactDOM.render" --include="*.tsx" --include="*.ts" src/)

if [ -n "$LEGACY_RENDER" ]; then
  echo "❌ ERROR: Legacy ReactDOM.render calls detected:"
  echo "$LEGACY_RENDER"
  echo "Please use createRoot instead and only in src/index.tsx!"
  exit 1
else
  echo "✅ No legacy ReactDOM.render calls found!"
fi

# Check for correct webpack externals configuration
WEBPACK_EXTERNALS=$(grep -A3 "externals:" webpack.config.js)
REACT_EXTERNAL=$(echo "$WEBPACK_EXTERNALS" | grep "'react'")
REACTDOM_EXTERNAL=$(echo "$WEBPACK_EXTERNALS" | grep "'react-dom'")
REACTDOMCLIENT_EXTERNAL=$(echo "$WEBPACK_EXTERNALS" | grep "'react-dom/client'")

if [ -z "$REACT_EXTERNAL" ] || [ -z "$REACTDOM_EXTERNAL" ] || [ -z "$REACTDOMCLIENT_EXTERNAL" ]; then
  echo "❌ ERROR: Webpack externals not properly configured:"
  echo "Current configuration:"
  echo "$WEBPACK_EXTERNALS"
  echo "Please ensure externals includes all three: 'react', 'react-dom', and 'react-dom/client'"
  exit 1
else
  echo "✅ Webpack externals properly configured!"
fi

# Check for dual React loading in PHP template
UNPKG_REACT=$(grep -l "unpkg.com/react" *.php)
UNPKG_REACTDOM=$(grep -l "unpkg.com/react-dom" *.php)

if [ -n "$UNPKG_REACT" ] || [ -n "$UNPKG_REACTDOM" ]; then
  echo "⚠️ WARNING: Found React/ReactDOM loading from unpkg.com:"
  grep -l "unpkg.com/react" *.php
  grep -l "unpkg.com/react-dom" *.php
  echo "Make sure you're not loading React twice (from unpkg AND WordPress core)!"
fi

echo "✅ Mount point verification completed"
exit 0 