# Features Directory

This directory contains feature-based modules that follow the project's feature-first architecture.

## Structure Guidelines

Each feature should follow this structure:

```
FeatureName/
├── index.ts                # Exports the feature's public API
├── FeatureName.tsx         # Main container component
├── FeatureName.scss        # Main styles
├── types.ts                # TypeScript definitions
├── hooks/                  # Feature-specific hooks
│   └── index.ts
├── SectionName/            # Feature sections/modules
│   ├── index.ts
│   ├── SectionName.tsx
│   ├── SectionName.scss
│   ├── types.ts
│   └── components/         # Section-specific components
│       ├── ComponentName.tsx
│       ├── ComponentName.scss
│       └── index.ts
└── utils/                  # Feature-specific utilities
```

## Import/Export Pattern

For optimal TypeScript compatibility:

```typescript
// In component files
export const Component = () => {...};
export default Component;

// In index.ts files
import Component from './Component';
export { Component };

// For main feature index.ts
import FeatureComponent from './FeatureComponent';
export default FeatureComponent;

// Direct component imports when TypeScript has issues
import { Component } from './SectionName/Component';
```

## Common Issues

If TypeScript complains about missing modules:
1. Use direct file paths to components (`./SectionName/Component` not `./SectionName`)
2. Ensure components are exported both as named and default exports
3. Check that tsconfig.json paths are configured correctly

See the full documentation in `/docs/feature-architecture.md`

# Feature-First Architecture with Variant Support

This codebase follows a feature-first architecture pattern with built-in support for visual variants.

## Directory Structure

```
src/
├── features/                  # Application features
│   ├── Homepage/
│   │   ├── Hero/              # A feature component
│   │   │   ├── default/       # Default variant implementation
│   │   │   │   ├── Hero.tsx   # Component implementation for default variant
│   │   │   │   └── index.ts   # Re-exports the component
│   │   │   ├── gym/           # Gym variant implementation
│   │   │   │   ├── Hero.tsx   # Component implementation for gym variant
│   │   │   │   └── index.ts   # Re-exports the component
│   │   │   ├── Hero.scss      # Shared styles across variants
│   │   │   ├── index.ts       # Main entry point with variant selection logic
│   │   │   ├── types.ts       # Type definitions including VariantKey
│   │   │   └── Hero.stories.tsx # Storybook stories for all variants
│   │   └── ... other features
│   └── shared/                # Shared components across features
├── hooks/                     # Shared custom hooks
├── utils/                     # Utility functions
│   └── variantLoader.ts       # Helper utilities for variant loading
├── types/                     # Global type definitions
│   └── global.d.ts           # Global types for WordPress data
└── styles/                    # Global styles and theme
```

## Variant System

The variant system allows components to have multiple visual styles (e.g., "default", "gym") that can be chosen at runtime. This enables theme customization without duplicating code.

### How It Works

1. Each component that supports variants has:
   - A `types.ts` file defining available variants
   - A directory for each variant implementation
   - A main `index.ts` that dynamically selects the correct variant

2. WordPress integration:
   - Variants are configurable in the WordPress Customizer
   - Settings are passed to React via `window.athleteDashboardData`

3. Usage in components:
   ```tsx
   // In a parent component
   import { Hero, getHeroVariant } from './Hero';
   
   const MyComponent = () => {
     // Get variant from WordPress settings
     const heroVariant = getHeroVariant();
     
     return <Hero variant={heroVariant} />;
   };
   ```

### Adding a New Variant

1. Define the new variant in `types.ts`:
   ```ts
   export type VariantKey = 'default' | 'gym' | 'new-variant';
   ```

2. Create a new directory with the implementation:
   ```
   mkdir -p src/features/Homepage/Hero/new-variant
   ```

3. Implement the component in `new-variant/Hero.tsx`

4. Create an index file in `new-variant/index.ts`:
   ```ts
   import Hero from './Hero';
   export default Hero;
   ```

5. Add the variant to the component map in `index.ts`:
   ```ts
   export const HeroMap = {
     default: DefaultHero,
     gym: GymHero,
     'new-variant': NewVariantHero
   };
   ```

6. Update the WordPress customizer in `includes/theme-variants.php`

### Utility Functions

The `utils/variantLoader.ts` file provides helpers:

- `createVariantComponent`: Creates a component that dynamically loads variants
- `getComponentVariant`: Gets a variant setting from WordPress
- `getWordPressVariants`: Fetches all variant settings

## Storybook Integration

Each variant has Storybook stories for documentation and testing:

```tsx
// Example: Hero.stories.tsx
export const Default: Story = {
  args: { variant: 'default' }
};

export const Gym: Story = {
  args: { variant: 'gym' }
};

// Compare variants side-by-side
export const VariantComparison: Story = { /* ... */ };
```

## WordPress Customizer

In the WordPress admin, navigate to Appearance > Customize > Theme Variants to select variants for each component. 