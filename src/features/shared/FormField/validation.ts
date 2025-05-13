/**
 * Form field validation utilities
 */


/**
 * Required field validator
 */
export const required = (errorMessage = 'This field is required') => {
    return (value) => {
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
export const minLength = (min, errorMessage) => {
    return (value) => {
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
export const maxLength = (max, errorMessage) => {
    return (value) => {
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
export const email = (errorMessage = 'Please enter a valid email address') => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (value) => {
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
export const numeric = (errorMessage = 'Please enter a valid number') => {
    return (value) => {
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
export const min = (minValue, errorMessage) => {
    return (value) => {
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
export const max = (maxValue, errorMessage) => {
    return (value) => {
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
    regex,
    errorMessage = 'Please enter a valid value'
) => {
    return (value) => {
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
export const custom = (
    validateFn,
    errorMessage
) => {
    return (value) => {
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
    maxSizeInBytes,
    errorMessage
) => {
    return (file) => {
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
    allowedTypes,
    errorMessage
) => {
    return (file) => {
        if (!file) return null;

        const fileType = file.type.toLowerCase();
        if (!allowedTypes.some(type => fileType.includes(type.toLowerCase()))) {
            return errorMessage || `File type must be one of: ${allowedTypes.join(', ')}`;
        }
        return null;
    };
};

/**
 * Run all validators on a value
 * Returns the first error message found, or null if all pass
 */
export const runValidators = (value, validators) => {
    if (!validators || validators.length === 0) return null;

    for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
    }

    return null;
}; 