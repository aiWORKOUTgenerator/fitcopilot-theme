# Type-Safe Event Handling Guide

This guide will help you replace `any` types in the codebase with proper TypeScript types, which is a key part of our ESLint remediation efforts.

## New Type Definitions 

We've created a new type definitions file at `src/types/event-types.ts` that includes common React event types and other utility types.

## How to Use These Types

### 1. Replace Event Handler Any Types

**Before:**
```typescript
const handleClick = (event: any) => {
  // handle click
};

<button onClick={handleClick}>Click me</button>
```

**After:**
```typescript
import { ButtonClickEvent, ButtonClickHandler } from '../types/event-types';

const handleClick: ButtonClickHandler = (event) => {
  // handle click with proper typing
};

// or alternatively:
const handleClick = (event: ButtonClickEvent) => {
  // handle click with proper typing
};

<button onClick={handleClick}>Click me</button>
```

### 2. Replace API Response Any Types

**Before:**
```typescript
const fetchData = async (): Promise<any> => {
  const response = await api.get('/endpoint');
  return response;
};
```

**After:**
```typescript
import { ApiResponse, WordPressApiResponse } from '../types/event-types';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const fetchData = async (): Promise<ApiResponse<UserData>> => {
  const response = await api.get('/endpoint');
  return response;
};

// For WordPress API:
const fetchWpData = async (): Promise<WordPressApiResponse<UserData>> => {
  const response = await wpApi.get('/endpoint');
  return response;
};
```

### 3. Replace Object Any Types

**Before:**
```typescript
interface ComponentProps {
  config: any;
}
```

**After:**
```typescript
import { UnknownObject } from '../types/event-types';

// Option 1: Use UnknownObject for flexibility with safety
interface ComponentProps {
  config: UnknownObject;
}

// Option 2: Define a specific interface (preferred)
interface Config {
  theme: string;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
}

interface ComponentProps {
  config: Config;
}
```

### 4. Replace Form Event Any Types

**Before:**
```typescript
const handleSubmit = (e: any) => {
  e.preventDefault();
  // form submit logic
};
```

**After:**
```typescript
import { FormSubmitEvent, FormSubmitHandler } from '../types/event-types';

const handleSubmit: FormSubmitHandler = (e) => {
  e.preventDefault();
  // form submit logic with proper typing
};
```

## Tips for ESLint Compliance

1. **Always Import Types**: Import types from the central type definitions file instead of redefining them locally.

2. **Use Type Generics**: For components or functions with variable data types, use generics:
   ```typescript
   function processData<T>(data: T): T {
     // process data
     return data;
   }
   ```

3. **Type Component Props**: Always define explicit interfaces for component props:
   ```typescript
   interface ButtonProps {
     variant: 'primary' | 'secondary';
     size: 'small' | 'medium' | 'large';
     onClick: ButtonClickHandler;
   }
   ```

4. **Temporary Type Assertions**: In rare cases where you need to temporarily bypass strict typing:
   ```typescript
   // Use unknown + type assertion instead of any
   const data = someFunction() as unknown as YourType;
   ```

## Getting Help

If you're unsure about the right type to use, check:
- The TypeScript documentation
- React TypeScript cheatsheets
- Ask the team's TypeScript champions 