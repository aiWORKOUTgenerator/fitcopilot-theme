# Journey Component

The Journey component displays a step-by-step process flow with expandable steps. It shows users the journey they will take with our product, highlighting key features and benefits at each step.

## Features

- Responsive, mobile-first design
- Expandable steps with detailed feature cards
- Theme variant support with discriminated union types
- Animated step transitions
- Call to action buttons at each step

## Usage

```tsx
import { Journey } from 'features/Homepage/Journey';

// Basic usage with default variant
<Journey />

// With custom journey steps
<Journey journey={customJourneySteps} />

// With specific theme variant
<Journey variant="gym" />

// Full configuration
<Journey 
  journey={customJourneySteps}
  variant="sports"
/>
```

## Variant System

The Journey component uses a discriminated union type system for stronger type safety and better IDE intellisense. 

### Available Variants

- `default` - Standard green/lime theme
- `gym` - Purple-based color scheme
- `sports` - Blue/cyan color scheme 
- `wellness` - Teal/green color scheme
- `modern` - Amber/orange color scheme
- `classic` - Red/warm color scheme
- `minimalist` - Gray/neutral color scheme

### Type System

The variant system uses TypeScript discriminated unions for better type safety:

```typescript
// Base variant type with discriminant
export type VariantKey = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

// Example of discriminated union props
export interface DefaultVariantProps extends BaseVariantProps {
  variant: 'default';
  colors?: {
    accentPrimary: '#CCFF00';
    accentSecondary: '#22d3ee';
    accentTertiary: '#a78bfa';
  };
}

// Union of all variant props
export type VariantProps = 
  | DefaultVariantProps
  | GymVariantProps
  | SportsVariantProps
  // Other variants...

// Type guard for type narrowing
export function isVariant<T extends VariantProps['variant']>(
  variant: VariantKey,
  specificVariant: T
): variant is T {
  return variant === specificVariant;
}

// Using the type guard for type narrowing
if (isVariant(variant, 'gym')) {
  // TypeScript knows variant is 'gym' here
  // You can safely access gym-specific properties
}
```

## Responsive Behavior System

The Journey component uses a systematic approach to responsive design that ensures consistent behavior across all breakpoints.

### Breakpoint System

We use standardized breakpoints aligned with Tailwind defaults, defined in `utils/breakpoints.ts`:

```typescript
export const BREAKPOINTS = {
  xs: 0,      // extra small screens - mobile
  sm: 640,    // small screens - large mobile / small tablet
  md: 768,    // medium screens - tablets
  lg: 1024,   // large screens - small desktops / large tablets
  xl: 1280,   // extra large screens - desktops
  xxl: 1536   // extra extra large screens - large desktops
};
```

### Responsive CSS Variables

Rather than hardcoding values, we use CSS variables with media queries to adjust values at different breakpoints:

```scss
:root {
  /* Mobile-first base values */
  --journey-title-font-size: 2rem;
  --journey-section-padding-top: 3rem;
  
  /* Tablet breakpoint overrides */
  @media (min-width: 768px) {
    --journey-title-font-size: 2.5rem;
    --journey-section-padding-top: 4rem;
  }
  
  /* Desktop breakpoint overrides */
  @media (min-width: 1024px) {
    --journey-title-font-size: 3rem;
    --journey-section-padding-top: 5rem;
  }
}
```

### Responsive Component Classes

Components use consistent class naming and responsive utility classes:

```jsx
<div className="journey-step-card">
  <div className="journey-step-icon">
    {icon}
  </div>
  <h3 className="feature-title">{title}</h3>
</div>
```

### Mobile-First Enhancements

The component includes several mobile-specific enhancements:

1. **Touch-friendly targets:** All interactive elements are at least 44x44px on mobile
2. **Simplified layouts:** Single-column layouts on mobile that expand to multi-column on larger screens
3. **Optimized spacing:** Different spacing values at each breakpoint to maximize readability
4. **Responsive typography:** Font sizes adjust based on screen size
5. **Mobile-specific UI elements:** Special expand/collapse buttons for mobile users

### Special Considerations

- **Reduced Motion:** Animations are disabled for users with reduced motion preferences
- **Accessible Focus States:** Clear focus indicators at all screen sizes
- **Overflow Handling:** Text truncation and flexible layouts prevent overflows

### Responsive Testing Approach

When testing responsiveness, check each component at these breakpoints:

- Mobile portrait (320px - 375px)
- Mobile landscape (568px - 667px)
- Tablet portrait (768px - 834px)
- Tablet landscape (1024px - 1112px)
- Desktop (1280px+)

## Component Structure

The Journey component consists of:

1. `Journey.tsx` - Main container component
2. `JourneyStep.tsx` - Individual step with expandable content
3. `JourneyFeatureCard.tsx` - Feature card within each step
4. `SectionHeader.tsx` - Section title and description
5. `JourneyCTA.tsx` - Call to action button

## Custom Journey Steps

You can provide custom journey steps by passing an array of objects to the `journey` prop:

```tsx
const customJourneySteps = [
  {
    id: 1,
    number: 1,
    title: "Step One Title",
    description: "Description of step one",
    // Optional properties
    icon: <CustomIcon />,
    delay: 100,
    accentColor: "from-lime-300 to-emerald-400", 
    ctaText: "Action Button Text",
    detailedFeatures: [
      {
        title: "Feature Title",
        description: "Feature description",
        icon: <FeatureIcon />
      },
      // More features...
    ]
  },
  // More steps...
];
```

## Styling

The component uses a combination of:

- CSS variables for theme variations
- Tailwind utility classes
- Custom SCSS for animations and special effects

### CSS Variables

Theme-specific variables are defined in `Journey.scss` and follow the pattern:

```scss
:root {
  --journey-background: rgba(10, 16, 27, 1);
  --journey-card-bg: #11192a;
  --journey-accent-primary: #CCFF00;
  // ...
}

[data-theme="gym"] {
  --journey-accent-primary: var(--color-accent-400);
  // ...
}
```

## Accessibility

- Keyboard navigation for expanding/collapsing steps
- ARIA attributes for screen readers
- Sufficient color contrast
- Focus states for interactive elements

## Directory Structure

```
src/features/Homepage/Journey/
├── Journey.tsx             # Main implementation (default variant)
├── Journey.scss            # Component styles
├── types.ts                # Type definitions
├── README.md               # This documentation
├── components/             # Sub-components used by Journey
│   └── ...
├── utils/                  # Utility functions and helpers
│   ├── breakpoints.ts      # Responsive breakpoint system
│   └── variantHelpers.ts   # Theme variant helper functions
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