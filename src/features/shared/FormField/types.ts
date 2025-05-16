/**
 * Form Field component type definitions
 */

import * as React from 'react';
import {
    CheckboxFieldEventHandlers,
    InputFieldEventHandlers,
    InputKeyPressHandler,
    SelectFieldEventHandlers,
    TextAreaFieldEventHandlers
} from './events';
import { MultiSelectFieldProps } from './fields/MultiSelectField';
import { ValidatorFn } from './validators';

/**
 * Base form field props shared across all field types
 */
export interface BaseFormFieldProps {
  /** Field name (used for form state) */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the field */
  helperText?: string;
  /** Additional CSS class name */
  className?: string;
  /** ID attribute (defaults to name if not provided) */
  id?: string;
  /** Data test ID for testing */
  'data-testid'?: string;
  /** Whether to display the field in a loading state */
  isLoading?: boolean;
}

/**
 * Text field props (input type="text", "email", "password", etc.)
 */
export interface TextFieldProps extends BaseFormFieldProps, InputFieldEventHandlers {
  /** Field type discriminator */
  fieldType: 'text';
  /** HTML input type */
  type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  /** Field value */
  value: string;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum allowed characters */
  maxLength?: number;
  /** Minimum allowed characters */
  minLength?: number;
  /** Keypress event handler */
  onKeyPress?: InputKeyPressHandler;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Whether to enable spellcheck */
  spellCheck?: boolean;
  /** Validation functions */
  validators?: ValidatorFn<string>[];
}

/**
 * Textarea field props
 */
export interface TextAreaFieldProps extends BaseFormFieldProps, TextAreaFieldEventHandlers {
  /** Field type discriminator */
  fieldType: 'textarea';
  /** Field value */
  value: string;
  /** Placeholder text */
  placeholder?: string;
  /** Number of rows */
  rows?: number;
  /** Maximum allowed characters */
  maxLength?: number;
  /** Whether to resize the textarea */
  resizable?: boolean;
  /** Validation functions */
  validators?: ValidatorFn<string>[];
}

/**
 * Select field props
 */
export interface SelectFieldProps extends BaseFormFieldProps, SelectFieldEventHandlers {
  /** Field type discriminator */
  fieldType: 'select';
  /** Field value */
  value: string;
  /** Options array */
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  /** Placeholder text (first option) */
  placeholder?: string;
  /** Validation functions */
  validators?: ValidatorFn<string>[];
}

/**
 * Checkbox field props
 */
export interface CheckboxFieldProps extends BaseFormFieldProps, CheckboxFieldEventHandlers {
  /** Field type discriminator */
  fieldType: 'checkbox';
  /** Checked state */
  checked: boolean;
  /** Whether to display the label on the right (default) or left */
  labelPosition?: 'left' | 'right';
  /** Validation functions */
  validators?: ValidatorFn<boolean>[];
}

/**
 * Radio field props
 */
export interface RadioFieldProps extends BaseFormFieldProps, CheckboxFieldEventHandlers {
  /** Field type discriminator */
  fieldType: 'radio';
  /** Radio value */
  value: string;
  /** Selected value (from radio group) */
  selectedValue: string;
  /** Whether to display the label on the right (default) or left */
  labelPosition?: 'left' | 'right';
  /** Validation functions */
  validators?: ValidatorFn<string>[];
}

/**
 * Radio group props
 */
export interface RadioGroupFieldProps extends BaseFormFieldProps {
  /** Field type discriminator */
  fieldType: 'radiogroup';
  /** Group value */
  value: string;
  /** Options array */
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  /** Change event handler */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Validation functions */
  validators?: ValidatorFn<string>[];
}

/**
 * Switch/Toggle field props
 */
export interface SwitchFieldProps extends BaseFormFieldProps, CheckboxFieldEventHandlers {
  /** Field type discriminator */
  fieldType: 'switch';
  /** Checked state */
  checked: boolean;
  /** Optional on/off labels */
  onLabel?: string;
  /** Optional off label */
  offLabel?: string;
  /** Validation functions */
  validators?: ValidatorFn<boolean>[];
}

/**
 * Date picker field props
 */
export interface DateFieldProps extends BaseFormFieldProps, InputFieldEventHandlers {
  /** Field type discriminator */
  fieldType: 'date';
  /** Field value (ISO date string) */
  value: string;
  /** Min date (ISO string) */
  min?: string;
  /** Max date (ISO string) */
  max?: string;
  /** Validation functions */
  validators?: ValidatorFn<string>[];
}

/**
 * File upload field props
 */
export interface FileFieldProps extends BaseFormFieldProps {
  /** Field type discriminator */
  fieldType: 'file';
  /** Selected file */
  value?: File | null;
  /** Change event handler */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur event handler */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Focus event handler */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Accepted file types */
  accept?: string;
  /** Whether to accept multiple files */
  multiple?: boolean;
  /** Custom upload button text */
  buttonText?: string;
  /** Validation functions */
  validators?: ValidatorFn<File | null>[];
}

/**
 * Discriminated union type for all form field types
 */
export type FormFieldProps =
  | TextFieldProps
  | TextAreaFieldProps
  | SelectFieldProps
  | CheckboxFieldProps
  | RadioFieldProps
  | RadioGroupFieldProps
  | SwitchFieldProps
  | DateFieldProps
  | FileFieldProps
  | MultiSelectFieldProps;

/**
 * Type guard for TextField
 */
export const isTextField = (props: FormFieldProps): props is TextFieldProps =>
  props.fieldType === 'text';

/**
 * Type guard for TextAreaField
 */
export const isTextAreaField = (props: FormFieldProps): props is TextAreaFieldProps =>
  props.fieldType === 'textarea';

/**
 * Type guard for SelectField
 */
export const isSelectField = (props: FormFieldProps): props is SelectFieldProps =>
  props.fieldType === 'select';

/**
 * Type guard for CheckboxField
 */
export const isCheckboxField = (props: FormFieldProps): props is CheckboxFieldProps =>
  props.fieldType === 'checkbox';

/**
 * Type guard for RadioField
 */
export const isRadioField = (props: FormFieldProps): props is RadioFieldProps =>
  props.fieldType === 'radio';

/**
 * Type guard for RadioGroupField
 */
export const isRadioGroupField = (props: FormFieldProps): props is RadioGroupFieldProps =>
  props.fieldType === 'radiogroup';

/**
 * Type guard for SwitchField
 */
export const isSwitchField = (props: FormFieldProps): props is SwitchFieldProps =>
  props.fieldType === 'switch';

/**
 * Type guard for DateField
 */
export const isDateField = (props: FormFieldProps): props is DateFieldProps =>
  props.fieldType === 'date';

/**
 * Type guard for FileField
 */
export const isFileField = (props: FormFieldProps): props is FileFieldProps =>
  props.fieldType === 'file';

/**
 * Type guard for MultiSelectField
 */
export const isMultiSelectField = (props: FormFieldProps): props is MultiSelectFieldProps =>
  props.fieldType === 'multiselect';

/**
 * Utility function to generate a field ID
 */
export const generateFieldId = (name: string, label?: string): string => {
  if (label) {
    return `field-${name}-${label.replace(/\s+/g, '-').toLowerCase()}`;
  }
  return `field-${name}`;
};

/**
 * Utility function to narrow props to specific field types
 */
export function narrowFieldProps<T extends FormFieldProps>(
  props: FormFieldProps,
  fieldType: T['fieldType']
): T | null {
  return props.fieldType === fieldType ? (props as T) : null;
} 