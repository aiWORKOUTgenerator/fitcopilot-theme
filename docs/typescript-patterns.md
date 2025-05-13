# TypeScript Patterns for FitCopilot

This guide outlines common TypeScript patterns used throughout the FitCopilot codebase to maintain type safety and prevent ESLint warnings.

## Table of Contents
- [Event Handling Patterns](#event-handling-patterns)
- [Component Props Patterns](#component-props-patterns)
- [Hooks Patterns](#hooks-patterns)
- [API Integration Patterns](#api-integration-patterns)
- [Avoiding `any` Types](#avoiding-any-types)
- [Discriminated Union Pattern](#discriminated-union-pattern)

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

## Discriminated Union Pattern

We use discriminated unions as our primary pattern for type-safe component hierarchies. The pattern follows this structure:

1. Create a base interface for common properties
2. Extend the base interface for specific variants with a discriminator property
3. Combine variant interfaces into a union type
4. Implement type guards for runtime type checking

### Discriminator Property Naming Convention

We use two different discriminator property names based on the nature of the variation:

- **`type`**: Use when components represent fundamentally different HTML elements or behaviors
  - Example: Media component uses `type` because "image" vs "video" are different HTML elements
  
- **`variant`**: Use when components are styling variations of the same base element
  - Example: Card component uses `variant` because all variants are div-based with styling differences

```typescript
// Example using 'type' as discriminator (for different HTML elements)
export interface BaseMediaProps {
  id?: string;
  className?: string;
  alt: string;
}

export interface ImageMediaProps extends BaseMediaProps {
  type: 'image';  // Fundamental difference discriminator
  src: string;
  // ...image-specific properties
}

export interface VideoMediaProps extends BaseMediaProps {
  type: 'video';  // Fundamental difference discriminator
  src: string;
  controls?: boolean;
  // ...video-specific properties
}

export type MediaProps = ImageMediaProps | VideoMediaProps;

// Example using 'variant' as discriminator (for styling differences)
export interface BaseCardProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface ContentCardProps extends BaseCardProps {
  variant: 'content';  // Styling difference discriminator
  title: string;
  // ...content card-specific properties
}

export interface ProfileCardProps extends BaseCardProps {
  variant: 'profile';  // Styling difference discriminator
  name: string;
  // ...profile card-specific properties
}

export type CardProps = ContentCardProps | ProfileCardProps;
```

## Type Guard Organization

Type guards follow a consistent organization pattern:

1. **Interface/Type Definitions**: Located in `/types/[component].ts`
2. **Type Guards**: Located in `/utils/typeGuards/[component]TypeGuards.ts`

This separation provides cleaner separation of concerns:
- Type files define "what things are"
- Type guard files define "how to verify them"

```typescript
// In /types/card.ts
export interface ContentCardProps extends BaseCardProps {
  variant: 'content';
  title: string;
}

export type CardProps = ContentCardProps | ProfileCardProps;

// In /utils/typeGuards/cardTypeGuards.ts
import { CardProps, ContentCardProps } from '../../types/card';

export function isContentCard(props: CardProps): props is ContentCardProps {
  return props.variant === 'content';
}
```

## Event Handler Pattern

Event handlers use a centralized approach:

1. **Central Definitions**: Located in `/types/events.ts`
2. **Naming Convention**: `[Component][Event]Handler` (e.g., `ButtonClickHandler`, `CardSelectHandler`)
3. **Usage**: Import these in component-specific type files

```typescript
// In /types/events.ts
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type ButtonClickHandler = (event: ButtonClickEvent) => void;

// In /types/button.ts
import { ButtonClickHandler } from './events';

export interface ActionButtonProps extends BaseButtonProps {
  onClick: ButtonClickHandler;
}
```

## Conclusion

Following these TypeScript patterns will help maintain type safety, prevent ESLint warnings, and improve code quality throughout the FitCopilot codebase. These patterns have been implemented as part of the ESLint Warning Remediation sprint to address issues and establish a more robust type system.

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint TypeScript Plugin](https://github.com/typescript-eslint/typescript-eslint) 