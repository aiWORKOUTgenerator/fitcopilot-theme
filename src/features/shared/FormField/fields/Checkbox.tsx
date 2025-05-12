/**
 * Checkbox Component
 */

import React from 'react';
import { CheckboxFieldProps } from '../types';

/**
 * Checkbox component for checkbox input fields
 */
const Checkbox: React.FC<CheckboxFieldProps> = ({
    name,
    checked,
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
    labelPosition = 'right',
}) => {
    // Field ID defaults to name if not provided
    const fieldId = id || name;

    // Generate CSS classes
    const inputClasses = [
        'form-checkbox',
        disabled ? 'form-checkbox--disabled' : '',
        error ? 'form-checkbox--error' : '',
        isLoading ? 'form-checkbox--loading' : '',
        className
    ].filter(Boolean).join(' ');

    const labelClasses = [
        'form-field__label',
        required ? 'form-field__label--required' : '',
        `form-field__label--${labelPosition}`
    ].filter(Boolean).join(' ');

    // Render label and checkbox in the correct order based on labelPosition
    const renderContent = () => {
        const checkboxElement = (
            <input
                id={fieldId}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled || isLoading}
                required={required}
                className={inputClasses}
                aria-invalid={!!error}
                aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                data-testid={dataTestId}
            />
        );

        const labelElement = label && (
            <label htmlFor={fieldId} className={labelClasses}>
                {label}
            </label>
        );

        if (labelPosition === 'left') {
            return (
                <>
                    {labelElement}
                    {checkboxElement}
                </>
            );
        }

        return (
            <>
                {checkboxElement}
                {labelElement}
            </>
        );
    };

    return (
        <div className="form-field form-field--checkbox">
            <div className="form-checkbox-container">
                {renderContent()}
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

export default Checkbox; 