# Context Testing Guide

## Overview

This guide documents best practices and patterns for testing React contexts in our application. Properly testing contexts ensures that state management works correctly across components and helps catch issues with provider implementations early.

## Key Principles

1. **Test Provider and Consumer Separately**: Test the provider's state management logic independently from components that consume it.

2. **Isolate Testing Dependencies**: Mock external dependencies like API calls, local storage, and other contexts to isolate the context being tested.

3. **Test the Full Lifecycle**: Test initialization, state changes, async operations, and cleanup to ensure complete coverage.

4. **Use Role-Based Selectors**: When testing UI components that consume context, prefer role-based selectors over implementation details.

5. **Test Error Handling**: Verify that error states are properly handled and reported to components.

## Context Testing Patterns

### 1. Testing Context Hooks

For testing hooks that access context, use the `renderHookWithProvider` utility:

```tsx
import { renderHookWithProvider } from '../test/context-utils/testing-library';
import { MockWorkoutProvider } from '../test/context-utils/workout-context';
import { useWorkout } from './useWorkout';

test('useWorkout provides workout data', () => {
  const { result } = renderHookWithProvider(
    () => useWorkout(),
    MockWorkoutProvider,
    { initialWorkouts: [mockWorkout] }
  );
  
  expect(result.current.workouts).toEqual([mockWorkout]);
});
```

Alternatively, use the `createProviderWrapper` utility with `renderHook`:

```tsx
import { renderHook } from '@testing-library/react-hooks';
import { createProviderWrapper } from '../test/context-utils/testing-library';
import { MockWorkoutProvider } from '../test/context-utils/workout-context';

test('hook accesses context data correctly', () => {
  const { result } = renderHook(() => useMyHook(), {
    wrapper: createProviderWrapper(MockWorkoutProvider, {
      initialWorkouts: [mockWorkout]
    })
  });
  
  expect(result.current.data).toBeDefined();
});
```

### 2. Testing Components with Context

For components that consume context:

```tsx
import { renderWithWorkoutContext } from '../test/context-utils/workout-context';
import WorkoutList from './WorkoutList';

test('WorkoutList shows workouts from context', () => {
  renderWithWorkoutContext(<WorkoutList />, {
    initialWorkouts: [mockWorkout1, mockWorkout2]
  });
  
  expect(screen.getByText(mockWorkout1.title)).toBeInTheDocument();
  expect(screen.getByText(mockWorkout2.title)).toBeInTheDocument();
});
```

### 3. Testing Components with Multiple Contexts

Use the `renderWithAllProviders` utility for components that need multiple contexts:

```tsx
import { renderWithAllProviders } from '../test/context-utils/nested-providers';
import UserProfile from './UserProfile';

test('profile combines user and workout data', () => {
  renderWithAllProviders(<UserProfile />, {
    initialUser: authenticatedMockUser,
    initialWorkouts: mockWorkouts,
    workoutLoading: false
  });
  
  expect(screen.getByText(authenticatedMockUser.displayName)).toBeInTheDocument();
  expect(screen.getByText(mockWorkouts[0].title)).toBeInTheDocument();
});
```

### 4. Testing Async Context Operations

For contexts with async operations:

```tsx
test('loads workouts asynchronously', async () => {
  const user = userEvent.setup();
  renderWithWorkoutContext(<WorkoutList />);
  
  // Click a button that triggers loading
  await user.click(screen.getByText('Load Workouts'));
  
  // Check loading state
  expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  
  // Wait for workouts to load
  await waitFor(() => {
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
  });
  
  // Verify workouts are displayed
  expect(screen.getByText('Workout Title')).toBeInTheDocument();
});
```

### 5. Testing Context Error States

For testing error handling:

```tsx
test('shows error message when loading fails', async () => {
  const user = userEvent.setup();
  
  renderWithWorkoutContext(<WorkoutList />, {
    shouldFailOnLoad: true
  });
  
  await user.click(screen.getByText('Load Workouts'));
  
  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

## Testing Utilities

Our application provides several context testing utilities:

### Base Utilities

- `createProviderWrapper`: Creates a wrapper function for any context provider
- `createNestedProviders`: Creates a wrapper for multiple nested context providers
- `renderWithProvider`: Renders a component with a single context provider
- `renderHookWithProvider`: Renders a hook with a context provider
- `createMockContextValue`: Creates mock context values with mocked functions

### User Context Utilities

- `renderWithUserContext`: Renders components with UserContext
- `MockAppProvider`: Mock provider for UserContext
- `authenticatedMockUser`, `adminMockUser`: Sample user data
- `simulateLogin`, `simulateLogout`: Helpers for auth testing

### Workout Context Utilities

- `renderWithWorkoutContext`: Renders components with WorkoutContext
- `MockWorkoutProvider`: Mock provider for WorkoutContext
- `mockWorkouts`: Sample workout data
- `createMockWorkout`, `createMockExercise`: Factory functions for test data

### Nested Providers

- `renderWithAllProviders`: Renders with all application contexts
- `TestProviders`: Combined provider for all contexts
- `createTestProvidersWrapper`: Creates a wrapper for multiple contexts

## Testing Guidelines

### 1. Setting Up Tests

When testing context-dependent code, start by importing the appropriate testing utilities:

```tsx
import { renderWithUserContext } from '../test/context-utils/user-context';
import { renderWithWorkoutContext } from '../test/context-utils/workout-context';
```

### 2. Testing Initial State

Always test that the context provides the expected initial state:

```tsx
test('provides default state', () => {
  const { result } = renderHook(() => useWorkoutContext(), {
    wrapper: createProviderWrapper(MockWorkoutProvider, {})
  });
  
  expect(result.current.workouts).toEqual([]);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeNull();
});
```

### 3. Testing State Updates

Test that context actions update state correctly:

```tsx
test('updates state after user logs in', async () => {
  const { result } = renderHook(() => useUser(), {
    wrapper: createProviderWrapper(MockAppProvider, {})
  });
  
  // Perform login
  await act(async () => {
    await result.current.login('test@example.com', 'password');
  });
  
  // Verify state updated
  expect(result.current.user.isAuthenticated).toBe(true);
  expect(result.current.user.email).toBe('test@example.com');
});
```

### 4. Testing Components with Context

When testing components that consume context, focus on how they render and interact with the context:

```tsx
test('shows user profile when authenticated', () => {
  renderWithUserContext(<UserProfile />, {
    initialUser: authenticatedMockUser
  });
  
  expect(screen.getByText(authenticatedMockUser.displayName)).toBeInTheDocument();
  expect(screen.getByText(authenticatedMockUser.email)).toBeInTheDocument();
});
```

### 5. Testing Error States

Always test how your component handles error states in the context:

```tsx
test('shows error UI when context has error', () => {
  renderWithWorkoutContext(<WorkoutList />, {
    initialError: 'Failed to load workouts'
  });
  
  expect(screen.getByText(/failed to load workouts/i)).toBeInTheDocument();
  expect(screen.queryByTestId('workout-list')).not.toBeInTheDocument();
});
```

## Common Pitfalls

1. **Test Contamination**: Always use a fresh context provider for each test, or clear state between tests.

2. **Missing act() Warnings**: Wrap state-changing operations in `act()` to ensure React has processed all updates.

3. **Async Testing**: Use `await waitFor(() => {})` to properly test async state updates.

4. **Over-mocking**: Only mock what's necessary to isolate the component/context under test.

5. **Missing Cleanup**: Properly clean up subscriptions or timers to prevent memory leaks.

## Conclusion

Following these patterns will help ensure robust testing of your context-dependent components. By properly testing contexts, you can catch state management issues early and ensure that your components receive the data they need to function correctly. 