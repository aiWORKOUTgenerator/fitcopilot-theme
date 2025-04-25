# Theme Variant Guide: Maintaining Color Consistency

## Overview

This document outlines best practices for maintaining color consistency across different theme variants (default, gym) in the FitCopilot theme. Following these guidelines will ensure:

1. Visual consistency within each variant
2. Easier theme switching and maintenance
3. Improved code readability and maintainability

## Theme Variables

### Core CSS Variables

All theme colors are defined as CSS variables in `src/styles/theme.scss`:

```scss
:root {
  --color-primary: #8b5cf6;         // violet-500
  --color-primary-light: #c4b5fd;   // violet-300
  --color-primary-dark: #6d28d9;    // violet-700
  --color-primary-rgb: 139, 92, 246; // RGB values for rgba usage
  
  --color-secondary: #3b82f6;       // blue-500
  --color-secondary-light: #93c5fd; // blue-300
  --color-secondary-dark: #1d4ed8;  // blue-700
  
  // Background and text colors
  --color-background: #111827;      // gray-900
  --color-text: #f9fafb;            // gray-50
  --color-text-muted: #9ca3af;      // gray-400
  // ... other variables
}
```

## Variant Implementation Options

### Option 1: CSS Custom Properties + Body Attribute

This approach uses a `data-theme` attribute on the body tag and applies theme overrides:

```scss
// Base styles use variables
.hero-button.button--primary {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
}

// Theme-specific overrides
body[data-theme="gym"] .hero-button.button--primary {
  // Override with gym-specific values if needed
}
```

### Option 2: CSS Classes

Add theme-specific classes to your components:

```scss
// Base button
.hero-button {
  // Base styles
}

// Theme variants
.theme-default .hero-button {
  background: linear-gradient(90deg, #a3e635, #65a30d);
}

.theme-gym .hero-button {
  background: linear-gradient(90deg, #8b5cf6, #6d28d9);
}
```

## Best Practices

1. **Always use variables instead of hardcoded colors**:
   ```scss
   // ❌ Bad
   background-color: #a3e635;
   
   // ✅ Good
   background-color: var(--color-primary);
   ```

2. **Use RGB variables for rgba colors**:
   ```scss
   // ❌ Bad
   background-color: rgba(163, 230, 53, 0.1);
   
   // ✅ Good
   background-color: rgba(var(--color-primary-rgb), 0.1);
   ```

3. **Style gradients consistently**:
   ```scss
   // ✅ Good
   background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
   ```

4. **Document color usage**:
   ```scss
   // Primary action button - uses brand gradient
   .cta-button {
     background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
   }
   ```

## Component Example

Here's how to implement a button that works across both default and gym themes:

```scss
.action-button {
  // Base styling 
  padding: 1rem 2rem;
  border-radius: 9999px;
  
  // Use variables for all colors
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-dark);
  
  &:hover {
    background: linear-gradient(90deg, var(--color-primary-light), var(--color-primary));
  }
}

// Default theme override (if needed)
body:not([data-theme="gym"]) .action-button {
  // Default-specific overrides
}

// Gym theme override (if needed)
body[data-theme="gym"] .action-button {
  // Gym-specific overrides
}
```

## Implementation Steps

1. Identify and replace any hardcoded color values with CSS variables
2. Add body attribute or class-based theme switching mechanism
3. Test across all variants to ensure consistent appearance
4. Add theme documentation to component comments

## Additional Resources

- Design tokens are documented in Storybook: `src/stories/Foundations/Colors.mdx`
- See `src/features/Homepage/Hero/components/HeroButton.scss` for an example implementation 