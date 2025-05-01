# Pricing Component

The Pricing component is a feature component that displays pricing information and plans on the homepage. It supports multiple theme variants through a structured directory organization.

## Directory Structure

```
src/features/Homepage/Pricing/
├── Pricing.tsx             # Main implementation (default variant)
├── Pricing.scss            # Component styles
├── types.ts                # Type definitions
├── README.md               # This documentation
├── components/             # Sub-components used by Pricing
│   └── ...
├── media/                  # Media assets for the component
│   └── ...
└── variants/               # Theme variant implementations
    ├── index.ts            # Exports all variants and selection logic
    ├── default/            # Default theme implementation
    │   └── index.ts        # Re-exports the main Pricing component
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

The Pricing component automatically selects the appropriate variant based on the WordPress theme settings:

```tsx
import Pricing from 'src/features/Homepage/Pricing';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Pricing />
      {/* Other sections */}
    </div>
  );
};
```

To use a specific variant explicitly:

```tsx
import { ModernVariant as Pricing } from 'src/features/Homepage/Pricing';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Pricing />
      {/* Other sections */}
    </div>
  );
};
```

## WordPress Integration

The component integrates with WordPress by:

1. Reading the theme variant setting from WordPress
2. Automatically selecting the appropriate variant implementation
3. Consuming WordPress REST API data for pricing plans and options

The variant selection is handled by the `getPricingVariant()` function, which uses the WordPress theme settings to determine which variant to display.

## Adding New Variants

To add a new variant:

1. Create a new directory under `variants/` with the variant name
2. Create an `index.ts` file that either:
   - Re-exports the main Pricing component (if using the default implementation)
   - Exports a custom implementation specific to the variant
3. Update the `variants/index.ts` file to include the new variant

Example for a new "premium" variant:

```tsx
// src/features/Homepage/Pricing/variants/premium/index.ts
import Pricing from '../../Pricing';
export default Pricing;
```

Or for a custom implementation:

```tsx
// src/features/Homepage/Pricing/variants/premium/Pricing.tsx
// [Custom implementation code]

// src/features/Homepage/Pricing/variants/premium/index.ts
import Pricing from './Pricing';
export default Pricing;
```

Then update the variants map in `variants/index.ts`:

```tsx
import PremiumVariant from './premium';

export const PricingMap = {
  // ...existing variants
  premium: PremiumVariant,
};
``` 