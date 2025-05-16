import { Meta, StoryObj } from '@storybook/react';
import { Hero } from './index';

/**
 * Hero component documentation
 */
const meta: Meta<typeof Hero> = {
  title: 'Features/Homepage/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'gym'],
      description: 'The visual style variant of the Hero component',
    },
    registrationLink: {
      control: 'text',
      description: 'URL for the registration button',
    },
    loginLink: {
      control: 'text',
      description: 'URL for the login link',
    },
    logoUrl: {
      control: 'text',
      description: 'URL for the logo image',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

/**
 * Default variant of the Hero component
 */
export const Default: Story = {
  args: {
    variant: 'default',
    registrationLink: 'https://example.com/register',
    loginLink: 'https://example.com/login',
    logoUrl: 'http://fitcopilot-theme.local/wp-content/uploads/2025/05/AI-Workout-Generater-TransparentBG-400x516-1.png',
  },
};

/**
 * Gym-specific variant of the Hero component
 */
export const Gym: Story = {
  args: {
    variant: 'gym',
    registrationLink: 'https://example.com/register',
    loginLink: 'https://example.com/login',
    logoUrl: 'http://fitcopilot-theme.local/wp-content/uploads/2025/05/AI-Workout-Generater-TransparentBG-400x516-1.png',
  },
};

/**
 * Side-by-side comparison of both variants
 */
export const VariantComparison: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: 1000,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ padding: '1rem', background: '#333', color: 'white', textAlign: 'center' }}>
          Default Variant
        </h2>
        <Hero {...args} variant="default" />
      </div>

      <div>
        <h2 style={{ padding: '1rem', background: '#333', color: 'white', textAlign: 'center' }}>
          Gym Variant
        </h2>
        <Hero {...args} variant="gym" />
      </div>
    </div>
  ),
};
