# Type-Safe Testing Patterns

This document outlines the type-safe testing patterns implemented as part of Phase 3.2 of the ESLint Warning Remediation Plan. These patterns eliminate `any` types from the testing framework and provide better type safety and improved developer experience.

## Table of Contents

- [Key Concepts](#key-concepts)
- [Render Utilities](#render-utilities)
- [Event Utilities](#event-utilities)
- [Provider Utilities](#provider-utilities)
- [Migration Guide](#migration-guide)
- [Common Patterns](#common-patterns)

## Key Concepts

### Typed Event Handling

We've replaced generic event handlers with properly typed events for better type safety:

```typescript
// BEFORE: Using any type
const handleClick = (e: any) => {
  e.preventDefault();
  console.log(e.target.value);
};

// AFTER: Using proper event types
import { ButtonClickEvent, ButtonClickHandler } from '../../types/events';

const handleClick: ButtonClickHandler = (e) => {
  e.preventDefault();
  console.log(e.currentTarget.value);
};
```

### Discriminated Union Patterns

We've implemented discriminated unions for complex types to provide better type checking:

```typescript
// BEFORE: Generic options type
interface RenderOptions {
  providerProps?: any;
  route?: string;
  initialState?: any;
}

// AFTER: Discriminated union pattern
export interface RouterOptions {
  route: string;
  routerProps?: {
    initialEntries?: string[];
    initialIndex?: number;
  };
}

export interface StateOptions {
  initialState?: Record<string, unknown>;
}

export interface ProviderOptions {
  providerProps?: TestProviderOptions;
}

export type CustomRenderOptions =
  TestRenderOptions &
  Partial<RouterOptions> &
  Partial<StateOptions> &
  ProviderOptions;
```

### Type-Safe Generics

We've added proper generic constraints to provide better type checking while maintaining flexibility:

```typescript
// BEFORE: Generic function without constraints
function createMock<T>(defaultValue: T): T {
  // implementation
}

// AFTER: Generic function with constraints
function createMock<T extends Record<string, unknown>>(defaultValue: T): T {
  // implementation
}
```

## Render Utilities

### renderWithProviders

The main render utility now has proper type safety:

```typescript
const { getByTestId } = render(<Button label="Click me" />, {
  providerProps: {
    userContext: {
      user: {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      }
    }
  }
});
```

### renderHook

The hook render utility now has proper typing for hook props and results:

```typescript
const { result, rerender } = renderHook(
  (props: { initialCount: number }) => useCounter(props.initialCount),
  { initialProps: { initialCount: 5 } }
);

expect(result.current.count).toBe(5);

// Rerender with new props
rerender({ initialCount: 10 });
expect(result.current.count).toBe(10);
```

## Event Utilities

We've added type-safe event utilities to replace the generic fireEvent:

```typescript
// BEFORE
fireEvent.change(input, { target: { value: 'test' } });
fireEvent.click(button);

// AFTER
import { changeInput, clickButton } from '../utils/events';

changeInput(inputElement, 'test');
clickButton(buttonElement);
```

Full list of event utilities:

- `changeInput` - Type-safe input change
- `changeCheckbox` - Type-safe checkbox change
- `changeSelect` - Type-safe select change
- `clickButton` - Type-safe button click
- `submitForm` - Type-safe form submission

For custom events, you can use the generic `fireEvent` utility:

```typescript
import { fireEvent } from '../utils/events';

fireEvent(element, 'click', { preventDefault: jest.fn() });
fireEvent(element, 'change', { target: { value: 'test' } });
```

## Provider Utilities

### createTestProviders

The provider utilities now have proper type safety:

```typescript
const TestProviders = createTestProviders({
  userContext: {
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    }
  },
  workoutContext: {
    workouts: [
      {
        id: 'workout-1',
        name: 'Morning Routine',
        exercises: []
      }
    ]
  }
});

const { getByTestId } = render(
  <TestProviders>
    <Component />
  </TestProviders>
);
```

### Context Mock Utilities

The context mock utilities now return properly typed providers:

```typescript
const { Provider, mockValue } = createUserContextMock({
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin'
  }
});

const { getByTestId } = render(
  <Provider>
    <Component />
  </Provider>
);
```

## Migration Guide

To migrate your existing tests to use the new type-safe testing utilities:

1. Replace imports:

```typescript
// BEFORE
import { render, fireEvent } from '@testing-library/react';

// AFTER
import { render } from '../utils/render';
import { changeInput, clickButton } from '../utils/events';
```

2. Replace event handling:

```typescript
// BEFORE
fireEvent.change(input, { target: { value: 'test' } });
fireEvent.click(button);

// AFTER
changeInput(input, 'test');
clickButton(button);
```

3. Update render options:

```typescript
// BEFORE
render(<Component />, { 
  route: '/dashboard',
  initialState: { user: { name: 'Test' } },
  wrapper: CustomProvider
});

// AFTER
render(<Component />, {
  route: '/dashboard',
  initialState: { user: { name: 'Test' } },
  wrapper: CustomProvider
});
```

4. Add proper type assertions for elements:

```typescript
// BEFORE
const input = getByTestId('input');
changeInput(input, 'test'); // Type error!

// AFTER
const input = getByTestId('input') as HTMLInputElement;
changeInput(input, 'test'); // Works correctly
```

## Common Patterns

### Button Click Testing

```typescript
test('calls onClick handler when clicked', () => {
  const handleClick = jest.fn();
  const { getByTestId } = render(<Button label="Click me" onClick={handleClick} />);
  const button = getByTestId('test-button') as HTMLButtonElement;
  
  clickButton(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Form Submission Testing

```typescript
test('submits the form with input values', () => {
  const handleSubmit = jest.fn();
  const { getByTestId } = render(<Form onSubmit={handleSubmit} />);
  
  const nameInput = getByTestId('name-input') as HTMLInputElement;
  const emailInput = getByTestId('email-input') as HTMLInputElement;
  const form = getByTestId('test-form') as HTMLFormElement;
  
  changeInput(nameInput, 'John Doe');
  changeInput(emailInput, 'john@example.com');
  submitForm(form);
  
  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

### Hook Testing

```typescript
test('increments counter', () => {
  const { result } = renderHook(
    (props: { initialCount: number }) => useCounter(props.initialCount),
    { initialProps: { initialCount: 0 } }
  );
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Provider Context Testing

```typescript
test('shows user profile when authenticated', () => {
  const { getByText } = render(<UserProfile />, {
    providerProps: {
      userContext: {
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        },
        isAuthenticated: true
      }
    }
  });
  
  expect(getByText('Test User')).toBeInTheDocument();
});
```

These patterns ensure that your tests are type-safe, maintainable, and provide a better developer experience with proper autocompletion and type checking. 