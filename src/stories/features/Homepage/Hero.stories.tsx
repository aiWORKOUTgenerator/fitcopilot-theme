import { Meta, StoryObj } from '@storybook/react';
import { Hero } from '../../../features/Homepage/Hero/Hero';

const meta: Meta<typeof Hero> = {
    title: 'Features/Homepage/Hero',
    component: Hero,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'The Hero section is the main landing area of the homepage, designed to capture visitor attention and provide clear calls to action.',
            },
        },
    },
    argTypes: {
        registrationLink: {
            control: 'text',
            description: 'URL for the registration button',
        },
        loginLink: {
            control: 'text',
            description: 'URL for the login link',
        },
        logoUrl: {
            control: 'text',
            description: 'URL for the hero logo image',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
    args: {
        registrationLink: 'https://builder.fitcopilot.ai/register',
        loginLink: 'https://builder.fitcopilot.ai/login',
        logoUrl: 'https://placehold.co/200x40/CCFF00/000000?text=FitCopilot',
    },
};

export const CustomLinks: Story = {
    args: {
        registrationLink: '/custom-register',
        loginLink: '/custom-login',
        logoUrl: 'https://placehold.co/200x40/CCFF00/000000?text=FitCopilot',
    },
};

export const WithoutLogo: Story = {
    args: {
        registrationLink: 'https://builder.fitcopilot.ai/register',
        loginLink: 'https://builder.fitcopilot.ai/login',
        logoUrl: undefined,
    },
}; 