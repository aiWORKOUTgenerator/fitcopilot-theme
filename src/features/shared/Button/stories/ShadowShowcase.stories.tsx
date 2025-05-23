import type { Meta, StoryObj } from '@storybook/react';
import { Zap } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { HeroButton } from '../../../../features/Homepage/Hero/components/HeroButton';
import { ThemeOption } from '../../../../utils/theming';
import { Button } from '../components';

const meta: Meta<typeof Button> = {
  title: 'Features/Shared/Button/Shadow Showcase',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced shadow effects for buttons including theme-specific colored shadows'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Button>;

// Comparison component for shadows
const ShadowCompare: React.FC<{
  title: string;
  shadow1?: 'sm' | 'md' | 'lg' | 'default';
  shadow2?: 'sm' | 'md' | 'lg' | 'default';
}> = ({ title, shadow1 = 'default', shadow2 = 'default' }) => (
  <div style={{ marginBottom: '24px' }}>
    <h3 style={{ marginBottom: '12px' }}>{title}</h3>
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ marginBottom: '8px', fontSize: '14px' }}>Standard Button</p>
        <Button 
          variant="primary" 
          size="medium" 
          shadow
          shadowSize={shadow1 !== 'default' ? shadow1 : undefined}
        >
          Shadow {shadow1}
        </Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ marginBottom: '8px', fontSize: '14px' }}>Gradient Button</p>
        <Button 
          variant="primary" 
          size="medium"
          gradient
          shadow
          shadowSize={shadow2 !== 'default' ? shadow2 : undefined}
        >
          Shadow {shadow2}
        </Button>
      </div>
    </div>
  </div>
);

// Showcase of all shadow options
export const ShadowOptions: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Button Shadow Options</h2>
      
      <ShadowCompare 
        title="Default Shadow"
      />
      
      <ShadowCompare 
        title="Small Shadow"
        shadow1="sm"
        shadow2="sm"
      />
      
      <ShadowCompare 
        title="Medium Shadow"
        shadow1="md"
        shadow2="md"
      />
      
      <ShadowCompare 
        title="Large Shadow"
        shadow1="lg"
        shadow2="lg"
      />
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Size Comparison</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="medium" shadow shadowSize="sm">
            Small Shadow
          </Button>
          <Button variant="primary" size="medium" shadow>
            Default Shadow
          </Button>
          <Button variant="primary" size="medium" shadow shadowSize="md">
            Medium Shadow
          </Button>
          <Button variant="primary" size="medium" shadow shadowSize="lg">
            Large Shadow
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Gradient with Shadow Sizes</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="medium" gradient shadow shadowSize="sm">
            Small
          </Button>
          <Button variant="primary" size="medium" gradient shadow>
            Default
          </Button>
          <Button variant="primary" size="medium" gradient shadow shadowSize="md">
            Medium
          </Button>
          <Button variant="primary" size="medium" gradient shadow shadowSize="lg">
            Large
          </Button>
        </div>
      </div>
    </div>
  )
};

// Comparison with Hero button
export const HeroButtonComparison: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Button vs HeroButton Shadow Comparison</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Default</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>Button + Gradient + Shadow</p>
            <Button 
              variant="primary" 
              size="medium" 
              gradient
              shadow
            >
              Get Started
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>HeroButton</p>
            <HeroButton 
              variant="primary" 
              size="medium"
            >
              Get Started
            </HeroButton>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>Button + Gradient + Shadow</p>
            <Button 
              variant="primary" 
              size="medium" 
              gradient
              shadow
              leftIcon={<Zap size={18} />}
            >
              Get Started
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>HeroButton</p>
            <HeroButton 
              variant="primary" 
              size="medium"
              leftIcon={<Zap size={18} />}
            >
              Get Started
            </HeroButton>
          </div>
        </div>
      </div>
    </div>
  )
};

// Theme-specific colored shadows
export const ThemedShadows: Story = {
  render: () => {
    const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness'];
    
    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '24px' }}>Theme-Specific Colored Shadows</h2>
        
        {themes.map(theme => (
          <div key={theme} style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h3>
            <ThemeProvider initialTheme={theme}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <Button 
                  variant="primary" 
                  size="medium" 
                  shadow
                >
                  Standard
                </Button>
                <Button 
                  variant="primary" 
                  size="medium" 
                  gradient 
                  shadow
                >
                  Gradient
                </Button>
                <Button 
                  variant="primary" 
                  size="medium" 
                  gradient 
                  shadow
                  shadowSize="lg"
                >
                  Large Shadow
                </Button>
              </div>
            </ThemeProvider>
          </div>
        ))}
      </div>
    );
  }
}; 