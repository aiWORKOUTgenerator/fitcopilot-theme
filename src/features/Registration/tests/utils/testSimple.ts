/**
 * Simple test utilities for Registration Flow tests
 */

import { RegistrationData, RegistrationStep } from '../../types';

/**
 * Default mock registration data
 */
export const createMockRegistrationData = (overrides?: Partial<RegistrationData>): RegistrationData => ({
    step: RegistrationStep.SPLASH,
    experienceLevel: 'beginner',
    goals: [],
    equipment: [],
    timeCommitment: 3,
    // Add other fields as needed
    ...overrides
});

/**
 * Setup mock storage for tests
 */
export const setupMockStorage = () => {
    const store: Record<string, string> = {};
    const mockStorage = {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            Object.keys(store).forEach(key => {
                delete store[key];
            });
        }),
    };

    Object.defineProperty(window, 'sessionStorage', {
        value: mockStorage,
        writable: true
    });

    Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true
    });

    return mockStorage;
};

/**
 * Mock analytics service
 */
export const setupMockAnalytics = () => {
    const mockAnalytics = {
        trackEvent: jest.fn(),
        identifyUser: jest.fn(),
        pageView: jest.fn(),
        trackCustomEvent: jest.fn(),
        trackStepView: jest.fn()
    };

    jest.mock('../../events/analyticsIntegration', () => ({
        useTransitionAnalytics: () => ({
            trackCustomEvent: mockAnalytics.trackCustomEvent,
            trackStepView: mockAnalytics.trackStepView
        })
    }));

    return mockAnalytics;
};

/**
 * Create transition event metadata for tests
 */
export const createTransitionMetadata = (overrides?: Record<string, unknown>) => ({
    method: 'nextStep',
    timestamp: Date.now(),
    validDestination: true,
    transitionSource: 'user',
    ...overrides
});

/**
 * Mock the event manager for tests
 */
export const setupMockEventManager = () => {
    const listeners: Array<Function> = [];

    const mockEventManager = {
        subscribe: jest.fn((listener) => {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            };
        }),
        emitTransition: jest.fn((sourceStep, destinationStep, transitionType, metadata = {}) => {
            const event = {
                sourceStep,
                destinationStep,
                transitionType,
                timestamp: Date.now(),
                metadata
            };
            listeners.forEach(listener => listener(event));
            return event;
        }),
        _listeners: listeners
    };

    jest.mock('../../events/transitionEventManager', () => ({
        transitionEventManager: mockEventManager
    }));

    return mockEventManager;
}; 