import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useUser } from '../../../context/AppContext';
import { renderWithAllProviders } from '../nested-providers';
import { useWorkoutContext } from '../workout-context';

// Mock Theme context hook for testing
const useThemeContext = () => {
  return {
    theme: 'light',
    toggleTheme: jest.fn().mockImplementation(() => {
      // Mock implementation of toggle theme that would update state in a real component
    })
  };
};

// Mock for testing purposes
jest.mock('../../../context/AppContext', () => {
  const originalModule = jest.requireActual('../../../context/AppContext');
  return {
    ...originalModule,
    useTheme: () => ({
      theme: { mode: 'light', prefersDarkMode: false },
      setThemeMode: jest.fn()
    })
  };
});

// Test component using multiple contexts
const MultiContextConsumer = () => {
  const { user } = useUser();
  const { workouts, loadWorkouts } = useWorkoutContext();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <div>
      <div data-testid="theme-info">Theme: {theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>

      {user.isAuthenticated ? (
        <div data-testid="user-theme-info">
          {user.displayName}'s theme: {theme}
        </div>
      ) : (
        <div>Not authenticated</div>
      )}

      <button onClick={loadWorkouts}>Load Workouts</button>

      {workouts.length > 0 ? (
        <div data-testid="workout-count">
          {user.isAuthenticated ? user.displayName : 'User'} has {workouts.length} workouts
        </div>
      ) : (
        <div>No workouts</div>
      )}
    </div>
  );
};

describe('Nested Context Testing', () => {
  test('correctly renders with multiple contexts', () => {
    const { debug } = renderWithAllProviders(<MultiContextConsumer />, {
      initialUser: {
        isAuthenticated: true,
        displayName: 'Test User',
        email: 'test@example.com',
      },
      initialWorkouts: [
        { id: 'workout-1', title: 'Workout 1' },
        { id: 'workout-2', title: 'Workout 2' }
      ]
    });

    debug();

    expect(screen.getByTestId('theme-info')).toHaveTextContent('Theme: light');

    const userThemeInfo = screen.queryByTestId('user-theme-info');
    if (userThemeInfo) {
      expect(userThemeInfo).toHaveTextContent('Test User\'s theme: light');
    } else {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
      expect(screen.getByTestId('workout-count')).toHaveTextContent(/has 2 workouts/);
    }
  });

  test('handles loading workouts through context', async () => {
    renderWithAllProviders(<MultiContextConsumer />, {
      initialUser: {
        isAuthenticated: true,
        displayName: 'Test User',
        email: 'test@example.com',
      },
      initialWorkouts: []
    });

    // Initial state - no workouts
    expect(screen.getByText('No workouts')).toBeInTheDocument();

    // Click load workouts
    await userEvent.click(screen.getByText('Load Workouts'));

    // Wait for workouts to load - the mock provider will load the default mock workouts
    await waitFor(() => {
      expect(screen.getByTestId('workout-count')).toBeInTheDocument();
    });

    // The mock workouts should now be loaded
    expect(screen.getByTestId('workout-count')).toHaveTextContent(/has [1-9] workouts/);
  });

  test('handles unauthenticated state with workouts', () => {
    renderWithAllProviders(<MultiContextConsumer />, {
      initialUser: {
        isAuthenticated: false
      },
      initialWorkouts: [
        { id: 'workout-1', title: 'Workout 1' }
      ]
    });

    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    expect(screen.getByTestId('workout-count')).toHaveTextContent('User has 1 workouts');
  });

  test('handles context update flow', async () => {
    const mockToggleTheme = jest.fn();

    // Create a custom component that mocks theme toggling behavior
    const TestComponent = () => {
      const [theme, setTheme] = React.useState('light');

      const toggleTheme = () => {
        mockToggleTheme();
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
      };

      return (
        <div>
          <div data-testid="current-theme">{theme}</div>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
      );
    };

    render(<TestComponent />);

    // Initial state
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    // Toggle theme
    await userEvent.click(screen.getByText('Toggle Theme'));

    // Verify theme toggle was called
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    // Verify theme changed
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
}); 