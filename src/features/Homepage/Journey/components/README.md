# Journey Component System

This directory contains components used within the Journey feature.

## JourneyCTA Component

The `JourneyCTA` component is a standardized call-to-action button that properly integrates with the design system's gradient tokens and theme variants.

### Design System Integration

The JourneyCTA component follows these design system best practices:

1. **Token-based styling**: Uses CSS variables and design tokens for consistent styling
2. **Class-based composition**: Uses CSS classes rather than inline styles for better maintainability
3. **CSS-driven hover states**: Leverages CSS for transitions and hover states rather than React state
4. **Gradient token system**: Integrates with the gradient tokens defined in the design system
5. **Theme variant support**: Automatically adapts to different theme variants

### Styling Features

- **Increased Horizontal Padding**: Buttons have extra padding on the left and right sides (2.5rem) for better visual balance
- **Responsive Behavior**: Proper spacing on all device sizes
- **Consistent Gradients**: Uses the design system's gradient tokens
- **Accessibility**: Supports reduced motion preferences

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | "Start Your Journey" | Button text content |
| `href` | string | "https://builder.fitcopilot.ai" | Button destination URL |
| `variant` | VariantKey | "default" | Theme variant (default, gym, sports, wellness, modern, etc.) |
| `className` | string | "" | Additional CSS classes to add to container |
| `buttonSize` | "small" \| "medium" \| "large" | "large" | Size of the button |
| `buttonVariant` | "primary" \| "secondary" \| "tertiary" \| "ghost" \| "gradient" \| "violet-indigo" | "gradient" | Visual style variant of the button |
| `showIcon` | boolean | true | Whether to show the icon |
| `icon` | React.ReactNode | <ArrowRight /> | Custom icon to display |
| `dataAos` | string | "" | AOS animation type (e.g., "fade-up") |
| `dataAosDelay` | string | "" | Delay for AOS animation in ms (e.g., "300") |
| `gradientColor` | "lime" \| "violet" \| "cyan" \| "teal" \| "amber" \| "green" | Derived from variant | Explicit gradient color to use |

### Usage Examples

Basic usage with default settings:

```tsx
<JourneyCTA 
  text="Start Your Journey" 
  href="/get-started" 
  variant="default"
/>
```

Customized with explicit gradient color and animation:

```tsx
<JourneyCTA 
  text="Join Now" 
  href="/signup"
  variant="gym"
  gradientColor="green"
  buttonSize="large"
  showIcon={true}
  dataAos="fade-up"
  dataAosDelay="300"
/>
```

For more examples, see `src/features/Homepage/Journey/examples/ButtonExample.tsx`.

### Implementation Details

The component uses class composition rather than inline styles, which provides these benefits:

1. **Better performance**: CSS classes are more efficient than inline styles
2. **Maintainability**: Separates styling from component logic
3. **Consistency**: Ensures consistent styling across the application
4. **Theme support**: Makes theme switching more reliable

### CSS Structure

The component relies on the following CSS classes:

- `.journey-cta-button`: Base styles for the button container
- `.journey-gradient-[color]`: Gradient variations (lime, violet, cyan, teal, amber, green)

These classes use the design system's `gradient-button` mixin which applies the appropriate gradient based on the component and variant. 