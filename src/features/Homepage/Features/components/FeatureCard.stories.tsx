import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './FeatureCard';

/**
 * FeatureCard component documentation
 */
const meta: Meta<typeof FeatureCard> = {
  title: 'features/Homepage/Features/components/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'Feature card component that displays a feature with an icon, title, and description. Used in the Features section of the homepage.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the feature',
    },
    description: {
      control: 'text',
      description: 'Description of the feature',
    },
    icon: {
      control: 'select',
      options: ['brain', 'chart', 'medal', 'users'],
      description: 'Icon to display for the feature',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

/**
 * AI Feature Card example
 */
export const AIFeature: Story = {
  args: {
    title: 'AI-Powered Workouts',
    description: 'Our advanced AI analyzes your fitness level, goals, and preferences to create personalized workout plans tailored to your needs.',
    icon: 'brain'
  },
  parameters: {
    docs: {
      description: {
        story: 'Feature card highlighting AI-powered workout generation with the brain icon.',
      },
    },
  },
};

/**
 * Progress Tracking Feature
 */
export const ProgressFeature: Story = {
  args: {
    title: 'Progress Tracking',
    description: 'Monitor your fitness journey with detailed analytics and visual progress indicators to stay motivated and see real results.',
    icon: 'chart'
  },
  parameters: {
    docs: {
      description: {
        story: 'Feature card highlighting progress tracking functionality with the chart/activity icon.',
      },
    },
  },
};

/**
 * Expert Trainers Feature
 */
export const ExpertFeature: Story = {
  args: {
    title: 'Expert Trainers',
    description: 'All workouts are reviewed by certified fitness professionals to ensure they are safe, effective, and aligned with best practices.',
    icon: 'medal'
  },
  parameters: {
    docs: {
      description: {
        story: 'Feature card highlighting expert trainers with the medal/award icon.',
      },
    },
  },
};

/**
 * Community Feature
 */
export const CommunityFeature: Story = {
  args: {
    title: 'Community Support',
    description: 'Join our fitness community to share experiences, get motivation, and connect with others on a similar fitness journey.',
    icon: 'users'
  },
  parameters: {
    docs: {
      description: {
        story: 'Feature card highlighting community support with the users icon.',
      },
    },
  },
};
