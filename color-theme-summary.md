# Color Theme Comparison: Default vs Gym Variants

## Root Theme Variables (src/styles/theme.scss)

The main theme defines these core color variables that apply across the site:

```scss
:root {
  // Colors
  --color-primary: #8b5cf6; // violet-500
  --color-primary-light: #c4b5fd; // violet-300
  --color-primary-dark: #6d28d9; // violet-700
  
  --color-secondary: #3b82f6; // blue-500
  --color-secondary-light: #93c5fd; // blue-300
  --color-secondary-dark: #1d4ed8; // blue-700
  
  --color-background: #111827; // gray-900
  --color-background-light: #1f2937; // gray-800
  --color-background-dark: #030712; // gray-950
  
  --color-text: #f9fafb; // gray-50
  --color-text-muted: #9ca3af; // gray-400
  --color-text-dark: #111827; // gray-900
  
  --color-border: #374151; // gray-700
}
```

## Component-Specific Color Usage

### Default Variant (Lime/Green Theme)

The default variant uses a lime and emerald color scheme, with the following values applied directly in component SCSS:

**Hero.scss:**
```scss
.text-gradient {
  background-image: linear-gradient(90deg, #a3e635, #65a30d) !important; // Brighter lime green gradient
}

.bg-gradient-to-r.from-lime-300.to-emerald-400 {
  background-image: linear-gradient(90deg, #a3e635, #65a30d) !important;
}

// Divider
.w-24.h-1 {
  background-image: linear-gradient(90deg, #a3e635, #65a30d) !important;
}
```

**HeroButton.scss:**
```scss
.hero-button {
  &.primary {
    background: linear-gradient(90deg, #a3e635, #65a30d);
    // Instead of using CSS variables
  }
  
  &.secondary {
    background-color: rgba(15, 23, 42, 0.8);
    border: 2px solid rgba(163, 230, 53, 0.3);
  }
}
```

### Gym Variant (Violet/Purple Theme)

The gym variant follows the main theme defaults more closely, using the CSS variables:

**Training.tsx:**
```tsx
// Program Icons
<DumbbellIcon className="w-10 h-10 text-violet-400" />
// Heading
<span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-purple-500">
// Accent colors
<div className={`h-2 ${program.accentColor} w-full`}></div>
// Button
<button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white">
```

## Hard-coded vs Variable-based Colors

1. **Default components** often use hard-coded color values like `#a3e635` and `#65a30d` directly in the SCSS/CSS
2. **Gym components** use a mix of CSS variables and Tailwind classes with violet/purple variants

## Key Differences

1. **Color Palette:**
   - Default: Lime/Emerald greens (`#a3e635`, `#65a30d`)
   - Gym: Violet/Purple (`#8b5cf6`, `#6d28d9`)

2. **Implementation:**
   - Default components often ignore theme variables and use hard-coded hex values
   - Gym components partially use CSS variables and Tailwind classes

3. **Gradient Directions:**
   - Both variants use horizontal gradients, but with different color schemes

## Recommendation

Replace hard-coded color values with CSS variables for better maintainability. For example:

Instead of:
```scss
background: linear-gradient(90deg, #a3e635, #65a30d);
```

Use:
```scss
background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
```

This ensures that updating the theme variables automatically applies across all components. 