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
  name,
  label,
  value,
  type = 'text',
  placeholder,
  onChange,
  onBlur,
  onFocus,
  onKeyPress,
  disabled = false,
  required = false,
  error,
  helperText,
  className,
  id,
  maxLength,
  minLength,
  autoComplete,
  spellCheck,
  'data-testid': testId,
  isLoading = false,
  validators,
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