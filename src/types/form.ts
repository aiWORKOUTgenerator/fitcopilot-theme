/**
 * Form component type definitions
 * 
 * This file provides centralized type definitions for all form-related components
 * and functionality, using a discriminated union pattern for strong typing.
 */

import React from 'react';
import {
  InputChangeHandler,
  InputKeyPressHandler,
  SelectChangeHandler,
  TextAreaChangeHandler
} from './events';

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
export interface TextFieldProps extends BaseFormFieldProps {
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
    /** Change event handler */
    onChange: InputChangeHandler;
    /** Blur event handler */
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    /** Focus event handler */
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
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
export interface TextAreaFieldProps extends BaseFormFieldProps {
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
    /** Change event handler */
    onChange: TextAreaChangeHandler;
    /** Blur event handler */
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    /** Focus event handler */
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
    /** Whether to resize the textarea */
    resizable?: boolean;
    /** Validation functions */
    validators?: ValidatorFn<string>[];
}

/**
 * Select option type
 */
export interface SelectOption {
    /** Option value */
    value: string;
    /** Option display label */
    label: string;
    /** Whether the option is disabled */
    disabled?: boolean;
}

/**
 * Select field props
 */
export interface SelectFieldProps extends BaseFormFieldProps {
    /** Field type discriminator */
    fieldType: 'select';
    /** Field value */
    value: string;
    /** Options array */
    options: SelectOption[];
    /** Placeholder text (first option) */
    placeholder?: string;
    /** Change event handler */
    onChange: SelectChangeHandler;
    /** Blur event handler */
    onBlur?: React.FocusEventHandler<HTMLSelectElement>;
    /** Focus event handler */
    onFocus?: React.FocusEventHandler<HTMLSelectElement>;
    /** Validation functions */
    validators?: ValidatorFn<string>[];
}

/**
 * Checkbox field props
 */
export interface CheckboxFieldProps extends BaseFormFieldProps {
    /** Field type discriminator */
    fieldType: 'checkbox';
    /** Checked state */
    checked: boolean;
    /** Change event handler */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Whether to display the label on the right (default) or left */
    labelPosition?: 'left' | 'right';
    /** Validation functions */
    validators?: ValidatorFn<boolean>[];
}

/**
 * Radio field props
 */
export interface RadioFieldProps extends BaseFormFieldProps {
    /** Field type discriminator */
    fieldType: 'radio';
    /** Radio value */
    value: string;
    /** Selected value (from radio group) */
    selectedValue: string;
    /** Change event handler */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
    options: SelectOption[];
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
export interface SwitchFieldProps extends BaseFormFieldProps {
    /** Field type discriminator */
    fieldType: 'switch';
    /** Checked state */
    checked: boolean;
    /** Change event handler */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
export interface DateFieldProps extends BaseFormFieldProps {
    /** Field type discriminator */
    fieldType: 'date';
    /** Field value (ISO date string) */
    value: string;
    /** Min date (ISO string) */
    min?: string;
    /** Max date (ISO string) */
    max?: string;
    /** Change event handler */
    onChange: InputChangeHandler;
    /** Blur event handler */
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    /** Focus event handler */
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
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
    | FileFieldProps;

/**
 * Form field validator function type
 */
export type ValidatorFn<T = unknown> = (value: T) => string | null;

/**
 * Form values type
 */
export interface FormValues {
    [key: string]: string | boolean | string[] | File | null | undefined;
}

/**
 * Form errors type
 */
export interface FormErrors {
    [key: string]: string | null | undefined;
}

/**
 * Form touched fields type
 */
export interface FormTouched {
    [key: string]: boolean;
}

/**
 * Form context props
 */
export interface FormContextProps {
    values: FormValues;
    errors: FormErrors;
    touched: FormTouched;
    isSubmitting: boolean;
    isValid: boolean;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    setFieldValue: (field: string, value: FormValues[keyof FormValues]) => void;
    setFieldTouched: (field: string, isTouched: boolean) => void;
    setFieldError: (field: string, error: string | null) => void;
    resetForm: () => void;
}

/**
 * Form component props
 */
export interface FormProps {
    /** Initial form values */
    initialValues: FormValues;
    /** Form submission handler */
    onSubmit: (values: FormValues) => void | Promise<void>;
    /** Function to validate all form values at once */
    validate?: (values: FormValues) => FormErrors;
    /** Children can be function to access form context */
    children: React.ReactNode | ((props: FormContextProps) => React.ReactNode);
    /** Additional CSS class name */
    className?: string;
    /** Called when form validation state changes */
    onValidChange?: (isValid: boolean) => void;
    /** Validation behavior - validate on change, blur, or submit */
    validateOn?: 'change' | 'blur' | 'submit';
}

/**
 * Form validation props
 */
export interface ValidationProps {
    /** Function to validate values */
    validate?: (values: FormValues) => FormErrors;
    /** Individual field validators */
    fieldValidators?: {
        [field: string]: ValidatorFn<FormValues[keyof FormValues]>[];
    };
} 