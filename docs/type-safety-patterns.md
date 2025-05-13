# TypeScript Type-Safety Patterns

This document outlines proven patterns for eliminating `any` types in TypeScript code, improving type safety while maintaining browser compatibility and runtime reliability.

## Why Eliminate `any` Types?

Using `any` types bypasses TypeScript's type checking, leading to:

- Runtime errors that could have been caught at compile time
- Reduced code discoverability and IDE assistance
- Diminished confidence in type guarantees
- Propagation of `any` types throughout the codebase

## 1. Create Strong Type Definitions

### Before:
```typescript
// Using any for browser compatibility
const enterFullscreen = async (): Promise<void> => {
  const media = mediaRef.current;
  if (!media) return;

  try {
    if (media.requestFullscreen) {
      await media.requestFullscreen();
    } else if ((media as any).webkitRequestFullscreen) {
      await (media as any).webkitRequestFullscreen();
    } else if ((media as any).msRequestFullscreen) {
      await (media as any).msRequestFullscreen();
    }
  } catch (error) {
    console.error('Fullscreen error:', error);
  }
};
```

### After:
```typescript
// Vendor-specific interfaces
interface WebKitHTMLVideoElement extends HTMLVideoElement {
  webkitRequestFullscreen: () => Promise<void>;
}

interface MSHTMLVideoElement extends HTMLVideoElement {
  msRequestFullscreen: () => Promise<void>;
}

// Combined type
type VendorExtendedVideoElement = HTMLVideoElement & 
  WebKitHTMLVideoElement & 
  MSHTMLVideoElement;

// Type guard interfaces
interface WebkitRequestFullscreen {
  webkitRequestFullscreen: () => Promise<void>;
}

interface MsRequestFullscreen {
  msRequestFullscreen: () => Promise<void>;
}

// Type guards
function hasWebkitFullscreenMethods(element: HTMLVideoElement): element is VendorExtendedVideoElement & WebkitRequestFullscreen {
  return 'webkitRequestFullscreen' in element && 
    typeof (element as HTMLVideoElement & WebkitRequestFullscreen).webkitRequestFullscreen === 'function';
}

function hasMsFullscreenMethods(element: HTMLVideoElement): element is VendorExtendedVideoElement & MsRequestFullscreen {
  return 'msRequestFullscreen' in element && 
    typeof (element as HTMLVideoElement & MsRequestFullscreen).msRequestFullscreen === 'function';
}

// Usage with type guards
const enterFullscreen = async (): Promise<void> => {
  const media = mediaRef.current as HTMLVideoElement;
  if (!media || !(media instanceof HTMLVideoElement)) return;

  try {
    if (media.requestFullscreen) {
      await media.requestFullscreen();
    } else if (hasWebkitFullscreenMethods(media)) {
      await media.webkitRequestFullscreen();
    } else if (hasMsFullscreenMethods(media)) {
      await media.msRequestFullscreen();
    }
  } catch (error) {
    logger.error('Fullscreen error:', error);
  }
};
```

### Pattern Details:

1. **Define Vendor-Specific Interfaces**
   - Create interfaces for non-standard browser features
   - Extend standard DOM interfaces rather than using `any`
   - Group related methods in logical interfaces

2. **Create Combined Type Extensions**
   - Combine multiple vendor interfaces to create comprehensive types
   - Use intersection types (`&`) to compose interfaces
   - Enable strong typing across browser-specific features

3. **Use Discriminated Unions for Variants**
   - Add type discriminator fields (`_variant`, `type`, etc.)
   - Create union types for components with multiple variants
   - Enable compile-time checks for conditional rendering

## 2. Implement Runtime Type Guards

### Before:
```typescript
// Unsafe type casting
function handleVideoElement(element: any) {
  if (element && element.play && element.pause) {
    // Assume it's a video element
    element.play();
  }
}
```

### After:
```typescript
// Type guard for video elements
function isVideoElement(element: unknown): element is HTMLVideoElement {
  return element instanceof HTMLVideoElement;
}

// Type guard for audio elements
function isAudioElement(element: unknown): element is HTMLAudioElement {
  return element instanceof HTMLAudioElement;
}

// Type guard for any media element
function isMediaElement(element: unknown): element is HTMLMediaElement {
  return isVideoElement(element) || isAudioElement(element);
}

// Safe usage with type guards
function handleMediaElement(element: unknown) {
  if (isVideoElement(element)) {
    // TypeScript knows this is HTMLVideoElement
    element.play();
  } else if (isAudioElement(element)) {
    // TypeScript knows this is HTMLAudioElement
    element.play();
  } else {
    // Handle non-media elements
    console.warn('Not a media element');
  }
}
```

### Pattern Details:

1. **Create Type Predicates**
   - Use `is` syntax to define type guards
   - Return boolean indicating if value meets type constraints
   - Check both existence and type of properties

2. **Prefer `unknown` Over `any`**
   - Start with `unknown` for parameters of uncertain type
   - Force explicit type checking before use
   - Prevent accidental type leakage

3. **Validate at Property Level**
   - Check for existence of required methods/properties
   - Verify correct types of properties when needed
   - Handle edge cases like null/undefined

4. **Common Type Guard Templates**

   ```typescript
   // Instance check guard
   function isInstance<T extends new (...args: any[]) => any>(
     value: unknown,
     constructor: T
   ): value is InstanceType<T> {
     return value instanceof constructor;
   }

   // Object shape guard
   function isShape<T extends object>(
     value: unknown,
     props: Array<keyof T>
   ): value is T {
     return (
       value !== null &&
       typeof value === 'object' &&
       props.every(prop => prop in value)
     );
   }

   // String literal guard
   function isLiteralType<T extends string>(
     value: string,
     literals: T[]
   ): value is T {
     return literals.includes(value as T);
   }
   ```

## 3. Use Utility Types Over `any`

### Before:
```typescript
// Generic error handler with any
function handleError(error: any) {
  console.error('Error:', error.message || 'Unknown error');
}

// Generic object storage
const cache: { [key: string]: any } = {};

// Generic event handler
const onClick = (e: any) => {
  e.preventDefault();
  console.log(e.target.value);
};
```

### After:
```typescript
// Typed error handler
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else if (typeof error === 'string') {
    console.error('Error:', error);
  } else {
    console.error('Unknown error:', error);
  }
}

// Typed cache with generics
const cache = new Map<string, unknown>();

// Generic but type-safe storage
function setCache<T>(key: string, value: T): void {
  cache.set(key, value);
}

function getCache<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

// Typed event handler
const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  console.log(e.currentTarget.value);
};
```

### Pattern Details:

1. **Replace Common `any` Usages**

   | Instead of... | Use... | When to use |
   |---------------|--------|-------------|
   | `any` | `unknown` | For values of uncertain type that require narrowing |
   | `{ [key: string]: any }` | `Record<string, unknown>` | For objects with unknown property values |
   | `Function` | Specific function type | For callbacks and handlers |
   | `object` | Interface or type | For structured data |
   | `any[]` | `Array<Type>` or `unknown[]` | For arrays of values |
   | `Promise<any>` | `Promise<unknown>` | For promises with unknown resolution type |

2. **Generic Type Parameters**
   - Use generics for flexible but type-safe functions
   - Constrain generics when applicable (`<T extends HTMLElement>`)
   - Use default type parameters when appropriate

3. **Event Handling**
   - Use specific event types for handlers
   - Leverage React's typed events for components
   - Include element type in event generics

## 4. Add Comprehensive Tests

### Before (minimal testing):
```typescript
// Basic test without type checking
test('video element works', () => {
  const video = document.createElement('video');
  expect(video.play).toBeDefined();
});
```

### After (comprehensive type testing):
```typescript
describe('Media Type Guards', () => {
  describe('Element type checks', () => {
    let videoElement: HTMLVideoElement;
    let audioElement: HTMLAudioElement;
    let divElement: HTMLDivElement;

    beforeEach(() => {
      videoElement = document.createElement('video');
      audioElement = document.createElement('audio');
      divElement = document.createElement('div');
    });

    test('isVideoElement correctly identifies video elements', () => {
      expect(isVideoElement(videoElement)).toBe(true);
      expect(isVideoElement(audioElement)).toBe(false);
      expect(isVideoElement(divElement)).toBe(false);
      expect(isVideoElement(null)).toBe(false);
    });

    // More tests...
  });

  describe('Browser feature detection', () => {
    test('hasWebkitFullscreenMethods detects webkit fullscreen methods', () => {
      const videoElement = document.createElement('video');
      
      // Original should not have webkit methods
      expect(hasWebkitFullscreenMethods(videoElement)).toBe(false);
      
      // Add webkit method
      Object.defineProperty(videoElement, 'webkitRequestFullscreen', {
        value: jest.fn(),
        configurable: true
      });
      
      expect(hasWebkitFullscreenMethods(videoElement)).toBe(true);
    });

    // More tests...
  });
});
```

### Pattern Details:

1. **Test Type Guards Thoroughly**
   - Test positive and negative cases
   - Test edge cases (null, undefined)
   - Test type narrowing behavior

2. **Mock Browser-Specific Features**
   - Use `Object.defineProperty` for non-standard properties
   - Mock vendor-specific methods for testing
   - Clean up mocks after tests

3. **Verify Runtime Behavior**
   - Ensure type guards work as expected at runtime
   - Test conditional logic that depends on types
   - Verify error handling for type mismatches

## Common Replacement Patterns for `any`

### API Responses

#### Before:
```typescript
async function fetchData(): Promise<any> {
  const response = await fetch('/api/data');
  return response.json();
}
```

#### After:
```typescript
interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

async function fetchUsers(): Promise<ApiResponse<UserData[]>> {
  const response = await fetch('/api/users');
  return response.json();
}
```

### Event Handlers

#### Before:
```typescript
function handleChange(event: any) {
  const value = event.target.value;
  // Use value
}
```

#### After:
```typescript
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.currentTarget.value;
  // Use value with confidence
}
```

### Dynamic Properties

#### Before:
```typescript
function getProperty(obj: any, key: string): any {
  return obj[key];
}
```

#### After:
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## When to Use Each Approach

| Approach | When to Use |
|----------|-------------|
| **Interface Extensions** | When working with vendor-specific browser APIs or external libraries with incomplete types |
| **Type Guards** | When working with values whose type can't be determined at compile time or when narrowing union types |
| **Utility Types** | When dealing with common patterns like partial objects, record types, or pick/omit scenarios |
| **Generics** | When creating reusable functions and components that work with various types |
| **Union Types** | When a value can be one of several specific types |
| **Discriminated Unions** | When working with different variants of a type that need different handling |

## Conclusion

By following these patterns, you can eliminate `any` types from your codebase while maintaining browser compatibility and runtime reliability. This leads to:

- Improved developer experience with better autocompletion
- Earlier detection of type errors at compile time
- Clearer code contracts and documentation
- More maintainable and refactorable code

Remember that the goal isn't just to satisfy the TypeScript compiler but to create genuinely type-safe code that prevents runtime errors and improves code quality. 