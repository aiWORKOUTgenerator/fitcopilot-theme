/**
 * Form validation utilities
 */

/**
 * Validator function type
 * Returns error message (string) if validation fails, null otherwise
 */
export type ValidatorFn = (value) => string | null;

/**
 * Required field validator
 */
export const required = (message = 'This field is required') =>
    (value) => {
        if (value === null || value === undefined) return message;

        if (typeof value === 'string' && value.trim() === '') return message;

        if (Array.isArray(value) && value.length === 0) return message;

        return null;
    };

/**
 * Min length validator
 */
export const minLength = (min, message) =>
    (value) =>
        !value || value.length < min
            ? message || `Minimum length is ${min} characters`
            : null;

/**
 * Max length validator
 */
export const maxLength = (max, message) =>
    (value) =>
        value && value.length > max
            ? message || `Maximum length is ${max} characters`
            : null;

/**
 * Email validator
 */
export const email = (message = 'Please enter a valid email address') =>
    (value) => {
        if (!value) return null;

        // Simple email regex, could be more comprehensive
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : message;
    };

/**
 * Pattern validator
 */
export const pattern = (regex, message) =>
    (value) => {
        if (!value) return null;

        return regex.test(value) ? null : message;
    };

/**
 * Min value validator
 */
export const min = (minValue, message) =>
    (value) =>
        value < minValue
            ? message || `Value must be at least ${minValue}`
            : null;

/**
 * Max value validator
 */
export const max = (maxValue, message) =>
    (value) =>
        value > maxValue
            ? message || `Value must be at most ${maxValue}`
            : null;

/**
 * Custom validator
 */
export const custom = (validationFn, message) =>
    (value) =>
        !validationFn(value) ? message : null;

/**
 * Compose multiple validators
 */
export const compose = (...validators) =>
    (value) => {
        for (const validator of validators) {
            const error = validator(value);
            if (error) return error;
        }
        return null;
    }; 