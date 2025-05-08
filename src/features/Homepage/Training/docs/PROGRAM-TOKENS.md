# Program-Specific Token System

This document explains how to work with program-specific tokens in the Training component.

## Overview

The Training component uses a specialized token system for program types that maintains consistent styling across different theme variants. Each program type (strength, fat loss, fitness, athletic) has dedicated tokens for gradients and text colors.

## Token Structure

Program tokens are organized into two main categories:

```typescript
// Gradient tokens for visual styling
export type ProgramGradientTokens = {
  strength: string;
  fatLoss: string;
  fitness: string;
  athletic: string;
};

// Text color tokens for content
export type ProgramTextColorTokens = {
  strength: string;
  fatLoss: string;
  fitness: string;
  athletic: string;
};
```

## Usage in Components

### TypeScript Integration

```typescript
import { programTypeGradientMap, programTypeTextColorMap } from '../../utils/gradientTokens';
import { ProgramType } from '../../types';

const program: ProgramType = {
  title: "Strength Building",
  description: "...",
  benefits: ["..."],
  programType: "strength" // This key connects to the token system
};

// In your component:
<div className={programTypeGradientMap[program.programType]}>
  {/* Content */}
</div>
<h3 className={programTypeTextColorMap[program.programType]}>
  {program.title}
</h3>
```

### CSS Classes

The system automatically maps program types to CSS classes:

```html
<!-- Gradient classes -->
<div class="program-gradient-strength">...</div>
<div class="program-gradient-fatLoss">...</div>
<div class="program-gradient-fitness">...</div>
<div class="program-gradient-athletic">...</div>

<!-- Text color classes -->
<span class="program-text-strength">...</span>
<span class="program-text-fatLoss">...</span>
<span class="program-text-fitness">...</span>
<span class="program-text-athletic">...</span>
```

## Theme-Specific Overrides

Each theme variant defines its own values for these program tokens:

```scss
// Default theme
:root {
  --training-gradient-strength: linear-gradient(to right, var(--color-lime-300), var(--color-emerald-400));
  --training-text-strength: var(--color-lime-200);
}

// Sports theme
body[data-theme="sports"] {
  --training-gradient-strength: linear-gradient(to right, var(--color-emerald-500), var(--color-teal-400));
  --training-text-strength: var(--color-emerald-600);
}
```

## Adding New Program Types

To add a new program type:

1. Update the `ProgramTypeKey` type in `utils/gradientTokens.ts`:
   ```typescript
   export type ProgramTypeKey = 'strength' | 'fatLoss' | 'fitness' | 'athletic' | 'newType';
   ```

2. Add mappings in the same file:
   ```typescript
   export const programTypeGradientMap: Record<ProgramTypeKey, string> = {
     // Existing mappings...
     'newType': 'program-gradient-newType'
   };

   export const programTypeTextColorMap: Record<ProgramTypeKey, string> = {
     // Existing mappings...
     'newType': 'program-text-newType'
   };
   ```

3. Add CSS classes in `Training.scss`:
   ```scss
   .program-gradient-newType {
     background-image: var(--training-gradient-newType);
   }

   .program-text-newType {
     color: var(--training-text-newType);
   }
   ```

4. Define token values for each theme variant in `styles/theme-variants.scss`:
   ```scss
   :root {
     --training-gradient-newType: linear-gradient(...);
     --training-text-newType: var(--color-...);
   }

   body[data-theme="sports"] {
     --training-gradient-newType: linear-gradient(...);
     --training-text-newType: var(--color-...);
   }
   // Add for all other theme variants
   ```

## Best Practices

1. Always use the `programType` property in program data
2. Access styling through the mapping utilities, not with hardcoded classes
3. When adding new program types, ensure tokens are defined for all theme variants
4. Follow the established naming conventions for consistency 