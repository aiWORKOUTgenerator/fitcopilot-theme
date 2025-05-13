/**
 * Form hook for managing form state
 */

import { useCallback, useReducer } from 'react';
import { FormSubmitHandler, InputChangeHandler } from '../../../types/events';
import { createLoggedEventHandler } from '../../../utils/logger';
import {
    FormAction,
    FormState,
    createInitialFormState,
    getFormValues,
    validateField,
    validateForm
} from './formState';
import { ValidatorFn } from './types';

/**
 * Form state reducer
 */
const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'FIELD_CHANGE': {
            const { fieldName, value } = action;
            const field = state.fields[fieldName];

            if (!field) return state;

            // Update field with new value and mark as dirty
            const updatedField = validateField({
                ...field,
                value,
                dirty: true
            });

            // Check if any field has errors to determine form validity
            const fields = {
                ...state.fields,
                [fieldName]: updatedField
            };

            const hasErrors = Object.values(fields).some(f => !!f.error);

            return {
                ...state,
                fields,
                isValid: !hasErrors,
                isDirty: true
            };
        }

        case 'FIELD_BLUR': {
            const { fieldName } = action;
            const field = state.fields[fieldName];

            if (!field) return state;

            // Mark field as touched and validate
            const updatedField = validateField({
                ...field,
                touched: true
            });

            return {
                ...state,
                fields: {
                    ...state.fields,
                    [fieldName]: updatedField
                }
            };
        }

        case 'FIELD_FOCUS': {
            // No state changes needed for focus, but kept for completeness
            return state;
        }

        case 'VALIDATE_FIELD': {
            const { fieldName } = action;
            const field = state.fields[fieldName];

            if (!field) return state;

            // Validate single field
            const validatedField = validateField({
                ...field,
                validating: true
            });

            const fields = {
                ...state.fields,
                [fieldName]: validatedField
            };

            const hasErrors = Object.values(fields).some(f => !!f.error);

            return {
                ...state,
                fields,
                isValid: !hasErrors
            };
        }

        case 'VALIDATE_ALL': {
            // Validate all fields
            return validateForm(state);
        }

        case 'SUBMIT_START': {
            return {
                ...state,
                isSubmitting: true,
                error: null
            };
        }

        case 'SUBMIT_SUCCESS': {
            return {
                ...state,
                isSubmitting: false,
                isSubmitted: true
            };
        }

        case 'SUBMIT_ERROR': {
            return {
                ...state,
                isSubmitting: false,
                error: action.error
            };
        }

        case 'RESET_FORM': {
            // Reset to initial values but keep validators
            const resetFields: Record<string, unknown> = {};

            Object.entries(state.fields).forEach(([fieldName, field]) => {
                resetFields[fieldName] = {
                    ...field,
                    value: field.value, // Keep initial value
                    touched: false,
                    dirty: false,
                    error: null,
                    validating: false
                };
            });

            return {
                fields: resetFields,
                isValid: true,
                isDirty: false,
                isSubmitting: false,
                isSubmitted: false,
                error: null
            };
        }

        case 'SET_FORM_ERROR': {
            return {
                ...state,
                error: action.error
            };
        }

        default:
            return state;
    }
};

/**
 * Form hook options
 */
export interface UseFormOptions<T extends Record<string, unknown>> {
    /** Initial form values */
    initialValues: T;
    /** Field validators */
    validators?: Partial<Record<keyof T, Array<ValidatorFn<unknown>>>>;
    /** Callback on successful form submission */
    onSubmit?: (values: T) => void | Promise<void>;
    /** Validate on change */
    validateOnChange?: boolean;
    /** Validate on blur */
    validateOnBlur?: boolean;
}

/**
 * Form hook return value
 */
export interface UseFormReturn<T extends Record<string, unknown>> {
    /** Current form state */
    formState: FormState;
    /** Get current form values */
    values: T;
    /** Register field props */
    register: (fieldName: keyof T) => {
        name: string;
        value: unknown;
        onChange: InputChangeHandler;
        onBlur: React.FocusEventHandler<HTMLInputElement>;
        error: string | null;
    };
    /** Handle form submission */
    handleSubmit: FormSubmitHandler;
    /** Reset form to initial state */
    resetForm: () => void;
    /** Set value for a specific field */
    setValue: (fieldName: keyof T, value: unknown) => void;
    /** Set error for a specific field */
    setError: (fieldName: keyof T, error: string | null) => void;
    /** Set form-level error */
    setFormError: (error: string | null) => void;
    /** Check if form is valid */
    isValid: boolean;
    /** Check if form is submitting */
    isSubmitting: boolean;
    /** Check if form has been submitted */
    isSubmitted: boolean;
    /** Form-level error */
    error: string | null;
}

/**
 * Custom hook for managing form state
 */
export function useForm<T extends Record<string, unknown>>(
    options: UseFormOptions<T>
): UseFormReturn<T> {
    const {
        initialValues,
        validators,
        onSubmit,
        validateOnChange = true,
        validateOnBlur = true
    } = options;

    // Create initial form state
    const initialFormState = createInitialFormState(
        initialValues,
        validators as Record<string, Array<ValidatorFn<unknown>>>
    );

    // Set up form reducer
    const [formState, dispatch] = useReducer(formReducer, initialFormState);

    // Get current values from form state
    const values = getFormValues<T>(formState);

    // Register field
    const register = useCallback((fieldName: keyof T) => {
        const field = formState.fields[fieldName as string];

        if (!field) {
            throw new Error(`Field ${String(fieldName)} is not registered in the form`);
        }

        // Create field props
        return {
            name: fieldName as string,
            value: field.value,
            onChange: createLoggedEventHandler(
                'FormField',
                `change:${String(fieldName)}`,
                (event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.type === 'checkbox'
                        ? event.target.checked
                        : event.target.value;

                    dispatch({
                        type: 'FIELD_CHANGE',
                        fieldName: fieldName as string,
                        value
                    });

                    if (validateOnChange) {
                        dispatch({
                            type: 'VALIDATE_FIELD',
                            fieldName: fieldName as string
                        });
                    }
                }
            ),
            onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                dispatch({
                    type: 'FIELD_BLUR',
                    fieldName: fieldName as string
                });

                if (validateOnBlur) {
                    dispatch({
                        type: 'VALIDATE_FIELD',
                        fieldName: fieldName as string
                    });
                }
            },
            error: field.touched ? field.error : null
        };
    }, [formState.fields, validateOnChange, validateOnBlur]);

    // Handle form submission
    const handleSubmit = useCallback<FormSubmitHandler>((event) => {
        // Prevent default form submission
        event.preventDefault();

        // Validate all fields
        dispatch({ type: 'VALIDATE_ALL' });

        // Check if form is valid
        const isValid = !Object.values(formState.fields).some(field => !!field.error);

        if (isValid) {
            dispatch({ type: 'SUBMIT_START' });

            try {
                // Get current values
                const currentValues = getFormValues<T>(formState);

                // Call onSubmit callback
                const result = onSubmit?.(currentValues);

                // Handle promise if returned
                if (result instanceof Promise) {
                    result
                        .then(() => {
                            dispatch({ type: 'SUBMIT_SUCCESS' });
                        })
                        .catch((error) => {
                            dispatch({
                                type: 'SUBMIT_ERROR',
                                error: error.message || 'Form submission failed'
                            });
                        });
                } else {
                    dispatch({ type: 'SUBMIT_SUCCESS' });
                }
            } catch (error) {
                dispatch({
                    type: 'SUBMIT_ERROR',
                    error: error instanceof Error ? error.message : 'Form submission failed'
                });
            }
        }
    }, [formState, onSubmit]);

    // Reset form
    const resetForm = useCallback(() => {
        dispatch({ type: 'RESET_FORM' });
    }, []);

    // Set value for a field
    const setValue = useCallback((fieldName: keyof T, value: unknown) => {
        dispatch({
            type: 'FIELD_CHANGE',
            fieldName: fieldName as string,
            value
        });
    }, []);

    // Set error for a field
    const setError = useCallback((fieldName: keyof T, error: string | null) => {
        const field = formState.fields[fieldName as string];

        if (!field) return;

        dispatch({
            type: 'FIELD_CHANGE',
            fieldName: fieldName as string,
            value: field.value
        });

        // This is a workaround to set error directly, since our reducer doesn't have a direct SET_ERROR action
        formState.fields[fieldName as string].error = error;
    }, [formState.fields]);

    // Set form-level error
    const setFormError = useCallback((error: string | null) => {
        dispatch({
            type: 'SET_FORM_ERROR',
            error
        });
    }, []);

    return {
        formState,
        values,
        register,
        handleSubmit,
        resetForm,
        setValue,
        setError,
        setFormError,
        isValid: formState.isValid,
        isSubmitting: formState.isSubmitting,
        isSubmitted: formState.isSubmitted,
        error: formState.error
    };
} 