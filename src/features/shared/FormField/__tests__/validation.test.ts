/**
 * Form Validation Tests
 */

import {
  validateEmail,
  validateMax,
  validateMaxLength,
  validateMin,
  validateMinLength,
  validateNumeric,
  validatePattern,
  validateRequired
} from '../validators';

describe('Form Field Validators', () => {
  describe('validateRequired', () => {
    it('returns error message for empty string', () => {
      const validator = validateRequired('This field is required');
      const result = validator('');
      expect(result).toBe('This field is required');
    });

    it('returns error message for null value', () => {
      const validator = validateRequired('This field is required');
      const result = validator(null);
      expect(result).toBe('This field is required');
    });

    it('returns error message for undefined value', () => {
      const validator = validateRequired('This field is required');
      const result = validator(undefined);
      expect(result).toBe('This field is required');
    });

    it('returns null for non-empty string', () => {
      const validator = validateRequired('This field is required');
      const result = validator('some value');
      expect(result).toBeNull();
    });

    it('returns null for boolean value true', () => {
      const validator = validateRequired('This field is required');
      const result = validator(true);
      expect(result).toBeNull();
    });
  });

  describe('validateMinLength', () => {
    it('returns error message for string shorter than min length', () => {
      const validator = validateMinLength(5, 'Must be at least 5 characters');
      const result = validator('abcd');
      expect(result).toBe('Must be at least 5 characters');
    });

    it('returns null for string equal to min length', () => {
      const validator = validateMinLength(5, 'Must be at least 5 characters');
      const result = validator('abcde');
      expect(result).toBeNull();
    });

    it('returns null for string longer than min length', () => {
      const validator = validateMinLength(5, 'Must be at least 5 characters');
      const result = validator('abcdefg');
      expect(result).toBeNull();
    });
  });

  describe('validateMaxLength', () => {
    it('returns error message for string longer than max length', () => {
      const validator = validateMaxLength(5, 'Must be at most 5 characters');
      const result = validator('abcdef');
      expect(result).toBe('Must be at most 5 characters');
    });

    it('returns null for string equal to max length', () => {
      const validator = validateMaxLength(5, 'Must be at most 5 characters');
      const result = validator('abcde');
      expect(result).toBeNull();
    });

    it('returns null for string shorter than max length', () => {
      const validator = validateMaxLength(5, 'Must be at most 5 characters');
      const result = validator('abc');
      expect(result).toBeNull();
    });
  });

  describe('validateEmail', () => {
    it('returns error message for invalid email format', () => {
      const validator = validateEmail('Please enter a valid email address');
      const invalidEmails = [
        'plainaddress',
        '@missingusername.com',
        'missing.domain@',
        'missing@domain',
        'two..consecutive@dots.com',
        'invalid@special!chars.com'
      ];

      invalidEmails.forEach(email => {
        const result = validator(email);
        expect(result).toBe('Please enter a valid email address');
      });
    });

    it('returns null for valid email format', () => {
      const validator = validateEmail('Please enter a valid email address');
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'disposable.style.email.with+symbol@example.com',
        'other.email-with-hyphen@example.com',
        'fully-qualified-domain@example.com',
        'user.name+tag+sorting@example.com',
        'x@example.com'
      ];

      validEmails.forEach(email => {
        const result = validator(email);
        expect(result).toBeNull();
      });
    });
  });

  describe('validatePattern', () => {
    it('returns error message when value does not match pattern', () => {
      const validator = validatePattern(/^[A-Z]{2}\d{4}$/, 'Must be in format XX0000');
      const result = validator('AB123');
      expect(result).toBe('Must be in format XX0000');
    });

    it('returns null when value matches pattern', () => {
      const validator = validatePattern(/^[A-Z]{2}\d{4}$/, 'Must be in format XX0000');
      const result = validator('AB1234');
      expect(result).toBeNull();
    });
  });

  describe('validateNumeric', () => {
    it('returns error message for non-numeric value', () => {
      const validator = validateNumeric('Must be a number');
      const nonNumeric = ['abc', '12a', 'a12', '$100'];

      nonNumeric.forEach(value => {
        const result = validator(value);
        expect(result).toBe('Must be a number');
      });
    });

    it('returns null for numeric value', () => {
      const validator = validateNumeric('Must be a number');
      const numeric = ['123', '0', '-123', '123.45', '-123.45'];

      numeric.forEach(value => {
        const result = validator(value);
        expect(result).toBeNull();
      });
    });
  });

  describe('validateMin', () => {
    it('returns error message for value less than min', () => {
      const validator = validateMin(5, 'Value must be at least 5');
      const result = validator('4');
      expect(result).toBe('Value must be at least 5');
    });

    it('returns null for value equal to min', () => {
      const validator = validateMin(5, 'Value must be at least 5');
      const result = validator('5');
      expect(result).toBeNull();
    });

    it('returns null for value greater than min', () => {
      const validator = validateMin(5, 'Value must be at least 5');
      const result = validator('10');
      expect(result).toBeNull();
    });
  });

  describe('validateMax', () => {
    it('returns error message for value greater than max', () => {
      const validator = validateMax(5, 'Value must be at most 5');
      const result = validator('6');
      expect(result).toBe('Value must be at most 5');
    });

    it('returns null for value equal to max', () => {
      const validator = validateMax(5, 'Value must be at most 5');
      const result = validator('5');
      expect(result).toBeNull();
    });

    it('returns null for value less than max', () => {
      const validator = validateMax(5, 'Value must be at most 5');
      const result = validator('3');
      expect(result).toBeNull();
    });
  });
}); 