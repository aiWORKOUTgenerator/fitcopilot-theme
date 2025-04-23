import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import * as WordPressHooks from '../../hooks/useWordPress';
import { WordPressData } from '../../types/wordpress';
import Homepage from './Homepage';

// Mock data that follows the WordPressData interface
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
    },
    {
      id: 2,
      title: 'Exercise Library',
      description: 'Access thousands of exercises with detailed form instructions and video demonstrations.',
      icon: 'https://placehold.co/64x64/CCFF00/000000?text=EX'
    },
    {
      id: 3,
      title: 'Progress Tracking',
      description: 'Track your workouts, log results, and visualize your progress over time with detailed analytics.',
      icon: 'https://placehold.co/64x64/CCFF00/000000?text=PT'
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
    },
    {
      id: 2,
      title: 'Generate Your Workout',
      description: 'Our AI creates a personalized workout plan tailored to your requirements.',
      step: 2,
      number: 2,
      image: 'https://placehold.co/300x200/CCFF00/000000?text=Step+2'
    },
    {
      id: 3,
      title: 'Track Your Progress',
      description: 'Follow your workout plan and track your progress over time.',
      step: 3,
      number: 3,
      image: 'https://placehold.co/300x200/CCFF00/000000?text=Step+3'
    }
  ],
  testimonials: [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      content: 'FitCopilot has completely transformed my workouts. The personalized plans keep me motivated and I\'ve seen amazing progress.',
      quote: 'FitCopilot has completely transformed my workouts.',
      avatar: 'https://placehold.co/100x100/CCFF00/000000?text=SJ',
      rating: 5
    },
    {
      id: 2,
      name: 'Mike Reynolds',
      role: 'Personal Trainer',
      content: 'I use FitCopilot with all my clients. The AI generates excellent workout plans that I can easily customize.',
      quote: 'The AI generates excellent workout plans that I can easily customize.',
      avatar: 'https://placehold.co/100x100/CCFF00/000000?text=MR',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Chen',
      role: 'Remote Worker',
      content: 'Working from home made it hard to stay active, but FitCopilot creates great home workouts with minimal equipment.',
      quote: 'FitCopilot creates great home workouts with minimal equipment.',
      avatar: 'https://placehold.co/100x100/CCFF00/000000?text=EC',
      rating: 4
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
        { id: 1, text: '5 AI workouts per month', included: true },
        { id: 2, text: 'Basic exercise library', included: true },
        { id: 3, text: 'Progress tracking', included: true },
        { id: 4, text: 'Advanced analytics', included: false }
      ],
      ctaText: 'Get Started',
      ctaLink: 'https://builder.fitcopilot.ai/register'
    },
    {
      id: 2,
      title: 'Pro',
      name: 'Pro',
      description: 'Advanced features for dedicated fitness enthusiasts',
      price: '9.99',
      period: 'month',
      features: [
        { id: 1, text: 'Unlimited AI workouts', included: true },
        { id: 2, text: 'Full exercise library', included: true },
        { id: 3, text: 'Advanced analytics', included: true }
      ],
      ctaText: 'Upgrade Now',
      ctaLink: 'https://builder.fitcopilot.ai/register?plan=pro',
      isPopular: true,
      popular: true
    }
  ],
  footerLinks: [
    {
      id: 1,
      title: 'Company',
      links: [
        { id: 1, title: 'About Us', url: '#about' },
        { id: 2, title: 'Contact', url: '#contact' },
        { id: 3, title: 'Careers', url: '#careers' }
      ]
    },
    {
      id: 2,
      title: 'Resources',
      links: [
        { id: 4, title: 'Blog', url: '#blog' },
        { id: 5, title: 'FAQ', url: '#faq' },
        { id: 6, title: 'Help Center', url: '#help' }
      ]
    }
  ]
};

// Create mock data context provider for the story by mocking the useWordPress hook
const MockDataDecorator = (Story: React.ComponentType) => {
  // Mock the useWordPress hook to return our mock data
  jest.spyOn(WordPressHooks, 'useWordPress').mockImplementation(() => mockWordPressData);

  return <Story />;
};

// Restore the mock after the story
const mockRestore = () => {
  jest.restoreAllMocks();
};

const meta: Meta<typeof Homepage> = {
  title: 'features/Homepage',
  component: Homepage,
  decorators: [(Story) => <div className="storybook-mock">{Story()}</div>],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'The main Homepage component that composes all homepage sections into a complete page. This component fetches and distributes data to child components and handles global animations and styling.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Homepage>;

// Override the Story rendering to inject our mocked data properly
export const Default: Story = {
  decorators: [
    (Story) => {
      // @ts-ignore - Ignoring TS error since we need to temporarily override the hook for Storybook
      jest.spyOn(WordPressHooks, 'useWordPress').mockImplementation(() => mockWordPressData);
      return <Story />;
    }
  ],
  parameters: {
    docs: {
      description: {
        story: 'The complete homepage showcasing all sections: Hero, Features, Journey, Testimonials, Pricing, and Footer. Data is provided through mocked hooks to simulate WordPress integration.'
      }
    }
  }
};
