/**
 * Debug utility type definitions
 * 
 * This file provides centralized type definitions for debugging tools
 * and utilities, supporting runtime type checking and performance monitoring.
 */

/**
 * Interface representing a change in component props
 */
export interface PropChange<T> {
    /** Name of the property that changed */
    propName: keyof T;
    /** Previous value of the property */
    prevValue: T[keyof T];
    /** New value of the property */
    newValue: T[keyof T];
    /** Whether the change is considered significant */
    isSignificant: boolean;
}

/**
 * Interface representing browser performance information
 */
export interface PerformanceMemory {
    /** Total amount of allocated JS heap (in bytes) */
    totalJSHeapSize?: number;
    /** Currently allocated JS heap (in bytes) */
    usedJSHeapSize?: number;
    /** Maximum size of JS heap (in bytes) */
    jsHeapSizeLimit?: number;
}

/**
 * Interface for component render debugging
 */
export interface RenderDebugInfo {
    /** Component name */
    componentName: string;
    /** Render timestamp */
    timestamp: number;
    /** Render duration in milliseconds */
    renderTime?: number;
    /** Memory information if available */
    memory?: PerformanceMemory;
    /** Number of times the component has rendered */
    renderCount: number;
}

/**
 * Interface for class name debugging information
 */
export interface ClassNameDebugInfo {
    /** Element selector */
    selector: string;
    /** Applied classes */
    appliedClasses: string[];
    /** Computed styles */
    computedStyles?: Record<string, string>;
    /** Whether element is visible */
    isVisible: boolean;
}

/**
 * Interface for debug settings
 */
export interface DebugSettings {
    /** Whether debug mode is enabled */
    enabled: boolean;
    /** Log level */
    logLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace';
    /** Whether to log performance metrics */
    logPerformance: boolean;
    /** Whether to log prop changes */
    logPropChanges: boolean;
    /** Whether to log component lifecycle events */
    logLifecycle: boolean;
}

/**
 * Interface for debug message
 */
export interface DebugMessage {
    /** Message text */
    message: string;
    /** Message level */
    level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
    /** Timestamp */
    timestamp: number;
    /** Source component or system */
    source?: string;
    /** Additional data */
    data?: unknown;
}

/**
 * Type for recording changes in props
 */
export type PropChanges = Record<string, PropChange<unknown>>;

/**
 * Extended Performance interface with memory information
 */
export interface PerformanceWithMemory extends Performance {
    /**
     * Memory information (Chrome-specific)
     */
    memory: PerformanceMemory;
}

/**
 * Component render statistics
 */
export interface ComponentRenderStats {
    /**
     * Total number of components tracked
     */
    total: number;

    /**
     * Number of components rendered
     */
    rendered: number;

    /**
     * Render times by component name
     */
    times: Record<string, number>;
}

/**
 * Debug tools available on the window object
 */
export interface FitCopilotDebugTools {
    /**
     * Log component render time
     */
    logRender: (componentName: string, renderTime: number) => void;

    /**
     * Get component render statistics
     */
    getComponentStats: () => ComponentRenderStats;
}

/**
 * Global window interface extension
 */
declare global {
    interface Window {
        /**
         * FitCopilot debug tools
         */
        fitcopilotDebugTools?: FitCopilotDebugTools;
    }
} 