# Features Component

The Features component is a feature component that displays feature highlights on the homepage. It supports multiple theme variants through a structured directory organization.

## Directory Structure

```
src/features/Homepage/Features/
├── Features.tsx             # Main implementation
├── Features.scss            # Component styles
├── types.ts                 # Type definitions
├── README.md                # This documentation
├── components/              # Sub-components used by Features
│   └── ...
├── media/                   # Media assets for the component
│   └── ...
├── default/                 # Default implementation files
│   ├── Features.tsx         # Default implementation
│   └── index.ts             # Exports default implementation
└── variants/                # Theme variant implementations
    ├── index.ts             # Exports all variants and selection logic
    ├── default/             # Default theme implementation
    │   └── index.ts         # Re-exports from default directory
    ├── boutique/            # Boutique theme implementation
    │   └── index.ts
    ├── classic/             # Classic theme implementation
    │   └── index.ts
    ├── minimalist/          # Minimalist theme implementation
    │   └── index.ts
    ├── modern/              # Modern theme implementation
    │   └── index.ts
    ├── sports/              # Sports theme implementation
    │   ├── Features.tsx     # Custom implementation for sports theme
    │   └── index.ts
    └── wellness/            # Wellness theme implementation
        └── index.ts
```

## Usage

The Features component automatically selects the appropriate variant based on the WordPress theme settings:

```tsx
import Features from 'src/features/Homepage/Features';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Features />
      {/* Other sections */}
    </div>
  );
};
```

To use a specific variant explicitly:

```tsx
import { ModernVariant as Features } from 'src/features/Homepage/Features';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Features />
      {/* Other sections */}
    </div>
  );
};
```

## WordPress Integration

The component integrates with WordPress by:

1. Reading the theme variant setting from WordPress
2. Automatically selecting the appropriate variant implementation
3. Consuming WordPress REST API data for content

The variant selection is handled by the `getFeaturesVariant()` function, which uses the WordPress theme settings to determine which variant to display.

## Adding New Variants

To add a new variant:

1. Create a new directory under `variants/` with the variant name
2. Create an `index.ts` file that either:
   - Imports from the default directory (if using the default implementation)
   - Exports a custom implementation specific to the variant
3. Update the `variants/index.ts` file to include the new variant

Example for a new "premium" variant with default implementation:

```tsx
// src/features/Homepage/Features/variants/premium/index.ts
import Features from '../../default/Features';
export default Features;
```

Or for a custom implementation:

```tsx
// src/features/Homepage/Features/variants/premium/Features.tsx
// [Custom implementation code]

// src/features/Homepage/Features/variants/premium/index.ts
import Features from './Features';
export default Features;
```

Then update the variants map in `variants/index.ts`:

```tsx
import PremiumVariant from './premium';

export const FeaturesMap = {
  // ...existing variants
  premium: PremiumVariant,
};
``` 