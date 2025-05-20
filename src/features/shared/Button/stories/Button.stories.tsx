import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { Button } from '../components';

/**
 * Button component stories
 * 
 * This file follows the standard story pattern defined in:
 * docs/templates/ComponentStory.template.tsx
 */

const meta: Meta<typeof Button> = {
  title: 'Features/Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component with support for multiple themes and variants'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text', 'icon', 'link'],
      description: 'Button variant that determines visual style'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width of its container'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// Helper for rendering buttons with different themes
const ButtonWithThemes = (args: any) => {
  const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness', 'nutrition'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {themes.map((theme) => (
        <div key={theme} style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h3>
          <ThemeProvider initialTheme={theme}>
            <Button {...args} />
          </ThemeProvider>
        </div>
      ))}
    </div>
  );
};

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

// Demo all themes in one view
export const ThemeShowcase: Story = {
  render: (args) => <ButtonWithThemes {...args} />,
  args: {
    variant: 'primary',
    children: 'Themed Button',
    size: 'medium'
  }
}; 