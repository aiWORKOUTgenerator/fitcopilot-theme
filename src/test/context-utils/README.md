# Context Testing Utilities

This directory contains utilities for testing React components that use contexts.

## Phase 3.1 Improvements: Type-Safe Context Testing

As part of the ESLint Warning Remediation Sprint, we've made significant improvements to ensure full type safety in context testing utilities:

1. **Eliminated `any` Types**: Replaced all `any` types with proper TypeScript interfaces and generics
2. **Added Generic Provider Pattern**: Introduced a reusable pattern for creating type-safe test providers
3. **Created Provider Factory Pattern**: Added factory functions for creating configurable context providers
4. **Enhanced Type Definitions**: Created comprehensive type definitions in `src/types/context-test.ts`
5. **Provided Migration Guide**: Added documentation for migrating existing tests

## Core Files

- **testing-library.tsx**: Core utilities for creating context provider wrappers
- **generic-provider.tsx**: Generic utilities for creating type-safe test providers
- **nested-providers.tsx**: Utilities for testing with multiple nested providers
- **user-context.tsx**: User context testing utilities
- **workout-context.tsx**: Workout context testing utilities

## Example Usage

### Simple Provider Pattern

```typescript
// Create a test context provider
const {
  TestProvider: UserProvider,
  useTestContext: useUserContext
} = createTestContext<UserContextType>('User', defaultUserContext);

// Use in tests
render(
  <UserProvider value={{ isLoggedIn: true, user: mockUser }}>
    <UserProfile />
  </UserProvider>
);
```

### Factory Pattern with Configuration

```typescript
// Create a configurable provider factory
const UserTestContext = createTestProviderFactory<UserContextType, UserConfig>(
  'User',
  (config = {}) => {
    const { initialLoggedIn = false } = config;
    
    return {
      user: initialLoggedIn ? mockUser : null,
      isLoggedIn: initialLoggedIn,
      login: jest.fn(),
      logout: jest.fn(),
    };
  }
);

// Use with configuration
render(
  <UserTestContext.Provider config={{ initialLoggedIn: true }}>
    <UserProfile />
  </UserTestContext.Provider>
);
```

## Documentation

- **migration-guide.md**: Step-by-step guide for migrating to type-safe utilities
- **examples/**: Directory containing example implementations
- **context-testing-guide.md**: General guidelines for testing with contexts
- **context-testing-patterns.md**: Common patterns for context testing

## Type Definitions

All type definitions for context testing are centralized in:
- `src/types/context-test.ts`: Context testing specific types
- `src/types/test.ts`: General test utility types 