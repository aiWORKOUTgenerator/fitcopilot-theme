/**
 * FileUpload Component
 */

import React, { useRef } from 'react';
import { FileFieldProps } from '../types';

/**
 * FileUpload component for file input fields
 */
const FileUpload: React.FC<FileFieldProps> = ({
    name,
    value,
    label,
    onChange,
    accept,
    multiple,
    buttonText = 'Choose file',
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

    // Create ref for the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle custom button click to trigger file selection
    const handleButtonClick = () => {
        if (fileInputRef.current && !disabled && !isLoading) {
            fileInputRef.current.click();
        }
    };

    // Get the selected file name for display
    const getFileName = () => {
        if (!value) return 'No file selected';
        return value.name;
    };

    // Generate CSS classes
    const uploadClasses = [
        'form-file-upload',
        disabled ? 'form-file-upload--disabled' : '',
        error ? 'form-file-upload--error' : '',
        isLoading ? 'form-file-upload--loading' : '',
        className
    ].filter(Boolean).join(' ');

    const buttonClasses = [
        'form-file-button',
        disabled ? 'form-file-button--disabled' : '',
        isLoading ? 'form-file-button--loading' : '',
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

            <div className={uploadClasses}>
                <input
                    ref={fileInputRef}
                    id={fieldId}
                    name={name}
                    type="file"
                    onChange={onChange}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled || isLoading}
                    required={required}
                    className="form-file-input"
                    aria-invalid={!!error}
                    aria-describedby={error || helperText ? `${fieldId}-description` : undefined}
                    data-testid={dataTestId}
                    style={{ display: 'none' }}
                />

                <div className="form-file-container">
                    <button
                        type="button"
                        className={buttonClasses}
                        onClick={handleButtonClick}
                        disabled={disabled || isLoading}
                        aria-controls={fieldId}
                    >
                        {buttonText}
                    </button>
                    <div className="form-file-name" title={value ? value.name : ''}>
                        {getFileName()}
                    </div>
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

export default FileUpload; 