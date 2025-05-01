# TrainingFeatures Component

The TrainingFeatures component is a feature component that displays training features information on the homepage. It supports multiple theme variants through a structured directory organization.

## Directory Structure

```
src/features/Homepage/TrainingFeatures/
├── default/                # Default implementation
│   ├── TrainingFeatures.tsx   # Main component implementation
│   └── index.ts              # Re-exports the component
├── TrainingFeatures.scss     # Component styles
├── index.ts                  # Main entry point
├── README.md                 # This documentation
├── media/                    # Media assets for the component
│   └── ...
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

To use a specific variant explicitly:

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

## WordPress Integration

The TrainingFeatures component interacts with WordPress in the following ways:

1. **Theme Settings**: The component reads the `trainingFeatures` setting from the theme to determine which variant to display.
2. **REST API**: The component may consume data from the WordPress REST API to display content.

## Adding New Variants

To add a new variant for the TrainingFeatures component:

1. Create a new directory under `variants/` with your variant name (e.g., `variants/new-variant/`).
2. Create an `index.ts` file in this directory that either:
   - Re-exports the default implementation if you want to use it as-is
   - Imports and re-exports a custom implementation
3. If needed, create a custom implementation of the TrainingFeatures component for your variant.
4. Update the `variants/index.ts` file to include your new variant:
   - Import your variant
   - Add it to the `TrainingFeaturesMap` object
   - Export it in the named exports list

Example:

```tsx
// In variants/new-variant/index.ts
import TrainingFeatures from '../../default/TrainingFeatures';
export default TrainingFeatures;

// Or for a custom implementation:
// import TrainingFeatures from './TrainingFeatures';
// export default TrainingFeatures;

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