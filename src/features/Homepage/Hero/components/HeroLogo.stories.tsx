import type { Meta, StoryObj } from '@storybook/react';
import { HeroLogo } from './HeroLogo';

/**
 * HeroLogo component documentation
 */
const meta: Meta<typeof HeroLogo> = {
  title: 'features/Homepage/Hero/components/HeroLogo',
  component: HeroLogo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'HeroLogo component for the FitCopilot application. Displays the application logo in the hero section, with options for either a text-based logo or an image.',
      },
    },
  },
  argTypes: {
    logoUrl: {
      control: 'text',
      description: 'URL for the logo image. If not provided, a text-based logo will be displayed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroLogo>;

/**
 * Default state of the HeroLogo component - text-based logo
 */
export const TextBased: Story = {
  args: {
    logoUrl: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Text-based logo displayed when no image URL is provided.',
      },
    },
  },
};

/**
 * Image variant of the HeroLogo
 */
export const WithImage: Story = {
  args: {
    logoUrl: 'https://placehold.co/300x60/CCFF00/0B1121.png?text=AI+WORKOUT+GENERATOR',
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo displayed as an image when a URL is provided.',
      },
    },
  },
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
        story: 'An edge case for the HeroLogo component (e.g., empty state, error state).',
      },
    },
  },
};
