# Homepage Shared Type System

This directory contains the unified type system for the FitCopilot Homepage architecture consistency project. The shared types eliminate duplicate definitions and provide a consistent foundation for all Homepage components.

## 📋 Overview

The shared type system addresses the following architectural inconsistencies:

- **9 different `VariantKey` definitions** across sections → **1 unified `GlobalVariantKey`**
- **Duplicate component prop interfaces** → **Standardized base interfaces**
- **Inconsistent button implementations** → **Unified `BaseButtonProps`**
- **Mixed type naming conventions** → **Consistent naming patterns**

## 🎯 Core Types

### GlobalVariantKey

The unified variant system supporting all theme variations:

```typescript
import { GlobalVariantKey } from './shared';

// All sections now use the same variant type
const heroVariant: GlobalVariantKey = 'gym';
const featuresVariant: GlobalVariantKey = 'sports';
const trainingVariant: GlobalVariantKey = 'wellness';
```

**Available Variants**:
- `default` - Standard theme (lime/emerald gradients)
- `gym` - Gym theme (purple/violet gradients)  
- `sports` - Sports theme (cyan/blue gradients)
- `wellness` - Wellness theme (teal/green gradients)
- `modern` - Modern theme (amber/orange gradients)
- `classic` - Classic theme (red/orange gradients)
- `minimalist` - Minimalist theme (gray/neutral gradients)
- `boutique` - Boutique theme (wellness variant)
- `registration` - Registration-specific variant
- `mobile` - Mobile-optimized variant

### Base Component Interfaces

#### BaseComponentProps

Foundation interface for all Homepage components:

```typescript
import { BaseComponentProps } from './shared';

interface MyComponentProps extends BaseComponentProps {
  title: string;
  description?: string;
  // variant, className, children, id, data-testid inherited
}
```

#### BaseSectionProps

For Homepage section components (Hero, Features, Training, etc.):

```typescript
import { BaseSectionProps } from './shared';

interface HeroProps extends BaseSectionProps {
  headline?: string;
  subheadline?: string;
  onRegistrationStart?: () => void;
  // sectionId, backgroundColor, fullWidth, padding inherited
}
```

#### BaseButtonProps

For all button components across sections:

```typescript
import { BaseButtonProps } from './shared';

interface HeroButtonProps extends BaseButtonProps {
  // All standard button props inherited:
  // size, variant, leftIcon, rightIcon, fullWidth, disabled, 
  // isLoading, href, target, type, onClick, aria-* attributes
}
```

## 🔄 Migration Guide

### From Section-Specific Types

**Before** (each section had its own types):
```typescript
// Hero/types.ts
type HeroVariantKey = 'default' | 'gym' | 'sports' | 'wellness';

// Features/types.ts  
type VariantKey = 'default' | 'gym' | 'boutique' | 'modern';

// Training/types.ts
type VariantKey = 'default' | 'boutique' | 'classic' | 'minimalist';
```

**After** (unified system):
```typescript
// All sections import from shared
import { GlobalVariantKey } from '../types/shared';

// Use GlobalVariantKey everywhere
interface ComponentProps {
  variant?: GlobalVariantKey;
}
```

### Component Props Migration

**Before**:
```typescript
interface HeroButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}
```

**After**:
```typescript
import { BaseButtonProps } from '../types/shared';

interface HeroButtonProps extends BaseButtonProps {
  // All base props inherited, add only Hero-specific props if needed
}
```

## 🛠️ Usage Examples

### Component Development

```typescript
import React from 'react';
import { BaseComponentProps, GlobalVariantKey } from '../types/shared';

interface FeatureCardProps extends BaseComponentProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  return (
    <div 
      className={`feature-card feature-card--${variant} ${className}`}
      {...props}
    >
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
};
```

### Variant Component Creation

```typescript
import { VariantComponentMap, GlobalVariantKey } from '../types/shared';

interface MyComponentProps extends BaseComponentProps {
  title: string;
}

// Create variant map
const MyComponentMap: VariantComponentMap<MyComponentProps> = {
  default: DefaultVariant,
  gym: GymVariant,
  sports: SportsVariant,
  wellness: WellnessVariant,
  // ... other variants
};
```

### Button Component Extension

```typescript
import { BaseButtonProps } from '../types/shared';

interface SectionButtonProps extends BaseButtonProps {
  // Section-specific props only
  sectionType?: 'hero' | 'features' | 'training';
}

const SectionButton: React.FC<SectionButtonProps> = ({
  sectionType = 'hero',
  children,
  ...baseProps
}) => {
  return (
    <BaseButton 
      className={`section-button section-button--${sectionType}`}
      {...baseProps}
    >
      {children}
    </BaseButton>
  );
};
```

## 🚨 Breaking Changes

### Type Import Updates Required

All sections need to update their type imports:

```typescript
// OLD - Remove these imports
import { VariantKey } from './types';
import { HeroVariantKey } from './types';

// NEW - Use shared types
import { GlobalVariantKey } from '../types/shared';
```

### Component Props Updates

Components extending section-specific base props need updates:

```typescript
// OLD
interface ComponentProps {
  variant?: VariantKey;
  className?: string;
  children?: React.ReactNode;
}

// NEW
import { BaseComponentProps } from '../types/shared';

interface ComponentProps extends BaseComponentProps {
  // Only component-specific props here
}
```

## 📊 Type Conflict Resolution

### Identified Conflicts

| Section | Conflicting Type | Resolution |
|---------|------------------|------------|
| Hero | `HeroVariantKey` | Use `GlobalVariantKey` |
| Features | `VariantKey` | Use `GlobalVariantKey` |
| Training | `VariantKey` | Use `GlobalVariantKey` |
| Journey | `VariantKey` | Use `GlobalVariantKey` |
| Features | `ProgressDataPoint` | Keep in Features/types.ts |
| Features | `WorkoutExercise` | Keep in Features/types.ts |

### Migration Checklist

- [ ] Update all `VariantKey` imports to `GlobalVariantKey`
- [ ] Extend `BaseComponentProps` instead of custom interfaces
- [ ] Use `BaseButtonProps` for all button components
- [ ] Remove duplicate type definitions
- [ ] Update component prop interfaces
- [ ] Verify TypeScript compilation
- [ ] Update tests with new type imports

## 🔗 Related Files

- `shared.ts` - Core type definitions
- `../Hero/types.ts` - Hero-specific types (to be updated)
- `../Features/types.ts` - Features-specific types (to be updated)
- `../Training/types.ts` - Training-specific types (to be updated)

## 📝 Next Steps

1. **Phase 1 Completion**: Validate types with Hero section
2. **Phase 2**: Update all sections to use shared types
3. **Phase 3**: Remove duplicate type definitions
4. **Phase 4**: Comprehensive testing and validation

---

*This type system is part of the Homepage Architecture Consistency project Phase 1. For questions or issues, refer to the sprint documentation.* 