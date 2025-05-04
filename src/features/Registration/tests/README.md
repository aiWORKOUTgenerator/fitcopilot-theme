# Registration Flow Tests

This directory contains automated tests for the Registration feature, focusing on ensuring the step flow works correctly.

## Test Structure

- `setup.ts` - Common test setup including mocks and configuration
- `useRegistrationProgress.test.tsx` - Unit tests for the core transition logic
- `transitionEvents.test.tsx` - Tests for the event emission system
- `RegistrationFlow.test.tsx` - Integration tests for the complete registration flow
- `analytics.test.tsx` - Tests for analytics tracking during registration

## Running Tests

You can run the tests using the following npm commands:

```bash
# Run all tests
npm test

# Run only Registration tests
npm run test:registration

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Coverage

These tests verify:

1. **Navigation Logic**
   - Standard step transitions
   - Special transitions (TIME_COMMITMENT → ACCOUNT_DETAILS → PRICING)
   - Back navigation
   - Direct navigation via goToStep

2. **Event System**
   - Event subscription and emission
   - Different transition types (STANDARD, MAP_BASED, DIRECT, BACK, OVERRIDE)
   - Event metadata

3. **Analytics Integration**
   - Proper tracking of step views
   - Tracking of transitions between steps
   - Form field change tracking
   - Account creation events

4. **Component Integration**
   - Full registration flow journey
   - Data persistence between steps
   - UI element interaction
   - Progress indicator

## Adding New Tests

When adding new tests:

1. Keep unit tests focused on one component or hook
2. Use integration tests for multi-component interactions
3. Mock external dependencies (API calls, analytics, etc.)
4. Ensure tests are independent and don't rely on state from other tests 