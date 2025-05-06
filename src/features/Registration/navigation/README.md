# Registration Navigation Architecture

A centralized navigation system for the FitCopilot registration flow.

## Overview

This module provides a complete navigation architecture for the registration flow, including:

- Navigation schema with steps, substeps, and sections
- Centralized state management via Context API
- Progress tracking and validation
- Reusable components for consistent UI and behavior

## Key Components

### Navigation Schema

The navigation schema defines the structure of the registration flow:

- **Steps**: Main registration steps (Splash, ExperienceLevel, Journey, Pricing, etc.)
- **Substeps**: Sections within the Journey step (Goals, Equipment, etc.)
- **Sections**: Accordion sections within substeps (HomeEquipment, MedicalConditions, etc.)

### NavigationContext

Provides centralized state management with:

- Current step/substep/section tracking
- Progress and validation status for each step
- Navigation actions (next, previous, go to specific step)

### Reusable Components

- **RegistrationContainer**: Main container for the registration flow
- **RegistrationProgressIndicator**: Visual progress indicator for steps
- **RegistrationButton**: Standardized navigation buttons
- **AccordionSection**: Reusable section component for customization steps

## Usage

### Basic Setup

```tsx
// In your main component
import { RegistrationContainer } from './navigation';

const RegistrationPage: React.FC = () => {
  return <RegistrationContainer />;
};
```

### Using Navigation in Components

```tsx
import { useNavigation, RegistrationStepId } from './navigation';

const MyComponent: React.FC = () => {
  const { nextStep, prevStep, isCurrentStep } = useNavigation();
  const isActive = isCurrentStep(RegistrationStepId.EXPERIENCE_LEVEL);
  
  // Component logic...
};
```

### Progress Tracking

```tsx
import { useRegistrationProgress } from './navigation';

const ProgressBar: React.FC = () => {
  const { progressPercentage, isRegistrationComplete } = useRegistrationProgress();
  
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
};
```

## Integration Process

To integrate existing components with this navigation system:

1. Replace import of component-specific navigation with the centralized `useNavigation` hook
2. Update component to use the navigation context for its active/inactive state
3. Use `markStepValid` and `markStepCompleted` to update progress
4. Use `RegistrationButton` for standardized navigation controls

## Architecture Decisions

- **Centralized Navigation**: Single source of truth for navigation state
- **Hierarchical Structure**: Clear relationship between steps, substeps, and sections
- **Progress Tracking**: Granular tracking of completion and validation status
- **Standardized Components**: Consistent UI and behavior across the flow 