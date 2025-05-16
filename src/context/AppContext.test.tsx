import { render, screen, waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AppProvider, useNotifications, useTheme, useUser } from './AppContext';

// Mock session storage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: query === '(prefers-color-scheme: dark)',
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Replace the real sessionStorage with mock
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  describe('UserContext', () => {
    it('provides default unauthenticated user state', () => {
      const { result } = renderHook(() => useUser(), { wrapper: AppProvider });

      expect(result.current.user).toEqual({
        isAuthenticated: false,
      });
    });

    it('handles user login correctly', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: AppProvider });

      // Verify initial state is unauthenticated
      expect(result.current.user.isAuthenticated).toBe(false);

      // Perform login
      let success: boolean = false;
      await act(async () => {
        success = await result.current.login('test@example.com', 'password');
      });

      // Verify login was successful
      expect(success).toBe(true);
      expect(result.current.user.isAuthenticated).toBe(true);
      expect(result.current.user.email).toBe('test@example.com');
      expect(result.current.user.displayName).toBe('test');
    });

    it('handles user logout correctly', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: AppProvider });

      // First login
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      // Verify authenticated state
      expect(result.current.user.isAuthenticated).toBe(true);

      // Perform logout
      act(() => {
        result.current.logout();
      });

      // Verify logged out state
      expect(result.current.user.isAuthenticated).toBe(false);
      expect(result.current.user.email).toBeUndefined();
    });

    it('renders authenticated content for logged in users', async () => {
      // Use a test component that conditionally renders based on auth state
      const TestComponent = () => {
        const { user, login, logout } = useUser();

        return (
          <div>
            {user.isAuthenticated ? (
              <>
                <div data-testid="auth-content">Welcome, {user.displayName}</div>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <div data-testid="unauth-content">Please log in</div>
                <button onClick={() => login('test@example.com', 'password')}>Login</button>
              </>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      // Verify unauthenticated state is rendered
      expect(screen.getByTestId('unauth-content')).toBeInTheDocument();

      // Click login
      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      // Wait for authenticated content to appear
      await waitFor(() => {
        expect(screen.getByTestId('auth-content')).toBeInTheDocument();
        expect(screen.getByText('Welcome, test')).toBeInTheDocument();
      });

      // Click logout
      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      // Verify we're back to unauthenticated state
      await waitFor(() => {
        expect(screen.getByTestId('unauth-content')).toBeInTheDocument();
      });
    });
  });

  describe('ThemeContext', () => {
    it('provides system theme mode by default', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: AppProvider });

      expect(result.current.theme.mode).toBe('system');
    });

    it('detects user preferred color scheme', () => {
      // Mock window.matchMedia to return dark mode preference
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useTheme(), { wrapper: AppProvider });

      expect(result.current.theme.prefersDarkMode).toBe(true);
    });

    it('allows changing theme mode', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: AppProvider });

      // Change to dark mode
      act(() => {
        result.current.setThemeMode('dark');
      });

      expect(result.current.theme.mode).toBe('dark');

      // Change to light mode
      act(() => {
        result.current.setThemeMode('light');
      });

      expect(result.current.theme.mode).toBe('light');
    });

    it('renders with correct theme class based on mode', () => {
      // Create a test component that uses theme
      const TestComponent = () => {
        const { theme, setThemeMode } = useTheme();
        const themeClass = theme.mode === 'system'
          ? (theme.prefersDarkMode ? 'dark-theme' : 'light-theme')
          : (theme.mode === 'dark' ? 'dark-theme' : 'light-theme');

        return (
          <div className={themeClass} data-testid="themed-component">
            <button onClick={() => setThemeMode('dark')}>Dark</button>
            <button onClick={() => setThemeMode('light')}>Light</button>
            <button onClick={() => setThemeMode('system')}>System</button>
            Current theme: {theme.mode}
          </div>
        );
      };

      const user = userEvent.setup();
      const { container } = render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      const themedComponent = screen.getByTestId('themed-component');

      // Default should be system, which is light in our mock
      expect(themedComponent).toHaveClass('light-theme');

      // Change to dark mode
      const darkButton = screen.getByText('Dark');
      user.click(darkButton);

      waitFor(() => {
        expect(themedComponent).toHaveClass('dark-theme');
        expect(themedComponent).not.toHaveClass('light-theme');
      });
    });
  });

  describe('NotificationsContext', () => {
    it('starts with empty notifications', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper: AppProvider });

      expect(result.current.notifications).toEqual([]);
    });

    it('adds notifications correctly', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper: AppProvider });

      // Add a notification
      act(() => {
        result.current.addNotification('success', 'Operation successful');
      });

      // Verify notification was added
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].type).toBe('success');
      expect(result.current.notifications[0].message).toBe('Operation successful');
    });

    it('dismisses notifications correctly', () => {
      const { result } = renderHook(() => useNotifications(), { wrapper: AppProvider });

      // Add notifications
      act(() => {
        result.current.addNotification('success', 'Success message');
        result.current.addNotification('error', 'Error message');
      });

      // Verify notifications were added
      expect(result.current.notifications).toHaveLength(2);

      // Dismiss the first notification
      const firstId = result.current.notifications[0].id;
      act(() => {
        result.current.dismissNotification(firstId);
      });

      // Verify first notification was removed
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].message).toBe('Error message');
    });

    it('renders notifications properly', () => {
      // Create a test component that uses notifications
      const TestComponent = () => {
        const { notifications, addNotification, dismissNotification } = useNotifications();

        return (
          <div>
            <button onClick={() => addNotification('success', 'Success message')}>
              Add Success
            </button>
            <button onClick={() => addNotification('error', 'Error message')}>
              Add Error
            </button>

            <div data-testid="notifications-container">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  data-testid={`notification-${notification.type}`}
                  className={`notification ${notification.type}`}
                >
                  {notification.message}
                  <button onClick={() => dismissNotification(notification.id)}>
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      };

      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      // No notifications initially
      const container = screen.getByTestId('notifications-container');
      expect(container).toBeEmptyDOMElement();

      // Add success notification
      const addSuccessButton = screen.getByText('Add Success');
      user.click(addSuccessButton);

      // Verify success notification was rendered
      waitFor(() => {
        const successNotification = screen.getByTestId('notification-success');
        expect(successNotification).toBeInTheDocument();
        expect(successNotification).toHaveTextContent('Success message');
      });

      // Dismiss notification
      const dismissButton = screen.getByText('Dismiss');
      user.click(dismissButton);

      // Verify notification was removed
      waitFor(() => {
        expect(screen.queryByTestId('notification-success')).not.toBeInTheDocument();
      });
    });
  });
}); 