import { act, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { createProviderWrapper } from './testing-library';
import {
    createMockWorkout,
    MockWorkoutProvider,
    mockWorkouts,
    renderWithWorkoutContext,
    useWorkoutContext
} from './workout-context';

describe('WorkoutContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Hook behavior', () => {
        it('provides initial empty state', () => {
            const { result } = renderHook(() => useWorkoutContext(), {
                wrapper: createProviderWrapper(MockWorkoutProvider, {})
            });

            expect(result.current.workouts).toEqual([]);
            expect(result.current.selectedWorkout).toBeNull();
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it('loads workouts correctly', async () => {
            const { result } = renderHook(() => useWorkoutContext(), {
                wrapper: createProviderWrapper(MockWorkoutProvider, {})
            });

            // Start with no workouts
            expect(result.current.workouts).toEqual([]);

            // Trigger loading of workouts
            await act(async () => {
                await result.current.loadWorkouts();
            });

            // Verify workouts are loaded
            expect(result.current.workouts).toHaveLength(mockWorkouts.length);
            expect(result.current.workouts[0].title).toBe(mockWorkouts[0].title);
            expect(result.current.error).toBeNull();
        });

        it('handles workout loading failures', async () => {
            const { result } = renderHook(() => useWorkoutContext(), {
                wrapper: createProviderWrapper(MockWorkoutProvider, { shouldFailOnLoad: true })
            });

            // Trigger loading of workouts
            await act(async () => {
                await result.current.loadWorkouts();
            });

            // Verify error state
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe('Failed to load workouts');
            expect(result.current.workouts).toEqual([]);
        });

        it('selects a workout correctly', async () => {
            const { result } = renderHook(() => useWorkoutContext(), {
                wrapper: createProviderWrapper(MockWorkoutProvider, { initialWorkouts: mockWorkouts })
            });

            // Initially no workout is selected
            expect(result.current.selectedWorkout).toBeNull();

            // Select a workout
            act(() => {
                result.current.selectWorkout(mockWorkouts[0].id);
            });

            // Verify workout is selected
            expect(result.current.selectedWorkout).toEqual(mockWorkouts[0]);

            // Clear selection
            act(() => {
                result.current.clearSelection();
            });

            // Verify selection is cleared
            expect(result.current.selectedWorkout).toBeNull();
        });

        it('saves a workout correctly', async () => {
            const { result } = renderHook(() => useWorkoutContext(), {
                wrapper: createProviderWrapper(MockWorkoutProvider, { initialWorkouts: mockWorkouts })
            });

            // Create a new workout to save
            const newWorkout = createMockWorkout({
                id: 'new-workout',
                title: 'New Test Workout'
            });

            // Save the workout
            let success = false;
            await act(async () => {
                success = await result.current.saveWorkout(newWorkout);
            });

            // Verify save was successful
            expect(success).toBe(true);
            expect(result.current.workouts).toHaveLength(mockWorkouts.length + 1);
            expect(result.current.workouts).toContainEqual(newWorkout);
        });

        it('handles workout save failures', async () => {
            const { result } = renderHook(() => useWorkoutContext(), {
                wrapper: createProviderWrapper(MockWorkoutProvider, {
                    initialWorkouts: mockWorkouts,
                    shouldFailOnSave: true
                })
            });

            // Create a workout to save
            const workout = createMockWorkout();

            // Try to save the workout
            let success = false;
            await act(async () => {
                success = await result.current.saveWorkout(workout);
            });

            // Verify save failed
            expect(success).toBe(false);
            expect(result.current.error).toBe('Failed to save workout');
        });

        it('deletes a workout correctly', async () => {
            const { result } = renderHook(() => useWorkoutContext(), {
                wrapper: createProviderWrapper(MockWorkoutProvider, { initialWorkouts: mockWorkouts })
            });

            // Get the initial count
            const initialCount = result.current.workouts.length;

            // Delete a workout
            let success = false;
            await act(async () => {
                success = await result.current.deleteWorkout(mockWorkouts[0].id);
            });

            // Verify deletion was successful
            expect(success).toBe(true);
            expect(result.current.workouts).toHaveLength(initialCount - 1);
            expect(result.current.workouts.some(w => w.id === mockWorkouts[0].id)).toBe(false);
        });
    });

    describe('Component integration', () => {
        // Test component using the workout context
        const WorkoutListComponent = () => {
            const { workouts, isLoading, error, loadWorkouts, selectWorkout, selectedWorkout } = useWorkoutContext();

            return (
                <div>
                    <button onClick={() => loadWorkouts()} data-testid="load-button">
                        Load Workouts
                    </button>

                    {isLoading && <div data-testid="loading-indicator">Loading...</div>}
                    {error && <div data-testid="error-message">{error}</div>}

                    <ul data-testid="workout-list">
                        {workouts.map(workout => (
                            <li key={workout.id} data-testid={`workout-${workout.id}`}>
                                <span>{workout.title}</span>
                                <button
                                    onClick={() => selectWorkout(workout.id)}
                                    data-testid={`select-${workout.id}`}
                                >
                                    View
                                </button>
                            </li>
                        ))}
                    </ul>

                    {selectedWorkout && (
                        <div data-testid="workout-details">
                            <h2>{selectedWorkout.title}</h2>
                            <p>{selectedWorkout.description}</p>
                            <p>Duration: {selectedWorkout.duration} minutes</p>
                            <p>Difficulty: {selectedWorkout.difficulty}</p>
                        </div>
                    )}
                </div>
            );
        };

        it('renders workout list after loading', async () => {
            const user = userEvent.setup();

            renderWithWorkoutContext(<WorkoutListComponent />);

            // Initially no workouts should be shown
            const workoutList = screen.getByTestId('workout-list');
            expect(workoutList.children).toHaveLength(0);

            // Click load button
            const loadButton = screen.getByTestId('load-button');
            await user.click(loadButton);

            // Loading indicator should appear
            expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

            // Wait for workouts to load
            await waitFor(() => {
                expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
            });

            // Verify workouts are rendered
            await waitFor(() => {
                const workoutItems = screen.getAllByTestId(/^workout-/);
                expect(workoutItems).toHaveLength(mockWorkouts.length);
                expect(screen.getByText(mockWorkouts[0].title)).toBeInTheDocument();
            });
        });

        it('shows workout details when selected', async () => {
            const user = userEvent.setup();

            renderWithWorkoutContext(<WorkoutListComponent />, {
                initialWorkouts: mockWorkouts
            });

            // Details should not be shown initially
            expect(screen.queryByTestId('workout-details')).not.toBeInTheDocument();

            // Click view button for the first workout
            const viewButton = screen.getByTestId(`select-${mockWorkouts[0].id}`);
            await user.click(viewButton);

            // Workout details should be shown
            await waitFor(() => {
                const detailsElement = screen.getByTestId('workout-details');
                expect(detailsElement).toBeInTheDocument();
                expect(detailsElement).toHaveTextContent(mockWorkouts[0].title);
                expect(detailsElement).toHaveTextContent(mockWorkouts[0].description);
                expect(detailsElement).toHaveTextContent(`Duration: ${mockWorkouts[0].duration} minutes`);
            });
        });

        it('shows error message when loading fails', async () => {
            const user = userEvent.setup();

            renderWithWorkoutContext(<WorkoutListComponent />, {
                shouldFailOnLoad: true
            });

            // Click load button
            const loadButton = screen.getByTestId('load-button');
            await user.click(loadButton);

            // Wait for error message
            await waitFor(() => {
                const errorMessage = screen.getByTestId('error-message');
                expect(errorMessage).toBeInTheDocument();
                expect(errorMessage).toHaveTextContent('Failed to load workouts');
            });
        });
    });
}); 