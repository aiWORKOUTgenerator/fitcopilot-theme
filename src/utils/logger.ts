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

// Timer IDs for performance measurement
const timers: Record<string, number> = {};
let timerCounter = 0;

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
    if (isProduction && level < LogLevel.WARN) {
        // Skip debug and info logs in production
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
export const captureError = (err: unknown, context: Record<string, unknown> = {}): void => {
    const errorMessage = err instanceof Error
        ? err.message
        : (typeof err === 'string' ? err : 'Unknown error');

    const component = context.component ? `[${String(context.component)}] ` : '';
    const contextMessage = `${component}${errorMessage}`;

    error(contextMessage, { ...context, error: err });

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
 * Start timing a performance measurement
 * @param label Label for the timer
 * @returns Timer ID to use with timeEnd
 */
export const time = (label: string): string => {
    const timerId = `${label}-${timerCounter++}`;
    if (!isProduction) {
        console.time(timerId);
    }
    timers[timerId] = performance.now();
    return timerId;
};

/**
 * End timing a performance measurement
 * @param timerId Timer ID from time()
 */
export const timeEnd = (timerId: string): void => {
    if (!timers[timerId]) {
        warn(`Timer '${timerId}' does not exist`);
        return;
    }

    const elapsed = performance.now() - timers[timerId];
    if (!isProduction) {
        console.timeEnd(timerId);
    }

    delete timers[timerId];
    debug(`Operation took ${elapsed.toFixed(2)}ms`, { timerId, duration: elapsed });
};

/**
 * Create a component-specific logger
 * @param component Component name or identifier
 * @returns Logger with component context
 */
export const addContext = (component: string) => {
    return {
        debug: (msg: string, ...args: unknown[]) => debug(`[${component}] ${msg}`, ...args),
        info: (msg: string, ...args: unknown[]) => info(`[${component}] ${msg}`, ...args),
        warn: (msg: string, ...args: unknown[]) => warn(`[${component}] ${msg}`, ...args),
        error: (msg: string, ...args: unknown[]) => error(`[${component}] ${msg}`, ...args),
        captureError: (err: unknown, context: Record<string, unknown> = {}) =>
            captureError(err, { ...context, component }),
        time: (label: string) => time(`${component}:${label}`),
        timeEnd,
        group: (label: string, callback: () => void) => group(`${component}: ${label}`, callback),
    };
};

// Create the logger object
const logger = {
    debug,
    info,
    warn,
    error,
    captureError,
    group,
    time,
    timeEnd,
    addContext,
    setLogLevel,
    LogLevel
};

// Make logger globally available as a fallback
if (typeof window !== 'undefined') {
    // @ts-expect-error - Explicitly adding to window
    window.logger = logger;
}

// Default export for normal import usage
export default logger; 