# TypeScript Patterns - Quick Reference

This guide provides a quick reference to common TypeScript patterns used throughout the FitCopilot theme. Use these patterns to maintain consistency and type safety across the codebase.

## Component Props

### Basic Component Props

```typescript
// Good: Clear interface with JSDoc comments and proper optional properties
interface ButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** Optional click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button appearance variant */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Additional class names */
  className?: string;
}

// Bad: Missing JSDoc, unclear optional vs required props
interface ButtonProps {
  children: React.ReactNode;
  onClick: (e: any) => void; // ❌ Uses any
  variant: string; // ❌ Should use union type
  className: string;
}
```

### Theme-Specific Props

```typescript
// Good: Clean extension of base props
interface GymThemeButtonProps extends ButtonProps {
  /** Intensity level (gym theme specific) */
  intensity?: 'low' | 'medium' | 'high';
}
```

## Event Handlers

### Event Handler Types

```typescript
// Good: Specific event types
type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
type SelectChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => void;

// Bad: Using any
type GenericHandler = (event: any) => void; // ❌ Avoid this
```

### Inside Components

```typescript
// Good: Properly typed event handler
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
  // handle click logic
};

// Bad: Using any for event
const handleClick = (event: any): void => { // ❌ Avoid this
  event.preventDefault();
  // handle click logic
};
```

## Discriminated Unions

### For Feature Configuration

```typescript
// Good: Clear discriminated union with appropriate properties
type DisplayMode = 
  | { mode: 'compact'; maxItems: number }
  | { mode: 'expanded'; showDescriptions: boolean }
  | { mode: 'grid'; columns: number };

// Bad: Not using discriminated property
type DisplayMode = {
  mode: 'compact' | 'expanded' | 'grid';
  maxItems?: number; // ❌ Should only exist for compact
  showDescriptions?: boolean; // ❌ Should only exist for expanded
  columns?: number; // ❌ Should only exist for grid
};
```

### Type Narrowing with Discriminated Unions

```typescript
// Good: Proper type narrowing
function renderContent(mode: DisplayMode): React.ReactNode {
  switch (mode.mode) {
    case 'compact':
      return <CompactView maxItems={mode.maxItems} />; // Type-safe access to maxItems
    case 'expanded':
      return <ExpandedView showDescriptions={mode.showDescriptions} />; // Type-safe access to showDescriptions
    case 'grid':
      return <GridView columns={mode.columns} />; // Type-safe access to columns
  }
}
```

## WordPress API Types

### Response Structures

```typescript
// Good: Proper typing of WordPress content
interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  slug: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}
```

### API Functions

```typescript
// Good: Proper typing of API request/response
async function fetchPosts(): Promise<WordPressPost[]> {
  const response = await fetch('/wp-json/wp/v2/posts?_embed');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}
```

## React Hooks

### useState with Type Inference

```typescript
// Good: Proper type definition in useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// Alternative approach letting TypeScript infer the type
const [count, setCount] = useState(0); // Inferred as number
const [user, setUser] = useState<User>(); // Undefined is allowed initially
```

### useEffect with Proper Dependency Arrays

```typescript
// Good: Properly typed dependency array
useEffect(() => {
  // Fetch data logic
}, [userId, filter]); // Only dependencies used inside the effect

// With cleanup
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(userId, { signal: controller.signal })
    .then(setData)
    .catch(setError);
  
  return () => {
    controller.abort();
  };
}, [userId]);
```

### Custom Hooks with Generic Types

```typescript
// Good: Proper generic typing for custom hooks
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T): void => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
const [preferences, setPreferences] = useLocalStorage<UserPreferences>('preferences', defaultPreferences);
```

## CSS Variable Types

### Component-Specific CSS Props

```typescript
// Good: Typed CSS variables for components
interface ButtonCSSProperties extends React.CSSProperties {
  '--button-bg-color'?: string;
  '--button-text-color'?: string;
  '--button-border-radius'?: string;
}

// Usage in component props
interface ButtonProps {
  // ...other props
  style?: ButtonCSSProperties;
}

// Usage in component
<button
  style={{
    '--button-bg-color': 'var(--fc-color-primary)',
    '--button-text-color': 'white',
    '--button-border-radius': '4px'
  } as ButtonCSSProperties}
>
  Click me
</button>
```

## Type Assertions

### Using Type Assertions Safely

```typescript
// Good: const assertion for objects
const THEME_COLORS = {
  primary: '#0078d4',
  secondary: '#2b88d8',
  success: '#107c10',
  warning: '#ff8c00',
  error: '#d83b01'
} as const;

// Type derived from the const assertion
type ThemeColor = typeof THEME_COLORS[keyof typeof THEME_COLORS];

// Good: using satisfies for validation while preserving type inference
const WORKOUT_TYPES = {
  cardio: { icon: 'running', color: 'red' },
  strength: { icon: 'dumbbell', color: 'blue' },
  flexibility: { icon: 'yoga', color: 'green' }
} satisfies Record<string, { icon: string; color: string }>;

// Still allows accessing specific properties with correct type
const cardioIcon = WORKOUT_TYPES.cardio.icon; // Type is string
```

## Enums vs Union Types

```typescript
// Good: Using union types (preferred in most cases)
type WorkoutType = 'cardio' | 'strength' | 'flexibility';

// Alternative: Using enums (only when needed)
enum WorkoutTypeEnum {
  Cardio = 'cardio',
  Strength = 'strength',
  Flexibility = 'flexibility'
}
```

## Type Guards

```typescript
// Good: Type guard function
function isWorkout(obj: unknown): obj is Workout {
  return (
    typeof obj === 'object' &&
    obj !== null && 
    'id' in obj &&
    'name' in obj &&
    'exercises' in obj
  );
}

// Usage
function processItem(item: unknown): void {
  if (isWorkout(item)) {
    // Type-safe access to Workout properties
    console.log(item.exercises.length);
  }
}
```

## Tips for Improving Type Safety

1. **Avoid `any` type**: Use `unknown` instead when type is truly unknown
2. **Use discriminated unions** for variants instead of optional properties
3. **Add JSDoc comments** to interfaces for better documentation
4. **Use type assertion only when necessary** and with appropriate type guards
5. **Create specific event handler types** instead of generic ones
6. **Use proper dependency arrays** in React hooks
7. **Utilize non-null assertion (`!`) sparingly** and only when you're certain
8. **Type CSS variables** for better style integration
9. **Use readonly arrays/properties** for values that shouldn't change

## Further Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint TypeScript Plugin](https://github.com/typescript-eslint/typescript-eslint) 