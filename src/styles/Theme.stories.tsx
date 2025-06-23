import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { themeColorMap, themeOptions } from '../utils/theming';

const meta: Meta = {
  title: 'Design System/Theme',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# FitCopilot Theme System

FitCopilot uses a comprehensive theme system powered by CSS variables and React context. This approach allows for consistent styling across components while supporting multiple theme variants.

## Theme Variants

FitCopilot supports the following theme variants:

- **Default**: The base theme for the application
- **Gym**: Theme optimized for gym and fitness center applications  
- **Sports**: Theme for sports and athletic activities
- **Wellness**: Theme for wellness and health content
- **Nutrition**: Theme for nutrition and diet-related features

## How Theming Works

The theme system operates on multiple levels:

1. **CSS Variables**: Root CSS variables define colors, spacing, typography, etc.
2. **Theme Variants**: Each theme overrides specific variables via \`data-theme\` attributes
3. **React Context**: The \`ThemeProvider\` component manages theme state and applies attributes
4. **Component Integration**: Components consume theme variables for consistent styling

## Using Themes in Components

Components can access theme values in two ways:

1. **CSS Variables**: Component styles use \`var(--color-primary)\` to access theme colors
2. **Context API**: The \`useTheme()\` hook provides direct access to theme state in components
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Theme Color Showcase Component
const ThemeColorShowcase: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Theme Color Palette</h2>
      <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
        {themeOptions.map((theme) => (
          <div key={theme} style={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              textTransform: 'capitalize',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              {theme} Theme
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {Object.entries(themeColorMap[theme]).map(([colorName, colorValue]) => (
                <div key={colorName} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  minWidth: '120px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: colorValue,
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '0.5rem'
                  }} />
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {colorName}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280',
                    fontFamily: 'monospace',
                    textAlign: 'center'
                  }}>
                    {colorValue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Theme Usage Example Component
const ThemeUsageExample: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Theme Usage Example</h2>
      <div style={{ 
        backgroundColor: '#f8fafc', 
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '1rem'
      }}>
        <h3>Component Example</h3>
        <pre style={{ 
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          padding: '1rem',
          borderRadius: '6px',
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
          {`import { useTheme } from '../../context/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="my-component">
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('sports')}>
        Switch to Sports
      </button>
    </div>
  );
};`}
        </pre>
      </div>
    </div>
  );
};

export const ColorPalette: Story = {
  render: () => <ThemeColorShowcase />,
  parameters: {
    docs: {
      description: {
        story: 'Visual representation of all theme color palettes available in the FitCopilot design system.'
      }
    }
  }
};

export const UsageExample: Story = {
  render: () => <ThemeUsageExample />,
  parameters: {
    docs: {
      description: {
        story: 'Example of how to use themes in React components with the useTheme hook.'
      }
    }
  }
};

export const BestPractices: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2>Best Practices</h2>
      <ul style={{ lineHeight: '1.6', fontSize: '1rem' }}>
        <li>Always use CSS variables for themeable properties</li>
        <li>Test components in all theme variants</li>
        <li>Use semantic color names in your components (e.g., <code>--color-primary</code> not <code>--purple-500</code>)</li>
        <li>Keep theme-specific overrides in the theme files, not in component styles</li>
        <li>Use the theme selector in Storybook toolbar to preview components in different themes</li>
        <li>Create "ThemeShowcase" stories that display components in all available themes</li>
      </ul>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Guidelines and best practices for implementing and using the theme system effectively.'
      }
    }
  }
}; 