# Logger Usage Guide

## Overview

The FitCopilot logger is a centralized, structured logging utility that provides consistent logging capabilities across the application. It's designed to replace direct use of `console` methods.

## Basic Usage

```typescript
import logger from '../utils/logger';

// Different log levels
logger.debug('Debug message');
logger.info('Informational message');
logger.warn('Warning message');
logger.error('Error message');

// With additional context data
logger.info('User logged in', { userId: 123, timestamp: new Date() });

// Error logging with error object
try {
  // Some code that might throw
} catch (error) {
  logger.error('Operation failed', { error });
}
```

## Component-Specific Logging

For component-specific logging, you can create a dedicated logger with context:

```typescript
import logger from '../utils/logger';

// Create component-specific logger
const componentLogger = logger.addContext('Button');

// Use the component logger
componentLogger.debug('Button rendered');
componentLogger.error('Click handler failed', { errorCode: 500 });
```

## Performance Measurement

Use the performance utilities for timing operations:

```typescript
import logger from '../utils/logger';

// Start timing
const timerId = logger.time('dataFetch');

// Some async operation
await fetchData();

// End timing and log result
logger.timeEnd(timerId);
```

## Environment Awareness

The logger automatically adjusts behavior based on the environment:

- **Development**: All logs are output to the console
- **Production**: Only warnings and errors are output, debug/info are suppressed
- **Test**: Logs can be captured for verification

## Error Capturing

For critical errors that should be reported to monitoring systems:

```typescript
import logger from '../utils/logger';

try {
  // Critical operation
} catch (error) {
  // Log and capture for reporting
  logger.captureError(error, {
    component: 'PaymentProcessor',
    severity: 'critical',
    userId: currentUser.id
  });
}
```

## Form Submission Pattern

For handling form submissions:

```typescript
const handleSubmit = async (event) => {
  event.preventDefault();
  setIsLoading(true);
  
  try {
    const result = await submitForm(formData);
    logger.info('Form submitted successfully', { formId: 'registration', userId });
    onSuccess(result);
  } catch (error) {
    logger.error('Form submission failed', { 
      formId: 'registration', 
      error,
      formData: sanitizeFormData(formData) // Remove sensitive data
    });
    setError('Submission failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

## API Call Pattern

For API requests:

```typescript
const fetchData = async () => {
  logger.debug('Fetching data', { endpoint: '/api/users' });
  
  try {
    const response = await fetch('/api/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    logger.debug('Data fetched successfully', { count: data.length });
    return data;
  } catch (error) {
    logger.error('API request failed', { 
      endpoint: '/api/users',
      error: error.message
    });
    throw error;
  }
};
```

## Best Practices

1. **Use the appropriate log level** - Debug for development info, Info for significant events, Warn for potential issues, Error for failures
2. **Include relevant context** - Add useful metadata as a second parameter
3. **Sanitize sensitive data** - Never log passwords, tokens, or personal information
4. **Be concise but descriptive** - Log messages should be clear and actionable
5. **Log at boundaries** - Focus on component entry/exit points, API calls, and state transitions 