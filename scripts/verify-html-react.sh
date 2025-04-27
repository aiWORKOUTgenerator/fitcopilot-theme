#!/bin/bash
# Script to verify that React/ReactDOM are not loaded twice in the HTML output
# This can be used in CI pipelines to test the live site

if [ -z "$1" ]; then
  echo "Usage: $0 <url>"
  echo "Example: $0 https://example.com"
  exit 1
fi

URL=$1
echo "🔍 Checking for duplicate React/ReactDOM in HTML at $URL..."

# Fetch the HTML and save to a temporary file
TMP_FILE=$(mktemp)
curl -s "$URL" > "$TMP_FILE"

# Count React script tags
REACT_COUNT=$(grep -c "react.*\.js" "$TMP_FILE")
REACTDOM_COUNT=$(grep -c "react-dom.*\.js" "$TMP_FILE")

echo "Found $REACT_COUNT React script tags"
echo "Found $REACTDOM_COUNT ReactDOM script tags"

# Show the actual scripts being loaded
echo "React scripts found:"
grep -o "<script [^>]*react[^>]*\.js[^>]*>" "$TMP_FILE"

# Check for duplicate loading
if [ "$REACT_COUNT" -gt 1 ]; then
  echo "❌ ERROR: Found multiple React scripts!"
  exit 1
fi

if [ "$REACTDOM_COUNT" -gt 1 ]; then
  echo "❌ ERROR: Found multiple ReactDOM scripts!"
  exit 1
fi

echo "✅ Verification passed: React/ReactDOM are only loaded once"

# Clean up
rm "$TMP_FILE"
exit 0 