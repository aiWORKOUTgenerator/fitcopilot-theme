# FitCopilot Component Extension Pattern

This document explains the recommended pattern for extending shared components with feature-specific variants.

## The Problem

When extending shared components for specific features, we face several challenges:

1. **Circular Dependencies**: Re-exporting specialized components through base modules creates circular imports
2. **CSS Inheritance Complexity**: Nested CSS variables make the inheritance chain difficult to understand
3. **Theme Inconsistency**: Various approaches to applying themes lead to inconsistent behavior
4. **Mixed Responsibilities**: Unclear boundaries between base and specialized components

## The Solution: Composition Pattern

Our standardized approach follows a composition pattern with clear separation of concerns:

### 1. Direct Imports for Extended Components

```tsx
// CORRECT: Import directly from feature component
import { HeroButton } from 'features/Homepage/Hero/components/HeroButton';

// INCORRECT: Don't import through shared module
import { HeroButton } from 'features/shared/Button';
```

### 2. Self-Contained Feature Components

Feature-specific components should:
- Live within their feature directory
- Import shared components they extend
- Implement clear composition patterns
- Document their relationship to base components

### 3. Flattened CSS Variable Hierarchy

```scss
/* Design system tokens */
:root {
  /* Base component tokens */
  --button-padding-x: var(--spacing-md);
  
  /* Feature component tokens - single level of inheritance */
  --hero-button-padding-x: var(--button-padding-x);
  --hero-button-radius: 9999px; /* Override with direct value */
}

/* Theme implementation via direct selectors */
[data-theme="gym"] .hero-button-primary {
  --color-hero-gradient-from: var(--color-gym-primary);
}
```

### 4. Consistent Theme Implementation

Always use the `data-theme` attribute for theming:

```tsx
<div data-theme="gym">
  <HeroButton variant="primary">Gym Theme Button</HeroButton>
</div>
```

## Implementation Guidelines

### Step 1: Create Component Structure

```
feature/
└── components/
    └── FeatureButton/
        ├── FeatureButton.tsx   # Component implementation
        ├── FeatureButton.scss  # Component-specific styles
        ├── FeatureButton.test.tsx
        ├── index.ts            # Clean exports
        └── README.md           # Documentation
```

### Step 2: Implement Component Extension

```tsx
// FeatureButton.tsx
import { Button, ButtonProps } from 'features/shared/Button';

export interface FeatureButtonProps extends ButtonProps {
  // Feature-specific props only
}

export const FeatureButton: React.FC<FeatureButtonProps> = ({
  variant,
  className,
  ...props
}) => {
  const featureClassName = `feature-button feature-button-${variant} ${className}`;
  
  return (
    <Button
      variant={variant}
      className={featureClassName}
      {...props}
    />
  );
};
```

### Step 3: Implement Flattened CSS Variables

```scss
// In design-system's component-tokens.scss
:root {
  --button-padding-x: var(--spacing-md);
  --feature-button-padding-x: var(--button-padding-x);
}

// In FeatureButton.scss
.feature-button {
  padding: var(--feature-button-padding-x) var(--feature-button-padding-x);
}

// Theme variants - direct selectors
[data-theme="gym"] .feature-button-primary {
  --color-feature-primary: var(--color-gym-primary);
}
```

### Step 4: Document Extension Pattern

In your component's README, clearly document:
- The base component being extended
- Component-specific props and behavior
- CSS variable inheritance
- Theme support

## Benefits

This pattern provides:

1. **Clear Dependencies**: No circular dependencies or import issues
2. **Simplified CSS**: Easier to understand variable relationships
3. **Consistent Theming**: Standardized theme application
4. **Maintainable Code**: Clear separation of base and specialized code
5. **Testable Components**: Easier to write comprehensive tests

## Example: HeroButton

The HeroButton component in `features/Homepage/Hero/components/HeroButton` demonstrates this pattern:

- It extends the shared Button component
- It lives within its feature directory
- It uses flattened CSS variables
- It implements consistent theme support
- It documents the extension pattern clearly

When implementing new feature-specific button variants, follow this pattern to ensure consistency across the application. 