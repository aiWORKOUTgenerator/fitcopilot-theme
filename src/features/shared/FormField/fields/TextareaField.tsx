/**
 * TextareaField Component
 * 
 * A textarea field component using the standardized FieldWrapper for consistent layout.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { debug } from '../../../../utils/logger';
import { TextAreaFieldProps } from '../types';
import FieldWrapper from './FieldWrapper';
import { filterComponentProps } from './FormField';

/**
 * TextareaField component for multiline text input
 */
const TextareaField: React.FC<TextAreaFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className,
  'data-testid': testId,
  rows = 3,
  resizable = true,
  maxLength,
  isLoading = false,
  validators,
  ...otherProps
}) => {
  // Generate ID if not provided
  const fieldId = id || `field-${name}`;
  
  // Create ref for auto-resizing
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Filter out component-only props
  const htmlProps = filterComponentProps(otherProps);
  
  // Auto-resize the textarea if enabled
  useEffect(() => {
    if (resizable && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value, resizable]);
  
  // Event handlers with logging
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    debug('TextareaField changed', {
      name,
      value: e.target.value
    });
    onChange(e);
  }, [name, onChange]);
  
  // Generate CSS classes for the textarea
  const textareaClasses = [
    'form-field__input',
    'form-field__textarea',
    disabled ? 'form-field__textarea--disabled' : '',
    !resizable ? 'form-field__textarea--no-resize' : '',
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
      <textarea
        ref={textareaRef}
        id={fieldId}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        rows={rows}
        data-testid={testId || `textarea-${name}`}
        className={textareaClasses}
        {...htmlProps}
      />
    </FieldWrapper>
  );
};

export default TextareaField;

/**
 * Type guard to check if props conform to TextareaField requirements
 */
export const isTextareaField = (props: any): props is TextAreaFieldProps => {
  return props && (
    props.fieldType === 'textarea' || 
    props.variant === 'textarea' || 
    props.type === 'textarea'
  );
};

/**
 * Type guard HOC to ensure a component is a TextareaField
 */
export const withTextareaField = <P extends TextAreaFieldProps>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithTextareaField: React.FC<P> = (props: P) => {
    if (!isTextareaField(props)) {
      debug('Component expected TextareaField props but received incompatible props');
      return null;
    }
    
    return <Component {...props} />;
  };

  WithTextareaField.displayName = `WithTextareaField(${Component.displayName || Component.name || 'Component'})`;
  
  return WithTextareaField;
}; 