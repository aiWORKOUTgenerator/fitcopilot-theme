/**
 * FileField Component
 * 
 * A file upload field component using the standardized FieldWrapper for consistent layout.
 */

import React, { useRef } from 'react';
import { debug } from '../../../../utils/logger';
import { FileFieldProps } from '../types';
import FieldWrapper from './FieldWrapper';
import { filterComponentProps } from './FormField';

/**
 * FileField component for file input fields
 */
const FileField: React.FC<Omit<FileFieldProps, 'value'> & { value?: File | null }> = ({
  id,
  name,
  label,
  onChange,
  onBlur,
  onFocus,
  accept,
  multiple = false,
  buttonText = 'Choose File',
  disabled = false,
  required = false,
  error,
  helperText,
  className,
  'data-testid': testId,
  isLoading = false,
  validators,
  value, // We need to extract this but not pass it to the input element
  ...otherProps
}) => {
  // Generate ID if not provided
  const fieldId = id || `field-${name}`;
  
  // Filter out component-only props
  const htmlProps = filterComponentProps(otherProps);
  
  // Create ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle custom button click to trigger file selection
  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled && !isLoading) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file change with logging
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debug('FileField changed', {
      name,
      files: e.target.files?.length || 0
    });
    onChange(e);
  };
  
  // Get display text for the file
  const getFileText = () => {
    // If we have a value prop, use that
    if (value) {
      return value.name;
    }
    
    // Otherwise try to get from the ref
    if (!fileInputRef.current?.files?.length) {
      return multiple ? 'No files selected' : 'No file selected';
    }
    
    const files = fileInputRef.current.files;
    if (files.length === 1) {
      return files[0].name;
    }
    
    return `${files.length} files selected`;
  };
  
  return (
    <FieldWrapper
      id={fieldId}
      name={name}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
      isLoading={isLoading}
    >
      <div className="form-field__file-wrapper">
        <input
          ref={fileInputRef}
          id={fieldId}
          name={name}
          type="file"
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          data-testid={testId || `file-${name}`}
          className="form-field__file-input"
          style={{ position: 'absolute', clip: 'rect(0,0,0,0)' }}
          {...htmlProps}
        />
        
        <button
          type="button"
          className="form-field__file-button"
          onClick={handleButtonClick}
          disabled={disabled || isLoading}
          aria-controls={fieldId}
        >
          {buttonText}
        </button>
        
        <span className="form-field__file-name">
          {getFileText()}
        </span>
      </div>
    </FieldWrapper>
  );
};

export default FileField; 