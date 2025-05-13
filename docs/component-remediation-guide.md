# Component Remediation Guide

This guide provides a systematic approach for eliminating ESLint warnings in components following our standardized type patterns.

## Remediation Process

For each component with ESLint warnings, follow this 6-step process:

### 1. Analyze Component Warnings

```bash
# Generate detailed report for a specific component
npm run warning-report -- --output=reports/component-name-warnings.json
grep -r "ComponentName" reports/component-name-warnings.json
```

Look for patterns in the warnings:
- Type-related warnings (`@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`)
- Hook-related warnings (`react-hooks/exhaustive-deps`)
- Import-related warnings (unused imports)

### 2. Determine Type Pattern Needed

**For UI Components:**
- Does it represent different HTML elements? → Use `type` discriminator
- Does it represent styling variations? → Use `variant` discriminator

**For Feature Components:**
- What data types does it handle?
- What event handlers does it need?
- Are there multiple distinct states/variations?

### 3. Implement Type System

1. Create or update the type definition file in `/src/types/[component-name].ts`
2. Create or update type guards in `/utils/typeGuards/[component]TypeGuards.ts`
3. Ensure all event handlers are defined in `events.ts`

**Example type system implementation:**

```typescript
// In types/notification.ts
import { ComponentEvent } from './events';

export interface BaseNotificationProps {
  id: string;
  message: string;
  onClose?: (id: string) => void;
}

export interface InfoNotificationProps extends BaseNotificationProps {
  variant: 'info';
  infoIcon?: string;
}

export interface ErrorNotificationProps extends BaseNotificationProps {
  variant: 'error';
  errorCode?: string;
  retryAction?: () => void;
}

export type NotificationProps = InfoNotificationProps | ErrorNotificationProps;

// In utils/typeGuards/notificationTypeGuards.ts
import { NotificationProps, InfoNotificationProps, ErrorNotificationProps } from '../../types/notification';

export function isInfoNotification(props: NotificationProps): props is InfoNotificationProps {
  return props.variant === 'info';
}

export function isErrorNotification(props: NotificationProps): props is ErrorNotificationProps {
  return props.variant === 'error';
}
```

### 4. Update Component Implementation

1. Replace `any` types with proper types
2. Use type guards for conditional rendering
3. Properly type all functions and event handlers
4. Fix hook dependencies using the proper types

**Example component implementation:**

```tsx
import React from 'react';
import { NotificationProps } from '../../types/notification';
import { isInfoNotification, isErrorNotification } from '../../utils/typeGuards/notificationTypeGuards';
import { logger } from '../../utils/logger';

export const Notification: React.FC<NotificationProps> = (props) => {
  const handleClose = React.useCallback(() => {
    if (props.onClose) {
      props.onClose(props.id);
    }
  }, [props.id, props.onClose]);

  if (isInfoNotification(props)) {
    return (
      <div className="notification notification--info">
        {props.infoIcon && <span className="notification__icon">{props.infoIcon}</span>}
        <p>{props.message}</p>
        <button onClick={handleClose}>Close</button>
      </div>
    );
  }

  if (isErrorNotification(props)) {
    return (
      <div className="notification notification--error">
        <p>{props.message}</p>
        {props.errorCode && <span>Error code: {props.errorCode}</span>}
        {props.retryAction && <button onClick={props.retryAction}>Retry</button>}
        <button onClick={handleClose}>Close</button>
      </div>
    );
  }

  logger.error(`Unsupported notification variant: ${props.variant}`);
  return null;
};
```

### 5. Address Hook Dependencies

Hook dependency arrays should match the types of all accessed variables:

```tsx
// Before
useEffect(() => {
  fetchData(userId);
}, []); // Missing dependency

// After
useEffect(() => {
  fetchData(userId);
}, [userId]); // Dependency matches the accessed variable
```

For complex dependencies:

```tsx
// Before
useEffect(() => {
  const result = complexFunction(param1, param2);
  setData(result);
}, [param1]); // Missing param2

// After - Option 1: Add all dependencies
useEffect(() => {
  const result = complexFunction(param1, param2);
  setData(result);
}, [param1, param2]);

// After - Option 2: Move function inside effect
useEffect(() => {
  const processData = () => {
    const result = complexFunction(param1, param2);
    setData(result);
  };
  processData();
}, [param1, param2]);

// After - Option 3: Use useCallback for stable function references
const processData = useCallback(() => {
  const result = complexFunction(param1, param2);
  return result;
}, [param1, param2]);

useEffect(() => {
  setData(processData());
}, [processData]);
```

### 6. Verify Resolution

After implementing the changes:

```bash
# Verify warnings were addressed
npm run warning-report -- --output=reports/component-name-warnings-fixed.json
grep -r "ComponentName" reports/component-name-warnings-fixed.json
```

## Component Priority Order

Address components in this order to maximize impact:

1. UI Components with highest warning counts
   - Button, Card, Form components used across many features
   
2. Shared utility components
   - Media, Layout, Navigation components used in multiple features
   
3. Feature-specific components
   - Address one feature at a time (Homepage → Registration → etc.)
   - Start with the highest warning count features

## Common Remediation Patterns

### Event Handling Pattern

```typescript
// Before
const handleChange = (e: any) => {
  setValue(e.target.value);
};

// After
import { InputChangeHandler } from '../../types/events';

const handleChange: InputChangeHandler = (e) => {
  setValue(e.target.value);
};
```

### API Data Pattern

```typescript
// Before
const [data, setData] = useState<any>(null);

// After
interface UserData {
  id: string;
  name: string;
  email: string;
}

const [data, setData] = useState<UserData | null>(null);
```

### Props Destructuring Pattern

```typescript
// Before
const MyComponent = ({ id, name, ...rest }: any) => {
  // ...
};

// After
interface MyComponentProps {
  id: string;
  name: string;
  className?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ id, name, ...rest }) => {
  // ...
};
```

## Special Considerations

### Conditional Prop Types

For components where certain props depend on others:

```typescript
// For props that are conditional based on a discriminator
interface BaseProps {
  variant: 'a' | 'b';
}

interface VariantAProps extends BaseProps {
  variant: 'a';
  aSpecificProp: string; // Required for variant 'a'
}

interface VariantBProps extends BaseProps {
  variant: 'b';
  bSpecificProp: number; // Required for variant 'b'
}

type CombinedProps = VariantAProps | VariantBProps;
```

### Third-Party Libraries Without Types

For third-party libraries without type definitions:

```typescript
// Create a declaration file (custom.d.ts)
declare module 'untyped-library' {
  export interface LibraryOptions {
    feature1?: boolean;
    feature2?: string;
  }
  
  export default function doSomething(options: LibraryOptions): void;
}
```

## Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Circular dependencies | Move shared types to a separate file |
| Type guard not narrowing | Ensure discriminator property is required (not optional) |
| Missing props in a union | Create a more specific interface or type |
| Complex hook dependencies | Extract complex logic to useCallback or useMemo |
| Event handlers not typed correctly | Use the centralized event handlers from events.ts |

By following this guide, you'll systematically eliminate ESLint warnings while ensuring consistent implementation of our standardized type patterns across the codebase. 