import { PerformanceWithMemory, PropChange } from '../../types/debug';
import { hasMemoryInfo, hasPropChanged, isPropChange } from '../debugTypeGuards';

describe('Debug Type Guards', () => {
    describe('hasMemoryInfo', () => {
        it('should return true if performance object has memory property', () => {
            // Create a mock performance object with memory
            const mockPerformance = {
                ...performance,
                memory: {
                    jsHeapSizeLimit: 1000,
                    totalJSHeapSize: 500,
                    usedJSHeapSize: 200
                }
            } as PerformanceWithMemory;

            expect(hasMemoryInfo(mockPerformance)).toBe(true);
        });

        it('should return false if performance object does not have memory property', () => {
            // Mock performance without memory property
            const mockPerformance = { ...performance };

            expect(hasMemoryInfo(mockPerformance)).toBe(false);
        });
    });

    describe('isPropChange', () => {
        it('should return true for valid PropChange objects', () => {
            const validPropChange: PropChange<string> = {
                from: 'oldValue',
                to: 'newValue'
            };

            expect(isPropChange(validPropChange)).toBe(true);
        });

        it('should return false for non-objects', () => {
            expect(isPropChange('string')).toBe(false);
            expect(isPropChange(123)).toBe(false);
            expect(isPropChange(null)).toBe(false);
            expect(isPropChange(undefined)).toBe(false);
        });

        it('should return false for objects missing from or to properties', () => {
            expect(isPropChange({ from: 'oldValue' })).toBe(false);
            expect(isPropChange({ to: 'newValue' })).toBe(false);
            expect(isPropChange({})).toBe(false);
        });
    });

    describe('hasPropChanged', () => {
        it('should correctly detect changes in primitive values', () => {
            expect(hasPropChanged(1, 2)).toBe(true);
            expect(hasPropChanged('a', 'b')).toBe(true);
            expect(hasPropChanged(true, false)).toBe(true);
            expect(hasPropChanged(1, 1)).toBe(false);
            expect(hasPropChanged('a', 'a')).toBe(false);
            expect(hasPropChanged(true, true)).toBe(false);
        });

        it('should correctly detect changes in arrays', () => {
            expect(hasPropChanged([1, 2, 3], [1, 2, 3, 4])).toBe(true);
            expect(hasPropChanged([1, 2, 3], [1, 2, 4])).toBe(true);
            expect(hasPropChanged([1, 2, 3], [1, 2, 3])).toBe(false);
        });

        it('should correctly detect changes in Date objects', () => {
            const date1 = new Date('2023-01-01');
            const date2 = new Date('2023-01-02');
            const date3 = new Date('2023-01-01');

            expect(hasPropChanged(date1, date2)).toBe(true);
            expect(hasPropChanged(date1, date3)).toBe(false);
        });

        it('should correctly detect changes in objects', () => {
            expect(hasPropChanged({ a: 1 }, { a: 2 })).toBe(true);
            expect(hasPropChanged({ a: 1 }, { a: 1, b: 2 })).toBe(true);
            expect(hasPropChanged({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(false);
        });

        it('should handle null and undefined values', () => {
            expect(hasPropChanged(null, { a: 1 })).toBe(true);
            expect(hasPropChanged(undefined, null)).toBe(true);
            expect(hasPropChanged(null, null)).toBe(false);
            expect(hasPropChanged(undefined, undefined)).toBe(false);
        });
    });
}); 