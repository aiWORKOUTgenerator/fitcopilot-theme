import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline'],
            description: 'The visual style of the button',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'The size of the button',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the button is disabled',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline Button',
    },
};

export const Disabled: Story = {
    args: {
        variant: 'primary',
        children: 'Disabled Button',
        disabled: true,
    },
};

export const Small: Story = {
    args: {
        variant: 'primary',
        size: 'sm',
        children: 'Small Button',
    },
};

export const Large: Story = {
    args: {
        variant: 'primary',
        size: 'lg',
        children: 'Large Button',
    },
}; 