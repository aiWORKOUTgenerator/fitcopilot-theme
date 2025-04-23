import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Hero } from '../../../features/Homepage/Hero';

/**
 * The Hero component is the main banner section at the top of the homepage.
 * It displays the main value proposition, call-to-action buttons, and visual elements
 * to attract users to the FitCopilot application.
 */
const meta: Meta<typeof Hero> = {
    title: 'Features/Homepage/Hero',
    component: Hero,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'The main hero section for the FitCopilot homepage, featuring the primary call-to-action and value proposition.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/example/fitcopilot?node-id=1234-5678',
        },
        a11y: {
            config: {
                rules: [
                    { id: 'color-contrast', enabled: true },
                    { id: 'heading-order', enabled: true },
                ],
            },
        },
    },
    argTypes: {
        registrationLink: {
            description: 'URL for the registration button',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'https://builder.fitcopilot.ai/register' },
            },
        },
        loginLink: {
            description: 'URL for the login button',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'https://builder.fitcopilot.ai/login' },
            },
        },
        logoUrl: {
            description: 'URL for the logo image',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '/assets/images/logo.png' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Hero>;

/**
 * The default state of the Hero component with all required props
 */
export const Default: Story = {
    args: {
        registrationLink: 'https://builder.fitcopilot.ai/register',
        loginLink: 'https://builder.fitcopilot.ai/login',
        logoUrl: '/assets/images/logo.png',
    },
    parameters: {
        docs: {
            description: {
                story: 'The default state of the Hero component showing all required elements.',
            },
        },
    },
};

/**
 * Mobile responsive view of the Hero component
 */
export const Mobile: Story = {
    args: {
        ...Default.args,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile',
        },
        docs: {
            description: {
                story: 'The Hero component displayed on mobile devices with responsive layout adjustments.',
            },
        },
    },
};

/**
 * Demonstrates the component with a focus state on the primary CTA button
 */
export const FocusedCTA: Story = {
    args: {
        ...Default.args,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Find the main CTA button
        const ctaButton = canvas.getByRole('link', { name: /get started/i });

        // Focus the button
        await userEvent.tab();

        // Check that the button receives focus
        await expect(ctaButton).toHaveFocus();
    },
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates keyboard navigation to the primary CTA button, showing the focus state for accessibility.',
            },
        },
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