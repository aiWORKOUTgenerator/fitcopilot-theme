# ESLint Patterns and Best Practices

This document outlines the ESLint patterns and practices we follow in the FitCopilot codebase to maintain code quality and consistency.

## Core ESLint Rules

### No Console Statements

We avoid using `console.log` statements in production code, as they clutter the browser console and may expose sensitive information.

```typescript
// ❌ Bad
console.log('User data:', userData);

// ✅ Good
import { logger } from '@/utils/logger';
logger.debug('User data:', userData);
```

Exception: `console.warn` and `console.error` are allowed for critical issues.

### No Unused Variables

Unused variables should be either removed or prefixed with an underscore.

```typescript
// ❌ Bad
function calculateTotal(price, tax, discount) {
  return price + (price * tax);
}

// ✅ Good
function calculateTotal(price, tax, _discount) {
  return price + (price * tax);
}

// ✅ Better
function calculateTotal(price, tax) {
  return price + (price * tax);
}
```

## TypeScript Rules

### No Explicit Any

Avoid using `any` type as it defeats TypeScript's purpose of providing type safety.

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
interface DataItem {
  value: string;
}

function processData(data: DataItem) {
  return data.value;
}

// ✅ Alternative (if type is truly unknown)
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### Explicit Module Boundary Types

Always specify return types for exported functions and methods.

```typescript
// ❌ Bad
export function fetchUserData(userId) {
  // implementation
}

// ✅ Good
export function fetchUserData(userId: string): Promise<UserData> {
  // implementation
}
```

## React Rules

### React Hooks Exhaustive Dependencies

Always include all dependencies in useEffect, useCallback, and useMemo dependency arrays.

```typescript
// ❌ Bad
useEffect(() => {
  fetchData(userId);
}, []); // Missing dependency: userId

// ✅ Good
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

For intentional deviations, use the ESLint disable comment with an explanation:

```typescript
// Only run on component mount
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  loadInitialData();
}, []);
```

### React Props Type Checking

Always define PropTypes or TypeScript interfaces for component props.

```typescript
// ❌ Bad
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

## Project-Specific Rules

### Use Logger

Use our custom logger instead of console for better control over log levels in different environments.

```typescript
// ❌ Bad
console.log('Initializing component');

// ✅ Good
import { logger } from '@/utils/logger';
logger.info('Initializing component');
```

## Working with ESLint

### ESLint Scripts

We have several scripts to help maintain ESLint compliance:

- `npm run lint`: Run ESLint on the entire codebase
- `npm run lint:fix`: Automatically fix lint issues where possible
- `npm run lint:report`: Generate a detailed lint report
- `scripts/optimize-imports.js`: Remove unused imports
- `scripts/add-eslint-directives.js`: Add ESLint directives for false positives
- `scripts/scan-deprecated-code.js`: Find deprecated code patterns

### Pre-commit Hooks

ESLint checks run automatically on pre-commit to prevent adding code with lint issues.

If you need to bypass this in exceptional cases:

```bash
SKIP_LINT=1 git commit -m "Your commit message"
```

Note: Use this sparingly and ensure you fix the lint issues promptly after.

### Adding ESLint Directives

When you need to disable a rule, always:

1. Use line-specific disables, not file-wide
2. Include a comment explaining why
3. Be as specific as possible with the rule

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = getExternalData(); // Using any here because the external API has variable return types

// Multiple rules
// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps
```

### Common ESLint Error Patterns and Fixes

| Error Pattern | Fix Strategy |
|---------------|--------------|
| `@typescript-eslint/no-explicit-any` | Replace with proper type or use type guards |
| `react-hooks/exhaustive-deps` | Add missing dependencies or extract code to outer scope |
| `@typescript-eslint/no-unused-vars` | Remove variable or prefix with underscore |
| `no-console` | Replace with logger utility |
| `fitcopilot/use-logger` | Import and use logger instead of console |

## Conclusion

Following these ESLint patterns helps us maintain a clean, consistent, and error-free codebase. If you have questions about specific rules or need help resolving lint issues, please consult the ESLint documentation or reach out to the team. 