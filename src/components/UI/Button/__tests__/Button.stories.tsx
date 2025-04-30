import { Meta, StoryObj } from '@storybook/react';
import Button, { DefaultButton, GymButton } from '../index';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A versatile button component with multiple variants, sizes, loading states, and accessibility features.',
            },
        },
    },
    argTypes: {
        variant: {
            description: 'Visual style of the button',
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'ghost', 'gradient'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'primary' },
            },
        },
        size: {
            description: 'Size of the button',
            control: 'select',
            options: ['small', 'medium', 'large'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'medium' },
            },
        },
        themeContext: {
            description: 'Theme context for styling',
            control: 'select',
            options: ['default', 'gym'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        isLoading: {
            description: 'Loading state',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        fullWidth: {
            description: 'Whether the button should take the full width of its container',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        disabled: {
            description: 'Whether the button is disabled',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        leftIcon: {
            description: 'Icon to display before the button text',
            control: { disable: true },
        },
        rightIcon: {
            description: 'Icon to display after the button text',
            control: { disable: true },
        },
        onClick: {
            description: 'Function called when the button is clicked',
            action: 'clicked',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Theme Variants
export const DefaultTheme: Story = {
    args: {
        children: 'Default Theme Button',
        variant: 'primary',
        themeContext: 'default',
    },
};

export const GymTheme: Story = {
    args: {
        children: 'Gym Theme Button',
        variant: 'primary',
        themeContext: 'gym',
    },
};

// Standard Variants (Default Theme)
export const Primary: Story = {
    args: {
        children: 'Primary Button',
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary Button',
        variant: 'secondary',
    },
};

export const Tertiary: Story = {
    args: {
        children: 'Tertiary Button',
        variant: 'tertiary',
    },
};

export const Ghost: Story = {
    args: {
        children: 'Ghost Button',
        variant: 'ghost',
    },
};

// Gradient Variants
export const DefaultGradient: Story = {
    args: {
        children: 'Default Gradient Button',
        variant: 'gradient',
        themeContext: 'default',
    },
};

export const GymGradient: Story = {
    args: {
        children: 'Gym Gradient Button',
        variant: 'gradient',
        themeContext: 'gym',
    },
};

export const GradientWithArrow: Story = {
    args: {
        children: 'Gradient Button',
        variant: 'gradient',
        rightIcon: <span>→</span>,
    },
};

// Sizes
export const Small: Story = {
    args: {
        children: 'Small Button',
        size: 'small',
    },
};

export const Medium: Story = {
    args: {
        children: 'Medium Button',
        size: 'medium',
    },
};

export const Large: Story = {
    args: {
        children: 'Large Button',
        size: 'large',
    },
};

// States
export const Loading: Story = {
    args: {
        children: 'Loading Button',
        isLoading: true,
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled Button',
        disabled: true,
    },
};

export const FullWidth: Story = {
    args: {
        children: 'Full Width Button',
        fullWidth: true,
    },
    parameters: {
        layout: 'padded',
    },
};

// With icons
export const WithLeftIcon: Story = {
    args: {
        children: 'Button with Left Icon',
        leftIcon: <span>→</span>,
    },
};

export const WithRightIcon: Story = {
    args: {
        children: 'Button with Right Icon',
        rightIcon: <span>→</span>,
    },
};

// Define a separate meta for DefaultButton
export const DefaultButtonMeta: Meta<typeof DefaultButton> = {
    title: 'UI/Button/DefaultButton',
    component: DefaultButton,
    tags: ['autodocs'],
};

// Define a separate meta for GymButton
export const GymButtonMeta: Meta<typeof GymButton> = {
    title: 'UI/Button/GymButton',
    component: GymButton,
    tags: ['autodocs'],
}; 