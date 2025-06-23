/**
 * Form hook for managing form state
 */

import { useCallback, useMemo, useReducer } from 'react';
import { FormSubmitHandler } from '../../../types/events';
import {
  FieldState,
  FormState,
  createFieldState,
  createFormState,
  getFormValues,
  runValidators,
  validateFormState
} from './formState';
import { ValidatorFn } from './validators';

/**
 * Form action types
 */
type FormAction =
  | { type: 'SET_FIELD_VALUE'; fieldName: string; value: unknown }
  | { type: 'SET_FIELD_TOUCHED'; fieldName: string; touched: boolean }
  | { type: 'SET_FIELD_ERROR'; fieldName: string; error: string | null }
  | { type: 'VALIDATE_FIELD'; fieldName: string }
  | { type: 'VALIDATE_FORM' }
  | { type: 'SUBMIT_FORM' }
  | { type: 'SUBMIT_FORM_SUCCESS' }
  | { type: 'SUBMIT_FORM_ERROR'; error: string }
  | { type: 'RESET_FORM' }
  | { type: 'INITIALIZE_FIELD'; fieldName: string; value: unknown; validators?: Array<ValidatorFn<unknown>> };

/**
 * Form reducer to handle form state updates
 */
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
  case 'SET_FIELD_VALUE': {
    const { fieldName, value } = action;

    // Skip if field doesn't exist or value is the same
    if (!state.fields[fieldName] || state.fields[fieldName].value === value) {
      return state;
    }

    // Update field with new value
    const field = state.fields[fieldName];
    const updatedField: FieldState = {
      ...field,
      value,
      dirty: true,
      // Clear error when value changes
      error: null
    };

    // Validate field if it has validators
    const validatedField = field.validators?.length
      ? {
        ...updatedField,
        error: runValidators(value, field.validators as Array<ValidatorFn<unknown>>)
      }
      : updatedField;

    // Update state
    const updatedFields = {
      ...state.fields,
      [fieldName]: validatedField
    };

    // Check if any field is dirty
    const isDirty = Object.values(updatedFields).some(f => f.dirty);
      
    // Check if all fields are valid
    const isValid = !Object.values(updatedFields).some(f => Boolean(f.error));

    return {
      ...state,
      fields: updatedFields,
      isDirty,
      isValid
    };
  }

  case 'SET_FIELD_TOUCHED': {
    const { fieldName, touched } = action;

    // Skip if field doesn't exist or touched state is the same
    if (!state.fields[fieldName] || state.fields[fieldName].touched === touched) {
      return state;
    }

    // Update field
    const updatedFields = {
      ...state.fields,
      [fieldName]: {
        ...state.fields[fieldName],
        touched
      }
    };

    return {
      ...state,
      fields: updatedFields
    };
  }

  case 'SET_FIELD_ERROR': {
    const { fieldName, error } = action;

    // Skip if field doesn't exist or error is the same
    if (!state.fields[fieldName] || state.fields[fieldName].error === error) {
      return state;
    }

    // Update field
    const updatedFields = {
      ...state.fields,
      [fieldName]: {
        ...state.fields[fieldName],
        error
      }
    };

    // Check if all fields are valid
    const isValid = !Object.values(updatedFields).some(f => Boolean(f.error));

    return {
      ...state,
      fields: updatedFields,
      isValid
    };
  }

  case 'VALIDATE_FIELD': {
    const { fieldName } = action;

    // Skip if field doesn't exist
    if (!state.fields[fieldName]) {
      return state;
    }

    const field = state.fields[fieldName];
      
    // Skip if no validators
    if (!field.validators || field.validators.length === 0) {
      return state;
    }

    // Run validators
    const error = runValidators(field.value, field.validators as Array<ValidatorFn<unknown>>);

    // Skip if error is the same
    if (field.error === error) {
      return state;
    }

    // Update field
    const updatedFields = {
      ...state.fields,
      [fieldName]: {
        ...field,
        error
      }
    };

    // Check if all fields are valid
    const isValid = !Object.values(updatedFields).some(f => Boolean(f.error));

    return {
      ...state,
      fields: updatedFields,
      isValid
    };
  }

  case 'VALIDATE_FORM': {
    return validateFormState(state);
  }

  case 'SUBMIT_FORM': {
    // Validate all fields first
    const validatedState = validateFormState(state);

    return {
      ...validatedState,
      isSubmitting: validatedState.isValid,
      isSubmitted: false,
      error: null
    };
  }

  case 'SUBMIT_FORM_SUCCESS': {
    return {
      ...state,
      isSubmitting: false,
      isSubmitted: true,
      error: null
    };
  }

  case 'SUBMIT_FORM_ERROR': {
    return {
      ...state,
      isSubmitting: false,
      isSubmitted: false,
      error: action.error
    };
  }

  case 'RESET_FORM': {
    // Reset to initial values but keep validators
    const resetFields: Record<string, FieldState> = {};

    Object.entries(state.fields).forEach(([fieldName, field]) => {
      resetFields[fieldName] = createFieldState(field.value, field.validators);
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

  case 'INITIALIZE_FIELD': {
    const { fieldName, value, validators } = action;

    // Check if field already exists
    if (state.fields[fieldName]) {
      // Skip if value and validators are the same
      const currentField = state.fields[fieldName];
      if (
        currentField.value === value && 
          JSON.stringify(currentField.validators) === JSON.stringify(validators)
      ) {
        return state;
      }
    }

    // Create new field state
    const field = createFieldState(value, validators);

    // Update fields
    const updatedFields = {
      ...state.fields,
      [fieldName]: field
    };

    return {
      ...state,
      fields: updatedFields
    };
  }

  default:
    return state;
  }
}

/**
 * Form hook options
 */
export interface UseFormOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Initial form values */
  initialValues?: T;
  /** Field validators */
  validators?: {
    [K in keyof T]?: Array<ValidatorFn<T[K]>>;
  };
  /** Submit handler */
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Form hook return value
 */
export interface UseFormReturn<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Current form state */
  formState: FormState;
  /** Get current form values as object */
  values: T;
  /** Set field value */
  setFieldValue: <K extends keyof T>(fieldName: K, value: T[K]) => void;
  /** Set field touched state */
  setFieldTouched: (fieldName: keyof T, touched: boolean) => void;
  /** Set field error message */
  setFieldError: (fieldName: keyof T, error: string | null) => void;
  /** Validate a specific field */
  validateField: (fieldName: keyof T) => void;
  /** Validate entire form */
  validateForm: () => void;
  /** Initialize or update a field */
  initializeField: <K extends keyof T>(fieldName: K, value: T[K], validators?: Array<ValidatorFn<T[K]>>) => void;
  /** Submit the form */
  submitForm: FormSubmitHandler;
  /** Reset form to initial state */
  resetForm: () => void;
  /** Check if field has error */
  hasError: (fieldName: keyof T) => boolean;
  /** Get field error message */
  getFieldError: (fieldName: keyof T) => string | null;
  /** Check if field is touched */
  isTouched: (fieldName: keyof T) => boolean;
  /** Check if field is dirty (value changed) */
  isDirty: (fieldName: keyof T) => boolean;
}

/**
 * Custom hook for form state management
 */
export function useForm<T extends Record<string, unknown> = Record<string, unknown>>(
  options: UseFormOptions<T> = {}
): UseFormReturn<T> {
  const { initialValues = {} as T, validators = {}, onSubmit } = options;

  // Initialize form state
  const initialState = useMemo(() => {
    return createFormState(
      initialValues as Record<string, unknown>,
      validators as Record<string, Array<ValidatorFn<unknown>>>
    );
  }, [initialValues, validators]);

  // Create reducer
  const [formState, dispatch] = useReducer(formReducer, initialState);

  // Get current values
  const values = useMemo(() => {
    return getFormValues<T>(formState);
  }, [formState]);

  // Field value handler
  const setFieldValue = useCallback(<K extends keyof T>(fieldName: K, value: T[K]) => {
    dispatch({
      type: 'SET_FIELD_VALUE',
      fieldName: fieldName as string,
      value
    });
  }, []);

  // Field touched handler
  const setFieldTouched = useCallback((fieldName: keyof T, touched: boolean) => {
    dispatch({
      type: 'SET_FIELD_TOUCHED',
      fieldName: fieldName as string,
      touched
    });
  }, []);

  // Field error handler
  const setFieldError = useCallback((fieldName: keyof T, error: string | null) => {
    dispatch({
      type: 'SET_FIELD_ERROR',
      fieldName: fieldName as string,
      error
    });
  }, []);

  // Field validation
  const validateField = useCallback((fieldName: keyof T) => {
    dispatch({
      type: 'VALIDATE_FIELD',
      fieldName: fieldName as string
    });
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    dispatch({ type: 'VALIDATE_FORM' });
  }, []);

  // Initialize field
  const initializeField = useCallback(<K extends keyof T>(
    fieldName: K, 
    value: T[K], 
    fieldValidators?: Array<ValidatorFn<T[K]>>
  ) => {
    dispatch({
      type: 'INITIALIZE_FIELD',
      fieldName: fieldName as string,
      value,
      validators: fieldValidators as Array<ValidatorFn<unknown>>
    });
  }, []);

  // Form submission
  const submitForm = useCallback<FormSubmitHandler>(async (event) => {
    // Prevent default form submission
    if (event) {
      event.preventDefault();
    }

    // Submit action
    dispatch({ type: 'SUBMIT_FORM' });

    // Validate form
    dispatch({ type: 'VALIDATE_FORM' });

    // Get updated state after validation
    const updatedValues = getFormValues<T>(formState);

    // Check if form is valid
    if (!formState.isValid) {
      return;
    }

    // Submit handler
    if (onSubmit) {
      try {
        await onSubmit(updatedValues);
        dispatch({ type: 'SUBMIT_FORM_SUCCESS' });
      } catch (error) {
        dispatch({
          type: 'SUBMIT_FORM_ERROR',
          error: error instanceof Error ? error.message : 'An error occurred'
        });
      }
    } else {
      dispatch({ type: 'SUBMIT_FORM_SUCCESS' });
    }
  }, [formState, onSubmit]);

  // Reset form
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Utility functions
  const hasError = useCallback(
    (fieldName: keyof T) => 
      Boolean(formState.fields[fieldName as string]?.error),
    [formState]
  );

  const getFieldError = useCallback(
    (fieldName: keyof T) => 
      formState.fields[fieldName as string]?.error ?? null,
    [formState]
  );

  const isTouched = useCallback(
    (fieldName: keyof T) => 
      Boolean(formState.fields[fieldName as string]?.touched),
    [formState]
  );

  const isDirty = useCallback(
    (fieldName: keyof T) => 
      Boolean(formState.fields[fieldName as string]?.dirty),
    [formState]
  );

  // Return form handlers and state
  return {
    formState,
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateForm,
    initializeField,
    submitForm,
    resetForm,
    hasError,
    getFieldError,
    isTouched,
    isDirty
  };
} 