# Testimonials Component

The Testimonials component displays user testimonials in a responsive grid layout. It uses the standardized design system with theme variant support.

## Features

- Displays testimonials in a clean, visually appealing format
- Supports theme variants (default, gym, sports, wellness, modern, classic, minimalist)
- Responsive design that adapts to different screen sizes
- Uses semantic color variables from the design system
- Built on the standardized Section component

## Usage

```tsx
import { Testimonials } from 'features/Homepage/Testimonials';

// Basic usage with default testimonials
<Testimonials />

// With custom testimonials and theme variant
<Testimonials 
  testimonials={myTestimonials}
  variant="gym" 
/>

// With all props
<Testimonials
  testimonials={myTestimonials}
  variant="sports"
  id="customer-testimonials"
  className="my-custom-class"
/>
```

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `testimonials` | `Testimonial[]` | Array of testimonial objects | Default testimonials |
| `variant` | `string` | Theme variant | `'default'` |
| `id` | `string` | Custom ID for the section | `'testimonials'` |
| `className` | `string` | Additional CSS classes | `''` |

## Theme Support

The Testimonials component fully supports the theme system and adapts its styling based on the selected variant:

- **Default**: Clean, modern design with standard accent colors
- **Gym**: Bold, high-contrast design for fitness-focused applications
- **Sports**: Dynamic, energetic design with sports-themed accents
- **Wellness**: Calm, soothing design with wellness-focused colors
- **Modern**: Contemporary design with subtle gradients
- **Classic**: Traditional design with timeless elements
- **Minimalist**: Clean, simplified design with minimal decoration

## Component Structure

The Testimonials component is composed of:

1. A Section component wrapper for standardized layout
2. A heading section with title and subtitle
3. A grid of TestimonialCard components
4. A "Read More" link

## TestimonialCard Component

Each testimonial is displayed using the TestimonialCard component, which can be used independently:

```tsx
import { TestimonialCard } from 'features/Homepage/Testimonials/components/TestimonialCard';

<TestimonialCard
  name="John Doe"
  role="Fitness Enthusiast"
  quote="This app is amazing!"
  avatar="/path/to/avatar.jpg"
  variant="default"
/>
```

## Migration Guide

When migrating existing implementations to use this standardized component:

1. Replace direct `<section>` usage with the Testimonials component
2. Ensure theme variant is set appropriately for the context
3. Update any custom styling to use semantic variables from the design system
4. Remove any hardcoded color values and replace with semantic variables 