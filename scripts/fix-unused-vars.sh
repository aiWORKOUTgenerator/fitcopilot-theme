#!/bin/bash

# Script to automatically prefix unused variables with underscore
# This helps comply with the @typescript-eslint/no-unused-vars rule

# Parse options
PRODUCTION_ONLY=false
DRY_RUN=false

for arg in "$@"; do
  case $arg in
    --production-only)
      PRODUCTION_ONLY=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
  esac
done

echo "Finding files with unused variable ESLint errors..."

# Prepare ignore pattern for production-only mode
IGNORE_PATTERN=""
if [ "$PRODUCTION_ONLY" = true ]; then
  IGNORE_PATTERN="--ignore-pattern \"**/*.{test,spec,stories}.{ts,tsx}\""
fi

# Get list of files with unused variable errors
FILES_WITH_UNUSED_VARS=$(npx eslint "src/**/*.{ts,tsx}" $IGNORE_PATTERN --rule "@typescript-eslint/no-unused-vars:error" --format json | 
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

if [ "$DRY_RUN" = true ]; then
  echo "Dry run mode: Not making changes. Files that would be modified:"
  echo "$FILES_WITH_UNUSED_VARS"
  exit 0
fi

echo "This script will prefix unused variables with underscore (_)."
echo "WARNING: This is an automated process and may require manual review."
echo ""
echo "Processing files..."

# Create a temporary directory for results
TEMP_DIR=$(mktemp -d)
RESULTS_FILE="$TEMP_DIR/results.txt"

# Process each file
for file in $FILES_WITH_UNUSED_VARS; do
  # Make sure the file exists
  if [ ! -f "$file" ]; then
    echo "Skipping $file - file not found"
    continue
  fi
  
  echo "Processing $file"
  
  # Create backup
  cp "$file" "$file.bak"
  
  # Get unused variables from ESLint output
  VARS=$(npx eslint "$file" --rule "@typescript-eslint/no-unused-vars:error" --format json | 
    node -e "
      const fs = require('fs');
      const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
      const vars = new Set();
      
      if (data && data[0] && data[0].messages) {
        data[0].messages.forEach(msg => {
          if (msg.ruleId === '@typescript-eslint/no-unused-vars' && 
              msg.messageId === 'unusedVar' && 
              msg.data && msg.data.varName) {
            vars.add(msg.data.varName);
          }
        });
      }
      
      console.log(Array.from(vars).join('\n'));
    ")
  
  # Skip if no variables to fix
  if [ -z "$VARS" ]; then
    echo "  No unused variables found"
    rm "$file.bak"  # Remove unnecessary backup
    continue
  fi
  
  # Process each variable
  for var in $VARS; do
    # Skip if already prefixed
    if [[ $var == _* ]]; then
      continue
    fi
    
    # Process only safe variables (skip ones in imports, etc.)
    # Replace only declarations, not all occurrences
    # Handle multiple declaration patterns
    sed -i '' -E "s/\b(const|let|var|function|interface|type|class) $var\b/\1 _$var/g" "$file"
    sed -i '' -E "s/\b(\\{[^\\}]*) $var(\s*[:,][^\\}]*\\})/\1 _$var\2/g" "$file"
    sed -i '' -E "s/\b([\\(][^\\)]*) $var(\s*[:,][^\\)]*[\\)])/\1 _$var\2/g" "$file"
    sed -i '' -E "s/\b(\\([^\\)]*) $var(\s*:)/\1 _$var\2/g" "$file"
    sed -i '' -E "s/\b(\\([^\\)]*) $var(\s*[,\\)])/\1 _$var\2/g" "$file"
    
    echo "  Prefixed '$var' with underscore" >> "$RESULTS_FILE"
  done
  
  # Run ESLint to check if we've fixed all unused vars
  REMAINING=$(npx eslint "$file" --rule "@typescript-eslint/no-unused-vars:error" --format json | 
    node -e "
      const fs = require('fs');
      const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
      let count = 0;
      
      if (data && data[0] && data[0].messages) {
        count = data[0].messages.filter(msg => 
          msg.ruleId === '@typescript-eslint/no-unused-vars'
        ).length;
      }
      
      console.log(count);
    ")
  
  if [ "$REMAINING" -eq 0 ]; then
    echo "  ✅ All unused variables fixed"
  else
    echo "  ⚠️ $REMAINING unused variable issues remain - may need manual review"
  fi
done

# Summarize results
if [ -f "$RESULTS_FILE" ]; then
  FIXED_COUNT=$(wc -l < "$RESULTS_FILE" | tr -d ' ')
  echo ""
  echo "Fixed $FIXED_COUNT unused variables across $FILE_COUNT files."
  echo ""
  echo "After verifying changes, you can remove backups with:"
  echo "find src -name \"*.bak\" -delete"
else
  echo ""
  echo "No variables needed fixing."
fi

# Clean up temp directory
rm -rf "$TEMP_DIR" 