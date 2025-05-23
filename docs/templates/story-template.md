# Storybook Story Template

This document provides a template for creating new Storybook stories in the FitCopilot theme.

> **IMPORTANT**: Always include the `import React from 'react';` statement in any story that uses JSX, even if React is not explicitly referenced in your code. This is necessary because the JSX gets transformed into `React.createElement()` calls when compiled, and without the import, Storybook will throw a "React is not defined" error.

## Basic Story Template

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Features/Category/ComponentName', // Use proper hierarchy
  component: ComponentName,
  parameters: {
    layout: 'centered', // or 'padded' for larger components
    docs: {
      description: {
        component: 'A detailed description of the component and its purpose'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for all component props
    propName: {
      control: 'text', // or 'select', 'boolean', 'number', 'object', etc.
      options: ['option1', 'option2'], // For select controls
      description: 'Description of what this prop does',
      table: {
        type: { summary: 'string' }, // Type information
        defaultValue: { summary: 'default' } // Default value
      }
    },
    // Add more props as needed...
    onClick: {
      action: 'clicked', // For event handlers
      description: 'Function called when the component is clicked'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Basic story with args
export const Default: Story = {
  args: {
    // Default props
    propName: 'value'
  }
};

// Story variations
export const Variation: Story = {
  args: {
    // Different props for this variation
    propName: 'different value'
  }
};

// Story with render function for more complex examples
export const Complex: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <ComponentName propName="value" />
    </div>
  )
};

// Theme variants example
export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>Default Theme</h3>
        <ComponentName propName="value" />
      </div>
      
      <div data-theme="theme-variant">
        <h3>Theme Variant</h3>
        <ComponentName propName="value" />
      </div>
    </div>
  )
};
```

## Template for Components with State

For components that have state or need interaction in the story:

```tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../ComponentName';

const meta: Meta<typeof ComponentName> = {
  // ... same as basic template
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Wrapper component to handle state
const ComponentWrapper = (props) => {
  const [state, setState] = useState(initialValue);
  
  return (
    <ComponentName 
      {...props}
      value={state}
      onChange={(newValue) => setState(newValue)}
    />
  );
};

export const Interactive: Story = {
  render: () => (
    <ComponentWrapper propName="value" />
  )
};
```

## Template for Form Components

For form components:

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormComponent } from '../FormComponent';

const meta: Meta<typeof FormComponent> = {
  // ... meta configuration
};

export default meta;
type Story = StoryObj<typeof FormComponent>;

export const Default: Story = {
  args: {
    label: 'Field Label',
    placeholder: 'Enter a value',
    required: false
  }
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true
  }
};

export const WithError: Story = {
  args: {
    label: 'Field with Error',
    placeholder: 'Enter a value',
    required: true,
    error: 'This field has an error'
  }
};

export const FormExample: Story = {
  render: () => (
    <form style={{ width: '300px', padding: '20px' }}>
      <FormComponent
        label="Username"
        placeholder="Enter username"
        required={true}
      />
      <div style={{ marginTop: '10px' }}>
        <FormComponent
          label="Password"
          type="password"
          placeholder="Enter password"
          required={true}
        />
      </div>
      <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
    </form>
  )
};
```

## Recommended Story Organization

When creating stories, include the following standard variations (when applicable):

1. **Default**: Basic implementation with default props
2. **Variants**: Show all visual or functional variants
3. **States**: Show different states (active, disabled, with error, etc.)
4. **Sizes**: If the component has size options
5. **WithIcons**: If the component supports icons
6. **ThemeVariants**: Show the component in different theme contexts
7. **Complex**: Show complex usage examples or composition with other components

## File Location

Always place stories in a `stories` directory adjacent to the component:

```
src/features/FeatureName/ComponentName/
├── stories/
│   └── ComponentName.stories.tsx
├── ComponentName.tsx
└── index.ts
```

## Related Documentation

For more detailed guidance on writing stories, refer to:
- [Storybook Standards](./story-standards.md)
- [Directory Patterns](../architecture/directory-patterns.md) 
- [Storybook Standards](./story-standards.md)
- [Directory Patterns](../architecture/directory-patterns.md) 