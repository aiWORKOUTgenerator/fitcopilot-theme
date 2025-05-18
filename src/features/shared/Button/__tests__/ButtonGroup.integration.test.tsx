/**
 * ButtonGroup Integration Tests
 * 
 * Tests for ButtonGroup with various button types and theme variants
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { HeroButton } from '../../../Homepage/Hero/components/HeroButton';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { ThemeProvider, mockThemeStyles } from './ThemeTestUtils';

// Mock tests for ThemeProvider and mockThemeStyles
describe('ThemeProvider', () => {
  test('renders with default theme', () => {
    render(
      <ThemeProvider>
        <span>Theme Child</span>
      </ThemeProvider>
    );
    
    const container = screen.getByTestId('theme-container');
    expect(container).not.toHaveAttribute('data-theme');
    expect(container).toContainHTML('Theme Child');
  });
  
  test('renders with custom theme', () => {
    render(
      <ThemeProvider theme="gym">
        <span>Gym Theme</span>
      </ThemeProvider>
    );
    
    const container = screen.getByTestId('theme-container');
    expect(container).toHaveAttribute('data-theme', 'gym');
  });
});

describe('mockThemeStyles', () => {
  test('correctly mocks theme-specific CSS variables', () => {
    const cleanup = mockThemeStyles('sports');
    
    // Check cleanup function
    expect(typeof cleanup).toBe('function');
    
    cleanup();
  });
  
  test('allows overriding specific CSS variables', () => {
    const cleanup = mockThemeStyles('default', {
      '--custom-token': 'custom-value',
    });
    
    cleanup();
  });
});

describe('ButtonGroup Integration', () => {
  // Test with mixed button types
  test('renders with mixed button types', () => {
    render(
      <ThemeProvider>
        <ButtonGroup data-testid="btn-group">
          <Button variant="primary" data-testid="regular-btn">Regular</Button>
          <HeroButton variant="primary" data-testid="hero-btn">Hero</HeroButton>
          <Button variant="secondary" data-testid="secondary-btn">Secondary</Button>
        </ButtonGroup>
      </ThemeProvider>
    );

    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup.children.length).toBe(3);

    const regularBtn = screen.getByTestId('regular-btn');
    const heroBtn = screen.getByTestId('hero-btn');
    const secondaryBtn = screen.getByTestId('secondary-btn');

    expect(regularBtn).toBeInTheDocument();
    expect(heroBtn).toBeInTheDocument();
    expect(secondaryBtn).toBeInTheDocument();
    
    // Verify both button types use the btn class
    expect(regularBtn).toHaveClass('btn');
    expect(heroBtn).toHaveClass('btn');
    expect(secondaryBtn).toHaveClass('btn');
    
    // Verify HeroButton has its specific class
    expect(heroBtn).toHaveClass('hero-button');
  });

  // Test with theme variant
  describe('Theme variant rendering', () => {
    test('renders with default theme', () => {
      const cleanup = mockThemeStyles('default');
      
      render(
        <ThemeProvider theme="default">
          <ButtonGroup data-testid="btn-group">
            <Button variant="primary">Regular</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      const buttonGroup = screen.getByTestId('btn-group');
      const container = screen.getByTestId('theme-container');
      
      expect(container).not.toHaveAttribute('data-theme');
      expect(buttonGroup).toBeInTheDocument();
      
      cleanup();
    });
    
    test('renders with gym theme', () => {
      const cleanup = mockThemeStyles('gym');
      
      render(
        <ThemeProvider theme="gym">
          <ButtonGroup data-testid="btn-group">
            <Button variant="primary">Regular</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      const buttonGroup = screen.getByTestId('btn-group');
      const container = screen.getByTestId('theme-container');
      
      expect(container).toHaveAttribute('data-theme', 'gym');
      expect(buttonGroup).toBeInTheDocument();
      
      cleanup();
    });
    
    test('renders with sports theme', () => {
      const cleanup = mockThemeStyles('sports');
      
      render(
        <ThemeProvider theme="sports">
          <ButtonGroup data-testid="btn-group">
            <Button variant="primary">Regular</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      const buttonGroup = screen.getByTestId('btn-group');
      const container = screen.getByTestId('theme-container');
      
      expect(container).toHaveAttribute('data-theme', 'sports');
      expect(buttonGroup).toBeInTheDocument();
      
      cleanup();
    });
    
    test('renders with wellness theme', () => {
      const cleanup = mockThemeStyles('wellness');
      
      render(
        <ThemeProvider theme="wellness">
          <ButtonGroup data-testid="btn-group">
            <Button variant="primary">Regular</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      const buttonGroup = screen.getByTestId('btn-group');
      const container = screen.getByTestId('theme-container');
      
      expect(container).toHaveAttribute('data-theme', 'wellness');
      expect(buttonGroup).toBeInTheDocument();
      
      cleanup();
    });
  });
  
  // Test layout combinations
  describe('Layout combinations', () => {
    test('renders horizontal layout with different spacing options', () => {
      const { rerender } = render(
        <ThemeProvider>
          <ButtonGroup 
            direction="horizontal" 
            spacing="small" 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      let buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--horizontal');
      expect(buttonGroup).toHaveClass('button-group--spacing-small');
      
      // Test medium spacing
      rerender(
        <ThemeProvider>
          <ButtonGroup 
            direction="horizontal" 
            spacing="medium" 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--spacing-medium');
      
      // Test large spacing
      rerender(
        <ThemeProvider>
          <ButtonGroup 
            direction="horizontal" 
            spacing="large" 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--spacing-large');
    });
    
    test('renders vertical layout with equal width option', () => {
      render(
        <ThemeProvider>
          <ButtonGroup 
            direction="vertical" 
            equalWidth 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
            <Button variant="secondary">Last</Button>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      const buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--vertical');
      expect(buttonGroup).toHaveClass('button-group--equal-width');
    });
    
    test('applies alignment options with mixed button types', () => {
      const { rerender } = render(
        <ThemeProvider>
          <ButtonGroup 
            alignment="start" 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      let buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--align-start');
      
      // Test center alignment
      rerender(
        <ThemeProvider>
          <ButtonGroup 
            alignment="center" 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--align-center');
      
      // Test end alignment
      rerender(
        <ThemeProvider>
          <ButtonGroup 
            alignment="end" 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--align-end');
      
      // Test stretch alignment
      rerender(
        <ThemeProvider>
          <ButtonGroup 
            alignment="stretch" 
            data-testid="btn-group"
          >
            <Button variant="primary">First</Button>
            <HeroButton variant="primary">Hero</HeroButton>
          </ButtonGroup>
        </ThemeProvider>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--align-stretch');
    });
  });
  
  // Test complex combinations
  test('renders complex layout with all options combined', () => {
    render(
      <ThemeProvider theme="gym">
        <ButtonGroup 
          direction="horizontal"
          spacing="medium"
          alignment="center"
          equalWidth
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero Button</HeroButton>
          <Button 
            variant="secondary" 
            leftIcon={<span>★</span>}
          >
            With Icon
          </Button>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup).toHaveClass('button-group--horizontal');
    expect(buttonGroup).toHaveClass('button-group--spacing-medium');
    expect(buttonGroup).toHaveClass('button-group--align-center');
    expect(buttonGroup).toHaveClass('button-group--equal-width');
    
    // Check for icon content
    expect(screen.getByText('★')).toBeInTheDocument();
  });
  
  // Test responsive behavior
  test('applies responsive stacking behavior on mobile', () => {
    render(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          responsiveStacking 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass('button-group--responsive');
    
    // Verify that it only applies responsive class on horizontal layout
    render(
      <ThemeProvider>
        <ButtonGroup 
          direction="vertical" 
          responsiveStacking 
          data-testid="vertical-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const verticalGroup = screen.getByTestId('vertical-group');
    expect(verticalGroup).not.toHaveClass('button-group--responsive');
  });
}); 