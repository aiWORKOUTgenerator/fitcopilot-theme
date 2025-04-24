import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/react';
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
                component: 'Button component for user actions with various sizes and styles. Buttons provide visual cues to users for interactive elements.',
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
        primary: {
            description: 'Whether the button is primary',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        label: {
            description: 'Button text',
            control: 'text',
            table: {
                type: { summary: 'string' },
            },
        },
        backgroundColor: {
            description: 'Button background color',
            control: { type: 'color' },
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
 * Primary button state - used for main call-to-action
 */
export const Primary: Story = {
    args: {
        primary: true,
        label: 'Get Started',
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
 * Secondary button state - used for secondary actions
 */
export const Secondary: Story = {
    args: {
        label: 'Cancel',
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
 * Large button - uses increased padding and font size
 */
export const Large: Story = {
    args: {
        primary: true,
        size: 'large',
        label: 'Create Workout',
    },
    parameters: {
        docs: {
            description: {
                story: 'Large buttons should be used for the main action on landing pages or important forms.',
            },
        },
    },
};

/**
 * Small button - used in compact spaces
 */
export const Small: Story = {
    args: {
        primary: true,
        size: 'small',
        label: 'Save',
    },
    parameters: {
        docs: {
            description: {
                story: 'Small buttons should be used in tight spaces like tables, cards, or alongside other controls.',
            },
        },
    },
};

/**
 * Focus state demonstration for accessibility testing
 */
export const Focused: Story = {
    args: {
        primary: true,
        label: 'Focused Button',
        size: 'medium',
    },
    parameters: {
        docs: {
            description: {
                story: 'This demonstrates the focus state for keyboard navigation and accessibility.',
            },
        },
    },
};

/**
 * Disabled state for buttons that are inactive
 */
export const Disabled: Story = {
    args: {
        primary: true,
        label: 'Disabled',
        size: 'medium',
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Use disabled buttons to indicate actions that are currently unavailable.',
            },
        },
    },
}; 