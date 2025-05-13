/**
 * TextField Component
 */

import React, { forwardRef } from 'react';
import { createLoggedEventHandler, warn } from '../../../utils/logger';
import { TextFieldProps, isTextField } from './types';

/**
 * TextField component for text-based input fields
 * 
 * @example
 * <TextField
 *   fieldType="text"
 *   name="email"
 *   type="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={handleEmailChange}
 *   required
 * />
 */
const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
    const {
        fieldType,
        name,
        type = 'text',
        value,
        onChange,
        onBlur,
        onFocus,
        onKeyPress,
        label,
        placeholder,
        error,
        helperText,
        required,
        disabled,
        className = '',
        id = name,
        maxLength,
        minLength,
        autoComplete,
        spellCheck,
        'data-testid': dataTestId,
        isLoading,
        ...restProps
    } = props;

    // Logged event handlers
    const handleChange = createLoggedEventHandler(
        'TextField',
        `change:${name}`,
        onChange
    );

    const handleBlur = onBlur
        ? createLoggedEventHandler('TextField', `blur:${name}`, onBlur)
        : undefined;

    const handleFocus = onFocus
        ? createLoggedEventHandler('TextField', `focus:${name}`, onFocus)
        : undefined;

    const handleKeyPress = onKeyPress
        ? createLoggedEventHandler('TextField', `keyPress:${name}`, onKeyPress)
        : undefined;

    // Compute classes
    const rootClasses = [
        'form-field',
        'text-field',
        className,
        disabled ? 'disabled' : '',
        error ? 'has-error' : '',
        isLoading ? 'is-loading' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={rootClasses} data-testid={dataTestId}>
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                maxLength={maxLength}
                minLength={minLength}
                autoComplete={autoComplete}
                spellCheck={spellCheck}
                disabled={disabled || isLoading}
                required={required}
                className="form-input"
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                ref={ref}
                {...restProps}
            />

            {error && (
                <div id={`${id}-error`} className="form-error" aria-live="polite">
                    {error}
                </div>
            )}

            {!error && helperText && (
                <div id={`${id}-helper`} className="form-helper-text">
                    {helperText}
                </div>
            )}
        </div>
    );
});

TextField.displayName = 'TextField';
export default TextField;

/**
 * Type guard to ensure a component is a TextField
 */
export const withTextField = <P extends TextFieldProps>(
    Component: React.ComponentType<P>
): React.FC<P> => {
    const WithTextField: React.FC<P> = (props: P) => {
        if (!isTextField(props)) {
            warn('Component expected TextFieldProps but received incompatible props');
            return null;
        }

        return <Component {...props} />;
    };

    WithTextField.displayName = `WithTextField(${Component.displayName || Component.name || 'Component'})`;

    return WithTextField;
}; 