/**
 * Journey Section Integration Tests
 * 
 * Tests the integration between Journey, JourneyButton, and ThemeProvider
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../../../../context/ThemeContext';
import JourneyButton from '../components/JourneyButton';
import JourneyCTA from '../components/JourneyCTA';

describe('Journey Section Integration', () => {
  test('JourneyButton renders with gradient colors', () => {
    const { rerender } = render(
      <JourneyButton variant="primary" gradientColor="lime">Lime Gradient</JourneyButton>
    );
    
    let button = screen.getByText('Lime Gradient');
    expect(button.closest('button')).toHaveClass('journey-gradient-lime');
    
    rerender(
      <JourneyButton variant="primary" gradientColor="cyan">Cyan Gradient</JourneyButton>
    );
    
    button = screen.getByText('Cyan Gradient');
    expect(button.closest('button')).toHaveClass('journey-gradient-cyan');
    
    rerender(
      <JourneyButton variant="primary" gradientColor="violet">Violet Gradient</JourneyButton>
    );
    
    button = screen.getByText('Violet Gradient');
    expect(button.closest('button')).toHaveClass('journey-gradient-violet');
    
    rerender(
      <JourneyButton variant="primary" gradientColor="amber">Amber Gradient</JourneyButton>
    );
    
    button = screen.getByText('Amber Gradient');
    expect(button.closest('button')).toHaveClass('journey-gradient-amber');
  });
  
  test('JourneyButton renders different sizes', () => {
    const { rerender } = render(
      <JourneyButton variant="primary" size="small">Small Button</JourneyButton>
    );
    
    let button = screen.getByText('Small Button');
    expect(button.closest('button')).toHaveClass('journey-button--small');
    
    rerender(
      <JourneyButton variant="primary" size="medium">Medium Button</JourneyButton>
    );
    
    button = screen.getByText('Medium Button');
    expect(button.closest('button')).toHaveClass('journey-button--medium');
    
    rerender(
      <JourneyButton variant="primary" size="large">Large Button</JourneyButton>
    );
    
    button = screen.getByText('Large Button');
    expect(button.closest('button')).toHaveClass('journey-button--large');
  });
  
  test('JourneyButton applies theme properly', () => {
    const { rerender } = render(
      <ThemeProvider initialTheme="default">
        <JourneyButton variant="secondary">Default Secondary</JourneyButton>
      </ThemeProvider>
    );
    
    // Default theme secondary button should have journey-button-secondary class
    let button = screen.getByText('Default Secondary');
    expect(button.closest('button')).toHaveClass('journey-button-secondary');
    
    rerender(
      <ThemeProvider initialTheme="gym">
        <JourneyButton variant="secondary">Gym Secondary</JourneyButton>
      </ThemeProvider>
    );
    
    // Gym theme should still use journey-button-secondary class with theme-specific CSS variables
    button = screen.getByText('Gym Secondary');
    expect(button.closest('button')).toHaveClass('journey-button-secondary');
  });
  
  test('JourneyCTA properly wraps JourneyButton', () => {
    render(
      <JourneyCTA 
        text="Test CTA" 
        buttonSize="large" 
        gradientColor="lime" 
        variant="default" 
      />
    );
    
    const button = screen.getByText('Test CTA');
    const buttonElement = button.closest('button');
    
    expect(buttonElement).toHaveClass('journey-button');
    expect(buttonElement).toHaveClass('journey-button--large');
    expect(buttonElement).toHaveClass('journey-gradient-lime');
  });
}); 