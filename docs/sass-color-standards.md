# Sass Color Function Standards for FitCopilot

This document outlines our updated standards for Sass color functions in the FitCopilot codebase. Following these standards will ensure compatibility with future Sass versions and maintain consistent color implementation across our design system.

## Deprecated Functions

The following Sass color functions are **deprecated** and will be removed in Dart Sass 3.0.0:

- ❌ `darken($color, $amount)`
- ❌ `lighten($color, $amount)`
- ❌ `saturate($color, $amount)`
- ❌ `desaturate($color, $amount)`

## Recommended Alternatives

Use our custom utilities from `src/styles/utils/_color-utils.scss`:

```scss
@use "src/styles/utils/color-utils" as color-utils;

// Instead of darken():
$darker-color: color-utils.darken-safe($color, 10%);

// Instead of lighten():
$lighter-color: color-utils.lighten-safe($color, 15%);

// For saturation adjustments:
$more-saturated: color-utils.adjust-saturation($color, 20%); 
$less-saturated: color-utils.adjust-saturation($color, -20%);
```

## Color Utility Functions

Our color utilities provide modernized alternatives that follow best practices for color manipulation in Sass.

### Basic Color Adjustments

```scss
// Darken a color
$darker-color: color-utils.darken-safe($primary-color, 10%);

// Lighten a color
$lighter-color: color-utils.lighten-safe($accent-color, 15%);

// Adjust lightness (positive or negative)
$adjusted-color: color-utils.adjust-lightness($color, -5%);

// Adjust saturation (positive or negative)
$saturated-color: color-utils.adjust-saturation($color, 20%);
```

### Advanced Color Utilities

```scss
// Ensure color meets contrast requirements against a background
$accessible-color: color-utils.ensure-contrast($text-color, $background, 4.5);

// Generate a palette from a base color
$blue-palette: color-utils.create-palette($blue-base, 5, 10%);
```

## Design Token Integration

When working with our design tokens, use the utilities to derive color variations:

```scss
@use "src/styles/utils/color-utils" as color-utils;
@use "src/styles/tokens/colors" as colors;

.component {
  // Primary color tokens
  background-color: colors.$primary;
  
  // Derived color variations
  border-color: color-utils.darken-safe(colors.$primary, 15%);
  
  &:hover {
    background-color: color-utils.lighten-safe(colors.$primary, 10%);
  }
}
```

## Implementation Guidelines

### Consistent Import Pattern

Always use the consistent import pattern when working with our color utilities:

```scss
@use "src/styles/utils/color-utils" as color-utils;
```

### Adjusting Theme Variants

When creating theme variants, maintain the systematic adjustment pattern:

```scss
@use "src/styles/utils/color-utils" as color-utils;

.theme-blue {
  --primary-color: #{$blue-500};
  --primary-dark: #{color-utils.darken-safe($blue-500, 15%)};
  --primary-light: #{color-utils.lighten-safe($blue-500, 10%)};
}
```

### Automated Testing

Our CI pipeline will flag deprecated color function usage. Run these commands locally to check for deprecated functions:

```bash
# Find all instances of darken
grep -r "darken(" --include="*.scss" ./src

# Find all instances of lighten
grep -r "lighten(" --include="*.scss" ./src
```

## Migration Examples

### Before:

```scss
.button {
  background-color: $primary;
  border-color: darken($primary, 10%);
  
  &:hover {
    background-color: lighten($primary, 15%);
  }
}
```

### After:

```scss
@use "src/styles/utils/color-utils" as color-utils;

.button {
  background-color: $primary;
  border-color: color-utils.darken-safe($primary, 10%);
  
  &:hover {
    background-color: color-utils.lighten-safe($primary, 15%);
  }
}
```

By following these standards, we ensure our codebase remains compatible with future Sass versions and maintains a consistent approach to color manipulation across all components. 