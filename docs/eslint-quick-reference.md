# ESLint Type Pattern Quick Reference

This guide provides a quick reference for common type patterns used in FitCopilot to address ESLint warnings and improve type safety.

## Common Type Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Discriminated Union** | Component variants | `type ButtonProps = PrimaryButtonProps \| SecondaryButtonProps` |
| **Type Guards** | Runtime type checking | `function isPrimaryButton(props: ButtonProps): props is PrimaryButtonProps` |
| **Unknown with Guards** | Replace `any` types | `function process(data: unknown): string` |
| **Event Handler Types** | Type-safe events | `type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void` |
| **React.FC with Props** | Component typing | `const Button: React.FC<ButtonProps> = (props) => { }` |
| **Underscore Prefix** | Unused variables | `function handle(_event: Event): void { }` |
| **Record Types** | Object dictionaries | `const cache: Record<string, unknown> = {}` |
| **Generic API Responses** | API calls | `type ApiResponse<T> = { data: T, status: number }` |

## Type Replacement Quick Guide

### Replace `any` with Proper Types

```typescript
// ❌ Before
function processData(data: any): any {
  return data.value;
}

// ✅ After
interface DataItem {
  value: string;
}

function processData(data: DataItem): string {
  return data.value;
}
```

### Replace Generic Objects

```typescript
// ❌ Before
function storeData(key: string, value: any): void {
  // Implementation
}

// ✅ After
function storeData<T>(key: string, value: T): void {
  // Implementation
}
```

### Replace Event Handlers

```typescript
// ❌ Before
const handleClick = (e: any) => {
  e.preventDefault();
};

// ✅ After
import { ButtonClickHandler } from '../types/events';

const handleClick: ButtonClickHandler = (e) => {
  e.preventDefault();
};
```

### Replace Console Logs

```typescript
// ❌ Before
console.log('User data:', userData);

// ✅ After
import { logger } from '../utils/logger';
logger.info('User data:', { userData });
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Component Props** | `ComponentNameProps` | `ButtonProps`, `CardProps` |
| **Base Interfaces** | `Base[Component]Props` | `BaseButtonProps` |
| **Variant Interfaces** | `Variant[Component]Props` | `PrimaryButtonProps` |
| **Event Handlers** | `[Element][Event]Handler` | `ButtonClickHandler` |
| **Type Guards** | `is[Type]` | `isPrimaryButton` |
| **Context Values** | `[Feature]ContextValue` | `UserContextValue` |

## Common Type Patterns by Component Family

### Button Components

```typescript
// Base props
interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

// Variant props with discriminator
interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  onClick: ButtonClickHandler;
}

interface LinkButtonProps extends BaseButtonProps {
  variant: 'link';
  href: string;
  target?: '_blank' | '_self';
}

// Combined type
type ButtonProps = PrimaryButtonProps | LinkButtonProps;

// Type guard
function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return props.variant === 'link';
}
```

### Form Fields

```typescript
// Base props
interface BaseFieldProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// Specific field types
interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: InputChangeHandler;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  options: SelectOption[];
  onChange: SelectChangeHandler;
}

// Combined type
type FieldProps = TextFieldProps | SelectFieldProps;

// Type guard
function isTextField(props: FieldProps): props is TextFieldProps {
  return props.type === 'text' || props.type === 'email' || props.type === 'password';
}
```

## API Response Types

```typescript
// Generic API response
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Type guard for API responses
function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.status >= 200 && response.status < 300;
}

// Usage
async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const response = await fetch('/api/users');
  return await response.json();
}
```

For more detailed patterns and examples, refer to:
- [Type Safety Guide](./type-safety-guide.md)
- [TypeScript Patterns](./typescript-patterns.md)
- [ESLint Patterns](./eslint-patterns.md) 