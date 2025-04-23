import { Meta, StoryObj } from '@storybook/react';
import { Pricing } from './Pricing';
import { PlanFeature } from './types';

/**
 * Pricing component documentation
 */
const meta: Meta<typeof Pricing> = {
  title: 'features/Homepage/Pricing',
  component: Pricing,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component: 'Pricing component displays subscription options with toggleable billing periods, animated pricing details, and feature lists. The component includes interactive elements like tooltips on hover and expanding feature lists.'
      }
    }
  },
  argTypes: {
    pricing: {
      description: 'Array of pricing plans to display. If not provided, default plans will be used.',
      control: 'object'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Pricing>;

// Example features for pricing plans
const createPlanFeatures = (plan: 'basic' | 'pro' | 'elite'): PlanFeature[] => {
  const basicFeatures: PlanFeature[] = [
    { id: 1, text: '5 AI workouts per month', included: true, isHighlighted: true },
    { id: 2, text: 'Basic exercise library', included: true },
    { id: 3, text: 'Progress tracking', included: true },
    { id: 4, text: 'Advanced analytics', included: false },
    { id: 5, text: 'Custom workout templates', included: false },
    { id: 6, text: 'Personal coach assistance', included: false }
  ];

  const proFeatures: PlanFeature[] = [
    { id: 1, text: 'Unlimited AI workouts', included: true, isHighlighted: true },
    { id: 2, text: 'Full exercise library', included: true },
    { id: 3, text: 'Progress tracking', included: true },
    { id: 4, text: 'Advanced analytics', included: true, isHighlighted: true },
    { id: 5, text: 'Custom workout templates', included: true },
    { id: 6, text: 'Multiple format exports', included: true },
    { id: 7, text: 'Priority support', included: true },
    { id: 8, text: 'Earlybird beta features', included: true, tooltip: 'Get access to new features before they are released to the public' },
    { id: 9, text: 'Personal coach assistance', included: false }
  ];

  const eliteFeatures: PlanFeature[] = [
    { id: 1, text: 'Everything in Pro', included: true, isHighlighted: true },
    { id: 2, text: 'Live coaching sessions', included: true, isHighlighted: true },
    { id: 3, text: 'Advanced AI programming', included: true },
    { id: 4, text: 'Personalized nutrition guidance', included: true },
    { id: 5, text: 'Video form checks & feedback', included: true },
    { id: 6, text: 'Dedicated trainer support', included: true },
    { id: 7, text: 'Customized workout plan design', included: true },
    { id: 8, text: 'Direct trainer email support', included: true, tooltip: 'Get direct access to certified fitness trainers via email' }
  ];

  switch (plan) {
    case 'basic': return basicFeatures;
    case 'pro': return proFeatures;
    case 'elite': return eliteFeatures;
    default: return basicFeatures;
  }
};

/**
 * Default state of the Pricing component
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default pricing section with three plans: Basic (free), Pro (premium with animation), and Elite (higher tier). Includes billing toggle and interactive elements.'
      }
    }
  }
};

/**
 * Custom pricing example for the Pricing component
 */
export const CustomPricing: Story = {
  args: {
    pricing: [
      {
        id: 1,
        name: 'Starter',
        description: 'Perfect for fitness beginners',
        price: '4.99',
        betaPrice: '2.99',
        period: 'month',
        features: createPlanFeatures('basic'),
        ctaText: 'Start Now',
        ctaLink: '#starter',
        accentColors: 'from-blue-300 to-cyan-400',
        titleTextColors: 'from-blue-300 to-cyan-400',
        priceTextColors: 'from-blue-300 to-cyan-400',
        accentTextColor: 'blue-300',
        badge: 'Starter'
      },
      {
        id: 2,
        name: 'Advanced',
        description: 'For serious fitness enthusiasts',
        price: '14.99',
        betaPrice: '9.99',
        period: 'month',
        features: createPlanFeatures('pro'),
        ctaText: 'Go Advanced',
        ctaLink: '#advanced',
        popular: true,
        accentColors: 'from-amber-300 to-orange-400',
        titleTextColors: 'from-amber-300 to-orange-400',
        priceTextColors: 'from-amber-300 to-orange-400',
        accentTextColor: 'amber-300',
        badge: 'Best Value'
      },
      {
        id: 3,
        name: 'Premium',
        description: 'Complete fitness experience',
        price: '29.99',
        period: 'month',
        features: createPlanFeatures('elite'),
        ctaText: 'Go Premium',
        ctaLink: '#premium',
        accentColors: 'from-violet-300 to-fuchsia-400',
        titleTextColors: 'from-violet-300 to-fuchsia-400',
        priceTextColors: 'from-violet-300 to-fuchsia-400',
        accentTextColor: 'violet-300',
        badge: 'Premium'
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom pricing plans with different tiers, features, and color schemes to demonstrate full customization capabilities.'
      }
    }
  }
};

/**
 * Single plan display
 */
export const SinglePlan: Story = {
  args: {
    pricing: [
      {
        id: 1,
        name: 'Early Access',
        description: 'Limited time beta pricing',
        price: '49.99',
        betaPrice: '29.99',
        period: 'year',
        features: [
          { id: 1, text: 'All premium features', included: true, isHighlighted: true },
          { id: 2, text: 'Early access to new features', included: true },
          { id: 3, text: 'Priority support', included: true },
          { id: 4, text: 'Lifetime updates', included: true, tooltip: 'Get all updates for the duration of your subscription' }
        ],
        ctaText: 'Get Access Now',
        ctaLink: '#early-access',
        popular: true,
        accentColors: 'from-emerald-300 to-teal-400',
        titleTextColors: 'from-emerald-300 to-teal-400',
        priceTextColors: 'from-emerald-300 to-teal-400',
        accentTextColor: 'emerald-300',
        badge: 'Limited Time'
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Single pricing plan layout for special offers or simple pricing structures.'
      }
    }
  }
};

/**
 * Edge case example (e.g., empty state, error state)
 */
export const EdgeCase: Story = {
  args: {
    // Add edge case props here
  },
  parameters: {
    docs: {
      description: {
        story: 'An edge case for the Pricing component (e.g., empty state, error state).',
      },
    },
  },
};
