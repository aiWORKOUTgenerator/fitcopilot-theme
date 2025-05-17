#!/bin/bash

# Visual regression testing script for button components
# Requires: storybook and chromatic

# Set Chromatic project token (replace with your actual token)
export CHROMATIC_PROJECT_TOKEN="your-token-here"

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit

echo "Starting visual regression tests for button components..."

# Build Storybook with theme variant examples
echo "Building Storybook..."
npm run build-storybook

# Run Chromatic to capture and compare snapshots
echo "Running visual regression tests..."
npx chromatic --build-script-name=build-storybook --exit-zero-on-changes

# Generate a visual diff report
echo "Generating visual regression report..."
npx chromatic-cli --build-script-name=build-storybook --exit-zero-on-changes --json > visual-test-results.json

# Create a screenshot directory if it doesn't exist
mkdir -p screenshots

# Take screenshots of the theme test component in different themes
echo "Taking theme variant screenshots..."
npx playwright screenshot --url "http://localhost:6006/iframe.html?id=features-homepage-hero-themetest--default" --output "screenshots/buttons-default-theme.png"
npx playwright screenshot --url "http://localhost:6006/iframe.html?id=features-homepage-hero-themetest--gym" --output "screenshots/buttons-gym-theme.png"
npx playwright screenshot --url "http://localhost:6006/iframe.html?id=features-homepage-hero-themetest--sports" --output "screenshots/buttons-sports-theme.png"
npx playwright screenshot --url "http://localhost:6006/iframe.html?id=features-homepage-hero-themetest--wellness" --output "screenshots/buttons-wellness-theme.png"

echo "Visual regression testing complete!"
echo "Results available in visual-test-results.json and screenshots directory"

# Make the script executable
chmod +x scripts/visual-regression-test.sh 