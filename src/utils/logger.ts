/**
 * Logger utility for consistent logging across the application
 * Provides environment-aware logging and support for different log levels
 */

import { CommonEventHandler } from '../types/events';
import { LOG_LEVEL_VALUES, LogLevel } from './logLevels';

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
// const isDevelopment = process.env.NODE_ENV === 'development'; // Removed unused variable
const isTest = process.env.NODE_ENV === 'test';

// Advanced configuration with environment-specific settings
interface LoggerConfig {
    minLevel: number; // Changed from LogLevel to number for safety
    enableConsole: boolean;
    enableRemoteLogging?: boolean;
    enableGrouping: boolean;
    enableTimers: boolean;
}

// Safely access log level values
const safeLogLevel = (level: keyof typeof LogLevel): number => {
  try {
    return LogLevel[level];
  } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Fallback to hardcoded values if enum access fails
    return LOG_LEVEL_VALUES[level];
  }
};

// Default configurations based on environment - use safe access
const DEFAULT_CONFIGS: Record<string, LoggerConfig> = {
  production: {
    minLevel: safeLogLevel('WARN'),
    enableConsole: true,
    enableRemoteLogging: true,
    enableGrouping: false,
    enableTimers: false
  },
  development: {
    minLevel: safeLogLevel('DEBUG'),
    enableConsole: true,
    enableRemoteLogging: false,
    enableGrouping: true,
    enableTimers: true
  },
  test: {
    minLevel: safeLogLevel('ERROR'),
    enableConsole: false,
    enableRemoteLogging: false,
    enableGrouping: false,
    enableTimers: false
  }
};

// Re-export LogLevel
export { LogLevel };

// Get environment-specific default config
const getDefaultConfig = (): LoggerConfig => {
  if (isProduction) return DEFAULT_CONFIGS.production;
  if (isTest) return DEFAULT_CONFIGS.test;
  return DEFAULT_CONFIGS.development;
};

// Active configuration (starts with environment default)
let activeConfig = getDefaultConfig();

// Function to set or update logger configuration
export const configureLogger = (config: Partial<LoggerConfig>): void => {
  activeConfig = { ...activeConfig, ...config };
};

// Timer IDs for performance measurement
const timers: Record<string, number> = {};
let timerCounter = 0;

// Safe console methods with fallbacks
const safeConsole = {
  log: (...args: unknown[]) => {
    try {
      logger.debug(...args);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if logger is not available
    }
  },
  info: (...args: unknown[]) => {
    try {
      logger.info(...args);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if logger is not available
    }
  },
  warn: (...args: unknown[]) => {
    try {
      logger.warn(...args);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if logger is not available
    }
  },
  error: (...args: unknown[]) => {
    try {
      logger.error(...args);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if logger is not available
    }
  },
  group: (label: string) => {
    try {
      // eslint-disable-next-line no-console
      console.group(label);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if console is not available
    }
  },
  groupEnd: () => {
    try {
      // eslint-disable-next-line no-console
      console.groupEnd();
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if console is not available
    }
  },
  time: (label: string) => {
    try {
      // eslint-disable-next-line no-console
      console.time(label);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if console is not available
    }
  },
  timeEnd: (label: string) => {
    try {
      // eslint-disable-next-line no-console
      console.timeEnd(label);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if console is not available
    }
  }
};

/**
 * Base logging function
 * @param level Log level
 * @param message Main message to log
 * @param data Additional data to log
 */
const logMessage = (level: number, message: string, ...data: unknown[]): void => {
  // Skip logging if the level is below the configured minimum level
  if (level < activeConfig.minLevel) return;

  // Format the message with a timestamp
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;

  // Skip console output if disabled in config
  if (!activeConfig.enableConsole) return;

  // Use direct console access with safety checks
  try {
    // Log to console based on level
    switch (level) {
    case safeLogLevel('DEBUG'):
      safeConsole.log(formattedMessage, ...data);
      break;
    case safeLogLevel('INFO'):
      safeConsole.info(formattedMessage, ...data);
      break;
    case safeLogLevel('WARN'):
      safeConsole.warn(formattedMessage, ...data);
      break;
    case safeLogLevel('ERROR'):
      safeConsole.error(formattedMessage, ...data);
      break;
    }
  } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Silent fallback if console access fails
  }

  // In production with remote logging enabled, send logs to remote service
  if (isProduction && activeConfig.enableRemoteLogging) {
    // TODO: Implement remote logging service integration
    // Example: sendLogToRemoteService(level, message, data);
  }
};

/**
 * Log debug message
 * Only visible in development mode or when log level is set to DEBUG
 */
export const debug = (message: string, ...data: unknown[]): void => {
  logMessage(safeLogLevel('DEBUG'), message, ...data);
};

/**
 * Log info message
 * General information about application flow
 */
export const info = (message: string, ...data: unknown[]): void => {
  logMessage(safeLogLevel('INFO'), message, ...data);
};

/**
 * Log warning message
 * For issues that don't prevent the application from functioning
 */
export const warn = (message: string, ...data: unknown[]): void => {
  logMessage(safeLogLevel('WARN'), message, ...data);
};

/**
 * Log error message
 * For issues that affect functionality
 */
export const error = (message: string, ...data: unknown[]): void => {
  logMessage(safeLogLevel('ERROR'), message, ...data);
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
  if (!activeConfig.enableGrouping) {
    // Just execute the callback without grouping if grouping is disabled
    callback();
    return;
  }

  try {
    // eslint-disable-next-line no-console
    safeConsole.group(label);
    callback();
    // eslint-disable-next-line no-console
    safeConsole.groupEnd();
  } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // If grouping fails, just run the callback
    callback();
  }
};

/**
 * Start timing a performance measurement
 * @param label Label for the timer
 * @returns Timer ID to use with timeEnd
 */
export const time = (label: string): string => {
  const timerId = `${label}-${timerCounter++}`;
  if (!activeConfig.enableTimers) return timerId;

  if (!isProduction) {
    try {
      // eslint-disable-next-line no-console
      safeConsole.time(timerId);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback if console.time is not available
    }
  }

  try {
    timers[timerId] = performance.now();
  } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Silent fallback if performance API is not available
  }

  return timerId;
};

/**
 * End timing a performance measurement
 * @param timerId Timer ID from time()
 */
export const timeEnd = (timerId: string): void => {
  if (!timers[timerId]) {
    try {
      warn(`Timer '${timerId}' does not exist`);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback
    }
    return;
  }

  try {
    const elapsed = performance.now() - timers[timerId];

    if (!activeConfig.enableTimers) return;

    if (!isProduction) {
      try {
        // eslint-disable-next-line no-console
        safeConsole.timeEnd(timerId);
      } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Silent fallback if console.timeEnd is not available
      }
    }

    delete timers[timerId];

    try {
      debug(`Operation took ${elapsed.toFixed(2)}ms`, { timerId, duration: elapsed });
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Silent fallback
    }
  } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Silent fallback if performance API is not available
  }
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

// Function to set the current log level (maintained for backwards compatibility)
export const setLogLevel = (level: number): void => {
  configureLogger({ minLevel: level });
};

/**
 * Log React component events with structured data
 * @param componentName Name of the component generating the event
 * @param eventName Name of the event (e.g., 'click', 'change')
 * @param event The React synthetic event
 */
export const logComponentEvent = <T extends Element, E extends React.SyntheticEvent<T>>(
  componentName: string,
  eventName: string,
  event: E
): void => {
  // Prevent logging in production unless configured
  if (isProduction && !activeConfig.enableRemoteLogging) return;

  // Extract useful information from the event
  const targetInfo = {
    id: event.currentTarget.id || undefined,
    className: event.currentTarget.className || undefined,
    tagName: event.currentTarget.tagName || undefined,
    type: event.type || undefined
  };

  // Log with context
  debug(`${componentName}:${eventName}`, {
    component: componentName,
    event: eventName,
    target: targetInfo,
    timestamp: new Date().toISOString()
  });
};

/**
 * Create a wrapped event handler that logs the event before calling the original handler
 * @param componentName Name of the component
 * @param eventName Name of the event (e.g., 'click', 'submit')
 * @param handler The original event handler
 * @returns A new function that logs and then calls the original handler
 */
export const createLoggedEventHandler = <T extends Element, E extends React.SyntheticEvent<T>>(
  componentName: string,
  eventName: string,
  handler?: CommonEventHandler<T, E>
): CommonEventHandler<T, E> => {
  return (event: E) => {
    // Log the event
    logComponentEvent(componentName, eventName, event);

    // Call the original handler if provided
    if (handler) {
      handler(event);
    }
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
  configureLogger,
  LogLevel, // Re-export for compatibility
  logComponentEvent,
  createLoggedEventHandler
};

// Make logger globally available as a fallback
if (typeof window !== 'undefined') {
  try {
    // @ts-expect-error - Explicitly adding to window
    window.logger = logger;
  } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Silent fallback if window is not available or cannot be modified
  }
}

// Default export for normal import usage
export default logger; 