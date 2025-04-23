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
const storyPath = path.join(componentDir, `${componentName}.stories.tsx`);

// Check if story already exists
if (fs.existsSync(storyPath)) {
    console.error(`Story already exists at ${storyPath}`);
    process.exit(1);
}

// Determine the component's import path relative to the src directory
const srcDir = path.resolve(__dirname, '../src');
const relativePath = path.relative(srcDir, componentPath);
const importPath = `./${componentName}`;

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

// Generate story content
const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
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
 * Edge case example (e.g., empty state, error state)
 */
export const EdgeCase: Story = {
  args: {
    // Add edge case props here
  },
  parameters: {
    docs: {
      description: {
        story: 'An edge case for the ${componentName} component (e.g., empty state, error state).',
      },
    },
  },
};
`;

// Write the story file
fs.writeFileSync(storyPath, storyContent);

console.log(`✅ Story file created at: ${storyPath}`);
console.log('Next steps:');
console.log('1. Update the component description');
console.log('2. Define argTypes based on component props');
console.log('3. Add meaningful examples with real props');
console.log('4. Run Storybook to see your new story'); 