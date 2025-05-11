# ESLint Error Remediation Plan

This document outlines our approach to systematically address ESLint issues in the FitCopilot codebase.

## Project Structure

- `.eslintrc.js` - Main ESLint configuration
- `eslint-plugins/` - Custom ESLint rules
- `reports/` - ESLint reports and comparisons
- `scripts/` - Utility scripts for tracking and improving lint compliance

## Custom Logger

We've implemented a structured logger utility (`src/utils/logger.ts`) to replace direct `console` usage throughout the codebase. This provides several benefits:

- Environment awareness (development vs. production)
- Consistent formatting
- Log level management
- Improved debugging capabilities

## Key Commands

```bash
# Generate a baseline report
npm run lint:report

# Compare current state with baseline
npm run lint:compare

# Fix console statements automatically
npm run lint:fix-console

# General lint fixing
npm run lint:fix
```

## Bypassing Pre-commit Hooks (Emergency Only)

In emergency situations, pre-commit hooks can be bypassed with:

```bash
SKIP_LINT=1 git commit -m "Your message"
```

**Note:** This should be used only in rare situations and followed up with proper linting.

## Error Remediation Strategy

Our approach follows this order:

1. **Automated fixes** - Apply ESLint's built-in fixes
2. **Console statements** - Replace with appropriate logger calls
3. **TypeScript type issues** - Improve type safety and remove `any` types
4. **Unused variables** - Add proper underscore prefixes or remove
5. **Component-specific issues** - Fix remaining issues in key components

## Progress Tracking

We track progress using date-stamped reports in the `reports/` directory. Each report contains:

- Total error counts
- Breakdown by rule
- Files affected

## Contribution Guidelines

When fixing ESLint issues:

1. Understand the rule being violated
2. Run automated fixes first (`npm run lint:fix`)
3. Use the logger utility for console replacements
4. Add proper types instead of `any`
5. Validate your changes with `npm run lint`
6. Include relevant fixes in the appropriate sprint/PR

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/) 