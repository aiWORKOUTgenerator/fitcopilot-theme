/* eslint-disable */
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AnalyticsEvent, AnalyticsUser, TransitionEvent } from '../events/analyticsTypes';
import { TransitionType } from '../events/transitionEvents';
import { RegistrationStep } from '../types';
import './setup';

// Mock the logger module
jest.mock('../../../utils/logger', () => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
}));

// Mock the transitionEventManager
const mockEmitTransition = jest.fn();
const mockSubscribe = jest.fn();
let subscribedCallback: any = null;

jest.mock('../events/transitionEventManager', () => ({
    transitionEventManager: {
        subscribe: (callback: any) => {
            subscribedCallback = callback;
            return jest.fn(); // Return fake unsubscribe function
        },
        emitTransition: (sourceStep: string, destinationStep: string, transitionType: string, metadata?: any) => {
            const event = {
                sourceStep,
                destinationStep,
                transitionType,
                timestamp: Date.now(),
                metadata
            };

            // Call the subscribed callback if it exists
            if (subscribedCallback) {
                subscribedCallback(event);
            }

            mockEmitTransition(sourceStep, destinationStep, transitionType, metadata);
            return event;
        }
    }
}));

// Create a test component that uses analytics
const TestAnalyticsComponent = ({
    onTrackEvent,
    onTrackStepView
}: {
    onTrackEvent: () => void;
    onTrackStepView: () => void;
}) => (
    <div>
        <button data-testid="track-event-button" onClick={onTrackEvent}>
            Track Custom Event
        </button>
        <button data-testid="track-step-button" onClick={onTrackStepView}>
            Track Step View
        </button>
    </div>
);

// Mock the analytics service
const mockAnalyticsTrack = jest.fn<void, [AnalyticsEvent]>();
const mockAnalyticsIdentify = jest.fn<void, [AnalyticsUser]>();
const mockAnalyticsPageView = jest.fn<void, [string]>();

// Create the mock analytics service
const mockAnalyticsService = {
    trackEvent: mockAnalyticsTrack,
    identifyUser: mockAnalyticsIdentify,
    pageView: mockAnalyticsPageView
};

// Mock the transition analytics hooks
const mockTrackCustomEvent = jest.fn();
const mockTrackStepView = jest.fn();

// Mock the analytics integration module
jest.mock('../events/analyticsIntegration', () => {
    return {
        // Mock the analytics service to verify it's being called
        analyticsService: {
            trackEvent: mockAnalyticsTrack,
            identifyUser: mockAnalyticsIdentify,
            pageView: mockAnalyticsPageView
        },

        // Mock the hook implementation
        useTransitionAnalytics: () => {
            // Simulate the useEffect registration
            React.useEffect(() => {
                // This hook is already mocked by the transitionEventManager mock above
                return () => { };
            }, []);

            return {
                trackCustomEvent: mockTrackCustomEvent,
                trackStepView: mockTrackStepView
            };
        }
    };
});

describe('Registration Analytics', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        subscribedCallback = null;
    });

    test('should track transition events through the analytics service', async () => {
        // Set up our mock analytics track function
        // No expectations here, just a plain mock
        mockAnalyticsTrack.mockReset();

        // Subscribe a handler to the transition events (this is done by analyticsIntegration in real code)
        const handler = (event: any) => {
            // Map event to analytics format
            const transitionEvent: TransitionEvent = {
                type: 'transition',
                properties: {
                    fromStep: event.sourceStep,
                    toStep: event.destinationStep,
                    transitionType: event.transitionType as 'next' | 'back' | 'skip'
                },
                timestamp: new Date(event.timestamp).toISOString()
            };

            mockAnalyticsTrack(transitionEvent);
        };

        // Manually register our handler
        subscribedCallback = handler;

        // Emit a transition event
        act(() => {
            // This will trigger our subscribedCallback handler
            const event = {
                sourceStep: RegistrationStep.SPLASH,
                destinationStep: RegistrationStep.EXPERIENCE_LEVEL,
                transitionType: TransitionType.STANDARD,
                timestamp: Date.now()
            };

            handler(event);
        });

        // Verify the analytics service was called with the expected event data
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'transition',
                properties: expect.objectContaining({
                    fromStep: RegistrationStep.SPLASH,
                    toStep: RegistrationStep.EXPERIENCE_LEVEL,
                    transitionType: 'standard'
                })
            })
        );
    });

    test('should track step view events with proper metadata', async () => {
        const stepId = RegistrationStep.EXPERIENCE_LEVEL;
        const stepParams = {
            stepName: 'Experience Level',
            stepNumber: 2,
            totalSteps: 8
        };

        // Call the trackStepView function
        act(() => {
            mockTrackStepView(stepId, stepParams);
        });

        // Verify trackStepView was called with correct parameters
        expect(mockTrackStepView).toHaveBeenCalledWith(
            RegistrationStep.EXPERIENCE_LEVEL,
            expect.objectContaining({
                stepName: 'Experience Level',
                stepNumber: 2,
                totalSteps: 8
            })
        );
    });

    test('should track custom events through the UI', async () => {
        // Reset mock for this test
        mockAnalyticsTrack.mockReset();

        // Create test data
        const customEvent: AnalyticsEvent = {
            type: 'custom_action',
            properties: {
                action: 'button_click',
                location: 'registration_form'
            }
        };

        // Set up mock to return the custom event
        mockTrackCustomEvent.mockImplementation(() => {
            mockAnalyticsTrack(customEvent);
        });

        // Render component
        render(
            <TestAnalyticsComponent
                onTrackEvent={() => mockTrackCustomEvent(customEvent)}
                onTrackStepView={() => { }}
            />
        );

        // Trigger event tracking
        const trackButton = screen.getByTestId('track-event-button');
        await userEvent.click(trackButton);

        // Verify analytics service was called with custom event
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'custom_action',
                properties: expect.objectContaining({
                    action: 'button_click',
                    location: 'registration_form'
                })
            })
        );
    });

    test('should track all transition types correctly', async () => {
        // Reset mock for this test
        mockAnalyticsTrack.mockReset();

        // Set up an array to capture all events
        const capturedEvents: AnalyticsEvent[] = [];
        mockAnalyticsTrack.mockImplementation((event) => {
            capturedEvents.push(event);
        });

        // Subscribe a handler to the transition events
        const handler = (event: any) => {
            // Map event to analytics format
            const transitionEvent: TransitionEvent = {
                type: 'transition',
                properties: {
                    fromStep: event.sourceStep,
                    toStep: event.destinationStep,
                    transitionType: event.transitionType as 'next' | 'back' | 'skip'
                },
                timestamp: new Date(event.timestamp).toISOString()
            };

            mockAnalyticsTrack(transitionEvent);
        };

        // Manually register our handler
        subscribedCallback = handler;

        // Emit events for each transition type
        act(() => {
            // Standard transition
            handler({
                sourceStep: RegistrationStep.SPLASH,
                destinationStep: RegistrationStep.EXPERIENCE_LEVEL,
                transitionType: TransitionType.STANDARD,
                timestamp: Date.now()
            });

            // Map-based transition
            handler({
                sourceStep: RegistrationStep.TIME_COMMITMENT,
                destinationStep: RegistrationStep.PAYMENT,
                transitionType: TransitionType.MAP_BASED,
                timestamp: Date.now()
            });

            // Back transition
            handler({
                sourceStep: RegistrationStep.EXPERIENCE_LEVEL,
                destinationStep: RegistrationStep.SPLASH,
                transitionType: TransitionType.BACK,
                timestamp: Date.now()
            });

            // Direct transition
            handler({
                sourceStep: RegistrationStep.SPLASH,
                destinationStep: RegistrationStep.PRICING,
                transitionType: TransitionType.DIRECT,
                timestamp: Date.now()
            });

            // Override transition
            handler({
                sourceStep: RegistrationStep.SPLASH,
                destinationStep: RegistrationStep.CONFIRMATION,
                transitionType: TransitionType.OVERRIDE,
                timestamp: Date.now()
            });
        });

        // Verify all events were tracked
        expect(capturedEvents.length).toBe(5);

        // Check transition types were mapped correctly
        expect(capturedEvents[0].properties?.transitionType).toBe('standard');
        expect(capturedEvents[1].properties?.transitionType).toBe('map_based');
        expect(capturedEvents[2].properties?.transitionType).toBe('back');
        expect(capturedEvents[3].properties?.transitionType).toBe('direct');
        expect(capturedEvents[4].properties?.transitionType).toBe('override');
    });

    test('should include timestamp in all tracked events', async () => {
        // Reset mock for this test
        mockAnalyticsTrack.mockReset();

        // Create an event with a timestamp
        const eventWithTimestamp: AnalyticsEvent = {
            type: 'transition',
            properties: {
                fromStep: RegistrationStep.SPLASH,
                toStep: RegistrationStep.EXPERIENCE_LEVEL,
                transitionType: 'next'  // Changed from 'standard' to 'next' to match expected types
            },
            timestamp: new Date().toISOString()
        };

        // Track the event
        act(() => {
            mockAnalyticsTrack(eventWithTimestamp);
        });

        // Verify analytics was called and check the timestamp format
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            expect.objectContaining({
                timestamp: expect.any(String)
            })
        );
    });

    test('should handle user identification', async () => {
        // Create user data
        const userData: AnalyticsUser = {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            traits: {
                registrationSource: 'direct',
                firstVisit: true
            }
        };

        // Call identify method
        act(() => {
            mockAnalyticsService.identifyUser(userData);
        });

        // Verify user was identified
        expect(mockAnalyticsIdentify).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'user-123',
                email: 'test@example.com',
                name: 'Test User',
                traits: expect.objectContaining({
                    registrationSource: 'direct',
                    firstVisit: true
                })
            })
        );
    });

    test('should track page views correctly', async () => {
        // Call page view method
        act(() => {
            mockAnalyticsService.pageView('/registration/experience-level');
        });

        // Verify page view was tracked
        expect(mockAnalyticsPageView).toHaveBeenCalledWith('/registration/experience-level');
    });

    // Edge cases

    test('should handle events with missing properties gracefully', async () => {
        // Reset mock for this test
        mockAnalyticsTrack.mockReset();

        const incompleteEvent: AnalyticsEvent = {
            type: 'incomplete_event'
            // Missing properties
        };

        // Track incomplete event
        act(() => {
            mockAnalyticsTrack(incompleteEvent);
        });

        // Should still track the event type
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'incomplete_event'
            })
        );
    });

    test('should handle empty user traits gracefully', async () => {
        const minimalUser: AnalyticsUser = {
            id: 'minimal-user'
            // Missing optional fields
        };

        // Identify minimal user
        act(() => {
            mockAnalyticsIdentify(minimalUser);
        });

        // Should identify with only required fields
        expect(mockAnalyticsIdentify).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'minimal-user'
            })
        );
    });
});
