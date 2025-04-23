---
sidebar_position: 1
---

# Storybook Integration

## Overview

FitCopilot uses [Storybook](https://storybook.js.org/) to document and showcase its component library. Storybook provides an interactive environment for developing and testing UI components in isolation, making it easier to build, review, and test components.

## Accessing Storybook

You can access the FitCopilot Storybook in two ways:

1. **Local Development**: Run `npm run storybook` to start Storybook locally at `http://localhost:6006`
2. **Deployed Version**: Visit our [deployed Storybook](https://storybook.fitcopilot.com) (requires authentication)

## Storybook Features

Our Storybook implementation includes the following features:

### Component Documentation

- **Component Overview**: Description and purpose of each component
- **Props Documentation**: Interactive props table with descriptions and default values
- **JSDoc Integration**: Pulled directly from component code comments
- **TypeScript Integration**: Type information displayed for all props

### Interactive Examples

- **Controls**: Modify component props in real-time
- **Actions**: Track callback prop interactions
- **Viewport**: Test component responsiveness at different screen sizes
- **Accessibility**: Built-in accessibility checks

### Additional Features

- **Design Assets**: Integration with design tools and assets
- **Themes**: Toggle between light and dark themes
- **Measure Tool**: Inspect component dimensions
- **Color Blindness Emulation**: Test for color blindness accessibility

## Creating Stories

Every component should have a corresponding Story file. Here's how to create stories for components:

```tsx
// Button.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    onClick: { action: 'clicked' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
      description: 'The visual style of the button'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the button'
    }
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};
```

## Story Organization

Stories are organized to match our component hierarchy:

- **UI Components**: `/stories/ui/`
- **Layout Components**: `/stories/layout/`
- **Feature Components**: `/stories/features/`

Within each category, stories are organized by component name, following the same structure as the source code.

## Best Practices

When creating stories:

1. **Include all variations**: Showcase all component variants
2. **Document props thoroughly**: Provide descriptions for all props
3. **Show example usage**: Include complex examples that demonstrate real usage
4. **Test edge cases**: Include stories that test edge cases
5. **Add JSDoc comments**: Document components fully with JSDoc

## Integration with Documentation

Storybook is integrated with this documentation site to provide a seamless experience. You can embed Storybook examples directly in the documentation.

## CI/CD Integration

Our CI/CD pipeline includes:

- **Automatic Deployment**: Storybook is deployed automatically on merges to main
- **Visual Regression Testing**: Using Chromatic to catch visual changes
- **Performance Monitoring**: Performance metrics are tracked over time 