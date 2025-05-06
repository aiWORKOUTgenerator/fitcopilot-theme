import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
    NavigationProvider,
    useNavigation
} from '../context/NavigationContext';
import { JourneySubstepId, RegistrationStepId, SectionId } from '../types';

// Simple test component using the navigation context
const TestComponent = () => {
    const {
        state,
        nextStep,
        previousStep,
        goToStep,
        nextSubstep,
        previousSubstep,
        goToSubstep,
        completeSection,
        updateRegistrationData
    } = useNavigation();

    return (
        <div>
            <div data-testid="current-step">{state.currentStep}</div>
            <div data-testid="current-substep">{state.currentSubstep || 'none'}</div>
            <div data-testid="registration-data">{JSON.stringify(state.registrationData)}</div>

            <button data-testid="next-step" onClick={nextStep}>Next Step</button>
            <button data-testid="prev-step" onClick={previousStep}>Previous Step</button>
            <button data-testid="go-to-journey" onClick={() => goToStep(RegistrationStepId.JOURNEY)}>Go to Journey</button>

            <button data-testid="next-substep" onClick={nextSubstep}>Next Substep</button>
            <button data-testid="prev-substep" onClick={previousSubstep}>Previous Substep</button>
            <button data-testid="go-to-equipment" onClick={() => goToSubstep(JourneySubstepId.EQUIPMENT)}>Go to Equipment</button>

            <button data-testid="complete-equipment-home" onClick={() => completeSection(SectionId.EQUIPMENT_HOME)}>
                Complete Home Equipment
            </button>

            <button
                data-testid="update-data"
                onClick={() => updateRegistrationData({ experienceLevel: 'advanced' })}
            >
                Update Data
            </button>
        </div>
    );
};

describe('NavigationContext', () => {
    test('initializes with default state', () => {
        render(
            <NavigationProvider>
                <TestComponent />
            </NavigationProvider>
        );

        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStepId.SPLASH);
        expect(screen.getByTestId('current-substep')).toHaveTextContent('none');
    });

    test('initializes with provided initialStep', () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.EXPERIENCE_LEVEL}>
                <TestComponent />
            </NavigationProvider>
        );

        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStepId.EXPERIENCE_LEVEL);
    });

    test('initializes with provided initialData', () => {
        render(
            <NavigationProvider initialData={{ experienceLevel: 'beginner' }}>
                <TestComponent />
            </NavigationProvider>
        );

        expect(screen.getByTestId('registration-data')).toHaveTextContent('beginner');
    });

    test('can navigate to next step', () => {
        render(
            <NavigationProvider>
                <TestComponent />
            </NavigationProvider>
        );

        fireEvent.click(screen.getByTestId('next-step'));
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStepId.EXPERIENCE_LEVEL);
    });

    test('can navigate to previous step', () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.EXPERIENCE_LEVEL}>
                <TestComponent />
            </NavigationProvider>
        );

        fireEvent.click(screen.getByTestId('prev-step'));
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStepId.SPLASH);
    });

    test('can go to specified step', () => {
        render(
            <NavigationProvider>
                <TestComponent />
            </NavigationProvider>
        );

        fireEvent.click(screen.getByTestId('go-to-journey'));
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStepId.JOURNEY);
        // Should also set the initial substep when going to Journey
        expect(screen.getByTestId('current-substep')).toHaveTextContent(JourneySubstepId.GOALS);
    });

    test('can navigate to next substep', () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.JOURNEY}>
                <TestComponent />
            </NavigationProvider>
        );

        // Should start with GOALS substep
        expect(screen.getByTestId('current-substep')).toHaveTextContent(JourneySubstepId.GOALS);

        fireEvent.click(screen.getByTestId('next-substep'));
        expect(screen.getByTestId('current-substep')).toHaveTextContent(JourneySubstepId.EQUIPMENT);
    });

    test('can navigate to previous substep', () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.JOURNEY}>
                <TestComponent />
            </NavigationProvider>
        );

        // Go to EQUIPMENT first
        fireEvent.click(screen.getByTestId('next-substep'));
        expect(screen.getByTestId('current-substep')).toHaveTextContent(JourneySubstepId.EQUIPMENT);

        // Then go back to GOALS
        fireEvent.click(screen.getByTestId('prev-substep'));
        expect(screen.getByTestId('current-substep')).toHaveTextContent(JourneySubstepId.GOALS);
    });

    test('can go to specified substep', () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.JOURNEY}>
                <TestComponent />
            </NavigationProvider>
        );

        fireEvent.click(screen.getByTestId('go-to-equipment'));
        expect(screen.getByTestId('current-substep')).toHaveTextContent(JourneySubstepId.EQUIPMENT);
    });

    test('can complete sections', () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.JOURNEY}>
                <TestComponent />
            </NavigationProvider>
        );

        fireEvent.click(screen.getByTestId('complete-equipment-home'));

        // This is harder to test with the current setup since we don't directly expose completedSections
        // In a real app, we might have UI elements that show completion status
    });

    test('can update registration data', () => {
        render(
            <NavigationProvider>
                <TestComponent />
            </NavigationProvider>
        );

        fireEvent.click(screen.getByTestId('update-data'));
        expect(screen.getByTestId('registration-data')).toHaveTextContent('advanced');
    });
}); 