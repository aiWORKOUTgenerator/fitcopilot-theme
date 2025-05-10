#!/bin/bash
# Script to help automate Sass migration
# Usage: ./migrate-scss.sh [directory]

TARGET_DIR=${1:-"src/features/Homepage"}

echo "🔍 Migrating SCSS files in $TARGET_DIR..."

# Find all SCSS files with @import for design system
FILES_TO_MIGRATE=$(find "$TARGET_DIR" -name "*.scss" -type f | xargs grep -l "@import.*design-system")

COUNT=0
MIGRATED=0

for file in $FILES_TO_MIGRATE; do
  COUNT=$((COUNT + 1))
  echo "Migrating $file..."
  
  # Backup file
  cp "$file" "$file.bak"
  
  # Calculate relative path (macOS-compatible)
  DEPTH=$(echo "$(dirname "$file")" | tr '/' '\n' | wc -l | tr -d ' ')
  REL_PATH=""
  
  # For each directory level, add ../ to the path
  for (( i=3; i<=$DEPTH; i++ )); do
    REL_PATH="../$REL_PATH"
  done
  
  # Replace @import with @use
  sed -i '' "s|@import[[:space:]]*['\"]\(.*\)design-system\/index.*['\"];|@use '${REL_PATH}src/styles/design-system' as ds;|g" "$file"
  
  # Add canonical comment if not present
  if ! grep -q "Canonical design system import" "$file"; then
    # Create a temporary file with the comment
    TMP_FILE=$(mktemp)
    echo "// Canonical design system import - MUST BE FIRST" > "$TMP_FILE"
    cat "$file" >> "$TMP_FILE"
    mv "$TMP_FILE" "$file"
  fi
  
  # Check if migration was successful
  if grep -q "@use.*design-system.*as ds" "$file"; then
    MIGRATED=$((MIGRATED + 1))
    echo "✅ Successfully migrated $file"
  else
    echo "❌ Failed to migrate $file - restoring backup"
    mv "$file.bak" "$file"
  fi
done

echo ""
echo "📊 Migration Summary:"
echo "----------------------------------------"
echo "Total SCSS files checked: $COUNT"
echo "Successfully migrated: $MIGRATED"
echo "Failed migrations: $((COUNT - MIGRATED))"
echo ""

if [ $MIGRATED -eq $COUNT ]; then
  echo "✅ All files successfully migrated!"
  exit 0
else
  echo "⚠️ Some files could not be automatically migrated. Manual intervention required."
  exit 1
fi 