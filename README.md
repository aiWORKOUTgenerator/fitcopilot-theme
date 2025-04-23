# FitCopilot Theme

A React/TypeScript WordPress theme for the AI Workout Generator project.

## Architecture

This theme follows a feature-first approach, organizing code based on features rather than file types. Components, hooks, styles, types, and tests are grouped together per feature.

### Component Classification
- **Layout Components**: Provide structure without business logic
- **Feature Components**: Self-contained application functionality
- **UI Components**: Reusable, presentational elements without logic
- **Composite Components**: Combine UI components with minimal logic

## File Structure

```
src/
├── features/                  # Application features
│   ├── Homepage/
│   │   ├── index.ts          # Main exports
│   │   ├── Homepage.tsx      # Container component
│   │   ├── Hero/             # Feature section
│   │   │   ├── index.ts
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.scss
│   │   │   ├── types.ts
│   │   │   └── components/   # Sub-components
│   │   ├── Features/         # Another section
│   │   ├── Journey/          # Another section
│   │   └── hooks/            # Feature-specific hooks
├── components/                # Shared UI components
│   └── UI/
│       ├── Button/           # Shared UI components
│       └── ...
├── hooks/                     # Shared custom hooks
├── utils/                     # Utility functions
├── types/                     # Global type definitions
├── styles/                    # Global styles and theme
└── api/                       # API integration layer
```

## Feature-Based Architecture Documentation

We have comprehensive documentation about our feature-based architecture:

- [Feature Architecture Guide](./docs/feature-architecture.md) - Detailed explanation of patterns and principles

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