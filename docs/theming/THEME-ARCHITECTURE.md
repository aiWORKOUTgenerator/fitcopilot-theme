# FitCopilot Theme Architecture

This document defines the standardized approach to theming in the FitCopilot application, providing guidelines for developers implementing and extending the theme system.

## Core Principles

1. **Consistency**: Standardized patterns for theme implementation
2. **Simplicity**: Minimal nesting of CSS variables (max 2 levels)
3. **Predictability**: Clear theme cascade and inheritance
4. **Extensibility**: Easy addition of new themes
5. **Performance**: Efficient CSS variable usage

## Theme System Overview

FitCopilot uses a **data-attribute** based theme system with **CSS variables** to provide consistent theming across the application. The system consists of:

1. **Theme Context**: React context for theme state management
2. **Theme Utilities**: Helper functions for theme operations
3. **Theme Tokens**: CSS variables organized by theme
4. **Theme Selectors**: CSS selectors for theme application

## Theme Options

The application supports the following themes:

| Theme ID | Name | Primary Color | Use Case |
|----------|------|---------------|----------|
| default | Default | lime/green | Default application theme |
| gym | Gym | violet/purple | Gym-focused experience |
| sports | Sports | cyan/blue | Sports training focus |
| wellness | Wellness | teal/emerald | Wellness and mindfulness |
| nutrition | Nutrition | amber/orange | Nutrition-focused experience |

## Theme Token Organization

Theme tokens are organized in a three-tier system:

### 1. Global Design Tokens

Base-level design tokens that are theme-agnostic:

```scss
// In colors-next.scss
:root {
  // Base colors
  --color-blue-500: #3b82f6;
  --color-green-500: #22c55e;
  
  // Spacing, typography, etc.
  --spacing-md: 1rem;
  --radius-md: 0.5rem;
}
```

### 2. Semantic Theme Tokens

Theme-specific semantic tokens:

```scss
// In component-tokens.scss
:root {
  // Default theme semantic tokens
  --color-primary: var(--color-lime-400);
  --color-secondary: var(--color-green-500);
  
  // Theme overrides using data-theme attribute
  &[data-theme="gym"] {
    --color-primary: var(--color-violet-500);
    --color-secondary: var(--color-purple-500);
  }
  
  &[data-theme="sports"] {
    --color-primary: var(--color-cyan-500);
    --color-secondary: var(--color-blue-500);
  }
}
```

### 3. Component Theme Tokens

Component-specific tokens that may reference semantic tokens:

```scss
// In component-tokens.scss
:root {
  // Base button tokens
  --button-padding-x: var(--spacing-md);
  --button-text-color: var(--color-text);
  
  // Hero button tokens
  --hero-button-gradient-from: var(--color-primary);
  --hero-button-gradient-to: var(--color-secondary);
}
```

## Theme Selector Pattern

Use consistent selectors for theme application:

```scss
// For global theme tokens in root
:root {
  // Default theme
  --color-primary: var(--color-lime-400);
  
  // Theme overrides
  &[data-theme="gym"] {
    --color-primary: var(--color-violet-500);
  }
}

// For component-specific styles
.component {
  color: var(--component-color);
  
  [data-theme="gym"] & {
    // Theme-specific overrides
  }
}
```

## Naming Conventions

### CSS Variables

Follow these naming patterns for CSS variables:

| Type | Pattern | Example |
|------|---------|---------|
| Design Token | `--{category}-{value}` | `--color-blue-500`, `--spacing-md` |
| Semantic Token | `--color-{role}` | `--color-primary`, `--color-text` |
| Component Token | `--{component}-{property}` | `--button-padding-x`, `--hero-margin-top` |

### Theme-Specific Tokens

For theme-specific design tokens:

```scss
// Theme design tokens
--color-{theme}-{name}: value;

// Examples:
--color-gym-primary: #a855f7;
--color-sports-accent: #22d3ee;
```

## Theme Application

### Component Level Theming

For component-specific theme styles:

```scss
.component {
  // Base styles using variables
  color: var(--component-color);
  background: var(--component-background);
  
  // Theme overrides
  [data-theme="gym"] & {
    --component-color: var(--color-gym-text);
    --component-background: var(--color-gym-background);
  }
}
```

### Theme Context Usage

In React components:

```tsx
import { useTheme } from '../../context/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('gym')}>
        Switch to Gym Theme
      </button>
    </div>
  );
};
```

### Theme Provider

Wrap sections or the entire application:

```tsx
import { ThemeProvider } from '../../context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider initialTheme="default">
      <MyComponent />
    </ThemeProvider>
  );
};
```

## Theme Extension Guidelines

### Adding a New Theme

1. **Add Theme Option**:
   ```ts
   // In src/utils/theming.ts
   export const themeOptions = [
     'default', 'gym', 'sports', 'wellness', 'nutrition', 'new-theme'
   ] as const;
   ```

2. **Define Theme Colors**:
   ```ts
   // In src/utils/theming.ts
   export const themeColorMap: Record<ThemeOption, Record<string, string>> = {
     // Existing themes...
     'new-theme': {
       primary: '#hex-value',
       secondary: '#hex-value',
       accent: '#hex-value',
     }
   };
   ```

3. **Add Theme Tokens**:
   ```scss
   // In component-tokens.scss
   :root {
     // Existing theme tokens...
     
     &[data-theme="new-theme"] {
       --color-primary: var(--color-new-theme-primary);
       --color-secondary: var(--color-new-theme-secondary);
       // Add more semantic tokens...
     }
   }
   ```

### Testing Theme Implementation

Use the theme testing utilities to verify correct implementation:

```tsx
import { renderWithTheme } from '../../test/theme-utils';

test('component respects theme', () => {
  const { container } = renderWithTheme(<MyComponent />, 'gym');
  // Assert theme-specific styling...
});
```

## Theme Debugging

### Theme Inspector

Use the Theme Inspector component during development:

```tsx
import { ThemeInspector } from '../../dev/ThemeInspector';

// In your component or page
<ThemeInspector />
```

### Theme Switcher

Development utility for theme testing:

```tsx
import { ThemeSwitcher } from '../../dev/ThemeSwitcher';

// In your app
<ThemeSwitcher />
```

## Best Practices

1. **Variable Nesting**: Keep CSS variable nesting to 2 levels maximum
2. **Fallback Values**: Include fallbacks for critical properties: `var(--token, fallback)`
3. **Component Isolation**: Make components resilient to theme changes by using semantic tokens
4. **Theme Testing**: Test components with all supported themes
5. **Documentation**: Document theme-specific behaviors in component documentation

## Implementation Checklist

When theming a component:

- [ ] Use semantic color tokens instead of direct color values
- [ ] Apply theme overrides using the standard selector pattern
- [ ] Keep variable nesting to 2 levels max
- [ ] Test with all supported themes
- [ ] Document theme-specific behavior

## Tools and Resources

- ThemeContext: `src/context/ThemeContext.tsx`
- Theme utilities: `src/utils/theming.ts`
- Design tokens: `src/styles/design-system/`
- Theme inspector: `src/dev/ThemeInspector.tsx`
- Theme testing utilities: `src/test/theme-utils.tsx` 