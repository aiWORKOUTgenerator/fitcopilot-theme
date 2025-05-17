/**
 * ThemeButtonTest Component
 * Visual testing component for button theme variants
 */
import React, { useState } from 'react';
import { Button, ButtonGroup } from '../../../../features/shared/Button';
import { HeroButton } from './HeroButton';

/**
 * Available theme variants for testing
 */
const themes = ['default', 'gym', 'sports', 'wellness'];

/**
 * Theme button testing component to visualize buttons across different themes
 */
export const ThemeButtonTest: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('default');
  
  return (
    <div data-theme={currentTheme} className="theme-test-container">
      <div className="theme-selector">
        <h2>Theme Selector</h2>
        <ButtonGroup direction="horizontal" spacing="small">
          {themes.map(theme => (
            <Button 
              key={theme}
              variant={theme === currentTheme ? 'primary' : 'secondary'}
              onClick={() => setCurrentTheme(theme)}
            >
              {theme}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      
      <div className="section">
        <h2>Standard Buttons</h2>
        <ButtonGroup direction="horizontal" spacing="medium">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="link" href="#">Link</Button>
        </ButtonGroup>
      </div>
      
      <div className="section">
        <h2>Hero Buttons</h2>
        <ButtonGroup direction="horizontal" spacing="medium">
          <HeroButton variant="primary">Primary Hero</HeroButton>
          <HeroButton variant="secondary">Secondary Hero</HeroButton>
          <HeroButton variant="primary" leftIcon={<span>←</span>}>With Left Icon</HeroButton>
          <HeroButton variant="primary" rightIcon={<span>→</span>}>With Right Icon</HeroButton>
        </ButtonGroup>
      </div>
      
      <div className="section">
        <h2>Button Sizes</h2>
        <ButtonGroup direction="horizontal" spacing="medium" alignment="center">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </ButtonGroup>
      </div>
      
      <div className="section">
        <h2>Hero Button Sizes</h2>
        <ButtonGroup direction="horizontal" spacing="medium" alignment="center">
          <HeroButton variant="primary" size="small">Small</HeroButton>
          <HeroButton variant="primary" size="medium">Medium</HeroButton>
          <HeroButton variant="primary" size="large">Large</HeroButton>
        </ButtonGroup>
      </div>
      
      <div className="section">
        <h2>Disabled State</h2>
        <ButtonGroup direction="horizontal" spacing="medium">
          <Button variant="primary" disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
          <HeroButton variant="primary" disabled>Disabled Hero</HeroButton>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default ThemeButtonTest; 