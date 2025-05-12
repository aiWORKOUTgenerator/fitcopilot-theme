/**
 * TextField Component
 */

import React from 'react';
import { TextFieldProps } from '../types';

/**
 * TextField component for text input fields
 */
const TextField: React.FC<TextFieldProps> = ({
    name,
    value,
    label,
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
    className = '',
    id,
    maxLength,
    minLength,
    autoComplete,
    spellCheck,
    isLoading = false,
    'data-testid': dataTestId,
}) => {
    // Field ID defaults to name if not provided
    const fieldId = id || name;

    // Generate CSS classes
    const inputClasses = [
        'form-input',
        `form-input--${type}`,
        disabled ? 'form-input--disabled' : '',
        error ? 'form-input--error' : '',
        isLoading ? 'form-input--loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="form-field">
            {label && (
                <label
                    htmlFor={fieldId}
                    className={`form-field__label ${required ? 'form-field__label--required' : ''}`}
                >
                    {label}
                </label>
            )}

            <input
                id={fieldId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                onKeyPress={onKeyPress}
                placeholder={placeholder}
                disabled={disabled || isLoading}
                required={required}
                className={inputClasses}
                maxLength={maxLength}
                minLength={minLength}
                autoComplete={autoComplete}
                spellCheck={spellCheck}
                aria-invalid={!!error}
                aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                data-testid={dataTestId}
            />

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

export default TextField; 