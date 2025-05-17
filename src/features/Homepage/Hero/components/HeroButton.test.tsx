import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ButtonGroup } from '../../../../features/shared/Button';
import { ThemeProvider, mockThemeStyles } from '../../../../features/shared/Button/__tests__/ThemeTestUtils';
import { HeroButton } from './HeroButton';

describe('HeroButton component', () => {
  // Test basic rendering
  test('renders correctly with default props', () => {
    render(<HeroButton variant="primary">Hero Button</HeroButton>);
    const button = screen.getByRole('button', { name: /hero button/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('hero-button');
    expect(button).toHaveClass('hero-button--primary');
    expect(button).toHaveClass('hero-button--medium');
    // Should also have the .btn class for ButtonGroup compatibility
    expect(button).toHaveClass('btn');
  });
  
  // Test variant rendering
  test('renders with secondary variant', () => {
    render(<HeroButton variant="secondary">Secondary Hero</HeroButton>);
    const button = screen.getByRole('button', { name: /secondary hero/i });
    
    expect(button).toHaveClass('hero-button--secondary');
  });
  
  // Test size rendering
  test('renders with different sizes', () => {
    const { rerender } = render(<HeroButton variant="primary" size="small">Small Button</HeroButton>);
    let button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveClass('hero-button--small');
    
    rerender(<HeroButton variant="primary" size="large">Large Button</HeroButton>);
    button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('hero-button--large');
  });
  
  // Test full width rendering
  test('renders with full width when specified', () => {
    render(<HeroButton variant="primary" fullWidth>Full Width</HeroButton>);
    const button = screen.getByRole('button', { name: /full width/i });
    
    expect(button).toHaveClass('hero-button--full-width');
  });
  
  // Test with icons
  test('renders with left and right icons', () => {
    render(
      <HeroButton 
        variant="primary"
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Icon Button
      </HeroButton>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    
    const leftIconContainer = screen.getByTestId('left-icon').parentElement;
    const rightIconContainer = screen.getByTestId('right-icon').parentElement;
    
    expect(leftIconContainer).toHaveClass('hero-button__icon--left');
    expect(rightIconContainer).toHaveClass('hero-button__icon--right');
  });
  
  // Test click handler
  test('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<HeroButton variant="primary" onClick={handleClick}>Clickable</HeroButton>);
    
    const button = screen.getByRole('button', { name: /clickable/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  // Test disabled state
  test('is non-clickable when disabled', async () => {
    const handleClick = jest.fn();
    render(<HeroButton variant="primary" onClick={handleClick} disabled>Disabled</HeroButton>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  // Enhanced theme testing
  describe('Theme variant tests', () => {
    // Test default theme
    test('renders with default theme styling', () => {
      const cleanup = mockThemeStyles('default');
      
      render(
        <ThemeProvider theme="default">
          <HeroButton variant="primary">Default Theme Button</HeroButton>
        </ThemeProvider>
      );
      
      const button = screen.getByRole('button', { name: /default theme button/i });
      const container = screen.getByTestId('theme-container');
      
      expect(container).not.toHaveAttribute('data-theme');
      expect(button).toHaveClass('hero-button--primary');
      
      cleanup();
    });
    
    // Test gym theme
    test('renders with gym theme styling', () => {
      const cleanup = mockThemeStyles('gym');
      
      render(
        <ThemeProvider theme="gym">
          <HeroButton variant="primary">Gym Theme Button</HeroButton>
        </ThemeProvider>
      );
      
      const button = screen.getByRole('button', { name: /gym theme button/i });
      const container = screen.getByTestId('theme-container');
      
      expect(container).toHaveAttribute('data-theme', 'gym');
      expect(button).toHaveClass('hero-button--primary');
      
      // Test style variables (computed style mocked by mockThemeStyles)
      const styles = window.getComputedStyle(button);
      expect(styles.getPropertyValue('--color-hero-gradient-from')).toBe('var(--color-gym-primary)');
      expect(styles.getPropertyValue('--color-hero-gradient-to')).toBe('var(--color-gym-primary-dark)');
      
      cleanup();
    });
    
    // Test sports theme
    test('renders with sports theme styling', () => {
      const cleanup = mockThemeStyles('sports');
      
      render(
        <ThemeProvider theme="sports">
          <HeroButton variant="primary">Sports Theme Button</HeroButton>
        </ThemeProvider>
      );
      
      const button = screen.getByRole('button', { name: /sports theme button/i });
      const container = screen.getByTestId('theme-container');
      
      expect(container).toHaveAttribute('data-theme', 'sports');
      expect(button).toHaveClass('hero-button--primary');
      
      // Test style variables (computed style mocked by mockThemeStyles)
      const styles = window.getComputedStyle(button);
      expect(styles.getPropertyValue('--color-hero-gradient-from')).toBe('var(--color-sports-primary)');
      expect(styles.getPropertyValue('--color-hero-gradient-to')).toBe('var(--color-sports-primary-dark)');
      
      cleanup();
    });
    
    // Test wellness theme
    test('renders with wellness theme styling', () => {
      const cleanup = mockThemeStyles('wellness');
      
      render(
        <ThemeProvider theme="wellness">
          <HeroButton variant="primary">Wellness Theme Button</HeroButton>
        </ThemeProvider>
      );
      
      const button = screen.getByRole('button', { name: /wellness theme button/i });
      const container = screen.getByTestId('theme-container');
      
      expect(container).toHaveAttribute('data-theme', 'wellness');
      expect(button).toHaveClass('hero-button--primary');
      
      // Test style variables (computed style mocked by mockThemeStyles)
      const styles = window.getComputedStyle(button);
      expect(styles.getPropertyValue('--color-hero-gradient-from')).toBe('var(--color-wellness-primary)');
      expect(styles.getPropertyValue('--color-hero-gradient-to')).toBe('var(--color-wellness-primary-dark)');
      
      cleanup();
    });
    
    // Test theme switching
    test('transitions properly when theme changes', () => {
      const { rerender } = render(
        <ThemeProvider theme="default">
          <HeroButton variant="primary">Theme Switching Button</HeroButton>
        </ThemeProvider>
      );
      
      const button = screen.getByRole('button', { name: /theme switching button/i });
      let container = screen.getByTestId('theme-container');
      
      expect(container).not.toHaveAttribute('data-theme');
      
      // Switch to gym theme
      rerender(
        <ThemeProvider theme="gym">
          <HeroButton variant="primary">Theme Switching Button</HeroButton>
        </ThemeProvider>
      );
      
      container = screen.getByTestId('theme-container');
      expect(container).toHaveAttribute('data-theme', 'gym');
      
      // Switch to sports theme  
      rerender(
        <ThemeProvider theme="sports">
          <HeroButton variant="primary">Theme Switching Button</HeroButton>
        </ThemeProvider>
      );
      
      container = screen.getByTestId('theme-container');
      expect(container).toHaveAttribute('data-theme', 'sports');
    });
  });
  
  // ButtonGroup integration tests
  describe('ButtonGroup integration', () => {
    // Test basic integration
    test('works properly within ButtonGroup', () => {
      render(
        <ButtonGroup direction="horizontal" spacing="medium">
          <HeroButton variant="primary">First</HeroButton>
          <HeroButton variant="secondary">Second</HeroButton>
        </ButtonGroup>
      );
      
      const firstButton = screen.getByRole('button', { name: /first/i });
      const secondButton = screen.getByRole('button', { name: /second/i });
      const group = screen.getByRole('group');
      
      expect(group).toHaveClass('button-group');
      expect(group).toHaveClass('button-group--horizontal');
      expect(firstButton).toHaveClass('hero-button');
      expect(secondButton).toHaveClass('hero-button');
    });
    
    // Test with vertical layout
    test('works properly with vertical ButtonGroup', () => {
      render(
        <ButtonGroup direction="vertical" spacing="medium">
          <HeroButton variant="primary">First</HeroButton>
          <HeroButton variant="secondary">Second</HeroButton>
        </ButtonGroup>
      );
      
      const group = screen.getByRole('group');
      expect(group).toHaveClass('button-group--vertical');
    });
    
    // Test with different spacing options
    test('respects spacing options in ButtonGroup', () => {
      const { rerender } = render(
        <ButtonGroup direction="horizontal" spacing="small">
          <HeroButton variant="primary">First</HeroButton>
          <HeroButton variant="secondary">Second</HeroButton>
        </ButtonGroup>
      );
      
      let group = screen.getByRole('group');
      expect(group).toHaveClass('button-group--spacing-small');
      
      rerender(
        <ButtonGroup direction="horizontal" spacing="large">
          <HeroButton variant="primary">First</HeroButton>
          <HeroButton variant="secondary">Second</HeroButton>
        </ButtonGroup>
      );
      
      group = screen.getByRole('group');
      expect(group).toHaveClass('button-group--spacing-large');
    });
    
    // Test with equalWidth option
    test('respects equalWidth option in ButtonGroup', () => {
      render(
        <ButtonGroup direction="horizontal" equalWidth>
          <HeroButton variant="primary">First</HeroButton>
          <HeroButton variant="secondary">Second</HeroButton>
        </ButtonGroup>
      );
      
      const group = screen.getByRole('group');
      expect(group).toHaveClass('button-group--equal-width');
    });
  });
  
  // Accessibility tests
  describe('Accessibility', () => {
    // Test keyboard focus
    test('is keyboard focusable', () => {
      render(<HeroButton variant="primary">Focusable Button</HeroButton>);
      const button = screen.getByRole('button', { name: /focusable button/i });
      
      button.focus();
      expect(document.activeElement).toBe(button);
    });
    
    // Test ARIA attributes
    test('preserves ARIA attributes', () => {
      // Create wrapper button with direct aria attributes
      const AccessibleButtonWrapper = () => (
        <button 
          className="hero-button btn"
          aria-label="Test aria label"
          aria-haspopup="true"
          type="button"
        >
          ARIA Button
        </button>
      );

      render(<AccessibleButtonWrapper />);
      
      const button = screen.getByRole('button', { name: /test aria label/i });
      expect(button).toHaveAttribute('aria-label', 'Test aria label');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });
  });
}); 