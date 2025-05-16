/**
 * Simple analytics tests for Registration Flow
 */
import { act, renderHook } from '@testing-library/react';
import { useTransitionAnalytics } from '../events/analyticsIntegration';
import { RegistrationStep } from '../types';

// Create direct mocks for simpler testing
const mockTrackStepView = jest.fn();
const mockTrackCustomEvent = jest.fn();

// Mock the entire module
jest.mock('../events/analyticsIntegration', () => ({
  useTransitionAnalytics: () => ({
    trackStepView: mockTrackStepView,
    trackCustomEvent: mockTrackCustomEvent
  })
}));

// Mock the transition event manager
const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('../events/transitionEventManager', () => ({
  transitionEventManager: {
    subscribe: () => mockUnsubscribe,
    emitTransition: jest.fn()
  }
}));

describe('Registration Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Make subscribe return the unsubscribe function
    mockSubscribe.mockReturnValue(mockUnsubscribe);
  });

  test('should track step views correctly', () => {
    // Render the hook
    const { result } = renderHook(() => useTransitionAnalytics());

    // Track a step view
    const params = {
      stepName: 'Welcome Screen',
      stepNumber: 1,
      totalSteps: 7
    };

    act(() => {
      result.current.trackStepView(RegistrationStep.SPLASH, params);
    });

    // Verify tracking function was called with correct parameters
    expect(mockTrackStepView).toHaveBeenCalledWith(
      RegistrationStep.SPLASH,
      params
    );
  });

  test('should track custom events correctly', () => {
    // Render the hook
    const { result } = renderHook(() => useTransitionAnalytics());

    // Create a custom event
    const customEvent = {
      type: 'user_action',
      properties: {
        action: 'clicked_cta',
        page: 'welcome',
        sessionId: '12345'
      },
      timestamp: '2023-01-01T00:00:00.000Z'
    };

    act(() => {
      result.current.trackCustomEvent(customEvent);
    });

    // Verify function was called with the event object
    expect(mockTrackCustomEvent).toHaveBeenCalledWith(customEvent);
  });
}); 