import React from 'react';
import logger from '../../../../utils/logger';

/**
 * Base properties common to all form field types
 */
export interface BaseFormFieldProps {
    /**
     * Unique identifier for the field
     */
    id: string;

    /**
     * Label text to display
     */
    label: string;

    /**
     * Name attribute for the field
     */
    name: string;

    /**
     * Whether the field is required
     */
    required?: boolean;

    /**
     * Whether the field is disabled
     */
    disabled?: boolean;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Data attributes for testing
     */
    'data-testid'?: string;

    /**
     * Additional help text to display
     */
    helpText?: string;
}

/**
 * Event handler type for text input changes
 */
export type TextFieldChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
) => void;

/**
 * Event handler type for textarea changes
 */
export type TextAreaChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
) => void;

/**
 * Event handler type for select changes
 */
export type SelectFieldChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
) => void;

/**
 * Event handler type for checkbox changes
 */
export type CheckboxChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
) => void;

/**
 * Properties for text input fields
 */
export interface TextFieldProps extends BaseFormFieldProps {
    /**
     * Type of text input
     */
    type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'search' | 'date';

    /**
     * Current value of the field
     */
    value: string;

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Change event handler
     */
    onChange: TextFieldChangeHandler;

    /**
     * Maximum length of input
     */
    maxLength?: number;

    /**
     * Minimum length of input
     */
    minLength?: number;

    /**
     * Pattern for validation
     */
    pattern?: string;

    /**
     * Discriminator property
     * @internal
     */
    options?: never;

    /**
     * Discriminator property
     * @internal
     */
    checked?: never;

    /**
     * Discriminator property
     * @internal
     */
    rows?: never;
}

/**
 * Properties for textarea fields
 */
export interface TextAreaFieldProps extends BaseFormFieldProps {
    /**
     * Current value of the field
     */
    value: string;

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Change event handler
     */
    onChange: TextAreaChangeHandler;

    /**
     * Number of rows to display
     */
    rows?: number;

    /**
     * Maximum length of input
     */
    maxLength?: number;

    /**
     * Minimum length of input
     */
    minLength?: number;

    /**
     * Discriminator property
     * @internal
     */
    type?: never;

    /**
     * Discriminator property
     * @internal
     */
    options?: never;

    /**
     * Discriminator property
     * @internal
     */
    checked?: never;
}

/**
 * Option for select fields
 */
export interface SelectOption {
    /**
     * Value of the option
     */
    value: string;

    /**
     * Text to display
     */
    label: string;

    /**
     * Whether the option is disabled
     */
    disabled?: boolean;
}

/**
 * Properties for select fields
 */
export interface SelectFieldProps extends BaseFormFieldProps {
    /**
     * Current value of the field
     */
    value: string;

    /**
     * Available options
     */
    options: SelectOption[];

    /**
     * Change event handler
     */
    onChange: SelectFieldChangeHandler;

    /**
     * Placeholder text (first option)
     */
    placeholder?: string;

    /**
     * Discriminator property
     * @internal
     */
    type?: never;

    /**
     * Discriminator property
     * @internal
     */
    checked?: never;

    /**
     * Discriminator property
     * @internal
     */
    rows?: never;
}

/**
 * Properties for checkbox fields
 */
export interface CheckboxFieldProps extends BaseFormFieldProps {
    /**
     * Whether the checkbox is checked
     */
    checked: boolean;

    /**
     * Change event handler
     */
    onChange: CheckboxChangeHandler;

    /**
     * Discriminator property
     * @internal
     */
    type?: never;

    /**
     * Discriminator property
     * @internal
     */
    value?: never;

    /**
     * Discriminator property
     * @internal
     */
    placeholder?: never;

    /**
     * Discriminator property
     * @internal
     */
    options?: never;

    /**
     * Discriminator property
     * @internal
     */
    rows?: never;
}

/**
 * Union type of all possible form field props
 */
export type FormFieldProps =
    | TextFieldProps
    | TextAreaFieldProps
    | SelectFieldProps
    | CheckboxFieldProps;

/**
 * Type guard to check if form field props represent a text field
 * 
 * @param props - Form field properties to check
 * @returns True if the props are for a text field
 */
export const isTextField = (props: FormFieldProps): props is TextFieldProps => {
    return 'type' in props && typeof props.type === 'string';
};

/**
 * Type guard to check if form field props represent a textarea field
 * 
 * @param props - Form field properties to check
 * @returns True if the props are for a textarea field
 */
export const isTextAreaField = (props: FormFieldProps): props is TextAreaFieldProps => {
    return 'rows' in props || ('value' in props && !('type' in props) && !('options' in props) && !('checked' in props));
};

/**
 * Type guard to check if form field props represent a select field
 * 
 * @param props - Form field properties to check
 * @returns True if the props are for a select field
 */
export const isSelectField = (props: FormFieldProps): props is SelectFieldProps => {
    return 'options' in props && Array.isArray(props.options);
};

/**
 * Type guard to check if form field props represent a checkbox field
 * 
 * @param props - Form field properties to check
 * @returns True if the props are for a checkbox field
 */
export const isCheckboxField = (props: FormFieldProps): props is CheckboxFieldProps => {
    return 'checked' in props && typeof props.checked === 'boolean';
};

/**
 * Creates a logged form field change handler that logs the event before calling the original handler
 * 
 * @param handler - Original change handler
 * @param context - Additional context to log
 * @returns New handler that logs and then calls the original
 */
export const createLoggedChangeHandler = <T extends HTMLElement>(
    handler: (event: React.ChangeEvent<T>) => void,
    context: Record<string, unknown>
): (event: React.ChangeEvent<T>) => void => {
    return (event: React.ChangeEvent<T>) => {
        logger.info('Form field changed', {
            ...context,
            value: 'value' in event.target ? event.target.value : undefined,
            checked: 'checked' in event.target ? event.target.checked : undefined,
        });
        handler(event);
    };
}; 