#!/bin/bash

# Storybook Component Testing Script
# This script provides a systematic approach to testing all component stories

# Color variables for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT=$(pwd)

# Ensure we're in the project root
if [ ! -d "src" ] || [ ! -d ".storybook" ]; then
  echo -e "${RED}Error: This script must be run from the project root directory.${NC}"
  exit 1
fi

# Create a testing results directory
RESULTS_DIR="storybook-test-results"
mkdir -p "$RESULTS_DIR"

# Create a testing log file
LOG_FILE="$RESULTS_DIR/testing-log-$(date +%Y%m%d-%H%M%S).md"

# Write header to log file
echo "# Storybook Component Testing Results" > "$LOG_FILE"
echo "Date: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "## Component Stories Tested" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Find all story files
echo -e "${YELLOW}Finding all component stories...${NC}"
STORY_FILES=$(find src -name "*.stories.tsx" -o -name "*.stories.ts" -o -name "*.stories.jsx" -o -name "*.stories.js")

# Count the total number of story files
TOTAL_STORIES=$(echo "$STORY_FILES" | wc -l | xargs)
echo -e "${GREEN}Found $TOTAL_STORIES story files.${NC}"
echo "" >> "$LOG_FILE"
echo "Total story files: $TOTAL_STORIES" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Create a checklist table in the log file
echo "| Component | Theme Support | Responsive | Controls | Documentation | Issues |" >> "$LOG_FILE"
echo "| --- | --- | --- | --- | --- | --- |" >> "$LOG_FILE"

# Print testing instructions
echo -e "${BLUE}====================================================================${NC}"
echo -e "${BLUE}                  STORYBOOK COMPONENT TESTING                      ${NC}"
echo -e "${BLUE}====================================================================${NC}"
echo -e "${YELLOW}Testing Instructions:${NC}"
echo -e "1. Start Storybook with: ${GREEN}npm run storybook${NC}"
echo -e "2. For each component story:"
echo -e "   - Verify the component renders correctly"
echo -e "   - Test theme switching using the toolbar theme selector"
echo -e "   - Check responsive views using the viewport toolbar"
echo -e "   - Test all controls in the Controls panel"
echo -e "   - Verify documentation is correct in the Docs tab"
echo -e "3. Record any issues in the testing log"
echo -e "${BLUE}====================================================================${NC}"

# Print the list of stories to test
echo -e "${YELLOW}Component Stories to Test:${NC}"
for story_file in $STORY_FILES; do
  # Extract component name from file path
  component_name=$(basename "$story_file" | sed 's/\.stories\..*//')
  component_path=$(dirname "$story_file" | sed 's/^src\///')
  
  # Add to log file (initially empty)
  echo "| $component_name | ❓ | ❓ | ❓ | ❓ | |" >> "$LOG_FILE"
  
  # Print to console
  echo -e "${GREEN}$component_name${NC} ($component_path)"
done

echo -e "${BLUE}====================================================================${NC}"
echo -e "${YELLOW}Testing Checklist for Each Component:${NC}"
echo -e "✅ Theme Support: Does the component correctly apply all theme variants?"
echo -e "✅ Responsive Testing: Does the component display correctly at different viewport sizes?"
echo -e "✅ Controls: Do all component props have appropriate controls that work correctly?"
echo -e "✅ Documentation: Is the component properly documented with description and props?"
echo -e "✅ Issues: Note any bugs, console errors, or visual issues"
echo -e "${BLUE}====================================================================${NC}"

echo -e "${YELLOW}Testing log file created at:${NC} ${GREEN}$LOG_FILE${NC}"
echo -e "${YELLOW}After testing, update the log file with your results.${NC}"

# Create a template for the final test report
REPORT_TEMPLATE="$RESULTS_DIR/test-report-template.md"

cat > "$REPORT_TEMPLATE" << EOL
# Storybook Component Testing Report

## Summary
- Total components tested: [NUMBER]
- Components with issues: [NUMBER]
- Components with theme support: [NUMBER]
- Components with responsive support: [NUMBER]

## Critical Issues
- [List critical issues here]

## Theme Support Issues
- [List theme support issues here]

## Responsive Issues
- [List responsive issues here]

## Control Issues
- [List control issues here]

## Documentation Issues
- [List documentation issues here]

## Action Items
- [List action items here]
EOL

echo -e "${YELLOW}Report template created at:${NC} ${GREEN}$REPORT_TEMPLATE${NC}"
echo -e "${YELLOW}Complete this report after testing all components.${NC}"

# Make executable
chmod +x "$0"

echo -e "${GREEN}Ready to begin testing!${NC}" 