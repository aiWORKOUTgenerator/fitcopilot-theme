#!/bin/bash

# Storybook Integration Testing Script
# This script helps verify the integration aspects of Storybook

# Color variables for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================================${NC}"
echo -e "${BLUE}           STORYBOOK INTEGRATION TESTING CHECKLIST                 ${NC}"
echo -e "${BLUE}====================================================================${NC}"

# Create results directory if it doesn't exist
RESULTS_DIR="storybook-test-results"
mkdir -p "$RESULTS_DIR"

# Create integration test log file
INTEGRATION_LOG="$RESULTS_DIR/integration-test-$(date +%Y%m%d-%H%M%S).md"

# Write header to integration log file
echo "# Storybook Integration Testing Results" > "$INTEGRATION_LOG"
echo "Date: $(date)" >> "$INTEGRATION_LOG"
echo "" >> "$INTEGRATION_LOG"

# Start clean Storybook instance
echo -e "${YELLOW}Starting clean Storybook instance in the background...${NC}"
npm run storybook -- --ci &
STORYBOOK_PID=$!

# Function to check if Storybook is running
check_storybook_running() {
  if ps -p $STORYBOOK_PID > /dev/null; then
    return 0  # Running
  else
    return 1  # Not running
  fi
}

# Wait for Storybook to start (max 2 minutes)
echo -e "${YELLOW}Waiting for Storybook to start (this may take a minute)...${NC}"
WAIT_SECONDS=0
MAX_WAIT=120

while ! nc -z localhost 6006 && [ $WAIT_SECONDS -lt $MAX_WAIT ]; do
  sleep 2
  WAIT_SECONDS=$((WAIT_SECONDS + 2))
  
  # Check if Storybook process is still running
  if ! check_storybook_running; then
    echo -e "${RED}Storybook process died unexpectedly. Check logs for errors.${NC}"
    exit 1
  fi
  
  echo -n "."
done

if [ $WAIT_SECONDS -ge $MAX_WAIT ]; then
  echo -e "${RED}Timed out waiting for Storybook to start.${NC}"
  kill $STORYBOOK_PID 2>/dev/null
  exit 1
fi

echo -e "\n${GREEN}Storybook is now running at http://localhost:6006${NC}"

# Integration Test Checklist
echo -e "${YELLOW}Complete the following integration tests:${NC}"

# Create checklist in log file
echo "## Integration Test Checklist" >> "$INTEGRATION_LOG"
echo "" >> "$INTEGRATION_LOG"
echo "| Test Area | Status | Notes |" >> "$INTEGRATION_LOG"
echo "| --- | --- | --- |" >> "$INTEGRATION_LOG"

# Define test areas
test_areas=(
  "Storybook Initial Load|Verify Storybook loads completely without console errors"
  "Navigation|Verify sidebar navigation works between all components"
  "Theme Selector|Verify theme selector is available in toolbar and changes apply globally"
  "Viewport Addon|Test responsive views with different device sizes"
  "Controls Addon|Verify props can be modified across multiple components"
  "Actions Addon|Test event handlers are properly displayed"
  "A11y Addon|Verify accessibility checks run without blocking errors"
  "Docs Generation|Check auto-generated docs for several components"
  "Search Function|Test searching for components by name and type"
  "Canvas/Docs Tabs|Verify switching between Canvas and Docs views"
  "Global State|Test state persistence between component navigation"
  "Theme Test Controls|Verify the custom theme testing controls work"
  "Background Changes|Test changing background colors"
  "Story Navigation|Test navigating between stories of the same component"
  "Performance|Check loading time and responsiveness"
)

# Write test areas to console and log file
for test in "${test_areas[@]}"; do
  area=$(echo "$test" | cut -d'|' -f1)
  description=$(echo "$test" | cut -d'|' -f2)
  
  echo -e "${BLUE}$area:${NC} $description"
  echo "| $area | ❓ | |" >> "$INTEGRATION_LOG"
done

# Provide completion instructions
echo -e "\n${YELLOW}INSTRUCTIONS:${NC}"
echo -e "1. Open ${GREEN}http://localhost:6006${NC} in your browser"
echo -e "2. Complete each test area in the checklist"
echo -e "3. Record results in the integration log file: ${GREEN}$INTEGRATION_LOG${NC}"
echo -e "4. Mark each test with ✅ (pass), ⚠️ (warning), or ❌ (fail)"
echo -e "5. Add detailed notes for any warnings or failures"
echo -e "6. When finished, press Ctrl+C to stop this script"
echo -e "\n${YELLOW}Now conducting integration testing...${NC}"

# Wait for user to interrupt
trap "echo -e '\n${YELLOW}Stopping Storybook...${NC}'; kill $STORYBOOK_PID 2>/dev/null; echo -e '${GREEN}Integration testing completed. Results saved to ${INTEGRATION_LOG}${NC}'" INT

# Wait for Storybook process to finish
wait $STORYBOOK_PID 