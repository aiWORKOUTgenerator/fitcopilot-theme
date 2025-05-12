/**
 * DatePicker Component
 */

import React from 'react';
import { DateFieldProps } from '../types';

/**
 * DatePicker component for date input fields
 */
const DatePicker: React.FC<DateFieldProps> = ({
    name,
    value,
    label,
    onChange,
    onBlur,
    onFocus,
    min,
    max,
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
    const inputClasses = [
        'form-input',
        'form-input--date',
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

            <div className="form-date-container">
                <input
                    id={fieldId}
                    name={name}
                    type="date"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    min={min}
                    max={max}
                    disabled={disabled || isLoading}
                    required={required}
                    className={inputClasses}
                    aria-invalid={!!error}
                    aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                    data-testid={dataTestId}
                />
                <div className="form-date-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.5 1a.5.5 0 0 0-.5.5V2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-2V1.5a.5.5 0 0 0-1 0V2H5V1.5a.5.5 0 0 0-.5-.5zM2 14V5h12v9H2z" />
                    </svg>
                </div>
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

export default DatePicker; 