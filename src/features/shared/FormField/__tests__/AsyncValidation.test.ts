/**
 * Async validation tests
 */

import { validateAsync, ValidationResult } from '../validators';

describe('Async validation', () => {
  it('should create a ValidationResult with pending state', () => {
    const asyncValidator = validateAsync(async (value: string) => {
      if (value.length < 3) return 'Too short';
      return null;
    });

    const result = asyncValidator('ab');
    expect(result.pending).toBe(true);
    expect(result.message).toBe('Validating...');
    expect(typeof result.validate).toBe('function');
  });

  it('should allow custom pending message', () => {
    const asyncValidator = validateAsync(
      async (value: string) => null,
      'Checking...'
    );

    const result = asyncValidator('test');
    expect(result.message).toBe('Checking...');
  });

  it('should resolve to error message for invalid value', async () => {
    const asyncValidator = validateAsync(async (value: string) => {
      if (value.length < 3) return 'Too short';
      return null;
    });

    const result = asyncValidator('ab') as ValidationResult;
    const error = await result.validate();
    
    expect(error).toBe('Too short');
  });

  it('should resolve to null for valid value', async () => {
    const asyncValidator = validateAsync(async (value: string) => {
      if (value.length < 3) return 'Too short';
      return null;
    });

    const result = asyncValidator('abc') as ValidationResult;
    const error = await result.validate();
    
    expect(error).toBeNull();
  });

  it('should have access to all form values', async () => {
    const asyncValidator = validateAsync(
      async (value: string, allValues?: Record<string, any>) => {
        if (allValues && allValues.allowShort) {
          return null;
        }
        
        if (value.length < 3) return 'Too short';
        return null;
      }
    );

    // With allowShort = true, validation should pass even for short values
    const result1 = asyncValidator('ab', { allowShort: true }) as ValidationResult;
    const error1 = await result1.validate();
    expect(error1).toBeNull();

    // With allowShort = false, validation should fail for short values
    const result2 = asyncValidator('ab', { allowShort: false }) as ValidationResult;
    const error2 = await result2.validate();
    expect(error2).toBe('Too short');
  });

  it('should handle async errors properly', async () => {
    const errorMessage = 'Async operation failed';
    const asyncValidator = validateAsync(async () => {
      throw new Error(errorMessage);
      return null;
    });

    const result = asyncValidator('test') as ValidationResult;
    
    // The validate function should reject with the error
    await expect(result.validate()).rejects.toThrow(errorMessage);
  });

  it('should work with delayed validation', async () => {
    // Simulate a network delay
    const asyncValidator = validateAsync(async (value: string) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      
      if (value.length < 3) return 'Too short';
      return null;
    });

    const result = asyncValidator('ab') as ValidationResult;
    const error = await result.validate();
    
    expect(error).toBe('Too short');
  });
}); 