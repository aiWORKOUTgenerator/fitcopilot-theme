/**
 * Logger utility for consistent logging across the application
 * Provides environment-aware logging and support for different log levels
 */

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Log levels
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

// Current log level (can be modified based on configuration)
let currentLogLevel = isProduction ? LogLevel.ERROR : LogLevel.DEBUG;

// Function to set the current log level
export const setLogLevel = (level: LogLevel): void => {
    currentLogLevel = level;
};

/**
 * Base logging function
 * @param level Log level
 * @param message Main message to log
 * @param data Additional data to log
 */
const logMessage = (level: LogLevel, message: string, ...data: unknown[]): void => {
    // Skip logging if the level is below the current level
    if (level < currentLogLevel) return;

    // Format the message with a timestamp
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;

    // In production, we might want to send logs to a server
    if (isProduction) {
        // TODO: Implement production logging strategy
        // This could send logs to a server, analytics platform, etc.
        return;
    }

    // In development, log to console
    switch (level) {
        case LogLevel.DEBUG:
            console.debug(formattedMessage, ...data);
            break;
        case LogLevel.INFO:
            console.info(formattedMessage, ...data);
            break;
        case LogLevel.WARN:
            console.warn(formattedMessage, ...data);
            break;
        case LogLevel.ERROR:
            console.error(formattedMessage, ...data);
            break;
    }
};

/**
 * Log debug message
 * Only visible in development mode or when log level is set to DEBUG
 */
export const debug = (message: string, ...data: unknown[]): void => {
    logMessage(LogLevel.DEBUG, message, ...data);
};

/**
 * Log info message
 * General information about application flow
 */
export const info = (message: string, ...data: unknown[]): void => {
    logMessage(LogLevel.INFO, message, ...data);
};

/**
 * Log warning message
 * For issues that don't prevent the application from functioning
 */
export const warn = (message: string, ...data: unknown[]): void => {
    logMessage(LogLevel.WARN, message, ...data);
};

/**
 * Log error message
 * For issues that affect functionality
 */
export const error = (message: string, ...data: unknown[]): void => {
    logMessage(LogLevel.ERROR, message, ...data);
};

/**
 * Capture and log error objects
 * Useful for try/catch blocks
 */
export const captureError = (err: unknown, context?: string): void => {
    const errorMessage = err instanceof Error
        ? err.message
        : (typeof err === 'string' ? err : 'Unknown error');

    const contextMessage = context
        ? `[${context}] ${errorMessage}`
        : errorMessage;

    error(contextMessage, err);

    // In production, we might want to send errors to an error tracking service
    if (isProduction) {
        // TODO: Implement error tracking service integration
        // Example: Sentry, LogRocket, etc.
    }
};

/**
 * Group related logs together
 */
export const group = (label: string, callback: () => void): void => {
    if (isProduction) {
        callback();
        return;
    }

    console.group(label);
    callback();
    console.groupEnd();
};

/**
 * Log a performance measurement
 */
export const measure = (label: string, callback: () => void): void => {
    if (isProduction) {
        callback();
        return;
    }

    console.time(label);
    callback();
    console.timeEnd(label);
};

// Default export for ease of use
export default {
    debug,
    info,
    warn,
    error,
    captureError,
    group,
    measure,
    setLogLevel,
    LogLevel
}; 