import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from '../';

const meta: Meta<typeof FormField> = {
  title: 'Features/Shared/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A form field component for handling user input with validation support.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name (used for form state)',
    },
    label: {
      control: 'text',
      description: 'Field label',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'textarea'],
      description: 'Input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
  }
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Text: Story = {
  args: {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter your first name',
    required: true
  }
};

export const Email: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    required: true
  }
};

export const WithError: Story = {
  args: {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    error: 'Password must be at least 8 characters'
  }
};

export const Disabled: Story = {
  args: {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Username is locked',
    disabled: true,
    value: 'johndoe'
  }
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div data-theme="personal-training" style={{ width: '250px' }}>
        <FormField
          name="ptField"
          label="Personal Training"
          type="text"
          placeholder="Personal Training Field"
        />
      </div>
      <div data-theme="group-fitness" style={{ width: '250px' }}>
        <FormField
          name="gfField"
          label="Group Fitness"
          type="text"
          placeholder="Group Fitness Field"
        />
      </div>
    </div>
  )
}; 