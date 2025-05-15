/**
 * UserContext Testing Utilities
 * 
 * This file provides reusable utilities for testing components that use the user context.
 */
import { act, render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { FC, ReactNode } from 'react';
import { AppProvider, UserInfo, useUser } from '../../context/AppContext';

// Default mock user for testing
export const defaultMockUser: UserInfo = {
    isAuthenticated: false,
    userId: undefined,
    displayName: undefined,
    email: undefined,
    roles: undefined,
};

// Authenticated mock user for testing
export const authenticatedMockUser: UserInfo = {
    isAuthenticated: true,
    userId: 'test-user-123',
    displayName: 'Test User',
    email: 'test@example.com',
    roles: ['user'],
};

// Admin mock user for testing
export const adminMockUser: UserInfo = {
    isAuthenticated: true,
    userId: 'admin-123',
    displayName: 'Admin User',
    email: 'admin@example.com',
    roles: ['admin', 'user'],
};

// Create mock AppProvider with configurable initial user
interface MockAppProviderProps {
    initialUser?: UserInfo;
    children: ReactNode;
}

export const MockAppProvider: FC<MockAppProviderProps> = ({
    initialUser = defaultMockUser,
    children
}) => {
    // We'll use session storage to store our mock states
    // This helps simulate real app behavior where AppProvider would read/write to storage
    if (initialUser) {
        // Store initial user in session storage mock
        sessionStorage.setItem('mock_user_state', JSON.stringify(initialUser));
    }

    return <AppProvider>{children}</AppProvider>;
};

// Custom render function for components that need UserContext
export function renderWithUserContext(
    ui: React.ReactElement,
    {
        initialUser = defaultMockUser,
        ...renderOptions
    }: { initialUser?: UserInfo } & Omit<RenderOptions, 'wrapper'>
): RenderResult & { mockUser: UserInfo } {
    return {
        ...render(ui, {
            wrapper: ({ children }) => (
                <MockAppProvider initialUser={initialUser}>{children}</MockAppProvider>
            ),
            ...renderOptions,
        }),
        mockUser: initialUser,
    };
}

// Helper to simulate user login
export async function simulateLogin(
    email: string = 'test@example.com',
    password: string = 'password'
): Promise<boolean> {
    let result = false;
    await act(async () => {
        const { user } = useUser();
        // This hook would typically be called within a component
        // In a test, we're accessing it directly
        result = await user.login(email, password);
    });
    return result;
}

// Helper to simulate user logout
export function simulateLogout(): void {
    act(() => {
        const { user } = useUser();
        user.logout();
    });
}

// Helper to wait for authentication state changes
export async function waitForAuthState(
    isAuthenticated: boolean,
    timeout: number = 2000
): Promise<void> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkAuthState = () => {
            const { user } = useUser();

            if (user.isAuthenticated === isAuthenticated) {
                resolve();
                return;
            }

            if (Date.now() - startTime > timeout) {
                reject(new Error(`Timed out waiting for auth state to be ${isAuthenticated}`));
                return;
            }

            setTimeout(checkAuthState, 100);
        };

        checkAuthState();
    });
}

// Factory function to create users with custom properties
export function createMockUser(overrides: Partial<UserInfo> = {}): UserInfo {
    return {
        ...defaultMockUser,
        ...overrides,
    };
} 