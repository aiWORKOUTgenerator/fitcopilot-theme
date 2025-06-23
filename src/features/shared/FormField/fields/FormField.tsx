/**
 * FormField Component
 * 
 * A unified component that renders different form field types based on the 'fieldType' prop,
 * using a discriminated union pattern for type safety.
 */

import React from 'react';
import {
  FormFieldProps,
  isCheckboxField,
  isDateField,
  isFileField,
  isMultiSelectField,
  isRadioGroupField,
  isSelectField,
  isSwitchField,
  isTextAreaField,
  isTextField
} from '../types';
import Checkbox from './Checkbox';
import DateField from './DatePicker';
import FileField from './FileUpload';
import MultiSelectField from './MultiSelectField';
import RadioGroup from './RadioGroup';
import SelectField from './SelectField';
import Switch from './Switch';
import TextareaField from './TextareaField';
import TextField from './TextField';
// Import other field components as needed

// Props that should not be passed to HTML elements
const COMPONENT_ONLY_PROPS = [
  'label', 
  'error', 
  'helperText', 
  'variant', 
  'size', 
  'validators', 
  'prefix', 
  'suffix', 
  'resizable', 
  'indeterminate',
  'options',
  'maxSize',
  'onLabel',
  'offLabel',
  'buttonText',
  'dropText',
  'labelPosition',
  'isLoading',
  'fieldType'
] as const;

// Filter out component-only props
export const filterComponentProps = <T extends Record<string, any>>(props: T): Omit<T, typeof COMPONENT_ONLY_PROPS[number]> => {
  const filteredProps = { ...props };
  COMPONENT_ONLY_PROPS.forEach(prop => {
    if (prop in filteredProps) {
      delete filteredProps[prop];
    }
  });
  return filteredProps;
};

/**
 * Form field component that renders different field types based on the 'fieldType' prop
 */
const FormField: React.FC<FormFieldProps> = (props) => {
  // Create consistent field ID pattern
  const fieldId = props.id || `field-${props.name}`;
  
  // Use type guards to render appropriate component
  if (isTextField(props)) {
    return <TextField {...props} id={fieldId} />;
  }
  
  if (isTextAreaField(props)) {
    return <TextareaField {...props} id={fieldId} />;
  }
  
  if (isSelectField(props)) {
    return <SelectField {...props} id={fieldId} />;
  }
  
  if (isCheckboxField(props)) {
    return <Checkbox {...props} id={fieldId} />;
  }
  
  if (isRadioGroupField(props)) {
    return <RadioGroup {...props} id={fieldId} />;
  }
  
  if (isSwitchField(props)) {
    return <Switch {...props} id={fieldId} />;
  }
  
  if (isDateField(props)) {
    return <DateField {...props} id={fieldId} />;
  }
  
  if (isFileField(props)) {
    return <FileField {...props} id={fieldId} />;
  }

  if (isMultiSelectField(props)) {
    return <MultiSelectField {...props} id={fieldId} />;
  }

  // Additional field types would be implemented here

  // Fallback for unknown field types
  logger.error(`Unknown field type: ${(props as any).fieldType}`);
  return null;
};

export default FormField; 