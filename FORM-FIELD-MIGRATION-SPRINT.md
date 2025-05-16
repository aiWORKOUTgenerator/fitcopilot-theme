# Sprint Plan: FormField System – Phase 1 Dependency Resolution (COMPLETED)

## Overview
This sprint focused on breaking the critical circular dependencies in the FormField component system. These dependency cycles were causing TypeScript errors and making the codebase difficult to maintain. By resolving these issues, we've established a solid foundation for the subsequent refactoring phases.

## Sprint Goal
✅ Break all circular dependencies in the FormField component system by restructuring the type definitions and validator functions into a more modular architecture.

## Completed Tasks

### ✅ 1. Create standalone validators.ts (Priority: CRITICAL)
**Description:** Restructured validators.ts to not depend on other FormField modules
**Status:** Completed
**Changes:**
- Ensured all validators have proper TypeScript type annotations
- Removed imports from types.ts, formState.ts, or useForm.ts
- Defined the ValidatorFn type in validators.ts to be the source of truth

### ✅ 2. Verify event types (Priority: CRITICAL)
**Description:** Verified the correct event types needed by FormField components
**Status:** Completed
**Changes:**
- Verified that `/types/events.ts` already contains all necessary event types
- Fixed import path in useForm.ts from '../../../types/_events' to '../../../types/events'

### ✅ 3. Fix formState.ts type errors (Priority: CRITICAL)
**Description:** Updated formState.ts to use proper TypeScript types and avoid circular dependencies
**Status:** Completed
**Changes:**
- Replaced `import { ValidatorFn } from './types'` with `import { ValidatorFn } from './validators'`
- Removed `import { runValidators } from './validation'`
- Implemented `runValidators` functionality directly in validateField to avoid the circular dependency
- Added proper TypeScript type annotations to all functions

### ✅ 4. Update types.ts to use standalone types (Priority: HIGH)
**Description:** Restructured types.ts to use validators.ts without creating cycles
**Status:** Completed
**Changes:**
- Replaced the ValidatorFn type definition with an import from validators.ts
- Maintained all other field type definitions

### ✅ 5. Update index.ts to export properly (Priority: HIGH)
**Description:** Updated index.ts to export from validators.ts instead of validation.ts
**Status:** Completed
**Changes:**
- Replaced `export * from './validation'` with `export * from './validators'`

### ✅ 6. Document deprecated code (Priority: MEDIUM)
**Description:** Created a deprecated.txt file to document that validation.ts should be removed
**Status:** Completed
**Changes:**
- Added deprecated.txt explaining that validation.ts is deprecated and should be removed in Phase 2
- Documented that the functionality has been moved to validators.ts with proper typing

## Remaining Type Issues
There are still some TypeScript errors in the files we modified, but these are related to type definitions and not to circular dependencies. These will be addressed in Phase 2:

1. Fixing the return type of getFormValues in formState.ts
2. Fixing the resetForm function in formReducer to properly use FieldState types
3. Addressing ESLint code style issues (indentation)

## Next Steps
Upon successful completion of Phase 1, we'll proceed to Phase 2: Consolidate Type Definitions, which will build upon these foundational changes to create a more consistent type system across the FormField components.

## Summary
The circular dependency issues have been successfully resolved, creating a clean separation between the various FormField modules. This provides a solid foundation for the subsequent refactoring phases where we'll focus on improving type safety and component consistency.

## FormField Migration Sprint Plan

## Overview

This sprint addresses technical debt by consolidating redundant form field components. We currently have duplicate implementations in the root FormField directory and in the fields subdirectory. This plan outlines the steps to migrate to the new component architecture.

## Goals

1. Remove redundant files (`FormField.tsx` and `TextField.tsx`) from the root of the FormField directory
2. Ensure all imports point to the new implementations
3. Update the module exports to maintain backward compatibility
4. Fix any testing issues resulting from the migration

## Tasks

### 1. Update Index Exports (1 hour)

Update the main `src/features/shared/FormField/index.ts` file to point to the new implementations:

```typescript
/**
 * FormField component exports
 */

// Main components
export { default as FormField } from './fields/FormField';
export { default } from './fields/FormField';
export { default as TextField } from './fields/TextField';

// Form hooks
export { useForm } from './useForm';
export type { UseFormOptions, UseFormReturn } from './useForm';

// Types
export * from './types';

// Validation
export * from './formState';
export * from './validation';

// Re-export field components for convenience
export * from './fields/TextField';
export * from './fields/TextareaField';
export * from './fields/SelectField';
export * from './fields/Checkbox';
export * from './fields/Radio';
export * from './fields/RadioGroup';
export * from './fields/Switch';
export * from './fields/DatePicker';
export * from './fields/FileUpload';
```

### 2. Fix TypeScript Errors (2 hours)

1. Fix the `fieldType` property error in fields components
2. Check component prop interfaces for consistency
3. Address `any` type issues in FormField implementations
4. Fix conditional React Hook errors

#### Example TypeScript Fixes:

In the fields components, ensure each field component correctly implements the required `fieldType` property:

```typescript
// For fields/TextField.tsx, fields/TextAreaField.tsx, etc.
// Add fieldType property to the component's prop handling
const { fieldType = 'text', ... } = props;
```

### 3. Update Test Files (2 hours)

1. Fix unit tests in `__tests__/FormField.test.tsx`
2. Update test imports to use the new component locations
3. Fix any broken assertions related to component rendering

### 4. Remove Redundant Files (30 minutes)

After ensuring all dependencies properly reference the new implementations:

1. Delete `src/features/shared/FormField/FormField.tsx`
2. Delete `src/features/shared/FormField/TextField.tsx`

### 5. Run Integration Tests (1 hour)

1. Run the full test suite to ensure no regressions
2. Check storybook examples for proper rendering
3. Verify that form examples still work correctly

### 6. Documentation Updates (1 hour)

1. Update component documentation in `docs/form-field-usage.md`
2. Add migration notes for any breaking changes
3. Update component examples to use the new structure

## Implementation Timeline

Total estimated effort: 7.5 hours

| Task | Duration | Dependencies |
|------|----------|--------------|
| Update Index Exports | 1 hour | None |
| Fix TypeScript Errors | 2 hours | Update Index Exports |
| Update Test Files | 2 hours | Fix TypeScript Errors |
| Remove Redundant Files | 30 minutes | Update Test Files |
| Run Integration Tests | 1 hour | Remove Redundant Files |
| Documentation Updates | 1 hour | Run Integration Tests |

## Rollback Plan

If issues are encountered:

1. Revert the deletion of the old files
2. Restore the original index.ts exports
3. Fix any immediate issues in the tests
4. Plan a more detailed migration approach

## Success Criteria

- All ESLint/TypeScript errors resolved
- All tests passing
- No runtime errors in form components
- Documentation updated to reflect new structure
- Storybook examples working correctly

## Implementation Notes

### Current Status (Phase 1)

1. ✅ Updated `index.ts` to point to the new components in the `fields` directory
2. ✅ Removed redundant files:
   - `src/features/shared/FormField/FormField.tsx`
   - `src/features/shared/FormField/TextField.tsx`
3. ⚠️ Test updates in progress:
   - Updated fixture files to include fieldType
   - Updated imports in test files

### Remaining Issues

1. Type mismatch in test files:
   - Tests are using old form types that don't match the new type system
   - FormFieldProps from old system doesn't include fieldType property
   - Need to update all test files to use the new type system

2. ESLint errors in `fields/FormField.tsx`:
   - Conditional React Hook calls need to be fixed
   - Unused variables ('variant', 'maxSize') should be prefixed with underscore
   - 'any' types should be replaced with proper types

3. Integration Test Failures:
   - TextField tests are failing due to AnalyticsContext import issues
   - Need to fix context dependencies in test utilities

### Next Steps

1. Update all remaining test files to use the new type system
2. Fix ESLint errors in FormField components
3. Address test utility dependencies 
4. Run comprehensive tests to ensure all functionality works 