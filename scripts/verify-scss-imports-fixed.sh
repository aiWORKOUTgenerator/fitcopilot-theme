#!/bin/bash
# Enhanced script to verify SCSS files follow modern Sass practices
# This checks for both canonical design system imports and modern @use syntax

echo "🔍 Checking SCSS files for modern Sass practices..."

# Directory to search within
SOURCE_DIR="src"

# Check for SCSS files missing the canonical import
echo "1️⃣ Checking for missing design system imports..."
MISSING_IMPORTS=$(find $SOURCE_DIR/features -name "*.scss" -type f | xargs grep -L -e "@import.*design-system/index" -e "@use.*styles/design-system")

if [ -n "$MISSING_IMPORTS" ]; then
  echo "❌ ERROR: The following SCSS files are missing the canonical design system import:"
  echo "$MISSING_IMPORTS"
  echo ""
  echo "Please add the following to the top of each file:"
  echo "// Canonical design system import - MUST BE FIRST"
  echo "@use '../../../styles/design-system' as ds;"
  echo ""
  echo "Note: For files in subdirectories, adjust the path accordingly."
  HAS_ERRORS=true
else
  echo "✅ All SCSS files have the required design system import!"
fi

# Check for deprecated @import usage (except for valid cases)
echo ""
echo "2️⃣ Checking for deprecated @import usage..."

# Find all SCSS files
SCSS_FILES=$(find $SOURCE_DIR -name "*.scss" -type f)

# Initialize counters
DEPRECATED_COUNT=0
VALID_COUNT=0

# Check each file for actual @import usage (not comments)
for file in $SCSS_FILES; do
  # Extract real @import statements (ignoring comments and CSS imports)
  REAL_IMPORTS=$(grep -v "\/\/" "$file" | grep "@import" | grep -v "\.css" || true)
  
  if [ -n "$REAL_IMPORTS" ]; then
    # Count lines with real imports
    IMPORT_COUNT=$(echo "$REAL_IMPORTS" | wc -l | tr -d ' ')
    echo "❌ $file contains $IMPORT_COUNT deprecated @import directives"
    echo "$REAL_IMPORTS"
    DEPRECATED_COUNT=$((DEPRECATED_COUNT + IMPORT_COUNT))
  else
    VALID_COUNT=$((VALID_COUNT + 1))
  fi
done

echo ""
if [ $DEPRECATED_COUNT -gt 0 ]; then
  echo "❌ Found $DEPRECATED_COUNT deprecated @import directives across the codebase"
  echo "Please convert these to @use directives with appropriate namespacing."
  echo ""
  echo "Example conversion:"
  echo "BEFORE: @import '../../../styles/design-system/index';"
  echo "AFTER:  @use '../../../styles/design-system' as ds;"
  HAS_ERRORS=true
else
  echo "✅ No deprecated @import directives found!"
fi

# Final summary
echo ""
echo "📊 SCSS Modernization Summary:"
echo "----------------------------------------"
echo "Total SCSS files checked: $(echo "$SCSS_FILES" | wc -l | tr -d ' ')"
echo "Files with proper imports: $VALID_COUNT"
echo "Deprecated @import directives: $DEPRECATED_COUNT"
echo ""

if [ "$HAS_ERRORS" = true ]; then
  echo "❌ SCSS modernization verification failed with errors."
  exit 1
else
  echo "✅ SCSS modernization verification passed successfully!"
  exit 0
fi 