# Journey Component

The Journey component is a feature component that displays the user journey/progression section on the homepage. It supports multiple theme variants through a structured directory organization.

## Directory Structure

```
src/features/Homepage/Journey/
├── Journey.tsx             # Main implementation (default variant)
├── Journey.scss            # Component styles
├── types.ts                # Type definitions
├── README.md               # This documentation
├── components/             # Sub-components used by Journey
│   └── ...
├── media/                  # Media assets for the component
│   └── ...
└── variants/               # Theme variant implementations
    ├── index.ts            # Exports all variants and selection logic
    ├── default/            # Default theme implementation
    │   └── index.ts        # Re-exports the main Journey component
    ├── boutique/           # Boutique theme implementation
    │   └── index.ts
    ├── classic/            # Classic theme implementation
    │   └── index.ts
    ├── minimalist/         # Minimalist theme implementation
    │   └── index.ts
    ├── modern/             # Modern theme implementation
    │   └── index.ts
    ├── sports/             # Sports theme implementation
    │   └── index.ts
    └── wellness/           # Wellness theme implementation
        └── index.ts
```

## Usage

The Journey component automatically selects the appropriate variant based on the WordPress theme settings:

```tsx
import Journey from 'src/features/Homepage/Journey';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Journey />
      {/* Other sections */}
    </div>
  );
};
```

To use a specific variant explicitly:

```tsx
import { ModernVariant as Journey } from 'src/features/Homepage/Journey';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Journey />
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

The variant selection is handled by the `getJourneyVariant()` function, which uses the WordPress theme settings to determine which variant to display.

## Adding New Variants

To add a new variant:

1. Create a new directory under `variants/` with the variant name
2. Create an `index.ts` file that either:
   - Re-exports the main Journey component (if using the default implementation)
   - Exports a custom implementation specific to the variant
3. Update the `variants/index.ts` file to include the new variant

Example for a new "premium" variant:

```tsx
// src/features/Homepage/Journey/variants/premium/index.ts
import Journey from '../../Journey';
export default Journey;
```

Or for a custom implementation:

```tsx
// src/features/Homepage/Journey/variants/premium/Journey.tsx
// [Custom implementation code]

// src/features/Homepage/Journey/variants/premium/index.ts
import Journey from './Journey';
export default Journey;
```

Then update the variants map in `variants/index.ts`:

```tsx
import PremiumVariant from './premium';

export const JourneyMap = {
  // ...existing variants
  premium: PremiumVariant,
};
``` 