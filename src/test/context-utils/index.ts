/**
 * Context Testing Utilities
 * 
 * This file exports all the context testing utilities needed for testing components
 * and hooks that use context.
 */

// Export base testing library utilities
export * from './testing-library';

// Export generic provider utilities
export * from './generic-provider';

// Export user context utilities
export { MockAppProvider, adminMockUser, authenticatedMockUser, createMockUser, defaultMockUser, renderWithUserContext, simulateLogin, simulateLogout, waitForAuthState } from './user-context';

// Export workout context utilities
export {
    Exercise, MockWorkoutProvider, Workout, WorkoutContext, createMockExercise,
    createMockWorkout, mockApiFailures, mockApiResponses, mockWorkouts,
    renderWithWorkoutContext, useWorkoutContext
} from './workout-context';

// Export nested providers utilities
export { TestProviders, createTestProvidersWrapper, renderWithAllProviders } from './nested-providers';

