#!/bin/bash

# Script to set up visual regression testing with Loki

echo "Setting up visual regression testing with Loki..."
echo "--------------------------------------------------"

# Install Loki and dependencies
echo "Installing dependencies..."
npm install --save-dev loki @storybook/addon-storyshots puppeteer-core jsdom

# Create Loki configuration
echo "Creating Loki configuration..."
cat > loki.config.js << EOF
module.exports = {
  chromeSelector: '.component-wrapper',
  diffingEngine: 'looks-same',
  configurations: {
    'chrome.laptop': {
      target: 'chrome.docker',
      width: 1366,
      height: 768,
    },
    'chrome.iphone7': {
      target: 'chrome.docker',
      preset: 'iPhone 7',
    },
  },
};
EOF

# Add scripts to package.json
echo "Updating package.json with Loki scripts..."
# This is a bit hacky, but works for demonstration purposes
# In a real setup, use jq or a proper JSON parser
grep -q '"loki:update"' package.json || sed -i.bak '/"scripts": {/a\
    "loki:test": "loki test",\
    "loki:update": "loki update",\
    "loki:approve": "loki approve",\
' package.json && rm -f package.json.bak

# Create a GitHub Action workflow for visual testing
echo "Creating GitHub Actions workflow for visual testing..."
mkdir -p .github/workflows

cat > .github/workflows/visual-testing.yml << EOF
name: Visual Regression Testing

on:
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'src/components/**/*.tsx'
      - 'src/components/**/*.scss'
      - 'src/features/**/*.tsx'
      - 'src/features/**/*.scss'
      - 'src/styles/**/*.scss'

jobs:
  visual-testing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build Storybook
        run: npm run build-storybook
        
      - name: Run Loki visual tests
        run: npm run loki:test
        
      - name: Upload visual differences if test fails
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-regression-diff
          path: .loki/difference
EOF

# Create a basic Storybook test setup
echo "Setting up Storybook test integration..."
mkdir -p .storybook/test

cat > .storybook/test/setup.js << EOF
import { configure } from '@storybook/react';
import 'loki/configure';

// Import your global styles
import '../../src/styles/app.scss';

// Configure Storybook
configure(require.context('../../src', true, /\.stories\.tsx$/), module);
EOF

echo ""
echo "Visual regression testing setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run storybook' to start Storybook"
echo "2. Run 'npm run loki:update' to create initial reference images"
echo "3. Make changes to components and run 'npm run loki:test' to check for visual regressions"
echo ""
echo "For CI/CD, the GitHub Actions workflow has been set up to run on pull requests." 