import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JourneyButton } from '../';

const meta: Meta<typeof JourneyButton> = {
  title: 'Homepage/Journey/JourneyButton',
  component: JourneyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A specialized button for the homepage journey section with theme support and gradient color options. Extends the HeroButton component with Journey-specific styling.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description: 'Visual style variant'
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Size variant'
    },
    gradientColor: {
      control: 'select',
      options: ['lime', 'cyan', 'violet', 'amber'],
      description: 'Gradient color for primary variant'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width'
    },
    leftIcon: {
      control: 'text',
      description: 'Icon to display on the left side of the button'
    },
    rightIcon: {
      control: 'text',
      description: 'Icon to display on the right side of the button'
    },
    href: {
      control: 'text',
      description: 'URL to navigate to (renders as anchor)'
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked'
    },
    children: {
      control: 'text',
      description: 'Button content'
    }
  }
};

export default meta;
type Story = StoryObj<typeof JourneyButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Start Your Journey',
    size: 'medium',
    gradientColor: 'lime'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Learn More',
    size: 'medium'
  }
};

export const CyanGradient: Story = {
  args: {
    variant: 'primary',
    children: 'Explore Workouts',
    gradientColor: 'cyan',
    size: 'medium'
  }
};

export const VioletGradient: Story = {
  args: {
    variant: 'primary',
    children: 'Join Classes',
    gradientColor: 'violet',
    size: 'medium'
  }
};

export const AmberGradient: Story = {
  args: {
    variant: 'primary',
    children: 'Get Nutrition Tips',
    gradientColor: 'amber',
    size: 'medium'
  }
};

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Get Started',
    leftIcon: '→',
    size: 'medium',
    gradientColor: 'lime'
  }
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Next Steps',
    rightIcon: '→',
    size: 'medium',
    gradientColor: 'lime'
  }
};

export const Large: Story = {
  args: {
    variant: 'primary',
    children: 'Join Now',
    size: 'large',
    gradientColor: 'lime'
  }
};

export const Small: Story = {
  args: {
    variant: 'primary',
    children: 'Sign Up',
    size: 'small',
    gradientColor: 'lime'
  }
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Coming Soon',
    disabled: true,
    size: 'medium',
    gradientColor: 'lime'
  }
};

export const AsLink: Story = {
  args: {
    variant: 'primary',
    children: 'View Journey',
    href: '#',
    size: 'medium',
    gradientColor: 'lime'
  }
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Sign Up For Journey',
    fullWidth: true,
    size: 'medium',
    gradientColor: 'lime'
  },
  parameters: {
    layout: 'padded',
  }
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>Default Theme</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <JourneyButton variant="primary" gradientColor="lime">Lime</JourneyButton>
          <JourneyButton variant="primary" gradientColor="cyan">Cyan</JourneyButton>
          <JourneyButton variant="primary" gradientColor="violet">Violet</JourneyButton>
          <JourneyButton variant="primary" gradientColor="amber">Amber</JourneyButton>
          <JourneyButton variant="secondary">Secondary</JourneyButton>
        </div>
      </div>
      
      <div>
        <h3>Gym Theme</h3>
        <div data-theme="gym" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <JourneyButton variant="primary" gradientColor="lime">Lime</JourneyButton>
          <JourneyButton variant="primary" gradientColor="cyan">Cyan</JourneyButton>
          <JourneyButton variant="primary" gradientColor="violet">Violet</JourneyButton>
          <JourneyButton variant="primary" gradientColor="amber">Amber</JourneyButton>
          <JourneyButton variant="secondary">Secondary</JourneyButton>
        </div>
      </div>
      
      <div>
        <h3>Sports Theme</h3>
        <div data-theme="sports" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <JourneyButton variant="primary" gradientColor="lime">Lime</JourneyButton>
          <JourneyButton variant="primary" gradientColor="cyan">Cyan</JourneyButton>
          <JourneyButton variant="primary" gradientColor="violet">Violet</JourneyButton>
          <JourneyButton variant="primary" gradientColor="amber">Amber</JourneyButton>
          <JourneyButton variant="secondary">Secondary</JourneyButton>
        </div>
      </div>
      
      <div>
        <h3>Wellness Theme</h3>
        <div data-theme="wellness" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <JourneyButton variant="primary" gradientColor="lime">Lime</JourneyButton>
          <JourneyButton variant="primary" gradientColor="cyan">Cyan</JourneyButton>
          <JourneyButton variant="primary" gradientColor="violet">Violet</JourneyButton>
          <JourneyButton variant="primary" gradientColor="amber">Amber</JourneyButton>
          <JourneyButton variant="secondary">Secondary</JourneyButton>
        </div>
      </div>
    </div>
  )
}; 