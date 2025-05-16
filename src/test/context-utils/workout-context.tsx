/**
 * WorkoutContext Testing Utilities
 * 
 * This file provides reusable utilities for testing components that use the workout context.
 */
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

// Define workout types matching what would be in the actual application
export interface Workout {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    exercises: Exercise[];
    tags: string[];
    created: string;
    modified: string;
}

export interface Exercise {
    id: string;
    name: string;
    description: string;
    sets: number;
    reps: number;
    duration?: number;
    restPeriod: number;
    equipment?: string[];
    videoUrl?: string;
    imageUrl?: string;
}

// Define the workout context interface
export interface WorkoutContextValue {
    workouts: Workout[];
    selectedWorkout: Workout | null;
    isLoading: boolean;
    error: string | null;
    loadWorkouts: () => Promise<void>;
    getWorkout: (id: string) => Promise<Workout | null>;
    saveWorkout: (workout: Workout) => Promise<boolean>;
    deleteWorkout: (id: string) => Promise<boolean>;
    selectWorkout: (id: string) => void;
    clearSelection: () => void;
}

// Create a mock context with default values
const defaultWorkoutContextValue: WorkoutContextValue = {
  workouts: [],
  selectedWorkout: null,
  isLoading: false,
  error: null,
  loadWorkouts: async () => { },
  getWorkout: async () => null,
  saveWorkout: async () => false,
  deleteWorkout: async () => false,
  selectWorkout: () => { },
  clearSelection: () => { }
};

// Create the context
export const WorkoutContext = createContext<WorkoutContextValue>(defaultWorkoutContextValue);

// Sample workout data for testing
export const mockWorkouts: Workout[] = [
  {
    id: 'workout-1',
    title: 'Full Body Workout',
    description: 'A complete full body workout for beginners',
    duration: 45,
    difficulty: 'beginner',
    exercises: [
      {
        id: 'ex-1',
        name: 'Push-ups',
        description: 'Standard push-ups',
        sets: 3,
        reps: 10,
        restPeriod: 60,
        equipment: ['none']
      },
      {
        id: 'ex-2',
        name: 'Squats',
        description: 'Regular bodyweight squats',
        sets: 3,
        reps: 15,
        restPeriod: 60,
        equipment: ['none']
      }
    ],
    tags: ['full-body', 'beginner', 'no-equipment'],
    created: '2023-01-15T10:00:00Z',
    modified: '2023-01-15T10:00:00Z'
  },
  {
    id: 'workout-2',
    title: 'Upper Body Focus',
    description: 'Intermediate upper body strength workout',
    duration: 60,
    difficulty: 'intermediate',
    exercises: [
      {
        id: 'ex-3',
        name: 'Dumbbell Bench Press',
        description: 'Bench press with dumbbells',
        sets: 4,
        reps: 8,
        restPeriod: 90,
        equipment: ['dumbbells', 'bench']
      }
    ],
    tags: ['upper-body', 'intermediate', 'strength'],
    created: '2023-02-20T14:30:00Z',
    modified: '2023-03-05T08:15:00Z'
  }
];

// Mock API responses
export const mockApiResponses = {
  getWorkouts: mockWorkouts,
  getWorkout: (id: string) => mockWorkouts.find(w => w.id === id) || null,
  saveWorkout: true,
  deleteWorkout: true
};

// Mock API failures
export const mockApiFailures = {
  getWorkouts: new Error('Failed to load workouts'),
  getWorkout: new Error('Failed to load workout'),
  saveWorkout: new Error('Failed to save workout'),
  deleteWorkout: new Error('Failed to delete workout')
};

// Provider component with configurable initial state
interface MockWorkoutProviderProps {
    initialWorkouts?: Workout[];
    initialSelected?: Workout | null;
    initialLoading?: boolean;
    initialError?: string | null;
    shouldFailOnLoad?: boolean;
    shouldFailOnSave?: boolean;
    shouldFailOnDelete?: boolean;
    children: ReactNode;
}

export const MockWorkoutProvider: FC<MockWorkoutProviderProps> = ({
  initialWorkouts = [],
  initialSelected = null,
  initialLoading = false,
  initialError = null,
  shouldFailOnLoad = false,
  shouldFailOnSave = false,
  shouldFailOnDelete = false,
  children
}) => {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(initialSelected);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(initialError);

  // Load workouts
  const loadWorkouts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      if (shouldFailOnLoad) {
        throw new Error('Failed to load workouts');
      }

      setWorkouts(mockWorkouts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [shouldFailOnLoad]);

  // Get a specific workout
  const getWorkout = useCallback(async (id: string): Promise<Workout | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      if (shouldFailOnLoad) {
        throw new Error(`Failed to load workout with id ${id}`);
      }

      const workout = mockWorkouts.find(w => w.id === id) || null;
      return workout;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [shouldFailOnLoad]);

  // Save a workout
  const saveWorkout = useCallback(async (workout: Workout): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      if (shouldFailOnSave) {
        throw new Error('Failed to save workout');
      }

      setWorkouts(prev => {
        const index = prev.findIndex(w => w.id === workout.id);
        if (index >= 0) {
          // Update existing
          const updated = [...prev];
          updated[index] = workout;
          return updated;
        } else {
          // Add new
          return [...prev, workout];
        }
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [shouldFailOnSave]);

  // Delete a workout
  const deleteWorkout = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      if (shouldFailOnDelete) {
        throw new Error(`Failed to delete workout with id ${id}`);
      }

      setWorkouts(prev => prev.filter(w => w.id !== id));
      if (selectedWorkout?.id === id) {
        setSelectedWorkout(null);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedWorkout, shouldFailOnDelete]);

  // Select a workout
  const selectWorkout = useCallback((id: string) => {
    const workout = workouts.find(w => w.id === id) || null;
    setSelectedWorkout(workout);
  }, [workouts]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedWorkout(null);
  }, []);

  // Create the context value
  const contextValue = useMemo<WorkoutContextValue>(() => ({
    workouts,
    selectedWorkout,
    isLoading,
    error,
    loadWorkouts,
    getWorkout,
    saveWorkout,
    deleteWorkout,
    selectWorkout,
    clearSelection
  }), [
    workouts,
    selectedWorkout,
    isLoading,
    error,
    loadWorkouts,
    getWorkout,
    saveWorkout,
    deleteWorkout,
    selectWorkout,
    clearSelection
  ]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use workout context
export const useWorkoutContext = (): WorkoutContextValue => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};

// Custom render function for components that need WorkoutContext
export function renderWithWorkoutContext(
  ui: React.ReactElement,
  {
    initialWorkouts = [],
    initialSelected = null,
    initialLoading = false,
    initialError = null,
    shouldFailOnLoad = false,
    shouldFailOnSave = false,
    shouldFailOnDelete = false,
    ...renderOptions
  }: Partial<MockWorkoutProviderProps> & Omit<RenderOptions, 'wrapper'>
): RenderResult & { mockWorkouts: Workout[] } {
  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <MockWorkoutProvider
          initialWorkouts={initialWorkouts}
          initialSelected={initialSelected}
          initialLoading={initialLoading}
          initialError={initialError}
          shouldFailOnLoad={shouldFailOnLoad}
          shouldFailOnSave={shouldFailOnSave}
          shouldFailOnDelete={shouldFailOnDelete}
        >
          {children}
        </MockWorkoutProvider>
      ),
      ...renderOptions,
    }),
    mockWorkouts: initialWorkouts.length ? initialWorkouts : mockWorkouts,
  };
}

// Factory function to create workouts with custom properties
export function createMockWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    id: `workout-${Date.now()}`,
    title: 'Test Workout',
    description: 'A workout for testing',
    duration: 30,
    difficulty: 'beginner',
    exercises: [],
    tags: ['test'],
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    ...overrides
  };
}

// Factory function to create exercises with custom properties
export function createMockExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: `exercise-${Date.now()}`,
    name: 'Test Exercise',
    description: 'An exercise for testing',
    sets: 3,
    reps: 10,
    restPeriod: 60,
    ...overrides
  };
} 