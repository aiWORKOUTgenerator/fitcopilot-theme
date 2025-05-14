# Test Remediation Project

## Overview

This directory contains documentation and tools to address test failures resulting from the ESLint remediation and type system enhancement efforts.

## Project Phases

### Phase 1: Analysis and Documentation (Completed)

The first phase involved analyzing structural changes to identify patterns and creating documentation to guide future remediation efforts. Key deliverables include:

- [Type Guard Migration Map](./type-guard-migration-map.md): Comprehensive mapping of type guard functions
- [Component Structure Analysis](./component-structure-analysis.md): Detailed component structure changes
- [Test Migration Guide](./test-migration-guide.md): Step-by-step guidance for test fixes
- [Phase 1 Analysis Summary](./phase1-analysis-summary.md): Executive summary of findings and recommendations

### Phase 2: Implementation (Planned)

The second phase will focus on implementing fixes based on the analysis from Phase 1:

1. Fix critical module issues
2. Create automated tooling for test updates
3. Address component-specific test issues
4. Implement bypasses for CI where necessary

## Tools

- [update-type-guard-imports.js](../scripts/update-type-guard-imports.js): Script to automatically update import paths

## Key Patterns Identified

1. **Type Guard Migration Pattern**:
   - Type guards moved from component types to `/utils/typeGuards/[component]TypeGuards.ts`
   - Consistent naming pattern: `is[Variant][Component]`

2. **Discriminator Property Pattern**:
   - `type` for fundamentally different HTML elements
   - `variant` for styling variations of the same base element

3. **Component Structure Changes**:
   - Enhanced type safety with discriminated unions
   - BEM-style CSS class naming
   - More robust prop handling

## How to Use This Documentation

1. Start with the [Phase 1 Analysis Summary](./phase1-analysis-summary.md) for a high-level overview
2. Reference the [Type Guard Migration Map](./type-guard-migration-map.md) when fixing import errors
3. Use the [Component Structure Analysis](./component-structure-analysis.md) to understand component changes
4. Follow the [Test Migration Guide](./test-migration-guide.md) for step-by-step fix instructions

## Getting Started with Fixes

```bash
# Run the import updater in dry-run mode first
node scripts/update-type-guard-imports.js --dry-run

# Apply changes to a specific directory
node scripts/update-type-guard-imports.js --path=src/features/shared/Media/__tests__

# Apply changes to the entire codebase
node scripts/update-type-guard-imports.js
```

## Common Issues and Solutions

### 1. Import Path Errors
```
TypeError: Cannot read properties of undefined (reading 'isImageMedia')
```
Solution: Update import paths using the import updater script or follow the Type Guard Migration Map.

### 2. Discriminator Property Errors
```
TypeError: Cannot read properties of undefined (reading 'variant')
```
Solution: Check if the component uses `type` or `variant` and update accordingly.

### 3. DOM Structure Changes
```
TestingLibraryElementError: Unable to find an element with the role "audio"
```
Solution: Update selectors based on the Component Structure Analysis document.

## Contributing

When fixing test issues, please:

1. Document any patterns you discover that aren't covered in the existing documentation
2. Update the import mappings in the update-type-guard-imports.js script if needed
3. Add fixed test patterns to the documentation for future reference 