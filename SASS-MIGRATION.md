# SASS Migration Guide

## Overview
This project has migrated from legacy SASS `@import` to the modern `@use` directive. This document explains the new approach and best practices.

## Key Changes
- All `@import` directives for design system components have been replaced with `@use` directives
- Design system is now imported using absolute paths via webpack's `resolve.alias`
- All design system imports use the format: `@use "@/styles/design-system" as ds;`

## How It Works
The webpack configuration includes:
1. An alias `@` that points to the `src` directory
2. sass-loader configuration with `includePaths` set to include `src`

## Best Practices
1. Always place `@use` directives at the top of your SCSS files
2. Use namespace aliases consistently (e.g., `ds` for design system)
3. Reference design system tokens with the namespace: `ds.-name`

## Examples

**Before:**
```scss
@import '../../styles/design-system';

.my-component {
  color: -color;
}
```

**After:**
```scss
@use "@/styles/design-system" as ds;

.my-component {
  color: ds.-color;
}
```

## Troubleshooting
If you encounter issues with SASS imports:
1. Ensure your webpack config includes the correct alias and sass-loader configuration
2. Make sure all `@use` directives appear at the top of the file
3. Check that you're referencing variables with the correct namespace
