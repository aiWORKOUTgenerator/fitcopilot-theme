# FitCopilot Storybook Configuration Guide

This guide provides an overview of the Storybook configuration for the FitCopilot theme, covering setup, structure, and best practices.

## Story Structure

FitCopilot follows a component-adjacent pattern for stories:

```
src/features/<FeatureName>/<ComponentName>/
├── stories/                 # Stories directory
│   └── <ComponentName>.stories.tsx
├── <ComponentName>.tsx      # Main component implementation
└── index.ts                 # Component exports
```

## Story Template

All component stories should follow our standardized template:

1. **Import the component**: Import from the parent directory
2. **Define meta configuration**: Title, component, parameters
3. **Add standard stories**: Default and ThemeShowcase (if needed)
4. **Add specialized stories**: Additional variants as needed

Example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentWithThemes } from '../../../utils/storybook-helpers';
import { Button } from '../Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standard button component with theme variants'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'text'] }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button Text',
    variant: 'primary'
  }
};

export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(Button, args),
  args: {
    children: 'Button Text',
    variant: 'primary'
  }
};
```

## Theme Support

FitCopilot's Storybook supports multiple themes through the `data-theme` attribute. Use the `ComponentWithThemes` helper to display a component in all available themes:

```tsx
export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(Component, args),
  args: {
    // Component props
  }
};
```

## Migration Script

To standardize story files, use the migration script:

```bash
# Analyze stories without migrating
node scripts/migrate-stories.js --test --verbose

# Migrate all stories
node scripts/migrate-stories.js

# Apply standard template to stories
node scripts/migrate-stories.js --apply-template
```

### Migration Process

For the most reliable migration:

1. Test on a few components first
2. Migrate components by feature area
3. Verify in Storybook after each batch
4. Apply templates after basic structure is confirmed

See the [Story Migration Guide](./story-migration-guide.md) for detailed instructions.

## Helpers and Utilities

FitCopilot provides several helpers for Storybook:

- `ComponentWithThemes`: Renders a component in all theme variants
- `ComponentWithResponsiveVariants`: Shows a component at different viewport sizes

Import these from `src/utils/storybook-helpers.tsx`.

## Troubleshooting

### Common Issues

1. **Component doesn't render**: Check import paths and verify correct component export
2. **Theme switching doesn't work**: Verify data-theme attribute is being applied
3. **Stories don't appear in sidebar**: Check the title hierarchy

### Cache Clearing

If Storybook shows outdated content:

```bash
# Clear Storybook cache
npm run storybook:clear-cache

# Start with clean build
npm run storybook:clean
```

## Best Practices

1. **Keep stories close to components**: Follow the component-adjacent pattern
2. **Use standardized templates**: Maintain consistency across stories
3. **Demonstrate variants**: Show different configurations of each component
4. **Include theme showcase**: Display components in all themes when applicable
5. **Document prop usage**: Include control descriptions and examples
6. **Add responsive examples**: Show how components adapt to different viewports

## Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Component Story Format](https://storybook.js.org/docs/react/api/csf) 