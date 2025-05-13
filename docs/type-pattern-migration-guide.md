# Type Pattern Migration Guide

This guide outlines the process for migrating existing components to our standardized type patterns.

## Migration Checklist

For each component:

1. **Discriminator Property**
   - [ ] Determine if component represents different HTML elements → use `type` discriminator
   - [ ] Determine if component represents styling variations → use `variant` discriminator
   - [ ] Update interfaces/types with consistent naming

2. **Type Guards**
   - [ ] Move type guards from type file to `/utils/typeGuards/[component]TypeGuards.ts`
   - [ ] Ensure consistent naming pattern: `is[Variant][Component]` (e.g., `isContentCard`)
   - [ ] Update imports in all files using these guards

3. **Event Handlers**
   - [ ] Check for component-specific event handlers
   - [ ] Move standard handlers to `/types/events.ts`
   - [ ] Use specific naming: `[Component][Event]Handler` (e.g., `CardClickHandler`)
   - [ ] Update imports in component and type files

4. **Documentation**
   - [ ] Update component documentation with new pattern
   - [ ] Add JSDoc comments explaining the pattern usage

## Migration Steps

### Step 1: Migrate Discriminated Union Types

**Before:**
```typescript
// In component-specific types file
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  // ... other props
}
```

**After:**
```typescript
// In types/button.ts
export interface BaseButtonProps {
  // Common properties
}

export interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';  // Styling discriminator
  // Primary-specific properties
}

export interface SecondaryButtonProps extends BaseButtonProps {
  variant: 'secondary';  // Styling discriminator
  // Secondary-specific properties
}

export type ButtonProps = PrimaryButtonProps | SecondaryButtonProps;
```

### Step 2: Migrate Type Guards

**Before:**
```typescript
// In component file or types file
function isPrimaryButton(props: ButtonProps): boolean {
  return props.variant === 'primary';
}
```

**After:**
```typescript
// In utils/typeGuards/buttonTypeGuards.ts
import { ButtonProps, PrimaryButtonProps } from '../../types/button';

export function isPrimaryButton(props: ButtonProps): props is PrimaryButtonProps {
  return props.variant === 'primary';
}
```

### Step 3: Migrate Event Handlers

**Before:**
```typescript
// In component file
type ClickHandler = (e: any) => void;

function Button({ onClick }: { onClick: ClickHandler }) {
  // ...
}
```

**After:**
```typescript
// In types/events.ts
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type ButtonClickHandler = (event: ButtonClickEvent) => void;

// In types/button.ts
import { ButtonClickHandler } from './events';

export interface ActionButtonProps extends BaseButtonProps {
  onClick: ButtonClickHandler;
}
```

### Step 4: Update Component Implementation

**Before:**
```typescript
function Button(props: ButtonProps) {
  if (props.variant === 'primary') {
    return <PrimaryButton {...props} />;
  } else {
    return <SecondaryButton {...props} />;
  }
}
```

**After:**
```typescript
import { ButtonProps } from '../../types/button';
import { isPrimaryButton, isSecondaryButton } from '../../utils/typeGuards/buttonTypeGuards';

export const Button: React.FC<ButtonProps> = (props) => {
  if (isPrimaryButton(props)) return <PrimaryButton {...props} />;
  if (isSecondaryButton(props)) return <SecondaryButton {...props} />;
  
  logger.error(`Unsupported button variant: ${props.variant}`);
  return null;
};
```

## Common Pitfalls

1. **Forgetting to mark discriminator as required**
   - Make sure the discriminator property is not optional (`variant?:`) but required (`variant:`)

2. **Using inconsistent discriminator property names**
   - Remember: `type` for fundamental HTML differences, `variant` for styling differences

3. **Circular imports between types and type guards**
   - Types should never import from type guards
   - Type guards should import from types

4. **Not updating component imports**
   - After moving type guards, update all component files that import them

5. **Duplicating event handler definitions**
   - Use the centralized event handlers in `/types/events.ts`

## Migration Script

For complex components, you can use the following script to help with the migration:

```bash
node scripts/generate-type-patterns.js --component=Button --variants=primary,secondary,text --discriminator=variant
```

This will generate the necessary files following our standardized patterns.

By following these guidelines, we'll achieve a consistent type system across the codebase, making it more maintainable and significantly reducing ESLint warnings. 