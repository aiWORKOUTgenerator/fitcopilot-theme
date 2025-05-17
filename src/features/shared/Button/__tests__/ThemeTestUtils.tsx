/**
 * Theme Testing Utilities
 * 
 * This file contains helper components and utilities for testing theme-specific
 * functionality across the Button component system.
 */

import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';

// Theme types
export type ThemeVariant = 'default' | 'gym' | 'sports' | 'wellness';

// Theme provider component for testing
interface ThemeProviderProps {
  theme?: ThemeVariant;
  children: ReactNode;
}

/**
 * Theme provider component for testing
 * Wraps children in a div with the appropriate data-theme attribute
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  theme = 'default', 
  children 
}) => {
  // Use an actual div with data-theme to simulate real-world usage
  return (
    <div data-theme={theme !== 'default' ? theme : undefined} data-testid="theme-container">
      {children}
    </div>
  );
};

/**
 * Creates a computed style mock for testing CSS variables in JSDOM
 * 
 * @param overrides CSS variable values to override
 * @returns Mock getComputedStyle function
 */
export function createComputedStyleMock(overrides: Record<string, string> = {}) {
  // Default theme token values
  const defaultTokens: Record<string, string> = {
    '--color-primary': '#4CAF50',
    '--color-primary-dark': '#388E3C',
    '--color-primary-light': '#81C784',
    '--color-secondary': '#FF9800',
    '--color-secondary-dark': '#F57C00',
    '--color-secondary-light': '#FFB74D',
    '--color-text-inverse': '#ffffff',
    '--color-gym-primary': '#6200EA',
    '--color-gym-primary-dark': '#4A148C',
    '--color-sports-primary': '#2196F3',
    '--color-sports-primary-dark': '#1565C0',
    '--color-wellness-primary': '#26A69A',
    '--color-wellness-primary-dark': '#00796B',
  };

  // Combine defaults with overrides
  const cssVars = { ...defaultTokens, ...overrides };

  // Return a mock getComputedStyle function
  return (el: Element): CSSStyleDeclaration => {
    const style = {
      getPropertyValue: (prop: string) => cssVars[prop] || '',
    } as unknown as CSSStyleDeclaration;
    
    return style;
  };
}

/**
 * Applies a theme styling mock for testing computed styles
 * 
 * @param theme The theme to apply
 * @param overrides Any additional CSS variable overrides
 */
export function mockThemeStyles(theme: ThemeVariant, overrides: Record<string, string> = {}) {
  // Default theme token values
  const defaultTokens: Record<string, string> = {
    '--color-primary': '#4CAF50',
    '--color-primary-dark': '#388E3C',
    '--color-primary-light': '#81C784',
    '--color-secondary': '#FF9800',
    '--color-secondary-dark': '#F57C00',
    '--color-secondary-light': '#FFB74D',
    '--color-text-inverse': '#ffffff',
    '--color-gym-primary': '#6200EA',
    '--color-gym-primary-dark': '#4A148C',
    '--color-sports-primary': '#2196F3',
    '--color-sports-primary-dark': '#1565C0',
    '--color-wellness-primary': '#26A69A',
    '--color-wellness-primary-dark': '#00796B',
  };

  // Theme-specific variable sets
  const themeTokens: Record<ThemeVariant, Record<string, string>> = {
    default: {},
    gym: {
      '--color-hero-gradient-from': 'var(--color-gym-primary)',
      '--color-hero-gradient-to': 'var(--color-gym-primary-dark)',
    },
    sports: {
      '--color-hero-gradient-from': 'var(--color-sports-primary)',
      '--color-hero-gradient-to': 'var(--color-sports-primary-dark)',
    },
    wellness: {
      '--color-hero-gradient-from': 'var(--color-wellness-primary)',
      '--color-hero-gradient-to': 'var(--color-wellness-primary-dark)',
    },
  };

  // Save original methods
  const originalGetComputedStyle = window.getComputedStyle;

  // Create mock getComputedStyle function
  window.getComputedStyle = (_el: Element) => {
    // Combine default tokens with theme tokens and overrides
    const combinedTokens = {
      ...defaultTokens,
      ...themeTokens[theme],
      ...overrides
    };

    // Return a mock getComputedStyle function
    const style = {
      getPropertyValue: (prop: string) => combinedTokens[prop] || '',
    } as unknown as CSSStyleDeclaration;
    
    return style;
  };

  // Return a cleanup function
  return () => {
    window.getComputedStyle = originalGetComputedStyle;
  };
}

// Tests for the ThemeTestUtils

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
    
    // Create a test element
    const testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
    
    // Check that the CSS variables are correctly mocked
    const styles = window.getComputedStyle(testDiv);
    expect(styles.getPropertyValue('--color-hero-gradient-from')).toBe('var(--color-sports-primary)');
    expect(styles.getPropertyValue('--color-hero-gradient-to')).toBe('var(--color-sports-primary-dark)');
    
    // Check base color variables are also available
    expect(styles.getPropertyValue('--color-primary')).toBe('#4CAF50');
    
    // Clean up
    document.body.removeChild(testDiv);
    cleanup();
  });
  
  test('allows overriding specific CSS variables', () => {
    const cleanup = mockThemeStyles('default', {
      '--color-primary': '#custom-value',
      '--custom-token': 'custom-value',
    });
    
    // Create a test element
    const testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
    
    // Check that the overrides are applied
    const styles = window.getComputedStyle(testDiv);
    expect(styles.getPropertyValue('--color-primary')).toBe('#custom-value');
    expect(styles.getPropertyValue('--custom-token')).toBe('custom-value');
    
    // Clean up
    document.body.removeChild(testDiv);
    cleanup();
  });
}); 