# Tooltip Component Migration Guide

This guide helps you migrate existing tooltip implementations to the new unified Tooltip API.

## What's Changed?

The Tooltip component has been updated to support:
- A consistent API across all sections of the application
- Multiple theme variants (default, hero, pricing)
- Both controlled and uncontrolled usage patterns
- Standardized styling through CSS variables
- Enhanced accessibility features
- **New:** Theme context system for section-level theming

## Migration Steps

### 1. Basic Uncontrolled Tooltip

**Before:**
```tsx
<Tooltip content="Basic tooltip">
  <button>Hover me</button>
</Tooltip>
```

**After:**
No changes required for basic usage!

### 2. Hero Section Tooltips

**Before:**
```tsx
// In Hero section
<Tooltip 
  content="Hero section tooltip"
  title="Feature Info"
  icon={<InfoIcon />}
>
  <button>Learn more</button>
</Tooltip>
```

**After (Option 1 - Individual tooltip):**
```tsx
<Tooltip 
  content="Hero section tooltip"
  title="Feature Info"
  icon={<InfoIcon />}
  themeContext="hero"
>
  <button>Learn more</button>
</Tooltip>
```

**After (Option 2 - Section-level theme, recommended):**
```tsx
import { Tooltip, TooltipThemeProvider } from '../components/UI/Tooltip';

// Wrap the entire hero section
<TooltipThemeProvider theme="hero">
  <HeroSection>
    {/* All tooltips will automatically use hero theme */}
    <Tooltip 
      content="Hero section tooltip"
      title="Feature Info"
      icon={<InfoIcon />}
    >
      <button>Learn more</button>
    </Tooltip>
    
    {/* More tooltips... */}
  </HeroSection>
</TooltipThemeProvider>
```

### 3. Pricing Section Tooltips

**Before:**
```tsx
// Direct state management
const [showToolTip, setShowTooltip] = useState(false);

// In component
<div 
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
>
  <button>Hover for tooltip</button>
  {showToolTip && (
    <div className="tooltip">Pricing information</div>
  )}
</div>
```

**After (Option 1 - Uncontrolled with section theme):**
```tsx
<TooltipThemeProvider theme="pricing">
  <PricingSection>
    <Tooltip content="Pricing information">
      <button>Hover for tooltip</button>
    </Tooltip>
  </PricingSection>
</TooltipThemeProvider>
```

**After (Option 2 - Controlled with explicit theme):**
```tsx
const [showToolTip, setShowTooltip] = useState(false);

<Tooltip 
  content="Pricing information"
  themeContext="pricing"
  isVisible={showToolTip}
  showOnHover={false}
>
  <button 
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
  >
    Hover for tooltip
  </button>
</Tooltip>
```

### 4. Using Custom Styling

**Before:**
```tsx
<Tooltip 
  content="Custom styled tooltip"
  className="custom-tooltip"
>
  <button>Hover me</button>
</Tooltip>
```

**After:**
```tsx
<Tooltip 
  content="Custom styled tooltip"
  className="custom-tooltip"
  width="300px"                    // New prop
  accentColor="rgba(0, 0, 255, 0.3)" // New prop
  titleColor="text-blue-300"       // New prop
>
  <button>Hover me</button>
</Tooltip>
```

### 5. Using Controlled Mode

**Before:**
Custom implementation with local state.

**After:**
```tsx
const [isVisible, setIsVisible] = useState(false);

<Tooltip 
  content="Controlled tooltip"
  isVisible={isVisible}
  showOnHover={false}  // Disable automatic hover behavior
>
  <button onClick={() => setIsVisible(!isVisible)}>
    {isVisible ? 'Hide tooltip' : 'Show tooltip'}
  </button>
</Tooltip>
```

### 6. Using the New Theme Context System

**New feature:**
```tsx
import { TooltipThemeProvider } from '../components/UI/Tooltip';

// In your page or section component
function PricingPage() {
  return (
    <TooltipThemeProvider theme="pricing">
      <div className="pricing-container">
        {/* All tooltips in this section will use pricing theme by default */}
        <PricingTier tier="basic" />
        <PricingTier tier="premium" />
        <PricingTier tier="enterprise" />
      </div>
    </TooltipThemeProvider>
  );
}

// In a nested component
function PricingTier({ tier }) {
  return (
    <div className="pricing-tier">
      <h3>{tier}</h3>
      <Tooltip content={`Details about ${tier} plan`}>
        <InfoIcon />
      </Tooltip>
      {/* This tooltip will automatically use the pricing theme */}
    </div>
  );
}
```

## New Props

| Prop | Description | Default |
|------|-------------|---------|
| `themeContext` | Theme variant to use | `"default"` |
| `titleColor` | Title color class (Tailwind) | - |
| `width` | Custom width | - |
| `isVisible` | Controlled visibility state | - |
| `accentColor` | Border accent color | - |
| `id` | ID for accessibility | - |

## Testing Your Migration

1. Check all tooltip hover behaviors
2. Verify tooltip positioning
3. Test with different screen sizes
4. Ensure keyboard accessibility works

## Common Issues

### Tooltip not showing on hover
- Ensure `showOnHover` is not set to `false`
- Check z-index conflicts

### Tooltip styling inconsistent
- Make sure `themeContext` is set appropriately
- Check for any custom CSS that might conflict

### Controlled tooltip not working
- Ensure `showOnHover={false}` when using controlled mode
- Verify state variables are correctly passed 

### Theme not applying correctly with TooltipThemeProvider
- Ensure the provider is wrapping the component where tooltips are used
- Check if individual tooltips are explicitly overriding the theme
- Verify that the provider is imported correctly 