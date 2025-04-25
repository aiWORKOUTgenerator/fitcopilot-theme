# Development Workflow Guide

This document outlines the complete development workflow for the FitCopilot theme, including detailed information on local setup, testing procedures, and contribution guidelines.

## Table of Contents

1. [Development Environment](#development-environment)
   - [System Requirements](#system-requirements)
   - [Local WordPress Setup](#local-wordpress-setup)
   - [Theme Installation](#theme-installation)
   - [Development Scripts](#development-scripts)
2. [Development Process](#development-process)
   - [Code Standards](#code-standards)
   - [Git Workflow](#git-workflow)
   - [Pull Request Process](#pull-request-process)
   - [Code Review](#code-review)
3. [Testing](#testing)
   - [Unit Testing](#unit-testing)
   - [Integration Testing](#integration-testing)
   - [Accessibility Testing](#accessibility-testing)
   - [Performance Testing](#performance-testing)
4. [Build Process](#build-process)
   - [Development Build](#development-build)
   - [Production Build](#production-build)
   - [Deployment](#deployment)
5. [Documentation](#documentation)
   - [Code Documentation](#code-documentation)
   - [Storybook](#storybook)
   - [API Documentation](#api-documentation)

## Development Environment

### System Requirements

Before beginning development, ensure your system meets these requirements:

- **Node.js**: v16.x or later
- **npm**: v8.x or later
- **Git**: Latest version recommended
- **PHP**: v7.4 or later
- **MySQL**: v5.7 or later
- **WordPress**: v6.0 or later

### Local WordPress Setup

We recommend using Local by Flywheel for WordPress development:

1. **Install Local**: Download from [localwp.com](https://localwp.com)
2. **Create a new site**:
   - Site name: FitCopilot
   - Environment: Development
   - WordPress: Latest version
   - PHP: 7.4 or higher
   - Web server: Nginx (preferred) or Apache
   - MySQL: Latest version

3. **Configure site**:
   - Enable SSL for local development
   - Set up a custom domain (e.g., `fitcopilot.local`)

### Theme Installation

There are two methods to install the theme for local development:

#### Method 1: Direct Clone (Preferred)

1. Navigate to your WordPress themes directory:
   ```bash
   cd /path/to/local/sites/fitcopilot/app/public/wp-content/themes
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/fitcopilot/fitcopilot-theme.git
   cd fitcopilot-theme
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

#### Method 2: Symbolic Link

1. Clone the repository to your preferred location:
   ```bash
   git clone https://github.com/fitcopilot/fitcopilot-theme.git
   cd fitcopilot-theme
   npm install
   ```

2. Create a symbolic link to the WordPress themes directory:
   ```bash
   # macOS/Linux
   ln -s /absolute/path/to/fitcopilot-theme /path/to/wordpress/wp-content/themes/fitcopilot
   
   # Windows (Command Prompt as Administrator)
   mklink /D "C:\path\to\wordpress\wp-content\themes\fitcopilot" "C:\absolute\path\to\fitcopilot-theme"
   ```

3. Activate the theme in WordPress admin (Appearance > Themes)

### Development Scripts

The theme includes several npm scripts for development:

```bash
# Start the development server with hot reloading
npm run dev

# Build the theme for production
npm run build

# Run tests
npm test

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

## Development Process

### Code Standards

We follow these coding standards:

1. **TypeScript**: Follow the [TypeScript Style Guide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md)
2. **React**: Follow the [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
3. **SCSS**: Follow the [SASS Guidelines](https://sass-guidelin.es/)
4. **PHP**: Follow the [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)

Our ESLint and Prettier configurations enforce these standards automatically.

### Git Workflow

We use a feature branch workflow:

1. **Main Branches**:
   - `main`: Production-ready code
   - `develop`: Integration branch for feature work

2. **Supporting Branches**:
   - `feature/feature-name`: New features
   - `bugfix/bug-name`: Bug fixes
   - `hotfix/fix-name`: Urgent production fixes
   - `release/version`: Release preparation

3. **Branch Naming Conventions**:
   - Use kebab-case for all branch names
   - Prefix with branch type (feature, bugfix, etc.)
   - Be descriptive but concise
   - Include issue number if applicable

   Examples:
   ```
   feature/hero-animation
   bugfix/mobile-nav-overlap
   hotfix/security-vulnerability
   release/1.2.0
   ```

4. **Commit Message Format**:
   We follow [Conventional Commits](https://www.conventionalcommits.org/) format:

   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation only changes
   - `style`: Changes that do not affect the meaning of the code (formatting, etc.)
   - `refactor`: Code change that neither fixes a bug nor adds a feature
   - `perf`: Code change that improves performance
   - `test`: Adding missing tests or correcting existing tests
   - `build`: Changes to the build system or external dependencies
   - `ci`: Changes to CI configuration files and scripts
   - `chore`: Other changes that don't modify src or test files

   Example:
   ```
   feat(hero): add parallax scroll effect

   - Add intersection observer to track scroll position
   - Implement transform effect based on scroll position
   - Optimize performance with requestAnimationFrame

   Fixes #123
   ```

### Pull Request Process

1. **Create a Pull Request**:
   - Create a pull request from your feature branch to the `develop` branch
   - Use the provided PR template
   - Add appropriate labels
   - Assign reviewers

2. **PR Template**:
   Your PR should include:
   - Description of changes
   - Issue it resolves
   - Screenshots/GIFs of visual changes
   - Testing instructions
   - Checklist of completed items

3. **CI Checks**:
   All PRs must pass these automated checks:
   - Linting
   - Type checking
   - Unit tests
   - Build verification
   - Storybook build

4. **Approval Requirements**:
   - Requires at least one approval from a maintainer
   - All CI checks must pass
   - No unresolved conversations

### Code Review

Our code review process:

1. **Review Focus Areas**:
   - Code quality and readability
   - Adherence to project standards
   - Potential bugs or edge cases
   - Performance considerations
   - Accessibility
   - Security issues

2. **Review Guidelines**:
   - Be respectful and constructive
   - Focus on the code, not the person
   - Provide specific suggestions when possible
   - Consider the context and constraints
   - Approve only when all issues are addressed

3. **Review Response Expectations**:
   - Respond to review comments within 1-2 business days
   - Address all feedback or explain why it can't be addressed
   - Request re-review after making changes

## Testing

### Unit Testing

We use Jest and React Testing Library for unit tests:

1. **Test File Location**:
   Tests should be co-located with the components they test:
   ```
   src/
   ├── features/
   │   ├── HomePage/
   │   │   ├── Hero/
   │   │   │   ├── Hero.tsx
   │   │   │   ├── Hero.test.tsx  # Test file
   ```

2. **Running Tests**:
   ```bash
   # Run all tests
   npm test

   # Run tests in watch mode
   npm test -- --watch

   # Run tests with coverage
   npm test -- --coverage
   ```

3. **Test Coverage Requirements**:
   - Minimum 80% coverage for all new code
   - Critical components require 90%+ coverage

4. **Test Structure**:
   ```tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Hero } from './Hero';

   describe('Hero component', () => {
     it('renders the title correctly', () => {
       render(<Hero title="Test Title" />);
       expect(screen.getByText('Test Title')).toBeInTheDocument();
     });

     it('calls onClick when button is clicked', () => {
       const handleClick = jest.fn();
       render(<Hero onClick={handleClick} />);
       fireEvent.click(screen.getByRole('button'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
   });
   ```

### Integration Testing

For integration testing, we test components with their child components:

1. **Integration Test Focus**:
   - Component composition
   - Data flow between components
   - Event handling across components
   - Side effects

2. **Mocking External Dependencies**:
   - Mock API calls with MSW (Mock Service Worker)
   - Mock WordPress data contracts
   - Mock browser APIs when necessary

3. **Example Integration Test**:
   ```tsx
   import { render, screen, waitFor } from '@testing-library/react';
   import { Homepage } from './Homepage';
   import { mockWordPressData } from '../../test/mocks';

   // Setup mock for WordPress data
   window.fitcopilotData = mockWordPressData;

   describe('Homepage integration', () => {
     it('loads and displays content from all sections', async () => {
       render(<Homepage />);
       
       // Hero section
       expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
       
       // Features section
       await waitFor(() => {
         expect(screen.getByText(/key features/i)).toBeInTheDocument();
       });
       
       // Check all sections are rendered
       expect(screen.getByTestId('hero-section')).toBeInTheDocument();
       expect(screen.getByTestId('features-section')).toBeInTheDocument();
       expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
     });
   });
   ```

### Accessibility Testing

We prioritize accessibility testing:

1. **Automated Tools**:
   - Use jest-axe for automated a11y testing
   - Storybook a11y addon for visual components

2. **Manual Testing**:
   - Keyboard navigation testing
   - Screen reader testing (NVDA, VoiceOver)
   - Color contrast verification

3. **Example A11y Test**:
   ```tsx
   import { render } from '@testing-library/react';
   import { axe, toHaveNoViolations } from 'jest-axe';
   import { Button } from './Button';

   expect.extend(toHaveNoViolations);

   describe('Button accessibility', () => {
     it('should not have accessibility violations', async () => {
       const { container } = render(<Button>Click me</Button>);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
   });
   ```

### Performance Testing

We use Lighthouse CI to test performance:

1. **Performance Metrics**:
   - First Contentful Paint (FCP): < 1.8s
   - Largest Contentful Paint (LCP): < 2.5s
   - Time to Interactive (TTI): < 3.8s
   - Total Blocking Time (TBT): < 200ms
   - Cumulative Layout Shift (CLS): < 0.1

2. **Running Performance Tests**:
   ```bash
   npm run lighthouse
   ```

3. **Analyzing Results**:
   - Review reports in `.lighthouseci/` directory
   - Check CI results for each PR
   - Address all performance regressions

## Build Process

### Development Build

During development:

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **What Happens**:
   - Webpack runs in development mode
   - Files are compiled with source maps
   - Hot Module Replacement (HMR) is enabled
   - Browser auto-refreshes on changes
   - ESLint checks code on save

### Production Build

For production builds:

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **What Happens**:
   - Webpack runs in production mode
   - Files are minified and optimized
   - Code splitting is applied
   - Asset hashing for cache busting
   - Tree shaking removes unused code

3. **Output**:
   - `dist/`: Contains compiled JavaScript and CSS
   - `dist/assets/`: Contains optimized images and fonts
   - `dist/manifest.json`: Maps source files to output files

### Deployment

Deployment process:

1. **Merge to Main**:
   - Feature branches are merged to `develop` first
   - When ready for release, `develop` is merged to `main`

2. **GitHub Actions**:
   - Automated builds trigger on push to `main`
   - Tests run before deployment
   - Storybook is built and deployed

3. **Release Tagging**:
   ```bash
   git checkout main
   git pull origin main
   npm version minor  # or major, patch
   git push origin main --follow-tags
   ```

4. **WordPress Theme Deployment**:
   - Build the theme for production
   - ZIP the theme directory excluding development files
   - Upload to WordPress site or distribute

## Documentation

### Code Documentation

We use JSDoc for documenting code:

1. **Component Documentation**:
   ```tsx
   /**
    * Hero component displays the main banner section.
    *
    * @component
    * @param {HeroProps} props - Component props
    * @returns {JSX.Element} Rendered Hero component
    * @example
    * <Hero 
    *   title="Welcome" 
    *   subtitle="Start your fitness journey"
    *   variant="default"
    * />
    */
   export const Hero: React.FC<HeroProps> = ({ title, subtitle, variant = 'default' }) => {
     // Implementation
   };
   ```

2. **Type Documentation**:
   ```tsx
   /**
    * Props for the Hero component
    *
    * @typedef {Object} HeroProps
    * @property {string} title - The main heading text
    * @property {string} [subtitle] - Optional subheading text
    * @property {'default' | 'gym'} [variant='default'] - Visual variant
    */
   export interface HeroProps {
     title: string;
     subtitle?: string;
     variant?: 'default' | 'gym';
   }
   ```

3. **Function Documentation**:
   ```tsx
   /**
    * Fetches homepage data from WordPress
    *
    * @async
    * @function fetchHomepageData
    * @returns {Promise<HomepageData>} Homepage content data
    * @throws {Error} If the API request fails
    */
   export async function fetchHomepageData(): Promise<HomepageData> {
     // Implementation
   }
   ```

### Storybook

We use Storybook for component documentation:

1. **Running Storybook**:
   ```bash
   npm run storybook
   ```

2. **Creating Stories**:
   ```tsx
   // Button.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Button } from './Button';

   const meta: Meta<typeof Button> = {
     title: 'UI/Button',
     component: Button,
     parameters: {
       layout: 'centered',
     },
     argTypes: {
       variant: {
         options: ['primary', 'secondary', 'tertiary', 'ghost'],
         control: { type: 'select' },
       },
     },
   };

   export default meta;
   type Story = StoryObj<typeof Button>;

   export const Primary: Story = {
     args: {
       variant: 'primary',
       children: 'Primary Button',
     },
   };

   export const Secondary: Story = {
     args: {
       variant: 'secondary',
       children: 'Secondary Button',
     },
   };
   ```

3. **Documentation Pages**:
   ```mdx
   // Button.mdx
   import { Canvas, Meta, Story, ArgsTable } from '@storybook/blocks';
   import { Button } from './Button';
   import * as ButtonStories from './Button.stories';

   <Meta of={ButtonStories} />

   # Button

   The Button component is used to trigger actions.

   <Canvas>
     <Story of={ButtonStories.Primary} />
   </Canvas>

   ## Props

   <ArgsTable of={Button} />

   ## Variants

   <Canvas>
     <Story of={ButtonStories.Primary} />
     <Story of={ButtonStories.Secondary} />
     <Story of={ButtonStories.Tertiary} />
     <Story of={ButtonStories.Ghost} />
   </Canvas>
   ```

### API Documentation

API documentation is maintained in separate markdown files:

1. **API Reference**:
   - Complete reference in `docs/api-reference.md`
   - Component props, hooks, and WordPress integration

2. **WordPress Integration Docs**:
   - WordPress template documentation
   - REST API endpoints and data structures
   - Theme customizer options

3. **Keeping Documentation Updated**:
   - Update documentation with each PR
   - Run documentation checks as part of CI
   - Schedule regular documentation reviews

## Conclusion

Following this development workflow ensures consistency, quality, and efficiency across the FitCopilot theme codebase. For questions or clarifications, reach out to the project maintainers or check the project wiki. 