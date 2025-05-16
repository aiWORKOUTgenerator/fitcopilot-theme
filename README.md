# Token Compliance Boilerplate

This branch serves as a boilerplate for achieving 100% token compliance across our codebase. It includes fully tokenized Hero components and documentation to help you tokenize other components.

## Getting Started

1. **Create your component branch**

   ```bash
   git checkout token-compliance/boilerplate
   git checkout -b token-compliance/your-component-name
   ```

2. **Check current compliance**

   ```bash
   npm run token-report:component src/path/to/your/component
   ```

3. **Follow the tokenization process outlined in the documentation**

   ```bash
   # Open the guide
   open docs/token-compliance-guide.md
   ```

## Available Scripts

- `npm run token-report` - Run compliance check on the entire codebase
- `npm run token-report:component src/path/to/component` - Check specific component
- `npm run token-report:generate` - Generate a Markdown report of current compliance
- `npm run token-report:hero` - Check Hero component (should be 100%)

## Documentation

- [Token Compliance Guide](docs/token-compliance-guide.md) - Step-by-step process for tokenizing components
- [Token Compliance Tasks](docs/token-compliance-tasks.md) - List of tasks and assignments
- [Reports](docs/reports/) - Generated compliance reports

## Reference Components

The following components have been fully tokenized and can be used as reference:

- `src/features/Homepage/Hero/Hero.scss` - 100% compliant
- `src/features/Homepage/Hero/components/HeroButton.scss` - 100% compliant

These components demonstrate proper token usage patterns for:
- Layout and positioning
- Colors and opacity
- Dimensions and spacing
- Transitions and animations
- Special values (auto, none, transparent, etc.)

## Token Definitions

All design tokens are defined in:
- `src/styles/design-system/_component-tokens.scss`

## Pull Request Process

1. Ensure 100% token compliance for your component
2. Fill out the token compliance checklist in the PR description
3. Include before/after compliance scores
4. Request review from the design systems team

## Need Help?

Refer to the Hero component implementation and the [Token Compliance Guide](docs/token-compliance-guide.md). If you're still stuck, reach out in the #design-system Slack channel.

## Definition of Done

A component is considered fully tokenized when:
1. The token compliance script shows 100% compliance
2. Visual regression tests pass
3. Code review has been completed
4. The PR has been merged into develop

## ESLint Warning Reduction Toolkit

To improve code quality and ensure type safety across the codebase, we've implemented a comprehensive suite of tools, type definitions, and custom hooks to reduce ESLint warnings.

### Type Definitions

We've created several type definition files to ensure consistent typing across the application:

- **`src/types/events.ts`**: Type definitions for React event handlers
- **`src/types/components.ts`**: Common component props interfaces
- **`src/types/api.ts`**: API response type definitions

### Custom Hooks

We've developed several custom hooks to address common React patterns and avoid ESLint warnings:

- **`useEventCallback`**: Safely memoize callbacks while preserving the latest state and props
- **`useAsyncEffect`**: Safely handle async operations in useEffect with proper cleanup
- **`useIntersectionObserver`**: Detect when elements enter or leave the viewport

### Automation Tools

The following scripts have been developed to help identify and fix warnings:

```bash
# Analyze warnings and generate a report
node scripts/analyze-warnings.sh

# Fix explicit 'any' types
node scripts/fix-explicit-any.js

# Fix React hook dependency issues
node scripts/fix-react-hooks.js

# Fix unused variables by adding underscore prefix
node scripts/fix-unused-vars.js

# Generate a warnings reduction progress report
node scripts/generate-warnings-report.js
```

### ESLint Warnings Analysis Reports

Various reports are generated to help track progress:

- **`reports/eslint-warnings-categorized.json`**: Warnings categorized by rule
- **`reports/warning-priorities.json`**: Warnings prioritized by impact
- **`reports/ui-component-warnings.json`**: Warnings in UI components
- **`reports/feature-component-warnings.json`**: Warnings in feature components
- **`reports/warning-reduction-progress.md`**: Current warning reduction progress

### Best Practices

Follow these best practices to avoid introducing new ESLint warnings:

1. Use the provided type definitions for events and props
2. Use custom hooks like `useEventCallback` for event handlers
3. Ensure all dependencies are included in React hook dependency arrays
4. Add underscore prefix to intentionally unused variables
5. Replace `any` types with proper type definitions
6. Use the `unknown` type rather than `any` when the type is truly unknown
7. Always provide proper return types for functions
8. Use strongly typed component props with interfaces

## Code Quality and Type Safety

The FitCopilot theme uses several automated tools to maintain code quality and type safety:

### ESLint and Type Safety Checks

We enforce strict type safety rules through ESLint and TypeScript configurations. The following tools are available:

```bash
# Run ESLint
npm run lint

# Generate ESLint metrics report
npm run eslint:metrics

# Generate TypeScript type coverage report
npm run type:coverage

# Check specific files for new 'any' types (useful before PR submission)
npm run type:check-any src/file1.ts src/file2.tsx
```

Our CI/CD pipeline automatically enforces these rules by:
- Tracking ESLint warnings over time
- Measuring TypeScript type coverage
- Preventing introduction of new `any` types in PRs

For more details, see the [CI/CD Type Safety documentation](./docs/ci-type-safety.md). 