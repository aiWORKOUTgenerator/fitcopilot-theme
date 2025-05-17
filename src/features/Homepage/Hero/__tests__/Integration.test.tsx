/**
 * Hero Section Integration Tests
 * 
 * Tests the integration between Hero, HeroButton, and ThemeProvider
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import Hero from '../Hero';
import { HeroButton } from '../components/HeroButton';

describe('Hero Section Integration', () => {
  test('Hero section contains HeroButton components with proper theming', () => {
    const { container } = render(<Hero />);
    
    // Verify that hero buttons are rendered
    const primaryButton = screen.getByText('Get a Free Workout');
    const secondaryButton = screen.getByText('Create Your Account');
    
    expect(primaryButton).toBeInTheDocument();
    expect(secondaryButton).toBeInTheDocument();
    
    // Verify that primary button has the correct classes
    expect(primaryButton.closest('.hero-button')).toHaveClass('hero-button-primary');
    
    // Verify that secondary button has the correct classes
    expect(secondaryButton.closest('.hero-button')).toHaveClass('hero-button-secondary');
    
    // Verify ThemeProvider is applied
    const themeElement = container.querySelector('[data-theme]');
    expect(themeElement).toBeInTheDocument();
  });
  
  test('HeroButton inherits theme from ThemeProvider', () => {
    const { container } = render(
      <ThemeProvider initialTheme="gym">
        <HeroButton variant="primary">Test Button</HeroButton>
      </ThemeProvider>
    );
    
    // Verify that theme is correctly applied
    const themeElement = container.querySelector('[data-theme="gym"]');
    expect(themeElement).toBeInTheDocument();
    
    // Verify button is rendered
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
    expect(button.closest('.hero-button')).toHaveClass('hero-button-primary');
  });
  
  test('HeroButton with different theme variants', () => {
    const { rerender } = render(
      <ThemeProvider initialTheme="sports">
        <HeroButton variant="primary">Sports Theme</HeroButton>
      </ThemeProvider>
    );
    
    // Verify sports theme button
    expect(screen.getByText('Sports Theme')).toBeInTheDocument();
    
    // Test with a different theme
    rerender(
      <ThemeProvider initialTheme="wellness">
        <HeroButton variant="secondary">Wellness Theme</HeroButton>
      </ThemeProvider>
    );
    
    // Verify wellness theme button
    expect(screen.getByText('Wellness Theme')).toBeInTheDocument();
  });
}); 