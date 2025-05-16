/**
 * FormField Component
 * 
 * A unified component that renders different form field types based on the 'type' prop,
 * using a discriminated union pattern for type safety.
 */

import React, { useEffect, useRef } from 'react';
import {
  InputChangeHandler
} from '../../../../types/events';
import { debug as logger } from '../../../../utils/logger';
import {
  FormFieldProps,
  generateFieldId,
  isCheckboxField,
  isDateField,
  isFileField,
  isRadioField,
  isSelectField,
  isSwitchField,
  isTextAreaField,
  isTextField
} from '../types';

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

// Filter out component-only props
export const filterComponentProps = <T extends Record<string, any>>(props: T): Omit<T, typeof COMPONENT_ONLY_PROPS[number]> => {
  const filteredProps = { ...props };
  COMPONENT_ONLY_PROPS.forEach(prop => {
    if (prop in filteredProps) {
      delete filteredProps[prop];
    }
  });
  return filteredProps;
};

/**
 * Form field component that renders different field types based on the 'type' prop
 */
const FormField: React.FC<FormFieldProps> = (props) => {
  const { 
    id,
    label, 
    name, 
    required = false, 
    disabled = false, 
    error, 
    helpText,
    className = '',
    'data-testid': testId,
    'aria-describedby': ariaDescribedBy,
    _variant,
    size,
  } = props;

  // Generate IDs for accessibility
  const fieldId = id || generateFieldId(name, label || '');
  const helpTextId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [
    ariaDescribedBy,
    helpTextId,
    errorId
  ].filter(Boolean).join(' ') || undefined;

  // Common error and help text rendering
  const renderHelpers = () => (
      <>
          {helpText && (
          <div id={helpTextId} className="form-field__help-text">
              {helpText}
          </div>
      )}
          {error && (
          <div id={errorId} className="form-field__error">
              {error}
          </div>
      )}
      </>
  );

  // CSS class based on size
  const sizeClass = size ? `form-field--${size}` : '';

  // Log field render with context
  useEffect(() => {
    logger.debug('FormField rendered', {
      name,
      type: props.type,
      fieldId,
      hasError: Boolean(error)
    });
  }, [name, props.type, fieldId, error]);

  // Handle text fields (text, email, password, etc.)
  if (isTextField(props)) {
    const { 
      type, 
      value, 
      placeholder, 
      onChange, 
      onFocus, 
      onBlur,
      onKeyDown,
      onKeyPress,
      autoComplete,
      maxLength,
      minLength,
      pattern,
      prefix,
      suffix,
      // Filter out component-specific props that shouldn't be passed to HTML
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const handleChange: InputChangeHandler = (e) => {
      logger.debug('TextField changed', {
        name,
        type,
        value: e.currentTarget.value
      });
      onChange(e);
    };

    return (
        <div className={`form-field form-field--${type} ${sizeClass} ${className}`} data-testid={testId}>
            <label htmlFor={fieldId} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>
            <div className="form-field__input-wrapper">
                {prefix && <span className="form-field__prefix">{prefix}</span>}
                <input
                    {...htmlProps}
                    id={fieldId}
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    onKeyPress={onKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(error)}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    minLength={minLength}
                    pattern={pattern}
                    className="form-field__input"
          />
                {suffix && <span className="form-field__suffix">{suffix}</span>}
            </div>
            {renderHelpers()}
        </div>
    );
  }

  // Handle textarea fields
  if (isTextAreaField(props)) {
    const { 
      value, 
      onChange, 
      onFocus, 
      onBlur,
      onKeyDown,
      onKeyPress,
      placeholder,
      rows = 3,
      autoResize = false,
      maxLength, 
      minLength,
      prefix, // Extract but don't use in the HTML element
      suffix, // Extract but don't use in the HTML element
      // Filter out component-specific props
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize the textarea if enabled
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    // Create a handler that adapts the textarea event to the expected input event type
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      logger.debug('TextareaField changed', {
        name,
        value: e.target.value
      });
      
      // Use the InputChangeHandler expecting HTMLInputElement
      onChange({
        ...e,
        // Override currentTarget and target with the values needed
        currentTarget: e.currentTarget as unknown as HTMLInputElement,
        target: e.target as unknown as HTMLInputElement
      });
    };

    // Create handlers for focus/blur/keyboard events by adapting them to the expected input types
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

    return (
        <div className={`form-field form-field--textarea ${sizeClass} ${className}`} data-testid={testId}>
            <label htmlFor={fieldId} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>
            {prefix && <span className="form-field__prefix">{prefix}</span>}
            <textarea
                {...htmlProps}
                ref={textareaRef}
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
                disabled={disabled}
                required={required}
                aria-describedby={describedBy}
                aria-invalid={Boolean(error)}
                maxLength={maxLength}
                minLength={minLength}
                className="form-field__input form-field__textarea"
        />
            {suffix && <span className="form-field__suffix">{suffix}</span>}
            {renderHelpers()}
        </div>
    );
  }

  // Handle select fields
  if (isSelectField(props)) {
    const { 
      value, 
      onChange, 
      onFocus, 
      onBlur,
      options,
      placeholder,
      multiple,
      prefix,
      suffix,
      // Filter out component-specific props
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      logger.debug('SelectField changed', {
        name,
        value: e.target.value
      });
      onChange(e);
    };

    // Create event handler adapters for focus/blur events
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

    return (
        <div className={`form-field form-field--select ${sizeClass} ${className}`} data-testid={testId}>
            <label htmlFor={fieldId} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>
            <div className="form-field__input-wrapper">
                {prefix && <span className="form-field__prefix">{prefix}</span>}
                <select
                    {...htmlProps}
                    id={fieldId}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
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
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
            ))}
                </select>
                {suffix && <span className="form-field__suffix">{suffix}</span>}
            </div>
            {renderHelpers()}
        </div>
    );
  }

  // Handle checkbox fields
  if (isCheckboxField(props)) {
    const { 
      checked, 
      onChange, 
      indeterminate = false,
      labelPosition = 'right',
      // Filter out component-specific props
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const checkboxRef = useRef<HTMLInputElement>(null);

    // Set indeterminate state (not controllable via props)
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      logger.debug('CheckboxField changed', {
        name,
        checked: e.target.checked
      });
      onChange(e);
    };

    const labelContents = (
        <>
            {label}
            {required && <span className="form-field__required">*</span>}
        </>
    );

    return (
        <div className={`form-field form-field--checkbox ${sizeClass} ${className}`} data-testid={testId}>
            <div className={`form-field__checkbox-wrapper form-field__checkbox-wrapper--${labelPosition}`}>
                {labelPosition === 'left' && (
                <label htmlFor={fieldId} className="form-field__label form-field__label--checkbox">
                    {labelContents}
                </label>
          )}
                <input
                    {...htmlProps}
                    ref={checkboxRef}
                    id={fieldId}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(error)}
                    className="form-field__checkbox"
          />
                {labelPosition === 'right' && (
                <label htmlFor={fieldId} className="form-field__label form-field__label--checkbox">
                    {labelContents}
                </label>
          )}
            </div>
            {renderHelpers()}
        </div>
    );
  }

  // Handle radio fields
  if (isRadioField(props)) {
    const { 
      value, 
      onChange, 
      options,
      // Filter out component-specific props
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      logger.debug('RadioField changed', {
        name,
        value: e.target.value
      });
      onChange(e);
    };

    return (
        <div className={`form-field form-field--radio ${sizeClass} ${className}`} data-testid={testId}>
            <fieldset className="form-field__fieldset">
                <legend className="form-field__legend">
                    {label}
                    {required && <span className="form-field__required">*</span>}
                </legend>
                <div className="form-field__radio-group">
                    {options.map((option) => {
              const optionId = `${fieldId}-${option.value}`;
              return (
                  <div key={optionId} className="form-field__radio-option">
                      <input
                          {...htmlProps}
                          id={optionId}
                          type="radio"
                          name={name}
                          value={option.value}
                          checked={value === option.value}
                          onChange={handleChange}
                          disabled={disabled || option.disabled}
                          required={required}
                          aria-describedby={describedBy}
                          aria-invalid={Boolean(error)}
                          className="form-field__radio-input"
                  />
                      <label htmlFor={optionId} className="form-field__radio-label">
                          {option.label}
                      </label>
                  </div>
              );
            })}
                </div>
            </fieldset>
            {renderHelpers()}
        </div>
    );
  }

  // Handle switch fields
  if (isSwitchField(props)) {
    const { 
      checked, 
      onChange, 
      onText, 
      offText,
      // Filter out component-specific props
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      logger.debug('SwitchField changed', {
        name,
        checked: e.target.checked
      });
      onChange(e);
    };

    return (
        <div className={`form-field form-field--switch ${sizeClass} ${className}`} data-testid={testId}>
            <div className="form-field__switch-wrapper">
                {offText && <span className="form-field__switch-off">{offText}</span>}
                <label htmlFor={fieldId} className="form-field__switch-label">
                    <input
                        {...htmlProps}
                        id={fieldId}
                        type="checkbox"
                        name={name}
                        checked={checked}
                        onChange={handleChange}
                        disabled={disabled}
                        required={required}
                        aria-describedby={describedBy}
                        aria-invalid={Boolean(error)}
                        className="form-field__switch-input"
            />
                    <span className="form-field__switch-slider"></span>
                    <span className="form-field__switch-text">
                        {label}
                        {required && <span className="form-field__required">*</span>}
                    </span>
                </label>
                {onText && <span className="form-field__switch-on">{onText}</span>}
            </div>
            {renderHelpers()}
        </div>
    );
  }

  // Handle date fields
  if (isDateField(props)) {
    const { 
      value, 
      onChange, 
      onFocus, 
      onBlur,
      min,
      max,
      // Filter out component-specific props
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      logger.debug('DateField changed', {
        name,
        value: e.target.value
      });
      onChange(e);
    };

    // Create event handler adapters if needed
    const handleFocus = onFocus ? (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus(e);
    } : undefined;

    const handleBlur = onBlur ? (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur(e);
    } : undefined;

    return (
        <div className={`form-field form-field--date ${sizeClass} ${className}`} data-testid={testId}>
            <label htmlFor={fieldId} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>
            <div className="form-field__input-wrapper">
                <input
                    {...htmlProps}
                    id={fieldId}
                    type="date"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    min={min}
                    max={max}
                    disabled={disabled}
                    required={required}
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(error)}
                    className="form-field__date"
          />
            </div>
            {renderHelpers()}
        </div>
    );
  }

  // Handle file fields
  if (isFileField(props)) {
    const { 
      onChange, 
      accept,
      multiple,
      maxSize,
      buttonText = 'Choose File',
      dropText = 'Drop files here',
      // Filter out component-specific props
      ...otherProps
    } = props;

    // Filter out any other component-only props
    const htmlProps = filterComponentProps(otherProps);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      logger.debug('FileField changed', {
        name,
        files: e.target.files?.length || 0
      });
      onChange(e);
    };

    return (
        <div className={`form-field form-field--file ${sizeClass} ${className}`} data-testid={testId}>
            <label htmlFor={fieldId} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>
            <div className="form-field__file-wrapper">
                <input
                    {...htmlProps}
                    id={fieldId}
                    type="file"
                    name={name}
                    onChange={handleChange}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    required={required}
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(error)}
                    className="form-field__file-input"
          />
                <div className="form-field__file-ui">
                    <button type="button" className="form-field__file-button" disabled={disabled}>
                        {buttonText}
                    </button>
                    <div className="form-field__file-drop-area">
                        {dropText}
                    </div>
                </div>
            </div>
            {renderHelpers()}
        </div>
    );
  }

  // Fallback for unknown field types
  return (
      <div className={`form-field form-field--unknown ${sizeClass} ${className}`} data-testid={testId}>
          <div className="form-field__error">Unknown field type: {(props as any).type}</div>
      </div>
  );
};

export default FormField; 