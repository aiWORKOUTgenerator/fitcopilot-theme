# FitCopilot Theme

A React/TypeScript WordPress theme for the AI Workout Generator project.

[![Documentation](https://github.com/fitcopilot/fitcopilot-theme/actions/workflows/documentation.yml/badge.svg)](https://github.com/fitcopilot/fitcopilot-theme/actions/workflows/documentation.yml)
[![Storybook](https://github.com/fitcopilot/fitcopilot-theme/actions/workflows/storybook.yml/badge.svg)](https://github.com/fitcopilot/fitcopilot-theme/actions/workflows/storybook.yml)
[![Lighthouse CI](https://github.com/fitcopilot/fitcopilot-theme/actions/workflows/lighthouse-ci.yml/badge.svg)](https://github.com/fitcopilot/fitcopilot-theme/actions/workflows/lighthouse-ci.yml)
[![Performance: 94/100](https://img.shields.io/badge/Performance-94%2F100-success)](https://fitcopilot.github.io/fitcopilot-theme/metrics/performance/overview)
[![Accessibility: 98/100](https://img.shields.io/badge/Accessibility-98%2F100-success)](https://fitcopilot.github.io/fitcopilot-theme/metrics/performance/overview)

## Architecture

This theme follows a feature-first approach, organizing code based on features rather than file types. Components, hooks, styles, types, and tests are grouped together per feature.

### Component Classification
- **Layout Components**: Provide structure without business logic
- **Feature Components**: Self-contained application functionality
- **UI Components**: Reusable, presentational elements without logic
- **Composite Components**: Combine UI components with minimal logic

### Feature-Based Organization

Features are organized according to these guidelines:

```
features/
├── FeatureName/               # Primary feature (e.g., Homepage)
│   ├── index.ts               # Exports the feature's public API
│   ├── FeatureName.tsx        # Main container component
│   ├── SectionName/           # Feature sections (e.g., Hero, Features, etc.)
│   │   ├── index.ts
│   │   ├── SectionName.tsx    # Section component implementation
│   │   ├── SectionName.scss   # Section-specific styles
│   │   ├── types.ts           # TypeScript definitions
│   │   └── components/        # Section-specific components
│   │       ├── ComponentName.tsx
│   │       ├── ComponentName.scss
│   │       └── index.ts
│   └── hooks/                 # Feature-specific hooks
│       ├── index.ts
│       └── useFeatureSpecificHook.ts
├── components/                # Shared UI components
│   └── UI/
│       ├── Button/            # Shared UI components
│       └── ...
├── hooks/                     # Shared custom hooks
├── utils/                     # Utility functions
├── types/                     # Global type definitions
└── styles/                    # Global styles and theme
```

For more detailed guidance on feature structure, see [src/features/README.md](src/features/README.md).

### Key Principles

1. **Feature Encapsulation**: Each feature is self-contained with minimal dependencies
2. **Single Responsibility**: Components have one clear purpose
3. **Clear Interfaces**: Features expose well-defined public APIs
4. **Domain-Driven**: Organization follows business domains, not technical types

### Import/Export Pattern

We use direct imports to maintain TypeScript compatibility:

```typescript
// In a feature's main index.ts
import Homepage from './Homepage';
export default Homepage;

// Direct imports for components
import { Hero } from './Hero';
export { Hero };
```

### Further Documentation

We have comprehensive documentation about our feature-based architecture:

- [Feature Architecture Guide](./docs/feature-architecture.md) - Detailed explanation of patterns and principles

## Current Project Structure

Below is the actual directory structure of the project, showing how the architectural principles have been implemented:

```
.
├── README.md
├── assets
│   └── images
│       └── logo.png
├── docs
│   └── feature-architecture.md
├── footer.php
├── functions.php
├── header.php
├── homepage-template.php
├── inc
│   └── react-enqueue.php
├── index.php
├── package-lock.json
├── package.json
├── postcss.config.js
├── src
│   ├── Homepage.tsx
│   ├── components
│   │   ├── Layout
│   │   └── UI
│   ├── features
│   │   ├── Homepage
│   │   └── README.md
│   ├── hooks
│   │   ├── useAnimation.ts
│   │   └── useWordPress.ts
│   ├── index.tsx
│   ├── styles
│   │   ├── animations.scss
│   │   ├── homepage.scss
│   │   ├── reset.scss
│   │   └── theme.scss
│   ├── types
│   │   └── wordpress.ts
│   └── utils
├── style.css
├── tailwind.config.js
├── tsconfig.json
└── webpack.config.js
```

The Homepage feature is structured as follows:

```
features/Homepage/
├── Features/               # Features section
│   ├── Features.scss
│   ├── Features.tsx
│   ├── components/
│   ├── index.ts
│   └── types.ts
├── Footer/                 # Footer section
├── Hero/                   # Hero section
├── Journey/                # Journey section
├── Pricing/                # Pricing section
├── Testimonials/           # Testimonials section
├── Homepage.tsx            # Main component
├── hooks/
│   ├── index.ts
│   └── useHomepageData.ts  # Feature-specific data hook
└── index.ts                # Public API exports
```

## Documentation System

The FitCopilot theme includes a comprehensive documentation system that provides detailed information about the codebase, components, and APIs.

[![Live Performance Dashboard](https://img.shields.io/badge/Live-Performance%20Dashboard-brightgreen)](https://fitcopilot.github.io/fitcopilot-theme/metrics/performance/overview)

### Documentation Structure

The documentation is organized into several sections:

- **Architecture Documentation**: Detailed information about the feature-based architecture
- **Component Documentation**: Interactive documentation of the component library via Storybook
- **API Reference**: Details of WordPress endpoints, React interfaces, and custom hooks
- **Quality Metrics**: Dashboard for tracking performance, code quality, and visual regression

### Accessing Documentation

You can access the documentation in several ways:

1. **Local Development**:
   ```
   # For Docusaurus documentation
   cd documentation-site
   npm start
   
   # For Storybook component documentation
   npm run storybook
   ```

2. **Deployed Documentation**:
   - Main Documentation: [https://fitcopilot.github.io/fitcopilot-theme/](https://fitcopilot.github.io/fitcopilot-theme/)
   - Storybook: [https://fitcopilot.github.io/fitcopilot-theme/storybook/](https://fitcopilot.github.io/fitcopilot-theme/storybook/)

### Documentation Technologies

The documentation system is built using:

- **[Docusaurus](https://docusaurus.io/)**: For comprehensive documentation
- **[Storybook](https://storybook.js.org/)**: For interactive component documentation
- **GitHub Actions**: For automated deployment
- **Lighthouse CI**: For performance metrics tracking

### Updating Documentation

Documentation should be updated alongside code changes:

1. **Component Changes**: Update corresponding Storybook stories
2. **API Changes**: Update the API reference documentation
3. **Architecture Changes**: Update the architecture documentation

Documentation is automatically deployed when changes are pushed to the main branch.

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Build

To build the project for production:
```
npm run build
```

## WordPress Integration

This theme uses the WordPress REST API for data fetching and integrates React/TypeScript for the frontend experience. 