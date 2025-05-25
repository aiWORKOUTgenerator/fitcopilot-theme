import type { Meta, StoryObj } from '@storybook/react';
import { Zap } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { HeroButton } from '../../../../features/Homepage/Hero/components/HeroButton';
import { Button } from '../components';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button/Hover Effects',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced hover effects and transitions for buttons'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Button>;

// Effect comparison component
const EffectCompare: React.FC<{
  title: string;
  effect: 'lift' | 'scale' | 'glow' | 'float' | 'none';
  glowColor?: string;
}> = ({ title, effect, glowColor }) => (
  <div style={{ marginBottom: '24px' }}>
    <h3 style={{ marginBottom: '12px' }}>{title}</h3>
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ marginBottom: '8px', fontSize: '14px' }}>Standard Button</p>
        <Button 
          variant="primary" 
          size="medium" 
          hoverEffect={effect}
          glowColor={glowColor}
        >
          {effect.charAt(0).toUpperCase() + effect.slice(1)} Effect
        </Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ marginBottom: '8px', fontSize: '14px' }}>Gradient Button</p>
        <Button 
          variant="primary" 
          size="medium"
          gradient
          shadow
          hoverEffect={effect}
          glowColor={glowColor}
        >
          {effect.charAt(0).toUpperCase() + effect.slice(1)} Effect
        </Button>
      </div>
    </div>
  </div>
);

// Showcase of all hover effects
export const HoverEffects: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Button Hover Effects</h2>
      
      <EffectCompare 
        title="Lift Effect"
        effect="lift"
      />
      
      <EffectCompare 
        title="Scale Effect"
        effect="scale"
      />
      
      <EffectCompare 
        title="Glow Effect"
        effect="glow"
      />
      
      <EffectCompare 
        title="Float Effect"
        effect="float"
      />
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Custom Glow Colors</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            hoverEffect="glow"
            glowColor="rgba(59, 130, 246, 0.5)" // Blue glow
          >
            Blue Glow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            hoverEffect="glow"
            glowColor="rgba(236, 72, 153, 0.5)" // Pink glow
          >
            Pink Glow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            hoverEffect="glow"
            glowColor="rgba(245, 158, 11, 0.5)" // Orange glow
          >
            Orange Glow
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
      <h2 style={{ marginBottom: '24px' }}>Button vs HeroButton Hover Effect Comparison</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Standard Hover</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>Button with Lift Effect</p>
            <Button 
              variant="primary" 
              size="medium" 
              gradient
              shadow
              hoverEffect="lift"
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
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>Button with Effects</p>
            <Button 
              variant="primary" 
              size="medium" 
              gradient
              shadow
              hoverEffect="lift"
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

// Combined effects showcase
export const CombinedEffects: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Combined Button Effects</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>All Effects</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="large" 
            gradient
            shadow
            hoverEffect="lift"
            leftIcon={<Zap size={18} />}
          >
            Gradient + Shadow + Lift
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Custom Glows with Gradient</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            shadow
            hoverEffect="glow"
            glowColor="rgba(59, 130, 246, 0.5)" // Blue glow
          >
            Blue Glow
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient
            shadow
            hoverEffect="glow"
            glowColor="rgba(236, 72, 153, 0.5)" // Pink glow
          >
            Pink Glow
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>By Theme</h3>
        <ThemeProvider initialTheme="gym">
          <div style={{ marginBottom: '16px' }}>
            <Button 
              variant="primary" 
              size="medium" 
              gradient
              shadow
              hoverEffect="lift"
            >
              Gym Theme
            </Button>
          </div>
        </ThemeProvider>
        <ThemeProvider initialTheme="sports">
          <div style={{ marginBottom: '16px' }}>
            <Button 
              variant="primary" 
              size="medium" 
              gradient
              shadow
              hoverEffect="glow"
            >
              Sports Theme
            </Button>
          </div>
        </ThemeProvider>
        <ThemeProvider initialTheme="wellness">
          <div style={{ marginBottom: '16px' }}>
            <Button 
              variant="primary" 
              size="medium" 
              gradient
              shadow
              hoverEffect="float"
            >
              Wellness Theme
            </Button>
          </div>
        </ThemeProvider>
      </div>
    </div>
  )
}; 