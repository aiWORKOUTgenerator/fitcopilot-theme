/**
 * SelectField Component
 * 
 * A standalone implementation of a select field using the centralized type system
 */

import React, { forwardRef } from 'react';
import { SelectChangeHandler } from '../../../../types/events';
import { debug } from '../../../../utils/logger';
import { SelectFieldProps } from '../types';
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
  'indeterminate',
  'options',
  'maxSize',
  'onText',
  'offText',
  'buttonText',
  'dropText',
  'labelPosition',
  'isLoading'
] as const;

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
const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>((props, ref) => {
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
    onFocus({
      ...e,
      currentTarget: e.currentTarget as unknown as HTMLInputElement,
      target: e.target as unknown as HTMLInputElement
    });
  } : undefined;

  const handleBlur = onBlur ? (e: React.FocusEvent<HTMLSelectElement>) => {
    onBlur({
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
 * Type guard HOC to ensure a component is a SelectField
 */
export const withSelectField = <P extends SelectFieldProps>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithSelectField: React.FC<P> = (props: P) => {
    if (!isSelectField(props)) {
      debug.warn('Component expected SelectFieldProps but received incompatible props');
      return null;
    }
    
    return <Component {...props} />;
  };

  WithSelectField.displayName = `WithSelectField(${Component.displayName || Component.name || 'Component'})`;
  
  return WithSelectField;
}; 