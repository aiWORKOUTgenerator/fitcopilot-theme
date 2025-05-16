import React from 'react';
import { TextFieldProps, createLoggedChangeHandler } from './types';

/**
 * TextField component for text-based input fields
 * 
 * @param props - Text field properties
 * @returns React component
 */
export const TextField: React.FC<TextFieldProps> = (props) => {
  const {
    id,
    label,
    name,
    type = 'text',
    value,
    placeholder,
    onChange,
    required = false,
    disabled = false,
    error,
    className = '',
    'data-testid': testId,
    helpText,
    maxLength,
    minLength,
    pattern
  } = props;

  // Create logged change handler
  const handleChange = createLoggedChangeHandler(onChange, {
    component: 'TextField',
    fieldId: id,
    fieldName: name,
    fieldType: type
  });

  // Generate unique IDs for associated elements
  const errorId = `${id}-error`;
  const helpTextId = `${id}-help`;

  // Determine if we have descriptive text to associate with the input
  const hasError = Boolean(error);
  const hasHelpText = Boolean(helpText);
  const describedBy = [
    hasError ? errorId : null,
    hasHelpText ? helpTextId : null
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-field ${className} ${hasError ? 'has-error' : ''}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="form-input"
        aria-invalid={hasError}
        aria-describedby={describedBy}
        data-testid={testId}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
      />

      {hasError && (
        <div id={errorId} className="error-message" role="alert">
          {error}
        </div>
      )}

      {hasHelpText && (
        <div id={helpTextId} className="help-text">
          {helpText}
        </div>
      )}
    </div>
  );
}; 