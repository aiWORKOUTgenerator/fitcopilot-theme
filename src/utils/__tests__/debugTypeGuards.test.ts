/**
 * Tests for debug type guards
 */

import { PerformanceMemory, PropChange } from '../../types/debug';
import {
  getPerformanceMemory,
  hasMemoryInfo,
  hasPerformanceMemorySupport,
  hasPropChanged,
  isDebugModeEnabled
} from '../debugTypeGuards';

describe('Debug Type Guards', () => {
  describe('hasMemoryInfo', () => {
    it('should identify objects with memory info properties', () => {
      const validMemory: PerformanceMemory = {
        jsHeapSizeLimit: 2000000000,
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 40000000
      };

      const partialMemory = {
        jsHeapSizeLimit: 2000000000
      };

      const invalidObject = {
        someOtherProperty: 'value'
      };

      expect(hasMemoryInfo(validMemory)).toBe(true);
      expect(hasMemoryInfo(partialMemory)).toBe(true);
      expect(hasMemoryInfo(invalidObject)).toBe(false);
      expect(hasMemoryInfo(null)).toBe(false);
      expect(hasMemoryInfo(undefined)).toBe(false);
      expect(hasMemoryInfo('string')).toBe(false);
    });
  });

  describe('hasPropChanged', () => {
    it('should identify valid prop change objects', () => {
      const validPropChange: PropChange<{ count: number }> = {
        propName: 'count',
        prevValue: 1,
        newValue: 2,
        isSignificant: true
      };

      const invalidPropChange1 = {
        propName: 'count',
        prevValue: 1
        // Missing properties
      };

      const invalidPropChange2 = {
        propName: 'count',
        prevValue: 1,
        newValue: 2,
        isSignificant: 'yes' // Wrong type
      };

      expect(hasPropChanged(validPropChange)).toBe(true);
      expect(hasPropChanged(invalidPropChange1)).toBe(false);
      expect(hasPropChanged(invalidPropChange2)).toBe(false);
      expect(hasPropChanged(null)).toBe(false);
      expect(hasPropChanged(undefined)).toBe(false);
      expect(hasPropChanged('string')).toBe(false);
    });
  });

  describe('hasPerformanceMemorySupport', () => {
    const originalPerformance = window.performance;

    beforeEach(() => {
      // Reset performance object before each test
      Object.defineProperty(window, 'performance', {
        value: originalPerformance,
        writable: true
      });
    });

    it('should detect when performance.memory is available', () => {
      // Mock performance.memory
      Object.defineProperty(window.performance, 'memory', {
        value: {
          jsHeapSizeLimit: 2000000000,
          totalJSHeapSize: 50000000,
          usedJSHeapSize: 40000000
        },
        configurable: true
      });

      expect(hasPerformanceMemorySupport()).toBe(true);
    });

    it('should detect when performance.memory is not available', () => {
      // Create a mock performance without memory
      const _mockPerformance = {
        now: jest.fn()
      };

      // @ts-expect-error - intentionally removing memory
      delete window.performance.memory;

      expect(hasPerformanceMemorySupport()).toBe(false);
    });

    it('should handle when performance is undefined', () => {
      // @ts-expect-error - intentionally setting to undefined
      window.performance = undefined;

      expect(hasPerformanceMemorySupport()).toBe(false);
    });
  });

  describe('getPerformanceMemory', () => {
    const originalPerformance = window.performance;

    beforeEach(() => {
      // Reset performance object before each test
      Object.defineProperty(window, 'performance', {
        value: originalPerformance,
        writable: true
      });
    });

    it('should return memory information when available', () => {
      const mockMemory = {
        jsHeapSizeLimit: 2000000000,
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 40000000
      };

      // Mock performance.memory
      Object.defineProperty(window.performance, 'memory', {
        value: mockMemory,
        configurable: true
      });

      const result = getPerformanceMemory();
      expect(result).toEqual(mockMemory);
    });

    it('should return null when memory is not available', () => {
      // @ts-expect-error - intentionally removing memory
      delete window.performance.memory;

      const result = getPerformanceMemory();
      expect(result).toBeNull();
    });
  });

  describe('isDebugModeEnabled', () => {
    const _originalWindow = { ...window };

    afterEach(() => {
      // @ts-expect-error - Reset DEBUG_MODE
      delete window.DEBUG_MODE;
    });

    it('should return true when DEBUG_MODE is truthy', () => {
      // @ts-expect-error - Setting debug mode
      window.DEBUG_MODE = true;
      expect(isDebugModeEnabled()).toBe(true);

      // @ts-expect-error - Setting debug mode
      window.DEBUG_MODE = 1;
      expect(isDebugModeEnabled()).toBe(true);

      // @ts-expect-error - Setting debug mode
      window.DEBUG_MODE = 'enabled';
      expect(isDebugModeEnabled()).toBe(true);
    });

    it('should return false when DEBUG_MODE is falsy', () => {
      // @ts-expect-error - Setting debug mode
      window.DEBUG_MODE = false;
      expect(isDebugModeEnabled()).toBe(false);

      // @ts-expect-error - Setting debug mode
      window.DEBUG_MODE = 0;
      expect(isDebugModeEnabled()).toBe(false);

      // @ts-expect-error - Setting debug mode
      window.DEBUG_MODE = '';
      expect(isDebugModeEnabled()).toBe(false);

      // @ts-expect-error - Setting debug mode
      window.DEBUG_MODE = null;
      expect(isDebugModeEnabled()).toBe(false);
    });

    it('should return false when DEBUG_MODE is not defined', () => {
      // @ts-expect-error - Removing debug mode
      delete window.DEBUG_MODE;
      expect(isDebugModeEnabled()).toBe(false);
    });
  });
}); 