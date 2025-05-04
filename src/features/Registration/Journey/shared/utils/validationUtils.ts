/**
 * Validates if the array has at least the specified minimum number of items
 */
export const validateMinSelection = <T>(
    items: T[],
    min: number = 1
): boolean => {
    return items.length >= min;
};

/**
 * Validates if the array has no more than the specified maximum number of items
 */
export const validateMaxSelection = <T>(
    items: T[],
    max: number
): boolean => {
    return items.length <= max;
};

/**
 * Validates if the array has between min and max items (inclusive)
 */
export const validateSelectionRange = <T>(
    items: T[],
    min: number = 1,
    max: number
): boolean => {
    return items.length >= min && items.length <= max;
};

/**
 * Validates that at least one required field is filled
 */
export const validateRequiredField = (value: string | undefined): boolean => {
    return !!value && value.trim().length > 0;
};

/**
 * Validates all required fields are filled
 */
export const validateAllRequiredFields = (fields: (string | undefined)[]): boolean => {
    return fields.every(field => validateRequiredField(field));
};

/**
 * Validates selector data with a custom validation function
 */
export const validateSelectorData = <T>(
    data: T,
    validationFn: (data: T) => boolean
): boolean => {
    return validationFn(data);
}; 