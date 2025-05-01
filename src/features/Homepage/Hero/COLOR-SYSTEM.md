# Hero Component Color System

This document outlines the color system implementation for the Hero component, including theme variants and Tailwind integration.

## Recent Updates

The Hero component has been refactored to use our new design token system with the following changes:

1. Replaced direct color values with CSS variables
2. Added theme variant support
3. Integrated with Tailwind CSS
4. Renamed "citron-text" to "accent-text" for consistency

## Color Token Implementation

The Hero component now uses semantic color tokens instead of hardcoded values:

| Before | After |
|--------|-------|
| `color: #ddff0e` | `color: var(--color-text-accent)` |
| `background-color: #1f2937` | `background-color: var(--color-ui-surface)` |
| `border: 1px solid rgba(221, 255, 14, 0.1)` | `border: 1px solid var(--color-accent-400-alpha-10)` |

## Theme Variant Support

The Hero component automatically supports theme variants through the CSS custom property system:

- **Default (Lime)**: Bright lime/green accent (#ddff0e)
- **Gym (Violet)**: Purple/violet accent (#8b5cf6)
- **Sports (Blue)**: Blue/cyan accent (#38bdf8)
- **Wellness (Teal)**: Teal/green accent (#2dd4bf)

To apply a theme to the Hero component, add the corresponding data attribute to any parent element:

```html
<!-- Default theme -->
<div>
  <Hero />
</div>

<!-- Gym theme -->
<div data-theme="gym">
  <Hero />
</div>
```

Or use the Tailwind utility classes:

```html
<div class="theme-gym">
  <Hero />
</div>
```

## Tailwind Integration

The Hero component can now leverage Tailwind classes that map to our design tokens:

```jsx
// Previously
<span className="citron-text">customized plans</span>

// Now
<span className="text-accent-400">customized plans</span>
// or
<span className="text-text-accent">customized plans</span>
```

### Alpha Variants

Transparency is now handled through alpha variant tokens:

```jsx
// Before
<div className="bg-lime-300/10">...</div>

// After
<div className="bg-accent-400-alpha-10">...</div>
```

## Testing Themes

You can use the `ThemeSwitcher` component to test how the Hero looks in different themes:

```jsx
import ThemeSwitcher from 'src/components/UI/ThemeSwitcher';

const HomePage = () => (
  <>
    <ThemeSwitcher />
    <Hero />
  </>
);
```

## CSS Class Changes

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `citron-text` | `accent-text` | Maps to `var(--color-text-accent)` |
| `text-lime-300` | `accent-text` or `text-accent-400` | Use for consistency |

## Working With The Color System

When making changes to the Hero component:

1. Always use semantic tokens (e.g., `var(--color-ui-surface)`) over raw color values
2. For text colors, prefer the semantic mapping (`--color-text-primary`) over direct color scale references
3. Use alpha variants (`var(--color-accent-400-alpha-30)`) for transparency
4. Test changes across all theme variants

## Benefits

- Consistent appearance across the application
- Easy theme switching without component changes
- Better color management and accessibility
- Simplified maintenance
- Reduced duplication of color values

## Further Reference

For complete documentation of the color system, see:
- `/src/styles/design-system/COLOR-SYSTEM.md` - Full color system documentation
- `/src/styles/design-system/_colors-next.scss` - Color token definitions
- `/tailwind.config.js` - Tailwind integration

For theme implementation, see:
- `/src/components/UI/ThemeSwitcher` - Theme switching component 