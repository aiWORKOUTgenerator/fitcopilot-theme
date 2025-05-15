/**
 * Mock implementation of API service
 * @param overrides Optional method overrides
 * @returns Mock API service with Jest spy functions
 */
export function mockApiService(overrides = {}) {
    return {
        get: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
        post: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
        put: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
        delete: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
        patch: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
        ...overrides
    };
}

/**
 * Mock implementation of storage service
 * @param initialData Optional initial storage data
 * @returns Mock storage service with Jest spy functions
 */
export function mockStorageService(initialData: Record<string, string> = {}) {
    const store = { ...initialData };

    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: jest.fn((key: string) => { delete store[key]; }),
        clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
        key: jest.fn((index: number) => Object.keys(store)[index] || null),
        length: jest.spyOn(Object.keys(store), 'length', 'get'),
        _getStore: () => ({ ...store }) // Helper for tests to verify state
    };
}

/**
 * Mock implementation of analytics service
 * @param overrides Optional method overrides
 * @returns Mock analytics service with Jest spy functions
 */
export function mockAnalyticsService(overrides = {}) {
    return {
        trackEvent: jest.fn(),
        trackPageView: jest.fn(),
        identifyUser: jest.fn(),
        setUserProperties: jest.fn(),
        ...overrides
    };
}

/**
 * Mock implementation of authentication service
 * @param overrides Optional method overrides
 * @returns Mock auth service with Jest spy functions
 */
export function mockAuthService(overrides = {}) {
    const defaultUser = {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
    };

    return {
        login: jest.fn().mockImplementation(() => Promise.resolve({ user: defaultUser, token: 'fake-token' })),
        logout: jest.fn().mockImplementation(() => Promise.resolve()),
        register: jest.fn().mockImplementation(() => Promise.resolve({ user: defaultUser, token: 'fake-token' })),
        getCurrentUser: jest.fn().mockImplementation(() => Promise.resolve(defaultUser)),
        isAuthenticated: jest.fn().mockImplementation(() => true),
        getToken: jest.fn().mockImplementation(() => 'fake-token'),
        ...overrides
    };
}

/**
 * Mock implementation of workout service
 * @param overrides Optional method overrides
 * @returns Mock workout service with Jest spy functions
 */
export function mockWorkoutService(overrides = {}) {
    const defaultWorkouts = [
        { id: 'workout-1', name: 'Test Workout 1', exercises: [] },
        { id: 'workout-2', name: 'Test Workout 2', exercises: [] },
    ];

    return {
        getWorkouts: jest.fn().mockImplementation(() => Promise.resolve(defaultWorkouts)),
        getWorkout: jest.fn().mockImplementation((id) =>
            Promise.resolve(defaultWorkouts.find(w => w.id === id) || null)
        ),
        createWorkout: jest.fn().mockImplementation((workout) =>
            Promise.resolve({ ...workout, id: 'new-workout-id' })
        ),
        updateWorkout: jest.fn().mockImplementation((id, workout) =>
            Promise.resolve({ ...workout, id })
        ),
        deleteWorkout: jest.fn().mockImplementation(() => Promise.resolve(true)),
        ...overrides
    };
}

/**
 * Creates a mock fetch implementation to use with jest.spyOn
 * @param responseData Data to return in the response
 * @param options Additional options like status code
 * @returns A function to use with jest.spyOn(global, 'fetch')
 */
export function createMockFetch(
    responseData: any,
    options: { status?: number; headers?: Record<string, string> } = {}
) {
    const {
        status = 200,
        headers = { 'Content-Type': 'application/json' }
    } = options;

    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: status >= 200 && status < 300,
            status,
            headers: new Headers(headers),
            json: () => Promise.resolve(responseData),
            text: () => Promise.resolve(JSON.stringify(responseData)),
        })
    );
}

/**
 * Mocks window.matchMedia for tests
 * @param matches Whether the media query matches
 * @returns An object to use with jest.spyOn
 */
export function mockMatchMedia(matches = false) {
    return () => ({
        matches,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        media: '',
    });
}

/**
 * Setup common global mocks for tests
 */
export function setupGlobalMocks() {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia(true),
    });

    // Mock intersection observer
    global.IntersectionObserver = class IntersectionObserver {
        constructor(callback: IntersectionObserverCallback) { }
        observe = jest.fn();
        unobserve = jest.fn();
        disconnect = jest.fn();
        takeRecords = jest.fn().mockReturnValue([]);
        root = null;
        rootMargin = '';
        thresholds = [];
    };

    // Reset all mocks after each test
    afterEach(() => {
        jest.resetAllMocks();
    });
} 