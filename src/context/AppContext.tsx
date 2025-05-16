/**
 * Application Context
 * 
 * Provides global state and services that can be accessed by any feature.
 * This is for truly cross-cutting concerns that span multiple features.
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { wordPressService, WordPressServiceData } from '../services';

// App theme configuration
export type ThemeMode = 'light' | 'dark' | 'system';

// User information
export interface UserInfo {
    isAuthenticated: boolean;
    userId?: string;
    displayName?: string;
    email?: string;
    roles?: string[];
}

// Global application state
export interface AppState {
    theme: {
        mode: ThemeMode;
        prefersDarkMode: boolean;
    };
    user: UserInfo;
    wpData: WordPressServiceData;
    isLoading: boolean;
    notifications: Array<{
        id: string;
        type: 'info' | 'success' | 'warning' | 'error';
        message: string;
    }>;
}

// Global application actions
export interface AppActions {
    setThemeMode: (mode: ThemeMode) => void;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    addNotification: (type: 'info' | 'success' | 'warning' | 'error', message: string) => void;
    dismissNotification: (id: string) => void;
}

// Define the context type
export interface AppContextType {
    state: AppState;
    actions: AppActions;
}

// Create the context with undefined default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Props for the provider component
interface AppProviderProps {
    children: ReactNode;
}

// Provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize the app state
  const [state, setState] = useState<AppState>({
    theme: {
      mode: 'system',
      prefersDarkMode: false,
    },
    user: {
      isAuthenticated: false,
    },
    wpData: wordPressService.getData(),
    isLoading: true,
    notifications: [],
  });

  // Effect to detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setState(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          prefersDarkMode: mediaQuery.matches,
        }
      }));
    };

    // Set initial value
    handleChange();

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Subscribe to WordPress data changes
  useEffect(() => {
    const unsubscribe = wordPressService.subscribe({
      onDataChange: (newData) => {
        setState(prev => ({
          ...prev,
          wpData: newData,
          isLoading: false,
        }));
      }
    });

    return unsubscribe;
  }, []);

  // Define actions
  const actions: AppActions = {
    setThemeMode: (mode) => {
      setState(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          mode,
        }
      }));
    },

    login: async (email, _password) => {
      setState(prev => ({ ...prev, isLoading: true }));

      // Simulate API call
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isLoading: false,
            user: {
              isAuthenticated: true,
              email,
              displayName: email.split('@')[0],
              roles: ['user'],
            }
          }));

          resolve(true);
        }, 1000);
      });
    },

    logout: () => {
      setState(prev => ({
        ...prev,
        user: {
          isAuthenticated: false,
        }
      }));
    },

    addNotification: (type, message) => {
      const id = Date.now().toString();

      setState(prev => ({
        ...prev,
        notifications: [
          ...prev.notifications,
          { id, type, message }
        ]
      }));

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        actions.dismissNotification(id);
      }, 5000);
    },

    dismissNotification: (id) => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id)
      }));
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};

// Convenience hooks for specific parts of the context
export const useTheme = () => {
  const { state, actions } = useApp();
  return {
    theme: state.theme,
    setThemeMode: actions.setThemeMode,
  };
};

export const useUser = () => {
  const { state, actions } = useApp();
  return {
    user: state.user,
    login: actions.login,
    logout: actions.logout,
  };
};

export const useNotifications = () => {
  const { state, actions } = useApp();
  return {
    notifications: state.notifications,
    addNotification: actions.addNotification,
    dismissNotification: actions.dismissNotification,
  };
};

export const useAppData = () => {
  const { state } = useApp();
  return {
    wpData: state.wpData,
    isLoading: state.isLoading,
  };
}; 