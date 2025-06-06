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

## TrainingCTA Architectural Pattern

### Problem Statement
The TrainingCTA component requires specific CSS structural wrappers to function correctly within the Training section. Missing wrappers cause spacing and layout issues.

### Correct Implementation Pattern

```tsx
// ✅ Correct - Training.tsx
<div className="training-section__cta">
  <TrainingCTA
    onNavigate={handleNavigate}
    variant={variant}
    className="animate-fade-in"
  />
</div>
```

```scss
// Training.scss - Container styling
.training-section {
  &__cta {
    margin-top: 6rem;  // Provides proper spacing from training cards
    text-align: center;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      margin-top: 7rem;  // Enhanced spacing on larger screens
      margin-bottom: 2rem;
    }
  }
}

// TrainingCTA.scss - Component styling
.training-cta {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  
  &__splash-context {
    // Component-specific visual effects
  }
}
```

### Common Anti-Patterns

```tsx
// ❌ Incorrect - Missing structural wrapper
<TrainingCTA
  onNavigate={handleNavigate}
  variant={variant}
  className="animate-fade-in"
/>
```

### CSS Architecture Hierarchy

1. **`.training-section__cta`** - Section-level container with spacing rules
2. **`.training-cta`** - Component root with display and alignment
3. **`.training-cta__splash-context`** - Visual effects container
4. **`.training-cta__button`** - Button-specific styling

### Benefits of This Pattern

- **Separation of Concerns**: Layout spacing vs component styling
- **Maintainability**: Clear ownership of CSS rules
- **Scalability**: Easy to modify spacing without affecting component internals
- **Consistency**: Same pattern across all Training section variants

## Shared Components

### Button Components
Located in `src/features/shared/Button/`, these provide consistent button styling across the application.

### Layout Components
Found in `src/components/layout/`, these handle page structure and responsive behavior.

## Testing Patterns

### Component Tests
- Focus on component behavior and props
- Use React Testing Library for user-centric tests
- Mock external dependencies and context providers

### Integration Tests
- Test component composition and data flow
- Verify proper CSS class application
- Test responsive behavior across breakpoints

### Storybook Tests
- Document component variations and edge cases
- Provide visual regression testing
- Demonstrate proper architectural patterns

## Documentation Standards

Each component should include:
- Clear usage examples in Storybook
- Props interface documentation
- Architectural pattern documentation
- Common usage patterns and anti-patterns

## Performance Considerations

### Code Splitting
Components are lazy-loaded by feature to optimize bundle size.

### CSS Optimization
- Use CSS modules or scoped styling to prevent conflicts
- Minimize CSS bundle size through tree shaking
- Leverage CSS custom properties for theming

### Memory Management
- Use React.memo for expensive components
- Implement proper cleanup in useEffect hooks
- Avoid memory leaks in event listeners and subscriptions 