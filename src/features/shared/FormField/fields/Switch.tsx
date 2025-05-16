/**
 * Switch Component
 * 
 * A toggle switch component using the standardized type system.
 */

import React from 'react';
import { debug } from '../../../../utils/logger';
import { SwitchFieldProps } from '../types';
import { filterComponentProps } from './FormField';

/**
 * Switch component for toggle inputs
 */
const Switch: React.FC<SwitchFieldProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  onBlur,
  onFocus,
  onLabel,
  offLabel,
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
    debug('Switch changed', {
      name,
      checked: e.target.checked
    });
    onChange(e);
  };
  
  // Generate CSS classes
  const fieldClasses = [
    'form-field',
    'form-field--switch',
    error ? 'form-field--error' : '',
    isLoading ? 'form-field--loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={fieldClasses} data-testid={testId || `switch-${name}`}>
      <div className="form-field__switch-wrapper">
        {offLabel && <span className="form-field__switch-off">{offLabel}</span>}
        
        <label htmlFor={fieldId} className="form-field__switch-label">
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
            data-testid={`switch-input-${name}`}
            className="form-field__switch-input"
            aria-invalid={!!error}
            {...htmlProps}
          />
          <span className="form-field__switch-slider"></span>
          {label && (
            <span className="form-field__switch-text">
              {label}
              {required && <span className="form-field__required">*</span>}
            </span>
          )}
        </label>
        
        {onLabel && <span className="form-field__switch-on">{onLabel}</span>}
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

export default Switch; 