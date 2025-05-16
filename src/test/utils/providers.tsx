import React from 'react';
import {
    AnalyticsContextType,
    TestProviderOptions,
    TestProviderProps,
    UserContextType,
    WorkoutContextType
} from '../../types/test';

/**
 * Generic mock creator for context values
 * @template T The type of object to mock
 * @param defaultValue Default implementation
 * @returns A mock object with jest.fn() for methods
 */
function _createMock<T extends Record<string, unknown>>(defaultValue: T): T {
    return Object.entries(defaultValue).reduce((mock, [key, value]) => {
        // If the value is a function, replace with jest.fn()
        if (typeof value === 'function') {
            mock[key as keyof T] = jest.fn() as unknown as T[keyof T];
        } else {
            mock[key as keyof T] = value;
        }
        return mock;
    }, {} as T);
}

/**
 * Default mock for UserContext
 */
export const defaultUserContextValue: UserContextType = {
    user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    updateProfile: () => Promise.resolve(),
};

/**
 * Default mock for WorkoutContext
 */
export const defaultWorkoutContextValue: WorkoutContextType = {
    workouts: [],
    currentWorkout: null,
    isLoading: false,
    error: null,
    fetchWorkouts: () => Promise.resolve(),
    createWorkout: () => Promise.resolve(),
    updateWorkout: () => Promise.resolve(),
    deleteWorkout: () => Promise.resolve(),
    setCurrentWorkout: () => { },
};

/**
 * Default mock for AnalyticsContext
 */
export const defaultAnalyticsContextValue: AnalyticsContextType = {
    trackEvent: () => { },
    trackPageView: () => { },
    identifyUser: () => { },
};

/**
 * Props for context provider components
 */
interface ContextProviderProps {
    children: React.ReactNode;
}

/**
 * Props for context provider with value
 */
interface ContextProviderWithValueProps<T> extends ContextProviderProps {
    value: T;
}

/**
 * Type for a context provider component
 */
type ContextProvider<T> = React.FC<ContextProviderWithValueProps<T>>;

/**
 * Mock context type with provider component
 */
interface MockContextResult<T> {
    Provider: ContextProvider<T>;
    mockValue: T;
}

/**
 * Create a user context provider with mock values
 * 
 * @param overrides Values to override in the default context
 * @returns Object with Provider component and mock values
 */
export function createUserContextMock(overrides: Partial<UserContextType> = {}): MockContextResult<UserContextType> {
    // Import actual context dynamically to avoid circular dependencies
    // This is a placeholder - replace with actual import
    const UserContext = {
        Provider: ({ children, value }: ContextProviderWithValueProps<UserContextType>) => (
            <div data-testid="mock-user-context">{children}</div>
        ),
    };

    const mockValue: UserContextType = {
        ...defaultUserContextValue,
        ...overrides,
    };

    return {
        Provider: ({ children }: ContextProviderProps) => (
            <UserContext.Provider value={mockValue}>{children}</UserContext.Provider>
        ),
        mockValue,
    };
}

/**
 * Create a workout context provider with mock values
 * 
 * @param overrides Values to override in the default context
 * @returns Object with Provider component and mock values
 */
export function createWorkoutContextMock(overrides: Partial<WorkoutContextType> = {}): MockContextResult<WorkoutContextType> {
    // Import actual context dynamically to avoid circular dependencies
    // This is a placeholder - replace with actual import
    const WorkoutContext = {
        Provider: ({ children, value }: ContextProviderWithValueProps<WorkoutContextType>) => (
            <div data-testid="mock-workout-context">{children}</div>
        ),
    };

    const mockValue: WorkoutContextType = {
        ...defaultWorkoutContextValue,
        ...overrides,
    };

    return {
        Provider: ({ children }: ContextProviderProps) => (
            <WorkoutContext.Provider value={mockValue}>{children}</WorkoutContext.Provider>
        ),
        mockValue,
    };
}

/**
 * Create an analytics context provider with mock values
 * 
 * @param overrides Values to override in the default context
 * @returns Object with Provider component and mock values
 */
export function createAnalyticsContextMock(overrides: Partial<AnalyticsContextType> = {}): MockContextResult<AnalyticsContextType> {
    // Import actual context dynamically to avoid circular dependencies
    // This is a placeholder - replace with actual import
    const AnalyticsContext = {
        Provider: ({ children, value }: ContextProviderWithValueProps<AnalyticsContextType>) => (
            <div data-testid="mock-analytics-context">{children}</div>
        ),
    };

    const mockValue: AnalyticsContextType = {
        ...defaultAnalyticsContextValue,
        ...overrides,
    };

    return {
        Provider: ({ children }: ContextProviderProps) => (
            <AnalyticsContext.Provider value={mockValue}>{children}</AnalyticsContext.Provider>
        ),
        mockValue,
    };
}

/**
 * Creates a composition of test providers with mocked context values
 * This wraps components with all necessary providers for testing
 * 
 * @param options Options for configuring test providers
 * @returns Provider component that wraps children with all providers
 */
export function createTestProviders(options: TestProviderOptions = {}): React.FC<TestProviderProps<unknown>> {
    const {
        userContext = {},
        workoutContext = {},
        analyticsContext = {},
        customProviders = [],
    } = options;

    // Create individual providers with merged values
    const { Provider: UserProvider } = createUserContextMock(userContext);
    const { Provider: WorkoutProvider } = createWorkoutContextMock(workoutContext);
    const { Provider: AnalyticsProvider } = createAnalyticsContextMock(analyticsContext);

    // Return composed provider wrapper
    const TestProviderComponent: React.FC<TestProviderProps<unknown>> = ({ children }) => {
        // Start with the innermost children
        let wrappedChildren = <>{children}</>;

        // Wrap with custom providers (in reverse to maintain correct nesting)
        [...customProviders].reverse().forEach(Provider => {
            wrappedChildren = <Provider>{wrappedChildren}</Provider>;
        });

        // Wrap with standard providers (order matters based on dependencies)
        wrappedChildren = (
            <AnalyticsProvider>
                <WorkoutProvider>
                    <UserProvider>
                        {wrappedChildren}
                    </UserProvider>
                </WorkoutProvider>
            </AnalyticsProvider>
        );

        return wrappedChildren;
    };

    TestProviderComponent.displayName = 'ComposedTestProviders';

    return TestProviderComponent;
} 