# Component Composition Guide for Training Feature

This document outlines the component composition architecture implemented in the Training feature during Phase 4 of the standardization project.

## Component Overview

The Training feature implements a composable component architecture with these key components:

```
Training/
├── components/                 # Shared components
│   ├── ProgramCard/           # Card component for each program
│   │   ├── ProgramCard.tsx    # Component implementation
│   │   ├── ProgramCard.scss   # Component styles
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── index.ts           # Exports
│   │
│   ├── BenefitsList/          # List component for program benefits
│   │   ├── BenefitsList.tsx   # Component implementation
│   │   ├── BenefitsList.scss  # Component styles
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── index.ts           # Exports
│   │
│   └── index.ts               # Barrel exports for components
│
├── hooks/                     # Custom hooks
│   ├── useTrainingPrograms.ts # Program selection logic
│   └── index.ts               # Hook exports
│
└── variants/                  # Theme variants
    ├── default/               # Default variant implementation
    ├── sports/                # Sports theme implementation
    └── ...                    # Other theme variants
```

## Using the Extracted Components

### ProgramCard Component

The `ProgramCard` component encapsulates the display of an individual training program card.

#### Props Interface

```typescript
interface ProgramCardProps {
  program: ProgramType;       // Program data to display
  isActive?: boolean;         // Whether the card is expanded/active
  onToggle?: () => void;      // Handler for toggling the card state
  onLearnMore?: (programTitle: string) => void; // Handler for learn more button
  variant?: 'default' | 'sports' | 'boutique' | /* others */; // Visual variant
  className?: string;         // Additional CSS classes
}
```

#### Usage Example

```tsx
import { ProgramCard } from '../components';

<ProgramCard
  program={programData}
  isActive={selectedProgram === index}
  onToggle={() => toggleProgramDetails(index)}
  variant="default"
  className="custom-class"
/>
```

### BenefitsList Component

The `BenefitsList` component displays a list of program benefits with appropriate styling.

#### Props Interface

```typescript
interface BenefitsListProps {
  benefits: string[];         // Array of benefit text items
  variant?: 'default' | 'sports' | 'boutique' | /* others */; // Visual variant
  className?: string;         // Additional CSS classes
}
```

#### Usage Example

```tsx
import { BenefitsList } from '../components';

<BenefitsList
  benefits={program.benefits}
  variant="default"
  className="training-expanded__benefits"
/>
```

### useTrainingPrograms Hook

The `useTrainingPrograms` hook encapsulates the state management logic for program selection and interaction.

#### Interface

```typescript
// Props
interface UseTrainingProgramsProps {
  initialPrograms: ProgramType[];
}

// Return value
interface UseTrainingProgramsResult {
  programs: ProgramType[];
  selectedProgram: number | null;
  toggleProgramDetails: (index: number) => void;
  navigateToProgram: (programTitle: string) => void;
}
```

#### Usage Example

```tsx
import { useTrainingPrograms } from '../hooks';

const {
  programs,
  selectedProgram,
  toggleProgramDetails,
  navigateToProgram
} = useTrainingPrograms({
  initialPrograms: programsData
});
```

## Component Composition Example

Here's how these components work together in the default Training implementation:

```tsx
const Training: React.FC<TrainingProps> = ({ programs, sectionTitle, sectionDescription }) => {
  // Use the extracted hook for program state management
  const {
    programs: programData,
    selectedProgram,
    toggleProgramDetails,
    navigateToProgram
  } = useTrainingPrograms({
    initialPrograms: programs
  });

  return (
    <section className="training-section">
      {/* Header content */}
      
      {/* Programs list */}
      <div className="training-section__programs">
        {programData.map((program, index) => (
          <div key={index}>
            {/* Program Card component */}
            <ProgramCard
              program={program}
              isActive={selectedProgram === index}
              onToggle={() => toggleProgramDetails(index)}
              variant="default"
            />
            
            {/* Expanded content when selected */}
            {selectedProgram === index && (
              <div className="training-expanded">
                <h4 className="training-expanded__title">Key Benefits</h4>
                
                {/* Benefits List component */}
                <BenefitsList
                  benefits={program.benefits}
                  variant="default"
                  className="training-expanded__benefits"
                />
                
                {/* CTA Button */}
                <div className="training-expanded__cta">
                  <Button
                    variant="secondary"
                    size="medium"
                    rightIcon={<ArrowRight size={16} />}
                    onClick={() => navigateToProgram(program.title)}
                  >
                    Explore {program.title}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Main CTA */}
    </section>
  );
};
```

## Variant-Specific Implementations

The component architecture supports variant-specific styling and behavior:

### Default Variant
- `ProgramCard` displays cards in a vertical stack with gradient icons
- `BenefitsList` uses CheckCircle icons for each benefit

### Sports Variant
- `ProgramCard` displays cards in a grid with colored headers
- `BenefitsList` uses bullet points (disc) for each benefit

## Extending the Component System

When creating new variants or enhancing existing ones:

1. Use the extracted components with the appropriate `variant` prop
2. Add variant-specific styles in the component's SCSS files
3. Leverage the `useTrainingPrograms` hook for state management

Example for a new variant:

```tsx
// In variants/new-variant/Training.tsx
import { ProgramCard, BenefitsList } from '../../components';
import { useTrainingPrograms } from '../../hooks';

const Training: React.FC<Omit<TrainingProps, 'variant'>> = (props) => {
  const {
    programs,
    selectedProgram,
    toggleProgramDetails,
    navigateToProgram
  } = useTrainingPrograms({
    initialPrograms: props.programs || DEFAULT_PROGRAMS
  });
  
  return (
    <section>
      {/* Implement with extracted components */}
      <ProgramCard
        program={program}
        variant="new-variant"
        // ...other props
      />
      
      <BenefitsList
        benefits={benefits}
        variant="new-variant"
        // ...other props
      />
    </section>
  );
};
```

## Benefits of Component Extraction

This component extraction provides several advantages:

1. **Reduced Code Duplication**: Core functionality is implemented once and reused
2. **Consistent Behavior**: User interactions work the same way across variants
3. **Simplified Variant Creation**: New variants focus on styling, not reimplementing logic
4. **Maintainability**: Changes to core behavior can be made in one place
5. **Type Safety**: TypeScript interfaces ensure proper component usage 