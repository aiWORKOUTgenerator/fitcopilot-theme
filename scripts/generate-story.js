#!/usr/bin/env node

/**
 * Story Generator
 * 
 * Generates a Storybook story file for a given component.
 * Usage: node generate-story.js <component-path>
 * Example: node generate-story.js src/features/Homepage/Hero/Hero.tsx
 */

const fs = require('fs');
const path = require('path');

// Get the component path from command line arguments
const componentPath = process.argv[2];

if (!componentPath) {
    console.error('Please provide a component path.');
    console.log('Usage: node generate-story.js <component-path>');
    console.log('Example: node generate-story.js src/features/Homepage/Hero/Hero.tsx');
    process.exit(1);
}

// Ensure the component exists
if (!fs.existsSync(componentPath)) {
    console.error(`Component not found: ${componentPath}`);
    process.exit(1);
}

// Get component details
const componentName = path.basename(componentPath, path.extname(componentPath));
const componentDir = path.dirname(componentPath);

// Create a stories directory if it doesn't exist
const storiesDir = path.join(componentDir, 'stories');
if (!fs.existsSync(storiesDir)) {
    fs.mkdirSync(storiesDir);
    console.log(`Created stories directory at: ${storiesDir}`);
}

// Set the story file path in the stories directory
const storyPath = path.join(storiesDir, `${componentName}.stories.tsx`);

// Check if story already exists
if (fs.existsSync(storyPath)) {
    console.error(`Story already exists at ${storyPath}`);
    process.exit(1);
}

// Determine the component's import path relative to the stories directory
const importPath = `../${componentName}`;

// Get the default export name for the component
const componentCode = fs.readFileSync(componentPath, 'utf8');
let exportName = componentName;

// Check if component is a default export
const defaultExportRegex = /export\s+default\s+(\w+)/;
const namedExportRegex = /export\s+const\s+(\w+)/;

const defaultMatch = componentCode.match(defaultExportRegex);
const namedMatch = componentCode.match(namedExportRegex);

if (defaultMatch) {
    exportName = defaultMatch[1];
} else if (namedMatch) {
    exportName = namedMatch[1];
}

// Determine story title based on file path
const srcDir = path.resolve(__dirname, '../src');
const getStoryTitle = (filePath) => {
    const relPath = path.relative(srcDir, filePath);
    const parts = relPath.split(path.sep);

    // Remove .tsx extension from the last part
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\.tsx$/, '');

    if (parts[0] === 'features') {
        return parts.join('/');
    } else if (parts[0] === 'components') {
        return `${parts[1]}/${parts[parts.length - 1]}`;
    }

    return parts.join('/');
};

// Get the template
const templatePath = path.resolve(__dirname, '../docs/templates/ComponentStory.template.tsx');
let templateContent = '';
try {
    templateContent = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
    console.error(`Failed to read template: ${err.message}`);
    // Fall back to generating the story without template
    templateContent = '';
}

// Replace placeholders in the template, or generate story content if template is not available
let storyContent;
if (templateContent) {
    storyContent = templateContent
        .replace(/import\s+\{\s*ThemeProvider\s*\}\s*from\s*['"]\.\.\/\.\.\/src\/context\/ThemeContext['"]/, 
                 `import { ThemeProvider } from '../../../context/ThemeContext'`)
        .replace(/import\s+\{\s*ThemeOption\s*\}\s*from\s*['"]\.\.\/\.\.\/src\/utils\/theming['"]/, 
                 `import { ThemeOption } from '../../../utils/theming'`)
        .replace(/\/\/ import.*Component.*from.*components.*;/, `import { ${exportName} } from '${importPath}';`)
        .replace(/\/\/ interface ComponentProps \{\}/, `// interface ${exportName}Props {}`)
        .replace(/\/\*\s*const meta[\s\S]*?Component[\s\S]*?\*\//, 
                `const meta: Meta<typeof ${exportName}> = {
  title: '${getStoryTitle(componentPath)}',
  component: ${exportName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${componentName} component for the FitCopilot application. Add a detailed description here.'
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
type Story = StoryObj<typeof ${exportName}>;`)
        .replace(/\/\*\s*export const Default[\s\S]*?\*\//, 
                `export const Default: Story = {
  args: {
    // Default props
  }
};

export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(${exportName}, args),
  args: {
    // Component props
  }
};`);
} else {
    // Original story generation as fallback
    storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${exportName} } from '${importPath}';

/**
 * ${componentName} component documentation
 */
const meta: Meta<typeof ${exportName}> = {
  title: '${getStoryTitle(componentPath)}',
  component: ${exportName},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${componentName} component for the FitCopilot application. Add a detailed description here.',
      },
    },
  },
  argTypes: {
    // Define your argTypes here based on component props
    // Example:
    // backgroundColor: { control: 'color' },
    // size: { 
    //   control: { type: 'select' },
    //   options: ['small', 'medium', 'large'],
    // },
  },
};

export default meta;
type Story = StoryObj<typeof ${exportName}>;

/**
 * Default state of the ${componentName} component
 */
export const Default: Story = {
  args: {
    // Add default props here
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of the ${componentName} component.',
      },
    },
  },
};

/**
 * Variant example for the ${componentName} component
 */
export const Variant: Story = {
  args: {
    // Add variant props here
  },
  parameters: {
    docs: {
      description: {
        story: 'A variant of the ${componentName} component.',
      },
    },
  },
};

/**
 * ThemeShowcase for the ${componentName} component
 * Demonstrates the component in all theme variants
 */
export const ThemeShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {['default', 'gym', 'sports', 'wellness', 'nutrition'].map((theme) => (
        <div key={theme} style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h3>
          <div data-theme={theme !== 'default' ? theme : undefined}>
            <${exportName} />
          </div>
        </div>
      ))}
    </div>
  ),
};`;
}

// Write the story file
fs.writeFileSync(storyPath, storyContent);

console.log(`✅ Story file created at: ${storyPath}`);
console.log('Next steps:');
console.log('1. Update the component description');
console.log('2. Define argTypes based on component props');
console.log('3. Add stories for different component variants');
console.log('4. Ensure the ThemeShowcase story displays correctly with all themes');
console.log('5. Run Storybook to see your new story'); 