# Context Testing Patterns

This document outlines best practices and patterns for testing React contexts efficiently and comprehensively.

## Basic Context Testing Approach

### 1. Test The Provider, Not The Context

Focus on testing the provider component and its behavior rather than directly testing the context object:

```typescript
// DO THIS:
test('provides initial state correctly', () => {
  render(
    <UserProvider>
      <UserConsumer />
    </UserProvider>
  );
  // Test what the consumer receives
});

// NOT THIS:
test('context has correct default values', () => {
  const context = React.createContext(defaultValue);
  expect(context._currentValue).toEqual(defaultValue); // Implementation detail!
});
```

### 2. Create Test Consumer Components

Use simple consumer components that display context values:

```typescript
const UserConsumer = () => {
  const { user, isAuthenticated } = useUserContext();
  return (
    <div>
      {isAuthenticated ? (
        <div data-testid="user-info">{user.name}</div>
      ) : (
        <div data-testid="anonymous">Not logged in</div>
      )}
    </div>
  );
};
```

### 3. Test State Transitions

Verify that context state changes correctly in response to actions:

```typescript
test('auth state changes on login', async () => {
  render(
    <UserProvider>
      <LoginForm />
    </UserProvider>
  );
  
  // Simulate login
  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Verify state transition
  await waitFor(() => {
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
  });
});
```

## Testing Hooks that Use Context

### 1. Render with Provider Wrapper

Use `renderHook` with a provider wrapper:

```typescript
const wrapper = ({ children }) => (
  <UserProvider>{children}</UserProvider>
);

const { result } = renderHook(() => useUserState(), { wrapper });
```

### 2. Test Hook Behavior

Verify that the hook correctly interacts with context:

```typescript
test('useProfile hook gets user data from context', () => {
  const wrapper = ({ children }) => (
    <UserProvider initialState={{ user: mockUser }}>
      {children}
    </UserProvider>
  );
  
  const { result } = renderHook(() => useProfile(), { wrapper });
  
  expect(result.current.name).toBe(mockUser.name);
  expect(result.current.email).toBe(mockUser.email);
});
```

### 3. Test State Updates

Verify that hook state updates trigger context updates:

```typescript
test('updateProfile updates user context', async () => {
  const wrapper = ({ children }) => (
    <UserProvider>{children}</UserProvider>
  );
  
  const { result, waitForNextUpdate } = renderHook(() => useProfile(), { wrapper });
  
  act(() => {
    result.current.updateProfile({ name: 'New Name' });
  });
  
  await waitForNextUpdate();
  
  expect(result.current.name).toBe('New Name');
});
```

## Testing Nested Contexts

### 1. Create Nested Provider Wrappers

For components that depend on multiple contexts:

```typescript
const AllProviders = ({ children }) => (
  <ThemeProvider>
    <UserProvider>
      <WorkoutProvider>
        {children}
      </WorkoutProvider>
    </UserProvider>
  </ThemeProvider>
);

const renderWithAllProviders = (ui, options = {}) => 
  render(ui, { wrapper: AllProviders, ...options });
```

### 2. Test Inter-Context Communication

Verify that changes in one context affect components using multiple contexts:

```typescript
test('theme changes affect workout display', async () => {
  const { getByTestId, getByRole } = renderWithAllProviders(<WorkoutDisplay />);
  
  // Initial state
  expect(getByTestId('workout-card')).toHaveClass('light-theme');
  
  // Change theme
  await userEvent.click(getByRole('button', { name: /dark mode/i }));
  
  // Verify theme affected the workout display
  expect(getByTestId('workout-card')).toHaveClass('dark-theme');
});
```

## Mock Strategies

### 1. Mock API Dependencies

Create mock versions of API services used by context providers:

```typescript
jest.mock('../../api/userService', () => ({
  login: jest.fn().mockResolvedValue({ id: 'user1', name: 'Test User' }),
  logout: jest.fn().mockResolvedValue(true),
  getProfile: jest.fn().mockResolvedValue({ id: 'user1', name: 'Test User' })
}));
```

### 2. Mock Initial State

Configure contexts with different initial states:

```typescript
const MockUserProvider = ({ initialUser = null, children }) => {
  const [user, setUser] = useState(initialUser);
  // Mock provider implementation
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

### 3. Mock Context Values Directly

For lower-level component testing, mock the context value directly:

```typescript
const mockUserContext = {
  user: { id: 'user1', name: 'Test User' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn()
};

jest.mock('../../contexts/UserContext', () => ({
  useUserContext: () => mockUserContext
}));
```

## Testing Error Scenarios

### 1. Mock API Failures

Simulate API errors in context operations:

```typescript
test('login failure shows error message', async () => {
  // Mock API failure
  userService.login.mockRejectedValueOnce(new Error('Invalid credentials'));
  
  render(
    <UserProvider>
      <LoginForm />
    </UserProvider>
  );
  
  // Simulate login attempt
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Verify error handling
  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
```

### 2. Test Loading States

Verify loading indicators during async operations:

```typescript
test('shows loading state during login', async () => {
  // Delay the mock response
  userService.login.mockImplementationOnce(() => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ user: mockUser }), 100);
    });
  });
  
  render(
    <UserProvider>
      <LoginForm />
    </UserProvider>
  );
  
  // Trigger login
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Verify loading state
  expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  
  // Wait for completion
  await waitFor(() => {
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
  });
});
```

## Context Testing Best Practices

1. **Focus on behavior, not implementation details**
   - Test how components interact with context, not the internal workings

2. **Create reusable provider wrappers**
   - Define render utilities that wrap components in their providers

3. **Use data-testid for context-dependent elements**
   - Makes it easier to verify context state affects the UI

4. **Test the full lifecycle of context state**
   - Initial values, state transitions, error states, and cleanup

5. **Clean up between tests**
   - Reset context state, clear mocks, and clean up any side effects

6. **Don't test the context API itself**
   - Assume React's context API works; test your usage of it

7. **Mock timers for async operations**
   - Use `jest.useFakeTimers()` to test loading states without actual delays

8. **Always wrap hook tests in the provider**
   - Hooks that use context will throw if the provider is missing 