import type { Meta, StoryObj } from '@storybook/react';
import { JourneyStep } from './JourneyStep';

/**
 * JourneyStep component documentation
 */
const meta: Meta<typeof JourneyStep> = {
  title: 'features/Homepage/Journey/components/JourneyStep',
  component: JourneyStep,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component: 'The JourneyStep component displays an individual step in the user journey process. Each step includes a numbered circle, a title, and a description.'
      }
    }
  },
  argTypes: {
    number: {
      control: { type: 'number' },
      description: 'The step number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' }
      }
    },
    title: {
      control: 'text',
      description: 'The step title',
      table: {
        type: { summary: 'string' },
      }
    },
    description: {
      control: 'text',
      description: 'The step description',
      table: {
        type: { summary: 'string' },
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof JourneyStep>;

/**
 * Default state of the JourneyStep component
 */
export const Default: Story = {
  args: {
    number: 1,
    title: 'Create Your Profile',
    description: 'Answer a few questions about your fitness level, goals, and available equipment.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Default display of a journey step with number, title, and description.'
      }
    }
  }
};

/**
 * Variant example for the JourneyStep component
 */
export const SecondStep: Story = {
  args: {
    number: 2,
    title: 'Generate Your Workout',
    description: 'Our AI creates a personalized workout plan tailored to your specific needs and preferences.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Second step in the journey process.'
      }
    }
  }
};

/**
 * Edge case example (e.g., empty state, error state)
 */
export const ThirdStep: Story = {
  args: {
    number: 3,
    title: 'Start Training',
    description: 'Follow your custom plan with detailed instructions, videos, and progress tracking.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Third step in the journey process.'
      }
    }
  }
};
