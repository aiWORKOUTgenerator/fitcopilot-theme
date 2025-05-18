import React, { ReactNode, createContext, useState } from 'react';

/**
 * Mock of ThemeContext that matches the original implementation
 */

// Define ThemeOption type to match the original
export type ThemeOption = 'default' | 'gym' | 'sports' | 'wellness';

// Helper function to validate themes
export const isValidTheme = (theme: string): theme is ThemeOption => {
  return ['default', 'gym', 'sports', 'wellness'].includes(theme as ThemeOption);
};

// Create the context type matching the original
interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

// Create context with default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Match the original props interface
interface ThemeProviderProps {
  initialTheme?: ThemeOption;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

// Mock ThemeProvider component with the same API as the original
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme = 'default',
  children,
  className = '',
  style,
  testId = 'theme-container',
}) => {
  // Simple state management for tests
  const [theme, setTheme] = useState<ThemeOption>(initialTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div 
        data-theme={theme === 'default' ? undefined : theme}
        className={className}
        style={style}
        data-testid={testId}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Mock useTheme hook that matches the original
export const useTheme = (): ThemeContextType => {
  // For testing, always return a valid context rather than throwing
  return {
    theme: 'default',
    setTheme: () => console.log('Mock setTheme called')
  };
};

// Mock withTheme HOC
export function withTheme<P extends Record<string, unknown>>(
  Component: React.ComponentType<P & { theme: ThemeOption; setTheme: (theme: ThemeOption) => void }>
): React.FC<P> {
  const WithTheme: React.FC<P> = (props) => {
    // Use our mock useTheme that won't throw errors
    const { theme, setTheme } = useTheme();
    return <Component {...props} theme={theme} setTheme={setTheme} />;
  };
  
  WithTheme.displayName = `WithTheme(${Component.displayName || Component.name || 'Component'})`;
  
  return WithTheme;
}

// Mock getThemeFromUrl function
export const getThemeFromUrl = (): ThemeOption => {
  return 'default';
};

// Export the mock as default and named exports
export default {
  ThemeProvider,
  useTheme,
  withTheme,
  getThemeFromUrl,
  isValidTheme
}; 