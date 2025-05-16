/**
 * Generic Provider Example
 * 
 * This file demonstrates how to use the generic provider utilities
 * to create type-safe test providers with minimal boilerplate.
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { createTestContext, createTestProviderFactory } from '../generic-provider';

// 1. Define a sample context type
interface UserContextType {
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (data: Partial<UserContextType['user']>) => Promise<void>;
}

// 2. Create default context values
const defaultUserContext: UserContextType = {
  user: null,
  isLoggedIn: false,
  login: async () => false,
  logout: () => { },
  updateProfile: async () => { },
};

// 3. Create authenticated context values
const loggedInUserContext: UserContextType = {
  user: {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
  },
  isLoggedIn: true,
  login: async () => true,
  logout: () => { },
  updateProfile: async () => { },
};

// --------[ Example 1: Simple Test Context ]--------

// Create a test context with default values
const {
  TestProvider: UserProvider,
  useTestContext: useUserContext,
} = createTestContext<UserContextType>('User', defaultUserContext);

// Test component that uses the context
const UserProfile = () => {
  const { user, isLoggedIn, logout } = useUserContext();

  if (!isLoggedIn || !user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Example test
describe('UserProfile with Simple Test Context', () => {
  it('shows login message when not logged in', () => {
    render(
      <UserProvider>
        <UserProfile />
      </UserProvider>
    );

    expect(screen.getByText('Please log in')).toBeInTheDocument();
  });

  it('shows user info when logged in', () => {
    render(
      <UserProvider value={loggedInUserContext}>
        <UserProfile />
      </UserProvider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});

// --------[ Example 2: Configurable Factory Pattern ]--------

// Define configuration type for more complex setup
interface UserContextConfig {
    initialLoggedIn?: boolean;
    mockLoginSuccess?: boolean;
    mockUpdateSuccess?: boolean;
}

// Create a test context factory with configuration
const UserTestContext = createTestProviderFactory<UserContextType, UserContextConfig>(
  'UserFactory',
  (config = {}) => {
    const {
      initialLoggedIn = false,
      mockLoginSuccess = true,
      mockUpdateSuccess = true
    } = config;

    // Create mock functions with predetermined behavior based on config
    const login = jest.fn().mockImplementation(async () => mockLoginSuccess);
    const logout = jest.fn();
    const updateProfile = jest.fn().mockImplementation(async () => {
      if (!mockUpdateSuccess) {
        throw new Error('Update failed');
      }
    });

    return {
      user: initialLoggedIn ? loggedInUserContext.user : null,
      isLoggedIn: initialLoggedIn,
      login,
      logout,
      updateProfile,
    };
  }
);

// Example test with the factory pattern
describe('UserProfile with Factory Pattern', () => {
  it('shows different states based on configuration', () => {
    // Logged out state
    const { rerender } = render(
      <UserTestContext.Provider config={{ initialLoggedIn: false }}>
        <UserProfile />
      </UserTestContext.Provider>
    );

    expect(screen.getByText('Please log in')).toBeInTheDocument();

    // Logged in state with the same provider but different config
    rerender(
      <UserTestContext.Provider config={{ initialLoggedIn: true }}>
        <UserProfile />
      </UserTestContext.Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('mocks function behavior based on configuration', async () => {
    // Setup with login failure configuration
    render(
      <UserTestContext.Provider config={{ mockLoginSuccess: false }}>
        <div>Test</div>
      </UserTestContext.Provider>
    );

    // Access the context value directly for testing
    const contextValue = UserTestContext.useValue();

    // Test the configured behavior
    const loginResult = await contextValue.login('test@example.com', 'password');
    expect(loginResult).toBe(false);

    // Check mock function calls
    expect(contextValue.login).toHaveBeenCalledWith('test@example.com', 'password');
  });
}); 