# Logger Usage Guide

This guide provides documentation for using the structured logger utility in the FitCopilot codebase. The logger provides environment-aware logging with different log levels and consistent formatting across the application.

## Basic Usage

Import the logger at the top of your file:

```typescript
import logger from '../utils/logger';
// OR for named exports
import { debug, info, warn, error } from '../utils/logger';
```

Use the appropriate log level functions:

```typescript
// Debug messages (only visible in development)
logger.debug('User clicked signup button', { userId: 123 });

// Informational messages
logger.info('User registration completed');

// Warning messages
logger.warn('API request taking longer than expected', { endpoint: '/users', duration: 3000 });

// Error messages
logger.error('Failed to process payment', { orderId: 'ABC123', errorCode: 500 });
```

## Component-Specific Logging

For components, create a contextualized logger:

```typescript
import logger from '../utils/logger'; 

// At the top of your component file
const componentLogger = logger.addContext('ButtonComponent');

// Then use it in your component
function ButtonComponent() {
  componentLogger.debug('Button rendered');
  
  const handleClick = () => {
    componentLogger.info('Button clicked');
    // ...
  };
}
```

## Error Handling

Use the `captureError` method for try/catch blocks:

```typescript
try {
  // Risky operation
  await submitForm(data);
} catch (error) {
  logger.captureError(error, { 
    component: 'RegistrationForm',
    formData: data,
    userId: user.id
  });
  // Show user-friendly error message
  setErrorMessage('Unable to submit form. Please try again.');
}
```

## Performance Timing

Measure performance with time tracking:

```typescript
// Start timing
const timerId = logger.time('dataFetchOperation');

// Do some work
await fetchData();

// End timing
logger.timeEnd(timerId);
// Will log: "Operation took 123.45ms"
```

## Grouping Related Logs

Group related logs together:

```typescript
logger.group('Form Validation', () => {
  logger.debug('Validating email');
  logger.debug('Validating password');
  logger.debug('Validation complete');
});
```

## Configuration

The logger automatically configures itself based on the environment, but you can override settings:

```typescript
// Set minimum log level
logger.setLogLevel(LogLevel.WARN); // Only show warnings and errors

// Full configuration
logger.configureLogger({
  minLevel: LogLevel.DEBUG,
  enableConsole: true,
  enableRemoteLogging: false,
  enableGrouping: true,
  enableTimers: true
});
```

## Best Practices

1. **Use Appropriate Levels**
   - `debug`: Development debugging only
   - `info`: General application flow
   - `warn`: Possible issues that don't break functionality
   - `error`: Issues that affect functionality

2. **Add Context to Logs**
   - Include relevant data objects with logs
   - Use component-specific loggers
   - Include IDs for entities (users, orders, etc.)

3. **Structured Data**
   - Pass objects as additional parameters for structured logging
   - Don't concatenate objects into strings

4. **Sensitive Data**
   - Never log passwords, tokens or personal information
   - Mask sensitive data (e.g., `{ email: maskEmail(user.email) }`)

5. **Error Formatting**
   - Use `logger.captureError()` instead of `logger.error(error.message)`
   - Include stack traces and relevant context

## Migration from Console

Replace console statements with the equivalent logger methods:

| Console Method | Logger Replacement |
|----------------|-------------------|
| `console.log()` | `logger.debug()` |
| `console.info()` | `logger.info()` |
| `console.warn()` | `logger.warn()` |
| `console.error()` | `logger.error()` |
| `console.group()` | `logger.group()` |
| `console.time()` | `logger.time()` |
| `console.timeEnd()` | `logger.timeEnd()` |

## ESLint Integration

The project includes a custom ESLint rule to enforce logger usage. To fix violations:

```bash
# Run ESLint with auto-fix for logger issues
npm run lint:fix-console
```

## Implementation Details

The logger implementation supports:
- Environment-specific configuration
- Timestamp inclusion
- Multiple log levels
- Performance timing
- Log grouping
- Context-aware logging
- Safe fallbacks for environments without console
- Remote logging in production (when configured) 