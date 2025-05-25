import type { Meta, StoryObj } from '@storybook/react';
import { Shield, UserPlus, Zap } from 'lucide-react';
import React from 'react';

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`feature-card ${className}`}>
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="text-white text-xl font-bold mb-2">
        {title}
      </h3>
      <p className="text-gray-400">
        {description}
      </p>
    </div>
  );
};

const meta: Meta<typeof FeatureCard> = {
  title: 'Registration/Splash/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Splash Feature Card

Feature cards used on the Registration Splash page. These cards use the design system tokens for consistent styling and include:

- **Design System Integration**: Uses CSS custom properties from \`--splash-feature-card-*\` tokens
- **Green Glow Hover**: Matches the "Get Started" button hover effect
- **Backdrop Blur**: Glass-morphism effect for modern appearance
- **Responsive Design**: Adapts padding on mobile devices

## Design Tokens Used

- \`--splash-feature-card-bg\`: Semi-transparent dark background
- \`--splash-feature-card-border\`: Subtle white border
- \`--splash-feature-card-hover-border\`: Green glow border on hover
- \`--splash-feature-card-hover-glow\`: Green outer glow on hover
- \`--splash-feature-icon-bg\`: Icon background with green tint

## Context

These cards appear in the Splash page context (\`.splash-step\`) which provides the proper styling specificity to override global feature card styles.
        `
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title of the feature card'
    },
    description: {
      control: 'text',
      description: 'The description text explaining the feature'
    },
    icon: {
      control: false,
      description: 'React icon component to display'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

// Default story
export const Default: Story = {
  args: {
    icon: <Zap className="h-6 w-6 text-lime-300" />,
    title: 'AI Personalization',
    description: 'Workouts tailored to your body type, goals and available equipment'
  },
  decorators: [
    (Story) => (
      <div className="splash-step" style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
        padding: '2rem',
        borderRadius: '16px',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '320px' }}>
          <Story />
        </div>
      </div>
    )
  ]
};

// All three feature cards from the Splash page
export const AllFeatureCards: Story = {
  render: () => (
    <div className="splash-step" style={{ 
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
      padding: '2rem',
      borderRadius: '16px'
    }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-lime-300" />}
          title="AI Personalization"
          description="Workouts tailored to your body type, goals and available equipment"
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-lime-300" />}
          title="Expert Guidance"
          description="Programs designed with input from certified fitness professionals"
        />
        <FeatureCard
          icon={<UserPlus className="h-6 w-6 text-lime-300" />}
          title="Progress Tracking"
          description="Monitor your improvements and adapt your workouts as you advance"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'All three feature cards as they appear on the Splash page, showcasing the grid layout and consistent styling.'
      }
    }
  }
};

// Individual feature card variants
export const AIPersonalization: Story = {
  args: {
    icon: <Zap className="h-6 w-6 text-lime-300" />,
    title: 'AI Personalization',
    description: 'Workouts tailored to your body type, goals and available equipment'
  },
  decorators: [
    (Story) => (
      <div className="splash-step" style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
        padding: '2rem',
        borderRadius: '16px',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '320px' }}>
          <Story />
        </div>
      </div>
    )
  ]
};

export const ExpertGuidance: Story = {
  args: {
    icon: <Shield className="h-6 w-6 text-lime-300" />,
    title: 'Expert Guidance',
    description: 'Programs designed with input from certified fitness professionals'
  },
  decorators: [
    (Story) => (
      <div className="splash-step" style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
        padding: '2rem',
        borderRadius: '16px',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '320px' }}>
          <Story />
        </div>
      </div>
    )
  ]
};

export const ProgressTracking: Story = {
  args: {
    icon: <UserPlus className="h-6 w-6 text-lime-300" />,
    title: 'Progress Tracking',
    description: 'Monitor your improvements and adapt your workouts as you advance'
  },
  decorators: [
    (Story) => (
      <div className="splash-step" style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
        padding: '2rem',
        borderRadius: '16px',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '320px' }}>
          <Story />
        </div>
      </div>
    )
  ]
};

// Design System Showcase - shows the hover effects clearly
export const HoverEffectShowcase: Story = {
  render: () => (
    <div className="splash-step" style={{ 
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
      padding: '2rem',
      borderRadius: '16px'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Hover Effect Demonstration</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Hover over the cards to see the green glow effect that matches the "Get Started" button
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-lime-300" />}
          title="Hover Me!"
          description="Watch for the subtle green glow border that appears on hover"
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-lime-300" />}
          title="Design System"
          description="Uses CSS custom properties for consistent theming"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Demonstrates the hover effects and design system integration. The green glow matches the registration button hover state.'
      }
    }
  }
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  render: () => (
    <div className="splash-step" style={{ 
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
      padding: '1rem',
      borderRadius: '16px'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Responsive Design</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Cards adapt their padding on smaller screens using design tokens
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-lime-300" />}
          title="Mobile Optimized"
          description="Padding reduces on smaller screens for better mobile experience"
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-lime-300" />}
          title="Tablet Friendly"
          description="Medium padding on tablet-sized screens"
        />
        <FeatureCard
          icon={<UserPlus className="h-6 w-6 text-lime-300" />}
          title="Desktop Ready"
          description="Full padding on desktop for optimal spacing"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Shows how the cards adapt to different screen sizes using responsive design tokens.'
      }
    }
  }
}; 