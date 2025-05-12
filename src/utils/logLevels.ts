/**
 * Log level definitions
 * Separated to avoid circular dependencies and initialization issues
 */

// Log levels enum - IMPORTANT: This must be first in the file
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

// Safe fallback values in case enum isn't initialized
export const LOG_LEVEL_VALUES = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

// Helper function for safely accessing log levels even if enum initialization fails
export const getLogLevelValue = (level: keyof typeof LogLevel): number => {
    try {
        // Try to access through the enum first
        return LogLevel[level];
    } catch (_e) {
        // Fallback to hardcoded values if enum access fails
        return LOG_LEVEL_VALUES[level] || LOG_LEVEL_VALUES.INFO;
    }
}; 