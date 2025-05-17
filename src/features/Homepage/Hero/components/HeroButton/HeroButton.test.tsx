import { render, screen } from '@testing-library/react';
import React from 'react';
import { HeroButton } from './HeroButton';

describe('HeroButton Component', () => {
  test('renders primary variant correctly', () => {
    render(<HeroButton variant="primary">Click me</HeroButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('hero-button');
    expect(button).toHaveClass('hero-button-primary');
  });
  
  test('renders secondary variant correctly', () => {
    render(<HeroButton variant="secondary">Click me</HeroButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('hero-button');
    expect(button).toHaveClass('hero-button-secondary');
  });
  
  test('renders with left icon', () => {
    render(
      <HeroButton 
        variant="primary" 
        leftIcon={<span data-testid="left-icon">Icon</span>}
      >
        With Icon
      </HeroButton>
    );
    
    const button = screen.getByRole('button', { name: /with icon/i });
    const icon = screen.getByTestId('left-icon');
    
    expect(button).toContainElement(icon);
  });
}); 