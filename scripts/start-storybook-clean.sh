#!/bin/bash

# Clean Storybook starter script
# This script ensures a clean Storybook start by clearing caches

# Color variables for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Storybook clean-up process...${NC}"

# Kill any running Storybook processes
echo -e "${YELLOW}Checking for running Storybook processes...${NC}"
STORYBOOK_PIDS=$(ps aux | grep storybook | grep -v grep | awk '{print $2}')

if [ -n "$STORYBOOK_PIDS" ]; then
  echo -e "${YELLOW}Terminating existing Storybook processes...${NC}"
  echo "$STORYBOOK_PIDS" | xargs kill -9
  echo -e "${GREEN}Storybook processes terminated.${NC}"
else
  echo -e "${GREEN}No running Storybook processes found.${NC}"
fi

# Clear Storybook cache
echo -e "${YELLOW}Clearing Storybook cache...${NC}"
rm -rf node_modules/.cache/storybook
echo -e "${GREEN}Storybook cache cleared.${NC}"

# Clear previous build if exists
echo -e "${YELLOW}Checking for previous Storybook build...${NC}"
if [ -d "storybook-static" ]; then
  echo -e "${YELLOW}Removing previous Storybook build...${NC}"
  rm -rf storybook-static
  echo -e "${GREEN}Previous Storybook build removed.${NC}"
else
  echo -e "${GREEN}No previous build found.${NC}"
fi

# Start Storybook
echo -e "${YELLOW}Starting Storybook with clean environment...${NC}"
npm run storybook

exit 0 