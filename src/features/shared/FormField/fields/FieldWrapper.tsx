/**
 * FieldWrapper Component
 * 
 * Provides consistent layout and styling for all form field components.
 */

import * as React from 'react';

interface FieldWrapperProps {
  /** Field ID */
  id: string;
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the field is loading */
  isLoading?: boolean;
  /** Child components (the actual input element) */
  children: React.ReactNode;
}

/**
 * Wrapper component that provides consistent layout for all form fields
 */
const FieldWrapper: React.FC<FieldWrapperProps> = ({
  id,
  name,
  label,
  required = false,
  error,
  helperText,
  className = '',
  isLoading = false,
  children
}) => {
  // Generate IDs for accessibility
  const helpTextId = helperText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [
    helpTextId,
    errorId
  ].filter(Boolean).join(' ') || undefined;
  
  // Generate CSS classes
  const fieldClasses = [
    'form-field',
    error ? 'form-field--error' : '',
    isLoading ? 'form-field--loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={fieldClasses} data-testid={`field-${name}`}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      
      <div className="form-field__control">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id,
              'aria-describedby': describedBy,
              'aria-invalid': Boolean(error),
              ...child.props
            });
          }
          return child;
        })}
      </div>
      
      {error && (
        <div id={errorId} className="form-field__error" role="alert">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={helpTextId} className="form-field__helper-text">
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

export default FieldWrapper; 