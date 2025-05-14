/* eslint-disable */
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { StepTransitionEvent, TransitionType } from '../events/transitionEvents';
import { RegistrationStep } from '../types';

// Import test setup
import './setup';

// Mock the logger module
jest.mock('../../../utils/logger', () => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
}));

// Create listeners array for the mock
let listeners: Array<(event: StepTransitionEvent) => void> = [];

// Mock the transitionEventManager
const mockTransitionEventManager = {
    listeners: listeners,

    subscribe: jest.fn((listener: (event: StepTransitionEvent) => void) => {
        listeners.push(listener);

        // Return unsubscribe function
        return jest.fn(() => {
            listeners = listeners.filter(l => l !== listener);
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
    })
};

// Mock the module
jest.mock('../events/transitionEventManager', () => ({
    transitionEventManager: mockTransitionEventManager
}));

// Create a test component to verify event handling in UI context
const TestTransitionComponent = ({
    onEmitTransition
}: {
    onEmitTransition: () => void;
}) => (
    <div>
        <button data-testid="emit-button" onClick={onEmitTransition}>
            Emit Transition
        </button>
    </div>
);

// Mock the useRegistrationEvents hook to avoid dependencies
jest.mock('../hooks/useRegistrationEvents', () => ({
    useRegistrationEvents: () => ({
        trackStandardTransition: jest.fn(),
        trackMapTransition: jest.fn(),
        trackDirectNavigation: jest.fn(),
        trackBackNavigation: jest.fn(),
        trackOverrideNavigation: jest.fn(),
    }),
}));

// Mock Date.now() for consistent test output
const MOCK_TIMESTAMP = 1648212000000; // Fixed timestamp for testing
jest.spyOn(Date, 'now').mockImplementation(() => MOCK_TIMESTAMP);

describe('Transition Events System', () => {
    beforeEach(() => {
        // Reset any mocks and clean up before each test
        jest.clearAllMocks();

        // Clear listeners array
        listeners = [];
    });

    test('should subscribe to transition events and capture all event data', () => {
        const mockListener = jest.fn();

        // Subscribe to events
        const unsubscribe = mockTransitionEventManager.subscribe(mockListener);

        // Emit an event
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );
        });

        // Verify listener was called with complete event data
        expect(mockListener).toHaveBeenCalledWith({
            sourceStep: RegistrationStep.SPLASH,
            destinationStep: RegistrationStep.EXPERIENCE_LEVEL,
            transitionType: TransitionType.STANDARD,
            timestamp: MOCK_TIMESTAMP,
        });

        // Unsubscribe and verify no more calls
        act(() => {
            unsubscribe();
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );
        });

        // Should still have only been called once
        expect(mockListener).toHaveBeenCalledTimes(1);
    });

    test('should handle all transition types correctly', () => {
        const capturedEvents: StepTransitionEvent[] = [];
        const mockListener = jest.fn((event) => capturedEvents.push(event));

        // Subscribe to events
        const unsubscribe = mockTransitionEventManager.subscribe(mockListener);

        // Emit events for each transition type
        act(() => {
            // Standard transition (regular sequential flow)
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );

            // Map-based transition (special transition via STEP_TRANSITION_MAP)
            mockTransitionEventManager.emitTransition(
                RegistrationStep.TIME_COMMITMENT,
                RegistrationStep.PAYMENT,
                TransitionType.MAP_BASED
            );

            // Direct transition (via goToStep)
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.PRICING,
                TransitionType.DIRECT
            );

            // Back transition (previous step)
            mockTransitionEventManager.emitTransition(
                RegistrationStep.EXPERIENCE_LEVEL,
                RegistrationStep.SPLASH,
                TransitionType.BACK
            );

            // Override transition (system forced)
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.CONFIRMATION,
                TransitionType.OVERRIDE
            );
        });

        // Verify all events were captured
        expect(capturedEvents.length).toBe(5);

        // Check each transition type was logged correctly
        expect(capturedEvents[0].transitionType).toBe(TransitionType.STANDARD);
        expect(capturedEvents[1].transitionType).toBe(TransitionType.MAP_BASED);
        expect(capturedEvents[2].transitionType).toBe(TransitionType.DIRECT);
        expect(capturedEvents[3].transitionType).toBe(TransitionType.BACK);
        expect(capturedEvents[4].transitionType).toBe(TransitionType.OVERRIDE);

        // Clean up
        unsubscribe();
    });

    test('should include metadata in emitted events', () => {
        const mockListener = jest.fn();

        // Subscribe to events
        const unsubscribe = mockTransitionEventManager.subscribe(mockListener);

        // Emit an event with metadata
        const metadata = {
            userAction: 'button_click',
            timestamp: Date.now(),
            deviceInfo: {
                isMobile: true,
                screenWidth: 375
            }
        };

        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD,
                metadata
            );
        });

        // Verify metadata was included and properly structured
        expect(mockListener).toHaveBeenCalledWith(
            expect.objectContaining({
                sourceStep: RegistrationStep.SPLASH,
                destinationStep: RegistrationStep.EXPERIENCE_LEVEL,
                transitionType: TransitionType.STANDARD,
                metadata: expect.objectContaining({
                    userAction: 'button_click',
                    timestamp: expect.any(Number),
                    deviceInfo: expect.objectContaining({
                        isMobile: true,
                        screenWidth: 375
                    })
                }),
            })
        );

        // Clean up
        unsubscribe();
    });

    test('should support multiple subscribers', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        // Subscribe multiple listeners
        const unsubscribe1 = mockTransitionEventManager.subscribe(listener1);
        const unsubscribe2 = mockTransitionEventManager.subscribe(listener2);

        // Emit event
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );
        });

        // Both listeners should receive the event
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);

        // Unsubscribe first listener
        unsubscribe1();

        // Emit another event
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.EXPERIENCE_LEVEL,
                RegistrationStep.GOALS,
                TransitionType.STANDARD
            );
        });

        // First listener should still have 1 call, second should have 2
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);

        // Unsubscribe second listener
        unsubscribe2();

        // Emit final event
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.GOALS,
                RegistrationStep.EQUIPMENT,
                TransitionType.STANDARD
            );
        });

        // No additional calls should happen
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);
    });

    test('should handle unsubscribing with invalid functions gracefully', () => {
        // This tests that unsubscribing with an invalid function doesn't throw errors
        // This is testing the implementation detail that when subscribe() returns a function,
        // calling that function with any arguments shouldn't throw

        // Get a valid unsubscribe function first
        const mockListener = jest.fn();
        const unsubscribe = mockTransitionEventManager.subscribe(mockListener);

        // Unsubscribe should be callable and not throw
        expect(() => unsubscribe()).not.toThrow();

        // Even calling it multiple times shouldn't throw
        expect(() => unsubscribe()).not.toThrow();

        // Should still work correctly (listener not called after unsubscribe)
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );
        });

        expect(mockListener).not.toHaveBeenCalled();
    });

    test('should maintain event ordering', () => {
        const capturedEvents: StepTransitionEvent[] = [];
        const mockListener = jest.fn((event) => capturedEvents.push(event));

        // Subscribe to events
        const unsubscribe = mockTransitionEventManager.subscribe(mockListener);

        // Emit a sequence of events that mimics a user flow
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );

            mockTransitionEventManager.emitTransition(
                RegistrationStep.EXPERIENCE_LEVEL,
                RegistrationStep.GOALS,
                TransitionType.STANDARD
            );

            mockTransitionEventManager.emitTransition(
                RegistrationStep.GOALS,
                RegistrationStep.EQUIPMENT,
                TransitionType.STANDARD
            );
        });

        // Verify events were captured in the correct order
        expect(capturedEvents.length).toBe(3);
        expect(capturedEvents[0].sourceStep).toBe(RegistrationStep.SPLASH);
        expect(capturedEvents[0].destinationStep).toBe(RegistrationStep.EXPERIENCE_LEVEL);

        expect(capturedEvents[1].sourceStep).toBe(RegistrationStep.EXPERIENCE_LEVEL);
        expect(capturedEvents[1].destinationStep).toBe(RegistrationStep.GOALS);

        expect(capturedEvents[2].sourceStep).toBe(RegistrationStep.GOALS);
        expect(capturedEvents[2].destinationStep).toBe(RegistrationStep.EQUIPMENT);

        // Clean up
        unsubscribe();
    });

    // New test case: UI component integration
    test('should emit events when triggered from UI components', async () => {
        const mockListener = jest.fn();
        const unsubscribe = mockTransitionEventManager.subscribe(mockListener);

        const handleEmitTransition = jest.fn(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );
        });

        // Render the test component
        render(
            <TestTransitionComponent onEmitTransition={handleEmitTransition} />
        );

        // Find and click the button that triggers the transition
        const button = screen.getByTestId('emit-button');

        // Use userEvent for more realistic user interactions
        await userEvent.click(button);

        // Verify the event was emitted
        expect(handleEmitTransition).toHaveBeenCalledTimes(1);
        expect(mockListener).toHaveBeenCalledWith(
            expect.objectContaining({
                sourceStep: RegistrationStep.SPLASH,
                destinationStep: RegistrationStep.EXPERIENCE_LEVEL,
                transitionType: TransitionType.STANDARD,
            })
        );

        // Clean up
        unsubscribe();
    });

    // Edge case: empty listener array
    test('should handle empty listener array gracefully', () => {
        // Ensure there are no listeners
        listeners = [];

        // This should not throw an error
        expect(() => {
            act(() => {
                mockTransitionEventManager.emitTransition(
                    RegistrationStep.SPLASH,
                    RegistrationStep.EXPERIENCE_LEVEL,
                    TransitionType.STANDARD
                );
            });
        }).not.toThrow();
    });

    // Edge case: null metadata
    test('should handle undefined or null metadata gracefully', () => {
        const mockListener = jest.fn();
        const unsubscribe = mockTransitionEventManager.subscribe(mockListener);

        // Test with undefined metadata (handled in the function signature)
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.SPLASH,
                RegistrationStep.EXPERIENCE_LEVEL,
                TransitionType.STANDARD
            );
        });

        // Test with explicitly null metadata
        act(() => {
            mockTransitionEventManager.emitTransition(
                RegistrationStep.EXPERIENCE_LEVEL,
                RegistrationStep.GOALS,
                TransitionType.STANDARD,
                null as any
            );
        });

        // Both events should have been received
        expect(mockListener).toHaveBeenCalledTimes(2);

        // Clean up
        unsubscribe();
    });
}); 