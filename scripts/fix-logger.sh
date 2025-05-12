#!/bin/bash
# Fix unused variables in logger.ts

LOGGER_FILE="src/utils/logger.ts"

echo "Fixing unused variables in $LOGGER_FILE..."

# Create backup
cp "$LOGGER_FILE" "$LOGGER_FILE.bak"

# Fix unused 'e' variables by prefixing them with underscore
sed -i '' 's/catch (e)/catch (_e)/g' "$LOGGER_FILE"

# Verify the fix
UNUSED_VARS=$(npx eslint "$LOGGER_FILE" --rule "@typescript-eslint/no-unused-vars:error" --format stylish)

if [ $? -eq 0 ]; then
  echo "Successfully fixed all unused variables in logger.ts!"
else
  echo "Some unused variables remain in logger.ts:"
  echo "$UNUSED_VARS"
fi

echo "You can review changes by comparing with the backup file:"
echo "diff $LOGGER_FILE.bak $LOGGER_FILE" 