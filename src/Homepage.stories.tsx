import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import HomepageFeature from './features/Homepage';
import * as WordPressHooks from './hooks/useWordPress';
import { WordPressData } from './types/wordpress';

// Create a replica of the Homepage component for the story
const HomepageForStory: React.FC = () => {
    return <HomepageFeature />;
};

// Mock data that matches WordPressData interface
const mockWordPressData: WordPressData = {
    siteLinks: {
        registration: 'https://builder.fitcopilot.ai/register',
        login: 'https://builder.fitcopilot.ai/login'
    },
    assets: {
        logo: 'https://placehold.co/150x50/CCFF00/000000?text=FitCopilot'
    },
    features: [
        {
            id: 1,
            title: 'AI Workout Generation',
            description: 'Create personalized workouts tailored to your goals, equipment, and fitness level in seconds.',
            icon: 'https://placehold.co/64x64/CCFF00/000000?text=AI'
        }
    ],
    journey: [
        {
            id: 1,
            title: 'Define Your Goals',
            description: 'Tell us your fitness goals, experience level, and available equipment.',
            step: 1,
            number: 1,
            image: 'https://placehold.co/300x200/CCFF00/000000?text=Step+1'
        }
    ],
    testimonials: [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Fitness Enthusiast',
            content: 'FitCopilot has completely transformed my workouts.',
            quote: 'FitCopilot has completely transformed my workouts.',
            avatar: 'https://placehold.co/100x100/CCFF00/000000?text=SJ',
            rating: 5
        }
    ],
    pricing: [
        {
            id: 1,
            title: 'Basic',
            name: 'Basic',
            description: 'Perfect for getting started with AI workouts',
            price: '0',
            period: 'forever',
            features: [
                { id: 1, text: '5 AI workouts per month', included: true }
            ],
            ctaText: 'Get Started',
            ctaLink: 'https://builder.fitcopilot.ai/register'
        }
    ],
    footerLinks: [
        {
            id: 1,
            title: 'Company',
            links: [
                { id: 1, title: 'About Us', url: '#about' }
            ]
        }
    ]
};

const meta: Meta<typeof HomepageForStory> = {
    title: 'Homepage',
    component: HomepageForStory,
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'dark',
        },
        docs: {
            description: {
                component: 'Main application entry point component that renders the HomepageFeature component. This component initializes the React application and provides error handling.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<typeof HomepageForStory>;

export const Default: Story = {
    decorators: [
        (Story) => {
            // @ts-expect-error - Temporarily override the hook for Storybook
            jest.spyOn(WordPressHooks, 'useWordPress').mockImplementation(() => mockWordPressData);
            return <Story />;
        }
    ],
    parameters: {
        docs: {
            description: {
                story: 'The entry point component that initializes the React application and renders the HomepageFeature component.'
            }
        }
    }
}; 