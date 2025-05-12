/**
 * FormField Component
 * Renders different form field types based on fieldType prop
 */

import React from 'react';
import { error } from '../../../utils/logger';
import {
  FormFieldProps,
  isCheckboxField,
  isDateField,
  isFileField,
  isRadioField,
  isRadioGroupField,
  isSelectField,
  isSwitchField,
  isTextAreaField,
  isTextField
} from './types';

// Form field type components
import Checkbox from './fields/Checkbox';
import DatePicker from './fields/DatePicker';
import FileUpload from './fields/FileUpload';
import Radio from './fields/Radio';
import RadioGroup from './fields/RadioGroup';
import Select from './fields/Select';
import Switch from './fields/Switch';
import TextArea from './fields/TextArea';
import TextField from './fields/TextField';

/**
 * FormField component that renders different field types based on props
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
  // Use type guards to determine which field type to render
  if (isTextField(props)) {
    return <TextField {...props} />;
  }

  if (isTextAreaField(props)) {
    return <TextArea {...props} />;
  }

  if (isSelectField(props)) {
    return <Select {...props} />;
  }

  if (isCheckboxField(props)) {
    return <Checkbox {...props} />;
  }

  if (isRadioField(props)) {
    return <Radio {...props} />;
  }

  if (isRadioGroupField(props)) {
    return <RadioGroup {...props} />;
  }

  if (isSwitchField(props)) {
    return <Switch {...props} />;
  }

  if (isDateField(props)) {
    return <DatePicker {...props} />;
  }

  if (isFileField(props)) {
    return <FileUpload {...props} />;
  }

  // Default case - unsupported field type
  error(`Unsupported field type: ${props.fieldType}`);
  return null;
};

export default FormField; 