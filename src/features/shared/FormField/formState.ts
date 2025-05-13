/**
 * Form state management types and utilities
 */

import { ValidatorFn } from './types';
import { runValidators } from './validation';

/**
 * Field state type
 */
export interface FieldState {
    /** Field value */
    value: any;
    /** Whether the field has been touched (focused and blurred) */
    touched: boolean;
    /** Whether the field is currently dirty (value has changed) */
    dirty: boolean;
    /** Current validation error message, if any */
    error: string | null;
    /** Whether the field is currently being validated */
    validating: boolean;
    /** Validators for this field */
    validators?: ValidatorFn[];
}

/**
 * Form state type
 */
export interface FormState {
    /** Map of field names to field states */
    fields: Record<string, FieldState>;
    /** Whether the form is valid (no field errors) */
    isValid: boolean;
    /** Whether the form is dirty (any field value has changed) */
    isDirty: boolean;
    /** Whether the form is currently being submitted */
    isSubmitting: boolean;
    /** Whether the form has been submitted */
    isSubmitted: boolean;
    /** General form error message, if any */
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
 * Create initial field state
 */
export const createInitialFieldState = (
    value,
    validators
) => {
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
 * Create initial form state from fields
 */
export const createInitialFormState = (
    initialValues,
    validators
) => {
    const fields = {};

    // Create field states for each field
    Object.entries(initialValues).forEach(([fieldName, value]) => {
        fields[fieldName] = createInitialFieldState(
            value,
            validators?.[fieldName]
        );
    });

    return {
        fields,
        isValid: true,
        isDirty: false,
        isSubmitting: false,
        isSubmitted: false,
        error: null
    };
};

/**
 * Validate a single field
 */
export const validateField = (field) => {
    const { value, validators } = field;

    if (!validators || validators.length === 0) {
        return { ...field, error: null };
    }

    const error = runValidators(value, validators);

    return {
        ...field,
        error,
        validating: false
    };
};

/**
 * Validate all fields in a form
 */
export const validateForm = (formState) => {
    const validatedFields = {};
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

/**
 * Extract values from form state
 */
export const getFormValues = (
    formState
) => {
    const values = {};

    Object.entries(formState.fields).forEach(([fieldName, field]) => {
        values[fieldName] = field.value;
    });

    return values;
}; 