import type { Meta, StoryObj } from '@storybook/react';
import { FaArrowRight, FaPlay } from 'react-icons/fa';
import { HeroButton } from './HeroButton';

/**
 * HeroButton component documentation
 */
const meta: Meta<typeof HeroButton> = {
  title: 'features/Homepage/Hero/components/HeroButton',
  component: HeroButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'HeroButton component for the FitCopilot application. A specialized button used in the hero section of the homepage with primary and secondary styling variants.',
      },
    },
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'URL for the button link',
    },
    children: {
      control: 'text',
      description: 'Content to display inside the button',
    },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description: 'Visual style variant of the button',
    },
    icon: {
      control: 'select',
      options: ['play', 'arrow', 'none'],
      mapping: {
        play: <FaPlay />,
        arrow: <FaArrowRight />,
        none: undefined
      },
      description: 'Icon to display alongside the button text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroButton>;

/**
 * Primary variant of the HeroButton component
 */
export const Primary: Story = {
  args: {
    href: '#start',
    children: 'Get Started',
    variant: 'primary',
    icon: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary variant of the HeroButton with high-contrast, action-oriented styling.',
      },
    },
  },
};

/**
 * Secondary variant of the HeroButton
 */
export const Secondary: Story = {
  args: {
    href: '#learn-more',
    children: 'Learn More',
    variant: 'secondary',
    icon: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary variant of the HeroButton with a more subtle, complementary styling.',
      },
    },
  },
};

/**
 * Button with icon example
 */
export const WithIcon: Story = {
  args: {
    href: '#watch-demo',
    children: 'Watch Demo',
    variant: 'primary',
    icon: <FaPlay />
  },
  parameters: {
    docs: {
      description: {
        story: 'HeroButton with an icon displayed alongside the text.',
      },
    },
  },
};
