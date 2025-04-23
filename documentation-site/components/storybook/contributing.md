---
sidebar_position: 2
---

# Contributing to Storybook

This guide explains how to add or enhance component documentation in our Storybook.

## Getting Started

Before contributing, ensure you have:

1. Installed all dependencies with `npm ci`
2. Started Storybook locally with `npm run storybook`
3. Familiarized yourself with our component architecture

## Creating a Story

Follow these steps to add a new component story:

### 1. Create the Story File

Place story files alongside their components following our feature-first architecture:

```
src/features/FeatureName/ComponentName/ComponentName.stories.tsx
```

### 2. Basic Story Structure

Use this template for new stories:

```tsx
import { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Category/SubCategory/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed description of the component purpose and usage',
      },
    },
  },
  argTypes: {
    // Define controls for component props
    propName: {
      description: 'Description of what this prop does',
      control: { type: 'text' }, // or other appropriate control
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default value' },
      },
    },
    // Add more props...
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // Default prop values
  },
};

// Add more variants...
```

### 3. Component Variants

Create multiple story exports to showcase different states:

```tsx
export const Primary: Story = {
  args: {
    variant: 'primary',
    // other props
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    // other props
  },
};
```

### 4. Document Edge Cases

Include stories that demonstrate edge cases:

```tsx
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: 'An error occurred',
  },
};

export const LongContent: Story = {
  args: {
    content: 'Very long content that might cause layout issues...',
  },
};
```

## Best Practices

### Controls and Documentation

1. **Document All Props**: Provide descriptions for every prop using `argTypes`
2. **Use Appropriate Controls**: Select the right control type for each prop:
   - `select` for enumerated values
   - `boolean` for flags
   - `text` for strings
   - `number` for numerical inputs
   - `color` for color selection
   - `object` for complex objects
   - `file` for file uploads

### Accessibility

1. **Test with Screen Readers**: Ensure your component works with screen readers
2. **Check Keyboard Navigation**: Verify focus states and keyboard accessibility
3. **Run A11y Checks**: Use the Accessibility addon to test WCAG compliance

### Visual Design

1. **Match Design System**: Ensure component appearance matches our design system
2. **Test Responsive Behavior**: Use the Viewport addon to test different screen sizes
3. **Link Design Assets**: Include Figma links using the Design addon

### Performance

1. **Keep Stories Simple**: Avoid complex setups in story files
2. **Use Decorators Thoughtfully**: Apply decorators only when necessary
3. **Minimize External Dependencies**: Avoid loading large assets in stories

## Automated Testing

Our CI pipeline includes:

1. **Visual Regression Testing** with Chromatic
2. **Accessibility Checks**
3. **Performance Benchmarking**

Each pull request that affects components will run these tests automatically.

## Reviewing Story PRs

When reviewing story contributions, check that:

1. The story follows our file structure and naming conventions
2. All props are properly documented with descriptions
3. The story includes all relevant states and variations
4. Accessibility features are properly implemented
5. The story passes all automated tests
6. The component matches the design specifications

## Documentation Integration

Stories are automatically integrated with our documentation site. To link directly to a specific component in Storybook, use:

```md
[Button Component](https://storybook.fitcopilot.com/?path=/docs/ui-button--docs)
```

## Getting Help

If you have questions about Storybook implementation, reach out to the team or leave comments on your PR. 