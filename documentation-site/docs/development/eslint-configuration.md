---
sidebar_position: 6
---

# ESLint Configuration

## Overview

FitCopilot implements ESLint for code quality assurance and standardization. This document outlines our ESLint configuration, installation process, and usage guidelines.

## Installation

The project includes all necessary ESLint dependencies in the `package.json`. When you clone the repository and run `npm install`, you'll automatically get:

```bash
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
eslint
eslint-plugin-react
eslint-plugin-react-hooks
eslint-plugin-storybook
```

## Configuration File

The ESLint configuration is defined in `.eslintrc.js` at the project root:

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Core ESLint rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off', // Handled by TypeScript
    
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Use TypeScript for prop validation
    'react/no-unescaped-entities': 'off', // Allow quotes in JSX
    
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

## Available Scripts

The project includes several npm scripts for linting:

- **`npm run lint`**: Lints all TypeScript and JavaScript files with tolerance for up to 20 warnings
- **`npm run lint-strict`**: Lints all files with zero warning tolerance (for CI/CD pipelines)
- **`npm run lint-stories`**: Specifically lints Storybook story files with zero warning tolerance
- **`npm run lint:fix`**: Lints all files and automatically fixes issues where possible

## Using ESLint in Development

### Editor Integration

For the best development experience, configure your editor to use ESLint:

- **VS Code**: Install the ESLint extension and enable auto-fix on save
- **WebStorm/IntelliJ**: Enable ESLint in Preferences → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint

### Pre-commit Validation

Before committing code:

1. Run `npm run lint` to check for issues
2. Fix any errors (warnings are acceptable within limits)
3. Run `npm run lint:fix` to automatically fix common issues

### Common Issues and Solutions

#### TypeScript `any` Type Usage

The configuration warns about using the `any` type. To resolve:

- Replace `any` with more specific types
- Use `unknown` when the type isn't known but needs type checking
- Use type inference when possible

#### React Props Validation

We use TypeScript interfaces for props validation instead of PropTypes:

```typescript
interface ButtonProps {
  label: string;
  onClick?: () => void;
  primary?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, primary = false }) => {
  // Component implementation
};
```

## Customizing ESLint Rules

If you need to disable a rule for a specific line or file:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();

// Or for a whole file
/* eslint-disable react/no-unescaped-entities */
```

## Continuous Integration

The ESLint configuration is part of our CI/CD pipeline. Pull requests will fail if they contain ESLint errors. Warnings are currently tolerated but should be addressed when possible. 