/**
 * Type guards for debug utilities
 * 
 * These functions help validate the types of debug-related objects at runtime,
 * providing safer alternatives to any type casts.
 */

import { PerformanceMemory, PropChange } from '../types/debug';

/**
 * Type guard to check if an object has memory information
 * 
 * @param obj Object to check for memory properties
 * @returns Type assertion for PerformanceMemory
 */
export function hasMemoryInfo(obj: unknown): obj is PerformanceMemory {
  if (!obj || typeof obj !== 'object') return false;

  // Convert to Record for safer property checking
  const memory = obj as Record<string, unknown>;

  // Check for presence of at least one memory property
  return (
    'jsHeapSizeLimit' in memory ||
        'totalJSHeapSize' in memory ||
        'usedJSHeapSize' in memory
  );
}

/**
 * Type guard to check if an object is a prop change
 * 
 * @param obj Object to check
 * @param T Generic type parameter for the component props
 * @returns Type assertion for PropChange<T>
 */
export function hasPropChanged<T>(obj: unknown): obj is PropChange<T> {
  if (!obj || typeof obj !== 'object') return false;

  const change = obj as Record<string, unknown>;

  return (
    'propName' in change &&
        'prevValue' in change &&
        'newValue' in change &&
        'isSignificant' in change &&
        typeof change.isSignificant === 'boolean'
  );
}

/**
 * Type guard to check if browser supports performance memory API
 * 
 * @returns Whether performance memory API is available
 */
export function hasPerformanceMemorySupport(): boolean {
  return (
    typeof performance !== 'undefined' &&
        'memory' in performance
  );
}

/**
 * Safe accessor for performance memory
 * 
 * @returns Performance memory object or null if not supported
 */
export function getPerformanceMemory(): PerformanceMemory | null {
  if (!hasPerformanceMemorySupport()) return null;

  // TypeScript doesn't know about the non-standard memory property
  const memory = (performance as unknown as { memory: PerformanceMemory }).memory;

  return {
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    totalJSHeapSize: memory.totalJSHeapSize,
    usedJSHeapSize: memory.usedJSHeapSize
  };
}

/**
 * Check if debug mode is enabled on the window object
 * 
 * @returns Whether debug mode is enabled
 */
export function isDebugModeEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
        'DEBUG_MODE' in window &&
        Boolean(window.DEBUG_MODE)
  );
} 