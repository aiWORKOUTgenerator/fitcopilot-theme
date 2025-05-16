/**
 * Workout Service
 * 
 * Service for workout data management
 */
import { ApiResponse } from '../types/api-response';
import { safeApiRequest } from '../utils/api-utils';

// Workout type definitions matching the test mock structure
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

// Sample workout data to return from the mock service
const sampleWorkouts: Workout[] = [
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

// Real service implementation (would connect to API)
const workoutService = {
    /**
     * Get all workouts
     */
    getWorkouts: async (): Promise<ApiResponse<Workout[]>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a real implementation, this would call an API
            return [...sampleWorkouts];
        });
    },

    /**
     * Get a specific workout by ID
     */
    getWorkout: async (id: string): Promise<ApiResponse<Workout | null>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a real implementation, this would call an API
            const workout = sampleWorkouts.find(w => w.id === id);
            return workout ? { ...workout } : null;
        });
    },

    /**
     * Save a workout (create or update)
     */
    saveWorkout: async (workout: Workout): Promise<ApiResponse<Workout>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a real implementation, this would call an API
            return { ...workout };
        });
    },

    /**
     * Delete a workout
     */
    deleteWorkout: async (_id: string): Promise<ApiResponse<boolean>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a real implementation, this would call an API
            return true;
        });
    }
};

// Mock version for testing
export const mockWorkoutService = {
    getWorkouts: jest.fn().mockImplementation(workoutService.getWorkouts),
    getWorkout: jest.fn().mockImplementation(workoutService.getWorkout),
    saveWorkout: jest.fn().mockImplementation(workoutService.saveWorkout),
    deleteWorkout: jest.fn().mockImplementation(workoutService.deleteWorkout)
};

export default workoutService;

// Mock workouts for external use
export const mockWorkouts: Workout[] = [...sampleWorkouts]; 