import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'FitCopilot',
  brandUrl: 'https://fitcopilot.com',
  brandTarget: '_self',
  
  // UI
  appBg: '#f5f5f5',
  appContentBg: '#ffffff',
  appBorderColor: '#e0e0e0',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#333333',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: '#0066cc',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e0e0e0',
  inputTextColor: '#333333',
  inputBorderRadius: 4,
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other']
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false }
  }
}); 