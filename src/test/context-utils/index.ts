/**
 * Context Testing Utilities
 * 
 * This file exports all the context testing utilities needed for testing components
 * and hooks that use context.
 */

// Export base testing library utilities
export * from './testing-library';

// Export user context utilities
export { adminMockUser, authenticatedMockUser, createMockUser, defaultMockUser, MockAppProvider, renderWithUserContext, simulateLogin, simulateLogout, waitForAuthState } from './user-context';

// Export workout context utilities
export {
    createMockExercise,
    createMockWorkout, Exercise, mockApiFailures, mockApiResponses, MockWorkoutProvider, mockWorkouts,
    renderWithWorkoutContext, useWorkoutContext, Workout, WorkoutContext
} from './workout-context';

// Export nested providers utilities
export { createTestProvidersWrapper, renderWithAllProviders, TestProviders } from './nested-providers';

