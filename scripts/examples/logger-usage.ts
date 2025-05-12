/**
 * Example usage of FitCopilot's structured logger with environment-based configuration
 * 
 * This example demonstrates how to:
 * 1. Use the basic logger functions
 * 2. Configure the logger based on environment
 * 3. Create component-specific loggers
 * 4. Use performance timing features
 */

import logger, { LogLevel } from '../../src/utils/logger';

// Example 1: Basic Usage
function basicLoggingExample() {
    logger.debug('This is a debug message');
    logger.info('This is an info message');
    logger.warn('This is a warning message');
    logger.error('This is an error message');

    // With additional context data
    logger.debug('User action completed', { userId: '123', action: 'login', timestamp: Date.now() });
}

// Example 2: Configure Logger based on environment
function configureLoggerExample() {
    // Development configuration (verbose)
    if (process.env.NODE_ENV === 'development') {
        logger.configureLogger({
            minLevel: LogLevel.DEBUG,
            enableConsole: true,
            enableGrouping: true,
            enableTimers: true
        });
    }

    // Production configuration (minimal)
    if (process.env.NODE_ENV === 'production') {
        logger.configureLogger({
            minLevel: LogLevel.WARN,
            enableConsole: true,
            enableRemoteLogging: true,
            enableGrouping: false,
            enableTimers: false
        });
    }

    // Test configuration (silent)
    if (process.env.NODE_ENV === 'test') {
        logger.configureLogger({
            minLevel: LogLevel.ERROR,
            enableConsole: false,
            enableGrouping: false,
            enableTimers: false
        });
    }
}

// Example 3: Component-specific logging
function componentLoggingExample() {
    // Create loggers for different components
    const userLogger = logger.addContext('UserComponent');
    const authLogger = logger.addContext('AuthService');
    const apiLogger = logger.addContext('ApiClient');

    // Component-specific logs
    userLogger.debug('User profile rendered');
    authLogger.info('Authentication process started');
    apiLogger.error('API request failed', { endpoint: '/users', status: 404 });

    // Grouped logs for a process
    authLogger.group('Login Process', () => {
        authLogger.debug('Validating credentials');
        authLogger.debug('Generating token');
        authLogger.info('User authenticated successfully');
    });
}

// Example 4: Performance timing
function performanceLoggingExample() {
    // Simple timing
    const timerId = logger.time('dataFetch');

    // Simulate some operation
    setTimeout(() => {
        logger.timeEnd(timerId);
    }, 500);

    // Component-specific timing
    const renderLogger = logger.addContext('RenderProcess');
    const renderTimerId = renderLogger.time('componentRender');

    // Simulate component rendering
    setTimeout(() => {
        renderLogger.timeEnd(renderTimerId);
    }, 300);
}

// Example 5: Error handling with structured logging
function errorHandlingExample() {
    try {
        // Simulate an error
        throw new Error('Something went wrong!');
    } catch (error) {
        // Capture error with additional context
        logger.captureError(error, {
            component: 'CheckoutProcess',
            userId: 'user-123',
            action: 'payment-processing'
        });
    }
}

// Run all examples
export function runLoggerExamples() {
    configureLoggerExample();
    basicLoggingExample();
    componentLoggingExample();
    performanceLoggingExample();
    errorHandlingExample();
}

// For direct execution of this example
if (require.main === module) {
    runLoggerExamples();
}

export default runLoggerExamples; 