/**
 * FormField Component Tests
 */

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

describe('FormField Type Guards', () => {
  describe('isTextField', () => {
    it('should return true for text field props', () => {
      const props: FormFieldProps = {
        fieldType: 'text',
        name: 'testField',
        value: 'test value',
        type: 'text',
        onChange: jest.fn()
      };

      expect(isTextField(props)).toBe(true);
    });

    it('should return false for non-text field props', () => {
      const props: FormFieldProps = {
        fieldType: 'textarea',
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
        fieldType: 'textarea',
        name: 'testField',
        value: 'test value',
        onChange: jest.fn()
      };

      expect(isTextAreaField(props)).toBe(true);
    });

    it('should return false for non-textarea field props', () => {
      const props: FormFieldProps = {
        fieldType: 'text',
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
        fieldType: 'select',
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
        fieldType: 'text',
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
        fieldType: 'checkbox',
        name: 'testField',
        checked: true,
        onChange: jest.fn()
      };

      expect(isCheckboxField(props)).toBe(true);
    });

    it('should return false for non-checkbox field props', () => {
      const props: FormFieldProps = {
        fieldType: 'text',
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
        fieldType: 'radio',
        name: 'testField',
        value: 'option1',
        selectedValue: 'option1',
        onChange: jest.fn()
      };

      expect(isRadioField(props)).toBe(true);
    });

    it('should return false for non-radio field props', () => {
      const props: FormFieldProps = {
        fieldType: 'text',
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
        fieldType: 'radiogroup',
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
        fieldType: 'text',
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
        fieldType: 'switch',
        name: 'testField',
        checked: true,
        onChange: jest.fn()
      };

      expect(isSwitchField(props)).toBe(true);
    });

    it('should return false for non-switch field props', () => {
      const props: FormFieldProps = {
        fieldType: 'text',
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
        fieldType: 'date',
        name: 'testField',
        value: '2023-04-15',
        onChange: jest.fn()
      };

      expect(isDateField(props)).toBe(true);
    });

    it('should return false for non-date field props', () => {
      const props: FormFieldProps = {
        fieldType: 'text',
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
        fieldType: 'file',
        name: 'testField',
        value: null,
        onChange: jest.fn()
      };

      expect(isFileField(props)).toBe(true);
    });

    it('should return false for non-file field props', () => {
      const props: FormFieldProps = {
        fieldType: 'text',
        name: 'testField',
        value: 'test value',
        type: 'text',
        onChange: jest.fn()
      };

      expect(isFileField(props)).toBe(false);
    });
  });
}); 