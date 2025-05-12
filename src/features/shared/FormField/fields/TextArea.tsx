/**
 * TextArea Component
 */

import React from 'react';
import { TextAreaFieldProps } from '../types';

/**
 * TextArea component for multiline text input fields
 */
const TextArea: React.FC<TextAreaFieldProps> = ({
    name,
    value,
    label,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    rows = 4,
    disabled = false,
    required = false,
    error,
    helperText,
    className = '',
    id,
    maxLength,
    resizable = true,
    isLoading = false,
    'data-testid': dataTestId,
}) => {
    // Field ID defaults to name if not provided
    const fieldId = id || name;

    // Generate CSS classes
    const textareaClasses = [
        'form-textarea',
        disabled ? 'form-textarea--disabled' : '',
        error ? 'form-textarea--error' : '',
        !resizable ? 'form-textarea--no-resize' : '',
        isLoading ? 'form-textarea--loading' : '',
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

            <textarea
                id={fieldId}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled || isLoading}
                required={required}
                className={textareaClasses}
                maxLength={maxLength}
                aria-invalid={!!error}
                aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                data-testid={dataTestId}
            ></textarea>

            {maxLength && (
                <div className="form-field__counter">
                    {value.length}/{maxLength}
                </div>
            )}

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

export default TextArea; 