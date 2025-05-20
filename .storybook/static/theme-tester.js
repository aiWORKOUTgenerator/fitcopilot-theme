/**
 * FitCopilot Storybook Theme Tester
 * 
 * This utility is designed to be run in the browser console when viewing
 * a component in Storybook. It helps verify theme support by:
 * 
 * 1. Checking if theme-related CSS variables are applied
 * 2. Testing theme attribute propagation
 * 3. Verifying consistent theme application
 * 
 * Usage:
 * 1. Open Storybook and navigate to a component
 * 2. Open browser console (F12 or right-click > Inspect > Console)
 * 3. Copy and paste this entire script
 * 4. Run themeTester.testCurrentComponent()
 */

// Self-executing function to avoid global namespace pollution
(function() {
  // The primary theme-related CSS variables to check
  const THEME_CSS_VARS = [
    '--color-primary',
    '--color-secondary',
    '--color-background',
    '--color-text',
    '--font-family-sans',
    '--spacing-4',
    '--radius-md'
  ];

  // Theme options to test
  const THEME_OPTIONS = [
    'default',
    'gym',
    'sports',
    'wellness',
    'nutrition'
  ];

  // Helper to format console output
  const format = {
    header: (text) => console.log(`%c ${text} `, 'background: #8b5cf6; color: white; font-weight: bold; padding: 3px 6px; border-radius: 3px;'),
    success: (text) => console.log(`%c ✓ ${text} `, 'color: #22c55e; font-weight: bold;'),
    error: (text) => console.log(`%c ✗ ${text} `, 'color: #ef4444; font-weight: bold;'),
    warning: (text) => console.log(`%c ⚠ ${text} `, 'color: #f59e0b; font-weight: bold;'),
    info: (text) => console.log(`%c ℹ ${text} `, 'color: #3b82f6; font-weight: bold;'),
    table: (data) => console.table(data),
    group: (title, fn) => {
      console.groupCollapsed(`%c ${title} `, 'color: #8b5cf6; font-weight: bold;');
      fn();
      console.groupEnd();
    }
  };

  /**
   * Analyze the component for theme support
   */
  function analyzeComponent() {
    format.header('FITCOPILOT THEME TESTER');
    format.info('Analyzing current component for theme support...');

    // Get the story component container
    const canvas = document.getElementById('storybook-preview-iframe');
    if (!canvas) {
      format.error('Storybook canvas not found! Make sure you are viewing a component in Storybook.');
      return null;
    }

    const contentDocument = canvas.contentDocument || canvas.contentWindow.document;
    const componentContainer = contentDocument.getElementById('storybook-root');
    if (!componentContainer) {
      format.error('Component container not found in Storybook canvas!');
      return null;
    }

    format.success('Component found in Storybook canvas');
    return {
      document: contentDocument,
      container: componentContainer
    };
  }

  /**
   * Test CSS variables on component
   */
  function testCssVariables(component) {
    format.group('Testing CSS Variables', () => {
      const variables = {};
      const styles = window.getComputedStyle(component.container);
      
      THEME_CSS_VARS.forEach(varName => {
        const value = styles.getPropertyValue(varName).trim();
        variables[varName] = value || 'Not set';
        
        if (!value) {
          format.warning(`${varName} is not set on the component`);
        } else {
          format.success(`${varName}: ${value}`);
        }
      });

      format.table(variables);
    });
  }

  /**
   * Test theme attribute on component
   */
  function testThemeAttribute(component) {
    format.group('Testing Theme Attribute', () => {
      const themeAttr = component.container.getAttribute('data-theme');
      
      if (themeAttr) {
        format.success(`Component has data-theme="${themeAttr}" attribute`);
        
        // Check if it's a valid theme
        if (THEME_OPTIONS.includes(themeAttr)) {
          format.success(`"${themeAttr}" is a valid theme option`);
        } else {
          format.error(`"${themeAttr}" is NOT a recognized theme option`);
        }
      } else {
        format.warning('Component does not have a data-theme attribute (may be using default theme)');
        
        // Check if ThemeProvider is used
        const hasThemeProvider = Array.from(component.container.querySelectorAll('*')).some(
          el => el.getAttribute('data-testid') === 'theme-container'
        );
        
        if (hasThemeProvider) {
          format.success('ThemeProvider component is present (identified by data-testid)');
        } else {
          format.warning('ThemeProvider component not found');
        }
      }
    });
  }

  /**
   * Check for hardcoded color values that might override theme variables
   */
  function checkHardcodedColors(component) {
    format.group('Checking for Hardcoded Colors', () => {
      const elements = Array.from(component.container.querySelectorAll('*'));
      const hardcodedColors = [];

      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        const borderColor = styles.borderColor;
        
        // Check if inline styles contain color values
        const inlineStyles = el.getAttribute('style') || '';
        if (inlineStyles.includes('color:') || 
            inlineStyles.includes('background-color:') ||
            inlineStyles.includes('border-color:')) {
          hardcodedColors.push({
            element: el.tagName + (el.className ? `.${el.className}` : ''),
            style: inlineStyles
          });
        }
      });

      if (hardcodedColors.length > 0) {
        format.warning(`Found ${hardcodedColors.length} elements with potential hardcoded colors`);
        format.table(hardcodedColors);
      } else {
        format.success('No elements with hardcoded inline color styles found');
      }
    });
  }

  /**
   * Run all theme tests on the current component
   */
  function testCurrentComponent() {
    const component = analyzeComponent();
    if (!component) return;

    testCssVariables(component);
    testThemeAttribute(component);
    checkHardcodedColors(component);

    format.group('Theme Switching Test Instructions', () => {
      format.info('To test theme switching:');
      format.info('1. Use the theme selector in the Storybook toolbar');
      format.info('2. Switch between Default, Gym, Sports, Wellness, and Nutrition themes');
      format.info('3. Verify colors and styles update appropriately');
      format.info('4. Run this test again with different themes selected to compare variable values');
    });
  }

  // Expose the tester to the global window object
  window.themeTester = {
    testCurrentComponent,
    testCssVariables: (comp) => testCssVariables(analyzeComponent()),
    testThemeAttribute: (comp) => testThemeAttribute(analyzeComponent()),
    checkHardcodedColors: (comp) => checkHardcodedColors(analyzeComponent()),
    supportedThemes: THEME_OPTIONS,
    themeVariables: THEME_CSS_VARS
  };

  format.header('FITCOPILOT THEME TESTER LOADED');
  format.info('Run themeTester.testCurrentComponent() to test the current component');
})(); 