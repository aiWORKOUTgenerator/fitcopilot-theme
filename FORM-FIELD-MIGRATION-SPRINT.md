# FormField Migration Sprint Plan

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