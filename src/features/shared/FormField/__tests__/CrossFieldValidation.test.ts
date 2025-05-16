/**
 * Cross-field validation tests
 */

import { composeValidators, fieldsDiffer, fieldsMatch, validateIf } from '../validators';

describe('Cross-field validators', () => {
  describe('fieldsMatch', () => {
    it('should validate that two fields match', () => {
      const validator = fieldsMatch('password', 'Passwords must match');
      const formValues = {
        password: 'abc123',
        confirmPassword: 'abc123'
      };

      // Fields match, should return null (valid)
      const result = validator(formValues.confirmPassword, formValues);
      expect(result).toBeNull();
    });

    it('should return error when fields do not match', () => {
      const validator = fieldsMatch('password', 'Passwords must match');
      const formValues = {
        password: 'abc123',
        confirmPassword: 'abc1234'
      };

      // Fields don't match, should return error message
      const result = validator(formValues.confirmPassword, formValues);
      expect(result).toBe('Passwords must match');
    });

    it('should return error when source field does not exist', () => {
      const validator = fieldsMatch('nonExistentField', 'Fields must match');
      const formValues = {
        confirmPassword: 'abc123'
      };

      // Source field doesn't exist, should return error message
      const result = validator(formValues.confirmPassword, formValues);
      expect(result).toBe('Fields must match');
    });
  });

  describe('fieldsDiffer', () => {
    it('should validate that two fields differ', () => {
      const validator = fieldsDiffer('oldPassword', 'New password must be different from old password');
      const formValues = {
        oldPassword: 'abc123',
        newPassword: 'xyz789'
      };

      // Fields differ, should return null (valid)
      const result = validator(formValues.newPassword, formValues);
      expect(result).toBeNull();
    });

    it('should return error when fields are the same', () => {
      const validator = fieldsDiffer('oldPassword', 'New password must be different from old password');
      const formValues = {
        oldPassword: 'abc123',
        newPassword: 'abc123'
      };

      // Fields are the same, should return error message
      const result = validator(formValues.newPassword, formValues);
      expect(result).toBe('New password must be different from old password');
    });

    it('should return null when source field does not exist', () => {
      const validator = fieldsDiffer('nonExistentField', 'Fields must differ');
      const formValues = {
        newPassword: 'abc123'
      };

      // Source field doesn't exist, should be valid
      const result = validator(formValues.newPassword, formValues);
      expect(result).toBeNull();
    });
  });

  describe('validateIf', () => {
    it('should run validator when condition is true', () => {
      const condition = (value: string) => value.length > 0;
      const validator = (value: string) => value.length < 5 ? 'Too short' : null;
      const conditionalValidator = validateIf(condition, validator);

      // Condition is true and validation fails
      expect(conditionalValidator('abc')).toBe('Too short');

      // Condition is true but validation passes
      expect(conditionalValidator('abcdef')).toBeNull();
    });

    it('should not run validator when condition is false', () => {
      const condition = (value: string) => value.length > 0;
      const validator = (value: string) => 'Should not be called';
      const conditionalValidator = validateIf(condition, validator);

      // Condition is false, validator should not run
      expect(conditionalValidator('')).toBeNull();
    });

    it('should work with form values in condition', () => {
      const condition = (value: string, allValues?: Record<string, any>) => 
        allValues?.isRequired === true;
      
      const validator = (value: string) => !value ? 'This field is required' : null;
      const conditionalValidator = validateIf(condition, validator);

      // Condition is true (isRequired=true) and validation fails (empty value)
      expect(conditionalValidator('', { isRequired: true })).toBe('This field is required');

      // Condition is false (isRequired=false) so validator doesn't run
      expect(conditionalValidator('', { isRequired: false })).toBeNull();
    });
  });

  describe('composeValidators', () => {
    it('should run multiple validators in sequence', () => {
      const minLength = (value: string) => value.length < 3 ? 'Too short' : null;
      const maxLength = (value: string) => value.length > 10 ? 'Too long' : null;
      const noSpaces = (value: string) => value.includes(' ') ? 'No spaces allowed' : null;

      const composedValidator = composeValidators([minLength, maxLength, noSpaces]);

      // First validator fails
      expect(composedValidator('ab')).toBe('Too short');

      // Second validator fails
      expect(composedValidator('abcdefghijklm')).toBe('Too long');

      // Third validator fails
      expect(composedValidator('abc def')).toBe('No spaces allowed');

      // All validators pass
      expect(composedValidator('abcdefgh')).toBeNull();
    });

    it('should return null when no validators are provided', () => {
      const composedValidator = composeValidators([]);
      expect(composedValidator('any value')).toBeNull();
    });
  });
}); 