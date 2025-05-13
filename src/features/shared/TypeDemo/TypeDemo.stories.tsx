import { Meta, StoryObj } from '@storybook/react';
import TypeDemo from './TypeDemo';
import TypeDemoExample from './TypeDemoExample';

const meta: Meta<typeof TypeDemo> = {
    title: 'Features/Shared/TypeDemo',
    component: TypeDemo,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A demonstration component showcasing proper type safety patterns and usage in the FitCopilot theme.',
            },
        },
    },
    argTypes: {
        title: {
            description: 'The title of the component',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'TypeDemo' },
            },
        },
        description: {
            description: 'Optional description text',
            control: 'text',
            table: {
                type: { summary: 'string' },
            },
        },
        items: {
            description: 'Array of items to display',
            control: 'object',
            table: {
                type: { summary: 'TypeDemoItem[]' },
            },
        },
        variant: {
            description: 'Visual variant of the component',
            control: 'select',
            options: ['default', 'compact', 'expanded'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        themeVariant: {
            description: 'Theme context for styling',
            control: 'select',
            options: ['default', 'gym', 'sports', 'wellness'],
            table: {
                type: { summary: 'ThemeVariant' },
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
        onItemSelect: {
            description: 'Callback for when an item is selected',
            action: 'itemSelected',
        },
    },
};

export default meta;
type Story = StoryObj<typeof TypeDemo>;

// Basic Examples
export const Default: Story = {
    args: {
        title: 'Default TypeDemo',
        description: 'Default configuration with expanded items',
        items: [
            {
                id: '1',
                label: 'Push Ups',
                value: '3 sets x 15 reps',
                description: 'Standard push ups with proper form',
                isHighlighted: true
            },
            {
                id: '2',
                label: 'Pull Ups',
                value: '3 sets x 8 reps',
                description: 'Full extension pull ups'
            },
            {
                id: '3',
                label: 'Squats',
                value: '3 sets x 20 reps',
                description: 'Bodyweight squats, focus on form'
            },
        ],
        variant: 'default',
        themeVariant: 'default',
        displayMode: { mode: 'expanded', showDescriptions: true }
    },
};

export const CompactVariant: Story = {
    args: {
        title: 'Compact TypeDemo',
        description: 'Compact configuration with limited items',
        items: [
            {
                id: '1',
                label: 'Push Ups',
                value: '3 sets x 15 reps',
                description: 'Standard push ups with proper form',
            },
            {
                id: '2',
                label: 'Pull Ups',
                value: '3 sets x 8 reps',
                description: 'Full extension pull ups'
            },
        ],
        variant: 'compact',
        themeVariant: 'default',
        displayMode: { mode: 'compact', maxItems: 3 }
    },
};

export const GridLayout: Story = {
    args: {
        title: 'Grid TypeDemo',
        description: 'Grid layout with multiple items',
        items: [
            {
                id: '1',
                label: 'Push Ups',
                value: '3 sets x 15 reps',
                isHighlighted: true
            },
            {
                id: '2',
                label: 'Pull Ups',
                value: '3 sets x 8 reps'
            },
            {
                id: '3',
                label: 'Squats',
                value: '3 sets x 20 reps'
            },
            {
                id: '4',
                label: 'Plank',
                value: '3 sets x 60 seconds'
            },
        ],
        variant: 'default',
        themeVariant: 'default',
        displayMode: { mode: 'grid', columns: 2 }
    },
};

// Theme Variants
export const GymTheme: Story = {
    args: {
        title: 'Gym Theme',
        description: 'TypeDemo with gym theme variant',
        items: [
            {
                id: '1',
                label: 'Bench Press',
                value: '4 sets x 10 reps',
                description: 'Barbell bench press',
                isHighlighted: true
            },
            {
                id: '2',
                label: 'Deadlift',
                value: '3 sets x 5 reps',
                description: 'Conventional deadlift'
            },
        ],
        variant: 'default',
        themeVariant: 'gym',
        displayMode: { mode: 'expanded', showDescriptions: true }
    },
};

export const SportsTheme: Story = {
    args: {
        title: 'Sports Theme',
        description: 'TypeDemo with sports theme variant',
        items: [
            {
                id: '1',
                label: 'Sprint Intervals',
                value: '10 x 100m',
                description: 'Full speed with 60 sec rest',
                isHighlighted: true
            },
            {
                id: '2',
                label: 'Agility Drills',
                value: '3 sets',
                description: 'Ladder and cone drills'
            },
        ],
        variant: 'default',
        themeVariant: 'sports',
        displayMode: { mode: 'expanded', showDescriptions: true }
    },
};

export const WellnessTheme: Story = {
    args: {
        title: 'Wellness Theme',
        description: 'TypeDemo with wellness theme variant',
        items: [
            {
                id: '1',
                label: 'Meditation',
                value: '15 minutes',
                description: 'Guided breathing meditation',
                isHighlighted: true
            },
            {
                id: '2',
                label: 'Yoga Flow',
                value: '30 minutes',
                description: 'Gentle vinyasa sequence'
            },
        ],
        variant: 'default',
        themeVariant: 'wellness',
        displayMode: { mode: 'expanded', showDescriptions: true }
    },
};

// Loading State
export const LoadingState: Story = {
    args: {
        title: 'Loading Demo',
        description: 'TypeDemo in loading state',
        items: [],
        variant: 'default',
        themeVariant: 'default',
        isLoading: true,
    },
};

// Full Demo Example Story
const _metaExample: Meta<typeof TypeDemoExample> = {
    title: 'Features/Shared/TypeDemoExample',
    component: TypeDemoExample,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'An interactive example showcasing how to use the TypeDemo component with proper TypeScript patterns.',
            },
        },
    },
};

export const Example: StoryObj<typeof TypeDemoExample> = {
    render: () => <TypeDemoExample />,
}; 