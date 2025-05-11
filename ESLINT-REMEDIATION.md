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

## Progress Report (May 2025)

### Completed Tasks

We've successfully implemented the first phase of ESLint remediation:

1. **Structured Logger Implementation**
   - Created comprehensive logger utility in `src/utils/logger.ts`
   - Added support for different log levels (DEBUG, INFO, WARN, ERROR)
   - Implemented environment-aware logging (dev vs. production)
   - Added context support for component-specific logging

2. **React Hooks Violations Fixed**
   - Fixed all `react-hooks/rules-of-hooks` violations (0 remaining)
   - Resolved most `react-hooks/exhaustive-deps` issues (only 4 remaining)
   - Properly handled VideoPlayer component refs
   - Fixed dependency arrays across multiple hooks
   - Corrected CustomizationContext hooks
   - Modified useTooltipContent to handle dependencies properly
   - Implemented inline functions in ProgramCard useCallback

3. **Standardized Error Handling**
   - Added centralized error capturing via `logger.captureError`
   - Implemented proper error boundaries with fallback UI

### Remaining Issues

A comprehensive ESLint check has identified several remaining issues to address in future sprints:

1. **Unused Variables (60 errors)**
   - Component parameters without underscore prefix
   - Unused state variables and functions
   - Import statements for unused modules

2. **TypeScript Type Safety (97 warnings)**
   - `no-explicit-any` violations in component props
   - Untyped event handlers
   - API response types using `any`
   - Global type definitions needing refinement

3. **Debug Console Statements**
   - Remaining console statements in debug files
   - Special handling needed for development tools

4. **Syntax Errors**
   - Parsing issues in specific files:
     - `src/features/Homepage/Training/data/defaultData.ts`
     - `src/features/Registration/tests/analytics.test.tsx`

### Next Steps

The next phase will focus on:

1. **Type Safety Enhancement**
   - Create proper types for button events, props, and handlers
   - Eliminate all `any` types in component interfaces
   - Implement proper types for API responses

2. **Unused Variable Cleanup**
   - Prefix unused variables with underscore
   - Remove truly unused code
   - Fix variable naming to align with usage

3. **Final Console Statement Replacement**
   - Complete migration to logger in debug tools
   - Configure logger for development-only output

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