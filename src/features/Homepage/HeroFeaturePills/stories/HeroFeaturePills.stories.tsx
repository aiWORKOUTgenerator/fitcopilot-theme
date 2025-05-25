import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ComponentWithThemes } from '../../../../utils/storybook-helpers';
import { HeroFeaturePills } from '../HeroFeaturePills';

/**
 * Hero Feature Pills display a collection of feature highlights in pill format
 * within the hero section of the homepage, highlighting key product benefits.
 */

const meta: Meta<typeof HeroFeaturePills> = {
  title: 'Homepage/HeroFeaturePills',
  component: HeroFeaturePills,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: 'Feature pills displayed in the hero section that highlight key product features in a compact, visually appealing format with a blurred backdrop effect.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    features: { 
      control: 'object',
      description: 'Array of feature items to display in pills'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent'],
      description: 'Visual style variant for the pills'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the feature pills'
    },
    backgroundStyle: {
      control: 'select',
      options: ['default', 'blur'],
      description: 'Background style - default or blur backdrop effect (blur is default)'
    },
    className: {
      control: 'text',
      description: 'Additional CSS class for styling'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '24px', 
        background: '#111827', // bg-gray-900
        borderRadius: '8px',
        maxWidth: '800px'
      }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof HeroFeaturePills>;

// Standard feature items
const defaultFeatures = [
  { id: '1', label: 'Personalized Workouts', icon: 'dumbbell' },
  { id: '2', label: 'AI-Optimized Routines', icon: 'flame' },
  { id: '3', label: 'Expert Guidance', icon: 'heart' }
];

// Exact features from Hero component
const heroFeatures = [
  { id: '1', label: 'Personalized Workouts', icon: 'dumbbell' },
  { id: '2', label: 'AI-Optimized Routines', icon: 'flame' },
  { id: '3', label: 'Expert Guidance', icon: 'heart' }
];

export const Default: Story = {
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium',
    backgroundStyle: 'blur'
  }
};

export const ExactHeroMatch: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Exact match to the pills found in the Hero component'
      }
    }
  },
  render: (args: React.ComponentProps<typeof HeroFeaturePills>) => (
    <div style={{ 
      padding: '24px', 
      background: '#111827', // bg-gray-900 (same as Hero)
      borderRadius: '8px',
      maxWidth: '800px'
    }}>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <HeroFeaturePills {...args} />
      </div>
    </div>
  ),
  args: {
    features: heroFeatures,
    variant: 'primary',
    size: 'medium',
    backgroundStyle: 'blur'
  }
};

export const WithoutBlur: Story = {
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium',
    backgroundStyle: 'default'
  }
};

export const WithIcons: Story = {
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium'
  }
};

export const WithoutIcons: Story = {
  args: {
    features: [
      { id: '1', label: 'Personalized Workouts' },
      { id: '2', label: 'AI-Optimized Routines' },
      { id: '3', label: 'Expert Guidance' }
    ],
    variant: 'primary',
    size: 'medium'
  }
};

export const Secondary: Story = {
  args: {
    features: defaultFeatures,
    variant: 'secondary',
    size: 'medium'
  }
};

export const Accent: Story = {
  args: {
    features: defaultFeatures,
    variant: 'accent',
    size: 'medium'
  }
};

export const Small: Story = {
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'small'
  }
};

export const Large: Story = {
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'large'
  }
};

export const ThemeShowcase: Story = {
  render: (args: React.ComponentProps<typeof HeroFeaturePills>) => ComponentWithThemes(HeroFeaturePills, args),
  args: {
    features: defaultFeatures,
    variant: 'primary',
    size: 'medium'
  }
};

export const ResponsiveVariants: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'responsive'
    },
    docs: {
      description: {
        story: 'Shows how the feature pills adapt to different viewport sizes.'
      }
    }
  },
  render: (args: React.ComponentProps<typeof HeroFeaturePills>) => (
    <div className="responsive-demo" style={{ maxWidth: '100%' }}>
      <HeroFeaturePills {...args} />
    </div>
  ),
  args: {
    features: [
      { id: '1', label: 'Personalized', icon: 'dumbbell' },
      { id: '2', label: 'AI-Powered', icon: 'flame' },
      { id: '3', label: 'Adaptable', icon: 'heart' },
      { id: '4', label: 'Goal-Oriented', icon: 'dumbbell' },
      { id: '5', label: 'Progressive', icon: 'flame' }
    ],
    variant: 'primary',
    size: 'medium'
  }
}; 