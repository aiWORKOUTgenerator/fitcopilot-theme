# Type Safety Guide

This guide documents established patterns for eliminating `any` types and ensuring type safety throughout the FitCopilot codebase. Following these patterns will help maintain consistent, type-safe code and prevent common runtime errors.

## Table of Contents

- [Core Patterns](#core-patterns)
  - [Discriminated Union Pattern](#discriminated-union-pattern)
  - [Type Guards](#type-guards)
  - [Handling Unknown Types](#handling-unknown-types)
- [Specific Use Cases](#specific-use-cases)
  - [Event Handling](#event-handling)
  - [API Responses](#api-responses)
  - [Component Props](#component-props)
  - [State Management](#state-management)
  - [Test Utilities](#test-utilities)
- [Refactoring Strategies](#refactoring-strategies)
  - [Replacing `any` with Proper Types](#replacing-any-with-proper-types)
  - [Improving Existing Types](#improving-existing-types)
- [Tools and Resources](#tools-and-resources)
  - [Type Coverage](#type-coverage)
  - [ESLint Rules](#eslint-rules)
  - [CI/CD Integration](#cicd-integration)

## Core Patterns

### Discriminated Union Pattern

The discriminated union pattern is a powerful way to handle components with multiple variants or states.

#### Before

```typescript
// Using 'any' or loose types
interface ButtonProps {
  variant?: string;
  onClick?: (event: any) => void;
  // other props...
}
```

#### After

```typescript
// Base props interface
interface BaseButtonProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

// Variant-specific props with discriminator
interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  onClick?: ButtonClickHandler;
}

interface SecondaryButtonProps extends BaseButtonProps {
  variant: 'secondary';
  onClick?: ButtonClickHandler;
}

// Combine with union type
type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;

// Type guard for runtime checks
function isPrimaryButton(props: ButtonProps): props is PrimaryButtonProps {
  return props.variant === 'primary';
}

// Component with type narrowing
const Button: React.FC<ButtonProps> = (props) => {
  if (isPrimaryButton(props)) {
    // TypeScript now knows this is PrimaryButtonProps
    return <PrimaryButton {...props} />;
  } else {
    // TypeScript knows this is SecondaryButtonProps
    return <SecondaryButton {...props} />;
  }
};
```

### Type Guards

Type guards allow you to narrow types safely at runtime, especially when TypeScript cannot infer the type.

#### Basic Type Guard

```typescript
// Type guard for checking if a value is a non-null object
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

// Type guard for checking if an object has a specific property
function hasProperty<K extends string>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> {
  return isObject(obj) && prop in obj;
}

// Type guard for a specific interface
interface User {
  id: string;
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    hasProperty(value, 'id') &&
    typeof value.id === 'string' &&
    hasProperty(value, 'name') &&
    typeof value.name === 'string' &&
    hasProperty(value, 'email') &&
    typeof value.email === 'string'
  );
}
```

### Handling Unknown Types

Use `unknown` instead of `any` when the type is truly unknown, and add type guards to narrow the type safely.

#### Before

```typescript
function processData(data: any) {
  return data.value.toString(); // Unsafe, could crash at runtime
}
```

#### After

```typescript
function processData(data: unknown) {
  // Type guard
  if (data && typeof data === 'object' && 'value' in data) {
    const value = (data as { value: unknown }).value;
    
    if (value !== null && value !== undefined) {
      return String(value);
    }
  }
  throw new Error('Invalid data format');
}
```

## Specific Use Cases

### Event Handling

Use the centralized event type definitions from `src/types/events.ts` for consistent event handling.

#### Before

```typescript
const handleClick = (e: any) => {
  e.preventDefault();
  console.log(e.target.value); // Unsafe access
};
```

#### After

```typescript
import { ButtonClickEvent, ButtonClickHandler } from '../../types/events';

const handleClick: ButtonClickHandler = (e) => {
  e.preventDefault();
  // TypeScript ensures e.currentTarget exists and has the correct type
  console.log(e.currentTarget.value);
};
```

### API Responses

Use generic interfaces for API responses to ensure type safety across different endpoints.

#### Before

```typescript
async function fetchData(): Promise<any> {
  const response = await fetch('/api/endpoint');
  return response.json();
}
```

#### After

```typescript
// API response interface with generic type parameter
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Specific data interface
interface UserData {
  id: string;
  name: string;
  email: string;
}

// Typed API function
async function fetchUsers(): Promise<ApiResponse<UserData[]>> {
  const response = await fetch('/api/users');
  return response.json();
}

// Usage with type safety
const handleFetchUsers = async () => {
  try {
    const result = await fetchUsers();
    if (result.status === 'success') {
      // TypeScript knows result.data is UserData[]
      const userNames = result.data.map(user => user.name);
    }
  } catch (error) {
    console.error('Failed to fetch users', error);
  }
};
```

### Component Props

Use proper type definitions for component props to prevent runtime errors and improve developer experience.

#### Before

```typescript
const Card = (props: any) => {
  return (
    <div className={props.className}>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
};
```

#### After

```typescript
interface CardProps {
  className?: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ className, title, description, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};
```

### State Management

Use proper typing for state management to ensure type safety across components.

#### Before

```typescript
const [state, setState] = useState<any>({});

// Later in the code
setState({ ...state, user: fetchedUser });
```

#### After

```typescript
interface AppState {
  user: UserData | null;
  isLoading: boolean;
  error: Error | null;
}

const initialState: AppState = {
  user: null,
  isLoading: false,
  error: null
};

const [state, setState] = useState<AppState>(initialState);

// Type-safe state updates
setState({ ...state, user: fetchedUser });
```

### Test Utilities

Use proper typing for test utilities to ensure type safety in tests.

#### Before

```typescript
// Mock service with any types
const mockUserService = {
  getUser: jest.fn().mockResolvedValue({ name: 'Test User' }),
  updateUser: jest.fn().mockResolvedValue({ success: true })
};
```

#### After

```typescript
import { UserService, User } from '../types';

// Properly typed mock service
const mockUserService: jest.Mocked<UserService> = {
  getUser: jest.fn<Promise<User>, [string]>(),
  updateUser: jest.fn<Promise<{ success: boolean }>, [string, Partial<User>]>()
};

// Set up mock implementations
mockUserService.getUser.mockResolvedValue({ id: '1', name: 'Test User', email: 'test@example.com' });
mockUserService.updateUser.mockResolvedValue({ success: true });
```

## Refactoring Strategies

### Replacing `any` with Proper Types

1. **Identify the actual type structure**
   - Examine how the value is used
   - Check function implementations and return values
   - Look for external documentation (e.g., API spec)

2. **Create appropriate interfaces**
   - Define clear interfaces for data structures
   - Use union types for multiple possible shapes
   - Add comments explaining complex type decisions

3. **Add type guards for runtime type checking**
   - Implement type guards for values that could have different shapes
   - Use type assertions after runtime checks

4. **Use generics for reusable code**
   - Replace `any` in generic functions with constrained type parameters
   - Use `extends` to apply type constraints

### Improving Existing Types

1. **Replace loose types with stricter ones**
   - Replace `object` with specific interface or `Record<string, unknown>`
   - Replace `Function` with specific function signature

2. **Add type guards for better type narrowing**
   - Add type guards for complex conditionals
   - Use assertion functions for repeated checks

3. **Refactor to use discriminated unions**
   - Convert related interfaces to use discriminated unions
   - Add type discriminators to existing interfaces

## Tools and Resources

### Type Coverage

Use the type coverage tool to measure type safety in your codebase:

```bash
# Generate type coverage report
npm run type:coverage
```

This will create a report in `reports/type-coverage-report.html` showing files with `any` types and overall type safety metrics.

### ESLint Rules

We use several ESLint rules to enforce type safety:

- `@typescript-eslint/no-explicit-any`: Prevents using `any` type
- `@typescript-eslint/explicit-module-boundary-types`: Enforces return types for exported functions
- `@typescript-eslint/no-unsafe-assignment`: Prevents unsafe assignments
- `@typescript-eslint/no-unsafe-member-access`: Prevents unsafe property access

### CI/CD Integration

Our CI/CD pipeline includes several checks to ensure type safety:

- Type coverage must be above 95%
- PRs that introduce new `any` types will be rejected
- ESLint warnings are tracked over time

For more details, see the [CI/CD Type Safety documentation](./ci-type-safety.md). 