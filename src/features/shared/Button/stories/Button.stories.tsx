import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components';

const meta: Meta<typeof Button> = {
  title: 'Features/Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text', 'icon', 'link']
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    fullWidth: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
    size: 'medium'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
    size: 'medium'
  }
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Button',
    size: 'medium'
  }
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Full Width Button',
    fullWidth: true
  }
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    children: 'Button with Icons',
    leftIcon: '←',
    rightIcon: '→'
  }
}; 