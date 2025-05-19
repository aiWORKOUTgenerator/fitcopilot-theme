import { Button } from '@features/shared/Button';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text', 'icon', 'link'],
      description: 'The visual style variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false }
      }
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false }
      }
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when the button is clicked',
      table: {
        type: { summary: '() => void' }
      }
    },
    leftIcon: {
      control: 'object',
      description: 'Icon to display on the left side of the button',
      table: {
        type: { summary: 'ReactNode' }
      }
    },
    rightIcon: {
      control: 'object',
      description: 'Icon to display on the right side of the button',
      table: {
        type: { summary: 'ReactNode' }
      }
    },
    href: {
      control: 'text',
      description: 'URL to navigate to (renders as anchor)',
      table: {
        type: { summary: 'string' }
      }
    }
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component that supports multiple variants, sizes, and states. Used throughout the FitCopilot application for consistent user interactions.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/your-design-file'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    size: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'The primary button style, used for main calls-to-action.'
      }
    }
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    size: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'The secondary button style, used for alternative actions.'
      }
    }
  }
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
    size: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'The text button style, used for less prominent actions.'
      }
    }
  }
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
    href: '#',
    size: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'The link button style, used for navigation actions.'
      }
    }
  }
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button'
  }
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button'
  }
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true
  }
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Full Width Button',
    fullWidth: true
  },
  parameters: {
    layout: 'padded'
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

// Theme variants
export const PersonalTraining: Story = {
  args: {
    variant: 'primary',
    children: 'Personal Training Button'
  },
  parameters: {
    themes: {
      defaultTheme: 'personal-training'
    }
  }
};

export const GroupFitness: Story = {
  args: {
    variant: 'primary',
    children: 'Group Fitness Button'
  },
  parameters: {
    themes: {
      defaultTheme: 'group-fitness'
    }
  }
}; 