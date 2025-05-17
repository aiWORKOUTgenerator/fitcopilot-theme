# FitCopilot Theme Implementation Guide

This guide provides practical steps for implementing the theme system in your components.

## Quick Start

### Basic Component Theming

To make a component theme-aware, follow these steps:

```tsx
// Step 1: Import the ThemeContext hook
import { useTheme } from '../../context/ThemeContext';

// Step 2: Use theme variables in your styles
const MyComponent = () => {
  const { theme } = useTheme(); // Optional: only needed if you need the theme name in your logic
  
  return (
    <div className="my-component">
      {/* Your component JSX */}
    </div>
  );
};
```

```scss
// MyComponent.scss
.my-component {
  // Use CSS variables that are theme-aware
  color: var(--color-text);
  background-color: var(--color-background);
  
  // Theme-specific overrides will be applied automatically
  // via the parent [data-theme] attribute
}
```

## Using Theme Tokens

### 1. Color Tokens

Use semantic color tokens rather than raw color values:

```scss
// ❌ Bad
.element {
  color: #8b5cf6;
  background-color: #fff;
}

// ✅ Good
.element {
  color: var(--color-primary);
  background-color: var(--color-background);
}
```

### 2. Component Tokens

Use component-specific tokens that reference semantic tokens:

```scss
// ❌ Bad: Direct use of semantic tokens
.custom-button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

// ✅ Good: Use component tokens
.custom-button {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-color);
}
```

### 3. Providing Fallbacks

Always provide fallbacks for CSS variables:

```scss
// ❌ Bad: No fallback
.element {
  padding: var(--spacing-md);
}

// ✅ Good: With fallback
.element {
  padding: var(--spacing-md, 1rem);
}
```

## Component Implementation Patterns

### Basic Component

For simple components, use CSS variables with fallbacks:

```tsx
// SimpleCard.tsx
import React from 'react';
import './SimpleCard.scss';

export const SimpleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`simple-card ${className}`}>
      {children}
    </div>
  );
};
```

```scss
// SimpleCard.scss
.simple-card {
  background-color: var(--card-bg-color, var(--color-background, #ffffff));
  border: var(--card-border-width, 1px) solid var(--card-border-color, var(--color-border, #e5e7eb));
  border-radius: var(--card-border-radius, var(--radius-md, 0.375rem));
  padding: var(--card-padding, var(--spacing-4, 1rem));
  box-shadow: var(--card-shadow, var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05)));
}
```

### Theme-Aware Component

For components that need to react to theme changes:

```tsx
// ThemedButton.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemedButton.scss';

export const ThemedButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick 
}) => {
  const { theme } = useTheme();
  
  // Optional: Theme-specific logic (only if needed)
  const handleClick = () => {
    console.log(`Button clicked in ${theme} theme`);
    onClick?.();
  };
  
  return (
    <button 
      className={`themed-button themed-button--${variant} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
```

```scss
// ThemedButton.scss
.themed-button {
  // Base styles using component tokens
  padding: var(--button-padding-y, 0.5rem) var(--button-padding-x, 1rem);
  border-radius: var(--button-border-radius, 0.375rem);
  font-weight: var(--button-font-weight, 600);
  transition: var(--button-transition, 0.3s ease);
  
  // Theme & variant specific styles
  &--primary {
    color: var(--button-primary-color, #ffffff);
    background-color: var(--button-primary-bg, var(--color-primary, #3b82f6));
    border: var(--button-primary-border-width, 0) solid var(--button-primary-border-color, transparent);
    
    &:hover {
      background-color: var(--button-primary-bg-hover, var(--color-primary-dark, #2563eb));
    }
  }
  
  &--secondary {
    color: var(--button-secondary-color, var(--color-primary, #3b82f6));
    background-color: var(--button-secondary-bg, transparent);
    border: var(--button-secondary-border-width, 1px) solid var(--button-secondary-border-color, currentColor);
    
    &:hover {
      background-color: var(--button-secondary-bg-hover, rgba(59, 130, 246, 0.1));
    }
  }
}
```

## Theme Provider Usage

### 1. Component Level

Wrap specific sections with different themes:

```tsx
import { ThemeProvider } from '../../context/ThemeContext';

const PageSection = () => {
  return (
    <>
      {/* Default theme section */}
      <section>
        <h2>Default Theme</h2>
        <Button>Default Button</Button>
      </section>
      
      {/* Gym theme section */}
      <ThemeProvider initialTheme="gym">
        <section>
          <h2>Gym Theme</h2>
          <Button>Gym Button</Button>
        </section>
      </ThemeProvider>
    </>
  );
};
```

### 2. Page Level

Apply themes to entire pages:

```tsx
import { ThemeProvider } from '../../context/ThemeContext';

const GymPage = () => {
  return (
    <ThemeProvider initialTheme="gym">
      <div className="page-container">
        {/* All components inherit the gym theme */}
        <Header />
        <MainContent />
        <Footer />
      </div>
    </ThemeProvider>
  );
};
```

### 3. Application Level

For theme persistence across the app:

```tsx
import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeOption } from './utils/theming';

const App = () => {
  const [theme, setTheme] = useState<ThemeOption>(() => {
    // Try to get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeOption) || 'default';
  });
  
  // Save theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <ThemeProvider initialTheme={theme}>
      {/* App content */}
    </ThemeProvider>
  );
};
```

## Working with Theme-Specific Styles

### 1. Data Attribute Approach

Use the `data-theme` attribute for theme-specific styles:

```scss
.component {
  // Default styles
  color: var(--color-text);
  
  // Theme-specific styles
  [data-theme="gym"] & {
    // Styles applied only in gym theme
    --component-bg: var(--color-gym-background);
  }
  
  [data-theme="sports"] & {
    // Styles applied only in sports theme
    --component-bg: var(--color-sports-background);
  }
}
```

### 2. Theme-Based CSS Variables

Use CSS variables for theme-specific values:

```scss
:root {
  // Default values
  --component-color: var(--color-primary);
  
  // Theme overrides
  &[data-theme="gym"] {
    --component-color: var(--color-violet-500);
  }
  
  &[data-theme="sports"] {
    --component-color: var(--color-cyan-500);
  }
}

.component {
  // Will automatically update based on theme
  color: var(--component-color);
}
```

## Testing Theme Support

### 1. Unit Testing

Use the theme testing utilities:

```tsx
import { renderWithTheme, testAllThemes } from '../../test/theme-utils';
import { Button } from './Button';

describe('Button', () => {
  test('renders with gym theme', () => {
    const { getByText } = renderWithTheme(<Button>Click me</Button>, 'gym');
    expect(getByText('Click me')).toBeInTheDocument();
  });
  
  // Test all themes at once
  testAllThemes(
    <Button>Click me</Button>,
    (result, theme) => {
      const button = result.getByText('Click me');
      expect(button).toBeInTheDocument();
      // Add theme-specific assertions
    }
  );
});
```

### 2. Visual Testing

Use the ThemeInspector and ThemeSwitcher components for development:

```tsx
import { ThemeInspector, ThemeSwitcher } from '../../dev/';

const DevelopmentPage = () => {
  return (
    <div>
      <YourComponents />
      
      {/* Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <ThemeInspector />
          <ThemeSwitcher />
        </>
      )}
    </div>
  );
};
```

## Best Practices

1. **Avoid Hard-Coded Colors**: Never use hex or RGB values directly
2. **Minimize Nesting**: Keep CSS variable nesting to 2 levels max
3. **Use Fallbacks**: Always provide fallbacks for critical properties
4. **Test All Themes**: Test components with all supported themes
5. **Component Independence**: Components should work without explicit theme context
6. **Use Semantic Tokens**: Prefer semantic tokens over design tokens
7. **Consistent Selectors**: Use standard selector patterns for theme overrides
8. **Theme-Specific Logic**: Limit theme-specific logic, prefer CSS for differences

## Resources

- Theme Architecture: [THEME-ARCHITECTURE.md](./THEME-ARCHITECTURE.md)
- Token Schema: [THEME-TOKEN-SCHEMA.md](./THEME-TOKEN-SCHEMA.md)
- Theme Utilities: `src/utils/theming.ts`
- Theme Context: `src/context/ThemeContext.tsx`
- Theme Testing: `src/test/theme-utils.tsx`
- Theme Debugging: `src/dev/ThemeInspector.tsx` and `src/dev/ThemeSwitcher.tsx` 