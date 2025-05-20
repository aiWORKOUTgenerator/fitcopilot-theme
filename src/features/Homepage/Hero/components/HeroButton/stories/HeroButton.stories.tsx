import type { Meta, StoryObj } from '@storybook/react';
import { HeroButton } from '../';

const meta: Meta<typeof HeroButton> = {
  title: 'Features/Homepage/Hero/HeroButton',
  component: HeroButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A specialized button for the homepage hero section with theme support and icon handling. Extends the base Button component with Hero-specific styling.'
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
type Story = StoryObj<typeof HeroButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Start Your Fitness Journey',
    size: 'medium'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Learn More',
    size: 'medium'
  }
};

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Get Started',
    leftIcon: '→',
    size: 'medium'
  }
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Next Steps',
    rightIcon: '→',
    size: 'medium'
  }
};

export const Large: Story = {
  args: {
    variant: 'primary',
    children: 'Join Now',
    size: 'large'
  }
};

export const Small: Story = {
  args: {
    variant: 'primary',
    children: 'Sign Up',
    size: 'small'
  }
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Coming Soon',
    disabled: true,
    size: 'medium'
  }
};

export const AsLink: Story = {
  args: {
    variant: 'primary',
    children: 'Visit Our Blog',
    href: '#',
    size: 'medium'
  }
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Sign Up For Free',
    fullWidth: true,
    size: 'medium'
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
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <HeroButton variant="primary">Primary</HeroButton>
          <HeroButton variant="secondary">Secondary</HeroButton>
        </div>
      </div>
      
      <div>
        <h3>Gym Theme</h3>
        <div data-theme="gym" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <HeroButton variant="primary">Primary</HeroButton>
          <HeroButton variant="secondary">Secondary</HeroButton>
        </div>
      </div>
      
      <div>
        <h3>Sports Theme</h3>
        <div data-theme="sports" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <HeroButton variant="primary">Primary</HeroButton>
          <HeroButton variant="secondary">Secondary</HeroButton>
        </div>
      </div>
      
      <div>
        <h3>Wellness Theme</h3>
        <div data-theme="wellness" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <HeroButton variant="primary">Primary</HeroButton>
          <HeroButton variant="secondary">Secondary</HeroButton>
        </div>
      </div>
    </div>
  )
}; 