import { withThemeByClassName } from '@storybook/addon-themes';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Preview } from '@storybook/react';
import * as React from 'react';

// Import global styles
import '../src/styles/global.scss';

// Import context providers
import { MockWorkoutProvider, mockWorkouts } from '../src/test/context-utils/workout-context';

// Create a wrapper component for all stories
const withContextProviders = (Story: React.ComponentType) => (
  <MockWorkoutProvider initialWorkouts={mockWorkouts}>
    <Story />
  </MockWorkoutProvider>
);

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
    }
  },
  decorators: [
    withContextProviders,
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
        'personal-training': 'personal-training',
        'group-fitness': 'group-fitness'
      },
      defaultTheme: 'light'
    })
  ]
};

export default preview; 