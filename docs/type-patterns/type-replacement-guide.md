# Type Replacement Guide

This guide provides standardized patterns for replacing `any` types with proper TypeScript types throughout the FitCopilot codebase.

## Common `any` Use Cases and Replacements

### 1. API Responses

#### Instead of:
```typescript
const fetchUserData = async (userId: string): Promise<any> => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};
```

#### Use:
```typescript
interface UserData {
  id: string;
  name: string;
  email: string;
  // Add all expected properties
}

const fetchUserData = async (userId: string): Promise<UserData> => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json() as UserData;
};
```

For API responses with variable structure, use our `ApiResponse<T>` generic:

```typescript
import { ApiResponse } from '@/types/api/responses';

const fetchUserData = async (userId: string): Promise<ApiResponse<UserData>> => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};
```

### 2. Event Handlers

#### Instead of:
```typescript
const handleClick = (e: any) => {
  e.preventDefault();
  // ...
};
```

#### Use:
```typescript
import { ButtonClickEvent } from '@/types/events';

const handleClick = (e: ButtonClickEvent) => {
  e.preventDefault();
  // ...
};
```

Or use our handler type pattern:

```typescript
import { ButtonClickHandler } from '@/types/events';

const handleClick: ButtonClickHandler = (e) => {
  e.preventDefault();
  // ...
};
```

### 3. Dynamic Objects

#### Instead of:
```typescript
function processConfig(config: any) {
  // ...
}
```

#### Use:
```typescript
// Option 1: For truly unknown shapes, use Record with unknown
function processConfig(config: Record<string, unknown>) {
  // ...
}

// Option 2: Create an interface with optional properties
interface Config {
  debug?: boolean;
  timeout?: number;
  endpoint?: string;
  // Add other potential properties
}

function processConfig(config: Config) {
  // ...
}

// Option 3: Use generics with constraints
function processConfig<T extends Record<string, unknown>>(config: T) {
  // ...
}
```

### 4. External Library Integration

#### Instead of:
```typescript
function handleExternalLib(libInstance: any) {
  libInstance.doSomething();
}
```

#### Use:
```typescript
// Define interface matching the library's API
interface ExternalLib {
  doSomething: () => void;
  // Add other methods/properties as needed
}

function handleExternalLib(libInstance: ExternalLib) {
  libInstance.doSomething();
}
```

### 5. Browser APIs with Vendor Prefixes

#### Instead of:
```typescript
const enterFullscreen = () => {
  const el = document.getElementById('video');
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if ((el as any).webkitRequestFullscreen) {
    (el as any).webkitRequestFullscreen();
  }
};
```

#### Use:
```typescript
import { isElementWithWebkitFullscreen } from '@/utils/typeGuards/domTypeGuards';

const enterFullscreen = () => {
  const el = document.getElementById('video');
  if (!el) return;
  
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (isElementWithWebkitFullscreen(el)) {
    el.webkitRequestFullscreen();
  }
};
```

### 6. Unknown Function Parameters

#### Instead of:
```typescript
function processData(data: any) {
  if (data.value) {
    // ...
  }
}
```

#### Use:
```typescript
// Prefer unknown with type guards
function processData(data: unknown) {
  if (data && typeof data === 'object' && 'value' in data) {
    // TypeScript now knows value exists
    const typedData = data as { value: unknown };
    // ...
  }
}

// Or with proper interfaces
interface DataWithValue {
  value: string;
  // Other properties
}

function isDataWithValue(data: unknown): data is DataWithValue {
  return (
    !!data &&
    typeof data === 'object' &&
    'value' in data &&
    typeof (data as any).value === 'string'
  );
}

function processData(data: unknown) {
  if (isDataWithValue(data)) {
    // TypeScript knows data is DataWithValue here
    console.log(data.value);
  }
}
```

### 7. Mixed Types (Union Types)

#### Instead of:
```typescript
function process(item: any) {
  // ...
}
```

#### Use:
```typescript
function process(item: string | number | boolean) {
  if (typeof item === 'string') {
    // String-specific logic
  } else if (typeof item === 'number') {
    // Number-specific logic
  } else {
    // Boolean logic
  }
}
```

### 8. Type Assertion with Safety

#### Instead of:
```typescript
const getElementValue = (id: string): any => {
  const element = document.getElementById(id) as any;
  return element.value;
};
```

#### Use:
```typescript
const getElementValue = (id: string): string | undefined => {
  const element = document.getElementById(id);
  
  if (element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement) {
    return element.value;
  }
  
  return undefined;
};
```

## Best Practices

1. **Start with `unknown`, not `any`**
   - Use `unknown` when you're unsure of the type
   - Create proper type guards to narrow the type
   - Force explicit type checking before use

2. **Use Discriminated Unions for Complex Types**
   - Add type discriminators (`type`, `variant`, etc.)
   - Enable exhaustive checking in switch statements
   - Make variant-specific properties non-optional

3. **Create Meaningful Interfaces**
   - Model actual data structures, not just property existence
   - Use proper inheritance for related types
   - Keep interfaces focused on single responsibilities

4. **Leverage Type Guards**
   - Create reusable type guards in `src/utils/typeGuards/`
   - Use predicate functions with `is` syntax
   - Test guard functions thoroughly

5. **Document Type Decisions**
   - Add JSDoc comments explaining type choices
   - Document why type assertions are necessary when used
   - Include links to relevant documentation or issues 