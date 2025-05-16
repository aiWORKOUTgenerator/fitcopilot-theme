/**
 * SelectField Component
 * 
 * A standalone implementation of a select field using the centralized type system
 */

import React, { forwardRef } from 'react';
import { SelectChangeHandler } from '../../../../types/events';
import { debug } from '../../../../utils/logger';
import { filterComponentProps } from './FormField';

// Define a local interface that matches what we're actually using
interface SelectFieldComponentProps {
  id?: string;
  name: string;
  value: string;
  onChange: SelectChangeHandler;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  onFocus?: React.FocusEventHandler<HTMLSelectElement>;
  label?: string;
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  'aria-describedby'?: string;
  options: Array<{value: string; label: string; disabled?: boolean}>;
  multiple?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  variant?: string;
  size?: string;
  isLoading?: boolean;
}

/**
 * SelectField component for dropdown selection
 * 
 * @example
 * <SelectField
 *   type="select"
 *   name="country"
 *   label="Country"
 *   value={country}
 *   onChange={handleCountryChange}
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' }
 *   ]}
 * />
 */
const SelectField = forwardRef<HTMLSelectElement, SelectFieldComponentProps>((props, ref) => {
  const {
    id,
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    label,
    placeholder,
    error,
    helpText,
    required = false,
    disabled = false,
    className = '',
    'data-testid': testId,
    'aria-describedby': ariaDescribedBy,
    options,
    multiple,
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

  // Filter out any component-only props
  const htmlProps = filterComponentProps(otherProps);

  // Event handlers with logging
  const handleChange: SelectChangeHandler = (e) => {
    debug('SelectField changed', {
      name,
      value: e.currentTarget.value
    });
    onChange(e);
  };

  // Event handler adapters for focus/blur events
  const handleFocus = onFocus ? (e: React.FocusEvent<HTMLSelectElement>) => {
    onFocus(e);
  } : undefined;

  const handleBlur = onBlur ? (e: React.FocusEvent<HTMLSelectElement>) => {
    onBlur(e);
  } : undefined;

  // CSS classes
  const sizeClass = size ? `form-field--${size}` : '';
  const variantClass = variant ? `form-field--${variant}` : '';
  const rootClasses = [
    'form-field',
    'form-field--select',
    sizeClass,
    variantClass,
    className,
    disabled ? 'form-field--disabled' : '',
    error ? 'form-field--error' : '',
    isLoading ? 'form-field--loading' : ''
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
        
        <select
          {...htmlProps}
          ref={ref}
          id={fieldId}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled || isLoading}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          multiple={multiple}
          className="form-field__select"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
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

SelectField.displayName = 'SelectField';
export default SelectField;

/**
 * Type guard to check if props conform to SelectField requirements
 */
export const isSelectField = (props: any): props is SelectFieldComponentProps => {
  return props && (
    props.fieldType === 'select' || 
    props.variant === 'select' || 
    props.type === 'select'
  );
};

/**
 * Type guard HOC to ensure a component is a SelectField
 */
export const withSelectField = <P extends SelectFieldComponentProps>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithSelectField: React.FC<P> = (props: P) => {
    if (!isSelectField(props)) {
      debug('Component expected SelectField props but received incompatible props');
      return null;
    }
    
    return <Component {...props} />;
  };

  WithSelectField.displayName = `WithSelectField(${Component.displayName || Component.name || 'Component'})`;
  
  return WithSelectField;
}; 