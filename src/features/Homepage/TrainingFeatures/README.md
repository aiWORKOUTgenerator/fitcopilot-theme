# TrainingFeatures Component

The TrainingFeatures component is a feature component that displays training features information on the homepage. It supports multiple theme variants through a structured directory organization and uses the shared Section component for consistent layout.

## Directory Structure

```
src/features/Homepage/TrainingFeatures/
├── default/                # Default implementation
│   ├── TrainingFeatures.tsx   # Main component implementation
│   └── index.ts              # Re-exports the component
├── TrainingFeatures.scss     # Component styles with semantic variables
├── types.ts                  # TypeScript types and interfaces
├── index.ts                  # Main entry point
├── README.md                 # This documentation
├── media/                    # Media assets for the component
│   └── ...
├── components/               # Shared subcomponents
│   ├── MediaContainer/       # Media handling component
│   └── VideoPlayer/          # Video player component
└── variants/                 # Theme variant implementations
    ├── index.ts              # Exports all variants and selection logic
    ├── default/              # Default theme implementation
    │   └── index.ts          # Re-exports the main component
    ├── boutique/             # Boutique theme implementation
    │   └── index.ts
    ├── classic/              # Classic theme implementation
    │   └── index.ts
    ├── minimalist/           # Minimalist theme implementation
    │   └── index.ts
    ├── modern/               # Modern theme implementation
    │   └── index.ts
    ├── sports/               # Sports theme implementation
    │   └── index.ts
    └── wellness/             # Wellness theme implementation
        └── index.ts
```

## Features

- Responsive, mobile-first design
- Interactive flip cards for feature details
- Theme variant support with discriminated union types
- Shared Section component usage for consistent layout
- Media handling with support for images and videos
- Accessibility considerations for reduced motion

## Usage

The TrainingFeatures component automatically selects the appropriate variant based on the WordPress theme settings:

```tsx
import TrainingFeatures from 'src/features/Homepage/TrainingFeatures';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <TrainingFeatures />
      {/* Other sections */}
    </div>
  );
};
```

### Using a Specific Variant Component

```tsx
import { ModernVariant as TrainingFeatures } from 'src/features/Homepage/TrainingFeatures';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <TrainingFeatures />
      {/* Other sections */}
    </div>
  );
};
```

### With Custom Content

You can customize the component content by providing props:

```tsx
import { TrainingFeatures } from 'src/features/Homepage/TrainingFeatures';
import { Dumbbell, Activity } from 'lucide-react';

// In your component:
const HomepageSection = () => {
  const customFeatures = [
    {
      icon: <Dumbbell size={24} className="text-gray-900" />,
      title: "Custom Strength Training",
      description: "Personalized strength programs for your goals",
      gradient: "from-lime-300 to-emerald-400",
      flipFront: "Build strength with custom programs designed for your body.",
      flipBack: {
        title: "Strength Training",
        details: [
          "Progressive overload principles",
          "Proper form instruction",
          "Recovery optimization",
          "Adaptation monitoring"
        ]
      }
    },
    // More features...
  ];

  return (
    <div className="homepage">
      <TrainingFeatures 
        features={customFeatures}
        sectionTitle="Advanced Training Features"
        sectionDescription="A custom description for training features"
        sectionTagText="Elite Experience"
      />
    </div>
  );
};
```

## Props

| Name | Type | Description | Default |
|------|------|-------------|---------|
| `variant` | `VariantKey` | Visual theme variant to display | From WordPress settings or 'default' |
| `features` | `TrainingFeature[]` | Array of training features to display | Default features |
| `sectionTitle` | `string` | Title for the section | "Comprehensive Training Features" |
| `sectionDescription` | `string` | Description text below the title | "Our training platform includes..." |
| `sectionTagText` | `string` | Tag text displayed above the title | "Premium Experience" |
| `className` | `string` | Additional CSS class names | "" |

## WordPress Integration

The TrainingFeatures component interacts with WordPress in the following ways:

1. **Theme Settings**: The component reads the `trainingFeatures` setting from the theme to determine which variant to display.
2. **REST API**: The component may consume data from the WordPress REST API to display content.

## Adding New Variants

To add a new variant for the TrainingFeatures component:

1. Create a new directory under `variants/` with your variant name (e.g., `variants/new-variant/`).
2. Create an `index.ts` file in this directory that either:
   - Re-exports the default implementation with the variant prop set
   - Implements a custom version of the TrainingFeatures component for your variant
3. Update the `variants/index.ts` file to include your new variant

Example:

```tsx
// In variants/new-variant/index.ts
import React from 'react';
import { NewVariantProps } from '../../types';
import DefaultTrainingFeatures from '../../default/TrainingFeatures';

const NewVariantTrainingFeatures: React.FC<NewVariantProps> = (props) => {
  return <DefaultTrainingFeatures {...props} variant="new-variant" />;
};

export default NewVariantTrainingFeatures;

// Then update variants/index.ts
import NewVariant from './new-variant';

// Add to map
export const TrainingFeaturesMap = {
  // ... existing variants
  'new-variant': NewVariant,
};

// Add to exports
export {
  // ... existing exports
  NewVariant,
};
```

## CSS Semantics

The component uses the following semantic CSS variables for consistent theming:

- `--training-features-background`: Background color for the section
- `--training-features-text-primary`: Primary text color
- `--training-features-text-secondary`: Secondary text color
- `--training-features-accent`: Primary accent color
- `--training-features-card-bg`: Card background color
- `--training-features-card-border`: Card border color
- `--training-features-card-hover-shadow`: Shadow color for card hover state

These variables are automatically themed based on the selected variant, providing consistent styling across the application. 