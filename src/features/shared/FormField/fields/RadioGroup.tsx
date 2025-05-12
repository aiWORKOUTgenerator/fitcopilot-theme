/**
 * RadioGroup Component
 */

import React from 'react';
import { RadioGroupFieldProps } from '../types';

/**
 * RadioGroup component for groups of radio inputs
 */
const RadioGroup: React.FC<RadioGroupFieldProps> = ({
    name,
    value,
    options,
    label,
    onChange,
    disabled = false,
    required = false,
    error,
    helperText,
    className = '',
    id,
    isLoading = false,
    'data-testid': dataTestId,
    direction = 'vertical',
}) => {
    // Field ID defaults to name if not provided
    const fieldId = id || name;

    // Generate CSS classes
    const groupClasses = [
        'form-radio-group',
        `form-radio-group--${direction}`,
        disabled ? 'form-radio-group--disabled' : '',
        error ? 'form-radio-group--error' : '',
        isLoading ? 'form-radio-group--loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="form-field form-field--radio-group">
            {label && (
                <div
                    className={`form-field__label ${required ? 'form-field__label--required' : ''}`}
                    id={`${fieldId}-group-label`}
                >
                    {label}
                </div>
            )}

            <div
                className={groupClasses}
                role="radiogroup"
                aria-labelledby={label ? `${fieldId}-group-label` : undefined}
                data-testid={dataTestId}
            >
                {options.map((option) => {
                    const optionId = `${fieldId}-${option.value}`;

                    return (
                        <div className="form-radio-option" key={option.value}>
                            <input
                                id={optionId}
                                name={name}
                                type="radio"
                                value={option.value}
                                checked={option.value === value}
                                onChange={onChange}
                                disabled={disabled || isLoading || option.disabled}
                                required={required}
                                className="form-radio"
                                aria-invalid={!!error}
                            />
                            <label htmlFor={optionId} className="form-radio-label">
                                {option.label}
                            </label>
                        </div>
                    );
                })}
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

export default RadioGroup; 