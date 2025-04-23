---
sidebar_position: 1
---

# API Reference Overview

## Introduction

The FitCopilot theme provides several APIs and interfaces for interacting with workout data, user preferences, and WordPress integration. This reference documentation covers both WordPress REST API endpoints and React interfaces.

## API Categories

The API documentation is organized into three main sections:

### WordPress Endpoints

Documentation of the custom WordPress REST API endpoints used by the application, including:

- Authentication requirements
- Available endpoints
- Request/response formats
- Error handling

[View WordPress Endpoints →](./wordpress/overview.md)

### React Interfaces

TypeScript interfaces and types used throughout the application, including:

- Component props interfaces
- Data models
- State interfaces
- API response types

[View React Interfaces →](./interfaces/overview.md)

### React Hooks

Custom React hooks that provide reusable logic for:

- Data fetching
- State management
- WordPress API integration
- User interactions

[View React Hooks →](./hooks/overview.md)

## Using the API

### Authentication

Most API endpoints require authentication using WordPress nonces. Here's how to authenticate:

```typescript
// Example authentication for API requests
const fetchData = async () => {
  const response = await fetch('/wp-json/fitcopilot/v1/workouts', {
    headers: {
      'X-WP-Nonce': wpApiSettings.nonce,
    },
  });
  
  return response.json();
};
```

### Error Handling

API responses include standard HTTP status codes along with detailed error messages when applicable. Here's how to handle errors:

```typescript
const fetchData = async () => {
  try {
    const response = await fetch('/wp-json/fitcopilot/v1/workouts');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Handle error appropriately
  }
};
```

## API Versioning

All API endpoints are versioned to ensure backward compatibility:

- **v1**: Current stable version
- **experimental**: For upcoming features (not stable)

## API Changes and Updates

API changes are documented in the [Changelog](./changelog.md) and follow semantic versioning:

- **Major version**: Breaking changes
- **Minor version**: New features, no breaking changes
- **Patch version**: Bug fixes, no breaking changes

## Development Tools

For API development and testing, we recommend:

- [Postman](https://www.postman.com/) for API testing
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [React Query](https://react-query.tanstack.com/) for data fetching
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/) for WordPress API reference 