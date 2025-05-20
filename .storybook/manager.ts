import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Create a custom theme for Storybook UI
const fitCopilotTheme = create({
  base: 'dark',
  
  // Brand
  brandTitle: 'FitCopilot UI Components',
  brandUrl: '#',
  brandTarget: '_self',
  
  // UI
  appBg: '#111827',
  appContentBg: '#1f2937',
  appBorderColor: '#374151',
  appBorderRadius: 6,
  
  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',
  
  // Text colors
  textColor: '#f9fafb',
  textInverseColor: '#111827',
  textMutedColor: '#9ca3af',
  
  // Toolbar default and active colors
  barTextColor: '#d1d5db',
  barSelectedColor: '#8b5cf6',
  barBg: '#111827',
  
  // Form colors
  inputBg: '#1f2937',
  inputBorder: '#374151',
  inputTextColor: '#f9fafb',
  inputBorderRadius: 4,
  
  // Colors
  colorPrimary: '#8b5cf6',
  colorSecondary: '#3b82f6',
});

// Apply the theme to Storybook
addons.setConfig({
  theme: fitCopilotTheme,
  enableShortcuts: true,
  sidebar: {
    showRoots: true
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: true },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  }
}); 