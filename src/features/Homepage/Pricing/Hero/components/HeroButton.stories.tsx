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
    leftIcon: {
      control: 'select',
      options: ['play', 'arrow', 'none'],
      mapping: {
        play: <FaPlay />,
        arrow: <FaArrowRight />,
        none: undefined
      },
      description: 'Icon to display on the left side of the button text',
    },
    rightIcon: {
      control: 'select',
      options: ['play', 'arrow', 'none'],
      mapping: {
        play: <FaPlay />,
        arrow: <FaArrowRight />,
        none: undefined
      },
      description: 'Icon to display on the right side of the button text',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
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
    leftIcon: undefined,
    rightIcon: undefined,
    size: 'large',
    fullWidth: false
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
    leftIcon: undefined,
    rightIcon: undefined,
    size: 'large',
    fullWidth: false
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
 * Button with left icon example
 */
export const WithLeftIcon: Story = {
  args: {
    href: '#watch-demo',
    children: 'Watch Demo',
    variant: 'primary',
    leftIcon: <FaPlay />,
    size: 'large',
    fullWidth: false
  },
  parameters: {
    docs: {
      description: {
        story: 'HeroButton with an icon displayed to the left of the text.',
      },
    },
  },
};

/**
 * Button with right icon example
 */
export const WithRightIcon: Story = {
  args: {
    href: '#learn-more',
    children: 'Learn More',
    variant: 'secondary',
    rightIcon: <FaArrowRight />,
    size: 'large',
    fullWidth: false
  },
  parameters: {
    docs: {
      description: {
        story: 'HeroButton with an icon displayed to the right of the text.',
      },
    },
  },
};

/**
 * Small button example
 */
export const Small: Story = {
  args: {
    href: '#sign-in',
    children: 'Sign In',
    variant: 'secondary',
    leftIcon: undefined,
    size: 'small',
    fullWidth: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Small sized HeroButton, useful for secondary actions like sign-in.',
      },
    },
  },
};
