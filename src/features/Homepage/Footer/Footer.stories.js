import { Footer } from './Footer';
/**
 * Footer component documentation
 */
const meta = {
    title: 'features/Homepage/Footer',
    component: Footer,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'dark',
        },
        docs: {
            description: {
                component: 'The Footer component displays the site footer with navigation links, social media icons, newsletter signup, and copyright information.',
            },
        },
    },
    argTypes: {
        links: {
            control: 'object',
            description: 'Array of link groups to display in the footer. If not provided, default link groups will be used.',
        },
    },
};
export default meta;
/**
 * Default footer with default link groups
 */
export const Default = {
    args: {
        links: []
    },
    parameters: {
        docs: {
            description: {
                story: 'Default footer with automatically generated link groups.',
            },
        },
    },
};
/**
 * Footer with custom link groups
 */
export const CustomLinks = {
    args: {
        links: [
            {
                id: 1,
                title: 'Workouts',
                links: [
                    { id: 101, title: 'Strength Training', url: '#strength' },
                    { id: 102, title: 'Cardio', url: '#cardio' },
                    { id: 103, title: 'Yoga', url: '#yoga' },
                    { id: 104, title: 'HIIT', url: '#hiit' }
                ]
            },
            {
                id: 2,
                title: 'Nutrition',
                links: [
                    { id: 201, title: 'Meal Plans', url: '#meal-plans' },
                    { id: 202, title: 'Recipes', url: '#recipes' },
                    { id: 203, title: 'Supplements', url: '#supplements' },
                    { id: 204, title: 'Calculators', url: '#calculators' }
                ]
            },
            {
                id: 3,
                title: 'Help',
                links: [
                    { id: 301, title: 'FAQ', url: '/faq' },
                    { id: 302, title: 'Contact Us', url: '/contact' },
                    { id: 303, title: 'Support', url: '/support' }
                ]
            }
        ]
    },
    parameters: {
        docs: {
            description: {
                story: 'Footer with custom link groups for a fitness-focused website.',
            },
        },
    },
};
/**
 * Variant example for the Footer component
 */
export const Variant = {
    args: {
    // Add variant props here
    },
    parameters: {
        docs: {
            description: {
                story: 'A variant of the Footer component.',
            },
        },
    },
};
/**
 * Edge case example (e.g., empty state, error state)
 */
export const EdgeCase = {
    args: {
    // Add edge case props here
    },
    parameters: {
        docs: {
            description: {
                story: 'An edge case for the Footer component (e.g., empty state, error state).',
            },
        },
    },
};
