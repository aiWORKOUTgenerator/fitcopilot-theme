/**
 * RadioGroup Component
 * 
 * A radio button group component using the standardized type system.
 */

import React from 'react';
import logger from '../../../../utils/logger';
import { RadioGroupFieldProps } from '../types';
import { filterComponentProps } from './FormField';

/**
 * RadioGroup component for groups of radio inputs
 */
const RadioGroup: React.FC<RadioGroupFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  error,
  helperText,
  className,
  'data-testid': testId,
  direction = 'vertical',
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
    logger.debug('RadioGroup changed', {
      name,
      value: e.target.value
    });
    onChange(e);
  };
  
  // Generate CSS classes
  const fieldClasses = [
    'form-field',
    'form-field--radio-group',
    `form-field--${direction}`,
    error ? 'form-field--error' : '',
    isLoading ? 'form-field--loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <fieldset 
      className={fieldClasses}
      data-testid={testId || `radio-group-${name}`}
      disabled={disabled || isLoading}
    >
      {label && (
        <legend className="form-field__legend">
          {label}
          {required && <span className="form-field__required">*</span>}
        </legend>
      )}
      
      <div className={`form-field__radio-options form-field__radio-options--${direction}`}>
        {options.map((option) => {
          const optionId = `${fieldId}-${option.value}`;
          return (
            <div key={optionId} className="form-field__radio-option">
              <input
                id={optionId}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={disabled || option.disabled}
                required={required}
                className="form-field__radio"
                aria-invalid={!!error}
                data-testid={`radio-${name}-${option.value}`}
                {...htmlProps}
              />
              <label htmlFor={optionId} className="form-field__radio-label">
                {option.label}
              </label>
            </div>
          );
        })}
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
    </fieldset>
  );
};

export default RadioGroup; 