import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { ThemeOption, isValidTheme } from '../utils/theming';

/**
 * ThemeContext type
 */
interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

// Create context with default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider props
 */
interface ThemeProviderProps {
  initialTheme?: ThemeOption;
  children: ReactNode;
  /**
   * Optional class to add to the theme container
   */
  className?: string;
  /**
   * Optional style to add to the theme container
   */
  style?: React.CSSProperties;
  /**
   * Optional test ID for testing
   */
  testId?: string;
}

/**
 * ThemeProvider component
 * 
 * Provides theme context and applies theme attribute to container
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme = 'default',
  children,
  className = '',
  style,
  testId = 'theme-container',
}) => {
  // Theme state
  const [theme, setTheme] = useState<ThemeOption>(initialTheme);
  
  // Update theme attribute when theme changes
  useEffect(() => {
    // Could be extended to persist the theme to localStorage
    document.documentElement.setAttribute('data-theme', theme);
    
    return () => {
      // Cleanup - not strictly necessary but good practice
      if (theme !== 'default') {
        document.documentElement.removeAttribute('data-theme');
      }
    };
  }, [theme]);
  
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

/**
 * useTheme hook
 * 
 * Provides access to theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * withTheme HOC
 * 
 * Higher-order component that provides theme context to a component
 */
export function withTheme<P extends Record<string, unknown>>(
  Component: React.ComponentType<P & { theme: ThemeOption; setTheme: (theme: ThemeOption) => void }>
): React.FC<P> {
  const WithTheme: React.FC<P> = (props) => {
    const { theme, setTheme } = useTheme();
    return <Component {...props} theme={theme} setTheme={setTheme} />;
  };
  
  // Update display name for debugging
  WithTheme.displayName = `WithTheme(${Component.displayName || Component.name || 'Component'})`;
  
  return WithTheme;
}

/**
 * Get theme from URL parameter
 * Used for theme preview and testing
 */
export const getThemeFromUrl = (): ThemeOption => {
  if (typeof window === 'undefined') return 'default';
  
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  
  if (themeParam && isValidTheme(themeParam)) {
    return themeParam;
  }
  
  return 'default';
}; 