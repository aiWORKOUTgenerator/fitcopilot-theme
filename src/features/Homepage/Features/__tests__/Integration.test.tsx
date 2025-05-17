/**
 * Features Section Integration Tests
 * 
 * Tests the integration between Features, FeatureButton, and ThemeProvider
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import Features from '../Features';
import FeatureButton from '../components/FeatureButton';

describe('Features Section Integration', () => {
  test('Features section contains FeatureButton components with proper theming', () => {
    const { container } = render(<Features />);
    
    // Verify that feature section heading is rendered
    const heading = screen.getByText('Innovative Features');
    expect(heading).toBeInTheDocument();
    
    // Verify feature button is rendered
    const startButton = screen.getByText('Start Your Fitness Journey');
    expect(startButton).toBeInTheDocument();
    
    // Verify ThemeProvider is applied
    const themeElement = container.querySelector('[data-theme]');
    expect(themeElement).toBeInTheDocument();
  });
  
  test('FeatureButton inherits theme from ThemeProvider', () => {
    const { container } = render(
      <ThemeProvider initialTheme="gym">
        <FeatureButton variant="primary">Test Button</FeatureButton>
      </ThemeProvider>
    );
    
    // Verify that theme is correctly applied
    const themeElement = container.querySelector('[data-theme="gym"]');
    expect(themeElement).toBeInTheDocument();
    
    // Verify button is rendered
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
    expect(button.closest('.feature-button')).toHaveClass('feature-button-primary');
  });
  
  test('Features component with different variant props', () => {
    const { rerender, container } = render(<Features variant="sports" />);
    
    // Verify sports theme is applied
    const themeElement = container.querySelector('[data-theme="sports"]');
    expect(themeElement).toBeInTheDocument();
    
    // Test with a different variant
    rerender(<Features variant="gym" />);
    
    // Verify gym theme is applied
    const gymThemeElement = container.querySelector('[data-theme="gym"]');
    expect(gymThemeElement).toBeInTheDocument();
  });
}); 