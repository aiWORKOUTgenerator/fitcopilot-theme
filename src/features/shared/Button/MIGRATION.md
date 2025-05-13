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

## Type Safety

The new Button component provides:
- Discriminated unions for variants
- Type guards for each variant
- Proper event handler types
- Comprehensive prop interfaces

## Support

For questions or issues during migration, please:
1. Check the component documentation
2. Review the type definitions in `types.ts`
3. Contact the development team 