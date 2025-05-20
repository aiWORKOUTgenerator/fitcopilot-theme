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

## Standard Template

We provide a standard template for creating component stories:

```
docs/templates/ComponentStory.template.tsx
```

This template includes:
- Proper imports for theme support
- Standardized structure for story organization
- Theme showcase helpers for displaying components across all themes
- Code examples and documentation placeholders

To use this template:
1. Copy the template to your component's stories directory
2. Rename it to match your component (e.g., `Button.stories.tsx`)
3. Update imports and component references
4. Add specific stories for your component variants
5. Include the ThemeShowcase story if your component has theme-specific styling

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

Always use the ThemeProvider and our standard ThemeShowcase pattern for theme variants:

```tsx
// ✅ Preferred: Use the ThemeShowcase helper from the template
export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(ComponentName, args),
  args: {
    // Component props
  }
};
```

#### Theme Variant Standards

1. **Always use `ThemeShowcase` as the story name** for displaying theme variants
2. **Use the ComponentWithThemes helper** from the template for consistent display
3. **Include all relevant theme variants** that apply to the component
4. **Follow the theme order** defined in the template (default, gym, sports, wellness, nutrition)
5. **Make sure your component uses theme variables** properly to benefit from theme switching

## Story File Structure

Each story file should follow this structure:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../ComponentName'; // Path relative to stories folder
import { ThemeProvider } from '../../../../context/ThemeContext';
import { ThemeOption } from '../../../../utils/theming';

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
    // Define prop controls with descriptions
    propName: {
      control: 'type',
      options: ['option1', 'option2'],
      description: 'Description of this prop'
    }
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

// Theme showcase (if applicable)
export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(ComponentName, args),
  args: {
    // Component props
  }
};
```

## Documentation Standards

Stories should include:

1. **Component Description**: A clear description of the component's purpose and usage
2. **Prop Documentation**: All props should be documented using argTypes
3. **Variants**: Show all important component variants
4. **Theme Examples**: For theme-aware components, show all theme variants using ThemeShowcase
5. **Usage Examples**: If complex, include usage examples

## Creating New Stories

When creating new stories:

1. Create a `stories` directory within the component's directory
2. Copy the template from `docs/templates/ComponentStory.template.tsx`
3. Rename the file to `ComponentName.stories.tsx`
4. Follow the standard story structure
5. Run Storybook to verify the stories appear correctly

## Migration from Legacy Patterns

We are migrating from various legacy patterns to this standardized approach. 
If you encounter stories in non-standard locations:

1. Use the migration script: `node scripts/migrate-stories.js`
2. Verify that the migrated stories work correctly
3. Submit a PR using the storybook standardization PR template 