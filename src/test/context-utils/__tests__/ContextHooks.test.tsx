// import { act, renderHook } from '@testing-library/react-hooks';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider, useUser } from '../../../context/AppContext';
import { createTestProvidersWrapper } from '../nested-providers';
import { MockWorkoutProvider, useWorkoutContext } from '../workout-context';

// Create custom hooks that use our context
const useUserState = () => {
  const { user, login, logout } = useUser();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    isAuthenticated: user.isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout
  };
};

// Custom hook for workout data
const useWorkoutData = () => {
  const {
    workouts,
    loadWorkouts,
    isLoading,
    error,
    selectedWorkout,
    selectWorkout,
    clearSelection
  } = useWorkoutContext();

  const [favoriteWorkouts, setFavoriteWorkouts] = React.useState<string[]>([]);

  const toggleFavorite = (workoutId: string) => {
    setFavoriteWorkouts(prev =>
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  return {
    workouts,
    loadWorkouts,
    isLoading,
    error,
    selectedWorkout,
    selectWorkout,
    clearSelection,
    favoriteWorkouts,
    toggleFavorite,
    isFavorite: (id: string) => favoriteWorkouts.includes(id)
  };
};

describe('Context Hook Testing', () => {
  test('useUserState manages auth state correctly', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useUserState(), { wrapper });

    // Initial state
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // Trigger login
    let loginSuccess = false;
    act(() => {
      result.current.login('test@example.com', 'password')
        .then((success) => {
          loginSuccess = success;
        });
    });

    // Verify loading state
    expect(result.current.loading).toBe(true);

    // Wait for state update - using waitFor instead of waitForNextUpdate
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Verify authenticated state
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(loginSuccess).toBe(true);

    // Trigger logout
    act(() => {
      result.current.logout();
    });

    // Verify unauthenticated state
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('useWorkoutData hook manages workout data', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockWorkoutProvider>{children}</MockWorkoutProvider>
    );

    const { result } = renderHook(() => useWorkoutData(), { wrapper });

    // Initial state
    expect(result.current.workouts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.favoriteWorkouts).toEqual([]);

    // Trigger fetch
    act(() => {
      result.current.loadWorkouts();
    });

    // Verify loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for state update - using waitFor instead of waitForNextUpdate
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify workouts loaded
    expect(result.current.workouts.length).toBeGreaterThan(0);

    // Test favorite toggling
    const firstWorkoutId = result.current.workouts[0].id;

    // Initially not a favorite
    expect(result.current.isFavorite(firstWorkoutId)).toBe(false);

    // Toggle favorite
    act(() => {
      result.current.toggleFavorite(firstWorkoutId);
    });

    // Now should be a favorite
    expect(result.current.isFavorite(firstWorkoutId)).toBe(true);
    expect(result.current.favoriteWorkouts).toContain(firstWorkoutId);

    // Toggle again
    act(() => {
      result.current.toggleFavorite(firstWorkoutId);
    });

    // Now should not be a favorite
    expect(result.current.isFavorite(firstWorkoutId)).toBe(false);
    expect(result.current.favoriteWorkouts).not.toContain(firstWorkoutId);
  });

  test('combined hooks with nested providers', async () => {
    // Create a wrapper with all providers
    const wrapper = createTestProvidersWrapper({
      initialWorkouts: [{ id: 'workout-1', title: 'Test Workout' }]
    });

    // Test a custom hook that uses multiple contexts
    const useUserAndWorkouts = () => {
      const { user, isAuthenticated } = useUserState();
      const { workouts, favoriteWorkouts, toggleFavorite } = useWorkoutData();

      return {
        user,
        isAuthenticated,
        workouts,
        favoriteWorkouts,
        toggleFavorite,
        userWorkoutsCount: isAuthenticated ? workouts.length : 0
      };
    };

    const { result } = renderHook(() => useUserAndWorkouts(), { wrapper });

    // Initial state - user not authenticated, but workouts exist
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.workouts.length).toBe(1);
    expect(result.current.userWorkoutsCount).toBe(0); // 0 because not authenticated

    // Add a workout to favorites
    act(() => {
      result.current.toggleFavorite('workout-1');
    });

    expect(result.current.favoriteWorkouts).toContain('workout-1');
  });
}); 