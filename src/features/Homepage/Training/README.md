# Training Component

The Training component is a feature component that displays training programs information on the homepage. It supports multiple theme variants through a comprehensive token-based design system and structured directory organization.

## Directory Structure

```
src/features/Homepage/Training/
├── Training.tsx            # Main component implementation
├── Training.scss           # Component styles
├── types.ts                # TypeScript type definitions
├── index.ts                # Main entry point with exports
├── README.md               # This documentation
├── STYLING-GUIDELINES.md   # Detailed styling guidelines
├── BUTTON-STANDARDS.md     # Button usage standards
├── docs/                   # Additional documentation
│   ├── index.md            # Documentation overview
│   └── THEME-VARIANT-SYSTEM.md # Theme variant system documentation
├── utils/                  # Utility functions
│   ├── themeTokens.ts      # Token system definition and utilities
│   └── gradientTokens.ts   # Program gradient/color mapping utilities
├── styles/                 # Component-specific styles
│   └── theme-variants.scss # Theme variant CSS implementation
├── media/                  # Media assets for the component
│   ├── images/             # Component images
│   └── videos/             # Component videos
└── variants/               # Theme variant implementations
    ├── index.ts            # Exports all variants and selection logic
    ├── default/            # Default theme implementation
    │   └── index.ts        # Re-exports the main component
    ├── boutique/           # Boutique theme implementation (elegant luxury)
    │   ├── Training.tsx    # Custom boutique implementation
    │   └── index.ts
    ├── classic/            # Classic theme implementation (traditional fitness)
    │   ├── Training.tsx    # Custom classic implementation
    │   └── index.ts
    ├── minimalist/         # Minimalist theme implementation
    │   ├── Training.tsx    # Custom minimalist implementation
    │   └── index.ts
    ├── modern/             # Modern theme implementation (tech-focused)
    │   ├── Training.tsx    # Custom modern implementation
    │   └── index.ts
    ├── sports/             # Sports theme implementation
    │   ├── Training.tsx    # Custom sports implementation
    │   └── index.ts
    └── wellness/           # Wellness theme implementation (holistic health)
        ├── Training.tsx    # Custom wellness implementation
        └── index.ts
```

## Theme Variant System

The Training component features a comprehensive token-based theming system that enables consistent styling across multiple visual variants. Each theme maintains its own unique aesthetic while sharing the same core functionality.

### Token Architecture

Our token system follows a three-layer architecture:

1. **Definition Layer** (`utils/themeTokens.ts`)
   - TypeScript interfaces define the token structure
   - Token values are organized by variant and purpose
   - Helper functions facilitate working with tokens programmatically

2. **Implementation Layer** (`styles/theme-variants.scss`)
   - CSS variables implement the token values
   - Each theme variant has its own selector section
   - Program-specific token values are defined for each variant

3. **Consumption Layer** (Components)
   - CSS classes use the variables for consistent styling
   - Utility functions like `programTypeGradientMap` provide type-safe access
   - New utility functions in `utils/applyThemeTokens.ts` enable dynamic applications

### Supported Theme Variants

The component supports seven distinct visual styles:

| Variant | Description | Visual Style |
|---------|-------------|--------------|
| Default | Modern dark theme | Dark background with vibrant accents |
| Sports | Performance-focused | Light theme with energetic colors |
| Wellness | Holistic health | Natural colors with soothing gradients |
| Boutique | Luxury aesthetic | Elegant, premium design elements |
| Classic | Traditional fitness | Strong typography and high contrast |
| Minimalist | Reduced design | Clean, distraction-free aesthetics |
| Modern | Tech-focused | Contemporary styling with geometric elements |

### Program-Specific Tokens

Each program type has dedicated tokens for consistent styling across themes:

```typescript
// Program gradients
--training-gradient-strength
--training-gradient-fatLoss
--training-gradient-fitness
--training-gradient-athletic

// Program text colors
--training-text-strength
--training-text-fatLoss
--training-text-fitness
--training-text-athletic
```

These tokens ensure that each program type maintains its semantic identity across different theme variants while adapting to the specific aesthetic of each theme.

### Using the Token System

There are several ways to use the token system:

#### 1. CSS Classes (Preferred)

```tsx
import { programTypeGradientMap } from '../utils/gradientTokens';

// In your component
<div className={programTypeGradientMap[program.programType]}>
  {program.title}
</div>
```

#### 2. CSS Variables in Styles

```scss
.custom-element {
  background-image: var(--training-gradient-strength);
  color: var(--training-text-strength);
}
```

#### 3. Programmatic Application

```tsx
import { applyThemeTokens } from '../utils/applyThemeTokens';

// In a useEffect or event handler
applyThemeTokens('sports', elementRef.current);
```

### Extending the System

To add a new program type:

1. Update the `ProgramTypeKey` type in `utils/gradientTokens.ts`
2. Add mappings in the token maps
3. Add CSS classes in `Training.scss`
4. Define token values for each theme variant in `styles/theme-variants.scss`

For complete documentation, see:
- [Theme Variant System](./docs/THEME-VARIANT-SYSTEM.md)
- [Program Tokens](./docs/PROGRAM-TOKENS.md)
- [Styling Guidelines](./STYLING-GUIDELINES.md)

## Token System

### Background Colors

The Training component uses a standardized approach to background colors, leveraging the global token system:

```scss
// Component-specific tokens with global inheritance
:root {
  --training-bg: var(--color-background-primary, rgba(10, 16, 27, 1));
}

// Component implementation
.training-section {
  background-color: var(--training-bg, var(--color-background-primary));
}
```

This approach provides:
- Consistency with other homepage sections
- Proper theme variant inheritance
- Fallback support for backward compatibility

### Theme Variants

Each theme variant (sports, wellness, etc.) uses global tokens with specific fallbacks:

```scss
body[data-theme="sports"] {
  --training-bg: var(--color-background-primary, #f9fafb);
}
```

This ensures the component responds correctly to theme changes while maintaining its unique visual identity.

### Examples

See `examples/TokenExample.tsx` for a visual demonstration of the token inheritance system.

## Usage

### Basic Usage

The Training component automatically selects the appropriate variant based on the WordPress theme settings:

```tsx
import Training from 'src/features/Homepage/Training';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Training />
      {/* Other sections */}
    </div>
  );
};
```

### Using a Specific Variant

```tsx
import { Training } from 'src/features/Homepage/Training';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Training variant="modern" />
      {/* Other sections */}
    </div>
  );
};
```

### Importing a Specific Variant Component

```tsx
import { ModernVariant as Training } from 'src/features/Homepage/Training';

// In your component:
const HomepageSection = () => {
  return (
    <div className="homepage">
      <Training />
      {/* Other sections */}
    </div>
  );
};
```

### With Custom Content

You can customize the component content by providing props:

```tsx
import { Training } from 'src/features/Homepage/Training';
import { Dumbbell, Activity } from 'lucide-react';

// In your component:
const HomepageSection = () => {
  const customPrograms = [
    {
      title: "Custom Program",
      description: "This is a custom training program",
      icon: <Dumbbell size={24} className="text-lime-200" />,
      benefits: [
        "Benefit 1",
        "Benefit 2",
        "Benefit 3"
      ],
      accentColor: "from-lime-300 to-emerald-400",
      textColor: "text-lime-200"
    },
    // More programs...
  ];

  return (
    <div className="homepage">
      <Training 
        programs={customPrograms}
        sectionTitle="Custom Training Programs"
        sectionDescription="A custom description for training programs"
      />
    </div>
  );
};
```

## Props

| Name | Type | Description | Default |
|------|------|-------------|---------|
| `variant` | `VariantKey` | Visual theme variant to display | From WordPress settings or 'default' |
| `programs` | `ProgramType[]` | Array of training programs to display | Default programs |
| `sectionTitle` | `string` | Title for the training section | "Specialized Programs" |
| `sectionDescription` | `string` | Description text for the section | Default description |

## TypeScript Interfaces

```typescript
// Variant keys
type VariantKey = 'default' | 'boutique' | 'classic' | 'minimalist' | 'modern' | 'sports' | 'wellness';

// Program data structure
interface ProgramType {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  accentColor: string;
  textColor?: string;
  accentClass?: string; // Used for theme-specific accent styling
}

// Component props
interface TrainingProps {
  variant?: VariantKey;
  programs?: ProgramType[];
  sectionTitle?: string;
  sectionDescription?: string;
}
```

## Component Standards

### Styling

The Training component follows a structured approach to styling:

- **Primary: SCSS with BEM Methodology**
- **Secondary: Limited Tailwind Utilities**
- **Theme Customization with CSS Variables**

For detailed styling guidelines, see [STYLING-GUIDELINES.md](./STYLING-GUIDELINES.md).

### Button Usage

All variants should follow these button standards:

- Use the shared Button component (`src/components/UI/Button`)
- Follow size guidelines (large for primary CTAs, medium for secondary actions)
- Include appropriate icons with consistent sizing
- Use consistent variant props (`primary`, `secondary`, etc.)

For detailed button implementation guidelines, see [BUTTON-STANDARDS.md](./BUTTON-STANDARDS.md).

## WordPress Integration

The Training component interacts with WordPress in the following ways:

1. **Theme Settings**: The component reads the `training` setting from the theme to determine which variant to display.
2. **REST API**: The component may consume data from the WordPress REST API to display content.

## Adding New Variants

To add a new variant for the Training component:

1. Create a new directory under `variants/` with your variant name (e.g., `variants/new-variant/`).
2. Create an `index.ts` file in this directory that either:
   - Re-exports the default implementation if you want to use it as-is
   - Imports and re-exports a custom implementation (in a Training.tsx file)
3. Update the `variants/index.ts` file to include your new variant:
   - Import your variant
   - Add it to the `TrainingMap` object
   - Export it in the named exports list
4. Update the `VariantKey` type in `types.ts` to include your new variant
5. Add theme-specific styling in `Training.scss` using the `body[data-theme="new-variant"]` selector
6. Ensure button usage follows the standardized patterns in BUTTON-STANDARDS.md

### Example for re-exporting default:

```typescript
// In variants/new-variant/index.ts
import Training from '../../Training';
export default Training;
```

### Example for custom implementation:

```typescript
// In variants/new-variant/Training.tsx
import React from 'react';
import { TrainingProps } from '../../types';
import '../../Training.scss';

const Training: React.FC<Omit<TrainingProps, 'variant'>> = (props) => {
  // Custom implementation
  return (
    // Custom JSX using BEM class naming from Training.scss
  );
};

export default Training;

// In variants/new-variant/index.ts
import Training from './Training';
export default Training;
```

## Standardization Project

The Training component has undergone a multi-phase standardization process to ensure architectural consistency, maintainable styling, and unified component usage.

### Phase 1: Directory Structure Standardization

The component directory structure has been standardized to follow the feature-first pattern:

```
Training/
├── index.ts                # Main exports with variant selection
├── types.ts                # TypeScript definitions
├── Training.tsx            # Main component implementation
├── Training.scss           # Component styles
├── README.md               # Documentation
├── variants/               # Theme variants directory
│   ├── default/            # Default variant
│   ├── sports/             # Sports variant
│   │   ├── Training.tsx    # Custom implementation
│   │   └── index.ts        # Exports
│   ├── wellness/           # Other variants...
│   └── ...
└── media/                  # Visual assets
```

Key Phase 1 achievements:
- Created proper TypeScript interfaces in `types.ts`
- Established standard export patterns in `index.ts`
- Created variant selection mechanism
- Removed redundant `/default` directory

### Phase 2: Styling Standardization

In Phase 2, we standardized the styling approach:

- Created `STYLING-GUIDELINES.md` documenting BEM methodology
- Refactored `Training.scss` to use CSS variables and BEM classes
- Updated main component and variants to use standardized classes
- Implemented theme-specific styling via CSS variables and data-attributes

For details, see the [STYLING-GUIDELINES.md](./STYLING-GUIDELINES.md) document.

### Phase 3: Button Standardization

In Phase 3, we focused on standardizing Button component usage:

- Created `BUTTON-STANDARDS.md` documenting Button standards
- Audited Button implementation across variants
- Updated sports variant to use consistent Button patterns
- Standardized icon usage with proper sizing
- Implemented consistent variant selection for actions

Key improvements:
- Consistent Button sizing for actions (`large` for main CTAs, `medium` for secondary actions)
- Standardized icon sizes (20px for large buttons, 16px for medium, 14px for small)
- Consistent onClick handlers for navigation
- Reduced direct Tailwind usage in favor of Button component's styling

For details, see the [BUTTON-STANDARDS.md](./BUTTON-STANDARDS.md) document.

### Next Phase: State Management Standardization (Planned)

The next phase will focus on standardizing state management:

- Extract program selection logic into a custom hook
- Standardize data fetching patterns
- Implement consistent loading and error states
- Document state management patterns

### Phase 4: Component Extraction

In Phase 4, we extracted reusable components to create a composable architecture:

- Created `ProgramCard` component for consistent program display across variants
- Implemented `BenefitsList` component for unified benefits presentation
- Extracted state management logic into the `useTrainingPrograms` hook
- Updated all variants to use the shared components
- Created comprehensive documentation with usage examples

Key improvements:
- **Reduced code duplication**: Common UI elements extracted to reusable components
- **Consistent behavior**: Selection and navigation logic unified in custom hooks
- **Standardized styling**: Component-specific styles encapsulated in dedicated SCSS files
- **Improved maintainability**: Changes to core UI elements only need to be made once
- **Enhanced type safety**: Comprehensive TypeScript interfaces for component props

The new component architecture makes it easier to:
1. Create new variants with consistent behavior
2. Modify the appearance and behavior of all variants at once
3. Ensure consistent accessibility and user experience

For detailed component architecture, see the [COMPONENT-GUIDE.md](./COMPONENT-GUIDE.md) document.

### Future Work: Testing and Performance

The next phase will focus on improving test coverage and performance:

- Add unit tests for extracted components
- Implement integration tests for variants
- Optimize rendering performance
- Add accessibility testing

## Performance Optimization

The Training component has been optimized for performance using several strategies:

1. **Data Separation**: Large default data moved to dedicated files in the `data/` directory
2. **Component Memoization**: All sub-components memoized with React.memo
3. **Callback Memoization**: Event handlers optimized with useCallback
4. **Render Optimization**: Conditional rendering optimized with extracted components

For detailed information on performance optimizations, see:
- [Performance Documentation](./docs/PERFORMANCE.md)
- [Performance Tests](./tests/performance.test.tsx)

## Component Decomposition

The Training component has been decomposed into smaller, focused components for better maintainability:

1. **Main Component**: `Training.tsx` orchestrates the feature
2. **Subcomponents**:
   - `SectionHeader`: Renders the section title, description, and tag
   - `ProgramsList`: Manages and renders the list of training programs
   - `MainCTA`: Renders the main call-to-action button
   - `ProgramCard`: Renders individual program cards (existing)
   - `BenefitsList`: Renders the list of benefits for a program (existing)

For detailed information on the component decomposition, see:
- [Component Breakdown Documentation](./docs/COMPONENT_BREAKDOWN.md)

## Migrating Variant Components

As of the latest update, all variant components should be updated to use the `SectionHeader` component instead of direct header markup. Here's how to upgrade a variant:

1. Import the SectionHeader component:
   ```tsx
   import { BenefitsList, ProgramCard, SectionHeader } from '../../components';
   ```

2. Replace the legacy header markup:
   ```tsx
   // OLD - Legacy implementation
   <div className="training-section__header">
     <h2 className="training-section__header-title">
       <span className="training-section__header-title-highlight">
         {sectionTitle}
       </span>
     </h2>
     <p className="training-section__header-description">
       {sectionDescription}
     </p>
   </div>

   // NEW - Using SectionHeader component
   <SectionHeader
     title={sectionTitle}
     description={sectionDescription}
     tagText="Training Solutions"
     variant="your-variant"
     id="training-section-title"
     className="training-section__header"
     programType="athletic"
   />
   ```

This ensures consistent styling, accessibility, and behavior across all variants.

## Visual Enhancements

The Training component includes several visual enhancements that provide consistency with other homepage sections:

### Background Patterns

Each theme variant includes a customized grid pattern background that adds subtle visual texture:

```scss
.training-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(var(--training-grid-pattern) 1px, transparent 1px),
        linear-gradient(90deg, var(--training-grid-pattern) 1px, transparent 1px);
    background-size: var(--training-grid-size) var(--training-grid-size);
    opacity: var(--training-pattern-opacity);
    z-index: -1;
}
```

### Gradient Overlays

The component uses gradient overlays to create smooth transitions between sections:

```scss
.training-section::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60%;
    background: linear-gradient(to bottom,
        var(--training-bg-transparent) 0%,
        var(--training-bg-60) 40%,
        var(--training-bg-90) 70%,
        var(--training-bg) 100%);
    z-index: -1;
}
```

### Visual Interest Elements

Decorative accent shapes add subtle visual interest to the background:

```jsx
<div className="training-section__accent-shape training-section__accent-shape--1" aria-hidden="true"></div>
<div className="training-section__accent-shape training-section__accent-shape--2" aria-hidden="true"></div>
```

### Seamless Section Transitions

The component supports seamless transitions between sections with special CSS classes:

```scss
// Seamless section transition support
&.section-seamless {
    margin-top: -1px;
    padding-top: calc(5rem + 1px);
}

// Bottom overlap for next section
&.section-overlap-bottom {
    margin-bottom: -5rem;
    padding-bottom: 10rem;
}

// Top overlap for previous section
&.section-overlap-top {
    margin-top: -5rem;
    padding-top: 10rem;
    z-index: 0;
}
```

### Usage

To enable these features in your implementation:

```jsx
// Seamless transition with previous section
<Training className="section-seamless" />

// Overlapping transition between sections
<Training className="section-overlap-bottom" />
<NextSection className="section-overlap-top" />

// Disable gradient overlay
<Training className="training-section--no-gradient" />
```

All visual enhancements are designed to maintain consistency with other homepage sections while respecting the unique identity of each theme variant.

## Section Header

The Training component includes a SectionHeader component that displays the section title, description, and optional tag. The SectionHeader is centered within the Training component and inherits the background of the section.

### Centered SectionHeader

The SectionHeader is automatically centered within the Training component. This is achieved through:

1. CSS classes in the SectionHeader component (align-items: center, text-align: center)
2. Container styling in the Training component (display: flex, flex-direction: column, align-items: center)

```tsx
<SectionHeader
  title="Training Programs"
  description="Choose from our specialized programs designed to help you achieve your fitness goals."
  tagText="Training Solutions"
  variant="default"
  className="training-section__header"
/>
```

The `training-section__header` class ensures the header is properly positioned and styled within the section.

### Background Consistency

The SectionHeader component inherits the background from the Training section, ensuring visual consistency throughout the component. This is achieved through:

```scss
.section-header {
  background: inherit; // Inherit background from parent
  z-index: 1; // Ensure it appears above background patterns
}
```

### Section Transitions

The Training component supports seamless transitions with other sections through modifier classes:

- `section-seamless`: Removes padding and gradient overlays for a seamless transition
- `section-overlap-bottom`: Extends padding at the bottom for overlapping with the next section
- `section-overlap-top`: Adds padding at the top and adjusts z-index for being overlapped by the previous section

```tsx
// Seamless transition example
<Training className="section-seamless" />

// Overlapping sections example
<PreviousSection className="section-overlap-bottom" />
<Training className="section-overlap-top" />
```

## Color Scheme Update

The Training component now uses amber/orange as its primary accent color to:
1. Better match the overall color palette of the theme
2. Provide stronger visual contrast with the background
3. Create a cohesive look with other homepage sections

### Primary Color Variables

```scss
// Primary accent colors (amber/orange as primary)
--training-accent: var(--color-amber-400, #FB923C);
--training-accent-light: var(--color-amber-300, #FCD34D);

// Accent colors with opacity variations for effects
--training-accent-amber: rgba(251, 191, 36, 0.15);
--training-accent-amber-strong: rgba(251, 191, 36, 0.5);
--training-accent-amber-light: rgba(251, 191, 36, 0.05);
--training-accent-amber-medium: rgba(251, 191, 36, 0.1);
```

### Theme Variants

Each theme variant maintains the amber/orange as its primary accent while adapting to the theme's overall aesthetic. This creates visual consistency across different themes while preserving each theme's unique identity.

### Program-Specific Gradients

The component now uses the athletic program gradient (amber/orange) as the default gradient for visual consistency:

```scss
--training-gradient-default: linear-gradient(to right, var(--color-amber-300, #fcd34d), var(--color-orange-400, #fb923c));
```

## Visual Enhancements

### Improved Background Pattern

The grid pattern background now includes a gradient mask that creates a smooth fade effect at the top and bottom of the section:

```scss
mask-image:
  linear-gradient(to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 15%,
    rgba(0, 0, 0, 1) 85%,
    rgba(0, 0, 0, 0) 100%);
```

### Enhanced Accent Shapes

The component now includes three decorative accent shapes with improved opacity and animation for visual interest:

```jsx
<div className="training-section__accent-shape training-section__accent-shape--1" aria-hidden="true"></div>
<div className="training-section__accent-shape training-section__accent-shape--2" aria-hidden="true"></div>
<div className="training-section__accent-shape--3" aria-hidden="true"></div>
```

### Glow Effects

Interactive elements now feature amber glow effects on hover for enhanced visual feedback:

```scss
&:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 0 20px 0 var(--training-accent-amber);
}
```

## Animation Classes

New animation classes provide smooth entrance animations for content:

```scss
.animate-fade-slide-up {
  animation: fadeSlideUp 0.4s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
```

These classes are applied to key components:

```jsx
<SectionHeader className="animate-fade-in" />
<ProgramsList className="animate-fade-slide-up" />
<MainCTA className="animate-fade-in" />
```

## Improved Accessibility

Enhanced support for users who prefer reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  .animate-fade-slide-up,
  .animate-fade-in {
    animation: none;
    opacity: 1;
    transform: translateY(0);
  }
  
  // Disable transitions and animations
  .training-card,
  .training-card__icon,
  .training-card__toggle,
  .training-expanded,
  .training-section__accent-shape {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }
}
```

## Troubleshooting Component Styling

When implementing amber/orange as the primary color theme, you may encounter issues where only some elements (like the title highlight) adopt the new color while others retain their original styling. This happens because:

1. **Component Isolation**: Each component has its own stylesheet that may not directly inherit the main theme variables
2. **CSS Specificity**: Existing styles might have higher specificity than the new theme variables
3. **Variable Inheritance Chain**: CSS custom properties need proper forwarding between components

### Solutions

To ensure all components properly use the amber/orange theme:

#### 1. Direct Attribute-Based Styling

Apply a data attribute to the main component and target it with high-specificity selectors:

```tsx
<section data-theme-accent="amber">
  {/* Component content */}
</section>
```

```scss
.training-section[data-theme-accent="amber"] {
  // High-specificity selectors that will override component-specific styles
  .training-card__title {
    color: var(--color-amber-300, #FCD34D);
  }
}
```

#### 2. Forward CSS Variables

Create a set of generic variables that component stylesheets will use and set them to the amber values:

```scss
:root {
  // Component-specific variables
  --card-border: var(--color-gray-700);
  
  // Forward to generic variables that components use
  --border-primary: var(--training-card-border);
  --border-hover: var(--training-card-hover-border);
  --text-accent: var(--training-accent-light);
}
```

#### 3. Force Important Styles

For critical elements that must use the amber theme, use the `!important` flag:

```scss
.training-section__header-tag {
  color: var(--color-amber-300, #FCD34D) !important;
}

.training-section__header-title-highlight {
  background-image: var(--training-gradient-athletic) !important;
}
```

#### 4. Import Order Matters

Ensure that theme variant styles are imported before component-specific styles:

```scss
// 1. Import design system
@import '../../../styles/design-system/index';

// 2. Import theme variants
@import './styles/theme-variants.scss';

// 3. Define component variables that reference theme variables
:root {
  --training-bg: var(--color-background-primary);
}
```

These strategies ensure that the amber/orange theme is consistently applied across all components regardless of their structure or styling approach.