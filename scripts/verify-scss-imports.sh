#!/bin/bash
# Script to verify that all SCSS files include the canonical design system import
# This can be used in pre-commit hooks or CI pipelines

echo "🔍 Checking for missing design system imports in SCSS files..."

# Check for SCSS files missing the canonical import
MISSING_IMPORTS=$(find src/features -name "*.scss" | xargs grep -L "@import.*design-system/index")

if [ -n "$MISSING_IMPORTS" ]; then
  echo "❌ ERROR: The following SCSS files are missing the canonical design system import:"
  echo "$MISSING_IMPORTS"
  echo ""
  echo "Please add the following to the top of each file:"
  echo "// Canonical design system import - MUST BE FIRST"
  echo "@import '../../../styles/design-system/index';"
  echo ""
  echo "Note: For files in subdirectories, adjust the path accordingly."
  exit 1
else
  echo "✅ All SCSS files have the required design system import!"
  exit 0
fi 