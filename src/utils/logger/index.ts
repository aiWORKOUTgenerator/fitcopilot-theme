/**
 * Logger utility for consistent logging across the application
 * Provides environment-aware logging and support for different log levels
 */

import { CommonEventHandler } from '../../types/events';
import { LOG_LEVEL_VALUES, LogLevel } from '../logLevels';

type Logger = {
  debug: (message: string, ...data: unknown[]) => void;
  info: (message: string, ...data: unknown[]) => void;
  warn: (message: string, ...data: unknown[]) => void;
  error: (message: string, ...data: unknown[]) => void;
  captureError: (err: unknown, context?: Record<string, unknown>) => void;
  group: (label: string, callback: () => void) => void;
  time: (label: string) => string;
  timeEnd: (timerId: string) => void;
  addContext: (component: string) => Logger;
  setLogLevel: (level: number) => void;
  logComponentEvent: <T extends Element, E extends React.SyntheticEvent<T>>(
    componentName: string,
    eventName: string,
    event: E
  ) => void;
  createLoggedEventHandler: <T extends Element, E extends React.SyntheticEvent<T>>(
    componentName: string,
    eventName: string,
    handler?: CommonEventHandler<T, E>
  ) => CommonEventHandler<T, E>;
  configure: (config: Partial<LoggerConfig>) => void;
};

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Advanced configuration with environment-specific settings
interface LoggerConfig {
    minLevel: number;
    enableConsole: boolean;
    enableRemoteLogging?: boolean;
    enableGrouping: boolean;
    enableTimers: boolean;
}

// Safely access log level values
const safeLogLevel = (level: keyof typeof LogLevel): number => {
  try {
    return LogLevel[level];
  } catch (_e) {
    return LOG_LEVEL_VALUES[level];
  }
};

// Default configurations based on environment
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

// Get environment-specific default config
const getDefaultConfig = (): LoggerConfig => {
  if (isProduction) return DEFAULT_CONFIGS.production;
  if (isTest) return DEFAULT_CONFIGS.test;
  return DEFAULT_CONFIGS.development;
};

// Active configuration
let activeConfig = getDefaultConfig();

// Timer IDs for performance measurement
const timers: Record<string, number> = {};
let timerCounter = 0;

// Safe console methods with fallbacks
const safeConsole = {
  log: (...args: unknown[]) => {
    try {
      logger.info(...args);
    } catch (_e) {
      // Silent fallback if console is not available
    }
  },
  info: (...args: unknown[]) => {
    try {
      logger.info(...args);
    } catch (_e) {
      // Silent fallback if console is not available
    }
  },
  warn: (...args: unknown[]) => {
    try {
      logger.warn(...args);
    } catch (_e) {
      // Silent fallback if console is not available
    }
  },
  error: (...args: unknown[]) => {
    try {
      logger.error(...args);
    } catch (_e) {
      // Silent fallback if console is not available
    }
  },
  group: (label: string) => {
    try {
      console.group(label);
    } catch (_e) {
      // Silent fallback if console is not available
    }
  },
  groupEnd: () => {
    try {
      console.groupEnd();
    } catch (_e) {
      // Silent fallback if console is not available
    }
  },
  time: (label: string) => {
    try {
      console.time(label);
    } catch (_e) {
      // Silent fallback if console is not available
    }
  },
  timeEnd: (label: string) => {
    try {
      console.timeEnd(label);
    } catch (_e) {
      // Silent fallback if console is not available
    }
  }
};

/**
 * Base logging function
 */
const logMessage = (level: number, message: string, ...data: unknown[]): void => {
  if (level < activeConfig.minLevel) return;

  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;

  if (!activeConfig.enableConsole) return;

  try {
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
  } catch (_e) {
    // Silent fallback if console access fails
  }

  if (isProduction && activeConfig.enableRemoteLogging) {
    // TODO: Implement remote logging service integration
  }
};

// Create the logger object
const logger: Logger = {
  debug: (message: string, ...data: unknown[]): void => {
    logMessage(safeLogLevel('DEBUG'), message, ...data);
  },

  info: (message: string, ...data: unknown[]): void => {
    logMessage(safeLogLevel('INFO'), message, ...data);
  },

  warn: (message: string, ...data: unknown[]): void => {
    logMessage(safeLogLevel('WARN'), message, ...data);
  },

  error: (message: string, ...data: unknown[]): void => {
    logMessage(safeLogLevel('ERROR'), message, ...data);
  },

  captureError: (err: unknown, context: Record<string, unknown> = {}): void => {
    const errorMessage = err instanceof Error
      ? err.message
      : (typeof err === 'string' ? err : 'Unknown error');

    const component = context.component ? `[${String(context.component)}] ` : '';
    const contextMessage = `${component}${errorMessage}`;

    logger.error(contextMessage, { ...context, error: err });

    if (isProduction) {
      // TODO: Implement error tracking service integration
    }
  },

  group: (label: string, callback: () => void): void => {
    if (!activeConfig.enableGrouping) {
      callback();
      return;
    }

    safeConsole.group(label);
    try {
      callback();
    } finally {
      safeConsole.groupEnd();
    }
  },

  time: (label: string): string => {
    if (!activeConfig.enableTimers) return '';

    const timerId = `timer_${timerCounter++}`;
    timers[timerId] = Date.now();
    safeConsole.time(label);
    return timerId;
  },

  timeEnd: (timerId: string): void => {
    if (!activeConfig.enableTimers) return;

    const startTime = timers[timerId];
    if (startTime) {
      const duration = Date.now() - startTime;
      logger.debug(`Timer ${timerId} completed in ${duration}ms`);
      delete timers[timerId];
    }
  },

  addContext: (component: string): Logger => {
    // Create a new logger instance with the component context
    const contextLogger: Logger = {
      debug: (message: string, ...data: unknown[]): void => {
        logMessage(safeLogLevel('DEBUG'), `[${component}] ${message}`, ...data);
      },

      info: (message: string, ...data: unknown[]): void => {
        logMessage(safeLogLevel('INFO'), `[${component}] ${message}`, ...data);
      },

      warn: (message: string, ...data: unknown[]): void => {
        logMessage(safeLogLevel('WARN'), `[${component}] ${message}`, ...data);
      },

      error: (message: string, ...data: unknown[]): void => {
        logMessage(safeLogLevel('ERROR'), `[${component}] ${message}`, ...data);
      },

      captureError: (err: unknown, context: Record<string, unknown> = {}): void => {
        logger.captureError(err, { ...context, component });
      },

      group: (label: string, callback: () => void): void => {
        logger.group(`[${component}] ${label}`, callback);
      },

      time: (label: string): string => {
        return logger.time(`[${component}] ${label}`);
      },

      timeEnd: (timerId: string): void => {
        logger.timeEnd(timerId);
      },

      addContext: (newContext: string): Logger => {
        return contextLogger.addContext(`${component}.${newContext}`);
      },

      setLogLevel: (level: number): void => {
        logger.setLogLevel(level);
      },

      logComponentEvent: <T extends Element, E extends React.SyntheticEvent<T>>(
        componentName: string,
        eventName: string,
        event: E
      ): void => {
        logger.logComponentEvent(`${component}.${componentName}`, eventName, event);
      },

      createLoggedEventHandler: <T extends Element, E extends React.SyntheticEvent<T>>(
        componentName: string,
        eventName: string,
        handler?: CommonEventHandler<T, E>
      ): CommonEventHandler<T, E> => {
        return logger.createLoggedEventHandler(`${component}.${componentName}`, eventName, handler);
      },

      configure: (config: Partial<LoggerConfig>): void => {
        logger.configure(config);
      }
    };

    return contextLogger;
  },

  setLogLevel: (level: number): void => {
    activeConfig.minLevel = level;
  },

  logComponentEvent: <T extends Element, E extends React.SyntheticEvent<T>>(
    componentName: string,
    eventName: string,
    event: E
  ): void => {
    logger.debug(`[${componentName}] ${eventName}`, {
      type: event.type,
      target: event.target,
      currentTarget: event.currentTarget
    });
  },

  createLoggedEventHandler: <T extends Element, E extends React.SyntheticEvent<T>>(
    componentName: string,
    eventName: string,
    handler?: CommonEventHandler<T, E>
  ): CommonEventHandler<T, E> => {
    return (event: E) => {
      logger.logComponentEvent(componentName, eventName, event);
      if (handler) {
        handler(event);
      }
    };
  },

  configure: (config: Partial<LoggerConfig>): void => {
    activeConfig = { ...activeConfig, ...config };
  }
};

// Initialize the logger with default configuration
logger.configure(getDefaultConfig());

// Export the logger object and its type
export { LogLevel };
export type { LoggerConfig };
export default logger; 