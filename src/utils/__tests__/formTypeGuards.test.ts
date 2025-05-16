/**
 * Tests for form field type guards
 */

import {
  BaseFormFieldProps,
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
} from '../../features/shared/FormField/types';

import {
  hasError,
  hasValidators,
  isCheckboxField,
  isDateField,
  isDisabledField,
  isFileField,
  isRadioField,
  isRadioGroupField,
  isRequiredField,
  isSelectField,
  isSwitchField,
  isTextAreaField,
  isTextField
} from '../formTypeGuards';

describe('Form Field Type Guards', () => {
  // Base form field props for testing
  const baseFormFieldProps: BaseFormFieldProps = {
    name: 'test-field',
    label: 'Test Field',
    id: 'test-field-id'
  };

  describe('Field type guards', () => {
    it('should identify text fields', () => {
      const textField: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn()
      };

      expect(isTextField(textField)).toBe(true);
      expect(isTextField({ ...textField, fieldType: 'textarea' } as FormFieldProps)).toBe(false);
    });

    it('should identify textarea fields', () => {
      const textAreaField: TextAreaFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'textarea',
        value: '',
        onChange: jest.fn()
      };

      expect(isTextAreaField(textAreaField)).toBe(true);
      expect(isTextAreaField({ ...textAreaField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });

    it('should identify select fields', () => {
      const selectField: SelectFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'select',
        value: '',
        options: [],
        onChange: jest.fn()
      };

      expect(isSelectField(selectField)).toBe(true);
      expect(isSelectField({ ...selectField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });

    it('should identify checkbox fields', () => {
      const checkboxField: CheckboxFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'checkbox',
        checked: false,
        onChange: jest.fn()
      };

      expect(isCheckboxField(checkboxField)).toBe(true);
      expect(isCheckboxField({ ...checkboxField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });

    it('should identify radio fields', () => {
      const radioField: RadioFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'radio',
        value: 'option1',
        selectedValue: '',
        onChange: jest.fn()
      };

      expect(isRadioField(radioField)).toBe(true);
      expect(isRadioField({ ...radioField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });

    it('should identify radio group fields', () => {
      const radioGroupField: RadioGroupFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'radiogroup',
        value: '',
        options: [],
        onChange: jest.fn()
      };

      expect(isRadioGroupField(radioGroupField)).toBe(true);
      expect(isRadioGroupField({ ...radioGroupField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });

    it('should identify switch fields', () => {
      const switchField: SwitchFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'switch',
        checked: false,
        onChange: jest.fn()
      };

      expect(isSwitchField(switchField)).toBe(true);
      expect(isSwitchField({ ...switchField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });

    it('should identify date fields', () => {
      const dateField: DateFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'date',
        value: '',
        onChange: jest.fn()
      };

      expect(isDateField(dateField)).toBe(true);
      expect(isDateField({ ...dateField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });

    it('should identify file fields', () => {
      const fileField: FileFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'file',
        onChange: jest.fn()
      };

      expect(isFileField(fileField)).toBe(true);
      expect(isFileField({ ...fileField, fieldType: 'text' } as FormFieldProps)).toBe(false);
    });
  });

  describe('Field state guards', () => {
    it('should identify fields with validators', () => {
      const fieldWithValidators: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn(),
        validators: [jest.fn()]
      };

      const fieldWithoutValidators: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn()
      };

      expect(hasValidators(fieldWithValidators)).toBe(true);
      expect(hasValidators(fieldWithoutValidators)).toBe(false);
      expect(hasValidators({ ...fieldWithValidators, validators: [] })).toBe(false);
    });

    it('should identify fields with errors', () => {
      const fieldWithError: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn(),
        error: 'This field has an error'
      };

      const fieldWithoutError: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn()
      };

      expect(hasError(fieldWithError)).toBe(true);
      expect(hasError(fieldWithoutError)).toBe(false);
      expect(hasError({ ...fieldWithError, error: '' })).toBe(false);
    });

    it('should identify required fields', () => {
      const requiredField: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn(),
        required: true
      };

      const optionalField: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn(),
        required: false
      };

      expect(isRequiredField(requiredField)).toBe(true);
      expect(isRequiredField(optionalField)).toBe(false);
      expect(isRequiredField({ ...baseFormFieldProps, fieldType: 'text', type: 'text', value: '', onChange: jest.fn() })).toBe(false);
    });

    it('should identify disabled fields', () => {
      const disabledField: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn(),
        disabled: true
      };

      const enabledField: TextFieldProps = {
        ...baseFormFieldProps,
        fieldType: 'text',
        type: 'text',
        value: '',
        onChange: jest.fn(),
        disabled: false
      };

      expect(isDisabledField(disabledField)).toBe(true);
      expect(isDisabledField(enabledField)).toBe(false);
      expect(isDisabledField({ ...baseFormFieldProps, fieldType: 'text', type: 'text', value: '', onChange: jest.fn() })).toBe(false);
    });
  });
}); 