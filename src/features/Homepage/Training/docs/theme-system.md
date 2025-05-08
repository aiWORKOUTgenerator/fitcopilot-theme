# FitCopilot Theme System Documentation

## Overview

The FitCopilot Theme System is a comprehensive token-based approach to styling that provides consistent design across all components while enabling multiple visual variants. This document outlines the architecture, implementation details, and best practices for working with the theme system.

## Theme Tokens

### Core Concepts

The theme system is built on these key principles:

1. **Token-Based Design**: All visual properties are defined as tokens (background colors, text colors, shadows, etc.)
2. **Component-Agnostic**: Tokens can be applied to any component without modifying the token system
3. **Variant Support**: Each visual theme (default, sports, wellness, etc.) has a complete token set
4. **Program-Specific Styling**: Special tokens for program types (strength, fatLoss, etc.) provide contextual styling
5. **Accessibility-First**: Tokens include support for reduced motion and accessibility features

### Token Categories

Tokens are organized into these categories:

- **Background**: Surface colors for containers, cards, and sections
- **Text**: Typography colors for various text elements
- **Border**: Border colors, styles, and radii
- **Card**: Styling specific to card components
- **Highlight**: Accent colors for emphasized elements
- **Shadow**: Elevation and depth styles
- **Transitions**: Animation timing and easing functions

### Supported Variants

The theme system includes these visual variants:

1. **Default**: Dark theme with blue accents
2. **Sports**: High contrast, energetic theme with strong typography
3. **Wellness**: Calming, spa-like theme with teal/green palette
4. **Boutique**: Elegant, luxury-focused theme with rose/pink accents
5. **Classic**: Traditional fitness aesthetic with amber/gold highlights
6. **Minimalist**: Clean, understated design with minimal decoration
7. **Modern**: Contemporary, tech-forward design with indigo/blue palette

## Implementation

### Directory Structure

```
/src/features/Homepage/Training/
├── utils/
│   ├── themeTokens.ts       # Token definitions
│   ├── themeUtils.ts        # Utility functions for token application
│   └── accessibilityHelpers.ts # Accessibility utilities
├── components/
│   ├── SectionHeader/       # Example component using token system
│   │   ├── SectionHeader.tsx
│   │   └── SectionHeader.scss
│   └── [other components]
└── variants/                # Variant-specific overrides
    ├── sports/
    ├── wellness/
    └── [other variants]
```

### Using Tokens in Components

Components should use the theme system through the utility functions:

```typescript
// Component configuration
const componentTheme: ThemeableComponent = {
  baseClass: 'my-component',
  tokenMappings: {
    base: { category: 'background', subcategory: 'primary' },
    title: { category: 'text', subcategory: 'primary' },
    description: { category: 'text', subcategory: 'secondary' }
  }
};

// In component render function
const classes = applyTheme(componentTheme, variant, additionalClasses);
```

### CSS Implementation

Component styles should use CSS custom properties to read token values:

```scss
.my-component {
  background-color: var(--bg-primary);
  
  &__title {
    color: var(--text-primary);
  }
  
  // Variant-specific overrides
  &--sports {
    // Specific to sports variant
  }
}
```

## Program-Specific Tokens

For components that represent specific program types (strength, fatLoss, fitness, athletic), use program tokens:

```typescript
// In component
const gradientClass = getProgramToken(program.programType, 'gradient');

// Results in classes like: program-gradient-strength
```

Program tokens include:

- Gradient backgrounds
- Text colors
- Border accents
- Background colors

## Accessibility Features

The theme system integrates with accessibility helpers to provide:

1. **Reduced Motion Support**: Automatically detects user preferences
2. **ARIA Attribute Generation**: Helper functions for ARIA role assignment
3. **Focus Management**: Utilities for keyboard navigation
4. **Screen Reader Support**: Tools for generating accessible announcements

### Example: Reduced Motion

```tsx
// In component
const prefersReducedMotion = useReducedMotion();

// Apply to class
<div className={`component ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
```

### CSS for Reduced Motion

```scss
// In component styles
@media (prefers-reduced-motion: reduce) {
  .my-component {
    transition: none !important;
    animation: none !important;
  }
}
```

## Best Practices

1. **Use Tokens Consistently**: Always use token utilities rather than hardcoded values
2. **Respect Variant Boundaries**: Don't override one variant's styles from another
3. **Test All Variants**: Ensure each component looks good in all supported themes
4. **Document Token Usage**: Note which tokens each component uses
5. **Follow Accessibility Guidelines**: Use the provided accessibility helpers
6. **Use Semantic Elements**: Ensure correct HTML element usage regardless of styling
7. **Test Color Contrast**: Verify all text meets WCAG AA contrast requirements

## Migration Guide

When updating existing components to use the token system:

1. Define a `ThemeableComponent` configuration for the component
2. Replace hardcoded styles with token references
3. Use the `applyTheme` utility for class generation
4. Update SCSS to use variable-based styling
5. Add support for all variants
6. Implement reduced motion alternatives for animations

## Further Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [Designing for Reduced Motion](https://web.dev/prefers-reduced-motion/)
- [Design Tokens Overview](https://css-tricks.com/what-are-design-tokens/) 