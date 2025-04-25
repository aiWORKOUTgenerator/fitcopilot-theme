# Developer Onboarding Guide: FitCopilot Theme

Welcome to the FitCopilot theme project! This guide will help you set up your development environment, understand the project architecture, and get started with contributing to the codebase.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Project Architecture](#project-architecture)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Storybook](#storybook)
7. [WordPress Integration](#wordpress-integration)
8. [Theme Variants System](#theme-variants-system)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **Git**
- **Local WordPress development environment** (We recommend [Local](https://localwp.com/))
- **Composer** (for PHP dependencies)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/fitcopilot/fitcopilot-theme.git
cd fitcopilot-theme
```

### 2. Install Dependencies

```bash
# Install JavaScript dependencies
npm install

# Install PHP dependencies (if applicable)
composer install
```

### 3. Configure WordPress Environment

1. Create a new site in your local WordPress environment
2. Link the theme to your WordPress installation:
   
   **Option A**: Symlink the theme directory
   ```bash
   ln -s /path/to/fitcopilot-theme /path/to/wordpress/wp-content/themes/fitcopilot
   ```
   
   **Option B**: Configure your local development tool to use the theme directly

3. Activate the theme in WordPress admin (Appearance > Themes)

### 4. Start Development Server

```bash
# Start the development server with hot reloading
npm run dev
```

This will:
- Compile the React application
- Watch for file changes
- Automatically rebuild when changes are detected

Visit your local WordPress site to see the theme in action.

## Project Architecture

FitCopilot uses a **feature-first architecture** that organizes code by business domain rather than technical type.

### Directory Structure

```
src/
├── features/                  # Application features
│   ├── Homepage/              # Homepage feature
│   │   ├── Hero/              # Feature section
│   │   │   ├── Hero.tsx       # Component implementation
│   │   │   ├── Hero.scss      # Component styles
│   │   │   ├── types.ts       # TypeScript definitions
│   │   │   ├── index.ts       # Public API exports
│   │   │   └── components/    # Sub-components
│   │   └── ...other sections
│   └── ...other features
├── hooks/                     # Shared custom hooks
├── utils/                     # Utility functions
├── types/                     # Global type definitions
└── styles/                    # Global styles and theme
```

### Component Classification

- **Layout Components**: Provide structure without business logic
- **Feature Components**: Self-contained application functionality
- **UI Components**: Reusable, presentational elements without logic
- **Composite Components**: Combine UI components with minimal logic

For more details, see [docs/feature-architecture.md](../docs/feature-architecture.md).

## Development Workflow

### Feature Development Flow

1. **Understand Requirements**: Clearly understand the feature requirements
2. **Create Feature Structure**: Follow the feature directory structure pattern
3. **Implement Components**: Create the necessary components for the feature
4. **Document**: Add appropriate documentation and stories
5. **Test**: Write tests for the new feature
6. **Submit**: Open a pull request with your changes

### Branching Strategy

- **main**: Production-ready code
- **develop**: Integration branch for feature work
- **feature/name**: Individual feature branches

When starting new work:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# Make your changes
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
# Create a pull request against develop
```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to the build process or tools

Example:
```
feat(hero): add responsive design for mobile

- Adjust hero layout for smaller screens
- Optimize hero image loading for mobile

Fixes #123
```

## Testing

We use Jest and React Testing Library for our tests.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

Test files should be located alongside the components they test with a `.test.tsx` extension:

```tsx
// Hero.test.tsx
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero component', () => {
  it('renders the title correctly', () => {
    render(<Hero title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

## Storybook

We use Storybook to document and develop our components in isolation.

### Running Storybook

```bash
# Start Storybook development server
npm run storybook
```

Visit `http://localhost:6006` to view the Storybook interface.

### Creating Stories

Each component should have a corresponding `.stories.tsx` file:

```tsx
// Hero.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'Features/Homepage/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    title: 'Welcome to FitCopilot',
    subtitle: 'Your AI-powered workout companion',
  },
};

export const Gym: Story = {
  args: {
    variant: 'gym',
    title: 'Gym Experience',
    subtitle: 'Professional training with AI',
  },
};
```

## WordPress Integration

### WordPress Templates

WordPress templates are PHP files in the root directory that integrate with the React application:

- `index.php`: Main fallback template
- `homepage-template.php`: Custom template for the homepage
- `functions.php`: Theme functions and WordPress hooks

### Passing Data to React

Data is passed from WordPress to React via the `wp_localize_script` function in `inc/react-enqueue.php`:

```php
wp_localize_script('fitcopilot-app', 'fitcopilotData', [
  'restUrl' => esc_url_raw(rest_url()),
  'nonce' => wp_create_nonce('wp_rest'),
  'themeUrl' => get_template_directory_uri(),
  // Other data...
]);
```

Access this data in React:

```tsx
// Accessing WordPress data
const { restUrl, nonce } = window.fitcopilotData;
```

### REST API Integration

To fetch data from the WordPress REST API:

```tsx
// Example API call
const fetchPosts = async () => {
  try {
    const response = await fetch(`${window.fitcopilotData.restUrl}wp/v2/posts`, {
      headers: {
        'X-WP-Nonce': window.fitcopilotData.nonce,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};
```

## Theme Variants System

FitCopilot supports multiple visual variants (default, gym) that can be selected in the WordPress Customizer.

### Using Variants

Component files are organized by variant:

```
Hero/
├── default/         # Default variant implementation
│   └── Hero.tsx
├── gym/             # Gym variant implementation
│   └── Hero.tsx
├── Hero.scss        # Shared styles
├── types.ts         # Type definitions
└── index.ts         # Variant selection logic
```

The `index.ts` file dynamically selects the correct variant:

```tsx
// Import variant implementations
import DefaultHero from './default';
import GymHero from './gym';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import type { HeroProps, VariantKey } from './types';

// Map variants to implementations
export const HeroMap = {
  default: DefaultHero,
  gym: GymHero,
};

// Create a component that selects the right variant
const Hero = createVariantComponent<VariantKey, HeroProps>(HeroMap, 'default');

export { Hero };
```

### Creating New Variants

To add a new variant:

1. Define the variant in `types.ts`:
   ```ts
   export type VariantKey = 'default' | 'gym' | 'new-variant';
   ```

2. Create a new implementation directory:
   ```
   mkdir -p src/features/Homepage/Hero/new-variant
   ```

3. Implement the component in `new-variant/Hero.tsx`

4. Add to the component map in `index.ts`:
   ```ts
   export const HeroMap = {
     default: DefaultHero,
     gym: GymHero,
     'new-variant': NewVariantHero
   };
   ```

5. Update the WordPress customizer options

## Common Tasks

### Adding a New Feature

1. Create the feature directory structure:
   ```
   mkdir -p src/features/NewFeature
   touch src/features/NewFeature/index.ts
   touch src/features/NewFeature/NewFeature.tsx
   touch src/features/NewFeature/NewFeature.scss
   touch src/features/NewFeature/types.ts
   ```

2. Implement the feature component:
   ```tsx
   // NewFeature.tsx
   import React from 'react';
   import './NewFeature.scss';
   import { NewFeatureProps } from './types';
   
   export const NewFeature: React.FC<NewFeatureProps> = (props) => {
     return (
       <div className="new-feature">
         {/* Component implementation */}
       </div>
     );
   };
   
   export default NewFeature;
   ```

3. Export the component:
   ```tsx
   // index.ts
   import NewFeature from './NewFeature';
   export default NewFeature;
   ```

4. Create stories for Storybook documentation

### Creating a New Hook

1. Create the hook file:
   ```
   touch src/hooks/useNewHook.ts
   ```

2. Implement the hook:
   ```tsx
   // useNewHook.ts
   import { useState, useEffect } from 'react';
   
   export const useNewHook = (initialValue) => {
     const [value, setValue] = useState(initialValue);
     
     useEffect(() => {
       // Hook implementation
     }, [initialValue]);
     
     return { value, setValue };
   };
   ```

3. Export the hook from the hooks index file

### Adding WordPress Customizer Options

To add new customizer options, edit `includes/theme-variants.php`:

```php
/**
 * Add theme customizer settings
 */
function fitcopilot_theme_customizer($wp_customize) {
  // Add a section
  $wp_customize->add_section('fitcopilot_variants', array(
    'title'    => __('Theme Variants', 'fitcopilot'),
    'priority' => 30,
  ));
  
  // Add setting
  $wp_customize->add_setting('fitcopilot_hero_variant', array(
    'default'           => 'default',
    'sanitize_callback' => 'sanitize_text_field',
  ));
  
  // Add control
  $wp_customize->add_control('fitcopilot_hero_variant', array(
    'label'    => __('Hero Variant', 'fitcopilot'),
    'section'  => 'fitcopilot_variants',
    'type'     => 'select',
    'choices'  => array(
      'default' => __('Default', 'fitcopilot'),
      'gym'     => __('Gym', 'fitcopilot'),
      'new-variant' => __('New Variant', 'fitcopilot'),
    ),
  ));
}
add_action('customize_register', 'fitcopilot_theme_customizer');
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Module not found" errors

- Check import paths for typos
- Ensure the file exists and is exported correctly
- Try using direct imports instead of index files:
  ```tsx
  // Instead of
  import { Component } from './Feature';
  
  // Use
  import { Component } from './Feature/Component';
  ```

#### 2. Styles not applying correctly

- Check that the SCSS file is imported in the component
- Verify class names match between JSX and SCSS
- Check for CSS specificity issues

#### 3. WordPress integration issues

- Check browser console for JavaScript errors
- Verify that WordPress data is being passed correctly
- Check REST API permissions and nonce verification

#### 4. Build process failures

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `npm run clean`
- Check webpack configuration for errors

### Getting Help

If you're stuck, here are ways to get help:

1. Check the existing documentation in the `docs/` directory
2. Review Storybook examples for similar components
3. Reach out to the team on Slack in the #fitcopilot-development channel
4. Create an issue on GitHub with detailed reproduction steps

Remember to search for existing issues before creating a new one.

## Next Steps

Now that you're set up, here are some recommended next steps:

1. Review the [Feature Architecture Guide](../docs/feature-architecture.md)
2. Explore the Storybook components (`npm run storybook`)
3. Try making a small change to an existing component
4. Create a simple feature branch and open a pull request

Happy coding! 