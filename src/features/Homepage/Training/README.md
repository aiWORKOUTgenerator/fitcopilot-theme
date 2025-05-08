# Training Component

The Training component is a feature component that displays training programs information on the homepage. It supports multiple theme variants through a structured directory organization.

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
├── media/                  # Media assets for the component
│   ├── images/             # Component images
│   └── videos/             # Component videos
└── variants/               # Theme variant implementations
    ├── index.ts            # Exports all variants and selection logic
    ├── default/            # Default theme implementation
    │   └── index.ts        # Re-exports the main component
    ├── boutique/           # Boutique theme implementation
    │   └── index.ts
    ├── classic/            # Classic theme implementation
    │   └── index.ts
    ├── minimalist/         # Minimalist theme implementation
    │   └── index.ts
    ├── modern/             # Modern theme implementation
    │   └── index.ts
    ├── sports/             # Sports theme implementation
    │   ├── Training.tsx    # Custom sports implementation
    │   └── index.ts
    └── wellness/           # Wellness theme implementation
        └── index.ts
```

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