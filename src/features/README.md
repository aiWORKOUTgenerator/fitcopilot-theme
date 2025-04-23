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