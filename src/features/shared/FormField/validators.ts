/**
 * Form field validation utilities
 * 
 * This module provides validator factory functions that return type-safe
 * validator functions for different form field types.
 */

/**
 * Validation function type - returns error message or null if valid
 */
export type ValidatorFn<T = unknown> = (value: T, allValues?: Record<string, any>) => string | null;

/**
 * Validation result type for async validators
 */
export interface ValidationResult {
  pending?: boolean;
  message?: string;
  validate: () => Promise<string | null>;
}

/**
 * Async validation function type - returns a promise with error message or null if valid
 */
export type AsyncValidatorFn<T = unknown> = (value: T, allValues?: Record<string, any>) => Promise<string | null>;

/**
 * Required field validator
 */
export const required = (errorMessage = 'This field is required'): ValidatorFn => {
  return (value: unknown): string | null => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return errorMessage;
    }
    return null;
  };
};

/**
 * Minimum length validator for string values
 */
export const minLength = (min: number, errorMessage?: string): ValidatorFn<string> => {
  return (value: string): string | null => {
    if (!value) return null; // Skip if empty (use required validator for that)

    if (value.length < min) {
      return errorMessage || `Must be at least ${min} characters`;
    }
    return null;
  };
};

/**
 * Maximum length validator for string values
 */
export const maxLength = (max: number, errorMessage?: string): ValidatorFn<string> => {
  return (value: string): string | null => {
    if (!value) return null;

    if (value.length > max) {
      return errorMessage || `Must be no more than ${max} characters`;
    }
    return null;
  };
};

/**
 * Email format validator
 */
export const email = (errorMessage = 'Please enter a valid email address'): ValidatorFn<string> => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (value: string): string | null => {
    if (!value) return null;

    if (!emailRegex.test(value)) {
      return errorMessage;
    }
    return null;
  };
};

/**
 * Numeric value validator
 */
export const numeric = (errorMessage = 'Please enter a valid number'): ValidatorFn<string> => {
  return (value: string): string | null => {
    if (!value) return null;

    if (isNaN(Number(value))) {
      return errorMessage;
    }
    return null;
  };
};

/**
 * Minimum value validator for numeric strings
 */
export const min = (minValue: number, errorMessage?: string): ValidatorFn<string> => {
  return (value: string): string | null => {
    if (!value) return null;

    const numValue = Number(value);
    if (isNaN(numValue) || numValue < minValue) {
      return errorMessage || `Must be at least ${minValue}`;
    }
    return null;
  };
};

/**
 * Maximum value validator for numeric strings
 */
export const max = (maxValue: number, errorMessage?: string): ValidatorFn<string> => {
  return (value: string): string | null => {
    if (!value) return null;

    const numValue = Number(value);
    if (isNaN(numValue) || numValue > maxValue) {
      return errorMessage || `Must be no more than ${maxValue}`;
    }
    return null;
  };
};

/**
 * Pattern validator using regular expression
 */
export const pattern = (
  regex: RegExp,
  errorMessage = 'Please enter a valid value'
): ValidatorFn<string> => {
  return (value: string): string | null => {
    if (!value) return null;

    if (!regex.test(value)) {
      return errorMessage;
    }
    return null;
  };
};

/**
 * Custom validator function
 */
export const custom = <T>(
  validateFn: (value: T) => boolean,
  errorMessage: string
): ValidatorFn<T> => {
  return (value: T): string | null => {
    if (!validateFn(value)) {
      return errorMessage;
    }
    return null;
  };
};

/**
 * File size validator
 */
export const fileSize = (
  maxSizeInBytes: number,
  errorMessage?: string
): ValidatorFn<File> => {
  return (file: File): string | null => {
    if (!file) return null;

    if (file.size > maxSizeInBytes) {
      const maxSizeMB = Math.round(maxSizeInBytes / (1024 * 1024) * 10) / 10;
      return errorMessage || `File size must be less than ${maxSizeMB} MB`;
    }
    return null;
  };
};

/**
 * File type validator
 */
export const fileType = (
  allowedTypes: string[],
  errorMessage?: string
): ValidatorFn<File> => {
  return (file: File): string | null => {
    if (!file) return null;

    const fileType = file.type.toLowerCase();
    if (!allowedTypes.some((type: string) => fileType.includes(type.toLowerCase()))) {
      return errorMessage || `File type must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
  };
};

/**
 * Async validator wrapper
 * Returns a ValidationResult with a pending state and a promise to resolve the validation
 */
export const validateAsync = <T>(
  validatorFn: AsyncValidatorFn<T>,
  pendingMessage = 'Validating...'
): (value: T, allValues?: Record<string, any>) => ValidationResult => {
  return (value: T, allValues?: Record<string, any>): ValidationResult => {
    return {
      pending: true,
      message: pendingMessage,
      validate: async () => await validatorFn(value, allValues)
    };
  };
};

/**
 * Cross-field validation to check if fields match
 * Useful for password confirmation, email confirmation, etc.
 */
export const fieldsMatch = (
  sourceField: string,
  message: string
): ValidatorFn<string> => {
  return (value: string, allValues?: Record<string, any>): string | null => {
    if (!allValues || value !== allValues[sourceField]) {
      return message;
    }
    return null;
  };
};

/**
 * Validator for checking if a field is different from another field
 * Useful for scenarios where two fields must be different
 */
export const fieldsDiffer = (
  sourceField: string,
  message: string
): ValidatorFn<string> => {
  return (value: string, allValues?: Record<string, any>): string | null => {
    if (allValues && value === allValues[sourceField]) {
      return message;
    }
    return null;
  };
};

/**
 * Conditional validator that only runs if a condition is met
 */
export const validateIf = <T>(
  condition: (value: T, allValues?: Record<string, any>) => boolean,
  validator: ValidatorFn<T>
): ValidatorFn<T> => {
  return (value: T, allValues?: Record<string, any>): string | null => {
    if (condition(value, allValues)) {
      return validator(value, allValues);
    }
    return null;
  };
};

/**
 * Compose multiple validators into a single validator
 * Runs validators in sequence and returns the first error
 */
export const composeValidators = <T>(
  validators: Array<ValidatorFn<T>>
): ValidatorFn<T> => {
  return (value: T, allValues?: Record<string, any>): string | null => {
    for (const validator of validators) {
      const result = validator(value, allValues);
      if (result) {
        return result;
      }
    }
    return null;
  };
};

/**
 * Run all validators on a value
 * Returns the first error message found, or null if all pass
 */
export const runValidators = <T>(
  value: T, 
  validators: Array<ValidatorFn<T> | ((value: T, allValues?: Record<string, any>) => ValidationResult)>,
  allValues?: Record<string, any>
): string | null | ValidationResult => {
  if (!validators || validators.length === 0) return null;

  for (const validator of validators) {
    const result = validator(value, allValues);
    if (result) {
      // Check if it's a ValidationResult with pending state
      if (typeof result === 'object' && 'pending' in result) {
        return result;
      }
      // Otherwise it's a string error message
      return result;
    }
  }

  return null;
}; 