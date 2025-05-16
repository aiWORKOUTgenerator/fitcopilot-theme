/**
 * Checkbox Component
 * 
 * A checkbox component using the standardized type system.
 */

import React from 'react';
import { debug } from '../../../../utils/logger';
import { CheckboxFieldProps } from '../types';
import { filterComponentProps } from './FormField';

/**
 * Checkbox component for checkbox input fields
 */
const Checkbox: React.FC<CheckboxFieldProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error,
  helperText,
  className,
  'data-testid': testId,
  labelPosition = 'right',
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
    debug('Checkbox changed', {
      name,
      checked: e.target.checked
    });
    onChange(e);
  };
  
  // Generate CSS classes
  const fieldClasses = [
    'form-field',
    'form-field--checkbox',
    error ? 'form-field--error' : '',
    isLoading ? 'form-field--loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Custom rendering for checkbox with label positioning
  return (
    <div className={fieldClasses} data-testid={testId || `field-${name}`}>
      <div className={`form-field__checkbox-wrapper form-field__checkbox-wrapper--${labelPosition}`}>
        {labelPosition === 'left' && label && (
          <label htmlFor={fieldId} className="form-field__label">
            {label}
            {required && <span className="form-field__required">*</span>}
          </label>
        )}
        
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled || isLoading}
          required={required}
          data-testid={testId || `checkbox-${name}`}
          className="form-field__checkbox"
          aria-invalid={!!error}
          {...htmlProps}
        />
        
        {labelPosition === 'right' && label && (
          <label htmlFor={fieldId} className="form-field__label">
            {label}
            {required && <span className="form-field__required">*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <div id={`${fieldId}-error`} className="form-field__error" role="alert">
          {error}
        </div>
      )}
      
      {!error && helperText && (
        <div id={`${fieldId}-help`} className="form-field__helper-text">
          {helperText}
        </div>
      )}
      
      {isLoading && (
        <div className="form-field__loading" aria-hidden="true">
          <span className="form-field__loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default Checkbox; 