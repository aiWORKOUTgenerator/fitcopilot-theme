# CustomizedMedical Module

This module has been created for the "Receive Your Personalized Plan" step of the Registration Journey, with a focus on collecting medical and anthropometric data.

## Features

- **Modular Architecture**: Standalone module with clear separation of concerns
- **Comprehensive Medical Data Collection**:
  - Anthropometrics (height, weight, age, gender)
  - Injuries and limitations (categorized by body part/type)
  - Medical clearance questions
  - Liability waiver agreement
- **Enhanced User Experience**:
  - Step-by-step accordion interface
  - Clear validation feedback
  - Progress tracking
- **Persistent State Management**:
  - Session storage for data persistence
  - Synchronization with Journey context

## Structure

The module follows the feature-first organization pattern established in CustomizeExperience:

```
CustomizedMedical/                # Main module directory
├── index.ts                      # Exports the CustomizedMedical component
├── CustomizedMedical.tsx         # Main container component
├── CustomizedMedical.scss        # Styles specific to this step
├── types.ts                      # TypeScript definitions
├── hooks/                        # Custom hooks for state management
├── components/                   # Sub-components for each section
│   ├── AnthropometricsSelector/  # Height, weight, age, gender inputs
│   ├── InjuriesSelector/         # Categorized injury selection
│   ├── MedicalClearanceSelector/ # Medical clearance questions
│   ├── LiabilityWaiverSelector/  # Liability agreement
│   └── shared/                   # Shared UI components
├── constants/                    # Configuration constants
│   ├── sectionConstants.ts       # Section identifiers
│   ├── injuriesOptions.ts        # Predefined injury options by category
│   └── anthropometricsOptions.ts # Unit options and other constants
└── utils/                        # Utility functions
```

## Usage

The module is designed to be used as part of the Journey component:

```tsx
<CustomizedMedical onValidChange={handleValidityChange} />
```

The component will:
1. Display a series of expandable sections for medical data collection
2. Allow users to input their anthropometric data
3. Let users select any injuries or limitations they have
4. Ask about medical clearance requirements
5. Present a liability waiver for agreement
6. Track progress across all sections
7. Store data persistently in session storage

## Integration

This module is integrated into the Journey workflow in the JourneyStepCard component, appearing as the third step in the registration process. 