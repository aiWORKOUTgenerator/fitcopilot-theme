import { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

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
            options: ['primary', 'secondary', 'tertiary', 'ghost'],
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

// Variants
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

export const WithBothIcons: Story = {
    args: {
        children: 'Button with Icons',
        leftIcon: <span>←</span>,
        rightIcon: <span>→</span>,
    },
}; 