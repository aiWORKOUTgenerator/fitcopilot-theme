---
sidebar_position: 1
---

# Component Overview

## Introduction

FitCopilot uses a structured component hierarchy to organize UI elements according to their purpose and complexity. This approach ensures consistency, reusability, and maintainability across the application.

## Component Classification

Our components are categorized into three main types:

### Layout Components

Layout components provide structure without business logic. They define the overall page layout and structure but don't contain application-specific functionality.

**Examples:**
- `PageLayout`
- `Container`
- `Grid`
- `Section`

[View Layout Components →](./layout/overview.md)

### Feature Components

Feature components contain application-specific functionality and business logic. They typically correspond to a specific feature or domain in the application.

**Examples:**
- `Homepage/Hero`
- `Homepage/Features`
- `Workout/WorkoutCard`

[View Feature Components →](./features/overview.md)

### UI Components

UI components are reusable presentation elements with minimal or no business logic. They form the building blocks of the user interface.

**Examples:**
- `Button`
- `Card`
- `Input`
- `Badge`

[View UI Components →](./ui/overview.md)

## Component Documentation

Each component in the documentation includes:

1. **Overview**: A brief description of the component and its purpose
2. **Props**: Interface definition and description of each prop
3. **Usage**: Examples of how to use the component
4. **Variations**: Different variations or configurations of the component
5. **Accessibility**: Accessibility considerations and requirements

## Component Development Guidelines

When developing new components:

1. **Determine the category**: Decide whether it's a layout, feature, or UI component
2. **Follow naming conventions**: Use PascalCase for component names
3. **Document props**: Define a clear TypeScript interface with comments
4. **Add JSDoc comments**: Include description, usage, and examples
5. **Create Storybook stories**: Provide interactive examples

## Storybook Integration

All components are documented and showcased in Storybook, which provides:

- Interactive examples
- Prop documentation
- Different component states
- Accessibility testing

[View Storybook Documentation →](./storybook/integration.md) 