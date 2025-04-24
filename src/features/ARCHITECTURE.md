# FitCopilot Theme Architecture

## Overview

This document outlines the current architecture of the FitCopilot Theme and the ongoing migration to a feature-first approach.

## Current Structure

### Feature-First Organization
- `/src/features/`: Contains feature modules organized by business domain
  - `/Homepage/`: Homepage feature with all related components and logic
  - `/Workouts/`: Workout-related features

### Traditional Organization (Legacy)
- `/src/components/`: Global UI components 
- `/src/hooks/`: Shared React hooks
- `/src/styles/`: Global styles
- `/src/utils/`: Utility functions

## Feature Module Structure

Each feature module follows this pattern:
- `index.ts`: Public API exports
- `FeatureName.tsx`: Main component implementation
- `hooks/`: Feature-specific hooks
- Sub-components organized in directories:
  - `Hero/`: A section component with its implementation
  - `Features/`: Another section component

## Component Variant System

Components support variants through a variant system:
- `createVariantComponent`: Creates components that can render different variants
- `getComponentVariant`: Retrieves variant configuration from WordPress settings
- Variant implementations are organized in subdirectories (e.g., `default/`, `gym/`)

## Current Challenges

1. **Duplicate Files**: Many components have both `.js` and `.tsx` versions
2. **Inconsistent Exports**: Mix of default and named exports
3. **Cross-Feature Dependencies**: Features import from global directories, creating tight coupling
4. **Unclear Boundaries**: Public vs. private implementations aren't clearly defined

## Migration Path

We are consolidating to a fully feature-first architecture in phases:
1. **Phase 1**: Eliminate duplicates, standardize exports (current)
2. **Phase 2**: Strengthen feature boundaries
3. **Phase 3**: Refine state management
4. **Phase 4**: Optimize developer experience

## Guidelines

- Feature modules should export a clear public API through index files
- Co-locate related files (components, styles, hooks, tests)
- Keep implementation details private to features
- Shared code should be properly abstracted with clean interfaces 