# Training Component Decomposition

This document outlines the decomposition of the Training component into smaller, focused components following the feature-first architecture approach.

## Component Structure

The Training feature has been decomposed into the following components:

### Main Component
- `Training.tsx`: The main component that orchestrates the feature

### Utility Components
- `programUtils.ts`: Utility functions for mapping program data with icons

### Subcomponents
1. **SectionHeader**
   - Purpose: Renders the section title, description, and tag
   - Props: title, description, tagText, variant, id

2. **ProgramsList**
   - Purpose: Manages and renders the list of training programs
   - Props: programs, selectedProgram, onProgramClick, onNavigate, variant, prefersReducedMotion
   - Contains: 
     - ExpandedContent (internal): Renders the expanded view of a selected program

3. **TrainingCTA**
   - Purpose: Renders the main call-to-action button
   - Props: onNavigate, variant

4. **ProgramCard** (existing)
   - Purpose: Renders individual program cards
   - Used by: ProgramsList

5. **BenefitsList** (existing)
   - Purpose: Renders the list of benefits for a program
   - Used by: ExpandedContent in ProgramsList

## Benefits of Decomposition

1. **Improved Readability**: The main Training component is now more focused and easier to understand
2. **Enhanced Maintainability**: Each component is responsible for a specific part of the UI
3. **Reusability**: Components like SectionHeader can be reused across features
4. **Testing**: Each component can be tested in isolation
5. **Code Organization**: The file structure follows the feature-first approach

## File Structure

```
src/features/Homepage/Training/
├── Training.tsx                   # Main component
├── Training.scss                  # Main component styles
├── README.md                      # Documentation
├── types.ts                       # Type definitions
├── data/
│   └── defaultProgramsData.ts     # Default data
├── components/
│   ├── index.ts                   # Component exports
│   ├── BenefitsList/              # Existing component
│   ├── ProgramCard/               # Existing component
│   ├── TrainingCTA/               # Component for CTA button
│   │   ├── TrainingCTA.tsx
│   │   ├── TrainingCTA.scss
│   │   └── types.ts
│   ├── ProgramsList/              # New component for programs list
│   │   ├── index.ts
│   │   ├── ProgramsList.tsx
│   │   ├── ProgramsList.scss
│   │   └── types.ts
│   └── SectionHeader/             # Component for section headers
│       ├── index.ts
│       ├── SectionHeader.tsx
│       └── SectionHeader.scss
├── utils/
│   ├── programUtils.ts            # Program-related utilities
│   ├── accessibilityHelpers.tsx   # Accessibility helpers
│   └── gradientTokens.ts          # Token definitions
├── hooks/
│   ├── index.ts
│   ├── useTrainingPrograms.ts     # Programs state management
│   └── useReducedMotion.tsx       # Motion preferences
└── docs/
    ├── PERFORMANCE.md             # Performance documentation
    └── COMPONENT_BREAKDOWN.md     # This file
```

## How Components Interact

```
Training
│
├── SectionHeader (renders section title and description)
│
├── ProgramsList (handles list of programs and selection)
│   │
│   ├── ProgramCard (for each program)
│   │
│   └── ExpandedContent (when a program is selected)
│       │
│       └── BenefitsList (shows program benefits)
│
└── TrainingCTA (call-to-action button)
```

This decomposition aligns with FitCopilot's architecture principles and improves the maintainability of the code while keeping the component count under the recommended 250-line limit. 