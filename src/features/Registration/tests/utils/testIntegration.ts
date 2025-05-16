/**
 * Integration test utilities for Registration Flow tests
 * 
 * This file provides utilities to support integration testing across the Registration feature.
 * It consolidates the mocking approaches, test renderers, and setup/teardown patterns used in our tests.
 */

import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { AnalyticsEvent, AnalyticsUser } from '../../events/analyticsTypes';
import { StepTransitionEvent, TransitionType } from '../../events/transitionEvents';
import { RegistrationData, RegistrationStep } from '../../types';

// ===========================================
// Storage Mocking
// ===========================================

/**
 * Setup mock storage for tests with initial data
 */
export const setupMockStorage = (initialData?: Record<string, string>) => {
  const store: Record<string, string> = { ...(initialData || {}) };

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
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    _store: store, // For test inspection
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

// ===========================================
// Event Manager Mocking
// ===========================================

/**
 * Setup mock transition event manager for tests
 */
export const setupMockTransitionEventManager = () => {
  const listeners: Array<(event: StepTransitionEvent) => void> = [];

  const mockTransitionEventManager = {
    listeners: listeners,

    subscribe: jest.fn((listener: (event: StepTransitionEvent) => void) => {
      listeners.push(listener);

      // Return unsubscribe function
      return jest.fn(() => {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      });
    }),

    emitTransition: jest.fn((
      sourceStep: RegistrationStep,
      destinationStep: RegistrationStep,
      transitionType: TransitionType,
      metadata?: Record<string, unknown>
    ) => {
      const event: StepTransitionEvent = {
        sourceStep,
        destinationStep,
        transitionType,
        timestamp: Date.now(),
        metadata
      };

      // Notify all listeners
      listeners.forEach(listener => listener(event));

      return event;
    }),

    // For test inspection and manipulation
    _clearListeners: () => {
      listeners.length = 0;
    }
  };

  // Mock the module
  jest.mock('../../events/transitionEventManager', () => ({
    transitionEventManager: mockTransitionEventManager
  }));

  return mockTransitionEventManager;
};

// ===========================================
// Analytics Mocking
// ===========================================

/**
 * Setup mock analytics for tests
 */
export const setupMockAnalytics = () => {
  const trackEvents: AnalyticsEvent[] = [];
  const identifyEvents: AnalyticsUser[] = [];
  const pageViewEvents: string[] = [];

  const mockAnalyticsTrack = jest.fn<void, [AnalyticsEvent]>((event) => {
    trackEvents.push(event);
  });

  const mockAnalyticsIdentify = jest.fn<void, [AnalyticsUser]>((user) => {
    identifyEvents.push(user);
  });

  const mockAnalyticsPageView = jest.fn<void, [string]>((path) => {
    pageViewEvents.push(path);
  });

  const mockTrackCustomEvent = jest.fn();
  const mockTrackStepView = jest.fn();

  // Create the mock analytics service
  const mockAnalyticsService = {
    trackEvent: mockAnalyticsTrack,
    identifyUser: mockAnalyticsIdentify,
    pageView: mockAnalyticsPageView,

    // For test inspection
    _trackEvents: trackEvents,
    _identifyEvents: identifyEvents,
    _pageViewEvents: pageViewEvents
  };

  // Mock the analytics integration module
  jest.mock('../../events/analyticsIntegration', () => {
    return {
      // Mock the analytics service
      analyticsService: mockAnalyticsService,

      // Mock the hook implementation
      useTransitionAnalytics: () => {
        // Simulate the useEffect registration
        React.useEffect(() => {
          return () => { };
        }, []);

        return {
          trackCustomEvent: mockTrackCustomEvent,
          trackStepView: mockTrackStepView
        };
      }
    };
  });

  return {
    service: mockAnalyticsService,
    trackCustomEvent: mockTrackCustomEvent,
    trackStepView: mockTrackStepView
  };
};

// ===========================================
// Logger Mocking
// ===========================================

/**
 * Setup mock logger to prevent console noise in tests
 * Note: This function is not used because it requires special Jest config
 */
export const setupMockLogger = () => {
  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),

    // For test inspection
    _clearLogs: () => {
      mockLogger.debug.mockClear();
      mockLogger.error.mockClear();
      mockLogger.info.mockClear();
      mockLogger.warn.mockClear();
    }
  };

  // Note: This requires special Jest configuration and is disabled
  // jest.mock('../../../utils', () => ({
  //     ...jest.requireActual('../../../utils'),
  //     logger: mockLogger
  // }));

  return mockLogger;
};

// ===========================================
// Registration Data Mocking
// ===========================================

/**
 * Create mock registration data with reasonable defaults
 */
export const createMockRegistrationData = (overrides?: Partial<RegistrationData>): RegistrationData => ({
  step: RegistrationStep.SPLASH,
  experienceLevel: 'beginner',
  goals: ['weight_loss', 'muscle_tone'],
  equipment: ['dumbbells', 'resistance_bands'],
  timeCommitment: 3,
  schedule: {
    days: ['monday', 'wednesday', 'friday'],
    timeOfDay: 'morning'
  },
  injuries: [],
  hasPreviousSubscription: false,
  age: '25-34',
  gender: 'nonbinary',
  ...overrides
});

// ===========================================
// Custom Renderer with Providers
// ===========================================

/**
 * A custom React Testing Library renderer that wraps components with all necessary providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => {
  // Setup mock storage
  setupMockStorage();

  // Return the render result
  return render(ui, { ...options });
};

// ===========================================
// Unified Setup and Teardown
// ===========================================

/**
 * Setup all mocks for integration testing
 */
export const setupIntegrationTest = () => {
  // Mock storage
  const storage = setupMockStorage();

  // Mock event manager
  const eventManager = setupMockTransitionEventManager();

  // Mock analytics
  const analytics = setupMockAnalytics();

  // Return all mocks for use in tests
  return {
    storage,
    eventManager,
    analytics
  };
};

/**
 * Clean up after integration tests
 */
export const cleanupIntegrationTest = () => {
  // Reset all mocks
  jest.clearAllMocks();
}; 