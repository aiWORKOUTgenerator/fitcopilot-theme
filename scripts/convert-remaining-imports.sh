#!/bin/bash
# Script to convert remaining @import directives to @use
# Usage: ./convert-remaining-imports.sh

echo "🔍 Converting remaining @import directives to @use..."

# Find all SCSS files with @import statements (excluding .css imports)
FILES_WITH_IMPORTS=$(find src -name "*.scss" -type f | xargs grep -l "@import" | xargs grep -L "@import.*\.css")

COUNT=0
CONVERTED=0

for file in $FILES_WITH_IMPORTS; do
  COUNT=$((COUNT + 1))
  echo "Processing $file..."
  
  # Backup file
  cp "$file" "$file.bak"
  
  # Get all import lines excluding CSS imports
  IMPORTS=$(grep "@import" "$file" | grep -v "\.css")
  
  # Create a temporary file
  TMP_FILE=$(mktemp)
  
  # Replace each @import with an @use with appropriate namespacing
  while IFS= read -r import_line; do
    # Extract the path from the import statement
    path=$(echo "$import_line" | sed -E "s/@import[[:space:]]*['\"](.+)['\"];/\1/")
    
    # Generate a namespace from the basename
    namespace=$(basename "$path" .scss | tr '-' '_' | tr '.' '_')
    
    # Replace the import with a use statement
    sed -i '' "s|$import_line|@use '$path' as $namespace;|g" "$file"
  done <<< "$IMPORTS"
  
  # Special cases for certain types of imports
  # Handle imports for Button.scss and similar
  sed -i '' "s|@use 'Button.scss' as Button|@use '../Button' as parentButton|g" "$file"
  sed -i '' "s|@use '.*tokens/buttons' as buttons|@use '../../../../styles/design-system/tokens/buttons' as buttons|g" "$file"
  
  # Check if conversion was successful (no more @import except for .css)
  if ! grep -q "@import" "$file" || grep -q "@import.*\.css" "$file"; then
    CONVERTED=$((CONVERTED + 1))
    echo "✅ Successfully converted $file"
  else
    echo "❌ Failed to convert all imports in $file - restoring backup"
    mv "$file.bak" "$file"
  fi
done

echo ""
echo "📊 Conversion Summary:"
echo "----------------------------------------"
echo "Total SCSS files with imports: $COUNT"
echo "Successfully converted: $CONVERTED"
echo "Failed conversions: $((COUNT - CONVERTED))"
echo ""

if [ $CONVERTED -eq $COUNT ]; then
  echo "✅ All imports successfully converted!"
  exit 0
else
  echo "⚠️ Some imports could not be automatically converted. Manual intervention required."
  exit 1
fi 