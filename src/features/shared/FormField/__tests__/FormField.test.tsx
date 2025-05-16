/**
 * FormField Component Tests
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
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
} from '../types';

// Import the FormField component
import {
  createCheckboxFieldProps,
  createSelectFieldProps,
  createTextAreaFieldProps,
  createTextFieldProps
} from '../__fixtures__/formFieldFixtures';
import FormField from '../fields/FormField';

describe('FormField Type Guards', () => {
    describe('isTextField', () => {
        it('should return true for text field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isTextField(props)).toBe(true);
        });

        it('should return false for non-text field props', () => {
            const props: FormFieldProps = {
                variant: 'textarea',
                name: 'testField',
                value: 'test value',
                onChange: jest.fn()
            };

            expect(isTextField(props)).toBe(false);
        });
    });

    describe('isTextAreaField', () => {
        it('should return true for textarea field props', () => {
            const props: FormFieldProps = {
                variant: 'textarea',
                name: 'testField',
                value: 'test value',
                onChange: jest.fn()
            };

            expect(isTextAreaField(props)).toBe(true);
        });

        it('should return false for non-textarea field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isTextAreaField(props)).toBe(false);
        });
    });

    describe('isSelectField', () => {
        it('should return true for select field props', () => {
            const props: FormFieldProps = {
                variant: 'select',
                name: 'testField',
                value: 'option1',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' }
                ],
                onChange: jest.fn()
            };

            expect(isSelectField(props)).toBe(true);
        });

        it('should return false for non-select field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isSelectField(props)).toBe(false);
        });
    });

    describe('isCheckboxField', () => {
        it('should return true for checkbox field props', () => {
            const props: FormFieldProps = {
                variant: 'checkbox',
                name: 'testField',
                checked: true,
                onChange: jest.fn()
            };

            expect(isCheckboxField(props)).toBe(true);
        });

        it('should return false for non-checkbox field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isCheckboxField(props)).toBe(false);
        });
    });

    describe('isRadioField', () => {
        it('should return true for radio field props', () => {
            const props: FormFieldProps = {
                variant: 'radio',
                name: 'testField',
                value: 'option1',
                selectedValue: 'option1',
                onChange: jest.fn()
            };

            expect(isRadioField(props)).toBe(true);
        });

        it('should return false for non-radio field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isRadioField(props)).toBe(false);
        });
    });

    describe('isRadioGroupField', () => {
        it('should return true for radio group field props', () => {
            const props: FormFieldProps = {
                variant: 'radiogroup',
                name: 'testField',
                value: 'option1',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' }
                ],
                onChange: jest.fn()
            };

            expect(isRadioGroupField(props)).toBe(true);
        });

        it('should return false for non-radio-group field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isRadioGroupField(props)).toBe(false);
        });
    });

    describe('isSwitchField', () => {
        it('should return true for switch field props', () => {
            const props: FormFieldProps = {
                variant: 'switch',
                name: 'testField',
                checked: true,
                onChange: jest.fn()
            };

            expect(isSwitchField(props)).toBe(true);
        });

        it('should return false for non-switch field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isSwitchField(props)).toBe(false);
        });
    });

    describe('isDateField', () => {
        it('should return true for date field props', () => {
            const props: FormFieldProps = {
                variant: 'date',
                name: 'testField',
                value: '2023-04-15',
                onChange: jest.fn()
            };

            expect(isDateField(props)).toBe(true);
        });

        it('should return false for non-date field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isDateField(props)).toBe(false);
        });
    });

    describe('isFileField', () => {
        it('should return true for file field props', () => {
            const props: FormFieldProps = {
                variant: 'file',
                name: 'testField',
                value: null,
                onChange: jest.fn()
            };

            expect(isFileField(props)).toBe(true);
        });

        it('should return false for non-file field props', () => {
            const props: FormFieldProps = {
                variant: 'text',
                name: 'testField',
                value: 'test value',
                type: 'text',
                onChange: jest.fn()
            };

            expect(isFileField(props)).toBe(false);
        });
    });
});

// Additional tests for FormField component rendering
describe('FormField Component Rendering', () => {
    it('renders TextField for text variant', () => {
        const props = createTextFieldProps({
            label: 'Text Field',
            value: 'Test Value'
        });

        render(<FormField {...props} />);

        const inputElement = screen.getByLabelText('Text Field');
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveValue('Test Value');
        expect(inputElement).toHaveClass('form-input', 'form-input--text');
    });

    it('renders TextAreaField for textarea variant', () => {
        const props = createTextAreaFieldProps({
            label: 'Text Area',
            value: 'Test Content'
        });

        render(<FormField {...props} />);

        const textareaElement = screen.getByLabelText('Text Area');
        expect(textareaElement).toBeInTheDocument();
        expect(textareaElement).toHaveValue('Test Content');
        expect(textareaElement).toHaveClass('form-textarea');
    });

    it('renders SelectField for select variant', () => {
        const props = createSelectFieldProps({
            label: 'Select Field',
            value: 'option2',
            options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' }
            ]
        });

        render(<FormField {...props} />);

        const selectElement = screen.getByLabelText('Select Field');
        expect(selectElement).toBeInTheDocument();
        expect(selectElement).toHaveValue('option2');
        expect(selectElement).toHaveClass('form-select');
    });

    it('renders CheckboxField for checkbox variant', () => {
        const props = createCheckboxFieldProps({
            label: 'Check me',
            checked: true
        });

        render(<FormField {...props} />);

        const checkboxElement = screen.getByLabelText('Check me');
        expect(checkboxElement).toBeInTheDocument();
        expect(checkboxElement).toBeChecked();
        expect(checkboxElement).toHaveClass('form-checkbox');
    });

    it('renders error message when error prop is provided', () => {
        const props = createTextFieldProps({
            label: 'Text Field',
            value: 'Test Value',
            error: 'This field has an error'
        });

        render(<FormField {...props} />);

        const errorMessage = screen.getByText('This field has an error');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveClass('form-field__message--error');
    });
}); 