/**
 * Select Component
 */

import React from 'react';
import { SelectFieldProps } from '../types';

/**
 * Select component for dropdown selection fields
 */
const Select: React.FC<SelectFieldProps> = ({
    name,
    value,
    options,
    label,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    required = false,
    error,
    helperText,
    className = '',
    id,
    isLoading = false,
    'data-testid': dataTestId,
}) => {
    // Field ID defaults to name if not provided
    const fieldId = id || name;

    // Generate CSS classes
    const selectClasses = [
        'form-select',
        disabled ? 'form-select--disabled' : '',
        error ? 'form-select--error' : '',
        isLoading ? 'form-select--loading' : '',
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

            <div className="form-select-container">
                <select
                    id={fieldId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    disabled={disabled || isLoading}
                    required={required}
                    className={selectClasses}
                    aria-invalid={!!error}
                    aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                    data-testid={dataTestId}
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
                <div className="form-select-arrow"></div>
            </div>

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

export default Select; 