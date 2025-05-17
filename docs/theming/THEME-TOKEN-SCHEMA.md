# Theme Token Organization Schema

This document defines the standardized organization and structure for theme tokens in the FitCopilot application.

## Overview

Theme tokens are CSS variables that define design values which can change across different themes. They are organized in a hierarchical structure from base tokens to component-specific tokens.

## Token Hierarchy

```
Design Tokens (Base Values)
    │
    ├── Global Semantic Tokens
    │   │
    │   ├── Theme-Specific Semantic Tokens
    │   │
    │   └── Component Base Tokens
    │       │
    │       └── Component-Specific Theme Tokens
```

## 1. Design Tokens

Base-level tokens that represent raw design values and are theme-agnostic.

### Location

- `src/styles/design-system/tokens/`
- `src/styles/design-system/colors-next.scss`
- `src/styles/design-system/spacing.scss`
- `src/styles/design-system/typography.scss`
- etc.

### Examples

```scss
:root {
  // Colors
  --color-blue-500: #3b82f6;
  --color-green-500: #22c55e;
  --color-violet-500: #8b5cf6;
  
  // Spacing
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  
  // Typography
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  
  // Radii
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;
}
```

## 2. Global Semantic Tokens

Semantic tokens that represent design concepts rather than raw values. These apply application-wide.

### Location

- `src/styles/design-system/component-tokens.scss` (top section)

### Examples

```scss
:root {
  // Default theme semantic tokens
  --color-primary: var(--color-lime-400);
  --color-secondary: var(--color-green-500);
  --color-accent: var(--color-lime-500);
  
  --color-text: var(--color-gray-900);
  --color-text-light: var(--color-gray-600);
  --color-text-inverse: var(--color-white);
  
  --background-primary: var(--color-white);
  --background-secondary: var(--color-gray-50);
  --background-accent: var(--color-gray-100);
}
```

## 3. Theme-Specific Semantic Tokens

Semantic tokens that change based on the active theme.

### Location

- `src/styles/design-system/component-tokens.scss` (theme overrides section)

### Examples

```scss
:root {
  // Default theme tokens defined above
  
  // Gym theme overrides
  &[data-theme="gym"] {
    --color-primary: var(--color-violet-500);
    --color-secondary: var(--color-purple-500);
    --color-accent: var(--color-purple-400);
  }
  
  // Sports theme overrides
  &[data-theme="sports"] {
    --color-primary: var(--color-cyan-500);
    --color-secondary: var(--color-blue-500);
    --color-accent: var(--color-cyan-400);
  }
}
```

## 4. Component Base Tokens

Tokens specific to components but not theme-dependent.

### Location

- `src/styles/design-system/component-tokens.scss` (component sections)

### Examples

```scss
:root {
  // Button base tokens
  --button-padding-x: var(--spacing-4);
  --button-padding-y: var(--spacing-2);
  --button-border-radius: var(--radius-md);
  --button-transition: var(--transition-standard);
  
  // Card base tokens
  --card-padding: var(--spacing-4);
  --card-border-radius: var(--radius-lg);
  --card-background: var(--background-primary);
}
```

## 5. Component-Specific Theme Tokens

Tokens for component-specific styling that changes with themes.

### Location

- `src/styles/design-system/component-tokens.scss` (component theme sections)
- Component-specific SCSS files for complex overrides

### Examples

```scss
// In component-tokens.scss
:root {
  // Hero button base tokens (all themes)
  --hero-button-gradient-from: var(--color-primary);
  --hero-button-gradient-to: var(--color-secondary);
  --hero-button-border-color: var(--color-primary-transparent);
  
  // Theme-specific component tokens
  &[data-theme="gym"] {
    --hero-button-shadow-color: rgba(139, 92, 246, 0.3); // Based on violet
  }
  
  &[data-theme="sports"] {
    --hero-button-shadow-color: rgba(6, 182, 212, 0.3); // Based on cyan
  }
}

// In component SCSS file
.hero-button {
  // Referencing component theme tokens
  background: linear-gradient(
    var(--hero-button-gradient-angle, 90deg),
    var(--hero-button-gradient-from),
    var(--hero-button-gradient-to)
  );
  box-shadow: 0 4px 6px var(--hero-button-shadow-color, rgba(0, 0, 0, 0.1));
  
  // Component-specific theme overrides for complex styles
  [data-theme="wellness"] & {
    --hero-button-text-shadow: 0 1px 2px rgba(20, 184, 166, 0.3);
  }
}
```

## Naming Conventions

### Pattern Structure

```
--{scope}-{element}-{property}-{state}
```

- **scope**: The component or feature (e.g., `button`, `hero`, `card`)
- **element**: Specific part within the component (e.g., `icon`, `text`) - optional
- **property**: The CSS property or concept (e.g., `color`, `padding`, `radius`)
- **state**: The interactive state (e.g., `hover`, `active`) - optional

### Examples

```scss
// Component property
--button-padding-x: 1rem;

// Component element property
--button-icon-size: 1rem;

// Component property state
--button-background-hover: rgba(0, 0, 0, 0.1);

// Component element property state
--button-icon-color-hover: #3b82f6;
```

## Theme-Specific Naming

For tokens that have theme-specific variations but aren't overridden through CSS selectors:

```scss
// Theme-specific design tokens
--color-{theme}-{name}: value;

// Examples
--color-gym-primary: #8b5cf6;
--color-sports-accent: #22d3ee;
```

## Fallback Strategy

Always provide fallbacks for critical properties:

```scss
// Good - has fallback
background-color: var(--component-bg, transparent);

// Better - fallback chain
--button-padding-x: var(--spacing-md, 1rem);
padding: 0 var(--button-padding-x);
```

## Implementation Guidelines

1. **Flat Structure**: Keep CSS variable nesting to 2 levels maximum
2. **Semantic Names**: Use semantic names over presentation names when possible
3. **Theme Specificity**: Define theme-specific tokens at the theme level, not component level
4. **Fallbacks**: Use fallbacks for all external token references
5. **Component Independence**: Components should work with undefined theme tokens

## Examples

### Good Implementation

```scss
// In component-tokens.scss
:root {
  // Semantic token
  --color-primary: var(--color-green-500);

  // Component base token
  --button-background: var(--color-primary);
  
  // Theme override
  &[data-theme="gym"] {
    --color-primary: var(--color-violet-500);
    // Button background will automatically update
  }
}

// In Button.scss
.button {
  background: var(--button-background, currentColor);
  
  // Component-specific theme overrides
  [data-theme="sports"] & {
    background: linear-gradient(var(--color-cyan-400), var(--color-blue-500));
  }
}
```

### Avoid

```scss
// Too much nesting
--button-background: var(--color-primary, var(--color-blue-500, #3b82f6));

// Theme name in variable for component token
--button-gym-background: var(--color-violet-500);

// Direct color values
.button {
  [data-theme="sports"] & {
    background: #06b6d4; // Direct use of hex value
  }
}
```

## Token Categories

For reference, here are the main token categories:

1. **Colors**: Brand colors, semantic colors, theme colors
2. **Spacing**: Margins, padding, gaps
3. **Typography**: Font sizes, weights, line heights
4. **Borders**: Width, radius, color
5. **Shadows**: Elevation, focus rings
6. **Transitions**: Duration, easing
7. **Z-Index**: Layering and stacking
8. **Breakpoints**: Responsive design 