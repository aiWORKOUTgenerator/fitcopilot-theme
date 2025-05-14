/**
 * Form Field Test Fixtures
 * 
 * This file provides helpers to create test fixtures for form field components.
 * These fixtures help maintain consistent test data and reduce test boilerplate.
 */

import {
    CheckboxFieldProps,
    DateFieldProps,
    FileFieldProps,
    RadioFieldProps,
    RadioGroupFieldProps,
    SelectFieldProps,
    SwitchFieldProps,
    TextAreaFieldProps,
    TextFieldProps
} from '../../../../types/form';

/**
 * Creates props for a text field with default values
 */
export const createTextFieldProps = (overrides: Partial<TextFieldProps> = {}): TextFieldProps => ({
    variant: 'text',
    name: 'textField',
    value: '',
    type: 'text',
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a textarea field with default values
 */
export const createTextAreaFieldProps = (overrides: Partial<TextAreaFieldProps> = {}): TextAreaFieldProps => ({
    variant: 'textarea',
    name: 'textareaField',
    value: '',
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a select field with default values
 */
export const createSelectFieldProps = (overrides: Partial<SelectFieldProps> = {}): SelectFieldProps => ({
    variant: 'select',
    name: 'selectField',
    value: '',
    options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a checkbox field with default values
 */
export const createCheckboxFieldProps = (overrides: Partial<CheckboxFieldProps> = {}): CheckboxFieldProps => ({
    variant: 'checkbox',
    name: 'checkboxField',
    checked: false,
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a radio field with default values
 */
export const createRadioFieldProps = (overrides: Partial<RadioFieldProps> = {}): RadioFieldProps => ({
    variant: 'radio',
    name: 'radioField',
    value: 'option1',
    selectedValue: '',
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a radio group field with default values
 */
export const createRadioGroupFieldProps = (overrides: Partial<RadioGroupFieldProps> = {}): RadioGroupFieldProps => ({
    variant: 'radiogroup',
    name: 'radioGroupField',
    value: '',
    options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a switch field with default values
 */
export const createSwitchFieldProps = (overrides: Partial<SwitchFieldProps> = {}): SwitchFieldProps => ({
    variant: 'switch',
    name: 'switchField',
    checked: false,
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a date field with default values
 */
export const createDateFieldProps = (overrides: Partial<DateFieldProps> = {}): DateFieldProps => ({
    variant: 'date',
    name: 'dateField',
    value: '',
    onChange: jest.fn(),
    ...overrides
});

/**
 * Creates props for a file field with default values
 */
export const createFileFieldProps = (overrides: Partial<FileFieldProps> = {}): FileFieldProps => ({
    variant: 'file',
    name: 'fileField',
    value: null,
    onChange: jest.fn(),
    ...overrides
}); 