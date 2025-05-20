# Component Structure Patterns for Storybook

This document defines the standard component directory structures in the FitCopilot theme and the recommended import patterns for Storybook stories.

## Component Directory Structures

We've identified four main component directory structures in our codebase:

### Type A: Component in Root Directory

```
src/features/shared/ComponentName/
├── ComponentName.tsx         # Main component implementation
├── index.ts                  # Re-exports the component
├── stories/                  # Stories directory
│   └── ComponentName.stories.tsx
```

**Examples:** Modal, FormField

**Import Pattern:** 
```tsx
import { ComponentName } from '../ComponentName';
```

### Type B: Component in Components Subdirectory

```
src/features/shared/ComponentName/
├── components/               # Components subdirectory
│   ├── ComponentName.tsx     # Main component implementation
│   └── index.ts              # Exports components
├── index.ts                  # Re-exports components
├── stories/                  # Stories directory
│   └── ComponentName.stories.tsx
```

**Examples:** Button, Card

**Import Pattern:**
```tsx
import { ComponentName } from '../components';
```

### Type C: Feature Component with Direct Structure

```
src/features/FeatureName/components/ComponentName/
├── ComponentName.tsx         # Main component implementation
├── index.ts                  # Re-exports the component
├── stories/                  # Stories directory
│   └── ComponentName.stories.tsx
```

**Examples:** HeroButton, JourneyButton

**Import Pattern:**
```tsx
import { ComponentName } from '../ComponentName';
```

### Type D: Component Directly in Features Component Directory

```
src/features/FeatureName/components/
├── ComponentName.tsx         # Component implementation
├── ComponentName/            # Component-specific directory (for complex components)
│   └── stories/              # Stories directory
│       └── ComponentName.stories.tsx
```

**Examples:** JourneyStep

**Import Pattern:**
```tsx
import { ComponentName } from '../../ComponentName';
```

## Import Standards

### Component Imports

Always use named imports with curly braces for components:

```tsx
// ✅ Correct
import { ComponentName } from '../path/to/component';

// ❌ Incorrect
import ComponentName from '../path/to/component';
```

### Type Imports

When importing types:

1. Import from the appropriate `types.ts` file
2. Avoid importing types that conflict with component names
3. Avoid renaming imports unless absolutely necessary

```tsx
// ✅ Correct
import { ComponentNameProps } from '../types';

// ❌ Avoid
import { ComponentName as ComponentNameType } from '../types';
```

### React Imports

1. Always import React when using JSX in render functions
2. Use the `* as React` pattern for consistency

```tsx
// ✅ Correct
import * as React from 'react';
```

## Theme Variants Patterns

Standardize on JSX for theme variants instead of `React.createElement`:

```tsx
// ✅ Preferred: JSX pattern
export const ThemeVariants: Story = {
  render: () => (
    <div className="story-theme-grid">
      <div data-theme="theme-variant-1">
        <ComponentName />
      </div>
    </div>
  )
};

// ❌ Avoid: React.createElement pattern
export const ThemeVariants: Story = {
  render: function ThemeVariantsRenderer() {
    return React.createElement('div', 
      { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
      React.createElement('div', null,
        React.createElement(ComponentName)
      )
    );
  }
};
```

## Implementation Checklist

When implementing or updating stories:

1. Identify the component's structure type (A, B, C, or D)
2. Use the correct import pattern based on the type
3. Use named imports with curly braces for components
4. Import React when using JSX in render functions
5. Use JSX for theme variants
6. Avoid importing component names as types 