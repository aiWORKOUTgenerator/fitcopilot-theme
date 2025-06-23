/**
 * Theme Test Utilities
 * 
 * Provides utilities for testing themed components
 */

import React, { createContext, useContext } from 'react';

// Mock theme context for testing
interface MockThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const MockThemeContext = createContext<MockThemeContextType>({
  theme: 'default',
  setTheme: () => {}
});

/**
 * A mock ThemeProvider component for testing
 */
export const ThemeProvider: React.FC<{
  theme?: string;
  children: React.ReactNode;
}> = ({ theme = 'default', children }) => {
  // For testing, we create a simple setTheme function
  const setTheme = (newTheme: string) => {
    logger.info(`Theme would change to: ${newTheme}`);
  };

  return (
    <MockThemeContext.Provider value={{ theme, setTheme }}>
      <div 
        data-testid="theme-container" 
        data-theme={theme !== 'default' ? theme : undefined}
      >
        {children}
      </div>
    </MockThemeContext.Provider>
  );
};

/**
 * Hook for accessing the mock theme context in tests
 */
export const useTheme = () => {
  return useContext(MockThemeContext);
};

/**
 * Mocks theme-specific CSS variables for tests
 */
export const mockThemeStyles = (theme: string, customVars: Record<string, string> = {}) => {
  // Create a mock stylesheet
  const style = document.createElement('style');
  document.head.appendChild(style);
  
  // Base theme CSS variables
  const baseVars = {
    '--color-primary': '#3b82f6',
    '--color-secondary': '#6b7280',
    '--color-hero-gradient-from': '#4f46e5',
    '--color-hero-gradient-to': '#818cf8',
    '--button-padding-y': '0.5rem',
    '--button-padding-x': '1rem',
    '--button-radius': '0.375rem',
  };
  
  // Theme-specific variables
  const themeVars: Record<string, Record<string, string>> = {
    'default': {
      '--color-primary': '#3b82f6',
      '--color-hero-gradient-from': '#4f46e5',
      '--color-hero-gradient-to': '#818cf8',
    },
    'gym': {
      '--color-primary': '#ef4444',
      '--color-gym-primary': '#ef4444',
      '--color-gym-primary-dark': '#b91c1c',
      '--color-hero-gradient-from': 'var(--color-gym-primary)',
      '--color-hero-gradient-to': 'var(--color-gym-primary-dark)',
    },
    'sports': {
      '--color-primary': '#10b981',
      '--color-sports-primary': '#10b981',
      '--color-sports-primary-dark': '#047857',
      '--color-hero-gradient-from': 'var(--color-sports-primary)',
      '--color-hero-gradient-to': 'var(--color-sports-primary-dark)',
    },
    'wellness': {
      '--color-primary': '#8b5cf6',
      '--color-wellness-primary': '#8b5cf6',
      '--color-wellness-primary-dark': '#6d28d9',
      '--color-hero-gradient-from': 'var(--color-wellness-primary)',
      '--color-hero-gradient-to': 'var(--color-wellness-primary-dark)',
    }
  };
  
  // Create CSS text with variables
  const cssVars = { ...baseVars, ...themeVars[theme], ...customVars };
  const cssText = Object.entries(cssVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
    
  // Apply CSS to the mock stylesheet
  style.innerHTML = `
    :root {
      ${cssText}
    }
    
    [data-theme="${theme}"] {
      ${cssText}
    }
  `;
  
  // Return a cleanup function
  return () => {
    document.head.removeChild(style);
  };
};

// Mock the actual HeroButton to avoid needing ThemeContext
jest.mock('../../../../features/Homepage/Hero/components/HeroButton', () => {
  // Import the actual React
  const React = require('react');
  // Return a mock HeroButton component
  return {
    HeroButton: ({ children, variant, className, ...props }: any) => {
      const allClasses = `btn hero-button hero-button-${variant} ${className || ''}`;
      return (
        <button className={allClasses} {...props}>
          {children}
        </button>
      );
    }
  };
}); 