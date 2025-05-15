# Hero Component

The Hero component serves as the main banner section for the FitCopilot homepage. It provides a visually striking introduction to the application.

## Usage

```tsx
import { Hero } from '../features/Homepage/Hero';

<Hero 
  headline="Custom headline text" 
  subheadline="Custom subheadline text"
  ctaText="Get Started"
  secondaryCtaText="Learn More"
  variant="default"
/>
```

## Props

| Prop              | Type         | Description                                            | Default                        |
|-------------------|--------------|--------------------------------------------------------|--------------------------------|
| `headline`        | string       | Main headline text                                     | "AI-Powered Workout Generator" |
| `subheadline`     | string       | Secondary text below the headline                      | "Create custom workout..."     |
| `ctaText`         | string       | Primary call-to-action button text                     | "Create Workout"               |
| `secondaryCtaText`| string       | Secondary call-to-action button text                   | "Learn More"                   |
| `variant`         | VariantKey   | Theme variant to apply to the Hero component           | "default"                      |

## Color System & Theming

The Hero component uses our token-based color system that supports multiple theme variants. Colors are defined as CSS variables that change based on the active theme.

To apply a theme, use either:
- The `data-theme` attribute on a parent element
- Tailwind utility classes for individual elements (e.g., `theme-gym:bg-accent-500`)

Available themes:
- Default (Lime/Green)
- Gym (Violet/Purple)
- Sports (Blue/Cyan)
- Wellness (Teal/Green)

See `COLOR-SYSTEM.md` for detailed information about our color system implementation.

## Variants

The Hero component supports multiple design variants through the variant system:

- `default`: Standard hero design with centered content
- `sports`: Sporty design with athletic imagery and blue/cyan color scheme
- `gym`: Gym-focused design with high-contrast visuals
- `wellness`: Calming design with wellness-oriented imagery
- `boutique`: Elegant design with premium aesthetics
- `classic`: Traditional fitness design with classic elements
- `minimalist`: Clean, minimalist design with ample whitespace
- `modern`: Contemporary design with modern aesthetics

Each variant maintains consistent branding while offering unique visual styling appropriate for different fitness niches.

## Folder Structure

```
Hero/
├── README.md              # Documentation
├── COLOR-SYSTEM.md        # Color system documentation
├── Hero.tsx               # Main component
├── Hero.scss              # Styles (SCSS)
├── Hero.css               # Legacy CSS (being phased out)
├── index.ts               # Main export
├── types.ts               # TypeScript interfaces
├── components/            # Sub-components
│   └── ...
├── variants/              # Theme variants
│   ├── default/
│   ├── sports/
│   └── ...
└── media/                 # Images and assets
    └── ...
```

## Accessibility

- The Hero component is fully accessible with proper semantic markup.
- Interactive elements have proper focus states.
- Color contrasts meet WCAG AA standards.

## Best Practices

- Maintain reasonable headline lengths for responsive display.
- When creating new variants, follow the existing pattern of extending the base Hero component.

## Directory Structure

```
src/features/Homepage/Hero/
├── Hero.tsx                # Main implementation (default variant)
├── Hero.scss               # Component styles
├── Hero.css                # Additional styles
├── types.ts                # Type definitions
├── README.md               # This documentation
├── COLOR-SYSTEM.md         # Color system documentation
├── components/             # Sub-components used by Hero
│   └── ...
├── media/                  # Media assets for the component
│   └── ...
└── variants/               # Theme variant implementations
    ├── index.ts            # Exports all variants and selection logic
    ├── default/            # Default theme implementation
    │   └── index.ts        # Re-exports the main Hero component
    ├── boutique/           # Boutique theme implementation
    │   └── index.ts
    ├── classic/            # Classic theme implementation
    │   └── index.ts
    ├── minimalist/         # Minimalist theme implementation
    │   └── index.ts
    ├── modern/             # Modern theme implementation
    │   └── index.ts
    ├── sports/             # Sports theme implementation
    │   ├── Hero.tsx        # Custom implementation for sports theme
    │   └── index.ts
    └── wellness/           # Wellness theme implementation
        └── index.ts
```

## Usage

The Hero component automatically selects the appropriate variant based on the WordPress theme settings:

```tsx
import Hero from 'src/features/Homepage/Hero';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Hero />
      {/* Other sections */}
    </div>
  );
};
```

To use a specific variant explicitly:

```tsx
import { ModernVariant as Hero } from 'src/features/Homepage/Hero';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Hero />
      {/* Other sections */}
    </div>
  );
};
```

## Color System & Theming

The Hero component now uses a token-based color system that supports multiple theme variants. Themes can be applied by adding the appropriate data attribute to any parent element:

```tsx
// Apply the gym theme
<div data-theme="gym">
  <Hero />
</div>

// Or using Tailwind utility class
<div className="theme-gym">
  <Hero />
</div>
```

Available themes:
- Default (Lime/Green)
- Gym (Violet/Purple)
- Sports (Blue/Cyan)
- Wellness (Teal/Green)

For detailed information about the color system implementation, see [COLOR-SYSTEM.md](./COLOR-SYSTEM.md).

## WordPress Integration

The component integrates with WordPress by:

1. Reading the theme variant setting from WordPress
2. Automatically selecting the appropriate variant implementation
3. Consuming WordPress REST API data for content

The variant selection is handled by the `getHeroVariant()` function, which uses the WordPress theme settings to determine which variant to display.

## Adding New Variants

To add a new variant:

1. Create a new directory under `variants/` with the variant name
2. Create an `index.ts` file that either:
   - Re-exports the main Hero component (if using the default implementation)
   - Exports a custom implementation specific to the variant
3. Update the `variants/index.ts` file to include the new variant

Example for a new "premium" variant:

```tsx
// src/features/Homepage/Hero/variants/premium/index.ts
import Hero from '../../Hero';
export default Hero;
```

Or for a custom implementation:

```tsx
// src/features/Homepage/Hero/variants/premium/index.ts
import Hero from './Hero';
export default Hero;
```

Then update the variants map in `variants/index.ts`:

```tsx
import PremiumVariant from './premium';

export const HeroMap = {
  // ...existing variants
  premium: PremiumVariant,
};
``` 