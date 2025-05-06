import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { NavigationProvider, useNavigation } from '../context/NavigationContext';
import { useNavigationBridge } from '../hooks/useNavigationBridge';
import { RegistrationStep, RegistrationStepId } from '../types';

// Simple test component using the navigation bridge directly
const TestBridgeComponent = () => {
    const { nextStep, currentStep } = useNavigationBridge();

    return (
        <div>
            <div data-testid="current-step">{currentStep}</div>
            <button data-testid="next-step" onClick={nextStep}>Next Step</button>
        </div>
    );
};

// Component using direct navigation context
const TestNavigationComponent = () => {
    const { state, nextStep } = useNavigation();

    return (
        <div>
            <div data-testid="current-nav-step">{state.currentStep}</div>
            <button data-testid="nav-next-step" onClick={nextStep}>Next Step</button>
        </div>
    );
};

// Component that combines both for debugging
const TestCombinedComponent = () => {
    const bridge = useNavigationBridge();
    const navigation = useNavigation();

    const handleBridgeNext = () => {
        console.log('Before Bridge Next Step:', bridge.currentStep);
        console.log('Navigation State Before Bridge:', navigation.state.currentStep);
        bridge.nextStep();
        console.log('After Bridge Next Step:', bridge.currentStep);
        console.log('Navigation State After Bridge:', navigation.state.currentStep);
    };

    const handleDirectNext = () => {
        console.log('Before Direct Next Step:', bridge.currentStep);
        console.log('Navigation State Before Direct:', navigation.state.currentStep);
        navigation.nextStep();
        console.log('After Direct Next Step:', bridge.currentStep);
        console.log('Navigation State After Direct:', navigation.state.currentStep);
    };

    return (
        <div>
            <div>Bridge Step: {bridge.currentStep}</div>
            <div>Navigation Step: {navigation.state.currentStep}</div>
            <button onClick={handleBridgeNext}>Use Bridge Next</button>
            <button onClick={handleDirectNext}>Use Direct Next</button>
        </div>
    );
};

describe('Navigation Bridge Test', () => {
    test('bridge correctly navigates from SPLASH to EXPERIENCE_LEVEL', async () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.SPLASH}>
                <TestBridgeComponent />
            </NavigationProvider>
        );

        // Verify initial state
        expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.SPLASH);

        // Navigate to next step
        fireEvent.click(screen.getByTestId('next-step'));

        // Verify navigation occurred
        await waitFor(() => {
            expect(screen.getByTestId('current-step')).toHaveTextContent(RegistrationStep.EXPERIENCE_LEVEL);
        });
    });

    test('navigation context correctly steps through main steps', () => {
        render(
            <NavigationProvider initialStep={RegistrationStepId.SPLASH}>
                <TestNavigationComponent />
            </NavigationProvider>
        );

        // Verify initial state
        expect(screen.getByTestId('current-nav-step')).toHaveTextContent(RegistrationStepId.SPLASH);

        // Navigate to next step
        fireEvent.click(screen.getByTestId('nav-next-step'));

        // Check that we've moved to the next step
        expect(screen.getByTestId('current-nav-step')).toHaveTextContent(RegistrationStepId.EXPERIENCE_LEVEL);
    });

    // This test helps understand the relationship between the bridge and navigation
    test('combined test demonstrates bridge and navigation together', async () => {
        const { getByText } = render(
            <NavigationProvider initialStep={RegistrationStepId.SPLASH}>
                <TestCombinedComponent />
            </NavigationProvider>
        );

        // Verify initial rendering shows both are on SPLASH
        expect(getByText(/Bridge Step:/)).toHaveTextContent(RegistrationStep.SPLASH);
        expect(getByText(/Navigation Step:/)).toHaveTextContent(RegistrationStepId.SPLASH);

        // Use the bridge navigation
        fireEvent.click(getByText('Use Bridge Next'));

        // Both should now show EXPERIENCE_LEVEL
        await waitFor(() => {
            expect(getByText(/Bridge Step:/)).toHaveTextContent(RegistrationStep.EXPERIENCE_LEVEL);
            expect(getByText(/Navigation Step:/)).toHaveTextContent(RegistrationStepId.EXPERIENCE_LEVEL);
        });
    });
}); 