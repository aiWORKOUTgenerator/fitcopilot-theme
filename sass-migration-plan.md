# FitCopilot Sass Modernization Plan

## Overview

This document outlines the structured approach to modernize the Sass implementation in the FitCopilot theme, addressing the current warnings and ensuring compliance with best practices and architectural guidelines.

## Current Issues

1. **Deprecated `@import` Usage**: The Sass `@import` directive is deprecated and should be replaced with `@use` and `@forward` directives.
2. **Missing Canonical Design System Imports**: 38+ SCSS files are missing the required canonical design system import.
3. **Inconsistent Import Patterns**: Multiple patterns for importing styles across components.
4. **Variant System Implementation**: Inconsistent implementation of theme variant support.

## Migration Strategy

### Phase 1: Core Architecture Updates

1. **Update Core Design System Files**:
   - Convert `src/styles/design-system/index.scss` to use `@forward` instead of `@use`
   - Update all core token files to use `@use` and `@forward`
   - Create namespace-aware imports for better control

2. **Revise Base Style Files**:
   - Update `src/styles/app.scss`, `src/styles/homepage.scss`, and other base files
   - Convert `@import` to `@use` with proper namespacing
   - Establish clear loading order to prevent conflicts

### Phase 2: Component-by-Component Migration

1. **Update Homepage Feature Components**:
   - Address each homepage section with the canonical import
   - Convert `@import` to `@use` with appropriate relative paths
   - Ensure theme variants continue to function correctly
   
2. **Update Shared Components**:
   - Focus on button variants, tooltips, and other reusable components
   - Standardize import patterns with the correct namespacing

3. **Update Registration Flow Components**:
   - Address all missing canonical imports in Journey components
   - Ensure consistent structure across all registration steps

### Phase 3: Standardization

1. **Update Import Verification Script**:
   - Enhance the script to verify `@use` patterns, not just imports
   - Add checks for proper namespacing

2. **Documentation Updates**:
   - Update design system documentation with new import patterns
   - Provide clear examples of correct usage

## Implementation Details

### Core Files Update

```scss
// src/styles/design-system/index.scss - AFTER
// Design System - Single source of truth

// Color utilities
@forward './color-utils';

// Core tokens
@forward './colors-next'; // New color system
@forward './typography';
@forward './spacing';
@forward './radii';
@forward './shadows';
@forward './transitions';
@forward './backgrounds';
@forward './mixins';
@forward './breakpoints';

// Gradient system
@forward './tokens/gradients';

// Component-specific tokens
@forward './component-tokens';

// Component Base Styles
@forward './components';
```

### Component File Updates Pattern

```scss
// Before
@import '../../../styles/design-system/index';
@import './component-variables';

// After
// Canonical design system import - MUST BE FIRST
@use '../../../styles/design-system' as ds;
@use './component-variables' as vars;

.component {
  color: ds.$text-primary;
  background: vars.$component-bg;
}
```

### Homepage Section Example

```scss
// src/features/Homepage/Hero/Hero.scss - AFTER
// Canonical design system import - MUST BE FIRST
@use '../../../styles/design-system' as ds;
@use './hero-theme-variables' as hero;
@use '../../../components/UI/Button/hero/Button' as heroButton;
@use '../../../components/UI/Tooltip/variants/hero/Tooltip' as heroTooltip;

.hero-section {
  position: relative;
  overflow: hidden;
  padding: ds.$spacing-xl 0;
  
  // Rest of the styles
}
```

## Testing Strategy

1. **Visual Regression Testing**:
   - Verify all components render correctly after updates
   - Ensure theme variants still function properly

2. **Build Process Verification**:
   - Check for any Sass compilation warnings or errors
   - Measure any impact on build times or output size

3. **Cross-Browser Testing**:
   - Verify styling consistency across browsers

## Implementation Schedule

1. **Phase 1**: Core architecture updates (1-2 days)
2. **Phase 2**: Component updates (3-5 days, based on component count)
3. **Phase 3**: Standardization and documentation (1-2 days)

## Success Metrics

1. No Sass deprecation warnings during build
2. All SCSS files using the canonical design system import
3. Consistent import patterns across the codebase
4. Passing verification checks in the CI pipeline
5. No visual regression in the UI 