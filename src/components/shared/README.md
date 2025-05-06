# Shared Components Guide

## Section Component

The `Section` component provides a standardized way to create page sections with consistent styling, spacing, and theming across the application.

### Usage

```tsx
import { Section } from 'components/shared';

// Basic usage
<Section>
  <h2>Section Title</h2>
  <p>Section content goes here</p>
</Section>

// With props
<Section
  id="features"
  backgroundColor="secondary"
  backgroundVariant="grid"
  containerSize="lg"
  spacing="md"
  variant="gym"
  hasTopBorder={true}
>
  <h2>Features</h2>
  <div className="grid">
    {/* Content */}
  </div>
</Section>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | undefined | HTML id attribute |
| `variant` | VariantKey | 'default' | Theme variant to apply |
| `backgroundColor` | BackgroundColorType | 'primary' | Background color of the section |
| `backgroundVariant` | string | 'default' | Background pattern or effect |
| `containerSize` | string | 'xl' | Width of the inner container |
| `spacing` | string | 'lg' | Vertical padding of the section |
| `className` | string | '' | Additional classes for the section element |
| `containerClassName` | string | '' | Additional classes for the container element |
| `seamless` | boolean | false | Whether to remove the visual gap between sections |
| `hasTopBorder` | boolean | false | Whether to add a top border |
| `hasBottomBorder` | boolean | false | Whether to add a bottom border |

### Background Color Options

- `primary`: Main background color (dark blue in default theme)
- `secondary`: Slightly lighter background variation
- `tertiary`: Lightest background variation
- `surface`: For elevated elements like cards
- `none`: Transparent background

### Background Variant Options

- `default`: Plain background
- `grid`: Adds a subtle grid pattern to the background
- `gradient`: Adds a gradient overlay effect
- `none`: No background styling

### Container Size Options

- `sm`: Small container (max-width: 48rem / 768px)
- `md`: Medium container (max-width: 64rem / 1024px)
- `lg`: Large container (max-width: 80rem / 1280px) 
- `xl`: Extra large container (max-width: 96rem / 1536px)
- `full`: Full width container (100%)

### Spacing Options

- `none`: No vertical padding
- `sm`: Small padding (py-8 on mobile, py-12 on desktop)
- `md`: Medium padding (py-16 on mobile, py-20 on desktop)
- `lg`: Large padding (py-20 on mobile, py-24 on desktop)

### Theme Variants

The Section component supports the following theme variants:

- `default`: The main theme style
- `gym`: Fitness gym-focused style
- `sports`: Sports/athletics style
- `wellness`: Health and wellness style
- `modern`: Clean, modern style
- `classic`: Traditional style
- `minimalist`: Minimalist design style

Themes can be applied using the `variant` prop or by adding a `data-theme` attribute to a parent element.

## Using with Color System

The Section component is fully integrated with our enhanced color system. Background and text colors will automatically adapt to the selected theme variant.

### Example with Features Component

```tsx
// Before
<div className="bg-slate-900 py-20">
  <div className="container mx-auto px-4">
    <h2 className="text-white text-3xl font-bold mb-12">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature cards */}
    </div>
  </div>
</div>

// After
<Section
  backgroundColor="primary"
  spacing="lg"
  containerSize="xl"
>
  <h2 className="text-3xl font-bold mb-12">Key Features</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Feature cards */}
  </div>
</Section>
```

### Example with Theme Variants

```tsx
// Sports-themed section
<Section 
  variant="sports"
  backgroundVariant="grid"
  spacing="md"
>
  <h2>Training Programs</h2>
  {/* Content */}
</Section>

// Wellness-themed section
<Section 
  variant="wellness"
  backgroundColor="secondary"
  spacing="lg"
>
  <h2>Wellness Journey</h2>
  {/* Content */}
</Section>
```

## Creating Seamless Transitions

To create a seamless flow between sections without a visible dividing line:

```tsx
<Section 
  backgroundColor="primary"
  spacing="md"
>
  {/* First section content */}
</Section>

<Section 
  backgroundColor="primary"
  spacing="md"
  seamless={true}
>
  {/* Second section content - will appear connected to the first */}
</Section>
```

## Best Practices

1. **Consistency**: Use the Section component for all major page sections to maintain consistent spacing and styling
2. **Theme Variants**: Apply theme variants at the section level to create distinct visual areas
3. **Container Sizing**: Select appropriate container sizes based on content density
4. **Background Effects**: Use background variants like `grid` to add visual interest without disrupting content
5. **Semantic Structure**: Ensure each section has a clear heading and logical content structure
6. **Responsive Design**: The component handles basic responsiveness, but ensure content within adapts properly to mobile

## Migrating Existing Sections

When updating older page sections to use the new Section component:

1. Replace the outer container div with `<Section>`
2. Move any background-related classes to the appropriate Section props
3. Move container width-related classes to the `containerSize` prop
4. Move padding/spacing related classes to the `spacing` prop
5. Update color classes to use the new semantic color system
6. Keep content structure and grid classes on the inner elements 