---
sidebar_position: 3
title: Directory Patterns
description: Standard directory patterns for organizing features and components in the FitCopilot theme
keywords: [directory, patterns, organization, structure]
tags: [architecture, patterns, organization]
---

# Directory Patterns

This document outlines the standard directory patterns used in the FitCopilot theme. Following these patterns ensures consistency across the codebase and makes it easier for developers to navigate and maintain the application.

## Feature-First Structure

The FitCopilot theme follows a feature-first approach, organizing code by business domain rather than technical type. The top-level directory structure is:

```
src/
├── features/             # Main application features
├── components/           # Shared UI components
├── hooks/                # Shared custom hooks
├── utils/                # Utility functions
├── types/                # Global type definitions
└── styles/               # Global styles
```

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

## Shared Component Structure

Shared components that are used across multiple features should follow this structure:

```
src/components/<ComponentType>/<ComponentName>/
├── <ComponentName>.tsx     # Main component implementation
├── <ComponentName>.scss    # Component-specific styles
├── <ComponentName>.test.tsx # Component tests
└── index.ts                # Re-exports the component
```

### Example: Button Component

```
src/components/UI/Button/
├── Button.tsx
├── Button.scss
├── Button.test.tsx
└── index.ts
```

## Custom Hook Structure

Custom hooks follow a similar structure:

```
src/hooks/<hookName>/
├── <hookName>.ts      # Hook implementation
├── <hookName>.test.ts # Hook tests
└── index.ts           # Re-exports the hook
```

## Benefits of Following These Patterns

- **Consistency**: Makes it easier for developers to navigate the codebase
- **Maintainability**: Clear organization makes maintenance tasks more straightforward
- **Scalability**: New features can be added in a structured way
- **Onboarding**: New developers can quickly understand the organization of the codebase

## Related Documentation

:::tip Related Documentation
- [Feature-First Approach](./feature-first-approach.md)
- [Component Model](./component-model.md)
- [Theme Variants System](./variant-system.md)
::: 