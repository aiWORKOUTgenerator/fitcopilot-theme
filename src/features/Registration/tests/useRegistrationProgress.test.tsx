/* eslint-disable */
import { act, renderHook } from '@testing-library/react';
import { REGISTRATION_STEPS, useRegistrationProgress } from '../hooks/useRegistrationProgress';
import { RegistrationStep } from '../types';

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

// Mock the useNavigationOverrides hook
jest.mock('../hooks/useNavigationOverrides', () => {
    return jest.fn(initialStep => initialStep);
});

describe('useRegistrationProgress', () => {
    beforeEach(() => {
        // Clear session storage before each test
        window.sessionStorage.clear();
        jest.clearAllMocks();
    });

    test('should initialize with correct step', () => {
        const { result } = renderHook(() => useRegistrationProgress(RegistrationStep.SPLASH));
        expect(result.current.currentStep).toBe(RegistrationStep.SPLASH);
    });

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

    test('should calculate progress percentage based on step index', () => {
        // Calculate expected progress values manually 
        const splashIndex = REGISTRATION_STEPS.indexOf(RegistrationStep.SPLASH);
        const pricingIndex = REGISTRATION_STEPS.indexOf(RegistrationStep.PRICING);

        const totalSteps = REGISTRATION_STEPS.length - 1; // -1 because we start at 0

        const expectedSplashProgress = (splashIndex / totalSteps) * 100;
        const expectedPricingProgress = (pricingIndex / totalSteps) * 100;

        // Render hooks for different steps
        const { result: resultSplash } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.SPLASH)
        );
        const { result: resultPricing } = renderHook(() =>
            useRegistrationProgress(RegistrationStep.PRICING)
        );

        // Splash should have lower progress than Pricing
        expect(resultSplash.current.progress).toBeLessThan(resultPricing.current.progress);

        // Verify calculations are close enough (within 1% for floating point)
        expect(Math.abs(resultSplash.current.progress - expectedSplashProgress)).toBeLessThan(1);
        expect(Math.abs(resultPricing.current.progress - expectedPricingProgress)).toBeLessThan(1);
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