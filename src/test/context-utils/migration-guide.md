# Migration Guide: Type-Safe Context Testing Utilities

This guide will help you migrate your existing context tests to use the new type-safe context testing utilities. The new utilities eliminate `any` types and provide better type safety and code completion.

## Why Migrate?

- **Type Safety**: Detect errors at compile time rather than runtime
- **Better IDE Support**: Get code completion and documentation
- **Consistent Patterns**: Follow consistent patterns for mocking contexts
- **Simplified Testing**: Use factories to create complex test scenarios

## Migration Steps

### Step 1: Update Imports

Replace your existing imports with the new type-safe utilities:

```typescript
// Before
import { renderWithProvider, createMockContextValue } from '../test/context-utils';

// After
import { 
  renderWithProvider,
  createMockContext,
  createTestContext,
  createTestProviderFactory
} from '../test/context-utils';
```

### Step 2: Replace Direct Context Mocks with Factory Pattern

#### Before:

```typescript
const mockUserContext = {
  user: null,
  isLoggedIn: false,
  login: jest.fn(),
  logout: jest.fn(),
};

render(
  <UserContext.Provider value={mockUserContext}>
    <UserProfile />
  </UserContext.Provider>
);
```

#### After:

```typescript
// Create once at the top of your test file or in a shared test utils file
const {
  TestProvider: UserProvider,
  useTestContext: useUserContext
} = createTestContext<UserContextType>('User', defaultUserContext);

// Use in tests
render(
  <UserProvider>
    <UserProfile />
  </UserProvider>
);

// For authenticated state
render(
  <UserProvider value={{ 
    user: { id: '123', name: 'Test User' },
    isLoggedIn: true 
  }}>
    <UserProfile />
  </UserProvider>
);
```

### Step 3: Use Configurations for Complex Test Scenarios

If you need to test different configurations of the same context:

```typescript
// Create a factory with configuration options
const UserTestContext = createTestProviderFactory<UserContextType, UserConfig>(
  'User',
  (config = {}) => {
    const { 
      initialLoggedIn = false,
      mockLoginSuccess = true
    } = config;
    
    return {
      user: initialLoggedIn ? { id: '123', name: 'Test User' } : null,
      isLoggedIn: initialLoggedIn,
      login: jest.fn().mockImplementation(async () => mockLoginSuccess),
      logout: jest.fn(),
    };
  }
);

// Use in tests with different configurations
render(
  <UserTestContext.Provider config={{ 
    initialLoggedIn: false,
    mockLoginSuccess: false
  }}>
    <UserProfile />
  </UserTestContext.Provider>
);
```

### Step 4: Nested Providers Migration

For nested providers, use the type-safe `createNestedProviders` function:

#### Before:

```typescript
const providers = [
  {
    Provider: UserContext.Provider,
    props: { /* user context props */ }
  },
  {
    Provider: WorkoutContext.Provider,
    props: { /* workout context props */ }
  }
];

const wrapper = createNestedProviders(providers);
```

#### After:

```typescript
// Define provider types
interface UserProviderProps {
  user: User | null;
  isLoggedIn: boolean;
  // ...other properties
}

interface WorkoutProviderProps {
  workouts: Workout[];
  // ...other properties
}

// Create typed providers array
const providers = [
  {
    Provider: UserProvider as ContextProvider<UserProviderProps>,
    props: { 
      user: mockUser,
      isLoggedIn: true
    }
  },
  {
    Provider: WorkoutProvider as ContextProvider<WorkoutProviderProps>,
    props: {
      workouts: mockWorkouts
    }
  }
];

// Type-safe nested providers
const wrapper = createNestedProviders(providers);
```

### Step 5: Accessing Context in Tests

Use the hooks provided by the factory to access context values in tests:

```typescript
it('calls logout when button is clicked', () => {
  render(
    <UserProvider value={{ isLoggedIn: true, user: mockUser }}>
      <UserProfile />
    </UserProvider>
  );
  
  // Get the current context value
  const { logout } = useUserContext();
  
  // Click logout button
  fireEvent.click(screen.getByText('Logout'));
  
  // Verify logout was called
  expect(logout).toHaveBeenCalled();
});
```

## Example Migration

### Original Test

```typescript
import { UserContext, UserContextValue } from '../../context/UserContext';

describe('UserProfile', () => {
  it('shows user info when logged in', () => {
    const mockUserContext: any = {
      user: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com'
      },
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn()
    };
    
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserProfile />
      </UserContext.Provider>
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
```

### Migrated Test

```typescript
import { createTestContext } from '../test/context-utils';
import { UserContextType } from '../../context/UserContext';

// Create test context (do once per test file or in shared utils)
const {
  TestProvider: UserProvider,
  useTestContext: useUserContext
} = createTestContext<UserContextType>('User', {
  user: null,
  isLoggedIn: false,
  login: async () => false,
  logout: () => {},
});

describe('UserProfile', () => {
  it('shows user info when logged in', () => {
    render(
      <UserProvider value={{
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com'
        },
        isLoggedIn: true
      }}>
        <UserProfile />
      </UserProvider>
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
  
  it('calls logout when button clicked', () => {
    render(
      <UserProvider value={{
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com'
        },
        isLoggedIn: true
      }}>
        <UserProfile />
      </UserProvider>
    );
    
    // Get context value to check mocks
    const { logout } = useUserContext();
    
    // Click logout button
    fireEvent.click(screen.getByText('Logout'));
    
    // Verify function was called
    expect(logout).toHaveBeenCalled();
  });
});
```

## Tips for Successful Migration

1. **Start with the most critical contexts** that are used widely
2. **Create a shared contexts file** with common test providers
3. **Use TypeScript interfaces** from your actual context files
4. **Add type guards** where necessary for runtime validation
5. **Write detailed interface documentation** for better code completion

## Need Help?

If you encounter issues during migration, consult:
- The example files in `src/test/context-utils/examples/`
- The TypeScript patterns documentation in `docs/typescript-patterns.md`
- The test types documentation in `src/types/context-test.ts` 