import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';
import { HeroButton } from '../../../Homepage/Hero/components/HeroButton';
import { Button } from '../components';

const meta: Meta<typeof Button> = {
  title: 'Features/Shared/Button/Gradient Showcase',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced gradient buttons that match the HeroButton styling'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Button>;

// Helper for displaying compare buttons side by side
const CompareButtons: React.FC<{
  title: string,
  buttonProps?: any,
  heroButtonProps?: any,
  leftIcon?: boolean,
  rightIcon?: boolean
}> = ({ 
  title, 
  buttonProps = {}, 
  heroButtonProps = {}, 
  leftIcon = false,
  rightIcon = false 
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '12px' }}>{title}</h3>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>Standard Button</p>
          <Button 
            variant="primary" 
            size="medium" 
            gradient 
            shadow
            leftIcon={leftIcon ? <Zap size={18} /> : undefined}
            rightIcon={rightIcon ? <ChevronRight size={18} /> : undefined}
            {...buttonProps}
          >
            {buttonProps.children || 'Button'}
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>HeroButton</p>
          <HeroButton 
            variant="primary" 
            size="medium"
            leftIcon={leftIcon ? <Zap size={18} /> : undefined}
            rightIcon={rightIcon ? <ChevronRight size={18} /> : undefined}
            {...heroButtonProps}
          >
            {heroButtonProps.children || 'HeroButton'}
          </HeroButton>
        </div>
      </div>
    </div>
  );
};

// Comparison of all gradient button styling vs HeroButton
export const GradientComparison: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Button vs HeroButton Comparison</h2>
      
      <CompareButtons 
        title="Default" 
        buttonProps={{ children: 'Gradient Button' }}
        heroButtonProps={{ children: 'Hero Button' }}
      />
      
      <CompareButtons 
        title="With Left Icon" 
        leftIcon={true}
        buttonProps={{ children: 'Get Started' }}
        heroButtonProps={{ children: 'Get Started' }}
      />
      
      <CompareButtons 
        title="With Right Icon" 
        rightIcon={true}
        buttonProps={{ children: 'Learn More' }}
        heroButtonProps={{ children: 'Learn More' }}
      />
      
      <CompareButtons 
        title="Size: Small" 
        buttonProps={{ size: 'small', children: 'Small Button' }}
        heroButtonProps={{ size: 'small', children: 'Small Button' }}
      />
      
      <CompareButtons 
        title="Size: Large" 
        buttonProps={{ size: 'large', children: 'Large Button' }}
        heroButtonProps={{ size: 'large', children: 'Large Button' }}
      />
      
      <CompareButtons 
        title="Secondary Variant" 
        buttonProps={{ variant: 'secondary', gradient: false, children: 'Secondary Button' }}
        heroButtonProps={{ variant: 'secondary', children: 'Secondary Button' }}
      />
    </div>
  )
};

// Theme Variants
export const ThemeVariants: Story = {
  render: () => {
    const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness'];
    
    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '24px' }}>Gradient Buttons Across Themes</h2>
        
        {themes.map(theme => (
          <div key={theme} style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h3>
            <ThemeProvider initialTheme={theme}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <Button variant="primary" size="medium" gradient shadow>
                  Gradient Button
                </Button>
                <HeroButton variant="primary" size="medium">
                  Hero Button
                </HeroButton>
              </div>
            </ThemeProvider>
          </div>
        ))}
      </div>
    );
  }
};

// Complete Showcase with all gradient button combinations
export const GradientButtonShowcase: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Gradient Button Showcase</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Size Variations</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="small" gradient shadow>
            Small
          </Button>
          <Button variant="primary" size="medium" gradient shadow>
            Medium
          </Button>
          <Button variant="primary" size="large" gradient shadow>
            Large
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            gradient 
            shadow
            leftIcon={<Zap size={18} />}
          >
            Left Icon
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient 
            shadow
            rightIcon={<ChevronRight size={18} />}
          >
            Right Icon
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient 
            shadow
            leftIcon={<Zap size={18} />}
            rightIcon={<ChevronRight size={18} />}
          >
            Both Icons
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Shadow Options</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="medium" gradient>
            No Shadow
          </Button>
          <Button variant="primary" size="medium" gradient shadow>
            Default Shadow
          </Button>
          <Button variant="primary" size="medium" gradient shadow shadowSize="lg">
            Large Shadow
          </Button>
        </div>
      </div>
    </div>
  )
};

export const ThemeComparison: Story = {
  render: () => <ButtonComparisonWithThemes />,
  parameters: {
    docs: {
      description: {
        story: 'Compares the Button with gradient prop to the HeroButton component across all themes'
      }
    }
  }
};

export const SideBySideComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Primary Buttons</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + gradient</h4>
            <Button variant="primary" size="large" gradient>Primary Button</Button>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <HeroButton variant="primary" size="large">Primary HeroButton</HeroButton>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>With Icons</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + gradient</h4>
            <Button 
              variant="primary" 
              size="large" 
              leftIcon={<Zap size={20} />}
              gradient
            >
              Get Started
            </Button>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <HeroButton 
              variant="primary"
              size="large"
              leftIcon={<Zap size={20} />}
            >
              Get Started
            </HeroButton>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Size Comparison</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + gradient sizes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button variant="primary" size="small" gradient>Small</Button>
              <Button variant="primary" size="medium" gradient>Medium</Button>
              <Button variant="primary" size="large" gradient>Large</Button>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton sizes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <HeroButton variant="primary" size="small">Small</HeroButton>
              <HeroButton variant="primary" size="medium">Medium</HeroButton>
              <HeroButton variant="primary" size="large">Large</HeroButton>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Secondary Comparison</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button secondary</h4>
            <Button variant="secondary" size="large">Secondary Button</Button>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton secondary</h4>
            <HeroButton variant="secondary" size="large">Secondary HeroButton</HeroButton>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Compares different variants and sizes between Button with gradient and HeroButton'
      }
    }
  }
};

export const FullWidthComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '500px' }}>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + gradient + fullWidth</h4>
        <Button 
          variant="primary" 
          size="large" 
          leftIcon={<ArrowRight size={20} />} 
          rightIcon={<ChevronRight size={20} />}
          gradient
          fullWidth
        >
          Full Width Button
        </Button>
      </div>
      
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton + fullWidth</h4>
        <HeroButton 
          variant="primary" 
          size="large" 
          leftIcon={<ArrowRight size={20} />}
          rightIcon={<ChevronRight size={20} />}
          fullWidth
        >
          Full Width HeroButton
        </HeroButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares full width buttons between Button with gradient and HeroButton'
      }
    }
  }
};

export const ShadowComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Shadow Effects</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + gradient + shadow</h4>
            <Button variant="primary" size="large" gradient shadow>Primary Button</Button>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <HeroButton variant="primary" size="large">Primary HeroButton</HeroButton>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Shadow with Icons</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + gradient + shadow</h4>
            <Button 
              variant="primary" 
              size="large" 
              leftIcon={<Zap size={20} />}
              gradient
              shadow
            >
              Get Started
            </Button>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <HeroButton 
              variant="primary"
              size="large"
              leftIcon={<Zap size={20} />}
            >
              Get Started
            </HeroButton>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Shadow Sizes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button shadow sizes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button variant="primary" size="medium" shadow shadowSize="sm">Small Shadow</Button>
              <Button variant="primary" size="medium" shadow>Default Shadow</Button>
              <Button variant="primary" size="medium" shadow shadowSize="lg">Large Shadow</Button>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + gradient + shadow</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button variant="primary" size="medium" gradient shadow shadowSize="sm">Small Shadow</Button>
              <Button variant="primary" size="medium" gradient shadow>Default Shadow</Button>
              <Button variant="primary" size="medium" gradient shadow shadowSize="lg">Large Shadow</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares shadow effects between Button with gradient and HeroButton'
      }
    }
  }
};

export const HoverEffectsComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Hover Effect Comparison</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button + lift effect</h4>
            <Button 
              variant="primary" 
              size="large" 
              gradient
              shadow
              hoverEffect="lift"
            >
              Button with Lift
            </Button>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <HeroButton variant="primary" size="large">HeroButton</HeroButton>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Different Hover Effects</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button hover effects</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button variant="primary" size="medium" gradient shadow hoverEffect="lift">Lift Effect</Button>
              <Button variant="primary" size="medium" gradient shadow hoverEffect="scale">Scale Effect</Button>
              <Button variant="primary" size="medium" gradient shadow hoverEffect="glow">Glow Effect</Button>
              <Button variant="primary" size="medium" gradient shadow hoverEffect="float">Float Effect</Button>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
              <HeroButton variant="primary" size="medium">HeroButton</HeroButton>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Custom Glow Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button with glow effects</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button variant="primary" size="medium" gradient hoverEffect="glow" glowColor="rgba(59, 130, 246, 0.5)">Blue Glow</Button>
              <Button variant="primary" size="medium" gradient hoverEffect="glow" glowColor="rgba(236, 72, 153, 0.5)">Pink Glow</Button>
              <Button variant="primary" size="medium" gradient hoverEffect="glow" glowColor="rgba(245, 158, 11, 0.5)">Orange Glow</Button>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <HeroButton variant="primary" size="medium">HeroButton</HeroButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares hover effects between Button with gradient and HeroButton'
      }
    }
  }
};

export const CompleteHeroStyleComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Complete Hero-Style Button</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Button with all effects</h4>
            <Button 
              variant="primary" 
              size="large" 
              leftIcon={<Zap size={20} />}
              gradient
              shadow
              hoverEffect="lift"
            >
              Get Started
            </Button>
          </div>
          <div>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>HeroButton</h4>
            <HeroButton 
              variant="primary"
              size="large"
              leftIcon={<Zap size={20} />}
            >
              Get Started
            </HeroButton>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of Button with all hero-like effects to the actual HeroButton'
      }
    }
  }
};

// Helper for rendering buttons with different themes
const ButtonComparisonWithThemes: React.FC = () => {
  const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {themes.map((theme) => (
        <ThemeProvider key={theme} initialTheme={theme}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '24px', 
              alignItems: 'center' 
            }}>
              <div>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>
                  Button + gradient
                </h4>
                <Button 
                  variant="primary"
                  size="large"
                  leftIcon={<Zap size={20} />}
                  gradient
                >
                  Get Started
                </Button>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>
                  HeroButton
                </h4>
                <HeroButton 
                  variant="primary"
                  size="large"
                  leftIcon={<Zap size={20} />}
                >
                  Get Started
                </HeroButton>
              </div>
            </div>
          </div>
        </ThemeProvider>
      ))}
    </div>
  );
}; 