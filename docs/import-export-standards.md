# Import/Export Standards for FitCopilot

This document outlines our standard approach to imports and exports in the FitCopilot codebase. Following these standards will help maintain consistency and avoid build-time errors.

## Barrel Files (index.ts)

Barrel files are used to simplify imports by re-exporting all the exports from a directory in a single file.

### Best Practices for Barrel Files

1. Each feature directory should have a barrel file (`index.ts`) that exports all components, hooks, and types.
2. Use named exports for all components and types.
3. Re-export in a consistent pattern.

✅ **Correct Barrel File Structure:**

```typescript
// Import components and types
import ComponentA from './ComponentA';
import { TypeA, TypeB } from './ComponentA';
import ComponentB from './ComponentB';

// Export all named types
export { TypeA, TypeB };

// Export components as named exports
export { default as ComponentA } from './ComponentA';
export { default as ComponentB } from './ComponentB';

// Export from subdirectories
export * from './subdirectory';
```

❌ **Avoid:**

```typescript
// Inconsistent export patterns
export { default as ComponentA } from './ComponentA';
export default ComponentB; // Don't default export from barrel files
```

## Component Exports

### Named vs Default Exports

We prefer **named exports** for components and utility functions, with barrel files re-exporting them.

✅ **Preferred Component Export:**

```typescript
// ComponentA.tsx
export interface ComponentAProps {
  // props...
}

export const ComponentA: React.FC<ComponentAProps> = (props) => {
  // implementation...
};

// Also provide default export for backward compatibility
export default ComponentA;
```

❌ **Avoid:**

```typescript
// Only using default exports makes re-exports more complex
const ComponentA = (props) => {
  // implementation...
};

export default ComponentA;
```

## Type Exports

All types and interfaces should be exported as named exports.

✅ **Correct Type Export:**

```typescript
// types.ts
export interface ComponentProps {
  // props...
}

export type VariantType = 'default' | 'alternate';
```

❌ **Avoid:**

```typescript
// Don't bundle types with implementation
const Component = (props) => {
  // implementation...
};

// Adding types after export can lead to overlooked type exports
export default Component;
```

## Import Patterns

Use consistent import patterns.

✅ **Preferred Import Patterns:**

```typescript
// Import from barrel files
import { ComponentA, ComponentB } from '../components';

// Direct named imports when needed
import { specificItem } from './specificFile';

// Type imports
import type { SomeType } from './types';
```

❌ **Avoid:**

```typescript
// Avoid destructuring default exports
import Component from './Component';
const { prop1, prop2 } = Component;

// Avoid mixing import styles unnecessarily
import SomeDefault, { namedExport } from './file';
```

## Library Imports

When importing libraries:

1. Import only what you need.
2. Group imports by library, then by local files.
3. Use consistent patterns across the codebase.

✅ **Preferred Library Import Pattern:**

```typescript
// React and libraries first
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

// Local imports after
import { OurComponent } from '../../components';
import { useOurHook } from '../../hooks';
```

## Running the Import Validator

We've provided a utility to check for import/export consistency issues:

```bash
npm run verify:imports
```

To automatically standardize barrel files:

```bash
npm run verify:barrels
```

## Common Issues and Solutions

### "Export X was not found in Y"

**Problem:** You're trying to import a symbol that isn't exported from the source file.

**Solution:** Check that the symbol is correctly exported from the source file and that you're importing from the correct path.

### Circular Dependencies

**Problem:** File A imports from File B, which imports from File A.

**Solution:** Move shared logic to a third file that both can import from, or restructure your components to avoid the circular reference.

### Build Warnings

If you see build warnings related to exports, run the import validator to identify the issues:

```bash
npm run verify:imports
```

Following these standards will help ensure a consistent, maintainable codebase with fewer build-time errors. 