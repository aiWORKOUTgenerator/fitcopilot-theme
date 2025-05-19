/**
 * SelectField Component
 * 
 * A select field component using the standardized FieldWrapper for consistent layout.
 */

import React, { useCallback } from 'react';
import logger from '../../../../utils/logger';
import { SelectFieldProps } from '../types';
import FieldWrapper from './FieldWrapper';
import { filterComponentProps } from './FormField';

/**
 * SelectField component for dropdown selection
 */
const SelectField: React.FC<SelectFieldProps> = React.memo(({
  id,
  name,
  label,
  value,
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
  validators,
  ...otherProps
}) => {
  // Generate ID if not provided
  const fieldId = id || `field-${name}`;
  
  // Filter out component-only props
  const htmlProps = filterComponentProps(otherProps);
  
  // Event handlers with logging
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    logger.debug('SelectField changed', {
      name,
      value: e.target.value
    });
    onChange(e);
  }, [name, onChange]);
  
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
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        data-testid={testId || `select-${name}`}
        className="form-field__input form-field__select"
        {...htmlProps}
      >
        {placeholder && (
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
    </FieldWrapper>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField; 