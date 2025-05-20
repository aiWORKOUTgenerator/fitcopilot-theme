# Storybook Story Standards

This document outlines the standardized approach to organizing and writing Storybook stories in the FitCopilot theme.

## Story Organization

We use a **component-adjacent stories pattern** for organizing Storybook stories:

```
src/features/<FeatureName>/<ComponentName>/
├── stories/                 # Stories directory
│   ├── <Component>.stories.tsx  # Main stories file
│   └── examples/            # Optional complex examples
├── <Component>.tsx          # Main component implementation
├── <Component>.scss         # Component styles
└── index.ts                 # Component exports
```

This approach:
- Keeps stories close to the components they document
- Aligns with our feature-first architecture
- Makes it easier to find and update stories when working on components

## Import Standards

We use consistent import patterns based on component directory structure:

### Component Structure Types

- **Type A:** Component in root directory (`/ComponentName/ComponentName.tsx`)
  ```tsx
  import { ComponentName } from '../ComponentName';
  ```

- **Type B:** Component in components subdirectory (`/ComponentName/components/ComponentName.tsx`) 
  ```tsx
  import { ComponentName } from '../components';
  ```

- **Type C:** Feature component with direct structure (`/Feature/components/ComponentName/ComponentName.tsx`)
  ```tsx
  import { ComponentName } from '../ComponentName';
  ```

- **Type D:** Component directly in components directory (`/Feature/components/ComponentName.tsx`)
  ```tsx
  import { ComponentName } from '../../ComponentName';
  ```

### Always Use Curly Braces for Named Imports

```tsx
// ✅ Preferred: Named imports with curly braces
import { ComponentName } from '../path';

// ❌ Avoid: Default imports without curly braces
import ComponentName from '../path';
```

### Theme Variant Pattern

Always use JSX for theme variants instead of `React.createElement`:

```tsx
// ✅ Preferred: JSX pattern
export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>Default Theme</h3>
        <ComponentName />
      </div>
      
      <div data-theme="theme-variant-1">
        <h3>Theme Variant Name</h3>
        <ComponentName />
      </div>
    </div>
  )
};
```

#### Theme Variant Standards

1. **Always use `ThemeVariants` as the story name** (not ThemedVariants or other variations)
2. **Always use JSX syntax** (not React.createElement)
3. **Always include `data-theme` attributes** on theme containers
4. **Always organize as a column** with theme sections stacked vertically
5. **Always include headings** for each theme section
6. **Always include the default theme** as the first option
7. **Include all relevant theme variants** that apply to the component

## Story File Structure

Each story file should follow this structure:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../ComponentName'; // Path relative to stories folder

const meta: Meta<typeof ComponentName> = {
  title: 'Features/Category/ComponentName', // Category should match feature hierarchy
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description goes here'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Define prop controls
  }
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Basic story
export const Default: Story = {
  args: {
    // Default props
  }
};

// Variant stories
export const AlternateVariant: Story = {
  args: {
    // Variant-specific props
  }
};

// Theme variants (if applicable)
export const ThemedVariants: Story = {
  render: () => (
    <div className="story-theme-grid">
      <div data-theme="theme-variant-1">
        <ComponentName />
      </div>
      <div data-theme="theme-variant-2">
        <ComponentName />
      </div>
    </div>
  )
};
```

## Documentation Standards

Stories should include:

1. **Component Description**: A clear description of the component's purpose and usage
2. **Prop Documentation**: All props should be documented using argTypes
3. **Variants**: Show all important component variants
4. **Theme Examples**: For theme-aware components, show all theme variants
5. **Usage Examples**: If complex, include usage examples

## Creating New Stories

When creating new stories:

1. Create a `stories` directory within the component's directory
2. Create a `ComponentName.stories.tsx` file
3. Follow the standard story structure
4. Run Storybook to verify the stories appear correctly

## Migration from Legacy Patterns

We are migrating from various legacy patterns to this standardized approach. 
If you encounter stories in non-standard locations:

1. Use the migration script: `node scripts/migrate-stories.js`
2. Verify that the migrated stories work correctly
3. Submit a PR using the storybook standardization PR template 