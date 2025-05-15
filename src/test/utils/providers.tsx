import React from 'react';

/**
 * Generic mock creator for context values
 * @param defaultValue Default implementation
 * @returns A mock object with jest.fn() for methods
 */
function createMock<T extends object>(defaultValue: T): T {
    return Object.entries(defaultValue).reduce((mock, [key, value]) => {
        // If the value is a function, replace with jest.fn()
        if (typeof value === 'function') {
            mock[key as keyof T] = jest.fn() as any;
        } else {
            mock[key as keyof T] = value;
        }
        return mock;
    }, {} as T);
}

/**
 * Default mock for UserContext
 */
export const defaultUserContextValue = {
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
export const defaultWorkoutContextValue = {
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
export const defaultAnalyticsContextValue = {
    trackEvent: () => { },
    trackPageView: () => { },
    identifyUser: () => { },
};

/**
 * Create a user context provider with mock values
 */
export function createUserContextMock(overrides = {}) {
    // Import actual context dynamically to avoid circular dependencies
    // This is a placeholder - replace with actual import
    const UserContext = {
        Provider: ({ children, value }: { children: React.ReactNode; value: any }) => (
            <div data-testid="mock-user-context">{children}</div>
        ),
    };

    const mockValue = {
        ...defaultUserContextValue,
        ...overrides,
    };

    return {
        UserContext,
        UserProvider: ({ children }: { children: React.ReactNode }) => (
            <UserContext.Provider value={mockValue}>{children}</UserContext.Provider>
        ),
        mockValue,
    };
}

/**
 * Create a workout context provider with mock values
 */
export function createWorkoutContextMock(overrides = {}) {
    // Import actual context dynamically to avoid circular dependencies
    // This is a placeholder - replace with actual import
    const WorkoutContext = {
        Provider: ({ children, value }: { children: React.ReactNode; value: any }) => (
            <div data-testid="mock-workout-context">{children}</div>
        ),
    };

    const mockValue = {
        ...defaultWorkoutContextValue,
        ...overrides,
    };

    return {
        WorkoutContext,
        WorkoutProvider: ({ children }: { children: React.ReactNode }) => (
            <WorkoutContext.Provider value={mockValue}>{children}</WorkoutContext.Provider>
        ),
        mockValue,
    };
}

/**
 * Create an analytics context provider with mock values
 */
export function createAnalyticsContextMock(overrides = {}) {
    // Import actual context dynamically to avoid circular dependencies
    // This is a placeholder - replace with actual import
    const AnalyticsContext = {
        Provider: ({ children, value }: { children: React.ReactNode; value: any }) => (
            <div data-testid="mock-analytics-context">{children}</div>
        ),
    };

    const mockValue = {
        ...defaultAnalyticsContextValue,
        ...overrides,
    };

    return {
        AnalyticsContext,
        AnalyticsProvider: ({ children }: { children: React.ReactNode }) => (
            <AnalyticsContext.Provider value={mockValue}>{children}</AnalyticsContext.Provider>
        ),
        mockValue,
    };
}

// Interface for provider composition options
export interface TestProviderOptions {
    userContext?: Partial<typeof defaultUserContextValue>;
    workoutContext?: Partial<typeof defaultWorkoutContextValue>;
    analyticsContext?: Partial<typeof defaultAnalyticsContextValue>;
    customProviders?: React.FC<{ children: React.ReactNode }>[];
}

/**
 * Creates a composition of test providers with mocked context values
 * This wraps components with all necessary providers for testing
 */
export function createTestProviders(options: TestProviderOptions = {}): React.FC<{ children: React.ReactNode }> {
    const {
        userContext = {},
        workoutContext = {},
        analyticsContext = {},
        customProviders = [],
    } = options;

    // Create individual providers with merged values
    const { UserProvider } = createUserContextMock(userContext);
    const { WorkoutProvider } = createWorkoutContextMock(workoutContext);
    const { AnalyticsProvider } = createAnalyticsContextMock(analyticsContext);

    // Return composed provider wrapper
    return ({ children }) => {
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
} 