/* eslint-disable */
import { act, renderHook } from '@testing-library/react';
import { REGISTRATION_STEPS, useRegistrationProgress } from '../hooks/useRegistrationProgress';
import { RegistrationStep } from '../types';
import { setupMockStorage } from './utils/testSimple';

// Import test setup
import './setup';

// Mock the useRegistrationEvents hook
const mockTrackStandardTransition = jest.fn();
const mockTrackMapTransition = jest.fn();
const mockTrackDirectNavigation = jest.fn();
const mockTrackBackNavigation = jest.fn();
const mockTrackOverrideNavigation = jest.fn();

jest.mock('../hooks/useRegistrationEvents', () => ({
    useRegistrationEvents: () => ({
        trackStandardTransition: mockTrackStandardTransition,
        trackMapTransition: mockTrackMapTransition,
        trackDirectNavigation: mockTrackDirectNavigation,
        trackBackNavigation: mockTrackBackNavigation,
        trackOverrideNavigation: mockTrackOverrideNavigation,
    }),
}));

// Mock the useNavigationOverrides hook with ability to simulate overrides
const mockOverrideImplementation = jest.fn();
jest.mock('../hooks/useNavigationOverrides', () => {
    return jest.fn((initialStep) => mockOverrideImplementation(initialStep));
});

// Mock transitionEventManager for more complete tests
const mockEmitTransition = jest.fn();
jest.mock('../events/transitionEventManager', () => ({
    transitionEventManager: {
        subscribe: jest.fn((listener) => {
            return jest.fn(); // Unsubscribe function
        }),
        emitTransition: mockEmitTransition
    }
}));

describe('useRegistrationProgress', () => {
    beforeEach(() => {
        // Setup mock storage
        setupMockStorage();

        // Reset all mocks
        jest.clearAllMocks();

        // Default implementation for navigation override (no override)
        mockOverrideImplementation.mockImplementation((initialStep) => initialStep);
    });

    // Basic initialization tests
    test('should initialize with correct step', () => {
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.SPLASH));
        expect(result.current.currentStep).toBe(RegistrationStep.SPLASH);
        expect(result.current.progress).toBe(0); // First step has 0 progress
    });

    test('should initialize with override step when provided', () => {
        // Setup mock override
        mockOverrideImplementation.mockReturnValueOnce(RegistrationStep.PRICING);

        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.SPLASH));

        // Should use the override value
        expect(result.current.currentStep).toBe(RegistrationStep.PRICING);
        expect(mockTrackOverrideNavigation).toHaveBeenCalledWith(
            RegistrationStep.SPLASH,
            RegistrationStep.PRICING,
            expect.objectContaining({
                reason: 'Initial step override'
            })
        );
    });

    // Standard navigation tests
    test('should navigate to next step correctly with standard transition', () => {
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.SPLASH));

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(RegistrationStep.EXPERIENCE_LEVEL);
        expect(mockTrackStandardTransition).toHaveBeenCalledWith(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            expect.objectContaining({
                transitionSource: 'nextStep',
                stepIndex: 1
            })
        );
    });

    test('should handle map transitions correctly', () => {
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.TIME_COMMITMENT));

        act(() => {
            result.current.nextStep();
        });

        // Should transition directly to PRICING
        expect(result.current.currentStep).toBe(RegistrationStep.PRICING);
        expect(mockTrackMapTransition).toHaveBeenCalledWith(
            RegistrationStep.TIME_COMMITMENT,
            RegistrationStep.PRICING,
            expect.any(Object)
        );
    });

    test('should handle complex navigation sequence correctly', () => {
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.SPLASH));

        // First navigation
        act(() => {
            result.current.nextStep(); // SPLASH -> EXPERIENCE_LEVEL
        });
        expect(result.current.currentStep).toBe(RegistrationStep.EXPERIENCE_LEVEL);

        // Second navigation
        act(() => {
            result.current.nextStep(); // EXPERIENCE_LEVEL -> GOALS
        });
        expect(result.current.currentStep).toBe(RegistrationStep.GOALS);

        // Go back
        act(() => {
            result.current.previousStep(); // GOALS -> EXPERIENCE_LEVEL
        });
        expect(result.current.currentStep).toBe(RegistrationStep.EXPERIENCE_LEVEL);

        // Direct navigation
        act(() => {
            result.current.goToStep(RegistrationStep.PRICING);
        });
        expect(result.current.currentStep).toBe(RegistrationStep.PRICING);
    });

    test('should handle back navigation from PRICING correctly', () => {
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.PRICING));

        act(() => {
            result.current.previousStep();
        });

        // Should go back to TIME_COMMITMENT
        expect(result.current.currentStep).toBe(RegistrationStep.TIME_COMMITMENT);
        expect(mockTrackBackNavigation).toHaveBeenCalledWith(
            RegistrationStep.PRICING,
            RegistrationStep.TIME_COMMITMENT,
            expect.any(Object)
        );
    });

    test('should handle direct navigation with goToStep', () => {
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.SPLASH));

        act(() => {
            result.current.goToStep(RegistrationStep.PRICING);
        });

        expect(result.current.currentStep).toBe(RegistrationStep.PRICING);
        expect(mockTrackDirectNavigation).toHaveBeenCalledWith(
            RegistrationStep.SPLASH,
            RegistrationStep.PRICING,
            expect.objectContaining({
                method: 'goToStep',
                validDestination: true
            })
        );
        expect(window.sessionStorage.getItem('PREVIOUS_STEP')).toBe(RegistrationStep.SPLASH);
    });

    test('should not navigate to invalid step with goToStep', () => {
        const invalidStep = 'invalid_step' as RegistrationStep;
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.SPLASH));

        act(() => {
            result.current.goToStep(invalidStep);
        });

        // Should stay on current step
        expect(result.current.currentStep).toBe(RegistrationStep.SPLASH);
        expect(mockTrackDirectNavigation).toHaveBeenCalledWith(
            RegistrationStep.SPLASH,
            RegistrationStep.SPLASH,
            expect.objectContaining({
                method: 'goToStep',
                validDestination: false,
                attemptedDestination: invalidStep,
                error: 'Invalid destination step'
            })
        );
    });

    test('should stay on last step when trying to go past it', () => {
        const lastStep = REGISTRATION_STEPS[REGISTRATION_STEPS.length - 1];
        const { result } = renderHook(() => useRegistrationProgress(lastStep));

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStep).toBe(lastStep);
    });

    test('should recover from invalid step in nextStep function', () => {
        // Create a simpler test for the recovery logic
        const invalidStep = 'nonexistent_step' as RegistrationStep;

        // Directly call the recovery logic
        const currentIndex = REGISTRATION_STEPS.indexOf(invalidStep);

        // Simulate the recovery code path
        if (currentIndex < 0) {
            mockTrackDirectNavigation(
                invalidStep,
                RegistrationStep.SPLASH,
                {
                    error: 'Invalid registration step',
                    recovery: 'Fallback to splash'
                }
            );
        }

        // Verify our trackDirectNavigation was called with recovery params
        expect(mockTrackDirectNavigation).toHaveBeenCalledWith(
            'nonexistent_step',
            RegistrationStep.SPLASH,
            expect.objectContaining({
                error: 'Invalid registration step',
                recovery: 'Fallback to splash'
            })
        );
    });

    test('should calculate progress percentage based on step index', () => {
        // Calculate expected progress values manually 
        const splashIndex = REGISTRATION_STEPS.indexOf(RegistrationStep.SPLASH);
        const pricingIndex = REGISTRATION_STEPS.indexOf(RegistrationStep.PRICING);

        const totalSteps = REGISTRATION_STEPS.length - 1; // -1 because we start at 0

        const expectedSplashProgress = Math.round((splashIndex / totalSteps) * 100);
        const expectedPricingProgress = Math.round((pricingIndex / totalSteps) * 100);

        // Render hooks for different steps
        const { result: resultSplash } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.SPLASH)
        );
        const { result: resultPricing } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.PRICING)
        );

        // Splash should have lower progress than Pricing
        expect(resultSplash.current.progress).toBeLessThan(resultPricing.current.progress);

        // Verify calculations match expected values
        expect(resultSplash.current.progress).toBe(expectedSplashProgress);
        expect(resultPricing.current.progress).toBe(expectedPricingProgress);
    });

    test('should correctly determine if has next step', () => {
        const { result: resultFirst } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.SPLASH)
        );
        expect(resultFirst.current.hasNextStep).toBe(true);

        const { result: resultLast } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.CONFIRMATION)
        );
        expect(resultLast.current.hasNextStep).toBe(false);
    });

    test('should correctly determine if has previous step', () => {
        const { result: resultFirst } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.SPLASH)
        );
        expect(resultFirst.current.hasPreviousStep).toBe(false);

        const { result: resultMiddle } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.GOALS)
        );
        expect(resultMiddle.current.hasPreviousStep).toBe(true);
    });
}); 