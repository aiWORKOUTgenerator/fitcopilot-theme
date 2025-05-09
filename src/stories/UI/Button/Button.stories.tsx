import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Heart, Play } from 'lucide-react';
import React from 'react';
import { Button } from './';

/**
 * Button component meta documentation
 */
const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        layout: 'centered',
        actions: {
            handles: ['click .storybook-button'],
        },
        docs: {
            description: {
                component: 'Button component for user actions with various sizes, styles, and theme variants. Buttons provide visual cues to users for interactive elements.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/example/fitcopilot?node-id=1234-5678',
        },
        a11y: {
            config: {
                rules: [
                    {
                        // Apply appropriate accessibility rules
                        id: 'button-name',
                        enabled: true,
                    },
                ],
            },
        },
    },
    argTypes: {
        size: {
            description: 'The size of the button',
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'medium' },
            },
        },
        variant: {
            description: 'Button style variant',
            control: { type: 'select' },
            options: ['primary', 'secondary', 'tertiary', 'ghost', 'gradient', 'violet-indigo'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'primary' },
            },
        },
        themeContext: {
            description: 'Theme context for styling',
            control: { type: 'select' },
            options: ['default', 'gym', 'sports', 'wellness', 'modern', 'classic', 'minimalist'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        children: {
            description: 'Button content',
            control: 'text',
            table: {
                type: { summary: 'React.ReactNode' },
            },
        },
        fullWidth: {
            description: 'Makes button full width',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        isLoading: {
            description: 'Shows loading state',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        disabled: {
            description: 'Disables the button',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        as: {
            description: 'Render as button or anchor',
            control: { type: 'select' },
            options: ['button', 'a'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'button' },
            },
        },
        leftIcon: {
            description: 'Icon displayed before text',
            control: { type: 'boolean' },
            table: {
                type: { summary: 'React.ReactNode' },
            },
        },
        rightIcon: {
            description: 'Icon displayed after text',
            control: { type: 'boolean' },
            table: {
                type: { summary: 'React.ReactNode' },
            },
        },
        href: {
            description: 'URL when rendered as anchor',
            control: 'text',
            if: { arg: 'as', eq: 'a' },
            table: {
                type: { summary: 'string' },
            },
        },
        onClick: {
            description: 'Click event handler',
            action: 'clicked',
            table: {
                type: { summary: 'function' },
                category: 'Events',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Primary button variant - used for main call-to-action
 */
export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Get Started',
        size: 'medium',
    },
    parameters: {
        docs: {
            description: {
                story: 'Primary buttons should be used for the main action in a section or page.',
            },
        },
    },
};

/**
 * Secondary button variant - used for secondary actions
 */
export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Cancel',
        size: 'medium',
    },
    parameters: {
        docs: {
            description: {
                story: 'Secondary buttons should be used for alternative actions or less emphasized options.',
            },
        },
    },
};

/**
 * Gradient button variant - visually striking effect
 */
export const Gradient: Story = {
    args: {
        variant: 'gradient',
        children: 'Create Workout',
        size: 'medium',
    },
    parameters: {
        docs: {
            description: {
                story: 'Gradient buttons create visual emphasis for important actions.',
            },
        },
    },
};

/**
 * Button with left icon example
 */
export const WithLeftIcon: Story = {
    args: {
        variant: 'primary',
        children: 'Play Workout',
        leftIcon: <Play size={16} />,
        size: 'medium',
    },
    parameters: {
        docs: {
            description: {
                story: 'Buttons can include icons to enhance visual communication.',
            },
        },
    },
};

/**
 * Button with right icon example
 */
export const WithRightIcon: Story = {
    args: {
        variant: 'primary',
        children: 'Next Step',
        rightIcon: <ArrowRight size={16} />,
        size: 'medium',
    },
};

/**
 * Button as anchor link example
 */
export const AsLink: Story = {
    args: {
        variant: 'gradient',
        children: 'Visit Dashboard',
        as: 'a',
        href: '#dashboard',
        size: 'medium',
    },
};

/**
 * Gym theme context example
 */
export const GymTheme: Story = {
    args: {
        variant: 'primary',
        children: 'Join Gym',
        themeContext: 'gym',
        rightIcon: <Heart size={16} />,
        size: 'medium',
    },
};

/**
 * Loading state example
 */
export const Loading: Story = {
    args: {
        variant: 'primary',
        children: 'Saving',
        isLoading: true,
        size: 'medium',
    },
};

/**
 * Disabled state for buttons that are inactive
 */
export const Disabled: Story = {
    args: {
        variant: 'primary',
        children: 'Disabled',
        size: 'medium',
        disabled: true,
    },
}; 