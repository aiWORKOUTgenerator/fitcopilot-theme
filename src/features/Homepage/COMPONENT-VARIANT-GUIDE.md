# Component Variant Architecture Guide

This guide outlines the component architecture pattern for the FitCopilot theme, designed to work seamlessly with the WordPress theme variant system.

## Component Structure Pattern

Each feature component should follow this structure:

```
FeatureName/
├── variants/                 # Theme variants directory
│   ├── default/              # Default variant (can re-export root)
│   ├── modern/               # Modern variant
│   ├── classic/              # Classic variant
│   ├── minimalist/           # Minimalist variant
│   ├── sports/               # Sports variant
│   └── wellness/             # Wellness variant
├── FeatureName.tsx           # Main/default implementation
├── FeatureName.scss          # Component styles
├── types.ts                  # TypeScript types and interfaces
├── index.ts                  # Exports with variant handling
└── README.md                 # Documentation
```

## WordPress Theme Variants

The following variants are defined in `theme-variants.php` and should be supported by all feature components:

- **default**: Main/standard design
- **modern**: Contemporary, cutting-edge design
- **classic**: Traditional, timeless design
- **minimalist**: Clean, distraction-free design
- **sports**: Athletic, high-energy design
- **wellness**: Calm, health-focused design

## Implementation Guidelines

### 1. Main Component

Create the main component at the root level as the default implementation:

```tsx
// FeatureName.tsx
import React from 'react';
import { FeatureNameProps } from './types';
import './FeatureName.scss';

const FeatureName: React.FC<FeatureNameProps> = (props) => {
  // Implementation
};

export default FeatureName;
```

### 2. Type Definitions

Define the component props and variant types:

```tsx
// types.ts
export type VariantKey = 'default' | 'modern' | 'classic' | 'minimalist' | 'sports' | 'wellness';

export interface FeatureNameProps {
  variant?: VariantKey;
  // Other props
}
```

### 3. Variant Implementations

For each variant, create a directory with an implementation or re-export:

```tsx
// variants/default/index.ts
import FeatureName from '../../FeatureName';
export default FeatureName;
```

For custom variants:

```tsx
// variants/sports/FeatureName.tsx
import React from 'react';
import { FeatureNameProps } from '../../types';
import '../../FeatureName.scss';

const FeatureName: React.FC<FeatureNameProps> = (props) => {
  // Sports-specific implementation
};

export default FeatureName;

// variants/sports/index.ts
import FeatureName from './FeatureName';
export default FeatureName;
```

### 4. Variant Loading

Set up variant loading in the main index.ts:

```tsx
// index.ts
import React from 'react';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import type { FeatureNameProps, VariantKey } from './types';

// Import variants
import DefaultVariant from './variants/default';
import ModernVariant from './variants/modern';
// ... other variants

export const FeatureNameMap: Record<VariantKey, React.ComponentType<Omit<FeatureNameProps, 'variant'>>> = {
  default: DefaultVariant,
  modern: ModernVariant,
  // ... other variants
};

const FeatureName = createVariantComponent<VariantKey, FeatureNameProps>(
  FeatureNameMap, 'default'
);

export const getFeatureNameVariant = (): VariantKey => {
  return getComponentVariant<VariantKey>('featureName', 'default');
};

export { FeatureName };
export type { FeatureNameProps };
```

## Usage in Homepage Component

Use the component in the main Homepage component:

```tsx
import { FeatureName, getFeatureNameVariant } from './FeatureName';

const Homepage = () => {
  // Get variant from WordPress theme settings
  const variant = getFeatureNameVariant();
  
  return (
    <section id="featureName">
      <FeatureName variant={variant} />
    </section>
  );
};
```

## Migrating Existing Components

When migrating existing components:

1. Move any variant-specific implementation to the appropriate variant directory
2. Ensure the main component serves as the default implementation
3. Update types to match WordPress variant names
4. Create placeholders for missing variants that re-export the default

See the PersonalTraining component for a reference implementation of this pattern. 