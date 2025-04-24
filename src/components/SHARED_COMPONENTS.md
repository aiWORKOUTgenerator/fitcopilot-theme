# Shared Component Library

This document outlines the standards and guidelines for shared components that can be used across multiple features.

## Component Types

### 1. UI Components

Basic presentational components with no business logic:

- Buttons
- Inputs
- Cards
- Modals
- Loaders
- Typography

### 2. Layout Components

Components that provide structural layout:

- Grid
- Container
- Section
- Flex
- Stack
- Divider

### 3. Form Components

Specialized components for form handling:

- Form
- FormField
- Input
- Select
- Checkbox
- Radio
- Switch

### 4. Feedback Components

Components for user feedback:

- Toast
- Alert
- Banner
- ProgressBar
- Spinner

## Component Structure

Each shared component should follow this structure:

```
/components
  /UI
    /Button
      Button.tsx        # Component implementation
      Button.scss       # Component styles
      Button.test.tsx   # Component tests
      index.ts          # Public API
      types.ts          # Type definitions
      
  /Layout
    /Grid
      ...
  /Form
    /Input
      ...
```

## Component Guidelines

### 1. Interface Design

- Components should have a clean, well-documented API
- Use TypeScript interfaces for props
- Provide sensible defaults
- Support composition via children
- Allow customization via props

```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  className,
}) => {
  // Implementation
};
```

### 2. Styling Approach

- Use SCSS modules for component styles
- Support theme customization
- Use CSS variables for theming
- Ensure responsive behavior
- Support accessibility

```scss
// Button.scss
.button {
  font-family: var(--font-family-sans);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  
  &.primary {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
  
  &.secondary {
    background-color: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
}
```

### 3. Composition Over Inheritance

- Design components to be composable
- Use higher-order components (HOCs) sparingly
- Prefer render props and hooks for behavior sharing

```typescript
// Good: Composition
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>

// Avoid: Complex inheritance hierarchies
class SpecializedCard extends BaseCard {
  // ...
}
```

### 4. Documentation

- Document component APIs
- Provide usage examples
- Document accessibility features
- Include responsive behavior notes

```typescript
/**
 * Button component for triggering actions
 * 
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * @accessibility
 * - Supports keyboard navigation
 * - Implements ARIA attributes for screen readers
 * - Maintains 3:1 contrast ratio
 */
export const Button = {...}
```

## Implementation Requirements

### 1. Technical Requirements

- Must include TypeScript types
- Must support all screen sizes
- Must have unit tests with >80% coverage
- Must be accessible (WCAG 2.1 AA compliant)
- Must support light/dark mode
- Must support reduced motion preferences

### 2. Integration with Features

- Shared components should be imported directly from the component library
- Features should not modify shared component behavior
- Any feature-specific adaptations should be created as new components that use shared components as building blocks

```typescript
// Good: Direct import from shared library
import { Button } from '../../../components/UI/Button';

// Bad: Import that bypasses the public API
import Button from '../../../components/UI/Button/Button';
```

### 3. Component Review Process

New shared components must go through a review process:

1. Component proposal with API design
2. Implementation review
3. Accessibility audit
4. Performance review
5. Documentation review
6. Final approval

## Examples

### Button Component Example

```typescript
// Button.tsx
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,
  className,
}) => {
  const buttonClasses = classNames(
    'button',
    variant && `button-${variant}`,
    size && `button-${size}`,
    loading && 'button-loading',
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <span className="button-spinner" aria-hidden="true" />
      ) : null}
      <span className={loading ? 'button-text-loading' : ''}>{children}</span>
    </button>
  );
};

export default Button;
```

This provides a solid foundation for creating and maintaining shared components across the application. 