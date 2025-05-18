# Button Composition Pattern

## Overview

This document describes the standard patterns for button composition in the FitCopilot theme. The button system is designed to support multiple specialized button types across different sections of the application while maintaining consistent behavior, accessibility, and theming.

## Button Hierarchy

The button system follows a clear inheritance hierarchy:

```
ButtonBaseProps (interface)
       ↓
    Button (base component)
       ↓
Specialized Button Components
   - HeroButton
   - FeatureButton
   - JourneyButton
   - etc.
```

## Extending the Base Button

### Standard Extension Pattern

When creating a specialized button, follow this pattern:

1. **Import and extend the base types**

```typescript
import { Button } from '../features/shared/Button';
import { ButtonBaseProps } from '../features/shared/Button/types/standardButtonTypes';

export interface SpecializedButtonProps extends ButtonBaseProps {
  // Add specialized properties here
  customProp?: string;
}
```

2. **Create the component that wraps Button**

```typescript
export const SpecializedButton: React.FC<SpecializedButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  customProp,
  ...restProps
}) => {
  // Process specialized props
  
  // Construct CSS classes
  const buttonClasses = `
    specialized-button 
    specialized-button--${variant}
    ${className}
  `.trim();

  // Return wrapped Button
  return (
    <Button
      variant={variant}
      size={size}
      className={buttonClasses}
      {...restProps}
    >
      {children}
    </Button>
  );
};
```

3. **Use component composition over inheritance**

Always compose components by wrapping the base Button rather than extending it through inheritance. This maintains proper encapsulation and ensures consistent behavior.

## Mixed Button Types in ButtonGroup

### Using Different Button Types Together

ButtonGroup supports mixed button types with proper spacing and alignment:

```tsx
<ButtonGroup spacing="medium" alignment="center">
  <Button variant="primary">Standard Button</Button>
  <HeroButton variant="primary">Hero Button</HeroButton>
</ButtonGroup>
```

### How Mixed ButtonGroup Works

The ButtonGroup component uses CSS selectors that target both standard Button and specialized button components like HeroButton:

```scss
// In ButtonGroup.scss
.button-group--horizontal {
  // Target standard buttons
  .btn {
    &:not(:last-child) {
      margin-right: var(--button-group-spacing);
    }
  }
  
  // Target HeroButton components 
  .hero-button {
    &:not(:last-child) {
      margin-right: var(--button-group-spacing);
    }
  }
  
  // Handle mixed button types
  .btn + .hero-button, 
  .hero-button + .btn {
    // Special spacing adjustment for mixed types
    margin-left: calc(var(--button-group-spacing) * 0.5);
  }
}
```

This approach ensures:
1. Consistent spacing regardless of button type
2. Special handling for adjacent different button types
3. Responsive behavior that works for all button variants

### Responsive Behavior

For responsive stacking on mobile devices:

```tsx
<ButtonGroup 
  direction="horizontal" 
  responsiveStacking={true} 
  spacing="medium"
>
  <Button variant="primary">Standard Button</Button>
  <HeroButton variant="primary">Hero Button</HeroButton>
</ButtonGroup>
```

This will stack buttons vertically on screens smaller than 768px.

### Handling Different Sized Buttons

When mixing different sized buttons, alignment is handled automatically:

```tsx
<ButtonGroup alignment="center">
  <Button variant="primary" size="small">Small Button</Button>
  <HeroButton variant="primary" size="large">Large Hero Button</HeroButton>
</ButtonGroup>
```

The vertical alignment for differently sized buttons is handled through:

```scss
// Vertical alignment for mixed size buttons
.button-group {
  align-items: center;
  
  &--align-stretch {
    align-items: stretch;
  }
}
```

## Form Integration

### Button States in Forms

Buttons can display various states when used within forms:

1. **Loading State**

```tsx
<Button 
  type="submit" 
  variant="primary" 
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

2. **Error State**

```tsx
<Button 
  type="submit" 
  variant={hasError ? 'error' : 'primary'}
>
  Submit
</Button>
```

### Using with FormContext

Integration with the FormContext:

```tsx
import { useFormContext } from '../../shared/FormField/FormContext';

const MyForm = () => {
  const { isSubmitting, isValid } = useFormContext();
  
  return (
    <form>
      {/* Form fields */}
      <ButtonGroup>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  );
};
```

## Theme Propagation

Buttons inherit themes from their parent containers through the `data-theme` attribute:

```tsx
<div data-theme="gym">
  <ButtonGroup>
    <Button variant="primary">Standard Button</Button>
    <HeroButton variant="primary">Hero Button</HeroButton>
  </ButtonGroup>
</div>
```

### Theme Implementation Details

The theme system uses CSS variables with theme-specific values:

```scss
// Base theme variables
:root {
  --button-primary-bg: #3b82f6;
  --button-primary-text: #ffffff;
  --button-secondary-bg: #f3f4f6;
  --button-secondary-text: #1f2937;
}

// Theme-specific overrides
[data-theme="gym"] {
  --button-primary-bg: #ef4444;
  --button-primary-text: #ffffff;
  --button-secondary-bg: #fef2f2;
  --button-secondary-text: #991b1b;
}

[data-theme="sports"] {
  --button-primary-bg: #10b981;
  --button-primary-text: #ffffff;
  --button-secondary-bg: #ecfdf5;
  --button-secondary-text: #065f46;
}
```

Button components then use these variables in their styles:

```scss
.btn-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
}

.btn-secondary {
  background-color: var(--button-secondary-bg);
  color: var(--button-secondary-text);
}
```

This approach ensures:
1. Consistent theming across all button types
2. Component-specific styling that respects the theme
3. Smooth transitions between themes

Alternatively, use the ThemeContext:

```tsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <ButtonGroup>
      <Button variant="primary">Standard Button</Button>
      <HeroButton variant="primary">Hero Button</HeroButton>
    </ButtonGroup>
  );
};
```

### ThemeContext vs. data-theme Attribute

- **ThemeContext**: Useful for accessing theme programmatically for dynamic styling or logic
- **data-theme Attribute**: Better for static styling and CSS-based theme application

## Best Practices

1. **Always use the base Button as the foundation**
   - Wrap rather than duplicate functionality
   - Pass through all standard props to maintain consistent API

2. **Maintain consistent prop naming**
   - Follow the same prop interface patterns
   - Use standard variants (`primary`, `secondary`, etc.)
   - Use standard sizes (`small`, `medium`, `large`)

3. **Preserve accessibility features**
   - Forward all ARIA attributes
   - Maintain keyboard navigation support
   - Ensure proper focus states

4. **Support theme context**
   - Allow theme inheritance from parent containers
   - Access theme via useTheme hook when needed

## Examples

### Standard Button

```tsx
<Button 
  variant="primary" 
  size="medium" 
  onClick={handleClick}
>
  Click Me
</Button>
```

### Hero Button

```tsx
<HeroButton 
  variant="primary" 
  size="large"
  onClick={handleClick}
>
  Get Started
</HeroButton>
```

### Mixed Button Types in ButtonGroup

```tsx
<ButtonGroup 
  direction="horizontal" 
  alignment="center" 
  spacing="medium"
>
  <Button variant="secondary" size="medium">
    Cancel
  </Button>
  <HeroButton variant="primary" size="medium">
    Continue
  </HeroButton>
</ButtonGroup>
```

### Themed Buttons

```tsx
<div data-theme="sports">
  <ButtonGroup spacing="medium">
    <Button variant="secondary">Back</Button>
    <HeroButton variant="primary">Next Step</HeroButton>
  </ButtonGroup>
</div>
``` 