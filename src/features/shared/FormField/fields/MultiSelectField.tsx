/**
 * MultiSelectField Component
 * 
 * A select field component that allows multiple selections using the standardized FieldWrapper.
 */

import React, { useCallback } from 'react';
import logger from '../../../../utils/logger';
import FieldWrapper from './FieldWrapper';
import { filterComponentProps } from './FormField';

// Define props interface for MultiSelectField
export interface MultiSelectFieldProps {
  /** Field type discriminator */
  fieldType: 'multiselect';
  /** Field ID */
  id?: string;
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Selected values */
  value: string[];
  /** Change handler */
  onChange: (selectedValues: string[]) => void;
  /** Blur event handler */
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  /** Focus event handler */
  onFocus?: React.FocusEventHandler<HTMLSelectElement>;
  /** Options array */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
  /** Whether the field is loading */
  isLoading?: boolean;
  /** Size of the select (number of visible options) */
  size?: number;
  /** Validators */
  _validators?: Array<(value: string[]) => string | null>;
}

/**
 * MultiSelectField component for selecting multiple options
 */
const MultiSelectField: React.FC<MultiSelectFieldProps> = React.memo(({
  id,
  name,
  label,
  value = [],
  onChange,
  onBlur,
  onFocus,
  options,
  placeholder,
  disabled = false,
  required = false,
  error,
  helperText,
  className,
  'data-testid': testId,
  isLoading = false,
  size = 5,
  _validators,
  ...otherProps
}) => {
  // Generate ID if not provided
  const fieldId = id || `field-${name}`;
  
  // Filter out component-only props
  const htmlProps = filterComponentProps(otherProps);
  
  // Handle change event and convert HTMLSelectElement selected options to string array
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    
    logger.debug('MultiSelectField changed', {
      name,
      value: selectedOptions
    });
    
    onChange(selectedOptions);
  }, [name, onChange]);
  
  // Handle blur event
  const handleBlur = useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
    if (onBlur) {
      onBlur(e);
    }
  }, [onBlur]);
  
  // Handle focus event
  const handleFocus = useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
    if (onFocus) {
      onFocus(e);
    }
  }, [onFocus]);
  
  return (
    <FieldWrapper
      id={fieldId}
      name={name}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
      isLoading={isLoading}
    >
      <select
        id={fieldId}
        name={name}
        multiple
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        required={required}
        size={size}
        data-testid={testId || `multiselect-${name}`}
        className="form-field__input form-field__select form-field__multiselect"
        aria-multiselectable="true"
        {...htmlProps}
      >
        {placeholder && value.length === 0 && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="form-field__multiselect-help">
        Hold Ctrl (or Cmd on Mac) to select multiple options
      </div>
    </FieldWrapper>
  );
});

// Add displayName for better debugging
MultiSelectField.displayName = 'MultiSelectField';

export default MultiSelectField; 