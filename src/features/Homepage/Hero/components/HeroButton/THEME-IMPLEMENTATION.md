# HeroButton Theme Implementation

This document explains the theme implementation for the HeroButton component and the CSS variable structure.

## Theme Implementation Pattern

HeroButton uses a standardized theme implementation pattern with flattened CSS variables and direct theme selectors:

1. **Base Button Tokens**: Defined in component-tokens.scss
2. **Hero Button Specific Tokens**: Extended in component-tokens.scss
3. **Theme Overrides**: Applied using data-theme attribute and direct selectors

## CSS Variable Structure

We follow a flattened variable structure with a maximum of 2 levels of nesting:

```scss
/* Level 1: Base Tokens */
--button-padding-x: var(--spacing-md, 1rem);

/* Level 2: Hero Button Tokens */
--hero-button-padding-x: var(--button-padding-x);
```

### Key Benefits:

- Clearer variable dependencies
- Simplified debugging
- Easier to understand inheritance
- More maintainable for new developers

## Theme Selector Pattern

Theme overrides use direct data-theme selectors with scoped variable overrides:

```scss
/* Theme overrides */
[data-theme="gym"] {
  .hero-button-primary {
    --hero-button-primary-border: rgba(168, 85, 247, 0.45);
    --hero-button-gradient-from: var(--color-violet-500, #8b5cf6);
    /* other overrides... */
  }
}
```

## Available Themes

The HeroButton component supports the following themes:

- **Default**: Green/lime gradient for primary, white text for secondary
- **Gym**: Purple/violet gradient for primary
- **Sports**: Cyan/blue gradient for primary
- **Wellness**: Teal/emerald gradient for primary

## Usage in Components

Apply themes using the data-theme attribute on a parent container:

```jsx
<div data-theme="gym">
  <HeroButton variant="primary">Gym Theme Button</HeroButton>
</div>
```

## CSS Variables Map

Here's a summary of the key CSS variables used in HeroButton:

### Base Structure Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| --hero-button-radius | Button border radius | var(--radius-full, 9999px) |
| --hero-button-padding-x | Horizontal padding | var(--button-padding-x) |
| --hero-button-padding-y | Vertical padding | var(--button-padding-y) |
| --hero-button-min-width | Minimum width | 210px |
| --hero-button-transition | Transition effect | var(--button-transition) |

### Theme Color Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| --hero-button-primary-bg | Primary background color | rgba(15, 23, 42, 0.8) |
| --hero-button-primary-border | Primary border color | rgba(34, 197, 94, 0.45) |
| --hero-button-gradient-from | Gradient start color | var(--color-lime-400) |
| --hero-button-gradient-to | Gradient end color | var(--color-green-500) |
| --hero-button-secondary-bg | Secondary background color | rgba(255, 255, 255, 0.1) |
| --hero-button-secondary-border | Secondary border color | rgba(34, 197, 94, 0.45) |
| --hero-button-secondary-text | Secondary text color | var(--color-text-inverse) |

## Extending with New Themes

To add a new theme:

1. Add theme color overrides in colors-next.scss
2. Add button-specific theme variable overrides in HeroButton.scss
3. Document the new theme in this file

Example for adding a "nutrition" theme:

```scss
[data-theme="nutrition"] {
  .hero-button-primary {
    --hero-button-primary-border: rgba(245, 158, 11, 0.45);
    --hero-button-gradient-from: var(--color-amber-500, #f59e0b);
    --hero-button-gradient-to: var(--color-orange-500, #f97316);
    --hero-button-gradient-from-hover: var(--color-amber-400, #fbbf24);
    --hero-button-gradient-to-hover: var(--color-orange-400, #fb923c);
  }
  
  .hero-button-secondary {
    --hero-button-secondary-border: rgba(245, 158, 11, 0.45);
    --hero-button-secondary-border-hover: rgba(245, 158, 11, 0.6);
    --hero-button-secondary-bg-hover: rgba(245, 158, 11, 0.1);
  }
}
``` 