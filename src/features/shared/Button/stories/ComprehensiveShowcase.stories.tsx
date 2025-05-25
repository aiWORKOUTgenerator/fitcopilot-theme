import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight, Zap } from 'lucide-react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { HeroButton } from '../../../../features/Homepage/Hero/components/HeroButton';
import { ThemeOption } from '../../../../utils/theming';
import { Button } from '../components';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button/Comprehensive Showcase',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive showcase of the Button component with all enhancements: gradient backgrounds, optimized shadows, and hover effects'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Button>;

// Complete Hero-style button comparison
export const HeroStyleButton: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Hero-Style Button Comparison</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Button with All Enhancements vs HeroButton</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>Enhanced Button</p>
            <Button 
              variant="primary" 
              size="large" 
              gradient
              shadow
              shadowSize="md"
              hoverEffect="lift"
              leftIcon={<Zap size={20} />}
            >
              Start Your Journey
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>HeroButton</p>
            <HeroButton 
              variant="primary" 
              size="large"
              leftIcon={<Zap size={20} />}
            >
              Start Your Journey
            </HeroButton>
          </div>
        </div>
      </div>
    </div>
  )
};

// Component to display how the enhanced button looks across all themes
export const ThemeShowcase: Story = {
  render: () => {
    const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness'];
    
    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '24px' }}>Enhanced Button Across Themes</h2>
        
        {themes.map(theme => (
          <div key={theme} style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h3>
            <ThemeProvider initialTheme={theme}>
              <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Button 
                    variant="primary" 
                    size="large" 
                    gradient
                    shadow
                    hoverEffect="lift"
                    leftIcon={<Zap size={20} />}
                  >
                    Primary Button
                  </Button>
                  
                  <HeroButton 
                    variant="primary" 
                    size="large"
                    leftIcon={<Zap size={20} />}
                  >
                    Hero Button
                  </HeroButton>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Button 
                    variant="secondary" 
                    size="large" 
                    leftIcon={<ChevronRight size={20} />}
                  >
                    Secondary Button
                  </Button>
                  
                  <HeroButton 
                    variant="secondary" 
                    size="large"
                    leftIcon={<ChevronRight size={20} />}
                  >
                    Hero Secondary
                  </HeroButton>
                </div>
              </div>
            </ThemeProvider>
          </div>
        ))}
      </div>
    );
  }
};

// Comprehensive display of all features
export const AllFeatures: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '24px' }}>Complete Feature Showcase</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Gradient Backgrounds</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="medium">Default Button</Button>
          <Button variant="primary" size="medium" gradient>Gradient Button</Button>
          <Button variant="primary" size="medium" gradient shadow>With Shadow</Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Optimized Shadows</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="medium" gradient shadow shadowSize="sm">Small Shadow</Button>
          <Button variant="primary" size="medium" gradient shadow>Default Shadow</Button>
          <Button variant="primary" size="medium" gradient shadow shadowSize="lg">Large Shadow</Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Hover Effects</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="medium" gradient shadow hoverEffect="lift">Lift Effect</Button>
          <Button variant="primary" size="medium" gradient shadow hoverEffect="scale">Scale Effect</Button>
          <Button variant="primary" size="medium" gradient shadow hoverEffect="glow">Glow Effect</Button>
          <Button variant="primary" size="medium" gradient shadow hoverEffect="float">Float Effect</Button>
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
            hoverEffect="lift"
            leftIcon={<Zap size={18} />}
          >
            Left Icon
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient 
            shadow 
            hoverEffect="lift"
            rightIcon={<ChevronRight size={18} />}
          >
            Right Icon
          </Button>
          <Button 
            variant="primary" 
            size="medium" 
            gradient 
            shadow 
            hoverEffect="lift"
            leftIcon={<Zap size={18} />}
            rightIcon={<ChevronRight size={18} />}
          >
            Both Icons
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Custom Glow Colors</h3>
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
          <Button 
            variant="primary" 
            size="medium" 
            gradient 
            shadow 
            hoverEffect="glow"
            glowColor="rgba(245, 158, 11, 0.5)" // Orange glow
          >
            Orange Glow
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Complete Hero-Style Button</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="large" 
            gradient 
            shadow 
            hoverEffect="lift"
            leftIcon={<Zap size={20} />}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  )
}; 