import type { Meta, StoryObj } from '@storybook/react';
import Hero from './Hero';

/**
 * Hero component documentation
 */
const meta: Meta<typeof Hero> = {
  title: 'features/Homepage/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Hero component is the main landing section of the FitCopilot homepage. It includes a title, subtitle, logo, and call-to-action buttons.',
      },
    },
  },
  argTypes: {
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
      description: 'URL for the logo image. If not provided, a text-based logo will be displayed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

/**
 * Default Hero with text logo
 */
export const Default: Story = {
  args: {
    registrationLink: 'https://builder.fitcopilot.ai/register',
    loginLink: 'https://builder.fitcopilot.ai/login',
    logoUrl: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Hero section with text-based logo. This is the standard configuration used on the homepage.',
      },
    },
  },
};

/**
 * Hero with custom image logo
 */
export const WithImageLogo: Story = {
  args: {
    registrationLink: 'https://builder.fitcopilot.ai/register',
    loginLink: 'https://builder.fitcopilot.ai/login',
    logoUrl: 'https://placehold.co/300x60/CCFF00/0B1121.png?text=AI+WORKOUT+GENERATOR'
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero section with an image-based logo instead of the text-based default.',
      },
    },
  },
};

/**
 * Hero with custom links
 */
export const WithCustomLinks: Story = {
  args: {
    registrationLink: '/custom-registration',
    loginLink: '/custom-login',
    logoUrl: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero section with custom registration and login links. This configuration can be used for white-label or custom implementations.',
      },
    },
  },
};
