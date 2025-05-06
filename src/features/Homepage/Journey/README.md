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

## Spacing Standards

### Tailwind Spacing Scale
- Extra Small (XS): `space-y-2` (0.5rem, 8px) - Minimal spacing between closely related elements
- Small (SM): `space-y-4` (1rem, 16px) - Standard spacing between related content
- Medium (MD): `space-y-6` (1.5rem, 24px) - Spacing between distinct content groups
- Large (LG): `space-y-8` (2rem, 32px) - Major section spacing
- Extra Large (XL): `space-y-12` (3rem, 48px) - Separation between major components
- 2XL: `space-y-16` (4rem, 64px) - Section-level separation

### Standard Padding/Margin Classes
- Section padding: `py-16 md:py-24`
- Container padding: `px-4 md:px-6 lg:px-8`
- Card padding: `p-4 md:p-6 lg:p-8`
- Content margins:
  - Section headings: `mb-12 md:mb-16`
  - Component headings: `mb-6 md:mb-8`
  - Element headings: `mb-2 md:mb-3`
  - Bottom CTA: `mt-12 md:mt-16`
- Element gaps:
  - Large groups: `gap-6 md:gap-8`
  - Medium groups: `gap-4 md:gap-6`
  - Small groups: `gap-3 md:gap-4`
  - Icon gaps: `gap-2 md:gap-3`

### Journey Component Utility Class Map
- Section Container:
  - Root: `py-16 md:py-24 bg-[#0B1121]`
  - Container: `container mx-auto px-4 md:px-6 lg:px-8`
- Content Areas:
  - Header: `text-center mb-12 md:mb-16`
  - Steps: `space-y-6 md:space-y-8`
  - CTA: `text-center mt-12 md:mt-16`
- Cards:
  - Step Card: `p-4 md:p-6 lg:p-8 rounded-2xl`
  - Feature: `p-3 md:p-4 rounded-xl`
- Layouts:
  - Step Layout: `flex flex-col md:flex-row gap-4 md:gap-6`
  - Feature Grid: `grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6`
  - Feature Content: `flex items-start gap-3 md:gap-4`
- Text Spacing:
  - Title: `mb-2 md:mb-3`
  - Paragraph: `md:pr-12` 