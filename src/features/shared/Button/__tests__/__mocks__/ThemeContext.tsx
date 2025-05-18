// Mock ThemeContext for tests
import React, { createContext, useContext } from 'react';

// Mock theme context
interface MockThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<MockThemeContextType>({
  theme: 'default',
  setTheme: () => {}
});

// Mock ThemeProvider component
export const ThemeProvider: React.FC<{
  theme?: string;
  children: React.ReactNode;
}> = ({ theme = 'default', children }) => {
  const setTheme = (newTheme: string) => {
    console.log(`Theme would change to: ${newTheme}`);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Mock useTheme hook
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Default export
export default {
  ThemeProvider,
  useTheme
}; 