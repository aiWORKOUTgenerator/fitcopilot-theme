/**
 * DateField Component
 * 
 * A date field component using the standardized FieldWrapper for consistent layout.
 */

import React from 'react';
import { debug } from '../../../../utils/logger';
import { DateFieldProps } from '../types';
import FieldWrapper from './FieldWrapper';
import { filterComponentProps } from './FormField';

/**
 * DateField component for date input fields
 */
const DateField: React.FC<DateFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  min,
  max,
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debug('DateField changed', {
      name,
      value: e.target.value
    });
    onChange(e);
  };
  
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
      <div className="form-field__date-container">
        <input
          id={fieldId}
          name={name}
          type="date"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          data-testid={testId || `date-${name}`}
          className="form-field__input form-field__date"
          {...htmlProps}
        />
        <div className="form-field__date-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.5 1a.5.5 0 0 0-.5.5V2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-2V1.5a.5.5 0 0 0-1 0V2H5V1.5a.5.5 0 0 0-.5-.5zM2 14V5h12v9H2z" />
          </svg>
        </div>
      </div>
    </FieldWrapper>
  );
};

export default DateField; 