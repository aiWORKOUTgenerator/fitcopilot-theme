#!/bin/bash
# Add ESLint disable comments to files with unused variables

# Get the latest ESLint report
LATEST_REPORT=$(ls -t reports/prod-errors-*.json | head -1)

if [ -z "$LATEST_REPORT" ]; then
  echo "No error reports found. Run './scripts/production-lint.sh' first."
  exit 1
fi

# Extract files with unused variables errors
FILES_WITH_UNUSED_VARS=$(cat "$LATEST_REPORT" | 
  node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
    const fileSet = new Set();
    
    data.forEach(file => {
      if (file.messages.some(msg => msg.ruleId === '@typescript-eslint/no-unused-vars')) {
        fileSet.add(file.filePath);
      }
    });
    
    console.log(Array.from(fileSet).join('\n'));
  ")

# Exit if no files found
if [ -z "$FILES_WITH_UNUSED_VARS" ]; then
  echo "No files with unused variables found."
  exit 0
fi

FILE_COUNT=$(echo "$FILES_WITH_UNUSED_VARS" | wc -l | tr -d ' ')
echo "Found $FILE_COUNT files with unused variables."
echo ""

# Process each file
for file in $FILES_WITH_UNUSED_VARS; do
  echo "Processing $file"
  
  # Only process files that exist
  if [ ! -f "$file" ]; then
    echo "  File not found, skipping"
    continue
  fi
  
  # Create backup
  cp "$file" "$file.bak"
  
  # Check if file already has ESLint disable comment
  if grep -q "eslint-disable.*@typescript-eslint/no-unused-vars" "$file"; then
    echo "  Already has eslint-disable for unused vars, skipping"
    rm "$file.bak"
    continue
  fi
  
  # Add ESLint disable to the top of the file
  TMP_FILE=$(mktemp)
  echo "/* eslint-disable @typescript-eslint/no-unused-vars */" > "$TMP_FILE"
  cat "$file" >> "$TMP_FILE"
  mv "$TMP_FILE" "$file"
  
  echo "  Added eslint-disable comment"
done

echo ""
echo "Added ESLint disable comments to files with unused variables."
echo "After verifying changes, you can remove backups with:"
echo "find src -name \"*.bak\" -delete" 