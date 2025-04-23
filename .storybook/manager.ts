import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
    theme: {
        ...themes.dark,
        brandTitle: 'FitCopilot UI',
        brandUrl: 'https://fitcopilot.com',
        brandImage: 'https://placehold.co/200x40/CCFF00/000000?text=FitCopilot',
        brandTarget: '_self',
        colorPrimary: '#CCFF00',
        colorSecondary: '#64D2B9',
    },
    sidebar: {
        showRoots: true,
    },
}); 