/**
 * Radio Component
 */

import React from 'react';
import { RadioFieldProps } from '../types';

/**
 * Radio component for radio input fields
 */
const Radio: React.FC<RadioFieldProps> = ({
  name,
  value,
  selectedValue,
  label,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
  id,
  isLoading = false,
  'data-testid': dataTestId,
  labelPosition = 'right',
}) => {
  // Field ID defaults to name+value if not provided
  const fieldId = id || `${name}-${value}`;

  // Generate CSS classes
  const inputClasses = [
    'form-radio',
    disabled ? 'form-radio--disabled' : '',
    error ? 'form-radio--error' : '',
    isLoading ? 'form-radio--loading' : '',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-field__label',
    required ? 'form-field__label--required' : '',
    `form-field__label--${labelPosition}`
  ].filter(Boolean).join(' ');

  // Render label and radio in the correct order based on labelPosition
  const renderContent = () => {
    const radioElement = (
      <input
        id={fieldId}
        name={name}
        type="radio"
        value={value}
        checked={value === selectedValue}
        onChange={onChange}
        disabled={disabled || isLoading}
        required={required}
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
        data-testid={dataTestId}
      />
    );

    const labelElement = label && (
      <label htmlFor={fieldId} className={labelClasses}>
        {label}
      </label>
    );

    if (labelPosition === 'left') {
      return (
        <>
          {labelElement}
          {radioElement}
        </>
      );
    }

    return (
      <>
        {radioElement}
        {labelElement}
      </>
    );
  };

  return (
    <div className="form-field form-field--radio">
      <div className="form-radio-container">
        {renderContent()}
      </div>

      {(error || helperText) && (
        <div
          id={`${fieldId}-description`}
          className={`form-field__message ${error ? 'form-field__message--error' : ''}`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Radio; 