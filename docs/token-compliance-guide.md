# Token Compliance Guide

This guide explains our approach to achieving 100% token compliance in our SCSS files, ensuring consistent design implementation across the application.

## What is Token Compliance?

Token compliance is the percentage of CSS properties in our SCSS files that use design tokens (CSS variables) instead of hardcoded values. Our goal is to reach 100% compliance for all components.

## Benefits of Token Compliance

- **Consistency**: Ensures that all UI elements follow our design system
- **Maintainability**: Centralized control over design values
- **Scalability**: Easier theme switching and dark mode implementation
- **Efficiency**: Design changes can be made by updating tokens, not hunting through files

## Token Naming Convention

We follow a structured naming convention for all design tokens:

```scss
--[category]-[component]-[property]-[variant]
```

Example categories:
- `color`: Colors
- `spacing`: Spacing values
- `size`: Dimensions
- `pos`: Position values
- `z`: z-index values
- `type`: Typography values
- `weight`: Font weights
- `duration`: Animation durations
- `opacity`: Opacity values
- `shadow`: Shadow values

Examples:
- `--color-hero-button-primary-text`
- `--size-hero-button-min-width`
- `--pos-hero-element-relative`
- `--duration-hero-float-base`

## How to Achieve 100% Compliance

Follow these steps to tokenize your component:

### 1. Run the Compliance Script

Start by running the compliance script to see the current state:

```bash
node scripts/token-compliance.js src/features/YourComponent
```

### 2. Identify Non-Tokenized Properties

The script will show you which properties are not using tokens. Common properties to tokenize include:
- Colors
- Spacing (margins, paddings)
- Widths and heights
- Positions
- Z-indices
- Border properties
- Animation values
- Opacities

### 3. Add Component-Specific Tokens

Add new tokens to `src/styles/design-system/_component-tokens.scss`, following the naming convention:

```scss
/* YourComponent */
--size-yourcomponent-width: 200px;
--color-yourcomponent-bg: #f5f5f5;
--duration-yourcomponent-animation: 300ms;
```

### 4. Replace Hardcoded Values

Update your SCSS file to use the tokens:

```scss
// Before
.your-component {
  width: 200px;
  background-color: #f5f5f5;
  transition: all 300ms ease;
}

// After
.your-component {
  width: var(--size-yourcomponent-width);
  background-color: var(--color-yourcomponent-bg);
  transition: all var(--duration-yourcomponent-animation) var(--ease-standard);
}
```

### 5. Verify Compliance

Run the compliance script again to verify you've reached 100%:

```bash
node scripts/token-compliance.js src/features/YourComponent
```

### 6. Visual Testing

Ensure your changes haven't altered the appearance of the component:
- Test in Storybook
- Test in the application
- Check responsive behavior

## Common Value Types to Tokenize

### Positions
`absolute`, `relative`, `fixed`, `static`

```scss
position: var(--pos-component-element-relative);
```

### Sizes
`width`, `height`, `min-width`, `max-width`

```scss
width: var(--size-component-width);
height: var(--size-component-height);
```

### Colors
Any color values including HEX, RGB, RGBA

```scss
color: var(--color-component-text);
background-color: var(--color-component-bg);
```

### Special Values
`auto`, `none`, `transparent`, `currentColor`

```scss
margin: var(--margin-component-auto); // 0 auto
display: var(--display-component-none);
color: var(--color-component-current); // currentColor
```

## Examples from Hero Component

The Hero component has achieved 100% token compliance. You can use it as a reference:

```scss
// src/features/Homepage/Hero/Hero.scss
.hero {
  position: var(--pos-hero-element-relative);
  padding: var(--spacing-16) 0;
  overflow: var(--overflow-hero-hidden);
  min-height: var(--size-hero-min-height);
  // ...
}
```

## Tracking Overall Progress

Run the compliance script on the entire project to track our overall progress:

```bash
node scripts/token-compliance.js
```

## Need Help?

If you run into any challenges:
1. Check the Hero component implementation
2. Review this guide 
3. Ask in the #design-system Slack channel 