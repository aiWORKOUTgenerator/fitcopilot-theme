# Storybook Best Practices

This guide outlines the best practices for creating and maintaining Storybook stories in the FitCopilot theme.

## Component Documentation

### 1. Comprehensive Props Documentation

Always document all component props in the `argTypes` object:

```tsx
argTypes: {
  variant: {
    control: 'select', 
    options: ['primary', 'secondary'],
    description: 'The visual style of the button',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'primary' }
    }
  }
}
```

### 2. Include Component Description

Add a clear, concise description of the component's purpose:

```tsx
parameters: {
  docs: {
    description: {
      component: 'A versatile button component used throughout the application for user interactions.'
    }
  }
}
```

### 3. Document Usage Examples

Include examples of how the component should be used in different contexts:

```tsx
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use the primary button for main calls-to-action and the secondary button for alternative actions.'
      }
    }
  }
}
```

## Story Organization

### 1. Use Consistent Naming

Use consistent, descriptive names for your stories:

- `Default`: Basic implementation
- `Primary`, `Secondary`, etc.: Variant examples
- `Small`, `Medium`, `Large`: Size variants
- `Disabled`, `Loading`, etc.: State variants
- `WithIcons`: Examples with icons
- `ThemeVariants`: Theme variation examples

### 2. Group Related Stories

Group related stories in the same file and organize them in a logical order from simple to complex.

### 3. Hierarchy in Story Titles

Use a consistent hierarchy in story titles:

```tsx
title: 'Features/Homepage/Hero/HeroButton'
```

Structure should follow:
- Top level: `Features` or `Components`
- Second level: Feature name (e.g., `Homepage`, `Checkout`)
- Third level: Section or component category (e.g., `Hero`, `Forms`)
- Fourth level (if needed): Specific component (e.g., `HeroButton`)

## Component Visualization

### 1. Show All Variants

Include stories for all significant variants of a component:

```tsx
export const Primary: Story = { /* ... */ };
export const Secondary: Story = { /* ... */ };
export const Text: Story = { /* ... */ };
```

### 2. Demonstrate Theme Variations

Show how components look in different theme contexts:

```tsx
export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div data-theme="default">
        <Button variant="primary">Default Theme</Button>
      </div>
      <div data-theme="gym">
        <Button variant="primary">Gym Theme</Button>
      </div>
    </div>
  )
}
```

### 3. Show Responsive Behavior

For components with responsive behavior, demonstrate different viewport sizes:

```tsx
export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}
```

## Interactive Examples

### 1. Use Controls Effectively

Configure controls to allow interactive exploration of component props:

```tsx
argTypes: {
  size: {
    control: 'radio',
    options: ['small', 'medium', 'large']
  }
}
```

### 2. Include Interactive Examples

For components that require interaction, create examples that demonstrate the behavior:

```tsx
const InteractiveComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)}
      title="Interactive Modal"
    >
      <p>This modal can be opened and closed.</p>
      <button onClick={() => setIsOpen(false)}>Close</button>
    </Modal>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />
}
```

### 3. Demonstrate Error States

Show how components handle error states:

```tsx
export const WithError: Story = {
  args: {
    error: 'This field is required'
  }
}
```

## Accessibility

### 1. Test with A11y Addon

Ensure all stories pass accessibility checks:

```tsx
parameters: {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          enabled: true
        }
      ]
    }
  }
}
```

### 2. Document Accessibility Features

Highlight the accessibility features of your component:

```tsx
parameters: {
  docs: {
    description: {
      story: 'This component is fully keyboard accessible and supports screen readers with proper ARIA attributes.'
    }
  }
}
```

## Performance

### 1. Optimize Story Rendering

For complex components, use memoization and optimize renders:

```tsx
const MemoizedComponent = React.memo(({ props }) => {
  // Component implementation
});

export const Optimized: Story = {
  render: () => <MemoizedComponent props={complexProps} />
}
```

### 2. Use Proper Decorators

Use decorators to provide context without re-rendering:

```tsx
decorators: [
  (Story) => (
    <ThemeProvider theme="default">
      <Story />
    </ThemeProvider>
  )
]
```

## Maintenance

### 1. Keep Stories in Sync with Components

Update stories whenever component APIs change.

### 2. Use Consistent Dependencies

Don't import external dependencies in stories that the component doesn't already use.

### 3. Test Stories

Ensure that all stories render without errors by running Storybook before committing changes.

## Related Documentation

For more guidance, refer to:
- [Storybook Template](./story-template.md)
- [Storybook Standards](./story-standards.md)
- [Component Directory Patterns](../architecture/directory-patterns.md) 