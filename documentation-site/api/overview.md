---
sidebar_position: 1
title: API Overview
description: Overview of the FitCopilot theme API
keywords: [api, overview, reference]
tags: [api, overview]
---

# API Overview

Welcome to the FitCopilot API documentation. This section provides comprehensive reference for all components, hooks, WordPress integration points, and utilities in the FitCopilot theme.

## Documentation Structure

The API documentation is organized into the following sections:

### Components

Documentation for all React components in the theme, categorized by type:

- [Feature Components](./components/feature-components.md) - Domain-specific components with business logic
- [UI Components](./components/ui-components.md) - Reusable, presentational elements without business logic
- [Layout Components](./components/layout-components.md) - Structural components for page layout

Each component is documented with its props, usage examples, and related information.

### Hooks

Documentation for custom React hooks:

- [Data Hooks](./hooks/data-hooks.md) - Hooks for data fetching and manipulation
- [UI Hooks](./hooks/ui-hooks.md) - Hooks for UI interactions and animations
- [WordPress Hooks](./hooks/wordpress-hooks.md) - Hooks for WordPress integration

Each hook is documented with its parameters, return values, and usage examples.

### WordPress Integration

Documentation for WordPress integration points:

- [Data Contracts](./wordpress/data-contracts.md) - Data structures passed between WordPress and React
- [REST Endpoints](./wordpress/rest-endpoints.md) - Custom REST API endpoints
- [Theme Customizer](./wordpress/theme-customizer.md) - Theme customizer options

### Utilities

Documentation for utility functions:

- [Formatters](./utils/formatters.md) - Functions for formatting data
- [Validators](./utils/validators.md) - Functions for validating data
- [Helpers](./utils/helpers.md) - Miscellaneous helper functions

## Using This Documentation

Each API reference page follows a consistent format:

1. **Description** - A brief description of the component, hook, or utility
2. **Import** - How to import it in your code
3. **Usage** - Basic usage examples
4. **API Reference** - Detailed documentation of props, parameters, and return values
5. **Examples** - More comprehensive examples of common use cases
6. **Related Documentation** - Links to related documentation

## TypeScript Support

All components, hooks, and utilities are fully typed with TypeScript. Type definitions are included in the documentation.

## Related Documentation

For more information on the architecture and development workflow, see:

- [Architecture Overview](../docs/architecture/overview.md)
- [Feature-First Approach](../docs/architecture/feature-first-approach.md)
- [Development Workflow](../docs/development/workflow.md)

## Search and Navigation

Use the search function at the top of the page to find specific components, hooks, or utilities. You can also use the sidebar to navigate through the different sections of the API documentation.

## Contributing

If you find any issues or would like to contribute to the API documentation, please see the [Contributing Documentation](../docs/contributing/documentation.md) guide. 