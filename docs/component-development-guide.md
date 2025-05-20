# Component Development Guide

This guide outlines the standards and best practices for developing components in the FitCopilot theme.

## Component Structure

### Basic Component Structure

When creating a new component, follow this directory structure:

```
src/features/<FeatureName>/<ComponentName>/
├── <ComponentName>.tsx      # Main component implementation
├── <ComponentName>.scss     # Component styles
├── stories/                 # Storybook stories
│   └── <ComponentName>.stories.tsx
├── __tests__/               # Component tests
│   └── <ComponentName>.test.tsx
└── index.ts                 # Export file
```

### Component Implementation

1. **Use TypeScript**: All components must be written in TypeScript with proper type definitions.

2. **Props Interface**: Define a clear props interface with comments:

```tsx
/**
 * Props for the Button component
 */
export interface ButtonProps {
  /** The visual style variant */
  variant?: 'primary' | 'secondary'; 
  
  /** The size of the button */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Button content */
  children: React.ReactNode;
  
  /** Click handler */
  onClick?: () => void;
}
```

3. **Component Implementation**:

```tsx
/**
 * Button component used for user interactions
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick
}) => {
  // Implementation...
  
  return (
    <button 
      className={`button button--${variant} button--${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

4. **Default Export**: Use named exports in your component file but provide a default export in your index.ts:

```tsx
// index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
export default Button;
```

## Storybook Documentation

Every component **MUST** include Storybook stories that document its usage, variants, and props.

### Required Story Content

1. **Basic Component Example**: Show the component in its default state
2. **All Variants**: Include examples of all visual and functional variants
3. **Theme Variations**: Display the component in different theme contexts
4. **Documentation**: Document all props and usage patterns

### Story Implementation

Create a `stories` directory within your component directory:

```
src/features/<FeatureName>/<ComponentName>/stories/<ComponentName>.stories.tsx
```

For the fastest implementation, copy our standard template:

```
cp docs/templates/ComponentStory.template.tsx src/features/<FeatureName>/<ComponentName>/stories/<ComponentName>.stories.tsx
```

Or follow this pattern for your stories:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../ComponentName';
import React from 'react';

const meta: Meta<typeof ComponentName> = {
  title: 'Features/Category/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Description of the component'
      }
    }
  },
  argTypes: {
    // Document all props
  }
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // Default props
  }
};

// Include all significant variants
export const Variant: Story = {
  args: {
    // Variant props
  }
};

// Show theme variations
export const ThemeVariants: Story = {
  render: () => (
    <div>
      {/* Include theme examples */}
    </div>
  )
};
```

For more detailed guidance, refer to:
- [Storybook Standards](./storybook/story-standards.md)
- [Story Template](./storybook/story-template.md)
- [Storybook Best Practices](./storybook/best-practices.md)

## Component Testing

Every component should include unit tests:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Component Styling

Use SCSS for component styles:

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  
  &--primary {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
  
  &--secondary {
    background-color: var(--color-secondary);
    color: var(--color-white);
  }
  
  &--small {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }
  
  &--medium {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
  
  &--large {
    font-size: 1.125rem;
    padding: 0.75rem 1.5rem;
  }
}
```

## Accessibility

Ensure all components are accessible:

1. **Keyboard Navigation**: Components must be usable with keyboard only
2. **Screen Reader Support**: Use appropriate ARIA attributes
3. **Color Contrast**: Maintain sufficient contrast ratios
4. **Focus Management**: Implement proper focus handling

## Performance Considerations

1. **Memoization**: Use `React.memo` for components that render frequently
2. **Event Handlers**: Use `useCallback` for event handlers passed as props
3. **Derived State**: Use `useMemo` for expensive calculations

## Component Checklist

Before submitting a component for review, ensure that:

- [ ] Component has a clear, single responsibility
- [ ] TypeScript interfaces are defined for all props
- [ ] Default prop values are provided when appropriate
- [ ] Component is properly styled with SCSS
- [ ] Component includes Storybook stories
- [ ] Component includes unit tests
- [ ] Component is accessible
- [ ] Component follows performance best practices

## Related Documentation

- [Architecture Overview](./architecture/README.md)
- [Feature-First Approach](./architecture/feature-first-approach.md)
- [Directory Patterns](./architecture/directory-patterns.md)
- [Storybook Standards](./storybook/story-standards.md) 