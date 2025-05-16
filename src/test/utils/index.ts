// Re-export all test utilities for easy imports

// Analysis tools
export * from './analysis/categorizeFailures';
export * from './analysis/collectTestResults';
export * from './analysis/findSharedDependencies';
export * from './analysis/runAnalysis';

// Provider utilities
export * from './providers';

// Service mocks
export * from './mocks/services';

// Render utilities
export * from './render';

// Additional test helpers
export * from './helpers';

// Re-export test types
export * from '../../types/test';

/**
 * Common test data factory functions
 */
export const testData = {
  /**
     * Create a test user object
     */
  user: (overrides = {}) => ({
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  }),

  /**
     * Create a test workout object
     */
  workout: (overrides = {}) => ({
    id: 'test-workout-id',
    name: 'Test Workout',
    description: 'Test workout description',
    exercises: [],
    duration: 30,
    difficulty: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),

  /**
     * Create a test exercise object
     */
  exercise: (overrides = {}) => ({
    id: 'test-exercise-id',
    name: 'Test Exercise',
    description: 'Test exercise description',
    muscleGroups: ['chest', 'triceps'],
    difficulty: 'medium',
    equipment: ['dumbbells'],
    instructions: ['Step 1', 'Step 2'],
    ...overrides
  }),

  /**
     * Create a list of test items
     */
  list: <T>(factory: (index: number) => T, count: number): T[] => {
    return Array.from({ length: count }, (_, i) => factory(i));
  }
}; 