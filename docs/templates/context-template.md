---
sidebar_position: 6
title: ContextName
description: A React context for providing and accessing shared state across components
keywords: [context, state, React]
tags: [context, state-management, provider]
---

# ContextNameContext

A comprehensive description of the context's purpose, what type of state it manages, and which components in the application should use it. Explain when to use this context versus other state management approaches.

## Import

```tsx
import { useContextName, ContextNameProvider } from '@/contexts/ContextNameContext';
```

## Context Value

```tsx
interface ContextNameValue {
  /** Current state property */
  stateProperty: string;
  
  /** A boolean flag indicating status */
  isLoading: boolean;
  
  /** Error object if an operation failed */
  error: Error | null;
  
  /** Method to update the state */
  updateState: (newValue: string) => void;
  
  /** Method to perform an async operation */
  fetchData: () => Promise<void>;
  
  /** Method to reset the state */
  reset: () => void;
}
```

## Provider Props

```tsx
interface ContextNameProviderProps {
  /** Child components that will have access to the context */
  children: React.ReactNode;
  
  /** Optional initial state */
  initialState?: string;
  
  /** Configuration options */
  options?: {
    persistToStorage?: boolean;
    storageKey?: string;
  };
}
```

## Usage

Basic example showing how to set up the provider and use the context:

```tsx
import { ContextNameProvider, useContextName } from '@/contexts/ContextNameContext';

// At the app or feature level
function App() {
  return (
    <ContextNameProvider initialState="default value">
      <YourComponent />
    </ContextNameProvider>
  );
}

// In a component that needs the context
function YourComponent() {
  const { stateProperty, updateState, isLoading } = useContextName();
  
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Current value: {stateProperty}</p>
          <button onClick={() => updateState('new value')}>
            Update Value
          </button>
        </>
      )}
    </div>
  );
}
```

## Examples

### Basic Provider Setup

```tsx
import { ContextNameProvider } from '@/contexts/ContextNameContext';

function AppRoot() {
  return (
    <ContextNameProvider>
      {/* Your app content */}
    </ContextNameProvider>
  );
}
```

### With Custom Initial State

```tsx
import { ContextNameProvider } from '@/contexts/ContextNameContext';

function FeatureWithCustomState() {
  return (
    <ContextNameProvider 
      initialState="feature-specific-initial-value"
      options={{ persistToStorage: true }}
    >
      <FeatureComponent />
    </ContextNameProvider>
  );
}
```

### Consuming the Context

```tsx
import { useContextName } from '@/contexts/ContextNameContext';

function ConsumerComponent() {
  const { 
    stateProperty, 
    updateState, 
    isLoading, 
    error, 
    fetchData 
  } = useContextName();
  
  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, [fetchData]);
  
  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <div>
      <p>State value: {stateProperty}</p>
      <button onClick={() => updateState('updated value')}>
        Update
      </button>
      <button onClick={fetchData}>Refresh Data</button>
    </div>
  );
}
```

## Technical Implementation

Overview of the technical implementation including state management, side effects, and persistence:

```tsx
// Simplified implementation
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ContextNameContext = createContext<ContextNameValue | undefined>(undefined);

export const ContextNameProvider: React.FC<ContextNameProviderProps> = ({ 
  children, 
  initialState = '', 
  options = {} 
}) => {
  const [stateProperty, setStateProperty] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Method implementations
  const updateState = useCallback((newValue: string) => {
    setStateProperty(newValue);
    // Save to localStorage if persistToStorage is true
    if (options.persistToStorage && options.storageKey) {
      localStorage.setItem(options.storageKey, newValue);
    }
  }, [options]);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // API call or other async operation
      const result = await someAsyncOperation();
      setStateProperty(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    setStateProperty(initialState);
    setError(null);
  }, [initialState]);
  
  // Create memoized context value
  const value = useMemo(() => ({
    stateProperty,
    isLoading,
    error,
    updateState,
    fetchData,
    reset
  }), [stateProperty, isLoading, error, updateState, fetchData, reset]);
  
  return (
    <ContextNameContext.Provider value={value}>
      {children}
    </ContextNameContext.Provider>
  );
};

export const useContextName = () => {
  const context = useContext(ContextNameContext);
  if (!context) {
    throw new Error('useContextName must be used within a ContextNameProvider');
  }
  return context;
};
```

## State Persistence

If the context supports state persistence:

- **Storage Mechanism**: localStorage, sessionStorage, or custom storage
- **Storage Key**: Default key and how to customize it
- **Persistence Strategy**: When and how state is persisted
- **Hydration**: How state is restored from storage on initialization

## Performance Considerations

- Context splitting to minimize re-renders (if applicable)
- Memoization strategies for expensive operations
- When to use context vs. props for state passing
- Selective re-rendering with `useMemo` and `useCallback`

## Best Practices

- Do use this context for...
- Don't use this context when...
- Consider using local state if...
- Combining with other contexts...
- Error handling patterns...

## Error Handling

- How errors are represented in the context
- Error recovery strategies
- Displaying errors to users
- Error boundaries integration

## TypeScript

Additional type utilities related to the context:

```tsx
// Type for actions that can be dispatched
type ContextNameAction = 
  | { type: 'UPDATE'; payload: string }
  | { type: 'RESET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

// Type guard for checking if context is initialized
function isContextInitialized(
  context: ContextNameValue | undefined
): context is ContextNameValue {
  return context !== undefined;
}
```

## Related Contexts

- [RelatedContext1](./related-context-1.md) - Complements this context for X functionality
- [RelatedContext2](./related-context-2.md) - Alternative for Y use cases

## Related Documentation

:::tip Related Documentation
- [State Management Architecture](../architecture/state-management.md)
- [Context Design Patterns](../development/context-patterns.md)
:::

---

## Changelog

| Version | Changes |
|---------|---------|
| v1.0.0  | Initial implementation |
| v1.1.0  | Added persistence options |
| v1.2.0  | Improved error handling |
| v2.0.0  | Migrated to use reducers for complex state |
</rewritten_file> 