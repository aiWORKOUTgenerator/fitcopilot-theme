# FitCopilot Technical Onboarding Guide

Welcome to the FitCopilot development team! This guide will help you set up your development environment and understand our project structure, development workflow, and best practices.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Environment Setup](#environment-setup)
3. [Codebase Structure](#codebase-structure)
4. [Development Workflow](#development-workflow)
5. [Tooling and Quality Gates](#tooling-and-quality-gates)
6. [Testing](#testing)
7. [WordPress Integration](#wordpress-integration)
8. [Common Issues and Solutions](#common-issues-and-solutions)
9. [Resources](#resources)

## Project Overview

FitCopilot is a React/TypeScript WordPress theme for generating AI workouts. The application follows a feature-first approach with a strong emphasis on component architecture, TypeScript typing, and accessibility.

### Key Technologies

- **Frontend**: React, TypeScript, SCSS
- **State Management**: React Context API
- **WordPress Integration**: REST API
- **Build Tools**: Webpack, Babel
- **Testing**: Jest, React Testing Library
- **Quality Assurance**: ESLint, Stylelint, TypeScript compiler

## Environment Setup

### Prerequisites

- Node.js (v16+)
- npm (v7+)
- Git
- Local WordPress development environment (e.g., Local by Flywheel, XAMPP, or Docker)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/fitcopilot-theme.git
cd fitcopilot-theme
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure WordPress Environment

1. Set up a local WordPress installation
2. Link the FitCopilot theme to your WordPress themes directory
3. Activate the theme in WordPress admin

### Step 4: Start Development Server

```bash
npm run dev
```

This will start a development server with hot reloading.

## Codebase Structure

Our project follows a feature-first approach to organizing code:

```
src/
├── features/                  # Application features
│   ├── Homepage/
│   │   ├── Hero/
│   │   │   ├── index.ts
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.styles.scss
│   │   │   ├── Hero.test.tsx
│   │   │   └── components/
│   │   └── index.ts
│   └── shared/
├── components/                # Shared UI components
│   ├── UI/
│   │   ├── Button/
│   │   ├── Card/
│   │   └── ...
├── hooks/                     # Shared custom hooks
├── utils/                     # Utility functions
├── types/                     # Global type definitions
├── styles/                    # Global styles and theme
├── api/                       # API integration layer
├── docs/                      # Project documentation
└── scripts/                   # Development and build scripts
```

### Component Classification

- **Layout Components**: Provide structure without business logic
- **Feature Components**: Self-contained application functionality
- **UI Components**: Reusable, presentational elements without logic
- **Composite Components**: Combine UI components with minimal logic

## Development Workflow

### 1. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - For new features
- `fix/` - For bug fixes
- `refactor/` - For code refactoring
- `docs/` - For documentation changes

### 2. Development Process

1. Plan your implementation
2. Implement the feature/fix
3. Write/update tests
4. Ensure your code meets our style and quality standards

### 3. Pre-commit Checks

Our repository uses Git hooks to ensure code quality:

- TypeScript type checking
- ESLint for JavaScript/TypeScript
- Stylelint for SCSS files

### 4. Submit a Pull Request

Follow our [Pull Request guidelines](./pull-request-template.md) when submitting your work for review.

## Tooling and Quality Gates

### Git Hooks

We use Husky to enforce quality checks before commits:

- Pre-commit hook: Runs linting and type checking
- Commit message format: Follows Conventional Commits specification

### Linting and Formatting

- **ESLint**: JavaScript/TypeScript linting
- **Stylelint**: SCSS linting
- **Prettier**: Code formatting

Run linting manually:

```bash
npm run lint        # Run ESLint
npm run lint:styles # Run Stylelint
npm run format      # Run Prettier
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Testing

We follow a component-centric testing approach:

- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Component interactions
- **Accessibility Tests**: Ensuring WCAG 2.1 AA compliance

Run tests:

```bash
npm test          # Run all tests
npm test -- --watch  # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## WordPress Integration

### REST API

We use the WordPress REST API for data fetching. All API endpoints are documented in our `api` directory.

### Theme Integration

Learn about how our React application integrates with WordPress in the [WordPress Integration Guide](./wordpress-integration.md).

### PHP Development

When working on the PHP side of the theme:

1. Follow WordPress coding standards
2. Use namespaced functions/classes with the `AWG_` prefix
3. Document template hierarchy and overrides

## Common Issues and Solutions

### "Cannot find module" Error

If you encounter module resolution issues:

```bash
npm clean-install
```

### WordPress API Connection Issues

Check your `wp-config.php` for proper REST API configuration and CORS settings.

### Hot Reloading Issues

Ensure your development server is running and check for console errors.

## Resources

- [Development Guide](./development-guide.md)
- [Component Standards](./component-standards.md)
- [Style Guide](./style-guide.md)
- [Contribution Guide](./contribution-guide.md)
- [Code Review Checklist](./code-review-checklist.md)

---

If you have any questions or need assistance, please reach out to the team lead or post in our development channel.

Welcome aboard! 