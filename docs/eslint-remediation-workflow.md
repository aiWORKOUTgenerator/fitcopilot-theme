# ESLint Warning Remediation Workflow

This document provides a structured workflow for identifying and resolving ESLint warnings in the FitCopilot theme, with a focus on eliminating `any` types and improving type safety.

## Overview

The ESLint remediation workflow follows a systematic approach:

1. **Identify** warnings through automated reports
2. **Categorize** issues by type and priority
3. **Plan** remediation strategies for each category
4. **Implement** fixes following established patterns
5. **Validate** changes with automated checks
6. **Document** patterns for future reference

## Step 1: Identify Warnings

Begin by running the ESLint report to identify all warnings in your codebase:

```bash
# Generate a full ESLint report
npm run lint:report

# Check type coverage (percentage of code with proper typing)
npm run type:coverage
```

The reports will be saved in the `reports/` directory and will provide:
- Total warning count
- Breakdown by rule
- Files with the most warnings
- Type coverage percentage

## Step 2: Categorize Issues

Group the warnings into the following categories:

1. **Type Safety Warnings** (`no-explicit-any`, `no-unsafe-assignment`, etc.)
2. **Unused Variables** (`no-unused-vars`)
3. **Proper Logging** (`no-console`)
4. **React Hook Issues** (`react-hooks/exhaustive-deps`)
5. **Other Warnings**

You can use the provided categorization script:

```bash
# Categorize warnings by type
npm run eslint:categorize
```

## Step 3: Plan Remediation

For each category of warnings, plan your approach:

### Type Safety Warnings

1. Identify patterns of `any` usage
2. Replace with appropriate specific types
   - Component props → Discriminated unions
   - API responses → Generic response types
   - Event handlers → Specific event types
   - Unknown data → Type guards

### Unused Variables

1. Decide whether to remove or keep
2. For kept but unused variables, prefix with underscore

### Console Statements

1. Replace with structured logger
2. Add appropriate context objects

### React Hook Warnings

1. Add missing dependencies
2. Or refactor to useCallback/useMemo

## Step 4: Implement Fixes

Follow these steps when implementing fixes:

1. **Focus on one file at a time** - Complete it fully before moving to the next
2. **Start with utilities** - Fix utility functions first, as they impact the rest of the codebase
3. **Use established patterns** - Refer to the [Type Safety Guide](./type-safety-guide.md)
4. **Work in small batches** - Aim for 5-10 warnings per commit

### Using Type Pattern Snippets

The project includes VS Code snippets for common type patterns:

1. Open a TypeScript file
2. Type one of the snippet prefixes (e.g., `fc-discriminated-component`)
3. Press Tab to insert the snippet
4. Fill in the placeholders

Available snippets:
- `fc-discriminated-component` - Component with discriminated union props
- `fc-api-response` - API response with type guards
- `fc-type-guard` - Basic type guard function
- `fc-event-handler` - Event and handler types
- `fc-unknown-guard` - Process unknown data with type guards
- `fc-form-field` - Form field props with discriminated union
- `fc-record-type` - Type-safe record type
- `fc-typed-context` - React context with TypeScript types

### Implementation Checklist

For each file:

- [ ] Replace `any` types with proper interfaces
- [ ] Add type guards for runtime type checking
- [ ] Update function signatures with proper types
- [ ] Apply discriminated union pattern for variants
- [ ] Replace direct console calls with logger
- [ ] Address unused variables with underscore prefix
- [ ] Fix React Hook dependencies

## Step 5: Validate Changes

After implementing fixes, validate your changes:

```bash
# Run ESLint on the changed files
npm run lint:changed

# Verify type coverage
npm run type:coverage

# Run tests to ensure functionality remains the same
npm test
```

Look for:
- Reduction in warning count
- No new TypeScript errors
- Tests passing
- Type coverage improvement

## Step 6: Document Patterns

If you identify a new pattern or reusable solution:

1. Document it in the appropriate guide:
   - [Type Safety Guide](./type-safety-guide.md) for type patterns
   - [ESLint Patterns](./eslint-patterns.md) for ESLint patterns
2. Create a code example showing before and after
3. Add it to the VS Code snippets if appropriate

## Working with Common Warning Types

### No Explicit Any

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

### Unused Variables

```typescript
// ❌ Before
function handleSubmit(event, user, context) {
  // Only using user
  submitForm(user);
}

// ✅ After
function handleSubmit(_event, user, _context) {
  // Prefix unused params with underscore
  submitForm(user);
}
```

### Console Statements

```typescript
// ❌ Before
console.log('User logged in:', user.name);

// ✅ After
import { logger } from '../utils/logger';
logger.info('User logged in', { userId: user.id, userName: user.name });
```

### React Hooks Exhaustive Dependencies

```typescript
// ❌ Before
useEffect(() => {
  fetchUserData(userId);
}, []); // Missing dependency

// ✅ After (Option 1 - Add dependency)
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// ✅ After (Option 2 - Use callback)
const fetchData = useCallback(() => {
  fetchUserData(userId);
}, [userId]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

## Team Collaboration and Review

When working on ESLint remediation as a team:

1. **Claim specific modules** - Assign specific component families or modules to team members
2. **Use PR templates** - Use the ESLint remediation PR template
3. **Track progress** - Update the progress tracker
4. **Review patterns** - Ensure patterns are used consistently
5. **Cross-validate** - Have another team member review your changes

## Escalation Path

If you encounter challenging scenarios:

1. Check the [ESLint Troubleshooting Guide](./eslint-troubleshooting.md)
2. Consult the [Type Guard Usage Guide](./type-guard-usage-guide.md)
3. Ask for help in the development channel
4. Create an issue with the "eslint-remediation" label

## Success Criteria

Your ESLint remediation is successful when:

1. No `any` types remain in the codebase
2. Type coverage is above 95%
3. ESLint reports no warnings
4. All tests pass
5. Component functionality remains unchanged

## Resources

- [ESLint Quick Reference](./eslint-quick-reference.md)
- [Type Safety Guide](./type-safety-guide.md)
- [ESLint Troubleshooting](./eslint-troubleshooting.md)
- [Type Guard Usage Guide](./type-guard-usage-guide.md)
- [TypeScript Patterns](./typescript-patterns.md)
- [VS Code Type Snippets](./.vscode/type-patterns.code-snippets) 