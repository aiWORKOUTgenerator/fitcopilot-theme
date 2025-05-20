# Storybook Theme Testing Quick Start Guide

This guide provides a quick overview of how to test components in Storybook with a focus on theme support. For a comprehensive guide, see the [Component Testing Guide](./component-testing-guide.md).

## Getting Started

1. **Start Storybook with clean cache**
   ```bash
   ./scripts/start-storybook-clean.sh
   ```

2. **Look for the Theme Test Controls panel**  
   A floating panel will appear in the bottom right of the Storybook interface.

3. **Use the theme switcher buttons**  
   Quick buttons for switching between themes are at the top of the panel.

## Theme Testing Workflow

For each component:

1. **Verify initial rendering**  
   - Does the component render correctly in the default theme?
   - Are all elements visible and properly styled?

2. **Test all theme variants**  
   - Click the theme buttons to switch between themes
   - Verify colors, spacing, and typography change appropriately
   - Look for any missing theme variables or hardcoded values

3. **Check responsive behavior**  
   - Use the viewport toolbar to test different screen sizes
   - Ensure the component adapts properly to each size

4. **Test ThemeShowcase story**  
   - If the component has a ThemeShowcase story, verify all themes display properly
   - Look for consistency across themes

5. **Run automated theme tests**  
   - Click "Run Theme Tests" in the test controls panel
   - Review the console output for CSS variable usage and theme attributes

6. **Record the results**  
   - Use the "Mark ✅ Pass", "Mark ⚠️ Warning", or "Mark ❌ Fail" buttons
   - Enter any issues when prompted

7. **Move to the next component**  
   - Click "Next Component →" to navigate to the next component

## Key Testing Criteria

### Theme Support (Critical)
- ✅ Component uses CSS variables for theming
- ✅ All theme variants display correctly
- ✅ No hardcoded colors or styles
- ✅ Theme switching works properly

### Responsive Design
- ✅ Displays correctly at all viewport sizes
- ✅ No overflow or layout issues
- ✅ Touch targets adequate on mobile

### Controls & Documentation
- ✅ All props have appropriate controls
- ✅ Documentation explains component usage
- ✅ Props are documented with types and descriptions

## Using the Theme Test Controls

The Theme Test Controls panel provides:

- **Theme switcher buttons**: Quick access to switch themes
- **"Run Theme Tests"**: Analyze CSS variables and theme attributes
- **"Mark ✅ Pass"**: Record a passing test
- **"Mark ⚠️ Warning"**: Record a test with minor issues
- **"Mark ❌ Fail"**: Record a failing test
- **"Next Component →"**: Navigate to the next component
- **"View Test Results"**: See a summary of all test results

## Generating Test Reports

1. Click "View Test Results" in the test controls panel
2. Review the summary of all tested components
3. Click "Export MD" to download a Markdown report

## Common Theme Issues To Watch For

- Colors not changing between themes
- Incorrect contrast ratios
- Hardcoded color values
- Missing CSS variables
- Inconsistent spacing or typography
- Theme-specific features not working

## After Testing

1. Address any issues found during testing
2. Update component stories to include ThemeShowcase if missing
3. Verify fixes by retesting the component

For more detailed testing instructions, see the [Component Testing Guide](./component-testing-guide.md). 