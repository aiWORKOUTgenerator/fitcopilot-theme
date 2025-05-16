/**
 * Logger levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interface for logger implementation
 */
export interface LoggerInterface {
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string, context?: Record<string, unknown>): void;
}

/**
 * Environment configuration for the logger
 */
interface LoggerConfig {
    /**
     * Minimum log level to display
     */
    minLevel: LogLevel;

    /**
     * Whether to include timestamps in logs
     */
    includeTimestamps: boolean;

    /**
     * Whether to include log level in output
     */
    includeLevelInOutput: boolean;
}

/**
 * Get the current environment
 */
const getEnvironment = (): 'development' | 'production' | 'test' => {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  if (process.env.NODE_ENV === 'test') {
    return 'test';
  }

  return 'development';
};

/**
 * Get logger configuration based on environment
 */
const getLoggerConfig = (): LoggerConfig => {
  const environment = getEnvironment();

  switch (environment) {
  case 'production':
    return {
      minLevel: 'warn',
      includeTimestamps: true,
      includeLevelInOutput: true
    };
  case 'test':
    return {
      minLevel: 'error',
      includeTimestamps: false,
      includeLevelInOutput: true
    };
  default:
    return {
      minLevel: 'debug',
      includeTimestamps: true,
      includeLevelInOutput: true
    };
  }
};

/**
 * Log level severity ranking
 */
const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * Default Logger implementation
 */
class Logger implements LoggerInterface {
  private config: LoggerConfig;

  constructor() {
    this.config = getLoggerConfig();
  }

  /**
     * Check if the given level should be logged
     */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[this.config.minLevel];
  }

  /**
     * Format the log message
     */
  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];

    if (this.config.includeTimestamps) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    if (this.config.includeLevelInOutput) {
      parts.push(`[${level.toUpperCase()}]`);
    }

    parts.push(message);

    return parts.join(' ');
  }

  /**
     * Log a debug message
     */
  public debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;

    const formattedMessage = this.formatMessage('debug', message);

    if (context) {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.debug(formattedMessage, context);
    } else {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.debug(formattedMessage);
    }
  }

  /**
     * Log an info message
     */
  public info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;

    const formattedMessage = this.formatMessage('info', message);

    if (context) {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.info(formattedMessage, context);
    } else {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.info(formattedMessage);
    }
  }

  /**
     * Log a warning message
     */
  public warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;

    const formattedMessage = this.formatMessage('warn', message);

    if (context) {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.warn(formattedMessage, context);
    } else {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.warn(formattedMessage);
    }
  }

  /**
     * Log an error message
     */
  public error(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;

    const formattedMessage = this.formatMessage('error', message);

    if (context) {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.error(formattedMessage, context);
    } else {
      // eslint-disable-next-line no-console, fitcopilot/use-logger
      console.error(formattedMessage);
    }
  }
}

/**
 * Singleton logger instance
 */
export const logger: LoggerInterface = new Logger();

/**
 * Default export of the logger
 */
export default logger; 