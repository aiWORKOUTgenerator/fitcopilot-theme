# Utils Directory

This directory contains utility functions and services used throughout the FitCopilot application.

## Logger

The `logger.ts` module provides a structured logging utility with the following features:

### Features

- **Environment-aware**: Adjusts behavior based on development, production, test environments
- **Log Levels**: Supports DEBUG, INFO, WARN, ERROR with appropriate filtering
- **Context-aware**: Can create component-specific loggers
- **Performance Measurement**: Built-in timing utilities
- **Error Capture**: Standardized error reporting format
- **Safe Console Access**: Handles environments without console access 
- **Remote Logging Support**: Ready for integration with external logging services

### Architecture

The logger is designed with a modular architecture:

```
logger.ts
├── Base configuration and defaults
├── Log level management (via logLevels.ts)
├── safeConsole wrapper
├── Core logging functions (debug, info, warn, error)
├── Utility functions (captureError, group, time, timeEnd)
└── Component context creation
```

### Usage Examples

Basic logging:

```typescript
import logger from '../utils/logger';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

With component context:

```typescript
const componentLogger = logger.addContext('ComponentName');
componentLogger.info('Component initialized');
```

See the full documentation in `docs/logger-guide.md`.

## Other Utilities

- `debug.tsx`: Debug utilities for development
- `lazyLoad.tsx`: Component lazy loading utilities
- `variantLoader.ts`: Component variant loading system

## Implementation Details

### Environment Detection

The logger detects the current environment and adjusts its behavior:

```typescript
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
```

### Configuration Management

Configuration is managed through a combination of default settings and runtime overrides:

```typescript
// Default configurations based on environment
const DEFAULT_CONFIGS: Record<string, LoggerConfig> = {
  production: { minLevel: LogLevel.WARN, ... },
  development: { minLevel: LogLevel.DEBUG, ... },
  test: { minLevel: LogLevel.ERROR, ... }
};

// Runtime configuration
export const configureLogger = (config: Partial<LoggerConfig>): void => {
  activeConfig = { ...activeConfig, ...config };
};
```

### Safe Console Access

To prevent errors in environments without console access, the logger implements a safe wrapper:

```typescript
const safeConsole = {
  log: (...args: unknown[]) => {
    try {
      console.log(...args);
    } catch (_e) {
      // Silent fallback
    }
  },
  // Similar for other console methods
};
```

### Performance Considerations

- In production, only WARN and ERROR logs are enabled by default
- Timer data is conditionally collected based on configuration
- Remote logging integration is prepared but only activated in production

## ESLint Integration

The project includes a custom ESLint rule to enforce logger usage instead of direct console access:

```javascript
// Example rule (simplified)
{
  "rules": {
    "fitcopilot/use-logger": "error" // Enforces logger instead of console
  }
}
``` 