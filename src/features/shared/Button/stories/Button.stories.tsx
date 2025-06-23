import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, ChevronRight, User, Zap } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { Button } from '../components';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component with support for multiple variants including gradients'
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
    },
    gradient: {
      control: 'boolean',
      description: 'Whether to use gradient background for the button (matches Hero button styling)'
    },
    shadow: {
      control: 'boolean',
      description: 'Whether to apply shadow to the button for depth'
    },
    shadowSize: {
      control: 'select',
      options: ['default', 'sm', 'md', 'lg'],
      description: 'Size of the shadow when shadow is enabled'
    },
    hoverEffect: {
      control: 'select',
      options: ['none', 'lift', 'scale', 'glow', 'float'],
      description: 'Hover effect to apply to the button'
    },
    glowColor: {
      control: 'color',
      description: 'Custom color for glow effect (when hoverEffect is "glow")'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// Helper for rendering buttons with different themes
const ButtonWithThemes: React.FC<any> = (args: any) => {
  const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness'];
  
  return React.createElement(
    'div', 
    { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
    themes.map((theme) => 
      React.createElement(
        'div', 
        { key: theme, style: { marginBottom: '10px' } },
        [
          React.createElement(
            'h3', 
            { style: { marginBottom: '10px' } }, 
            theme.charAt(0).toUpperCase() + theme.slice(1) + ' Theme'
          ),
          React.createElement(
            ThemeProvider, 
            { initialTheme: theme, children: React.createElement(Button, { ...args }) }
          )
        ]
      )
    )
  );
};

// Side-by-side comparison component
const ButtonComparison: React.FC<any> = (args: any) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Regular vs Gradient</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button variant="primary" size="medium">Regular Button</Button>
          <Button variant="primary" size="medium" gradient>Gradient Button</Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button 
            variant="primary" 
            size="medium" 
            leftIcon={<Zap size={18} />}
            gradient
          >
            Get Started
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            rightIcon={<ChevronRight size={18} />}
            gradient
          >
            Learn More
          </Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px' }}>Size Variations</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button 
            variant="primary" 
            size="small" 
            gradient
          >
            Small
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
          >
            Medium
          </Button>
          <Button 
            variant="primary" 
            size="large" 
            gradient
          >
            Large
          </Button>
        </div>
      </div>
    </div>
  );
};

// Shadow comparison component
const ShadowComparison: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Shadow Sizes</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            shadow
            shadowSize="sm"
          >
            Small Shadow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            shadow
          >
            Default Shadow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            shadow
            shadowSize="md"
          >
            Medium Shadow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            shadow
            shadowSize="lg"
          >
            Large Shadow
          </Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px' }}>Gradient with Shadow</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="large" 
            gradient
          >
            No Shadow
          </Button>
          <Button 
            variant="primary" 
            size="large" 
            gradient
            shadow
          >
            With Shadow
          </Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px' }}>Shadow with Icons</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            shadow
            leftIcon={<Zap size={18} />}
          >
            Left Icon
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            shadow
            rightIcon={<ChevronRight size={18} />}
          >
            Right Icon
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            shadow
            gradient
            leftIcon={<Zap size={18} />}
          >
            Gradient Icon
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hover effects comparison component
const HoverEffectsComparison: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Hover Effects</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            hoverEffect="lift"
          >
            Lift Effect
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            hoverEffect="scale"
          >
            Scale Effect
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            hoverEffect="glow"
          >
            Glow Effect
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            hoverEffect="float"
          >
            Float Effect
          </Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px' }}>Gradient with Hover Effects</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            hoverEffect="lift"
          >
            Gradient Lift
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            hoverEffect="scale"
          >
            Gradient Scale
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            hoverEffect="glow"
          >
            Gradient Glow
          </Button>
          <Button 
            variant="primary" 
            size="medium"
            gradient
            hoverEffect="float"
          >
            Gradient Float
          </Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px' }}>Custom Glow Colors</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            hoverEffect="glow"
            glowColor="rgba(59, 130, 246, 0.5)" // Blue glow
          >
            Blue Glow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            hoverEffect="glow"
            glowColor="rgba(236, 72, 153, 0.5)" // Pink glow
          >
            Pink Glow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            hoverEffect="glow"
            glowColor="rgba(245, 158, 11, 0.5)" // Orange glow
          >
            Orange Glow
          </Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px' }}>Combined Effects</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="large" 
            gradient
            shadow
            hoverEffect="lift"
          >
            All Effects
          </Button>
          <Button 
            variant="primary" 
            size="large" 
            gradient
            shadow
            hoverEffect="glow"
            glowColor="rgba(52, 211, 153, 0.6)" // Emerald glow
          >
            Custom Glow
          </Button>
        </div>
      </div>
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
    leftIcon: <ArrowRight size={18} />,
    rightIcon: <ChevronRight size={18} />
  }
};

export const WithGradient: Story = {
  args: {
    variant: 'primary',
    children: 'Gradient Button',
    gradient: true
  },
  parameters: {
    docs: {
      description: {
        story: 'A button with a gradient background matching the Hero style'
      }
    }
  }
};

export const WithShadow: Story = {
  args: {
    variant: 'primary',
    children: 'Shadow Button',
    shadow: true
  },
  parameters: {
    docs: {
      description: {
        story: 'A button with a shadow for depth and emphasis'
      }
    }
  }
};

export const WithHoverEffect: Story = {
  args: {
    variant: 'primary',
    children: 'Hover Effect Button',
    hoverEffect: 'lift'
  },
  parameters: {
    docs: {
      description: {
        story: 'A button with a hover effect that lifts on hover'
      }
    }
  }
};

export const GradientWithShadow: Story = {
  args: {
    variant: 'primary',
    children: 'Gradient Button with Shadow',
    gradient: true,
    shadow: true,
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Combines gradient and shadow effects for a prominent call to action'
      }
    }
  }
};

export const HoverEffects: Story = {
  render: () => <HoverEffectsComparison />,
  parameters: {
    docs: {
      description: {
        story: 'Showcase of different hover effects available for buttons'
      }
    }
  }
};

export const ShadowSizes: Story = {
  render: () => <ShadowComparison />,
  parameters: {
    docs: {
      description: {
        story: 'Shows different shadow sizes and combinations'
      }
    }
  }
};

export const GradientWithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Get a Free Workout',
    leftIcon: <Zap size={20} />,
    gradient: true,
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'A gradient button with an icon, matching the Hero CTA style'
      }
    }
  }
};

export const GradientThemes: Story = {
  render: (_args) => <ButtonWithThemes {..._args} />,
  args: {
    variant: 'primary',
    children: 'Gradient Button',
    gradient: true,
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how gradient buttons look across different themes'
      }
    }
  }
};

export const ShadowThemes: Story = {
  render: (_args) => <ButtonWithThemes {..._args} />,
  args: {
    variant: 'primary',
    children: 'Shadow Button',
    shadow: true,
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how shadow buttons look across different themes'
      }
    }
  }
};

export const HoverEffectThemes: Story = {
  render: (_args) => <ButtonWithThemes {..._args} />,
  args: {
    variant: 'primary',
    children: 'Hover Effect Button',
    hoverEffect: 'lift',
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how hover effects look across different themes'
      }
    }
  }
};

export const GradientComparison: Story = {
  render: () => <ButtonComparison />,
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of regular and gradient buttons in different configurations'
      }
    }
  }
};

export const HeroStyleButton: Story = {
  args: {
    variant: 'primary',
    children: 'Start Free Trial',
    leftIcon: <Zap size={20} />,
    gradient: true,
    shadow: true,
    hoverEffect: 'lift',
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'A complete Hero-style button with all enhancements enabled'
      }
    }
  }
};

export const GradientActions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
      <Button 
        variant="primary" 
        size="large" 
        leftIcon={<Zap size={20} />}
        gradient
        shadow
        hoverEffect="lift"
        fullWidth
      >
        Start Free Trial
      </Button>
      
      <Button 
        variant="primary" 
        size="large" 
        leftIcon={<User size={20} />}
        gradient
        shadow
        hoverEffect="lift"
        fullWidth
      >
        Create Account
      </Button>
      
      <Button 
        variant="primary" 
        size="large" 
        rightIcon={<ArrowRight size={20} />}
        gradient
        shadow
        hoverEffect="lift"
        fullWidth
      >
        Continue to Checkout
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common call-to-action buttons using the gradient style with shadows and hover effects'
      }
    }
  }
}; 