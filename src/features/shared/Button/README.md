# Button Component System

A comprehensive, type-safe button system that supports various button variants, themes, and layouts.

## Directory Structure

The Button component system follows a modular directory structure:

```
Button/
├── components/        # Button component implementations
│   ├── Button.tsx     # Base button component
│   ├── LinkButton.tsx # Link button variant
│   ├── ToggleButton.tsx # Toggle button variant  
│   ├── ButtonGroup.tsx # Button group container
│   └── index.ts       # Component exports
│
├── styles/            # Component styles
│   ├── Button.scss    # Button styles
│   ├── ButtonGroup.scss # ButtonGroup styles
│   └── index.scss     # Style exports
│
├── types/             # Type definitions
│   ├── buttonTypes.ts # Button type definitions
│   └── index.ts       # Type exports
│
├── __fixtures__/      # Test fixtures
│   └── buttonFixtures.ts # Button test fixtures
│
├── __tests__/         # Test files
│   ├── Button.test.tsx
│   ├── LinkButton.test.tsx
│   ├── ToggleButton.test.tsx
│   ├── ButtonGroup.test.tsx
│   └── ...            # Other test files
│
├── __stories__/       # Storybook stories
│   └── ButtonGroup.stories.mdx
│
├── docs/              # Documentation
│   ├── MIGRATION.md   # Migration guide
│   ├── SUMMARY.md     # Component summary
│   └── TEST-COVERAGE-REPORT.md # Test coverage documentation
│
└── index.ts           # Main module exports
```

## Usage

Import the Button components from the main export:

```tsx
import { Button, LinkButton, ToggleButton, ButtonGroup } from '@features/shared/Button';
```

## Button Variants

The Button system supports multiple variants:

- **Button**: Standard button component
- **LinkButton**: Button rendered as a link
- **ToggleButton**: Button with toggle state
- **ButtonGroup**: Container for grouping buttons

## Theme Support

All button components support theming through CSS variables and can be customized based on the current theme.

## Documentation

For more detailed information, see the documentation files in the `docs/` directory:

- **MIGRATION.md**: Guide for migrating from legacy button implementations
- **SUMMARY.md**: Overview of the button component system
- **TEST-COVERAGE-REPORT.md**: Detailed test coverage information 