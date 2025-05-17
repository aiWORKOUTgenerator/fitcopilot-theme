# HeroButton Component

HeroButton extends the base Button component with Hero-specific styling and theme variants.

## Usage

```tsx
import { HeroButton } from 'features/Homepage/Hero/components/HeroButton';

<HeroButton variant="primary">Get Started</HeroButton>
<HeroButton variant="secondary" size="large">Learn More</HeroButton>
```

## Component Extension Pattern

HeroButton follows the composition pattern for extending base components:

1. **Direct Import**: HeroButton is directly imported from its module rather than re-exported through Button
2. **Self-Contained**: All styles and types are contained within the HeroButton directory
3. **CSS Class Compatibility**: Maintains `.btn` class for ButtonGroup integration
4. **Clear Extension**: Props interface extends ButtonProps

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' | 'primary' | Visual style variant |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Size variant |
| leftIcon | ReactNode | - | Icon to display on the left |
| rightIcon | ReactNode | - | Icon to display on the right |
| fullWidth | boolean | false | Whether to take full width |
| href | string | - | Optional URL to render as anchor |

## Theming

HeroButton responds to the `data-theme` attribute on parent containers:

```tsx
<div data-theme="gym">
  <HeroButton variant="primary">Gym-themed Button</HeroButton>
</div>
```

Supported themes:
- Default (no theme attribute)
- `gym`
- `sports`
- `wellness`

## CSS Variable Pattern

HeroButton uses a flattened CSS variable pattern:

```scss
// Component-level variables
:root {
  --hero-button-padding-x: var(--button-padding-x);
  --hero-button-padding-y: var(--button-padding-y);
  --hero-button-radius: 9999px;
}

// Theme-specific overrides - direct selectors
[data-theme="gym"] .hero-button-primary {
  --color-hero-gradient-from: var(--color-gym-primary);
  --color-hero-gradient-to: var(--color-gym-primary-dark);
}
```

This pattern:
- Reduces nesting depth in variable references
- Creates clear token → component mapping
- Simplifies theme variations

## ButtonGroup Integration

HeroButton is designed to work with ButtonGroup:

```tsx
<ButtonGroup>
  <Button variant="primary">Regular Button</Button>
  <HeroButton variant="primary">Hero Button</HeroButton>
</ButtonGroup>
```

This integration is maintained through:
- Applying the `.btn` class to HeroButton
- Sharing common sizing and layout variables
- Compatible theme system implementation 