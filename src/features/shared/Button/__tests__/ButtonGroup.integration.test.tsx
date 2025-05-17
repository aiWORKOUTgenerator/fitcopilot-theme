/**
 * ButtonGroup Integration Tests
 * 
 * Tests for ButtonGroup with various button types and theme variants
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { HeroButton } from '../../../Homepage/Hero/components/HeroButton';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import { ThemeProvider, mockThemeStyles } from './ThemeTestUtils';

describe('ButtonGroup Integration', () => {
  // Test with mixed button types
  test('renders with mixed button types', () => {
    render(
      <ButtonGroup data-testid="btn-group">
        <Button variant="primary" data-testid="regular-btn">Regular</Button>
        <HeroButton variant="primary" data-testid="hero-btn">Hero</HeroButton>
        <Button variant="secondary" data-testid="secondary-btn">Secondary</Button>
      </ButtonGroup>
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
      const heroButton = screen.getByRole('button', { name: /hero/i });
      
      expect(container).toHaveAttribute('data-theme', 'gym');
      expect(buttonGroup).toBeInTheDocument();
      
      // Verify style is applied through theme
      const styles = window.getComputedStyle(heroButton);
      expect(styles.getPropertyValue('--color-hero-gradient-from')).toBe('var(--color-gym-primary)');
      
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
        <ButtonGroup 
          direction="horizontal" 
          spacing="small" 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      );
      
      let buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--horizontal');
      expect(buttonGroup).toHaveClass('button-group--spacing-small');
      
      // Test medium spacing
      rerender(
        <ButtonGroup 
          direction="horizontal" 
          spacing="medium" 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--spacing-medium');
      
      // Test large spacing
      rerender(
        <ButtonGroup 
          direction="horizontal" 
          spacing="large" 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--spacing-large');
    });
    
    test('renders vertical layout with equal width option', () => {
      render(
        <ButtonGroup 
          direction="vertical" 
          equalWidth 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
          <Button variant="secondary">Last</Button>
        </ButtonGroup>
      );
      
      const buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--vertical');
      expect(buttonGroup).toHaveClass('button-group--equal-width');
    });
    
    test('applies alignment options with mixed button types', () => {
      const { rerender } = render(
        <ButtonGroup 
          alignment="start" 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      );
      
      let buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--align-start');
      
      // Test center alignment
      rerender(
        <ButtonGroup 
          alignment="center" 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--align-center');
      
      // Test end alignment
      rerender(
        <ButtonGroup 
          alignment="end" 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      );
      
      buttonGroup = screen.getByTestId('btn-group');
      expect(buttonGroup).toHaveClass('button-group--align-end');
      
      // Test stretch alignment
      rerender(
        <ButtonGroup 
          alignment="stretch" 
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
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
          direction="vertical"
          spacing="large"
          alignment="center"
          equalWidth
          className="custom-group"
          aria-label="Complex button group"
          data-testid="btn-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary" leftIcon={<span>★</span>}>Hero</HeroButton>
          <Button variant="secondary">Last</Button>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('btn-group');
    expect(buttonGroup).toHaveClass(
      'button-group',
      'button-group--vertical',
      'button-group--spacing-large',
      'button-group--align-center',
      'button-group--equal-width',
      'custom-group'
    );
    expect(buttonGroup).toHaveAttribute('role', 'group');
    expect(buttonGroup).toHaveAttribute('aria-label', 'Complex button group');
    
    // Verify all buttons are rendered
    expect(screen.getByRole('button', { name: /first/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hero/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /last/i })).toBeInTheDocument();
    
    // Verify icon is rendered in HeroButton
    expect(screen.getByText('★')).toBeInTheDocument();
  });
}); 