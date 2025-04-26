# FitCopilot Design System

## Token Usage Guidelines

This document outlines the design token system for the FitCopilot theme, including naming conventions, usage patterns, and best practices.

## Token Categories

Our design tokens are organized into the following categories:

### 1. Colors (`_colors.scss`)
```scss
// Base colors
--color-primary: #8b5cf6;
--color-primary-light: #c4b5fd;
--color-primary-dark: #6d28d9;

// Text colors
--color-text: #f9fafb;
--color-text-inverse: #ffffff;
--color-text-muted: #9ca3af;

// Background colors
--color-background: #111827;
--color-background-light: #1f2937;
--color-background-dark: #0f172a;
```

### 2. Typography (`_typography.scss`)
```scss
// Font families
--font-family-sans: 'Inter', system-ui, sans-serif;

// Font sizes
--type-small: 0.875rem;
--type-base: 1rem;
--type-lg: 1.125rem;
--type-h1: clamp(2.5rem, 5vw, 3.5rem);

// Line heights
--line-height-tight: 1.2;
--line-height-normal: 1.6;
```

### 3. Shadows (`_shadows.scss`)
```scss
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
--shadow-xl: 0 15px 35px rgba(0, 0, 0, 0.2);
--shadow-focus-ring: 0 0 0 2px #fff, 0 0 0 4px var(--color-primary);
```

### 4. Transitions (`_transitions.scss`)
```scss
--transition-fast: 150ms ease;
--transition-standard: all 0.2s ease;
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 5. Component-Specific (`_component-tokens.scss`)
```scss
// Tooltip
--size-tooltip-arrow: 12px;

// Button
--size-btn-sm: 36px;
--size-btn-md: 44px;
--size-btn-lg: 52px;

// Hero
--size-hero-min-height: 80vh;
--size-hero-content-width: 50%;
--size-hero-image-width: 45%;
--size-hero-grid-pattern: 20px;
--duration-hero-float-base: 6s;
--shadow-hero-button-hover: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
```

## New Hero Component Tokens

We have implemented a comprehensive set of design tokens for the Hero component, achieving high compliance with our design system. These tokens are organized into logical categories:

### Hero Sizing & Layout
```scss
--size-hero-min-height: 80vh;
--size-hero-content-width: 50%;
--size-content-max-sm: 600px;
--size-hero-image-width: 45%;
--size-hero-image-max-width: 700px;
--size-hero-image-max-width-mobile: 500px;
--size-hero-grid-pattern: 20px;
--size-hero-tooltip-width: 260px;
--size-hero-button-min-width: 210px;
--size-hero-tooltip-margin-right: 8px;
--size-hero-tooltip-margin-top: 2px;
--size-hero-gap-buttons: 1.5rem;
--size-hero-margin-buttons: 2rem;
--size-hero-margin-feature-pills: 2.5rem;
--size-hero-button-padding: 1rem 2rem;
--size-hero-tooltip-transform-y: 10px;
--size-hero-breakpoint-mobile: 992px;
--size-hero-border-width-primary: 1px;
--size-hero-border-width-secondary: 2px;
--size-hero-backdrop-blur: 10px;
--size-hero-image-center-translate: -50%;
--pos-hero-bg-x: center;
--pos-hero-bg-y: center;
--size-hero-gradient-x: 200%;
--size-hero-gradient-y: 200%;
```

### Hero Animations & Transitions
```scss
--duration-hero-float-base: 6s;
--duration-hero-float-odd: 8s;
--duration-hero-float-even: 10s;
--duration-hero-gradient: 8s;
--duration-hero-button-transition: 0.3s;
--duration-hero-pulse: 3s;
--duration-hero-animation-delay: 1s;
--ease-hero-gradient: ease;
--scale-hero-icon-hover: 1.1;
--scale-hero-button-hover-y: -4px;
--angle-hero-gradient: 90deg;
--angle-hero-float-rotate: 5deg;
--pos-hero-gradient-start: 0% 50%;
--pos-hero-gradient-mid: 100% 50%;
--pos-hero-gradient-end: 0% 50%;
```

### Hero Colors & Opacity
```scss
--color-hero-button-primary-text: #0f172a;
--color-hero-signin-text: rgba(255, 255, 255, 0.6);
--color-hero-feature-pill-bg: rgba(15, 23, 42, 0.5);
--color-hero-feature-pill-border: rgba(31, 41, 55, 0.5);
--color-hero-tooltip-title: #a3e635;
--color-hero-button-secondary-bg: rgba(15, 23, 42, 0.8);
--color-hero-button-secondary-border: rgba(163, 230, 53, 0.3);
--color-hero-button-secondary-hover-bg: rgba(163, 230, 53, 0.1);
--opacity-hero-floating-icon: 0.5;
--opacity-hero-tooltip-border: 0.3;
--opacity-hero-icon: 0.6;
--opacity-hero-citron-pulse-min: 0.8;
--opacity-hero-tooltip-hidden: 0;
--opacity-hero-tooltip-visible: 1;
--opacity-hero-icon-hover: 1;
```

### Hero Typography
```scss
--type-hero-tooltip-title: 14px;
--type-hero-signin: 0.875rem;
--weight-hero-button: 700;
--weight-hero-tooltip-title: 500;
--weight-hero-citron-text: 600;
```

### Hero Shadows
```scss
--shadow-hero-button-hover: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
--shadow-hero-secondary-button-hover: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
--shadow-hero-optimized: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
--shadow-hero-optimized-hover: 0 20px 30px -10px rgba(0, 0, 0, 0.4);
--shadow-hero-citron-text: 0 0 6px rgba(163, 230, 53, 0.4);
--shadow-hero-no-shadow: 0 0 0 rgba(var(--color-lime-rgb), 0);
```

## Usage Guidelines

### Do's and Don'ts

✅ **DO**:
- Use token variables for all colors, spacing, shadows, and typography
- Follow the established naming pattern: `--category-name-variant`
- Group related tokens together in component-specific sections
- Document any new tokens added to the system

❌ **DON'T**:
- Use hardcoded values for colors, spacing, typography, or shadows
- Create one-off variables for specific use cases
- Duplicate existing token values with new names

### Using Tokens in SCSS

```scss
.component {
  // Use color tokens
  color: var(--color-text);
  background-color: var(--color-background);
  
  // Use spacing tokens
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-8);
  
  // Use typography tokens
  font-size: var(--type-base);
  line-height: var(--line-height-normal);
  
  // Use shadow tokens
  box-shadow: var(--shadow-md);
  
  // Use transition tokens
  transition: var(--transition-standard);
}
```

## Adding New Tokens

When adding new tokens:

1. Follow the naming convention: `--category-name-variant`
2. Place tokens in the appropriate file based on category
3. Document the new token in this README
4. Use comment blocks to group related tokens

## Enforcement

We use Stylelint to enforce token usage throughout the codebase. The linter will flag any hardcoded values that should be replaced with tokens.

See `.stylelintrc.json` for the specific rules.

## Component Examples

### Button
```scss
.button {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--type-base);
  border-radius: var(--radius-md);
  transition: var(--transition-standard);
  
  &:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }
}
```

### Tooltip
```scss
.tooltip {
  background-color: var(--color-tooltip-bg);
  color: var(--color-text-inverse);
  padding: var(--spacing-2);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  
  &::before {
    border-width: var(--size-tooltip-arrow);
  }
}
``` 