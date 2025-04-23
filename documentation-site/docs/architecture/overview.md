---
sidebar_position: 1
---

# Architecture Overview

## Introduction

The FitCopilot theme is built using a modern React/TypeScript architecture that integrates with WordPress. This architecture focuses on maintainability, scalability, and developer experience by organizing code into feature-based modules and leveraging React's component model.

## Key Architectural Principles

The architecture of FitCopilot is guided by the following principles:

1. **Feature-First Organization**: Code is organized by business domain rather than technical type.
2. **Component-Based Design**: UI is built from reusable, composable components.
3. **Type Safety**: TypeScript is used throughout the codebase to ensure type safety.
4. **Separation of Concerns**: Clear boundaries between presentation, application logic, and data access.
5. **WordPress Integration**: Seamless integration with WordPress APIs and templates.

## High-Level Architecture

The FitCopilot theme employs a hybrid architecture that combines WordPress themes with a React frontend:

```
FitCopilot Theme
├── WordPress Theme Files (PHP)
│   ├── Templates
│   ├── Functions
│   └── WordPress Hooks
└── React Application (TypeScript)
    ├── Features
    │   ├── Homepage
    │   └── [Other Features]
    ├── Components
    ├── Hooks
    └── Utils
```

### WordPress Integration

The WordPress side of the architecture handles:

- Theme setup and configuration
- Template rendering and WordPress hooks
- REST API endpoints for data access
- Enqueuing scripts and styles

### React Application

The React application manages:

- User interface components
- Client-side state management
- User interactions
- Data fetching from WordPress REST API

## Key Technical Decisions

### Frontend Framework
- **React**: Used for building the UI component hierarchy
- **TypeScript**: Provides type safety and better developer experience

### Build Tools
- **Webpack**: Bundles JavaScript, CSS, and other assets
- **Babel**: Transpiles modern JavaScript features
- **SASS**: Used for styling with variables and mixins

### State Management
- **React Hooks**: Manage component-level state
- **Context API**: For global state management where needed

### WordPress Integration
- **WordPress REST API**: Used for data exchange
- **WordPress Hooks System**: Extends WordPress functionality
- **Custom Endpoints**: For specialized data needs

## Development Workflow

The development workflow is designed to be efficient and maintainable:

1. **Local Development**: Using Docker or Local by Flywheel
2. **Build Process**: Webpack for bundling assets
3. **Type Checking**: TypeScript for static analysis
4. **Code Quality**: ESLint and Prettier for code quality

## Next Steps

For more detailed information about specific parts of the architecture, please refer to:

- [Feature Architecture](./feature-architecture.md): Details on the feature-based code organization
- [Component Model](./component-model.md): Information about the component hierarchy
- [State Management](./state-management.md): How state is managed across the application
- [Styling](./styling.md): Approach to styling and theming 