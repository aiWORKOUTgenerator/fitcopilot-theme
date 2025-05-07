# Tooltip Component

A flexible, themeable tooltip component for providing contextual information when users hover over or focus on elements.

## Features

- 🎨 Three theme variants: `default`, `hero`, and `pricing`
- 🔧 Controllable visibility via `isVisible` prop
- 🌈 Customizable styling with `titleColor`, `width`, and `accentColor`
- 📱 Responsive and accessible
- ⌨️ Keyboard navigation support
- 🔄 Smooth transitions and animations
- 🌐 Section-level theme context system
- 🎭 Plan-specific styling for pricing tooltips
- 🚀 **New:** Performance optimizations with memoization and code splitting
- 📦 **New:** Optimized bundle size with named chunks

## Implementation Status

- ✅ **Phase 1:** Component API standardization and variant system (Complete)
- ✅ **Phase 2:** Theme context system implementation (Complete)
- ✅ **Phase 3:** Consumer component migration (Complete)
- ✅ **Phase 4:** Documentation and optimization (Complete)

For detailed implementation notes, see:
- [Phase 1 Completion](./PHASE1_COMPLETION.md)
- [Phase 2 Completion](./PHASE2_COMPLETION.md)
- [Phase 3 Completion](./PHASE3_COMPLETION.md)
- [Phase 4 Completion](./PHASE4_COMPLETION.md)

## Basic Usage

```tsx
import { Tooltip } from '../components/UI/Tooltip';

// Simple tooltip
<Tooltip content="Here's some helpful information">
  <button>Hover me</button>
</Tooltip>

// With title and icon
<Tooltip 
  content="Detailed explanation about this feature"
  title="Feature Info"
  icon={<InfoIcon />}
>
  <button>Learn more</button>
</Tooltip>
```

## Theme Context System

The theme context system allows you to set a theme for all tooltips within a section:

```tsx
import { Tooltip, TooltipThemeProvider } from '../components/UI/Tooltip';

<TooltipThemeProvider theme="hero">
  <HeroSection>
    {/* All tooltips within this section will automatically use the hero theme */}
    <Tooltip content="Feature information">
      <button>Learn more</button>
    </Tooltip>
    
    {/* You can still override the theme for individual tooltips */}
    <Tooltip content="Different styled tooltip" themeContext="pricing">
      <button>Special case</button>
    </Tooltip>
  </HeroSection>
</TooltipThemeProvider>
```

## Performance Optimization

The tooltip component includes several performance optimizations:

```tsx
import { Tooltip } from '../components/UI/Tooltip';
import { useTooltipContent } from '../components/UI/Tooltip/hooks';

// For complex tooltip content, use the optimization hook
const ComplexTooltip = ({ data }) => {
  const tooltipContent = useTooltipContent(
    (userData) => (
      <div>
        <h3>{userData.name}</h3>
        <p>{userData.role}</p>
        <div className="user-stats">
          {userData.stats.map(stat => (
            <div key={stat.id}>{stat.label}: {stat.value}</div>
          ))}
        </div>
      </div>
    ),
    data,
    [data.id] // Only recompute when ID changes
  );

  return (
    <Tooltip content={tooltipContent}>
      <button>View User</button>
    </Tooltip>
  );
};
```

## Theme Variants

### Default Theme

```tsx
<Tooltip content="Default theme tooltip">
  <button>Hover me</button>
</Tooltip>
```

### Hero Theme

```tsx
// Option 1: Individual tooltip
<Tooltip 
  content="Special styling for hero section"
  title="Hero Section"
  themeContext="hero"
>
  <button>Hover me</button>
</Tooltip>

// Option 2: Section-level theming (recommended)
<TooltipThemeProvider theme="hero">
  <div className="hero-section">
    <Tooltip content="Hero section tooltip">
      <button>Learn more</button>
    </Tooltip>
  </div>
</TooltipThemeProvider>
```

### Pricing Theme

```tsx
// Option 1: Individual tooltip with accentColor
<Tooltip 
  content="Pricing information tooltip" 
  themeContext="pricing"
  accentColor="rgba(132, 204, 22, 0.3)"
>
  <button>Hover me</button>
</Tooltip>

// Option 2: Using planType (recommended)
<TooltipThemeProvider theme="pricing">
  <div className="pricing-section">
    <Tooltip 
      content="Pro plan tooltip"
      planType="pro"
    >
      <button>?</button>
    </Tooltip>
  </div>
</TooltipThemeProvider>
```

## Detailed Documentation

For more detailed usage examples and patterns, see:
- [Usage Patterns](./USAGE_PATTERNS.md) - Common usage patterns and best practices
- [Examples](./examples/) - Interactive examples of all variants

## Accessibility

The tooltip component includes accessibility features:
- Proper ARIA attributes
- Keyboard focus support
- Reduced motion support
- High contrast colors

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Element that triggers the tooltip |
| `content` | ReactNode | required | Tooltip content |
| `title` | string | - | Optional title for the tooltip |
| `titleColor` | string | - | Title color class (Tailwind color class) |
| `icon` | ReactNode | - | Optional icon |
| `position` | 'top' \| 'bottom' \| 'left' \| 'right' | 'bottom' | Position of the tooltip relative to the trigger element |
| `width` | string | - | Width of the tooltip in pixels or any valid CSS width |
| `showOnHover` | boolean | true | Whether to show on hover |
| `showOnFocus` | boolean | true | Whether to show on focus |
| `delay` | number | 0 | Delay before showing (ms) |
| `className` | string | - | Additional classes for styling |
| `themeContext` | 'default' \| 'hero' \| 'pricing' | 'default' | Theme context |
| `initialVisible` | boolean | false | Whether the tooltip is initially visible |
| `isVisible` | boolean | - | Whether the tooltip is visible (for controlled usage) |
| `accentColor` | string | - | Border accent color (in rgba format) |
| `id` | string | - | ID for accessibility |
| `planType` | 'basic' \| 'pro' \| 'elite' | - | Plan type for pricing tooltips |

## TooltipThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | 'default' \| 'hero' \| 'pricing' | 'default' | Theme to apply to all tooltips within the provider |
| `children` | ReactNode | required | Components that will inherit the theme |

## Implementation Notes

The Tooltip component uses React.lazy and Suspense for dynamic loading of theme variants, which helps reduce the initial bundle size. The theme context system allows for more efficient theming at the section level. The pricing variant now supports plan-specific styling to ensure consistent design across the pricing section. 