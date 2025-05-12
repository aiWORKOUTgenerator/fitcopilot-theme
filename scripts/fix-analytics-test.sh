#!/bin/bash
# Fix parsing error in analytics.test.tsx

TEST_FILE="src/features/Registration/tests/analytics.test.tsx"

# Backup the file
cp "$TEST_FILE" "$TEST_FILE.bak"

# Find the problematic line around 7166
echo "Checking problematic lines around line 7166..."
LINE_NUM=$(grep -n "expect.*expect" "$TEST_FILE" | head -1 | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
  echo "Could not find nested expect statements. Trying another approach..."
  # Look for syntax errors like missing closing parentheses
  LINE_NUM=$(grep -n "expect.*)" "$TEST_FILE" | grep -n "expect" | head -1 | cut -d: -f1)
fi

if [ -n "$LINE_NUM" ]; then
  echo "Found potential issue at line $LINE_NUM. Attempting to fix..."
  
  # Extract a few lines around the problematic area
  START_LINE=$((LINE_NUM - 5))
  END_LINE=$((LINE_NUM + 10))
  
  if [ $START_LINE -lt 1 ]; then
    START_LINE=1
  fi
  
  echo "Extracting lines $START_LINE to $END_LINE for analysis..."
  sed -n "${START_LINE},${END_LINE}p" "$TEST_FILE"
  
  # Try to fix the most common issue - nested expect statements
  echo "Applying fix to separate nested expects..."
  sed -i '' "${LINE_NUM}s/expect\(.*\)expect/expect\1;\n        expect/g" "$TEST_FILE"
else
  # Direct approach - find missing closing braces
  echo "Trying direct approach to fix brackets..."
  # Look for the line with error based on ESLint error message
  BRACKET_LINE=7166
  
  # Add a closing bracket if it seems to be missing
  sed -i '' "${BRACKET_LINE}s/$/});/" "$TEST_FILE"
  
  echo "Applied potential fix near line $BRACKET_LINE"
fi

# Verify the fix worked
echo "Verifying fix..."
npx eslint "${TEST_FILE}" --format stylish || echo "Still has parsing errors. May need manual intervention." 