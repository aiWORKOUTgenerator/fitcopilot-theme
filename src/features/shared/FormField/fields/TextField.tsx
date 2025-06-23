/**
 * TextField Component
 * 
 * Text input field component using the FieldWrapper for consistent layout.
 */

import React from 'react';
import { filterComponentProps } from '../fields/FormField';
import { TextFieldProps } from '../types';
import FieldWrapper from './FieldWrapper';

/**
 * TextField component for text input fields
 */
const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyPress,
  type = 'text',
  placeholder = '',
  disabled = false,
  required = false,
  maxLength,
  minLength,
  error,
  helperText,
  className,
  'data-testid': testId,
  autoComplete,
  spellCheck = true,
  isLoading = false,
  _validators,
  ...otherProps
}) => {
  // Generate ID if not provided
  const fieldId = id || `field-${name}`;
  
  // Filter out component-only props
  const htmlProps = filterComponentProps(otherProps);
  
  // Generate CSS classes for the input
  const inputClasses = [
    'form-field__input',
    `form-field__input--${type}`,
    disabled ? 'form-field__input--disabled' : '',
  ].filter(Boolean).join(' ');
  
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
      <input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        data-testid={testId || `input-${name}`}
        className={inputClasses}
        {...htmlProps}
      />
    </FieldWrapper>
  );
};

export default TextField; 