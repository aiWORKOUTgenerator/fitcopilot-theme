import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Preview } from '@storybook/react';
import * as React from 'react';

// Import global styles
import '../src/styles/global.scss';

// Import context providers
import { ThemeProvider } from '../src/context/ThemeContext';
import { MockWorkoutProvider, mockWorkouts } from '../src/test/context-utils/workout-context';
import { themeTestKit } from '../src/test/storybook/theme-test-data';

// Create a wrapper component for all stories
const withContextProviders = (Story: React.ComponentType) => (
  <MockWorkoutProvider initialWorkouts={mockWorkouts}>
    <Story />
  </MockWorkoutProvider>
);

/**
 * ThemeProvider wrapper for all stories
 * 
 * This decorator:
 * 1. Gets the theme from Storybook globals or parameters
 * 2. Wraps the story in a ThemeProvider with the selected theme
 * 3. Makes test data available through the storyContext
 */
const withThemeContext = (Story: React.ComponentType, context: any) => {
  // Get the theme from the theme selector or use default
  const selectedTheme = context.globals.theme || context.parameters.theme || 'default';
  
  // Make test data available in the story context
  context.themeTestKit = themeTestKit;
  
  return (
    <ThemeProvider initialTheme={selectedTheme} testId="theme-container">
      <div className="storybook-content" data-testid="storybook-component">
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst'
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          },
          {
            id: 'landmark-one-main',
            enabled: true
          },
          {
            id: 'page-has-heading-one',
            enabled: true
          }
        ]
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff'
        },
        {
          name: 'dark',
          value: '#333333'
        },
        {
          name: 'gray',
          value: '#f5f5f5'
        }
      ]
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        mobile1: {
          name: 'Small Mobile',
          styles: {
            width: '320px',
            height: '568px'
          }
        },
        mobile2: {
          name: 'Large Mobile',
          styles: {
            width: '414px',
            height: '896px'
          }
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px'
          }
        }
      }
    },
    layout: 'centered',
    docs: {
      story: {
        inline: true,
        iframeHeight: '500px'
      },
      canvas: {
        sourceState: 'shown'
      }
    },
    measure: {
      enabled: true
    },
    outline: {
      enabled: true
    },
    // Add type checking parameters
    typescript: {
      check: true,
      reactDocgen: 'react-docgen-typescript',
      reactDocgenTypescriptOptions: {
        shouldExtractLiteralValuesFromEnum: true,
        shouldRemoveUndefinedFromOptional: true,
        propFilter: (prop) => !prop.parent?.fileName.includes('node_modules')
      }
    },
    // Testing utilities
    themeTestData: themeTestKit
  },
  decorators: [
    // Add ThemeProvider decorator first
    withThemeContext,
    // Then other context providers
    withContextProviders,
    // Add padding to all stories for better visibility
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    )
  ],
  // Define global types for theme selector
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'default',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default Theme' },
          { value: 'gym', title: 'Gym Theme' },
          { value: 'sports', title: 'Sports Theme' },
          { value: 'wellness', title: 'Wellness Theme' },
          { value: 'nutrition', title: 'Nutrition Theme' },
        ],
      },
    },
  }
};

export default preview; 