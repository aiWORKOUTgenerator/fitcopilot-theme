/**
 * ButtonGroup Responsive Tests
 * 
 * Tests for ButtonGroup responsive behavior on different screen sizes
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { HeroButton } from '../../../Homepage/Hero/components/HeroButton';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { ThemeProvider } from './ThemeTestUtils';

describe('ButtonGroup Responsive Behavior', () => {
  // Mock window.matchMedia for responsive tests
  const setMobileView = () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  };
  
  const setDesktopView = () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query !== '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  };
  
  beforeEach(() => {
    // Reset matchMedia before each test
    jest.resetModules();
  });
  
  test('applies responsive class when responsiveStacking prop is true', () => {
    render(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          responsiveStacking 
          data-testid="responsive-group"
        >
          <Button variant="primary">First</Button>
          <Button variant="secondary">Second</Button>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('responsive-group');
    expect(buttonGroup).toHaveClass('button-group--responsive');
  });
  
  test('does not apply responsive class when responsiveStacking is false', () => {
    render(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          data-testid="non-responsive-group"
        >
          <Button variant="primary">First</Button>
          <Button variant="secondary">Second</Button>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('non-responsive-group');
    expect(buttonGroup).not.toHaveClass('button-group--responsive');
  });
  
  test('does not apply responsive class to vertical groups even with responsiveStacking=true', () => {
    render(
      <ThemeProvider>
        <ButtonGroup 
          direction="vertical" 
          responsiveStacking 
          data-testid="vertical-group"
        >
          <Button variant="primary">First</Button>
          <Button variant="secondary">Second</Button>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('vertical-group');
    expect(buttonGroup).not.toHaveClass('button-group--responsive');
  });
  
  test('mixed button types maintain correct spacing in responsive mode', () => {
    render(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          responsiveStacking 
          data-testid="mixed-group"
        >
          <Button variant="primary" data-testid="standard-btn">Standard</Button>
          <HeroButton variant="primary" data-testid="hero-btn">Hero</HeroButton>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('mixed-group');
    const standardBtn = screen.getByTestId('standard-btn');
    const heroBtn = screen.getByTestId('hero-btn');
    
    expect(buttonGroup).toHaveClass('button-group--responsive');
    expect(standardBtn).toBeInTheDocument();
    expect(heroBtn).toBeInTheDocument();
  });
  
  test('responsiveStacking has no effect on desktop view styles', () => {
    // Set desktop view
    setDesktopView();
    
    // Mock the getComputedStyle for desktop view
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = jest.fn().mockImplementation((element) => {
      if (element.classList.contains('button-group--horizontal')) {
        return { 
          flexDirection: 'row'
        } as CSSStyleDeclaration;
      }
      return originalGetComputedStyle(element);
    });
    
    render(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          responsiveStacking 
          data-testid="desktop-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    const buttonGroup = screen.getByTestId('desktop-group');
    expect(buttonGroup).toHaveClass('button-group--horizontal');
    expect(buttonGroup).toHaveClass('button-group--responsive');
    
    // Restore original function
    window.getComputedStyle = originalGetComputedStyle;
  });
  
  test('ButtonGroup with different spacing options maintains spacing in responsive mode', () => {
    // Test with different spacing values
    const { rerender } = render(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          spacing="small"
          responsiveStacking 
          data-testid="spacing-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    let buttonGroup = screen.getByTestId('spacing-group');
    expect(buttonGroup).toHaveClass('button-group--spacing-small');
    
    // Change to medium spacing
    rerender(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          spacing="medium"
          responsiveStacking 
          data-testid="spacing-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    buttonGroup = screen.getByTestId('spacing-group');
    expect(buttonGroup).toHaveClass('button-group--spacing-medium');
    
    // Change to large spacing
    rerender(
      <ThemeProvider>
        <ButtonGroup 
          direction="horizontal" 
          spacing="large"
          responsiveStacking 
          data-testid="spacing-group"
        >
          <Button variant="primary">First</Button>
          <HeroButton variant="primary">Hero</HeroButton>
        </ButtonGroup>
      </ThemeProvider>
    );
    
    buttonGroup = screen.getByTestId('spacing-group');
    expect(buttonGroup).toHaveClass('button-group--spacing-large');
  });
}); 