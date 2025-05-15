# Test Utilities Framework

This framework provides a set of utilities to simplify testing React components in our application. It's designed to make tests more maintainable, consistent, and focused on behavior rather than implementation details.

## Getting Started

Import the utilities in your test files:

```typescript
import { render, screen, waitFor } from '@/test/utils';
```

## Key Features

### 1. Custom Render Function

The `render` function wraps RTL's render with our application providers:

```typescript
const { user } = render(<MyComponent />);

// With custom provider props
render(<MyComponent />, {
  providerProps: {
    userContext: { isAuthenticated: true },
    workoutContext: { workouts: [] },
  }
});
```

### 2. Provider Mocks

Create provider mocks for contexts:

```typescript
import { createUserContextMock } from '@/test/utils';

const { UserProvider, mockValue } = createUserContextMock({
  isAuthenticated: true,
  user: { id: 'custom-id' }
});
```

### 3. Service Mocks

Mock services with proper TypeScript support:

```typescript
import { mockApiService, mockStorageService } from '@/test/utils';

const apiService = mockApiService({
  get: jest.fn().mockResolvedValue({ data: { test: 'data' } })
});

const storageService = mockStorageService({
  'user-token': 'test-token'
});
```

### 4. Test Data Factories

Create test data consistently:

```typescript
import { testData } from '@/test/utils';

const user = testData.user({ role: 'admin' });
const workout = testData.workout({ name: 'Custom Workout' });
const exercises = testData.list(i => testData.exercise({ name: `Exercise ${i}` }), 3);
```

### 5. Async Testing Helpers

Simplify async testing:

```typescript
import { waitForCondition, retryAssertion } from '@/test/utils';

// Wait for a condition to be true
await waitForCondition(() => button.disabled === true);

// Retry assertions that may initially fail
await retryAssertion(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

## Best Practices

1. **Use Role-Based Selectors**
   ```typescript
   // Good
   screen.getByRole('button', { name: 'Submit' });
   
   // Avoid
   screen.getByTestId('submit-button');
   ```

2. **Test Behavior, Not Implementation**
   ```typescript
   // Good
   await user.click(submitButton);
   expect(screen.getByText('Success')).toBeInTheDocument();
   
   // Avoid
   expect(component.state.isSubmitting).toBe(false);
   ```

3. **Use Setup Functions**
   ```typescript
   const setup = (props = {}) => {
     const utils = render(<MyComponent {...props} />);
     return {
       ...utils,
       button: screen.getByRole('button'),
     };
   };
   ```

4. **Mock Only What You Need**
   ```typescript
   // Good
   mockApiService({
     get: jest.fn().mockResolvedValue({ data: { id: 1 } })
   });
   
   // Avoid excessive mocking
   jest.spyOn(global, 'fetch').mockImplementation(...);
   ```

## Analysis Tools

This framework includes tools to analyze test failures:

```bash
# Run analysis on all tests
npx ts-node src/test/utils/analysis/runAnalysis.ts

# Run analysis on specific tests
npx ts-node src/test/utils/analysis/runAnalysis.ts "components/Button"
```

The analysis will generate reports in the `test-analysis` folder:
- `failure-report.md`: Categorized test failures
- `dependency-report.md`: Shared dependencies that might be causing failures

## Examples

Check out example tests in the `src/test/examples` directory.

## Troubleshooting

1. **Context Values Not Available**
   - Ensure you're using the custom `render` function
   - Check that context providers are properly mocked

2. **Async Updates Not Reflected**
   - Use `waitFor` or `findBy` queries for async updates
   - Ensure your mock promises are resolving

3. **Event Handlers Not Being Called**
   - Use `user.click()` instead of `fireEvent.click()`
   - Check if the element is disabled

## Contributing

When adding new utilities:
1. Add proper TypeScript types
2. Write tests for the utility
3. Update this documentation
4. Add an example if appropriate 