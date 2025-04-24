# Export Pattern Standards

## Overview

This document establishes standardized export patterns for the FitCopilot Theme codebase to ensure consistency and clarity.

## Feature Modules

### Main Feature Export

Each feature module should export its main component as a default export:

```typescript
// src/features/FeatureName/index.ts
export { default } from './FeatureName';
```

### Sub-Component Exports

Sub-components should use named exports through the feature's main index file:

```typescript
// src/features/FeatureName/index.ts
export { default } from './FeatureName';
export { SubComponentA } from './SubComponentA';
export { SubComponentB } from './SubComponentB';
```

### Type Exports

Types should be exported separately to allow for type-only imports:

```typescript
// src/features/FeatureName/index.ts
export type { FeatureNameProps } from './FeatureName';
export type { SubComponentAProps } from './SubComponentA';
```

## Component Implementation

### Standard Component Export

Components should use default exports in their implementation files:

```typescript
// src/features/FeatureName/FeatureName.tsx
import React from 'react';

interface FeatureNameProps {
  // props...
}

const FeatureName: React.FC<FeatureNameProps> = (props) => {
  // implementation...
};

export default FeatureName;
export type { FeatureNameProps };
```

### Variant Components

Variant components should follow a consistent pattern:

```typescript
// src/features/FeatureName/ComponentName/index.ts
import { createVariantComponent } from '../../../utils/variantLoader';
import DefaultVariant from './default';
import AlternateVariant from './alternate';
import type { ComponentProps, VariantKey } from './types';

export const VariantMap: Record<VariantKey, React.ComponentType<Omit<ComponentProps, 'variant'>>> = {
  default: DefaultVariant,
  alternate: AlternateVariant
};

const Component = createVariantComponent<VariantKey, ComponentProps>(VariantMap, 'default');

export { Component };
export * from './types';
```

## Hooks

Hooks should use named exports:

```typescript
// src/features/FeatureName/hooks/useFeatureHook.ts
export function useFeatureHook() {
  // implementation...
}
```

And be re-exported from a hooks index file:

```typescript
// src/features/FeatureName/hooks/index.ts
export { useFeatureHook } from './useFeatureHook';
export { useAnotherHook } from './useAnotherHook';
```

## Migration Process

When consolidating duplicate files:
1. Preserve the TypeScript implementation
2. Ensure all exports follow these standards
3. Update imports in consuming files
4. Remove the JavaScript version only after verification 