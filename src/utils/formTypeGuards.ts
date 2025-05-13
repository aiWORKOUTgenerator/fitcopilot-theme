/**
 * Type guards for form field components
 * 
 * This file contains type guard implementations for safely working with
 * form field components. These guards help with type narrowing to ensure
 * type safety when handling different form field variants.
 */

import {
    CheckboxFieldProps,
    DateFieldProps,
    FileFieldProps,
    FormFieldProps,
    RadioFieldProps,
    RadioGroupFieldProps,
    SelectFieldProps,
    SwitchFieldProps,
    TextAreaFieldProps,
    TextFieldProps
} from '../types/form';

/**
 * Type guard to check if props are for a text field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a text field
 */
export function isTextField(props: FormFieldProps): props is TextFieldProps {
    return props.fieldType === 'text';
}

/**
 * Type guard to check if props are for a textarea field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a textarea field
 */
export function isTextAreaField(props: FormFieldProps): props is TextAreaFieldProps {
    return props.fieldType === 'textarea';
}

/**
 * Type guard to check if props are for a select field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a select field
 */
export function isSelectField(props: FormFieldProps): props is SelectFieldProps {
    return props.fieldType === 'select';
}

/**
 * Type guard to check if props are for a checkbox field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a checkbox field
 */
export function isCheckboxField(props: FormFieldProps): props is CheckboxFieldProps {
    return props.fieldType === 'checkbox';
}

/**
 * Type guard to check if props are for a radio field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a radio field
 */
export function isRadioField(props: FormFieldProps): props is RadioFieldProps {
    return props.fieldType === 'radio';
}

/**
 * Type guard to check if props are for a radio group field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a radio group field
 */
export function isRadioGroupField(props: FormFieldProps): props is RadioGroupFieldProps {
    return props.fieldType === 'radiogroup';
}

/**
 * Type guard to check if props are for a switch field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a switch field
 */
export function isSwitchField(props: FormFieldProps): props is SwitchFieldProps {
    return props.fieldType === 'switch';
}

/**
 * Type guard to check if props are for a date field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a date field
 */
export function isDateField(props: FormFieldProps): props is DateFieldProps {
    return props.fieldType === 'date';
}

/**
 * Type guard to check if props are for a file field
 * 
 * @param props The form field props to check
 * @returns Type predicate indicating if props are for a file field
 */
export function isFileField(props: FormFieldProps): props is FileFieldProps {
    return props.fieldType === 'file';
}

/**
 * Type guard to check if a form field has validation
 * 
 * @param props The form field props to check
 * @returns Whether the field has validators
 */
export function hasValidators(props: FormFieldProps): boolean {
    return 'validators' in props && !!props.validators && props.validators.length > 0;
}

/**
 * Type guard to check if a form field has an error
 * 
 * @param props The form field props to check
 * @returns Whether the field has an error
 */
export function hasError(props: FormFieldProps): boolean {
    return 'error' in props && !!props.error;
}

/**
 * Type guard to check if a form field is required
 * 
 * @param props The form field props to check
 * @returns Whether the field is required
 */
export function isRequiredField(props: FormFieldProps): boolean {
    return 'required' in props && !!props.required;
}

/**
 * Type guard to check if a form field is disabled
 * 
 * @param props The form field props to check
 * @returns Whether the field is disabled
 */
export function isDisabledField(props: FormFieldProps): boolean {
    return 'disabled' in props && !!props.disabled;
}

export default {
    isTextField,
    isTextAreaField,
    isSelectField,
    isCheckboxField,
    isRadioField,
    isRadioGroupField,
    isSwitchField,
    isDateField,
    isFileField,
    hasValidators,
    hasError,
    isRequiredField,
    isDisabledField
}; 