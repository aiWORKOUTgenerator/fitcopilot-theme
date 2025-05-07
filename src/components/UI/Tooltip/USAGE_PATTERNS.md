# Tooltip Component Usage Patterns

This document outlines common usage patterns for the Tooltip component to help developers implement tooltips consistently across the application.

## Basic Usage Patterns

### Simple Uncontrolled Tooltip

The most common usage pattern - tooltip shows on hover/focus automatically:

```tsx
import { Tooltip } from '../components/UI/Tooltip';

<Tooltip content="Simple explanation text">
  <button>Hover me</button>
</Tooltip>
```

### Controlled Tooltip

For cases where you need programmatic control of the tooltip visibility:

```tsx
import { useState } from 'react';
import { Tooltip } from '../components/UI/Tooltip';

const MyComponent = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setTooltipVisible(!isTooltipVisible)}
      >
        {isTooltipVisible ? 'Hide tooltip' : 'Show tooltip'}
      </button>
      
      <Tooltip 
        content="This tooltip is controlled programmatically"
        isVisible={isTooltipVisible}
        showOnHover={false} // Disable automatic hover behavior
      >
        <div>Hover won't affect this tooltip</div>
      </Tooltip>
    </>
  );
};
```

### Mixed Control Pattern

For cases where you want both hover behavior and programmatic control:

```tsx
const [isManuallyShown, setManuallyShown] = useState(false);

<Tooltip 
  content="This tooltip responds to hover and manual control"
  isVisible={isManuallyShown} // Only controls when true
  showOnHover={true} // Still enables hover behavior
>
  <button onClick={() => setManuallyShown(!isManuallyShown)}>
    Toggle tooltip
  </button>
</Tooltip>
```

## Theme Context Patterns

### Individual Theme Assignment

Assign a theme directly to a specific tooltip:

```tsx
<Tooltip 
  content="Hero-styled tooltip"
  themeContext="hero"
>
  <button>Hero Style</button>
</Tooltip>
```

### Section-Level Theme Context (Recommended)

Use the provider pattern to apply a theme to all tooltips in a section:

```tsx
import { Tooltip, TooltipThemeProvider } from '../components/UI/Tooltip';

<TooltipThemeProvider theme="pricing">
  <section className="pricing-section">
    {/* All tooltips in this section will use the pricing theme */}
    <Tooltip content="Feature explanation">
      <span>Feature A</span>
    </Tooltip>
    
    <Tooltip content="Another feature explained">
      <span>Feature B</span>
    </Tooltip>
    
    {/* You can still override for specific tooltips */}
    <Tooltip 
      content="Different styling"
      themeContext="hero"
    >
      <span>Special case</span>
    </Tooltip>
  </section>
</TooltipThemeProvider>
```

## Integration Patterns

### Feature Component Integration

```tsx
// Feature component using tooltips
const FeatureCard = ({ feature, isHighlighted }) => {
  return (
    <div className="feature-card">
      <h3>{feature.title}</h3>
      
      <Tooltip 
        content={feature.description}
        title="Feature Details"
        icon={<InfoIcon />}
      >
        <span className="info-icon">ⓘ</span>
      </Tooltip>
      
      {isHighlighted && (
        <Tooltip 
          content="This is a premium feature"
          title="Premium"
          icon={<StarIcon />}
        >
          <span className="premium-badge">✦</span>
        </Tooltip>
      )}
    </div>
  );
};
```

### Form Field Integration

```tsx
const FormField = ({ label, tooltip, ...props }) => {
  return (
    <div className="form-field">
      <div className="label-container">
        <label htmlFor={props.id}>{label}</label>
        
        {tooltip && (
          <Tooltip content={tooltip}>
            <span className="help-icon">?</span>
          </Tooltip>
        )}
      </div>
      
      <input {...props} />
    </div>
  );
};
```

## Pricing-Specific Patterns

### Plan Type Based Styling

Use the `planType` prop for consistent plan-specific styling:

```tsx
<div className="pricing-plans">
  {plans.map(plan => (
    <div key={plan.id} className="plan-card">
      <h3>{plan.name}</h3>
      
      <ul>
        {plan.features.map(feature => (
          <li key={feature.id}>
            {feature.tooltip ? (
              <Tooltip 
                content={feature.tooltip}
                planType={plan.type} // 'basic', 'pro', or 'elite'
              >
                <span>{feature.name}</span>
              </Tooltip>
            ) : (
              <span>{feature.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

## Common Pitfalls & Solutions

### Tooltip Positioning Issues

**Problem**: Tooltip appears in wrong position or gets cut off by container boundaries.

**Solution**: Check parent element positioning context and ensure proper overflow handling:

```tsx
// Ensure tooltip container has proper positioning context
<div style={{ position: 'relative', overflow: 'visible' }}>
  <Tooltip content="I'll position correctly">
    <button>Hover me</button>
  </Tooltip>
</div>
```

### Tooltip Not Showing

**Problem**: Tooltip doesn't appear on hover.

**Solutions**:
1. Check z-index issues: Ensure no other elements are overlapping the tooltip trigger
2. Verify controlled state: If using `isVisible` prop, make sure it's being properly toggled
3. Check event bubbling: Parent elements might be capturing events

```tsx
// Use stopPropagation to prevent parent handlers from interfering
<div 
  onMouseEnter={() => console.log('Parent hover')}
>
  <Tooltip content="Tooltip content">
    <button onMouseEnter={e => e.stopPropagation()}>
      Hover me
    </button>
  </Tooltip>
</div>
```

### Multiple Nested Tooltips

**Problem**: Managing multiple tooltips that might interfere with each other.

**Solution**: Use unique IDs and controlled visibility to manage which tooltip is shown:

```tsx
const [visibleTooltipId, setVisibleTooltipId] = useState(null);

<div>
  <Tooltip 
    id="tooltip1"
    content="First tooltip"
    isVisible={visibleTooltipId === 'tooltip1'}
    showOnHover={false}
  >
    <button 
      onMouseEnter={() => setVisibleTooltipId('tooltip1')}
      onMouseLeave={() => setVisibleTooltipId(null)}
    >
      First button
    </button>
  </Tooltip>
  
  <Tooltip 
    id="tooltip2"
    content="Second tooltip"
    isVisible={visibleTooltipId === 'tooltip2'}
    showOnHover={false}
  >
    <button 
      onMouseEnter={() => setVisibleTooltipId('tooltip2')}
      onMouseLeave={() => setVisibleTooltipId(null)}
    >
      Second button
    </button>
  </Tooltip>
</div>
```

## Accessibility Considerations

### Keyboard Navigation

Ensure tooltips are accessible to keyboard users:

```tsx
<Tooltip 
  content="I'm accessible via keyboard"
  showOnFocus={true} // Make sure this is enabled
>
  <button>
    Focus me with Tab key
  </button>
</Tooltip>
```

### Screen Reader Support

Tooltips use proper ARIA attributes for screen reader compatibility:

```tsx
<Tooltip 
  content="Screen reader friendly explanation"
  id="help-tooltip" // Important for ARIA association
>
  <button aria-describedby="help-tooltip">
    Help
  </button>
</Tooltip>
```

## Performance Patterns

### Conditional Rendering

For cases where tooltips might impact performance in lists:

```tsx
{items.map(item => (
  <div key={item.id} className="list-item">
    {item.name}
    
    {/* Only render tooltip component when needed */}
    {item.hasTooltip && (
      <Tooltip content={item.tooltipContent}>
        <span className="info-icon">ⓘ</span>
      </Tooltip>
    )}
  </div>
))}
```

### Memoized Tooltip Content

For complex tooltip content, use memoization:

```tsx
const MemoizedTooltipContent = React.memo(({ data }) => (
  <div className="complex-tooltip-content">
    <h4>{data.title}</h4>
    <div className="tooltip-metrics">
      {data.metrics.map(metric => (
        <div key={metric.id} className="metric">
          {metric.name}: {metric.value}
        </div>
      ))}
    </div>
  </div>
));

<Tooltip content={<MemoizedTooltipContent data={itemData} />}>
  <button>View Details</button>
</Tooltip>
``` 