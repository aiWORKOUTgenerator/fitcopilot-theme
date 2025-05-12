/**
 * Form validation utilities
 */

/**
 * Validator function type
 * Returns error message (string) if validation fails, null otherwise
 */
export type ValidatorFn<T> = (value: T) => string | null;

/**
 * Required field validator
 */
export const required = <T>(message = 'This field is required'): ValidatorFn<T> =>
    (value: T): string | null => {
        if (value === null || value === undefined) return message;

        if (typeof value === 'string' && value.trim() === '') return message;

        if (Array.isArray(value) && value.length === 0) return message;

        return null;
    };

/**
 * Min length validator
 */
export const minLength = (min: number, message?: string): ValidatorFn<string> =>
    (value: string): string | null =>
        !value || value.length < min
            ? message || `Minimum length is ${min} characters`
            : null;

/**
 * Max length validator
 */
export const maxLength = (max: number, message?: string): ValidatorFn<string> =>
    (value: string): string | null =>
        value && value.length > max
            ? message || `Maximum length is ${max} characters`
            : null;

/**
 * Email validator
 */
export const email = (message = 'Please enter a valid email address'): ValidatorFn<string> =>
    (value: string): string | null => {
        if (!value) return null;

        // Simple email regex, could be more comprehensive
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : message;
    };

/**
 * Pattern validator
 */
export const pattern = (regex: RegExp, message: string): ValidatorFn<string> =>
    (value: string): string | null => {
        if (!value) return null;

        return regex.test(value) ? null : message;
    };

/**
 * Min value validator
 */
export const min = (minValue: number, message?: string): ValidatorFn<number> =>
    (value: number): string | null =>
        value < minValue
            ? message || `Value must be at least ${minValue}`
            : null;

/**
 * Max value validator
 */
export const max = (maxValue: number, message?: string): ValidatorFn<number> =>
    (value: number): string | null =>
        value > maxValue
            ? message || `Value must be at most ${maxValue}`
            : null;

/**
 * Custom validator
 */
export const custom = <T>(validationFn: (value: T) => boolean, message: string): ValidatorFn<T> =>
    (value: T): string | null =>
        !validationFn(value) ? message : null;

/**
 * Compose multiple validators
 */
export const compose = <T>(...validators: ValidatorFn<T>[]): ValidatorFn<T> =>
    (value: T): string | null => {
        for (const validator of validators) {
            const error = validator(value);
            if (error) return error;
        }
        return null;
    }; 