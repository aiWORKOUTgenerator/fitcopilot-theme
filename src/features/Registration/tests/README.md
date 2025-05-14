# Registration Tests

This directory contains tests for the Registration feature of the FitCopilot application. The tests cover various aspects of the registration flow, including custom hooks, components, event handling, and analytics tracking.

## Test Organization

The tests are organized as follows:

- `tests/` - Contains all test files for the Registration feature
  - `*.test.tsx` - Test files for Registration components and hooks
  - `*.simple.test.tsx` - Simplified test versions for quick debugging
  - `utils/` - Shared test utilities and mock implementations
  - `setup.ts` - Common setup file that is imported by most tests

## Testing Patterns

### 1. Mocking Strategy

We use a consistent mocking strategy across all Registration tests:

- **Storage Mocking**: Mock implementations of localStorage and sessionStorage
- **Event Manager Mocking**: Mock implementation of the transition event system
- **Analytics Mocking**: Mock implementations of analytics tracking services
- **Logger Mocking**: Silent logger mock to prevent console noise in tests

### 2. Component Testing

For components, we follow these patterns:

- Use role-based selectors (`getByRole`) as the primary selection strategy
- Use data-testid attributes for complex scenarios (`getByTestId`)
- Test UI interactions with `userEvent` for more realistic user actions
- Verify component behavior rather than implementation details

### 3. Hook Testing

For custom hooks, we follow these patterns:

- Use `renderHook` from React Testing Library
- Test observable behavior rather than internal implementation
- Verify state transitions through result changes
- Test both success paths and error conditions

### 4. Event Testing

For event handling, we follow these patterns:

- Test event subscription and unsubscription
- Verify event propagation to appropriate listeners
- Test each transition type (standard, back, direct, etc.)
- Ensure proper event metadata is included

### 5. Analytics Testing

For analytics tracking, we follow these patterns:

- Verify correct events are tracked for UI interactions
- Test data structure of tracked events
- Ensure user identification works correctly
- Test page view tracking

## Test Utilities

### Integration Test Utilities

Located in `utils/testIntegration.ts`, these utilities provide a comprehensive set of tools for testing the Registration feature.

Key functions include:

- `setupMockStorage()` - Creates a mock storage implementation
- `setupMockTransitionEventManager()` - Creates a mock event manager
- `setupMockAnalytics()` - Creates mock analytics services
- `setupMockLogger()` - Creates a mock logger
- `createMockRegistrationData()` - Creates test data for registration
- `renderWithProviders()` - Custom render function with all necessary providers
- `setupIntegrationTest()` - One-stop function to set up all mocks
- `cleanupIntegrationTest()` - Clean up after tests

### Simple Test Utilities

Located in `utils/testSimple.ts`, these utilities provide simpler versions of test tools for quick debugging.

## Best Practices

1. **Isolation**: Each test should be independent and not rely on the state of other tests.
2. **Cleanup**: Always clean up after tests using `afterEach` or `afterAll` hooks.
3. **Realistic Testing**: Use `userEvent` instead of `fireEvent` when simulating user actions.
4. **Clear Assertions**: Make assertions that clearly indicate what behavior is being tested.
5. **Consistent Patterns**: Follow the established patterns for consistency across the test suite.

## Examples

### Component Test Example

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setupIntegrationTest } from './utils';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    setupIntegrationTest();
  });

  test('displays correct content', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByRole('heading')).toHaveTextContent('My Component');
  });

  test('handles button click', async () => {
    const handleClick = jest.fn();
    renderWithProviders(<MyComponent onClick={handleClick} />);
    
    await userEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Test Example

```tsx
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../hooks/useMyHook';
import { setupIntegrationTest } from './utils';

describe('useMyHook', () => {
  beforeEach(() => {
    setupIntegrationTest();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('default');
  });

  test('updates value on setValue call', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.setValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
}); 