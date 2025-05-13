/**
 * Type definitions for debug utilities
 */

/**
 * Represents a change in a property's value
 */
export interface PropChange<T> {
    from: T;
    to: T;
}

/**
 * Type for recording changes in props
 */
export type PropChanges = Record<string, PropChange<unknown>>;

/**
 * Chrome-specific performance memory information
 */
export interface PerformanceMemory {
    /**
     * The maximum size of the heap, in bytes
     */
    jsHeapSizeLimit: number;

    /**
     * The total allocated heap size, in bytes
     */
    totalJSHeapSize: number;

    /**
     * The currently active segment of the heap, in bytes
     */
    usedJSHeapSize: number;
}

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