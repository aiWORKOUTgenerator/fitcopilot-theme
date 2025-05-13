/**
 * Type guards for debug utilities
 */
import { PerformanceWithMemory, PropChange } from '../types/debug';

/**
 * Type guard to check if performance object includes memory information
 * 
 * @param performance The performance object to check
 * @returns Whether the performance object has memory information
 */
export function hasMemoryInfo(performance: Performance): performance is PerformanceWithMemory {
    return 'memory' in performance;
}

/**
 * Type guard to check if an object is a valid prop change
 * 
 * @param value Object to check
 * @returns Whether the object is a valid prop change
 */
export function isPropChange<T>(value: unknown): value is PropChange<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'from' in value &&
        'to' in value
    );
}

/**
 * Determines if a prop has changed by comparing values
 * 
 * @param oldValue Previous value
 * @param newValue Current value
 * @returns Whether the value has changed
 */
export function hasPropChanged<T>(oldValue: T, newValue: T): boolean {
    // Handle primitive types
    if (typeof oldValue !== 'object' || typeof newValue !== 'object' ||
        oldValue === null || newValue === null) {
        return oldValue !== newValue;
    }

    // Handle array types
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        if (oldValue.length !== newValue.length) return true;
        return oldValue.some((item, index) => hasPropChanged(item, newValue[index]));
    }

    // Handle Date objects
    if (oldValue instanceof Date && newValue instanceof Date) {
        return oldValue.getTime() !== newValue.getTime();
    }

    // Shallow comparison for objects (deep comparison could be added if needed)
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
} 