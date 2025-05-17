# Button Component Migration Guide

## Overview

This guide helps you migrate from the legacy Button component (`src/components/UI/Button`) to the new type-safe Button component (`src/features/shared/Button`).

## Key Changes

1. **Prop Changes**
   - `type` → `variant`
   - `className` remains the same
   - `onClick` now uses `ButtonClickHandler` type
   - New props for specific variants (e.g., `icon`, `tooltip`)

2. **Variant Mapping**
   ```typescript
   // Legacy → New
   type="primary"   → variant="primary"
   type="secondary" → variant="secondary"
   type="text"      → variant="text"
   type="link"      → variant="link"
   ```

3. **Event Handlers**
   ```typescript
   // Legacy
   onClick={(e) => handleClick(e)}

   // New
   import { ButtonClickHandler } from '../../../types/events';
   onClick: ButtonClickHandler
   ```

4. **Token Compliance**
   ```scss
   // Legacy
   .button {
     background-color: #4a90e2;
     padding: 0.5rem 1rem;
     border-radius: 0.25rem;
   }
   
   // New (Token Compliant)
   .btn {
     background-color: var(--color-primary);
     padding: var(--button-padding-y) var(--button-padding-x);
     border-radius: var(--button-border-radius);
   }
   ```

5. **Theme Support**
   ```scss
   // Add theme variants using data-theme attribute
   [data-theme="gym"] .btn-primary {
     background-color: var(--color-gym-primary);
   }
   ```

6. **Class Name Standardization**
   - The `.btn` class is now the standard
   - Legacy `.button` class is deprecated and will be removed in v2.0
   - ButtonGroup component will warn about deprecated class usage

7. **ButtonGroup Integration**
   - All buttons in ButtonGroup should use the `.btn` class
   - ButtonGroup supports theme variants out of the box
   - Provides automatic spacing between buttons
   - Use with HeroButton for themed button groups

## Examples

### Basic Button
```tsx
// Legacy
<Button type="primary" onClick={handleClick}>Submit</Button>

// New
<Button variant="primary" onClick={handleClick}>Submit</Button>
```

### Icon Button
```tsx
// Legacy
<Button type="icon" icon={<Icon />}>Click me</Button>

// New
<Button 
  variant="icon" 
  icon={Icon} 
  iconPosition="left"
>
  Click me
</Button>
```

### Link Button
```tsx
// Legacy
<Button type="link" href="/about">About</Button>

// New
<Button 
  variant="link" 
  href="/about"
  openInNewTab={false}
>
  About
</Button>
```

### HeroButton (Homepage-specific)
```tsx
// Use the specialized HeroButton component
<HeroButton
  variant="primary"
  leftIcon={<ArrowIcon />}
  size="large"
>
  Get Started
</HeroButton>
```

### ButtonGroup with Theme Support
```tsx
// Group buttons with proper spacing and theme support
<ButtonGroup direction="horizontal" spacing="medium" alignment="center">
  <Button variant="primary">Primary</Button>
  <HeroButton variant="secondary">Secondary Hero</HeroButton>
</ButtonGroup>
```

## Type Safety

The new Button component provides:
- Discriminated unions for variants
- Type guards for each variant
- Proper event handler types
- Comprehensive prop interfaces

## Import Pattern

Always use consistent import paths:

```tsx
// Preferred
import { Button } from '@features/shared/Button';
import { ButtonProps } from '@features/shared/Button/types';
import { HeroButton } from '@features/Homepage/Hero/components/HeroButton';

// Avoid
import { Button } from '../../../../features/shared/Button';
```

## Support

For questions or issues during migration, please:
1. Check the component documentation
2. Review the type definitions in `types.ts`
3. Contact the development team 