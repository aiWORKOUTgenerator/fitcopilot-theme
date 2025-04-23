import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';
import '../src/styles/homepage.scss';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      theme: themes.dark,
      toc: true,
      source: {
        state: 'open',
      }
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0F172A',
        },
        {
          name: 'light',
          value: '#FFFFFF',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    a11y: {
      // Enable a11y checks for all stories by default
      config: {
        rules: [
          {
            // Color contrast
            id: 'color-contrast',
            enabled: true,
          },
          {
            // Alternative text for images
            id: 'image-alt',
            enabled: true,
          },
          {
            // Link names
            id: 'link-name',
            enabled: true,
          },
          {
            // Button names
            id: 'button-name',
            enabled: true,
          },
          {
            // ARIA attributes
            id: 'aria-valid-attr',
            enabled: true,
          }
        ],
      },
      // Show A11y tab in addons panel
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'UI',
          'Layout',
          'Features',
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
    // Add story wrapper for consistent padding
    (Story) => (
      <div style={{ padding: '1rem', maxWidth: '100%' }} >
        <Story />
      </div>
    ),
  ],
};

export default preview;