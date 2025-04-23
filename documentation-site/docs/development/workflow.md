---
sidebar_position: 1
---

# Development Workflow

## Overview

This document outlines the recommended development workflow for the FitCopilot project. Following these guidelines helps ensure consistent code quality and provides a smooth development experience.

## Local Development Environment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/fitcopilot/fitcopilot-theme.git
   cd fitcopilot-theme
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This will watch for file changes and automatically compile the code.

4. **View in Browser**
   Open your WordPress site in the browser and navigate to a page that uses the theme.

## Development Process

### 1. Feature Development

For adding new features or components:

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Implement the Feature**
   - Create necessary files in the appropriate feature directory
   - Add tests and documentation

3. **Run Linting and Tests**
   ```bash
   # Run ESLint to check code quality
   npm run lint
   
   # Fix linting issues automatically where possible
   npm run lint:fix
   
   # Run story file linting
   npm run lint-stories
   ```

4. **Local Testing**
   - Test the feature in the browser
   - Check console for errors
   - Verify responsive behavior

### 2. Code Quality

#### ESLint Integration

We use ESLint to enforce code quality and consistency. Our setup includes:

- TypeScript-specific rules
- React best practices
- Accessibility checks
- Storybook integration

To use ESLint effectively:

- Run `npm run lint` to check for issues
- Use `npm run lint:fix` to automatically fix problems
- See [ESLint Configuration](./eslint-configuration.md) for detailed information

#### Code Reviews

All code should be reviewed before merging:

1. **Pull Request Creation**
   - Create a PR with a clear description of changes
   - Link to any related issues

2. **Code Review Checklist**
   - Code meets style guidelines
   - Tests are included and pass
   - Documentation is updated
   - No ESLint errors or warnings (run `npm run lint-strict` for verification)

### 3. Documentation

Always update documentation alongside code changes:

1. **Component Documentation**
   - Update or create Storybook stories
   - Add JSDoc comments to components and functions

2. **Generate Documentation**
   ```bash
   npm run docs:update
   ```

3. **Preview Documentation**
   ```bash
   npm run docs
   ```

### 4. Building for Production

When preparing for deployment:

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Test the Production Build**
   - Test performance and functionality
   - Verify that all assets are correctly loaded

## Continuous Integration

Our CI/CD pipeline automatically:

1. **Runs ESLint** to check code quality
2. **Builds the project** to ensure it compiles
3. **Runs tests** to verify functionality
4. **Builds documentation** and deploys to GitHub Pages

## Troubleshooting

### Common ESLint Issues

1. **TypeScript `any` Type**
   - Replace with more specific types
   - Use `unknown` when type isn't known but needs checking

2. **React JSX Issues**
   - Ensure proper component structure
   - Verify props validation

For more information, see the [ESLint Configuration](./eslint-configuration.md) document. 