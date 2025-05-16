/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Form state management types and utilities
 */

import { ValidatorFn } from './validators';

/**
 * Field state type
 */
export interface FieldState {
    /** Field value */
    value: unknown;
    /** Whether the field has been touched (focused and blurred) */
    touched: boolean;
    /** Whether the field is currently dirty (value has changed) */
    dirty: boolean;
    /** Current validation error message, if any */
    error: string | null;
    /** Whether the field is currently being validated */
    validating: boolean;
    /** Validators for this field */
    validators?: Array<ValidatorFn<unknown>>;
}

/**
 * Form state type
 */
export interface FormState {
    /** Field states keyed by field name */
    fields: Record<string, FieldState>;
    /** Whether the form is valid (no errors) */
    isValid: boolean;
    /** Whether the form is dirty (any field has changed) */
    isDirty: boolean;
    /** Whether the form is currently submitting */
    isSubmitting: boolean;
    /** Whether the form has been submitted */
    isSubmitted: boolean;
    /** Form-level error message */
    error: string | null;
}

/**
 * Form action types
 */
export type FormAction =
    | { type: 'FIELD_CHANGE'; fieldName: string; value: unknown }
    | { type: 'FIELD_BLUR'; fieldName: string }
    | { type: 'FIELD_FOCUS'; fieldName: string }
    | { type: 'VALIDATE_FIELD'; fieldName: string }
    | { type: 'VALIDATE_ALL' }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string }
    | { type: 'RESET_FORM' }
    | { type: 'SET_FORM_ERROR'; error: string | null };

/**
 * Create a new field state
 */
export const createFieldState = (
  value: unknown,
  validators?: Array<ValidatorFn<unknown>>
): FieldState => {
  return {
    value,
    touched: false,
    dirty: false,
    error: null,
    validating: false,
    validators
  };
};

/**
 * Create a new form state
 */
export const createFormState = (
  fields: Record<string, unknown> = {},
  fieldValidators: Record<string, Array<ValidatorFn<unknown>>> = {}
): FormState => {
  const fieldState: Record<string, FieldState> = {};

  Object.entries(fields).forEach(([name, value]) => {
    fieldState[name] = createFieldState(value, fieldValidators[name]);
  });

  return {
    fields: fieldState,
    isValid: true,
    isDirty: false,
    isSubmitting: false,
    isSubmitted: false,
    error: null
  };
};

/**
 * Run validators on a field value
 */
export const runValidators = <T>(
  value: T,
  validators?: Array<ValidatorFn<T>>
): string | null => {
  if (!validators || validators.length === 0) {
    return null;
  }

  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }

  return null;
};

/**
 * Extract values from form state
 * @template T - Type of the returned values object
 * @param formState - The form state to extract values from
 * @returns An object with field values
 */
export const getFormValues = <T extends Record<string, unknown> = Record<string, unknown>>(
  formState: FormState
): T => {
  const values = {} as T;

  Object.entries(formState.fields).forEach(([fieldName, field]) => {
    // Use Object.defineProperty to handle potential symbol keys
    Object.defineProperty(values, fieldName, {
      value: field.value,
      enumerable: true,
      configurable: true
    });
  });

  return values;
};

/**
 * Check if a form state has any validation errors
 */
export const hasErrors = (formState: FormState): boolean => {
  // Check for form-level error
  if (formState.error) {
    return true;
  }

  // Check for field-level errors
  return Object.values(formState.fields).some(field => Boolean(field.error));
};

/**
 * Validate all fields in a form state
 */
export const validateFormState = (formState: FormState): FormState => {
  const validatedFields: Record<string, FieldState> = {};
  let isValid = true;

  Object.entries(formState.fields).forEach(([fieldName, field]) => {
    const error = runValidators(field.value, field.validators as Array<ValidatorFn<unknown>>);
    validatedFields[fieldName] = {
      ...field,
      error
    };

    if (error) {
      isValid = false;
    }
  });

  return {
    ...formState,
    fields: validatedFields,
    isValid
  };
};

/**
 * Validate a single field
 */
export const validateField = (field: FieldState): FieldState => {
  const { value, validators } = field;

  if (!validators || validators.length === 0) {
    return { ...field, error: null };
  }

  // Use runValidators from local implementation instead of importing
  let error: string | null = null;
  
  // Run validators until an error is found
  for (const validator of validators) {
    const validationError = validator(value);
    if (validationError) {
      error = validationError;
      break;
    }
  }

  return {
    ...field,
    error,
    validating: false
  };
};

/**
 * Validate all fields in a form
 */
export const validateForm = (formState: FormState): FormState => {
  const validatedFields: Record<string, FieldState> = {};
  let isValid = true;

  // Validate each field
  Object.entries(formState.fields).forEach(([fieldName, field]) => {
    const validatedField = validateField(field);
    validatedFields[fieldName] = validatedField;

    // Form is invalid if any field has an error
    if (validatedField.error) {
      isValid = false;
    }
  });

  return {
    ...formState,
    fields: validatedFields,
    isValid
  };
}; 