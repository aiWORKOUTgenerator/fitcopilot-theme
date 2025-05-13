# Type Pattern Implementation Guide

This guide provides step-by-step instructions for implementing discriminated union type patterns throughout the FitCopilot codebase. Follow these patterns to maintain type safety and eliminate `any` type usage.

## Discriminated Union Pattern

The discriminated union pattern is our primary approach for creating type-safe component hierarchies. This pattern:

1. Creates a base interface for common properties
2. Extends the base interface for specific variants with a discriminator property
3. Combines variant interfaces into a union type
4. Uses type guards for safe runtime type checking

## Implementation Steps

### 1. Create Type Definitions

Start by creating comprehensive type definitions in the appropriate `src/types/` file:

```typescript
// Step 1: Create base interface with common properties
export interface BaseComponentProps {
  id?: string;
  className?: string;
  style?: ExtendedCSSProperties;
  // ...other common properties
}

// Step 2: Create variant interfaces with discriminators
export interface VariantAProps extends BaseComponentProps {
  variant: 'variantA';  // Discriminator property
  // ...variant-specific properties
}

export interface VariantBProps extends BaseComponentProps {
  variant: 'variantB';  // Discriminator property
  // ...variant-specific properties
}

// Step 3: Create union type combining all variants
export type ComponentProps = VariantAProps | VariantBProps;
```

### 2. Implement Type Guards

Create type guards to safely check component variants:

```typescript
// In the same type definition file
export const isVariantA = (props: ComponentProps): props is VariantAProps => {
  return props.variant === 'variantA';
};

export const isVariantB = (props: ComponentProps): props is VariantBProps => {
  return props.variant === 'variantB';
};
```

### 3. Create Event Handler Types

Define strongly typed event handlers:

```typescript
// Event handler types
export type ComponentClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ComponentChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
```

### 4. Implement Component Structure

Create your component using the discriminated union pattern:

```typescript
import React from 'react';
import { ComponentProps, isVariantA, isVariantB } from '../types/component';
import { logger } from '../utils/logger';

// Variant-specific components
const VariantA: React.FC<ComponentProps> = (props) => {
  if (!isVariantA(props)) return null;
  
  // Type-safe access to variant-specific properties
  return (
    <div className={props.className}>
      {/* VariantA-specific rendering */}
    </div>
  );
};

const VariantB: React.FC<ComponentProps> = (props) => {
  if (!isVariantB(props)) return null;
  
  // Type-safe access to variant-specific properties
  return (
    <div className={props.className}>
      {/* VariantB-specific rendering */}
    </div>
  );
};

// Main component
export const Component: React.FC<ComponentProps> = (props) => {
  if (isVariantA(props)) return <VariantA {...props} />;
  if (isVariantB(props)) return <VariantB {...props} />;
  
  // Log error for unsupported variants
  logger.error(`Unsupported variant: ${props.variant}`);
  return null;
};
```

## Converting Existing `any` Types

When refactoring components that use `any` types, follow this approach:

### Step 1: Identify All Properties Used

Analyze the component to identify all properties currently accessed:

```typescript
// BEFORE
interface ComponentProps {
  data: any;  // Problem: 'any' type
  onEvent: (event: any) => void;  // Problem: 'any' event type
}
```

### Step 2: Create Proper Type Definitions

Replace `any` with proper types:

```typescript
// AFTER
export interface ComponentData {
  id: string;
  name: string;
  value: number;
  // ...all properties used in the component
}

export interface ComponentProps {
  data: ComponentData;
  onEvent: ComponentEventHandler;
}

export type ComponentEventHandler = (event: React.MouseEvent<HTMLElement>) => void;
```

### Step 3: Apply Type Guards for Runtime Safety

For cases where the type might not be known at compile time, use type guards:

```typescript
// Type guard function
export function isComponentData(data: unknown): data is ComponentData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'value' in data
  );
}

// Usage in component
const Component: React.FC<{ data: unknown }> = ({ data }) => {
  if (!isComponentData(data)) {
    logger.error('Invalid data format');
    return null;
  }
  
  // Now TypeScript knows data is ComponentData
  return <div>{data.name}</div>;
};
```

## Event Handler Type Safety

Replace `any` typed event handlers with proper React types:

```typescript
// BEFORE
const handleClick = (e: any) => {
  e.preventDefault();
  // ...
};

// AFTER
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  e.preventDefault();
  // ...
};

// OR using our custom types
const handleClick: ButtonClickHandler = (e) => {
  e.preventDefault();
  // ...
};
```

## Working with API Data

For API responses, use generic types with type guards:

```typescript
// Generic API response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Type guard for API responses
export function isApiResponse<T>(
  response: unknown, 
  dataValidator: (data: unknown) => data is T
): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'status' in response &&
    dataValidator((response as ApiResponse<T>).data)
  );
}

// Usage example
async function fetchWorkout(id: string): Promise<Workout | null> {
  try {
    const response = await fetch(`/api/workouts/${id}`);
    const result = await response.json();
    
    if (isApiResponse(result, isWorkout)) {
      return result.data;
    }
    
    logger.error('Invalid workout data format', result);
    return null;
  } catch (error) {
    logger.error('Error fetching workout', error);
    return null;
  }
}
```

## Using Unknown Instead of Any

Always prefer `unknown` over `any` for values whose types are not known at compile time:

```typescript
// BEFORE
function processData(data: any) {
  // No type safety
  return data.value;
}

// AFTER
function processData(data: unknown) {
  // Type guard for runtime safety
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: unknown }).value;
  }
  throw new Error('Invalid data format');
}
```

## Best Practices

1. **Use discriminated unions** for component variants
2. **Apply type guards** for runtime type safety
3. **Document type patterns** with JSDoc comments
4. **Use specific event types** instead of generic ones
5. **Prefer unknown over any** for type safety
6. **Create reusable type utilities** for common patterns
7. **Follow naming conventions** (PascalCase for types, camelCase for functions)

By following these patterns, we can systematically eliminate `any` types from our codebase and improve type safety throughout the FitCopilot theme. 