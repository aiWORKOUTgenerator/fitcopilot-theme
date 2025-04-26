#!/bin/bash

# Script to find SCSS files that still use the deprecated @import syntax
# Run this script to identify files that need to be updated to @use/@forward

echo "Scanning SCSS files for deprecated @import syntax..."
echo "---------------------------------------------------"

# Find all SCSS files that contain @import statements
grep -r --include="*.scss" --exclude-dir="node_modules" "@import" ./src | grep -v "\/\/"

echo ""
echo "Migration instructions:"
echo "1. Replace @import with @use in component files"
echo "2. Add 'as *' to make all tokens available without a namespace"
echo "3. Replace @import with @forward in design system index files"
echo ""
echo "Example:"
echo "  Before: @import '../../../styles/design-system/index';"
echo "  After:  @use '../../../styles/design-system/index' as *;"
echo ""
echo "For more information, see src/styles/design-system/README.md" 