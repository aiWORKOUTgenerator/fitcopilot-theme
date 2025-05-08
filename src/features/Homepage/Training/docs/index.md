# Training Component Documentation

This folder contains comprehensive documentation for the FitCopilot Training component.

## Available Documentation

- [Theme Variant System](./THEME-VARIANT-SYSTEM.md) - Explains the token-based theming system for multiple visual variants
- [Program Tokens](./PROGRAM-TOKENS.md) - Details the program-specific token system for consistent styling
- [Accessibility Guidelines](./ACCESSIBILITY.md) - Outlines accessibility features and implementation standards
- [Styling Guidelines](../STYLING-GUIDELINES.md) - Outlines the styling approach, methodology, and standards
- [Component Guide](../COMPONENT-GUIDE.md) - Detailed information about component usage, props, and variants
- [Button Standards](../BUTTON-STANDARDS.md) - Specifications for button styling and behavior

## Architecture Overview

The Training component features:

1. **Feature-First Organization**
   - Components, hooks, styles, and types are organized by feature

2. **Token-Based Theme System**
   - Comprehensive token system for consistent styling across variants
   - Support for 7 distinct theme variants: default, sports, wellness, boutique, classic, minimalist, modern

3. **Program-Specific Token System**
   - Dedicated tokens for program types (strength, fat loss, fitness, athletic)
   - Consistent visual treatment across all theme variants

4. **Isolated State Management**
   - Component state is managed via custom hooks
   - Program data and selection state are encapsulated within the component

5. **Variant Pattern**
   - Different visual variants maintain the same core functionality
   - Each variant is implemented as a separate component with shared hooks

6. **Accessibility Features**
   - ARIA attributes for screen reader compatibility
   - Keyboard navigation support
   - Reduced motion alternatives for animations
   - Focus management for interactive elements

## Getting Started

To implement the Training component:

```tsx
import { Training } from 'features/Homepage/Training';
import { getTrainingVariant } from 'features/Homepage/Training/variants';

// Basic usage
<Training />

// With custom theme variant
<Training variant="sports" />

// With dynamic variant from WordPress settings
<Training variant={getTrainingVariant()} />
```

## Extension Points

The component can be extended in several ways:

1. **Adding new variants**
   - See the [Theme Variant System](./THEME-VARIANT-SYSTEM.md) documentation for details

2. **Customizing program data**
   - Pass custom program data via the `programs` prop

3. **Adding new program types**
   - See the [Program Tokens](./PROGRAM-TOKENS.md) documentation for details

4. **Styling customization**
   - Override CSS variables to adjust styling without changing components
   
5. **Accessibility enhancements**
   - See the [Accessibility Guidelines](./ACCESSIBILITY.md) for implementation details 