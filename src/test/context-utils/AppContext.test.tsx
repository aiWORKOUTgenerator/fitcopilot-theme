import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AppProvider, useNotifications, useTheme, useUser } from '../../context/AppContext';
import { createProviderWrapper } from './testing-library';

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
            const { result } = renderHook(() => useUser(), { wrapper: createProviderWrapper(AppProvider, {}) });

            expect(result.current.user.isAuthenticated).toBe(false);
            expect(result.current.user.displayName).toBeUndefined();
            expect(result.current.user.email).toBeUndefined();
        });

        it('handles user login correctly', async () => {
            const { result } = renderHook(() => useUser(), { wrapper: createProviderWrapper(AppProvider, {}) });

            // Perform login
            let success: boolean = false;
            await act(async () => {
                success = await result.current.login('test@example.com', 'password');
            });

            // Verify login was successful
            expect(success).toBe(true);
            expect(result.current.user.isAuthenticated).toBe(true);
            expect(result.current.user.email).toBe('test@example.com');
            expect(result.current.user.displayName).toBeTruthy();

            // Verify data was stored in session storage
            expect(mockSessionStorage.setItem).toHaveBeenCalled();
        });

        it('handles user logout correctly', async () => {
            const { result } = renderHook(() => useUser(), { wrapper: createProviderWrapper(AppProvider, {}) });

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

            // Verify data was removed from session storage
            expect(mockSessionStorage.removeItem).toHaveBeenCalled();
        });

        it('renders authenticated content for logged in users', async () => {
            // Create a test component that uses user context
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

            // Click login button
            await user.click(screen.getByText('Login'));

            // Wait for authenticated content to appear
            await waitFor(() => {
                expect(screen.getByTestId('auth-content')).toBeInTheDocument();
            });

            // Click logout button
            await user.click(screen.getByText('Logout'));

            // Verify we're back to unauthenticated state
            await waitFor(() => {
                expect(screen.getByTestId('unauth-content')).toBeInTheDocument();
            });
        });
    });

    describe('ThemeContext', () => {
        it('provides system theme mode by default', () => {
            const { result } = renderHook(() => useTheme(), { wrapper: createProviderWrapper(AppProvider, {}) });

            expect(result.current.theme.mode).toBe('system');
        });

        it('allows changing theme mode', () => {
            const { result } = renderHook(() => useTheme(), { wrapper: createProviderWrapper(AppProvider, {}) });

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
    });

    describe('NotificationsContext', () => {
        it('starts with empty notifications', () => {
            const { result } = renderHook(() => useNotifications(), { wrapper: createProviderWrapper(AppProvider, {}) });

            expect(result.current.notifications).toEqual([]);
        });

        it('adds notifications correctly', () => {
            const { result } = renderHook(() => useNotifications(), { wrapper: createProviderWrapper(AppProvider, {}) });

            // Add a notification
            act(() => {
                result.current.addNotification('success', 'Operation successful');
            });

            // Verify notification was added
            expect(result.current.notifications).toHaveLength(1);
            expect(result.current.notifications[0].type).toBe('success');
            expect(result.current.notifications[0].message).toBe('Operation successful');
            expect(result.current.notifications[0].id).toBeDefined();
        });

        it('dismisses notifications correctly', () => {
            const { result } = renderHook(() => useNotifications(), { wrapper: createProviderWrapper(AppProvider, {}) });

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
    });
}); 