/**
 * Validates if the array has at least the specified minimum number of items
 */
export const validateMinSelection = (
  items,
  min = 1
) => {
  return items.length >= min;
};

/**
 * Validates if the array has no more than the specified maximum number of items
 */
export const validateMaxSelection = (
  items,
  max
) => {
  return items.length <= max;
};

/**
 * Validates if the array has between min and max items (inclusive)
 */
export const validateSelectionRange = (
  items,
  min = 1,
  max
) => {
  return items.length >= min && items.length <= max;
};

/**
 * Validates that at least one required field is filled
 */
export const validateRequiredField = (value) => {
  return !!value && value.trim().length > 0;
};

/**
 * Validates all required fields are filled
 */
export const validateAllRequiredFields = (fields) => {
  return fields.every(field => validateRequiredField(field));
};

/**
 * Validates selector data with a custom validation function
 */
export const validateSelectorData = (
  data,
  validationFn
) => {
  return validationFn(data);
}; 