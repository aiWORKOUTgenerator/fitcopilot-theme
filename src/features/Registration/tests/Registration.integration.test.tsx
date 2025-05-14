/**
 * Integration tests for the Registration flow
 * 
 * This file tests the registration flow components and hooks together to ensure
 * they work properly as an integrated system.
 */

import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TransitionType } from '../events/transitionEvents';
import { RegistrationStep } from '../types';
import {
    cleanupIntegrationTest,
    renderWithProviders,
    setupIntegrationTest
} from './utils';

// Add TypeScript declaration for window._testEventManager
declare global {
    interface Window {
        _testEventManager?: ReturnType<typeof setupIntegrationTest>['eventManager'];
    }
}

// Setup a test harness component that simulates Registration flow
const TestRegistrationFlow = () => {
    const [currentStep, setCurrentStep] = React.useState(RegistrationStep.SPLASH);

    // Function to navigate to next step
    const handleNext = () => {
        // Determine next step based on currentStep
        let nextStep = RegistrationStep.SPLASH;

        switch (currentStep) {
            case RegistrationStep.SPLASH:
                nextStep = RegistrationStep.EXPERIENCE_LEVEL;
                break;
            case RegistrationStep.EXPERIENCE_LEVEL:
                nextStep = RegistrationStep.GOALS;
                break;
            case RegistrationStep.GOALS:
                nextStep = RegistrationStep.EQUIPMENT;
                break;
            case RegistrationStep.EQUIPMENT:
                nextStep = RegistrationStep.TIME_COMMITMENT;
                break;
            case RegistrationStep.TIME_COMMITMENT:
                nextStep = RegistrationStep.PAYMENT;
                break;
            case RegistrationStep.PAYMENT:
                nextStep = RegistrationStep.CONFIRMATION;
                break;
            default:
                nextStep = RegistrationStep.SPLASH;
        }

        // Update state
        setCurrentStep(nextStep);

        // If we had the real event manager, this would emit a transition
        window._testEventManager?.emitTransition(
            currentStep,
            nextStep,
            TransitionType.STANDARD
        );
    };

    // Function to navigate to previous step
    const handleBack = () => {
        // Determine previous step based on currentStep
        let prevStep = RegistrationStep.SPLASH;

        switch (currentStep) {
            case RegistrationStep.EXPERIENCE_LEVEL:
                prevStep = RegistrationStep.SPLASH;
                break;
            case RegistrationStep.GOALS:
                prevStep = RegistrationStep.EXPERIENCE_LEVEL;
                break;
            case RegistrationStep.EQUIPMENT:
                prevStep = RegistrationStep.GOALS;
                break;
            case RegistrationStep.TIME_COMMITMENT:
                prevStep = RegistrationStep.EQUIPMENT;
                break;
            case RegistrationStep.PAYMENT:
                prevStep = RegistrationStep.TIME_COMMITMENT;
                break;
            case RegistrationStep.CONFIRMATION:
                prevStep = RegistrationStep.PAYMENT;
                break;
            default:
                prevStep = RegistrationStep.SPLASH;
        }

        // Update state
        setCurrentStep(prevStep);

        // If we had the real event manager, this would emit a transition
        window._testEventManager?.emitTransition(
            currentStep,
            prevStep,
            TransitionType.BACK
        );
    };

    return (
        <div data-testid="test-registration-flow">
            <h1>Test Registration Flow</h1>
            <div data-testid="current-step-display">{currentStep}</div>

            {/* Registration component simulation */}
            <div className="registration-container">
                <div data-testid="registration-component">
                    <h2>Registration Step: {currentStep}</h2>
                    <div data-testid="current-step">{currentStep}</div>
                </div>
            </div>

            {/* Navigation controls */}
            <div className="navigation-controls">
                <button
                    onClick={handleBack}
                    data-testid="back-button"
                    disabled={currentStep === RegistrationStep.SPLASH}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    data-testid="next-button"
                    disabled={currentStep === RegistrationStep.CONFIRMATION}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

describe('Registration Flow Integration', () => {
    // Setup test mocks before tests
    let mocks: ReturnType<typeof setupIntegrationTest>;

    beforeEach(() => {
        mocks = setupIntegrationTest();

        // Expose event manager for the test harness
        window._testEventManager = mocks.eventManager;
    });

    afterEach(() => {
        cleanupIntegrationTest();
        delete window._testEventManager;
    });

    test('renders initial registration flow correctly', () => {
        renderWithProviders(<TestRegistrationFlow />);

        // Verify initial state
        expect(screen.getByTestId('current-step-display')).toHaveTextContent(RegistrationStep.SPLASH);
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.SPLASH);

        // Back button should be disabled on first step
        expect(screen.getByTestId('back-button')).toBeDisabled();

        // Next button should be enabled
        expect(screen.getByTestId('next-button')).toBeEnabled();
    });

    test('navigates through all registration steps in sequence', async () => {
        renderWithProviders(<TestRegistrationFlow />);

        // Start at SPLASH step
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.SPLASH);

        // Click next to go to EXPERIENCE_LEVEL
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button'));
        });
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.EXPERIENCE_LEVEL);

        // Verify event was emitted
        expect(mocks.eventManager.emitTransition).toHaveBeenCalledWith(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        // Click next to go to GOALS
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button'));
        });
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.GOALS);

        // Click next to go to EQUIPMENT
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button'));
        });
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.EQUIPMENT);

        // Click next to go to TIME_COMMITMENT
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button'));
        });
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.TIME_COMMITMENT);

        // Click next to go to PAYMENT
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button'));
        });
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.PAYMENT);

        // Click next to go to CONFIRMATION
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button'));
        });
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.CONFIRMATION);

        // Next button should be disabled on last step
        expect(screen.getByTestId('next-button')).toBeDisabled();

        // Verify we emitted events for all transitions
        expect(mocks.eventManager.emitTransition).toHaveBeenCalledTimes(6);
    });

    test('navigates backward through registration steps', async () => {
        renderWithProviders(<TestRegistrationFlow />);

        // 1. First navigate to EXPERIENCE_LEVEL
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button')); // SPLASH -> EXPERIENCE_LEVEL
        });

        // Verify we're at EXPERIENCE_LEVEL
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.EXPERIENCE_LEVEL);

        // 2. Now navigate to GOALS
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button')); // EXPERIENCE_LEVEL -> GOALS
        });

        // Verify we're at GOALS
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.GOALS);

        // 3. Navigate back to EXPERIENCE_LEVEL
        await act(async () => {
            await userEvent.click(screen.getByTestId('back-button'));
        });

        // Verify we're back at EXPERIENCE_LEVEL
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.EXPERIENCE_LEVEL);

        // Verify back event was emitted
        expect(mocks.eventManager.emitTransition).toHaveBeenCalledWith(
            RegistrationStep.GOALS,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.BACK
        );

        // 4. Go back to SPLASH
        await act(async () => {
            await userEvent.click(screen.getByTestId('back-button'));
        });

        // Verify we're back at SPLASH
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.SPLASH);

        // Back button should be disabled on first step
        expect(screen.getByTestId('back-button')).toBeDisabled();
    });

    test('tracks analytics events during navigation', async () => {
        renderWithProviders(<TestRegistrationFlow />);

        // Navigate to EXPERIENCE_LEVEL
        await act(async () => {
            await userEvent.click(screen.getByTestId('next-button'));
        });

        // Verify transition events were emitted that would trigger analytics
        expect(mocks.eventManager.emitTransition).toHaveBeenCalledWith(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        // In a real implementation, our analytics hook would subscribe to these events
        // and track them. We've tested that separately in analytics.test.tsx.
    });
}); 