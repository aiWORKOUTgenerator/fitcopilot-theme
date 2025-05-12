/**
 * Switch Component
 */

import React from 'react';
import { SwitchFieldProps } from '../types';

/**
 * Switch component for toggle inputs
 */
const Switch: React.FC<SwitchFieldProps> = ({
    name,
    checked,
    label,
    onChange,
    onLabel,
    offLabel,
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
    const switchClasses = [
        'form-switch',
        disabled ? 'form-switch--disabled' : '',
        error ? 'form-switch--error' : '',
        isLoading ? 'form-switch--loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="form-field form-field--switch">
            <div className="form-switch-container">
                <input
                    id={fieldId}
                    name={name}
                    type="checkbox"
                    role="switch"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled || isLoading}
                    required={required}
                    className={switchClasses}
                    aria-invalid={!!error}
                    aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                    data-testid={dataTestId}
                />

                <label htmlFor={fieldId} className={`form-switch-label ${required ? 'form-switch-label--required' : ''}`}>
                    <div className="form-switch-track">
                        <div className="form-switch-handle"></div>
                        {(onLabel || offLabel) && (
                            <div className="form-switch-labels">
                                {offLabel && <span className="form-switch-off">{offLabel}</span>}
                                {onLabel && <span className="form-switch-on">{onLabel}</span>}
                            </div>
                        )}
                    </div>
                    {label && <span className="form-switch-text">{label}</span>}
                </label>
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

export default Switch; 