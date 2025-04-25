---
sidebar_position: 2
title: Feature-First Approach
description: Detailed explanation of the feature-first architecture used in the FitCopilot theme
keywords: [feature-first, architecture, organization, code structure]
tags: [architecture, feature-first]
---

# Feature-First Architecture

The FitCopilot theme implements a feature-first architecture that organizes code by business domain rather than by technical type. This approach provides better scalability, maintainability, and developer experience by co-locating related code regardless of its technical classification.

## Core Principles

1. **Feature Encapsulation**: Each feature should be self-contained with minimal dependencies on other features.
2. **Single Responsibility**: Components should have one clear purpose.
3. **Clear Interfaces**: Features expose a well-defined public API through index files.
4. **Domain-Driven**: Organization follows business domains rather than technical classifications.
5. **Component Reusability**: UI components within features follow patterns that enable reuse.

## Directory Structure

The feature-first architecture is implemented with the following directory structure:

```
src/
├── features/                       # All application features
│   ├── Homepage/                   # Homepage feature
│   │   ├── index.ts                # Public API exports
│   │   ├── Homepage.tsx            # Main container component
│   │   ├── Hero/                   # Feature section
│   │   │   ├── Hero.tsx            # Component implementation
│   │   │   ├── Hero.scss           # Component styles
│   │   │   ├── types.ts            # TypeScript definitions
│   │   │   ├── index.ts            # Section exports
│   │   │   └── components/         # Sub-components
│   │   │       ├── HeroButton.tsx  # UI component
│   │   │       ├── HeroLogo.tsx    # UI component
│   │   │       └── index.ts        # Component exports
│   │   ├── Features/               # Another section following same pattern
│   │   ├── Journey/                # Another section following same pattern
│   │   └── hooks/                  # Feature-specific hooks
│   │       ├── useHomepageData.ts  # Data fetching/manipulation
│   │       └── index.ts            # Hook exports
│   └── [OtherFeature]/             # Other application features
├── hooks/                          # Global shared hooks
├── utils/                          # Utility functions
├── styles/                         # Global styles
└── types/                          # Global type definitions
```

## Component Hierarchy

The feature-first architecture defines a clear component hierarchy to maintain separation of concerns:

1. **Feature Container Components**: Top-level components that compose sections (e.g., `Homepage.tsx`)
2. **Feature Section Components**: Represent distinct sections within a feature (e.g., `Hero.tsx`, `Pricing.tsx`)
3. **UI Components**: Reusable building blocks within sections (e.g., `HeroButton.tsx`, `PricingCard.tsx`)

This hierarchy ensures that:

- Features are composed of independent sections
- Sections handle their own business logic
- UI components are reusable across sections and features

## Import/Export Patterns

To maintain TypeScript compatibility and clean dependency management, we use a specific import/export pattern:

```typescript
// In a feature's main index.ts
import Homepage from './Homepage';
export default Homepage;

// Direct imports for components
import { Hero } from './Hero';
export { Hero };
```

For component files, we use both named exports and default exports:

```typescript
// Component file (e.g., Hero.tsx)
export const Hero: React.FC<HeroProps> = ({ /* props */ }) => {
  // Implementation
};

export default Hero;
```

## State Management

The feature-first architecture defines how state is managed:

- **Feature-Level State**: Each feature manages its own state with React hooks
- **Cross-Feature State**: Shared state should be minimized but can be managed through context or global state
- **Component State**: UI components should have minimal internal state, primarily for UI interactions

## Avoiding Common Pitfalls

### 1. Feature Interdependencies

❌ **Avoid** creating direct imports between features:

```typescript
// Avoid this
import { UserProfile } from '../UserProfile/UserProfile';
```

✅ **Instead**, use composition through the parent component:

```typescript
// ParentComponent.tsx
import { Homepage } from './Homepage';
import { UserProfile } from './UserProfile';

export const ParentComponent = () => (
  <>
    <Homepage />
    <UserProfile />
  </>
);
```

### 2. Code Duplication

❌ **Avoid** duplicating code across features:

```typescript
// Duplicate utility in multiple features
const formatDate = (date) => {...};
```

✅ **Instead**, extract to a shared utility:

```typescript
// utils/formatters.ts
export const formatDate = (date) => {...};

// In your feature
import { formatDate } from '../../utils/formatters';
```

### 3. Overly Nested Components

❌ **Avoid** excessively nesting components:

```
Feature/
├── FeatureSection/
│   ├── FeatureSubSection/
│   │   ├── FeatureSubSubSection/
```

✅ **Instead**, maintain a flat hierarchy where possible:

```
Feature/
├── MainSection/
├── SecondarySection/
├── TertiarySection/
```

## Best Practices

### Component Development

- Keep components focused and under 250 lines
- Extract reusable logic to custom hooks
- Use TypeScript interfaces for all props
- Document component props with JSDoc comments

### Feature Isolation

- Features should not directly import from other features
- Cross-feature communication should happen through shared contexts or events
- Features should expose a minimal public API

### Import Organization

- Group imports by category (React, external libraries, internal)
- Import styles directly in component files
- Import types from dedicated type files

### TypeScript Usage

- Define interfaces for all component props
- Use type exports for public API typing
- Avoid `any` types except in very specific cases

## Examples

### Feature Component Example

```tsx
import React from 'react';
import './FeatureName.scss';
import { FeatureProps } from './types';
import { SubComponent } from './components/SubComponent';

/**
 * FeatureName component - [Description of purpose]
 */
export const FeatureName: React.FC<FeatureProps> = ({ prop1, prop2 }) => {
  // Implementation
  return (
    <div className="feature-name">
      <SubComponent />
    </div>
  );
};

export default FeatureName;
```

### Feature Types Example

```typescript
// types.ts
export interface FeatureProps {
  /**
   * Title of the feature
   */
  title: string;
  
  /**
   * Description of the feature
   */
  description?: string;
  
  /**
   * Callback when the feature is interacted with
   */
  onInteraction?: () => void;
}
```

### Feature Index Example

```typescript
// index.ts
import FeatureName from './FeatureName';

// Named exports for sub-components
export { SubComponent } from './components/SubComponent';

// Type exports
export type { FeatureProps } from './types';

// Default export of the main component
export default FeatureName;
```

## Benefits of the Feature-First Approach

- **Improved Developer Experience**: Related code is co-located, making it easier to find and modify
- **Better Scalability**: Features can be added, removed, or modified with minimal impact on others
- **Enhanced Code Reuse**: Components and utilities are organized for better visibility and reuse
- **Clear Boundaries**: Features have well-defined interfaces and responsibilities
- **Easier Onboarding**: New developers can understand the application by focusing on features rather than technical layers

## Migrating to Feature-First Architecture

If you're transitioning from a different architectural approach:

1. Create the feature directory structure first
2. Move files one section at a time, maintaining functionality
3. Update imports to use the new structure
4. Refactor to follow the patterns described in this document

## Further Resources

- [Component Model](./component-model.md) - Learn about component classification
- [State Management](./state-management.md) - Understand state management patterns
- [Theme Variants System](./variant-system.md) - How theme variants are implemented

## Related Documentation

:::tip Related Documentation
- [Adding a New Feature](../development/adding-features.md)
- [Development Workflow](../development/workflow.md)
- [Storybook Integration](../development/storybook.md)
::: 