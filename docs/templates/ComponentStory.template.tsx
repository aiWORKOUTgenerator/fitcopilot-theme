import * as React from 'react';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { ThemeOption } from '../../src/utils/theming';
import { ComponentWithThemes } from '../../utils/storybook-helpers';

/**
 * Template file for creating consistent component stories with theme support
 * 
 * Copy this file to your component's stories folder and replace the following:
 * - `Component` with your actual component name
 * - `ComponentProps` with your component's props interface
 * - Update the imports to point to your component
 * - Update the title to reflect the component's location in the hierarchy
 * - Add appropriate argTypes and args for your component
 */

// Import your component
// import { Component } from '../components';

// Define your component props interface if not already available
// interface ComponentProps {}

/**
 * Create a Meta object for your component
 */
/*
const meta: Meta<typeof Component> = {
  title: 'Features/Category/Component',
  component: Component,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Define control types for your component props
    // Example:
    // variant: {
    //   control: 'select',
    //   options: ['primary', 'secondary'],
    //   description: 'Component variant'
    // }
  }
};

export default meta;
type Story = StoryObj<typeof Component>;
*/

/**
 * Helper for rendering components with different themes
 * This can be used to create a ThemeShowcase story
 */
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

/**
 * Define your stories
 * 
 * Example:
 */
/*
export const Default: Story = {
  args: {
    // Component props
  }
};

export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(Component, args),
  args: {
    // Component props
  }
};
*/

/**
 * Standard FitCopilot Story Template
 * 
 * This template provides a consistent pattern for component stories:
 * - Default story with basic props
 * - ThemeShowcase for displaying with all theme variants
 * - Additional story examples as needed
 * 
 * For additional story variants:
 * 1. Add a new exported const with the Story type
 * 2. Set args or use the render method for custom rendering
 * 3. Add parameters as needed for specific documentation
 */

/* const meta: Meta<typeof Component> = {
  title: 'Components/Category/Component',
  component: Component,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props here
  }
};

export default meta;
type Story = StoryObj<typeof Component>; */

/* export const Default: Story = {
  args: {
    // Default props
  }
}; */

/* export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(Component, args),
  args: {
    // Component props
  }
}; */

/**
 * Responsive showcase variants can be added like this:
 */

/* export const ResponsiveVariants: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Shows how the component adapts to different viewport sizes.'
      }
    }
  },
  render: (args) => (
    <div className="responsive-demo">
      <Component {...args} />
    </div>
  ),
  args: {
    // Props for responsive demo
  }
}; */

/**
 * Interactive variants with state can be added like this:
 */

/* export const Interactive: Story = {
  render: function Render(args) {
    const [state, setState] = React.useState(initialState);
    
    return (
      <Component 
        {...args} 
        value={state}
        onChange={(newValue) => setState(newValue)}
      />
    );
  },
  args: {
    // Props for interactive demo
  }
}; */

/**
 * Story template usage instructions:
 * 
 * 1. Copy this file to your component's stories folder
 * 2. Rename it to match your component (e.g., Button.stories.tsx)
 * 3. Uncomment and adjust the commented sections
 * 4. Replace the placeholder values with your component-specific values
 * 5. Add your component-specific stories
 * 6. Include a ThemeShowcase story to demonstrate theme compatibility
 */ 