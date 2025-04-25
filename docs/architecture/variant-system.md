---
sidebar_position: 4
title: Theme Variants System
description: Overview of the theme variants system in the FitCopilot theme
keywords: [theme variants, customization, visual styles]
tags: [architecture, themes, variants]
---

# Theme Variants System

The FitCopilot theme implements a flexible theme variants system that allows for multiple visual styles while maintaining consistent functionality. This document describes how the variant system works and how to implement components that support multiple variants.

## Overview

The theme variants system allows users to select different visual styles for the theme through the WordPress customizer. Each variant provides a different look and feel while preserving the same functionality.

Currently, the theme supports these variants:

- **Default**: The standard visual style
- **Gym**: A high-contrast, energetic style for gym-focused clients

## How Variants Work

Variants are implemented using a combination of:

1. **Component Variants**: Different component implementations for each variant
2. **CSS Variables**: Theme-specific CSS variables for colors, spacing, etc.
3. **WordPress Customizer**: Settings that allow users to select their preferred variant

## Directory Patterns for Feature Sections

Each feature section should live under its feature folder, with one sub-folder per variant, plus shared types/styles and an index loader:

```
src/features/<FeatureName>/<SectionName>/
├── default/           # Default variant implementation
│   └── <Component>.tsx
├── gym/               # Gym variant implementation
│   └── <Component>.tsx
├── types.ts           # Variant key definitions
├── <SectionName>.scss # Shared styles
└── index.ts           # Exports a variant-loader component
```

### Hero Example

The Homepage Hero section follows this pattern:

```
src/features/Homepage/Hero/
├── default/Hero.tsx
├── gym/Hero.tsx
├── types.ts
├── Hero.scss
└── index.ts
```

### Features Example

The Homepage Features section also follows this pattern:

```
src/features/Homepage/Features/
├── default/Features.tsx
├── gym/Features.tsx
├── types.ts
├── Features.scss
└── index.ts
```

These real-world examples serve both as proof that the pattern is implemented and as copy-and-paste starter templates for new sections.

### Adding a New Section

1. **Create the folder**  
   ```bash
   mkdir -p src/features/<FeatureName>/<SectionName>/new-variant
   ```
2. **Extend the type** in `types.ts`:  
   ```ts
   export type VariantKey = 'default' | 'gym' | 'new-variant';
   ```
3. **Implement the component** in `new-variant/<Component>.tsx`  
4. **Update the map** in `index.ts`:  
   ```ts
   import NewVariant from './new-variant';
   export const SectionMap: Record<VariantKey, ComponentType> = {
     default: DefaultComponent,
     gym: GymComponent,
     'new-variant': NewVariant,
   };
   ```
5. **Expose it** in the WordPress customizer under `includes/theme-variants.php`.

## Implementation Details

### Component Level

For components that need variant-specific implementations:

```tsx
// src/features/Homepage/Hero/types.ts
export type VariantKey = 'default' | 'gym';

// src/features/Homepage/Hero/index.ts
import { ComponentType } from 'react';
import { VariantKey } from './types';
import DefaultHero from './default/Hero';
import GymHero from './gym/Hero';

export const HeroMap: Record<VariantKey, ComponentType> = {
  default: DefaultHero,
  gym: GymHero
};

export default function Hero() {
  // Get current theme variant from context or WordPress data
  const currentVariant: VariantKey = useThemeVariant();
  const VariantComponent = HeroMap[currentVariant] || HeroMap.default;
  
  return <VariantComponent />;
}
```

### CSS Variables

Each variant has its own set of CSS variables:

```scss
// src/styles/variants/default.scss
:root {
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --font-heading: 'Roboto', sans-serif;
  // ...more variables
}

// src/styles/variants/gym.scss
:root {
  --color-primary: #e74c3c;
  --color-secondary: #f39c12;
  --font-heading: 'Oswald', sans-serif;
  // ...more variables
}
```

### WordPress Integration

The theme variant is stored as a WordPress theme mod and exposed to the React application:

```php
// includes/theme-variants.php
function fitcopilot_get_current_variant() {
    return get_theme_mod('fitcopilot_theme_variant', 'default');
}

function fitcopilot_enqueue_variant_styles() {
    $variant = fitcopilot_get_current_variant();
    wp_enqueue_style(
        'fitcopilot-variant',
        get_template_directory_uri() . "/assets/css/variants/{$variant}.css",
        array('fitcopilot-main'),
        FITCOPILOT_VERSION
    );
}
add_action('wp_enqueue_scripts', 'fitcopilot_enqueue_variant_styles');

// Expose to JavaScript
function fitcopilot_localize_variant() {
    wp_localize_script('fitcopilot-main', 'fitCopilotData', array(
        'themeVariant' => fitcopilot_get_current_variant(),
        // Other data...
    ));
}
add_action('wp_enqueue_scripts', 'fitcopilot_localize_variant');
```

## Adding a New Variant

To add a new theme variant:

1. Create variant-specific component implementations
2. Define CSS variables for the new variant
3. Update the WordPress customizer to include the new variant option
4. Update type definitions to include the new variant

## Best Practices

- Keep variant-specific code minimal and focused on visual differences
- Use shared components and logic wherever possible
- Maintain consistent functionality across variants
- Test all variants thoroughly when making changes

## Related Documentation

:::tip Related Documentation
- [Directory Patterns](./directory-patterns.md)
- [Feature-First Approach](./feature-first-approach.md)
- [Component Model](./component-model.md)
::: 