# Effective Type Guard Usage Guide

Type guards are a powerful TypeScript feature that allows for runtime type checking and narrowing of types in a type-safe way. This guide explains how to use type guards effectively in the FitCopilot codebase.

## Basic Type Guards

### 1. Built-in Type Guards

TypeScript provides several built-in type guards:

```typescript
// typeof type guard
function processValue(value: string | number): string {
  if (typeof value === 'string') {
    // TypeScript knows value is a string here
    return value.toUpperCase();
  } else {
    // TypeScript knows value is a number here
    return value.toString();
  }
}

// instanceof type guard
function processError(error: Error | string): string {
  if (error instanceof Error) {
    // TypeScript knows error is an Error object here
    return `${error.name}: ${error.message}`;
  } else {
    // TypeScript knows error is a string here
    return error;
  }
}

// Array type guard
function processItems(items: string | string[]): string[] {
  if (Array.isArray(items)) {
    // TypeScript knows items is a string[] here
    return items;
  } else {
    // TypeScript knows items is a string here
    return [items];
  }
}

// Property check type guard
function processUser(user: unknown): string {
  if (typeof user === 'object' && user !== null && 'name' in user) {
    // TypeScript knows user has a 'name' property, but its type is unknown
    return (user as { name: string }).name;
  }
  return 'Unknown user';
}
```

### 2. Custom Type Guards with Type Predicates

Custom type guards use the `is` operator to define a type predicate:

```typescript
// Define the types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Custom type guard
function isAdmin(user: User): user is Admin {
  return 'role' in user && (user as Admin).role === 'admin';
}

// Usage
function grantAccess(user: User): void {
  if (isAdmin(user)) {
    // TypeScript knows user is an Admin here
    console.log(`Admin access granted to ${user.name} with permissions: ${user.permissions.join(', ')}`);
  } else {
    // TypeScript knows user is a User but not an Admin here
    console.log(`Limited access granted to ${user.name}`);
  }
}
```

## Advanced Type Guards

### 1. Type Guards for Discriminated Unions

Type guards are particularly useful with discriminated unions:

```typescript
// Base props interface
interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

// Variant-specific interfaces with discriminator
interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  onClick: ButtonClickHandler;
}

interface LinkButtonProps extends BaseButtonProps {
  variant: 'link';
  href: string;
  target?: '_blank' | '_self';
}

// Union type
type ButtonProps = PrimaryButtonProps | LinkButtonProps;

// Type guard for LinkButtonProps
function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return props.variant === 'link';
}

// Component implementation
const Button: React.FC<ButtonProps> = (props) => {
  if (isLinkButton(props)) {
    // TypeScript knows props is LinkButtonProps here
    return (
      <a 
        href={props.href} 
        target={props.target} 
        className={props.className}
        rel={props.target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {props.children}
      </a>
    );
  }

  // TypeScript knows props is PrimaryButtonProps here
  return (
    <button 
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
    >
      {props.children}
    </button>
  );
};
```

### 2. Exhaustive Type Checking

To ensure all variants of a discriminated union are handled:

```typescript
// Define a helper function for exhaustive checking
function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

// Use with a switch statement
type ButtonVariant = 'primary' | 'secondary' | 'link' | 'danger';

function getButtonColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return 'blue';
    case 'secondary':
      return 'gray';
    case 'link':
      return 'transparent';
    case 'danger':
      return 'red';
    default:
      // If a new variant is added to ButtonVariant but not handled here,
      // TypeScript will raise a compile-time error
      return assertNever(variant);
  }
}
```

### 3. Array Element Type Guards

Type guards can check elements in an array:

```typescript
// Check if all elements in an array satisfy a type guard
function areAllAdmins(users: User[]): users is Admin[] {
  return users.every(user => isAdmin(user));
}

// Usage
function processUsers(users: User[]): void {
  if (areAllAdmins(users)) {
    // TypeScript knows users is Admin[] here
    users.forEach(admin => {
      console.log(`Admin ${admin.name} has permissions: ${admin.permissions.join(', ')}`);
    });
  } else {
    console.log('Some users are not admins');
  }
}
```

## Type Guard Best Practices

### 1. Keep Type Guards Simple and Focused

Type guards should check one thing and do it well:

```typescript
// ❌ Too complex - checking multiple things
function isValidUserData(data: unknown): data is UserData {
  return (
    typeof data === 'object' && 
    data !== null && 
    'name' in data && 
    typeof (data as any).name === 'string' &&
    'email' in data && 
    typeof (data as any).email === 'string' &&
    'age' in data && 
    typeof (data as any).age === 'number'
  );
}

// ✅ Better - modular type guards
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasStringProperty(obj: Record<string, unknown>, prop: string): boolean {
  return prop in obj && typeof obj[prop] === 'string';
}

function hasNumberProperty(obj: Record<string, unknown>, prop: string): boolean {
  return prop in obj && typeof obj[prop] === 'number';
}

function isUserData(data: unknown): data is UserData {
  if (!isObject(data)) return false;
  
  return (
    hasStringProperty(data, 'name') &&
    hasStringProperty(data, 'email') &&
    hasNumberProperty(data, 'age')
  );
}
```

### 2. Create Reusable Type Guard Libraries

Group related type guards into libraries:

```typescript
// src/utils/typeGuards/commonTypeGuards.ts
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isArray<T>(value: unknown, itemGuard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}

export function hasProperty<K extends string>(obj: unknown, prop: K): obj is Record<K, unknown> {
  return isObject(obj) && prop in obj;
}

// src/utils/typeGuards/userTypeGuards.ts
import { isObject, hasProperty } from './commonTypeGuards';

export function isUser(value: unknown): value is User {
  if (!isObject(value)) return false;
  
  return (
    hasProperty(value, 'id') &&
    typeof value.id === 'string' &&
    hasProperty(value, 'name') &&
    typeof value.name === 'string'
  );
}

export function isAdmin(value: unknown): value is Admin {
  if (!isUser(value)) return false;
  
  return (
    hasProperty(value, 'role') &&
    value.role === 'admin' &&
    hasProperty(value, 'permissions') &&
    Array.isArray(value.permissions)
  );
}
```

### 3. Add Test Coverage for Type Guards

Type guards should be thoroughly tested:

```typescript
// src/utils/typeGuards/__tests__/userTypeGuards.test.ts
import { isUser, isAdmin } from '../userTypeGuards';

describe('User Type Guards', () => {
  describe('isUser', () => {
    it('should return true for valid user objects', () => {
      expect(isUser({ id: '1', name: 'John' })).toBe(true);
    });
    
    it('should return false for null or undefined', () => {
      expect(isUser(null)).toBe(false);
      expect(isUser(undefined)).toBe(false);
    });
    
    it('should return false for non-objects', () => {
      expect(isUser('user')).toBe(false);
      expect(isUser(123)).toBe(false);
    });
    
    it('should return false for objects missing required properties', () => {
      expect(isUser({ name: 'John' })).toBe(false);
      expect(isUser({ id: '1' })).toBe(false);
    });
    
    it('should return false for objects with properties of wrong type', () => {
      expect(isUser({ id: 1, name: 'John' })).toBe(false);
      expect(isUser({ id: '1', name: 123 })).toBe(false);
    });
  });
  
  // Similar tests for isAdmin
});
```

## Real-World Usage Patterns

### 1. API Response Validation

Use type guards to validate API responses:

```typescript
// Define API response types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Type guard for API response
function isApiResponse<T>(value: unknown, dataGuard: (data: unknown) => data is T): value is ApiResponse<T> {
  if (!isObject(value)) return false;
  
  return (
    hasProperty(value, 'data') &&
    hasProperty(value, 'status') &&
    typeof value.status === 'number' &&
    (!hasProperty(value, 'message') || typeof value.message === 'string') &&
    dataGuard(value.data)
  );
}

// Type guard for User array
function isUserArray(value: unknown): value is User[] {
  return Array.isArray(value) && value.every(isUser);
}

// Fetch users with type safety
async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    
    if (isApiResponse(data, isUserArray)) {
      return data.data;
    }
    
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
```

### 2. Component Prop Validation

Use type guards for dynamic props validation:

```typescript
interface BaseCardProps {
  id?: string;
  className?: string;
}

interface ContentCardProps extends BaseCardProps {
  variant: 'content';
  title: string;
  content: string;
}

interface MediaCardProps extends BaseCardProps {
  variant: 'media';
  src: string;
  alt: string;
}

type CardProps = ContentCardProps | MediaCardProps;

// Type guards
function isContentCard(props: CardProps): props is ContentCardProps {
  return props.variant === 'content';
}

function isMediaCard(props: CardProps): props is MediaCardProps {
  return props.variant === 'media';
}

// Render function with type narrowing
function renderCardContent(props: CardProps): JSX.Element {
  if (isContentCard(props)) {
    return (
      <div>
        <h2>{props.title}</h2>
        <p>{props.content}</p>
      </div>
    );
  } else if (isMediaCard(props)) {
    return <img src={props.src} alt={props.alt} />;
  }
  
  // Exhaustive check - should never get here if all variants are handled
  throw new Error(`Unknown card variant: ${(props as any).variant}`);
}

// Component
const Card: React.FC<CardProps> = (props) => {
  return (
    <div className={`card ${props.className || ''}`} id={props.id}>
      {renderCardContent(props)}
    </div>
  );
};
```

### 3. Form Validation

Use type guards for form data validation:

```typescript
// Form data types
interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegistrationForm extends LoginForm {
  name: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

type FormData = LoginForm | RegistrationForm;

// Type guard for form data
function isLoginForm(data: FormData): data is LoginForm {
  return 'email' in data && 'password' in data && !('name' in data);
}

function isRegistrationForm(data: FormData): data is RegistrationForm {
  return 'email' in data && 'password' in data && 'name' in data;
}

// Form submission handler
function handleSubmit(formData: FormData): void {
  if (isLoginForm(formData)) {
    // Process login form
    console.log('Processing login with email:', formData.email);
  } else if (isRegistrationForm(formData)) {
    // Process registration form
    console.log('Processing registration for:', formData.name);
    
    // Make sure passwords match
    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    
    // Ensure terms are agreed to
    if (!formData.agreeToTerms) {
      console.error('You must agree to the terms');
      return;
    }
  }
}
```

## Conclusion

Type guards are a cornerstone of type-safe programming in TypeScript. They provide runtime type checking capabilities that complement TypeScript's static type system, allowing you to write code that is both flexible and type-safe.

By following the patterns in this guide, you can:

1. Write more robust code that gracefully handles different types
2. Create self-documenting code that makes type relationships clear
3. Build a reusable library of type guards for common patterns
4. Implement discriminated unions for component variants

Remember that the goal of type guards is not just to satisfy the TypeScript compiler, but to make your code more reliable and maintainable by ensuring proper type handling at runtime. 