---
sidebar_position: 2
---

# Feature-Based Architecture

## Overview

This project uses a feature-based architecture to organize code by business domain rather than by technical type. This approach provides better scalability, maintainability, and developer experience by co-locating related code regardless of its technical classification.

## Core Principles

1. **Feature Encapsulation**: Each feature should be self-contained with minimal dependencies on other features.
2. **Single Responsibility**: Components should have one clear purpose.
3. **Clear Interfaces**: Features expose a well-defined public API through index files.
4. **Domain-Driven**: Organization follows business domains rather than technical classifications.
5. **Component Reusability**: UI components within features follow patterns that enable reuse.

## Directory Structure

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

We use a clear component hierarchy to maintain separation of concerns:

1. **Feature Container Components**: Top-level components that compose sections (e.g., `Homepage.tsx`)
2. **Feature Section Components**: Represent distinct sections within a feature (e.g., `Hero.tsx`, `Pricing.tsx`)
3. **UI Components**: Reusable building blocks within sections (e.g., `HeroButton.tsx`, `PricingCard.tsx`)

## Import/Export Patterns

To maintain TypeScript compatibility and clean dependency management, we use a direct import/export pattern:

```typescript
// In a feature's main index.ts
import Homepage from './Homepage';
export default Homepage;

// Direct imports from component files, not index files
import { Hero } from './Hero/Hero';
import { Features } from './Features/Features';

// Named exports of feature components
export {
  Hero,
  Features,
  // Other components
};
```

For component files, use both named exports and default exports:

```typescript
// Component file (e.g., Hero.tsx)
export const Hero: React.FC<HeroProps> = ({ /* props */ }) => {
  // Implementation
};

export default Hero;
```

## State Management

- **Feature-Level State**: Each feature manages its own state with React hooks
- **Cross-Feature State**: Shared state should be minimized but can be managed through context or global state
- **Component State**: UI components should have minimal internal state, primarily for UI interactions

## Styling Approach

We use SCSS modules for styling with the following conventions:

- Feature containers have minimal styling
- Section components manage layout and positioning
- UI components manage their own internal styling
- Global variables and mixins are imported from the global styles directory

Example:
```scss
// In a component SCSS file
.component-name {
  &__element {
    // Styles
  }
  
  &--modifier {
    // Styles
  }
}
```

## Best Practices

1. **Component Development**
   - Keep components focused and under 250 lines
   - Extract reusable logic to custom hooks
   - Use TypeScript interfaces for all props
   - Document component props with JSDoc comments

2. **Feature Isolation**
   - Features should not directly import from other features
   - Cross-feature communication should happen through shared contexts or events
   - Features should expose a minimal public API

3. **Import Organization**
   - Group imports by category (React, external libraries, internal)
   - Import styles directly in component files
   - Import types from dedicated type files

4. **TypeScript Usage**
   - Define interfaces for all component props
   - Use type exports for public API typing
   - Avoid `any` types except in very specific cases 