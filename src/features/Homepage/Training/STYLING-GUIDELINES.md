# Training Component Styling Guidelines

This document outlines the official styling approach for the Training component and all its variants.

## Styling Architecture

The Training component follows these styling principles:

1. **Primary: SCSS with BEM methodology**
   - Component namespace: `training-`
   - Element syntax: `training-[element]`
   - Modifier syntax: `training-[element]--[modifier]`
   - State syntax: `training-[element].is-[state]`

2. **Secondary: Limited Tailwind utilities**
   - Use Tailwind only for:
     - Spacing (`p-4`, `mt-2`, etc.)
     - Flex/Grid layouts (`flex`, `items-center`, etc.)
     - Responsive utilities (`md:flex-row`, etc.)
   - Do NOT use Tailwind for:
     - Colors (use CSS variables instead)
     - Typography (use SCSS mixins)
     - Transitions/animations (use SCSS)

3. **CSS Variables for Theming**
   - All theme-specific styling should use CSS variables
   - Component-specific variables should be prefixed with `--training-`
   - Theme variants use `body[data-theme="variant"]` selectors for overrides

## Class Structure

```scss
// Component root
.training-section {
  // Component properties
}

// Card element
.training-card {
  // Card styling

  // Card element
  &__icon {
    // Icon styling
  }

  // Card element
  &__title {
    // Title styling
  }

  // Card modifier
  &--active {
    // Active state styling
  }
}
```

## CSS Variable System

```scss
// Base component variables
.training-section {
  // Component-specific tokens
  --training-bg: var(--color-background, #111827);
  --training-text: var(--color-text, #f9fafb);
  --training-accent: var(--color-primary, #8b5cf6);
  --training-card-bg: rgba(31, 41, 55, 0.5);
  
  // Theme-specific overrides
  body[data-theme="sports"] & {
    --training-bg: var(--color-gray-50, #f9fafb);
    --training-text: var(--color-gray-900, #111827);
    --training-accent: var(--color-violet-600, #7c3aed);
  }
}
```

## Example Implementation

### SCSS (preferred approach)

```scss
.training-card {
  background-color: var(--training-card-bg);
  border-radius: 1rem;
  transition: transform 0.3s ease;
  
  &__icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(to bottom right, var(--color-primary-light), var(--color-primary));
  }
  
  &__title {
    color: var(--training-accent);
    font-weight: 700;
  }
  
  &:hover {
    transform: translateY(-5px);
  }
  
  // Theme-specific styles
  body[data-theme="sports"] & {
    border: 1px solid var(--color-gray-100);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
}
```

### TSX Component

```tsx
// Correct usage (BEM + limited Tailwind utilities)
<div className="training-card p-6 mb-4">
  <div className="training-card__icon mb-4">
    {program.icon}
  </div>
  <h3 className="training-card__title text-xl mb-2">
    {program.title}
  </h3>
  <p className="training-card__description">
    {program.description}
  </p>
</div>
```

## Creating New Variants

When implementing styling for a new variant:

1. Use the established class names from Training.scss
2. Add theme-specific variable overrides in Training.scss:
   ```scss
   body[data-theme="new-variant"] .training-section {
     --training-bg: var(--color-slate-50);
     --training-text: var(--color-slate-900);
   }
   ```
3. Minimize direct styling in component JSX
4. Use the shared Button component for all buttons
5. Follow the established program data structure

## Benefits of This Approach

- Consistent styling across all variants
- Easier theme switching and customization
- Better separation of concerns
- Improved maintainability
- Simpler variant creation 