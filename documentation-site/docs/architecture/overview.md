---
sidebar_position: 1
title: Architecture Overview
description: Overview of the FitCopilot theme architecture and design patterns
keywords: [architecture, overview, design patterns, structure]
tags: [architecture, overview]
---

# Architecture Overview

The FitCopilot theme follows a carefully designed architecture that prioritizes maintainability, scalability, and developer experience. This guide provides a high-level overview of the architectural approach and design patterns used in the theme.

## Core Architecture Principles

The architecture is built on these fundamental principles:

1. **Feature-First Organization**: Code is organized by business domain rather than technical type
2. **Component-Based Design**: UI elements are built as reusable, self-contained components
3. **Type Safety**: TypeScript is used throughout to ensure type safety and improve developer experience
4. **WordPress Integration**: Seamless integration with WordPress APIs and templates
5. **Theme Variants**: Support for multiple visual variants with consistent implementation

## Directory Structure

The theme follows this high-level directory structure:

```
fitcopilot-theme/
├── src/                      # Source code
│   ├── features/             # Feature modules
│   ├── components/           # Shared UI components
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript type definitions
│   ├── styles/               # Global styles
│   └── index.tsx             # Main entry point
├── dist/                     # Compiled output
├── assets/                   # Static assets
├── inc/                      # WordPress PHP includes
├── includes/                 # WordPress theme functionality
├── *.php                     # WordPress template files
└── package.json              # Project dependencies
```

## Feature-First Architecture

The core organizing principle is a feature-first approach, where code is structured around business features rather than technical types. This approach:

- Improves discoverability by grouping related code
- Enhances maintainability by encapsulating feature logic
- Supports better scalability as the application grows

Learn more in the [Feature-First Approach](./feature-first-approach.md) guide.

## Component Classification

Components in the theme are classified into distinct categories:

1. **UI Components**: Reusable, presentational elements without business logic
2. **Layout Components**: Structural components for page layout
3. **Feature Components**: Domain-specific components with business logic
4. **Composite Components**: Combinations of UI components with minimal logic

This classification helps maintain separation of concerns and promotes reusability. See the [Component Model](./component-model.md) for more details.

## Theme Variants System

The theme supports multiple visual variants (default, gym) that can be selected in the WordPress customizer. This system:

- Maintains consistent implementation across variants
- Provides clear separation of variant-specific code
- Makes it easy to add new variants

The [Theme Variants](./variant-system.md) guide explains this system in detail.

## State Management

State management follows these principles:

- **Local Component State**: For UI-specific state
- **Custom Hooks**: For shared state and logic
- **Context API**: For global state when needed
- **Data Fetching**: Abstracted through custom hooks

See the [State Management](./state-management.md) guide for more information.

## WordPress Integration

WordPress integration is achieved through:

- **Enqueued Scripts**: Loading React application in WordPress
- **Data Localization**: Passing WordPress data to React
- **REST API**: Communication between React and WordPress
- **Theme Templates**: WordPress templates that serve as entry points

Learn more in the [WordPress Integration](../wordpress/overview.md) guide.

## Styling Approach

The theme uses a combination of:

- **SCSS Modules**: For component-specific styling
- **CSS Variables**: For theme tokens and customization
- **BEM Methodology**: For CSS class naming
- **Responsive Design**: Mobile-first approach

Read more in the [Styling Approach](./styling.md) guide.

## Relationship Diagram

The following diagram illustrates the relationships between different parts of the architecture:

```
┌─────────────────────────────────────────────────┐
│                WordPress Layer                   │
│                                                  │
│  ┌───────────┐    ┌───────────┐    ┌──────────┐  │
│  │  Template │    │    PHP    │    │  REST API │  │
│  │   Files   │    │  Functions│    │ Endpoints │  │
│  └─────┬─────┘    └─────┬─────┘    └─────┬────┘  │
└────────┼───────────────┼────────────────┼────────┘
          │               │                │        
┌─────────┼───────────────┼────────────────┼────────┐
│         ▼               ▼                ▼        │
│  ┌─────────────────────────────────────────────┐  │
│  │             React Application               │  │
│  └─────────────────────────────────────────────┘  │
│                        │                          │
│         ┌──────────────┼───────────────┐         │
│         │              │               │         │
│  ┌──────▼─────┐  ┌─────▼────┐  ┌──────▼─────┐   │
│  │  Features  │  │  Shared   │  │    Hooks   │   │
│  │            │  │Components │  │            │   │
│  └──────┬─────┘  └──────────┘  └────────────┘   │
│         │                                        │
│  ┌──────▼─────────────────────────────────┐      │
│  │  Feature-Specific Components & Logic   │      │
│  └────────────────────────────────────────┘      │
│                                                   │
│                React/TypeScript Layer             │
└───────────────────────────────────────────────────┘
```

## Next Steps

To dive deeper into specific aspects of the architecture:

- [Feature-First Approach](./feature-first-approach.md)
- [Component Model](./component-model.md)
- [Theme Variants System](./variant-system.md)
- [State Management](./state-management.md)
- [Styling Approach](./styling.md)

## Related Resources

:::tip Related Documentation
- [Development Workflow](../development/workflow.md)
- [WordPress Integration](../wordpress/overview.md)
- [API Reference](/api)
::: 