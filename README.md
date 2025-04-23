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
│   │   ├── Hero/
│   │   │   ├── index.ts
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.styles.scss
│   │   │   ├── Hero.test.tsx
│   │   │   └── components/
│   │   └── index.ts
│   └── shared/
├── hooks/                      # Shared custom hooks
├── utils/                      # Utility functions
├── types/                      # Global type definitions
├── styles/                     # Global styles and theme
└── api/                        # API integration layer
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