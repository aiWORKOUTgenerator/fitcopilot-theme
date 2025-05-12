/* eslint-disable */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { JourneyProvider } from '../../../components/JourneyContext';
import CustomizeExperience from '../CustomizeExperience';

// Mock implementation for journey context
jest.mock('../../../components/JourneyContext', () => ({
    useJourney: () => ({
        registrationData: {
            experienceLevel: 'beginner',
            completedCustomizationSections: [],
        },
        updateRegistrationData: jest.fn(),
    }),
    JourneyProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock storage functions
jest.mock('../utils/customizationStorage', () => ({
    loadCustomizationData: jest.fn(() => null),
    saveCustomizationData: jest.fn(() => true),
}));

describe('CustomizeExperience', () => {
    const renderComponent = () => {
        const handleValidChange = jest.fn();
        render(
            <JourneyProvider>
                <CustomizeExperience onValidChange={handleValidChange} />
            </JourneyProvider>
        );
        return { handleValidChange };
    };

    test('allows completing equipment section', async () => {
        const { handleValidChange } = renderComponent();

        // Wait for initial render and loading to complete
        await waitFor(() => {
            expect(screen.getByText('Equipment Selection')).toBeInTheDocument();
        });

        // Find and click on an equipment option
        const dumbbellsOption = await screen.findByText('Dumbbells');
        fireEvent.click(dumbbellsOption);

        // Confirm button should be enabled
        const confirmButton = screen.getByText('Confirm Selection');
        expect(confirmButton).not.toBeDisabled();

        // Click confirm button
        fireEvent.click(confirmButton);

        // Check that handler was called with true
        await waitFor(() => {
            expect(handleValidChange).toHaveBeenCalledWith(true);
        });
    });

    test('shows validation message when trying to proceed without selection', async () => {
        renderComponent();

        // Wait for initial render and loading to complete
        await waitFor(() => {
            expect(screen.getByText('Equipment Selection')).toBeInTheDocument();
        });

        // Try to interact with confirm button, which should be disabled
        const confirmButton = screen.getByText('Confirm Selection');
        expect(confirmButton).toBeDisabled();

        // Fill and clear a text field to trigger validation
        const otherEquipmentInput = screen.getByPlaceholderText('Please list any other equipment you have');
        fireEvent.change(otherEquipmentInput, { target: { value: 'My equipment' } });
        fireEvent.change(otherEquipmentInput, { target: { value: '' } });

        // Validation message should appear
        await waitFor(() => {
            expect(screen.getByText('Please select at least one equipment item or specify other equipment')).toBeInTheDocument();
        });
    });

    test('recovers from errors with retry', async () => {
        // Mock storage function to fail once and succeed on retry
        const saveCustomizationData = require('../utils/customizationStorage').saveCustomizationData;
        let firstTry = true;
        saveCustomizationData.mockImplementation(() => {
            if (firstTry) {
                firstTry = false;
                return false;
            }
            return true;
        });

        renderComponent();

        // Wait for initial render and loading to complete
        await waitFor(() => {
            expect(screen.getByText('Equipment Selection')).toBeInTheDocument();
        });

        // Select an equipment option
        const dumbbellsOption = await screen.findByText('Dumbbells');
        fireEvent.click(dumbbellsOption);

        // Click confirm button - this should fail
        const confirmButton = screen.getByText('Confirm Selection');
        fireEvent.click(confirmButton);

        // Error message should appear
        await waitFor(() => {
            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });

        // Click retry
        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);

        // Should proceed to next section
        await waitFor(() => {
            expect(screen.getByText('Time Management & Frequency')).toBeInTheDocument();
        });
    });
}); 