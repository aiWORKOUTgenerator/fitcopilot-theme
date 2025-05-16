/**
 * TextareaField Component
 * 
 * A standalone implementation of a textarea field using the centralized type system
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { debug } from '../../../../utils/logger';
import { TextAreaFieldProps } from '../types';
import { filterComponentProps } from './FormField';

// Props that should not be passed to HTML elements
const COMPONENT_ONLY_PROPS = [
  'label', 
  'error', 
  'helpText', 
  'variant', 
  'size', 
  'validators', 
  'prefix', 
  'suffix',
  'autoResize',
  'minLength',
  'indeterminate'
] as const;

/**
 * TextareaField component for multiline text input
 * 
 * @example
 * <TextareaField
 *   type="textarea"
 *   name="description"
 *   label="Description"
 *   value={description}
 *   onChange={handleDescriptionChange}
 *   rows={5}
 *   autoResize
 * />
 */
const TextareaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>((props, ref) => {
  const {
    id,
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyPress,
    label,
    placeholder,
    error,
    helpText,
    required = false,
    disabled = false,
    className = '',
    'data-testid': testId,
    'aria-describedby': ariaDescribedBy,
    rows = 3,
    autoResize = false,
    maxLength,
    minLength,
    prefix,
    suffix,
    variant,
    size,
    isLoading = false,
    ...otherProps
  } = props;

  // Generate IDs for accessibility
  const fieldId = id || `field-${name}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [
    ariaDescribedBy,
    helpTextId,
    errorId
  ].filter(Boolean).join(' ') || undefined;

  // Create internal ref for auto-resizing
  const internalRef = useRef<HTMLTextAreaElement>(null);
  
  // Get the actual textarea element
  const getTextarea = () => {
    return ref && typeof ref !== 'function' ? ref.current : internalRef.current;
  };

  // Filter out any component-only props
  const htmlProps = filterComponentProps(otherProps);

  // Auto-resize the textarea if enabled
  useEffect(() => {
    if (autoResize) {
      const textarea = getTextarea();
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [value, autoResize]);

  // Event handlers with adaptation to expected input types
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    debug('TextareaField changed', {
      name,
      value: e.target.value
    });
    
    // Adapt the event to match InputChangeHandler expectations
    onChange({
      ...e,
      currentTarget: e.currentTarget as unknown as HTMLInputElement,
      target: e.target as unknown as HTMLInputElement
    });
  };

  // Event handler adapters for focus, blur, and keyboard events
  const handleFocus = onFocus ? (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onFocus({
      ...e,
      currentTarget: e.currentTarget as unknown as HTMLInputElement,
      target: e.target as unknown as HTMLInputElement
    });
  } : undefined;

  const handleBlur = onBlur ? (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onBlur({
      ...e,
      currentTarget: e.currentTarget as unknown as HTMLInputElement,
      target: e.target as unknown as HTMLInputElement
    });
  } : undefined;

  const handleKeyDown = onKeyDown ? (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown({
      ...e,
      currentTarget: e.currentTarget as unknown as HTMLInputElement,
      target: e.target as unknown as HTMLInputElement
    });
  } : undefined;

  const handleKeyPress = onKeyPress ? (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyPress({
      ...e,
      currentTarget: e.currentTarget as unknown as HTMLInputElement,
      target: e.target as unknown as HTMLInputElement
    });
  } : undefined;

  // CSS classes
  const sizeClass = size ? `form-field--${size}` : '';
  const variantClass = variant ? `form-field--${variant}` : '';
  const rootClasses = [
    'form-field',
    'form-field--textarea',
    sizeClass,
    variantClass,
    className,
    disabled ? 'form-field--disabled' : '',
    error ? 'form-field--error' : '',
    isLoading ? 'form-field--loading' : '',
    autoResize ? 'form-field--auto-resize' : ''
  ].filter(Boolean).join(' ');

  return (
      <div className={rootClasses} data-testid={testId}>
          {label && (
          <label htmlFor={fieldId} className="form-field__label">
              {label}
              {required && <span className="form-field__required">*</span>}
          </label>
      )}
      
          <div className="form-field__input-wrapper">
              {prefix && <span className="form-field__prefix">{prefix}</span>}
        
              <textarea
                  {...htmlProps}
                  ref={ref || internalRef}
                  id={fieldId}
                  name={name}
                  value={value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  rows={rows}
                  disabled={disabled || isLoading}
                  required={required}
                  aria-describedby={describedBy}
                  aria-invalid={Boolean(error)}
                  maxLength={maxLength}
                  minLength={minLength}
                  className="form-field__input form-field__textarea"
        />
        
              {suffix && <span className="form-field__suffix">{suffix}</span>}
          </div>

          {helpText && !error && (
          <div id={helpTextId} className="form-field__help-text">
              {helpText}
          </div>
      )}
      
          {error && (
          <div id={errorId} className="form-field__error" aria-live="polite">
              {error}
          </div>
      )}
      </div>
  );
});

TextareaField.displayName = 'TextareaField';
export default TextareaField;

/**
 * Type guard HOC to ensure a component is a TextareaField
 */
export const withTextareaField = <P extends TextAreaFieldProps>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithTextareaField: React.FC<P> = (props: P) => {
    if (!isTextareaField(props)) {
      debug.warn('Component expected TextareaFieldProps but received incompatible props');
      return null;
    }
    
    return <Component {...props} />;
  };

  WithTextareaField.displayName = `WithTextareaField(${Component.displayName || Component.name || 'Component'})`;
  
  return WithTextareaField;
}; 