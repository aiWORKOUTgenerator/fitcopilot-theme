# CustomizeExperience Module

This module has been created as an enhancement to the "Customize Your Experience" step of the Registration Journey.

## Improvements

- **Modular Architecture**: The component has been restructured into a standalone module with clear separation of concerns
- **Robust State Management**: Added `useCustomizationState` hook for centralized state management
- **Enhanced Data Persistence**: Session storage with debounced auto-saving of user selections
- **Improved UX**: 
  - Smart transitions between sections
  - Better scrolling behavior
  - Visual feedback for completed sections
  - More responsive UI for different screen sizes
- **Accessibility Improvements**: 
  - Enhanced keyboard navigation
  - Proper ARIA roles and attributes
  - Support for reduced motion preferences
- **Performance Optimizations**:
  - Memoized components and callbacks
  - Throttled scroll events
  - Deferred animations

## Structure

```
CustomizeExperience/               # Main module directory
├── index.ts                       # Exports the CustomizeExperience component
├── CustomizeExperience.tsx        # Main container component
├── CustomizeExperience.scss       # Styles specific to this step
├── types.ts                       # TypeScript definitions for this module
├── hooks/                         # Custom hooks for this module
│   └── useCustomizationState.ts   # Manages state with caching
├── components/                    # Sub-components specific to this step
│   ├── EquipmentSelector/         # Equipment selection section
│   ├── TimeCommitmentSelector/    # Time commitment selection section
│   ├── ExperienceLevelIndicator/  # Shows current experience level (read-only)
│   └── shared/                    # Shared components
├── utils/                         # Utility functions
│   ├── customizationStorage.ts    # Handles data persistence
│   └── scrollUtils.ts             # Scrolling utilities
└── constants/                     # Constants and option definitions
    ├── sectionConstants.ts        # Section identifiers
    ├── equipmentOptions.ts        # Equipment selection options
    └── timeCommitmentOptions.ts   # Time commitment options
```

## Usage

The module is designed to be a direct replacement for the previous CustomizationContainer component:

```tsx
<CustomizeExperience onValidChange={handleValidityChange} />
```

It maintains the same API contract while providing enhanced functionality. 