# Theme Testing Best Practices

This guide outlines the best practices for implementing and testing theme support in component stories for the FitCopilot theme.

## Implementing Theme Support

### Core Principles

1. **CSS Variables**: Always use CSS variables for themeable properties
2. **ThemeProvider**: Use the ThemeProvider for proper context
3. **Consistent Data Attributes**: Use data-theme attributes consistently
4. **Theme Showcase**: Include a ThemeShowcase story for each themed component

### Component Implementation

When implementing a component that supports themes:

```tsx
// Component.tsx
import React from 'react';
import './Component.scss';

export interface ComponentProps {
  title: string;
  // Other props...
}

export const Component: React.FC<ComponentProps> = ({ title, ...props }) => {
  return (
    <div className="component">
      <h2 className="component__title">{title}</h2>
      {/* Component content... */}
    </div>
  );
};
```

```scss
// Component.scss
.component {
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  
  &__title {
    color: var(--color-heading);
    font-family: var(--font-heading);
  }
  
  // Avoid hardcoded values like:
  // ❌ color: #333;
  // ✅ Use variables instead:
  // color: var(--color-text);
}
```

## Story Implementation

### Standard Theme Testing Story

Every component with theme-specific styling should include a ThemeShowcase story:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Component } from '../Component';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ThemeOption } from '../../../utils/theming';

const meta: Meta<typeof Component> = {
  // Meta configuration...
};

export default meta;
type Story = StoryObj<typeof Component>;

// Default story
export const Default: Story = {
  args: {
    // Default props
  }
};

// Theme showcase helper
const ComponentWithThemes = <P extends object>(Component: React.ComponentType<P>, args: P) => {
  const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness', 'nutrition'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {themes.map((theme) => (
        <div key={theme} style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h3>
          <ThemeProvider initialTheme={theme}>
            <Component {...args} />
          </ThemeProvider>
        </div>
      ))}
    </div>
  );
};

// Theme showcase story
export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(Component, args),
  args: {
    // Component props
  }
};
```

### Using the Theme Template

The fastest way to implement a proper theme-ready story is to use our template:

1. Copy the template to your component's stories directory:
   ```
   cp docs/templates/ComponentStory.template.tsx src/features/FeatureName/ComponentName/stories/ComponentName.stories.tsx
   ```

2. Update the imports and component references
3. Uncomment and modify the necessary sections
4. Add your component-specific stories

## Testing Theme Support

### Manual Testing

When testing a component for theme support, check the following:

1. **Base Rendering**: Component should render correctly in the default theme
2. **Theme Switching**: Use the theme dropdown in the toolbar to switch themes
3. **Visual Consistency**: Verify colors, typography, and spacing change appropriately
4. **Variable Usage**: Inspect elements with DevTools to verify CSS variables are used
5. **Responsive Design**: Test on different viewport sizes
6. **Edge Cases**: Test with extreme content, different themes, and varied props

### Automated Testing

Use the theme testing tools to automate theme checks:

1. Run the theme test script:
   ```bash
   ./scripts/test-storybook-components.sh
   ```

2. Use the Theme Test Controls panel in Storybook
3. Check the console output for CSS variable usage

## Common Theme Testing Pitfalls

### Avoid These Common Mistakes

1. **Hardcoded Colors**: Using hex/rgb values instead of CSS variables
   ```scss
   /* ❌ Avoid */
   color: #3366ff;
   
   /* ✅ Better */
   color: var(--color-primary);
   ```

2. **Missing Theme Provider**: Component stories without ThemeProvider wrapper
   ```tsx
   /* ❌ Avoid */
   export const Basic = () => <Component />;
   
   /* ✅ Better */
   export const Basic = () => (
     <ThemeProvider>
       <Component />
     </ThemeProvider>
   );
   ```

3. **Inconsistent Theme Attributes**: Mixing different theme attribute approaches
   ```html
   <!-- ❌ Avoid mixing approaches -->
   <div class="theme--sports">...</div>
   <div data-theme="gym">...</div>
   
   <!-- ✅ Better: Be consistent -->
   <div data-theme="sports">...</div>
   <div data-theme="gym">...</div>
   ```

4. **Hard-to-Test Components**: Components that don't accept props through args
   ```tsx
   /* ❌ Avoid hardcoded values */
   export const Default = () => (
     <Component title="Fixed Title" />
   );
   
   /* ✅ Better: Use args */
   export const Default: Story = {
     args: {
       title: 'Default Title'
     }
   };
   ```

## Theme Testing Checklist

Use this checklist when reviewing component theme support:

- [ ] Component uses CSS variables for all themeable properties
- [ ] Story includes a ThemeShowcase variant
- [ ] Component renders correctly in all theme variants
- [ ] CSS variables are properly scoped and used
- [ ] No hardcoded colors or theme-specific values
- [ ] Theme switching works via Storybook toolbar
- [ ] Component is responsive across themes and viewports
- [ ] ThemeProvider is used correctly in stories
- [ ] Data-theme attributes are applied correctly

## Theme Debugging

### Debugging Theme Issues

If a component doesn't respond correctly to theme changes:

1. **Inspect Element**: Use browser DevTools to inspect the component
2. **Check CSS Variables**: Verify variables are defined and applied
3. **Check Theme Inheritance**: Ensure theme context is properly passed
4. **Run Theme Tests**: Use the built-in theme testing controls
5. **Check Specificity**: Verify CSS specificity isn't overriding theme variables

### Theme Testing Utilities

Use these utilities to help with theme testing:

1. **Theme Test Controls**: Available in the Storybook sidebar
2. **Browser DevTools**: Inspect element to see computed styles
3. **Storybook Addons**: Use the theme selector in the toolbar
4. **Test Scripts**: Use the provided test scripts for systematic testing 