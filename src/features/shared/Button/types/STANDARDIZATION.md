# Button Props Standardization

This document outlines the standardized button props system implemented across the FitCopilot application.

## Core Principles

1. **Simplicity**: Focused on the essential props needed across button variants
2. **Consistency**: Standardized naming and types across all button components
3. **Type Safety**: Strong TypeScript typing with clear interfaces
4. **Composition**: Support for clean component composition and extension

## Button Props Structure

The button props system follows a hierarchical structure:

```
ButtonBaseProps (shared properties)
├── StandardButtonProps (standard button)
└── HeroButtonProps (hero-specific button)
```

### ButtonBaseProps

The `ButtonBaseProps` interface serves as the foundation for all button components, containing properties that are common across different button variants:

```typescript
interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  onClick?: ButtonClickHandler;
  // ...other common props
}
```

### StandardButtonProps

The `StandardButtonProps` interface extends `ButtonBaseProps` with a required variant:

```typescript
interface StandardButtonProps extends ButtonBaseProps {
  variant: ButtonVariant;
}
```

### HeroButtonProps

The `HeroButtonProps` interface extends `ButtonBaseProps` with a limited variant set specific to the Hero section:

```typescript
interface HeroButtonProps extends ButtonBaseProps {
  variant: 'primary' | 'secondary';
}
```

## Type Definitions

### ButtonSize

```typescript
type ButtonSize = 'small' | 'medium' | 'large';
```

### ButtonVariant

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'text' | 'icon' | 'link';
```

### ButtonClickHandler

```typescript
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
```

## Type Guards

The system includes type guards for checking button properties:

```typescript
// Check if button should render as a link
const isLinkButton = (props: ButtonBaseProps): boolean => 
  typeof props.href === 'string' && props.href.length > 0;

// Check if button has an icon
const hasIcon = (props: ButtonBaseProps): boolean =>
  Boolean(props.leftIcon || props.rightIcon);
```

## Usage Guidelines

### 1. Importing Types

```typescript
import { 
  ButtonBaseProps, 
  StandardButtonProps, 
  HeroButtonProps 
} from 'src/features/shared/Button/types/standardButtonTypes';
```

### 2. Component Implementation

Base Button:
```typescript
const Button: React.FC<StandardButtonProps> = ({ 
  variant = 'primary',
  size = 'medium',
  // ...other props
}) => {
  // Component implementation
};
```

Hero Button:
```typescript
const HeroButton: React.FC<HeroButtonProps> = ({ 
  variant = 'primary',
  size = 'medium',
  // ...other props
}) => {
  // Component implementation
};
```

### 3. Using Type Guards

```typescript
const renderButton = (props: ButtonBaseProps) => {
  if (isLinkButton(props)) {
    // Render as link
    return <a href={props.href}>...</a>;
  }
  
  // Render as button
  return <button>...</button>;
};
```

## Benefits

1. **Consistent Developer Experience**: Standardized prop names and types
2. **Reduced Duplication**: Shared types and utility functions
3. **Improved Maintainability**: Centralized type definitions
4. **Better Type Safety**: Strong typing with proper inheritance

## Next Steps

1. Update existing button components to use the standardized props
2. Create utility functions for common button operations
3. Implement comprehensive test coverage for type definitions 