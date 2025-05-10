#!/bin/bash
# Script to add canonical design system import to SCSS files missing it
# Usage: ./add-canonical-import.sh

echo "🔍 Adding canonical design system imports to missing files..."

# Find all SCSS files without design system imports
MISSING_IMPORTS=$(find src/features -name "*.scss" -type f | xargs grep -L -e "@import.*design-system" -e "@use.*design-system")

COUNT=0
UPDATED=0

for file in $MISSING_IMPORTS; do
  COUNT=$((COUNT + 1))
  echo "Processing $file..."
  
  # Backup file
  cp "$file" "$file.bak"
  
  # Calculate relative path (macOS-compatible)
  DEPTH=$(echo "$(dirname "$file")" | tr '/' '\n' | wc -l | tr -d ' ')
  REL_PATH=""
  
  # For each directory level, add ../ to the path
  for (( i=3; i<=$DEPTH; i++ )); do
    REL_PATH="../$REL_PATH"
  done
  
  # Create a temporary file with the comment and import
  TMP_FILE=$(mktemp)
  echo "// Canonical design system import - MUST BE FIRST" > "$TMP_FILE"
  echo "@use '${REL_PATH}src/styles/design-system' as ds;" >> "$TMP_FILE"
  echo "" >> "$TMP_FILE"
  cat "$file" >> "$TMP_FILE"
  mv "$TMP_FILE" "$file"
  
  # Check if update was successful
  if grep -q "@use.*design-system.*as ds" "$file"; then
    UPDATED=$((UPDATED + 1))
    echo "✅ Successfully updated $file"
  else
    echo "❌ Failed to update $file - restoring backup"
    mv "$file.bak" "$file"
  fi
done

echo ""
echo "📊 Update Summary:"
echo "----------------------------------------"
echo "Total SCSS files missing imports: $COUNT"
echo "Successfully updated: $UPDATED"
echo "Failed updates: $((COUNT - UPDATED))"
echo ""

if [ $UPDATED -eq $COUNT ]; then
  echo "✅ All files successfully updated!"
  exit 0
else
  echo "⚠️ Some files could not be automatically updated. Manual intervention required."
  exit 1
fi 