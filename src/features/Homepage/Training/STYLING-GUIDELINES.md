# Training Component Styling Guidelines

This document outlines the official styling approach for the Training component and all its variants.

## Styling Architecture

The Training component follows these styling principles:

1. **Primary: SCSS with BEM methodology**
   - Component namespace: `training-`
   - Element syntax: `training-[element]`
   - Modifier syntax: `training-[element]--[modifier]`
   - State syntax: `training-[element].is-[state]`

2. **Secondary: Limited Tailwind utilities**
   - Use Tailwind only for:
     - Spacing (`p-4`, `mt-2`, etc.)
     - Flex/Grid layouts (`flex`, `items-center`, etc.)
     - Responsive utilities (`md:flex-row`, etc.)
   - Do NOT use Tailwind for:
     - Colors (use CSS variables)
     - Typography (use SCSS mixins)
     - Transitions/animations (use SCSS)

## Token System

The Training component uses a comprehensive token system defined in `utils/themeTokens.ts` and implemented via CSS variables in `styles/theme-variants.scss`.

### CSS Variable Structure

All styling properties are tokenized using a consistent naming pattern:

```scss
// Base tokens
--training-bg: var(--color-background, rgba(10, 16, 27, 1));
--training-text: var(--color-text, #f9fafb); 
--training-accent: var(--color-primary, #8b5cf6);

// Component-specific tokens
--training-card-bg: rgba(31, 41, 55, 0.5);
--training-card-border: var(--color-border, rgba(55, 65, 81, 0.5));
--training-card-hover-border: rgba(var(--color-accent-400-rgb, 139, 92, 246), 0.3);

// Semantic-specific tokens (each program type)
--training-gradient-strength: linear-gradient(...);
--training-text-strength: var(--color-lime-200, #d9f99d);
```

### Program Type Tokens

Each program type has dedicated tokens for gradients and text colors:

```scss
// Strength training
--training-gradient-strength
--training-text-strength

// Fat loss
--training-gradient-fatLoss
--training-text-fatLoss

// General fitness
--training-gradient-fitness
--training-text-fitness 

// Athletic performance
--training-gradient-athletic
--training-text-athletic
```

## Theme Variants

The component supports multiple theme variants with unique design aesthetics:

### Default (Dark)

Modern dark theme with vibrant accents and gradient highlights.

### Sports 

Light, performance-focused theme with bold contrast and dynamic visuals.

### Wellness

Calm, holistic aesthetic with nature-inspired colors and soothing gradients.

### Boutique

Luxury-focused design with elegant typography and premium visual elements.

### Classic

Traditional fitness aesthetic with strong typography and high-contrast elements.

### Minimalist

Clean, distraction-free design with reduced visual elements and monochrome styling.

### Modern

Sleek, tech-focused design with contemporary UI patterns and smooth transitions.

## Implementation Details

### 1. Variant Components

Each variant has its own implementation file in the `variants/` directory:

```
variants/
├── boutique/
│   ├── Training.tsx
│   └── index.ts
├── classic/
├── default/
├── minimalist/
├── modern/
├── sports/
└── wellness/
```

### 2. Token Mapping System

The token system uses several key utilities:

- `utils/themeTokens.ts`: Defines the token structure and mapping functions
- `utils/gradientTokens.ts`: Maps program types to their respective gradient classes
- `styles/theme-variants.scss`: Implements all the CSS variables for each theme variant

### 3. CSS Usage Example

To implement theme-aware styling:

```scss
.training-card {
  background-color: var(--training-card-bg);
  color: var(--training-text);
  border: 1px solid var(--training-card-border);
  
  &:hover {
    border-color: var(--training-card-hover-border);
  }
  
  &__title {
    color: var(--training-accent);
  }
}

// Program-specific styling
.program-gradient-strength {
  background: var(--training-gradient-strength);
}

.program-text-strength {
  color: var(--training-text-strength);
}
```

### 4. TypeScript Integration

Token types are fully integrated with TypeScript:

```typescript
import { themeTokens, ThemeVariantTokens } from './utils/themeTokens';
import { programGradientMap } from './utils/gradientTokens';
import { VariantKey } from './types';

// Get all tokens for a specific variant
const boutiqueTokens = themeTokens.boutique as ThemeVariantTokens;

// Get gradient class for a program type
const strengthGradient = programGradientMap['Strength Building']; // returns 'program-gradient-strength'
```

## Extending the System

When adding new tokens or variants:

1. Add token definitions to `utils/themeTokens.ts`
2. Implement CSS variables in `styles/theme-variants.scss`
3. Create a new variant component if needed in the `variants/` directory
4. Update the variant enum in `types.ts` if adding a new variant type

## Standards Checklist

- ✅ Use CSS variables for all themeable properties
- ✅ Follow BEM naming conventions for all SCSS classes
- ✅ Include proper variant classes on container elements
- ✅ Use semantic token names that describe purpose, not appearance
- ✅ Ensure all interactive elements have hover/focus styles
- ✅ Document any additions to the token system

## Class Structure

```scss
// Component root
.training-section {
  // Component properties
}

// Card element
.training-card {
  // Card styling

  // Card element
  &__icon {
    // Icon styling
  }

  // Card element
  &__title {
    // Title styling
  }

  // Card modifier
  &--active {
    // Active state styling
  }
}
```

## CSS Variable System

```scss
// Base component variables
:root {
  // Component-specific tokens
  --training-bg: var(--color-background, #111827);
  --training-text: var(--color-text, #f9fafb);
  --training-accent: var(--color-primary, #8b5cf6);
  --training-card-bg: rgba(31, 41, 55, 0.5);
  
  // Program-specific gradient tokens
  --training-gradient-strength: linear-gradient(to right, var(--color-lime-300), var(--color-emerald-400));
  --training-gradient-fatLoss: linear-gradient(to right, var(--color-cyan-300), var(--color-blue-400));
  
  // Theme-specific overrides
  body[data-theme="sports"] & {
    --training-bg: var(--color-gray-50, #f9fafb);
    --training-text: var(--color-gray-900, #111827);
    --training-accent: var(--color-violet-600, #7c3aed);
    
    // Override program-specific gradient tokens
    --training-gradient-strength: linear-gradient(to right, var(--color-emerald-500), var(--color-teal-400));
  }
}
```

## Implementation Examples

### SCSS (preferred approach)

```scss
// Program gradient classes
.program-gradient-strength {
  background-image: var(--training-gradient-strength);
}

.program-gradient-fatLoss {
  background-image: var(--training-gradient-fatLoss);
}

// Program text color classes
.program-text-strength {
  color: var(--training-text-strength);
}

.program-text-fatLoss {
  color: var(--training-text-fatLoss);
}
```

### TSX Component

```tsx
// Correct usage with token-based classes
<div className="training-card">
  <div className="training-card__icon-wrapper">
    <div className={`training-card__icon ${programTypeGradientMap[program.programType]}`}>
      {program.icon}
    </div>
  </div>
  <h3 className={`training-card__title ${programTypeTextColorMap[program.programType]}`}>
    {program.title}
  </h3>
</div>
```

## Creating New Variants

When implementing styling for a new variant:

1. Use the established class names from Training.scss
2. Add theme-specific variable overrides in Training.scss:
   ```scss
   body[data-theme="new-variant"] {
     --training-bg: var(--color-slate-50);
     --training-text: var(--color-slate-900);
     --training-gradient-strength: linear-gradient(to right, var(--color-custom-300), var(--color-custom-400));
   }
   ```
3. Minimize direct styling in component JSX
4. Use the shared Button component for all buttons
5. Follow the established program data structure with `programType` property

## Program Type System

When adding new programs, use the `programType` property to leverage the token-based styling:

```typescript
const program: ProgramType = {
  title: "Strength Building",
  description: "Focus on compound movements...",
  icon: <StrongIcon />,
  benefits: ["Increase strength", "Build muscle"],
  programType: "strength" // This automatically applies the correct gradient and text colors
};
```

## Benefits of This Approach

- Consistent styling across all variants
- Easier theme switching and customization
- Better separation of concerns
- Improved maintainability
- Simpler variant creation 
- Standardized program type styling 