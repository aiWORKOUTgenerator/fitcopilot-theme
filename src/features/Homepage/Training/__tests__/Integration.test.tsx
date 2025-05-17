/**
 * Training Section Integration Tests
 * 
 * Tests the integration between Training, TrainingButton, and ThemeProvider
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import Training from '../Training';
import TrainingButton from '../components/TrainingButton';

describe('Training Section Integration', () => {
  test('Training section contains TrainingButton with proper theming', () => {
    const { container } = render(<Training />);
    
    // Verify the main CTA button is rendered
    const ctaButton = screen.getByText('View All Programs');
    expect(ctaButton).toBeInTheDocument();
    
    // Verify the button has the proper classes
    const buttonElement = ctaButton.closest('button');
    expect(buttonElement).toHaveClass('training-button');
    expect(buttonElement).toHaveClass('training-button-primary');
  });
  
  test('TrainingButton renders with different themes', () => {
    const { rerender } = render(
      <ThemeProvider initialTheme="default">
        <TrainingButton variant="primary">Default Theme</TrainingButton>
      </ThemeProvider>
    );
    
    let button = screen.getByText('Default Theme');
    expect(button.closest('button')).toHaveClass('training-button-primary');
    
    // Test gym theme
    rerender(
      <ThemeProvider initialTheme="gym">
        <TrainingButton variant="primary">Gym Theme</TrainingButton>
      </ThemeProvider>
    );
    
    button = screen.getByText('Gym Theme');
    expect(button.closest('button')).toHaveClass('training-button-primary');
    
    // Test sports theme
    rerender(
      <ThemeProvider initialTheme="sports">
        <TrainingButton variant="primary">Sports Theme</TrainingButton>
      </ThemeProvider>
    );
    
    button = screen.getByText('Sports Theme');
    expect(button.closest('button')).toHaveClass('training-button-primary');
  });
  
  test('TrainingButton renders different style variants', () => {
    const { rerender } = render(
      <TrainingButton variant="primary" styleVariant="standard">Standard Style</TrainingButton>
    );
    
    let button = screen.getByText('Standard Style');
    expect(button.closest('button')).toHaveClass('training-button--standard');
    
    rerender(
      <TrainingButton variant="primary" styleVariant="accent">Accent Style</TrainingButton>
    );
    
    button = screen.getByText('Accent Style');
    expect(button.closest('button')).toHaveClass('training-button--accent');
    
    rerender(
      <TrainingButton variant="primary" styleVariant="athletic">Athletic Style</TrainingButton>
    );
    
    button = screen.getByText('Athletic Style');
    expect(button.closest('button')).toHaveClass('training-button--athletic');
  });
}); 