# Training Component Theme Variant System

This document provides a comprehensive overview of the theme variant system implemented for the Training component.

## System Overview

The Training component features a complete theme variant system with multiple visual styles, all built on a shared token-based architecture. This approach allows for consistent styling across variants while enabling each theme to express its unique visual identity.

## Architecture

The theme variant system follows a layered architecture:

1. **Token Definition Layer** (`utils/themeTokens.ts`)
   - Defines the core token data structure
   - Provides TypeScript types for type safety
   - Includes helper functions for working with tokens

2. **CSS Implementation Layer** (`styles/theme-variants.scss`)
   - Implements the tokens as CSS variables
   - Organizes variables by theme variant
   - Provides variant-specific overrides

3. **Component Implementation Layer** (`variants/`)
   - Each variant has its own React component implementation
   - Components use the same token system but can customize content and behavior

## Token System

### Token Structure

The token system is hierarchically organized:

```typescript
export type ThemeVariantTokens = {
  colors: ThemeColorTokens;
  background: {
    primary: string;
    secondary: string;
    surface: string;
    card: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    default: string;
    hover: string;
    active: string;
  };
  gradients: ProgramGradientTokens;
  textColors: ProgramGradientTokens;
};
```

### Program-Specific Tokens

Each program type has its own set of dedicated tokens:

```typescript
export type ProgramGradientTokens = {
  strength: string;
  fatLoss: string;
  fitness: string;
  athletic: string;
};
```

### Token Mapping

The system includes functions to map token paths to CSS variable names:

```typescript
// Example token mapping
const mapping: Record<string, string> = {
  'background.primary': '--training-bg',
  'text.primary': '--training-text',
  'gradients.strength': '--training-gradient-strength',
  // ...more mappings
};
```

## Theme Variants

The system supports the following theme variants:

### Default

A modern dark theme with vibrant accents. Uses deep backgrounds with bright, saturated gradient accents.

**Key Characteristics:**
- Dark background
- Vibrant gradients
- Violet primary accent
- Glassy card surfaces

### Sports

An energetic light theme focused on performance and activity. Uses high contrast and dynamic colors.

**Key Characteristics:**
- Light background
- Energetic color palette
- Bold gradients
- Solid card surfaces

### Wellness

A calming theme focused on holistic health. Uses soothing colors with natural gradients.

**Key Characteristics:**
- Soft green/teal background
- Nature-inspired color palette
- Gentle gradients
- Rounded, soft UI elements

### Boutique

An elegant, luxury-focused theme with premium aesthetics.

**Key Characteristics:**
- Deep slate background
- Gold/amber accents
- Elegant typography
- Refined spacing and borders

### Classic

A traditional fitness aesthetic with strong typography and high contrast.

**Key Characteristics:**
- White background
- Red primary accent
- Bold typography
- Strong borders and shadows

### Minimalist

A clean, distraction-free design with reduced visual elements.

**Key Characteristics:**
- White background
- Monochromatic palette
- Minimal decoration
- Clean lines and forms

### Modern

A sleek, tech-focused design with contemporary styling.

**Key Characteristics:**
- Dark zinc background
- Blue/sky accents
- Modern geometric forms
- Blurred backdrop effects

## Implementation Guide

### Adding a New Theme Variant

To add a new theme variant:

1. Define the token values in `utils/themeTokens.ts`:

```typescript
// in themeTokens.ts
export const themeTokens = {
  // Existing themes...
  
  newTheme: {
    background: {
      primary: 'value',
      // ...more tokens
    },
    // ...more token groups
  }
};
```

2. Add CSS variables to `styles/theme-variants.scss`:

```scss
// in theme-variants.scss
body[data-theme="newTheme"] {
  --training-bg: value;
  --training-text: value;
  // ...more variables
}
```

3. Create a new variant component:

```
variants/
└── newTheme/
    ├── Training.tsx
    └── index.ts
```

4. Update the `VariantKey` type in `types.ts`:

```typescript
export type VariantKey = 'default' | 'sports' | /* existing variants */ | 'newTheme';
```

5. Add the new variant to the variant map in `variants/index.ts`:

```typescript
export const TrainingMap: Record<VariantKey, React.ComponentType<Omit<TrainingProps, 'variant'>>> = {
  // Existing variants...
  newTheme: NewThemeVariant
};
```

### Using Theme Tokens in Components

To use theme tokens in a component:

```tsx
import { programGradientMap } from '../utils/gradientTokens';

// In component
<div className={programGradientMap[program.title]}>
  {/* Content */}
</div>
```

## Best Practices

1. **Always use tokens instead of hardcoded values**
   - Access through the token system for consistent theming

2. **Follow the component variant pattern**
   - Create dedicated components for each theme variant
   - Share common logic through hooks

3. **Document new tokens and variants**
   - Update the documentation when adding new themes
   - Include visual design principles

4. **Ensure accessibility across all variants**
   - Maintain sufficient contrast ratios
   - Test with screen readers and keyboard navigation

## CSS Variable Structure

The actual CSS variables follow this naming convention:

```scss
// Base component namespace
--training-[property]

// Program-specific tokens
--training-gradient-[programType]
--training-text-[programType]

// Component-specific tokens
--training-card-[property]
--training-expanded-[property]
```

By following this convention, all theme variants maintain consistent naming while enabling unique visual expressions. 