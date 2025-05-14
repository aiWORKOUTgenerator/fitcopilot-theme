/**
 * Additional Form Validator Tests
 * 
 * This file tests the validator functions not already covered in validation.test.ts
 */

import { composeValidators, validateEmail, validatePattern, validateRequired } from '../validators';

describe('Additional Form Field Validators', () => {
    describe('composeValidators', () => {
        it('combines multiple validators and returns first error', () => {
            const requiredValidator = validateRequired('Field is required');
            const emailValidator = validateEmail('Invalid email format');
            const composedValidator = composeValidators([requiredValidator, emailValidator]);

            // Should return the required error first (empty string)
            expect(composedValidator('')).toBe('Field is required');

            // Should return email error for invalid email
            expect(composedValidator('notanemail')).toBe('Invalid email format');

            // Should return null for valid input
            expect(composedValidator('test@example.com')).toBeNull();
        });

        it('returns null when all validators pass', () => {
            const patternValidator = validatePattern(/^[A-Z]{2}\d{2}$/, 'Invalid format');
            const composedValidator = composeValidators([patternValidator]);

            expect(composedValidator('AB12')).toBeNull();
        });

        it('handles empty validator array', () => {
            const composedValidator = composeValidators([]);

            expect(composedValidator('any value')).toBeNull();
            expect(composedValidator('')).toBeNull();
            expect(composedValidator(null)).toBeNull();
        });

        it('handles different validator types in combination', () => {
            const requiredValidator = validateRequired('Field is required');
            const patternValidator = validatePattern(/^\d{5}$/, 'Must be 5 digits');
            const composedValidator = composeValidators([requiredValidator, patternValidator]);

            // Empty fails required check
            expect(composedValidator('')).toBe('Field is required');

            // Non-empty but invalid pattern
            expect(composedValidator('123')).toBe('Must be 5 digits');
            expect(composedValidator('12345a')).toBe('Must be 5 digits');

            // Valid input passes both
            expect(composedValidator('12345')).toBeNull();
        });
    });

    describe('validatePattern with complex patterns', () => {
        it('validates postal codes correctly', () => {
            const postalCodeValidator = validatePattern(/^\d{5}(-\d{4})?$/, 'Invalid postal code');

            // Valid formats
            expect(postalCodeValidator('12345')).toBeNull();
            expect(postalCodeValidator('12345-6789')).toBeNull();

            // Invalid formats
            expect(postalCodeValidator('1234')).toBe('Invalid postal code');
            expect(postalCodeValidator('123456')).toBe('Invalid postal code');
            expect(postalCodeValidator('12345-')).toBe('Invalid postal code');
            expect(postalCodeValidator('12345-67')).toBe('Invalid postal code');
        });

        it('validates phone numbers correctly', () => {
            const phoneValidator = validatePattern(
                /^\(\d{3}\) \d{3}-\d{4}$/,
                'Invalid phone format'
            );

            // Valid format
            expect(phoneValidator('(123) 456-7890')).toBeNull();

            // Invalid formats
            expect(phoneValidator('123-456-7890')).toBe('Invalid phone format');
            expect(phoneValidator('(123)456-7890')).toBe('Invalid phone format');
            expect(phoneValidator('(123) 4567890')).toBe('Invalid phone format');
        });

        it('validates URL formats correctly', () => {
            const urlValidator = validatePattern(
                /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
                'Invalid URL'
            );

            // Valid URLs
            expect(urlValidator('https://example.com')).toBeNull();
            expect(urlValidator('http://www.example.com')).toBeNull();
            expect(urlValidator('www.example.com')).toBeNull();
            expect(urlValidator('example.com')).toBeNull();
            expect(urlValidator('example.com/path')).toBeNull();

            // Invalid URLs
            expect(urlValidator('htp://example')).toBe('Invalid URL');
            expect(urlValidator('example')).toBe('Invalid URL');
            expect(urlValidator('https://example')).toBe('Invalid URL');
        });
    });
}); 