# TypeScript Patterns for FitCopilot

This guide outlines common TypeScript patterns used throughout the FitCopilot codebase to maintain type safety and prevent ESLint warnings.

## Table of Contents
- [Event Handling Patterns](#event-handling-patterns)
- [Component Props Patterns](#component-props-patterns)
- [Hooks Patterns](#hooks-patterns)
- [API Integration Patterns](#api-integration-patterns)
- [Avoiding `any` Types](#avoiding-any-types)

## Event Handling Patterns

### Using Typed Event Handlers

Instead of using `any` types for events, use the appropriate event types from `src/types/events.ts`:

```typescript
// ❌ Bad - Using any type
const handleClick = (e: any) => {
  e.preventDefault();
  // ...
};

// ✅ Good - Using proper event type
import { ButtonClickEvent, ButtonClickHandler } from '../types/events';

// Option 1: Use the event type directly
const handleClick = (e: ButtonClickEvent) => {
  e.preventDefault();
  // ...
};

// Option 2: Use the handler type (preferred)
const handleClick: ButtonClickHandler = (e) => {
  e.preventDefault();
  // ...
};
```

### Common Event Types

| Event Type | Handler Type | Use Case |
|------------|--------------|----------|
| `ButtonClickEvent` | `ButtonClickHandler` | Button click events |
| `InputChangeEvent` | `InputChangeHandler` | Input change events |
| `FormSubmitEvent` | `FormSubmitHandler` | Form submission events |
| `SelectChangeEvent` | `SelectChangeHandler` | Select dropdown changes |

## Component Props Patterns

### Using Discriminated Unions for Component Variants

```typescript
// Base props interface
interface BaseButtonProps {
  label: string;
  onClick?: ButtonClickHandler;
  // ... common properties
}

// Variant-specific props
interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  // ... primary-specific properties
}

interface SecondaryButtonProps extends BaseButtonProps {
  variant: 'secondary';
  // ... secondary-specific properties
}

// Discriminated union type
type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;

// Component implementation
const Button: React.FC<ButtonProps> = (props) => {
  // Type narrowing with discriminated union
  if (props.variant === 'primary') {
    // TypeScript knows props has PrimaryButtonProps properties
    return <PrimaryButton {...props} />;
  } else {
    // TypeScript knows props has SecondaryButtonProps properties
    return <SecondaryButton {...props} />;
  }
};
```

### Using ExtendedCSSProperties for Custom CSS Variables

```typescript
import { ExtendedCSSProperties } from '../types/components';

interface CardProps {
  accentColor?: string;
  style?: ExtendedCSSProperties;
}

const Card: React.FC<CardProps> = ({ accentColor, style, children }) => {
  const cardStyle: ExtendedCSSProperties = {
    '--card-accent-color': accentColor,
    ...style
  };

  return <div style={cardStyle}>{children}</div>;
};
```

## Hooks Patterns

### Safe Async Effects with AbortController

```typescript
import { useAsyncEffect } from '../hooks/useAsyncEffect';

const Component = () => {
  const [data, setData] = useState<DataType | null>(null);
  
  useAsyncEffect(async (signal) => {
    try {
      const response = await fetchWithAbort('/api/data', signal);
      if (!signal.aborted) {
        setData(response.data);
      }
    } catch (error) {
      if (!signal.aborted) {
        console.error('Failed to fetch data', error);
      }
    }
  }, []);
  
  // ...
};
```

### Using useEventCallback for Callbacks with Dependencies

```typescript
import useEventCallback from '../hooks/useEventCallback';

const Component = ({ user, onUpdate }) => {
  // This will always use the latest 'user' and 'onUpdate'
  // without causing unnecessary rerenders
  const handleSave = useEventCallback(() => {
    onUpdate(user.id, { /* updated fields */ });
  }, [user.id]);
  
  return <button onClick={handleSave}>Save</button>;
};
```

## API Integration Patterns

### Using Generic API Hooks

```typescript
// Define response type 
interface UserData {
  id: number;
  name: string;
  email: string;
}

// Use the generic API hook with type parameter
const UserProfile = ({ userId }) => {
  const { data, loading, error, fetchApi } = useApi<UserData>();
  
  useEffect(() => {
    fetchApi(`/api/users/${userId}`);
  }, [userId, fetchApi]);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;
  
  // TypeScript knows data is UserData
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
};
```

### Type-Safe API Responses

```typescript
// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Type-specific response
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
  };
}

// Type-safe API call
const login = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  return data as ApiResponse<LoginResponse>;
};
```

## Avoiding `any` Types

### Using `unknown` Instead of `any`

```typescript
// ❌ Bad - Using any
function processData(data: any) {
  return data.value; // No type safety
}

// ✅ Good - Using unknown with type guards
function processData(data: unknown) {
  // Type guard
  if (data && typeof data === 'object' && 'value' in data) {
    return data.value;
  }
  throw new Error('Invalid data format');
}
```

### Using Record for Object Types

```typescript
// ❌ Bad - Using any for objects
function processOptions(options: any) {
  return options.debug;
}

// ✅ Good - Using Record
function processOptions(options: Record<string, unknown>) {
  return typeof options.debug === 'boolean' ? options.debug : false;
}
```

### Using Specific Types for Arrays

```typescript
// ❌ Bad - Using any[] for arrays
function processItems(items: any[]) {
  return items.map(item => item.name);
}

// ✅ Good - Using specific types
interface Item {
  id: number;
  name: string;
}

function processItems(items: Item[]) {
  return items.map(item => item.name);
}
```

## Conclusion

Following these TypeScript patterns will help maintain type safety, prevent ESLint warnings, and improve code quality throughout the FitCopilot codebase. These patterns have been implemented as part of the ESLint Warning Remediation sprint to address issues and establish a more robust type system.

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint TypeScript Plugin](https://github.com/typescript-eslint/typescript-eslint) 