/* eslint-disable */
import { transitionEventManager } from '../events/transitionEventManager';
import { StepTransitionEvent, TransitionType } from '../events/transitionEvents';
import { RegistrationStep } from '../types';

// Import test setup
import './setup';

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

describe('Transition Events System', () => {
    beforeEach(() => {
        // Reset any mocks and clean up before each test
        jest.clearAllMocks();
    });

    test('should subscribe to transition events and capture all event data', () => {
        const mockListener = jest.fn();

        // Subscribe to events
        const unsubscribe = transitionEventManager.subscribe(mockListener);

        // Emit an event
        const timestamp = Date.now();
        jest.spyOn(Date, 'now').mockImplementation(() => timestamp);

        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        // Verify listener was called with complete event data
        expect(mockListener).toHaveBeenCalledWith({
            sourceStep: RegistrationStep.SPLASH,
            destinationStep: RegistrationStep.EXPERIENCE_LEVEL,
            transitionType: TransitionType.STANDARD,
            timestamp,
        });

        // Unsubscribe and verify no more calls
        unsubscribe();
        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        // Should still have only been called once
        expect(mockListener).toHaveBeenCalledTimes(1);
    });

    test('should handle all transition types correctly', () => {
        const capturedEvents: StepTransitionEvent[] = [];
        const mockListener = jest.fn((event) => capturedEvents.push(event));

        // Subscribe to events
        const unsubscribe = transitionEventManager.subscribe(mockListener);

        // Emit events for each transition type
        // Standard transition (regular sequential flow)
        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        // Map-based transition (special transition via STEP_TRANSITION_MAP)
        transitionEventManager.emitTransition(
            RegistrationStep.TIME_COMMITMENT,
            RegistrationStep.ACCOUNT_DETAILS,
            TransitionType.MAP_BASED
        );

        // Direct transition (via goToStep)
        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.PRICING,
            TransitionType.DIRECT
        );

        // Back transition (previous step)
        transitionEventManager.emitTransition(
            RegistrationStep.EXPERIENCE_LEVEL,
            RegistrationStep.SPLASH,
            TransitionType.BACK
        );

        // Override transition (system forced)
        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.ACCOUNT_DETAILS,
            TransitionType.OVERRIDE
        );

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
        const unsubscribe = transitionEventManager.subscribe(mockListener);

        // Emit an event with metadata
        const metadata = {
            userAction: 'button_click',
            timestamp: Date.now(),
            deviceInfo: {
                isMobile: true,
                screenWidth: 375
            }
        };

        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD,
            metadata
        );

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
        const unsubscribe1 = transitionEventManager.subscribe(listener1);
        const unsubscribe2 = transitionEventManager.subscribe(listener2);

        // Emit event
        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        // Both listeners should receive the event
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);

        // Unsubscribe first listener
        unsubscribe1();

        // Emit another event
        transitionEventManager.emitTransition(
            RegistrationStep.EXPERIENCE_LEVEL,
            RegistrationStep.GOALS,
            TransitionType.STANDARD
        );

        // First listener should still have 1 call, second should have 2
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);

        // Unsubscribe second listener
        unsubscribe2();

        // Emit final event
        transitionEventManager.emitTransition(
            RegistrationStep.GOALS,
            RegistrationStep.EQUIPMENT,
            TransitionType.STANDARD
        );

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
        const unsubscribe = transitionEventManager.subscribe(mockListener);

        // Unsubscribe should be callable and not throw
        expect(() => unsubscribe()).not.toThrow();

        // Even calling it multiple times shouldn't throw
        expect(() => unsubscribe()).not.toThrow();

        // Should still work correctly (listener not called after unsubscribe)
        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );
        expect(mockListener).not.toHaveBeenCalled();
    });

    test('should maintain event ordering', () => {
        const capturedEvents: StepTransitionEvent[] = [];
        const mockListener = jest.fn((event) => capturedEvents.push(event));

        // Subscribe to events
        const unsubscribe = transitionEventManager.subscribe(mockListener);

        // Emit a sequence of events that mimics a user flow
        transitionEventManager.emitTransition(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        transitionEventManager.emitTransition(
            RegistrationStep.EXPERIENCE_LEVEL,
            RegistrationStep.GOALS,
            TransitionType.STANDARD
        );

        transitionEventManager.emitTransition(
            RegistrationStep.GOALS,
            RegistrationStep.EQUIPMENT,
            TransitionType.STANDARD
        );

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
}); 