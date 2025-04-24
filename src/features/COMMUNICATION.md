# Component Communication Patterns

This document outlines the standard communication patterns between components within our feature-first architecture.

## Communication Types

### 1. Intra-Feature Communication

Communication between components within the same feature should leverage:

#### Props Drilling (for shallow hierarchies)

```typescript
// Parent Component
import { ChildComponent } from './components';

function ParentComponent() {
  const [data, setData] = useState();
  
  const handleAction = () => {
    // Handle action
  };
  
  return <ChildComponent data={data} onAction={handleAction} />;
}
```

#### Context API (for deeper hierarchies)

```typescript
// Create a feature-specific context
export const FeatureContext = createContext<FeatureContextType | null>(null);

// Provider in parent
function FeatureContainer() {
  const [state, setState] = useState();
  
  return (
    <FeatureContext.Provider value={{ state, setState }}>
      <ChildComponents />
    </FeatureContext.Provider>
  );
}

// In child component
function ChildComponent() {
  const context = useContext(FeatureContext);
  // Use context
}
```

#### Custom Hooks (for shared logic)

```typescript
// Feature-specific hook
function useFeatureLogic() {
  // Shared logic
  return { data, actions };
}

// Used in multiple components
function ComponentA() {
  const { data, actions } = useFeatureLogic();
  // Use data and actions
}
```

### 2. Inter-Feature Communication

For communication between different features, use:

#### Service Layer

Features should communicate through the service layer rather than directly:

```typescript
// Feature A
import { sharedService } from '../../services';

function FeatureAComponent() {
  useEffect(() => {
    // Register for notifications
    const unsubscribe = sharedService.subscribe({
      onEvent: (data) => {
        // Handle event
      }
    });
    
    return unsubscribe;
  }, []);
  
  const triggerAction = () => {
    // Trigger action via service
    sharedService.performAction();
  };
}
```

#### Event Bus (for looser coupling)

For unrelated features that need minimal communication:

```typescript
// Event types
export enum AppEvents {
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  FEATURE_COMPLETED = 'FEATURE_COMPLETED'
}

// Feature A
import { eventBus } from '../../utils/eventBus';

function FeatureA() {
  const handleLogin = () => {
    eventBus.emit(AppEvents.USER_LOGGED_IN, { userId: 123 });
  };
}

// Feature B
function FeatureB() {
  useEffect(() => {
    const handleUserLogin = (data) => {
      // React to login
    };
    
    eventBus.on(AppEvents.USER_LOGGED_IN, handleUserLogin);
    return () => eventBus.off(AppEvents.USER_LOGGED_IN, handleUserLogin);
  }, []);
}
```

### 3. Global State Management

For truly global state (authentication, theme, etc.):

#### Application Context

```typescript
// AppContext.tsx
export const AppContext = createContext();

export function AppProvider({ children }) {
  // Global state & logic
  return <AppContext.Provider value={...}>{children}</AppContext.Provider>;
}

// Usage in any feature
import { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';

function Component() {
  const { theme, user } = useContext(AppContext);
}
```

## Communication Principles

1. **Minimize Cross-Feature Dependencies**
   - Features should be self-contained as much as possible
   - Communicate through clean interfaces, not direct imports

2. **Encapsulate Feature Logic**
   - Keep feature-specific logic within the feature
   - Expose only what's necessary for other features

3. **Service Abstraction**
   - Use service interfaces for cross-feature data access
   - Implement concrete services independently from features

4. **Consistent Patterns**
   - Use context for component trees
   - Use services for cross-feature data
   - Use hooks for behavior sharing
   - Use events for loose coupling

## Examples

### Example: User Authentication Flow

1. Auth service handles login/logout logic
2. App context provides user state globally
3. Features react to auth state changes via context
4. Features request auth actions via service

### Example: Theme Switching

1. Theme service manages theme settings
2. App context provides current theme
3. Components consume theme via context
4. Settings feature updates theme via service 