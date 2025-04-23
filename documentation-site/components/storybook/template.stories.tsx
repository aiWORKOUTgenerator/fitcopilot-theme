/**
 * Component Story Template
 * 
 * This is a template for creating new component stories.
 * Copy this file, rename it to match your component, and customize it.
 */

import { Meta, StoryObj } from '@storybook/react';
// Import your component
// import { YourComponent } from './YourComponent';

// For demonstration purposes only - remove when using template
const ExampleComponent = ({
    label = 'Example',
    variant = 'default',
    disabled = false,
    onClick = () => { }
}) => (
    <button
        className={`example-component ${variant}`}
        disabled={disabled}
        onClick={onClick}
    >
        {label}
    </button>
);

/**
 * Component metadata configuration
 */
const meta = {
    // Update the title to match your component's location in the component hierarchy
    title: 'Template/ExampleComponent',

    // Update to your component
    component: ExampleComponent,

    // Tags for documentation categorization
    tags: ['autodocs'],

    // Parameters configuration
    parameters: {
        // Layout options: centered, fullscreen, padded
        layout: 'centered',

        // Component documentation
        docs: {
            description: {
                component: 'Replace with a detailed description of your component purpose and usage.',
            },
        },

        // Design integration - link to Figma or other design tools
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/example/fitcopilot?node-id=component-id',
        },

        // Accessibility testing configuration
        a11y: {
            config: {
                rules: [
                    // Enable specific accessibility rules
                    { id: 'button-name', enabled: true },
                ],
            },
        },
    },

    // Control definitions for component props
    argTypes: {
        // Example prop control - update with your component's props
        label: {
            description: 'The text displayed in the component',
            control: { type: 'text' },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Example' },
            },
        },

        variant: {
            description: 'The visual style variant',
            control: { type: 'select' },
            options: ['default', 'primary', 'secondary', 'outline'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },

        disabled: {
            description: 'Whether the component is disabled',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false },
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

        // Add more prop controls as needed
    },
} satisfies Meta<typeof ExampleComponent>;

export default meta;
type Story = StoryObj<typeof ExampleComponent>;

/**
 * Default state story
 */
export const Default: Story = {
    args: {
        // Default prop values
        label: 'Example Component',
        variant: 'default',
    },
    parameters: {
        docs: {
            description: {
                story: 'The default state of the component.',
            },
        },
    },
};

/**
 * Primary variant story
 */
export const Primary: Story = {
    args: {
        // Only specify props that differ from Default
        label: 'Primary Variant',
        variant: 'primary',
    },
    parameters: {
        docs: {
            description: {
                story: 'The primary style variant of the component.',
            },
        },
    },
};

/**
 * Disabled state story
 */
export const Disabled: Story = {
    args: {
        label: 'Disabled Component',
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'The disabled state of the component.',
            },
        },
    },
};

/**
 * Add more stories to showcase different states and variations
 * For example:
 * - Loading states
 * - Error states
 * - Size variations
 * - With icons or additional elements
 * - Edge cases with long content or special characters
 */ 