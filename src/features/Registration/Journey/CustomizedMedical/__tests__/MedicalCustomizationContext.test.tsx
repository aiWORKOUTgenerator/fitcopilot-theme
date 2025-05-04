import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MedicalCustomizationProvider, useMedicalCustomization } from '../context/MedicalCustomizationContext';
import { getMedicalCustomizationData, saveMedicalCustomizationData } from '../utils/customizationStorage';

// Mock the storage module
jest.mock('../utils/customizationStorage', () => ({
    getMedicalCustomizationData: jest.fn(),
    saveMedicalCustomizationData: jest.fn().mockResolvedValue({ success: true })
}));

// Mock the JourneyContext
jest.mock('../../components/JourneyContext', () => ({
    useJourney: () => ({
        registrationData: {},
        updateRegistrationData: jest.fn()
    })
}));

// Test component that uses the context
const TestComponent = () => {
    const { state, updateSectionData, markSectionComplete } = useMedicalCustomization();

    return (
        <div>
            <div data-testid="section-data">{JSON.stringify(state)}</div>
            <button
                data-testid="update-button"
                onClick={() => updateSectionData('anthropometrics', { height: { value: 180, unit: 'cm' } })}
            >
                Update Data
            </button>
            <button
                data-testid="complete-button"
                onClick={() => markSectionComplete('anthropometrics')}
            >
                Complete Section
            </button>
        </div>
    );
};

describe('MedicalCustomizationContext', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock default storage response
        (getMedicalCustomizationData as jest.Mock).mockReturnValue(null);
    });

    test('provides initial state', async () => {
        render(
            <MedicalCustomizationProvider>
                <TestComponent />
            </MedicalCustomizationProvider>
        );

        // Wait for loading to complete
        await screen.findByTestId('section-data');

        // Check that the data is loaded
        expect(getMedicalCustomizationData).toHaveBeenCalled();

        // Verify initial state is provided
        const stateEl = screen.getByTestId('section-data');
        const parsedState = JSON.parse(stateEl.textContent || '{}');

        expect(parsedState.anthropometrics).toBeNull();
        expect(parsedState.meta.completedSections).toEqual([]);
        expect(parsedState.meta.validSections).toBeDefined();
    });

    test('updates section data and persists changes', async () => {
        render(
            <MedicalCustomizationProvider>
                <TestComponent />
            </MedicalCustomizationProvider>
        );

        // Wait for loading
        await screen.findByTestId('update-button');

        // Update section data
        await act(async () => {
            screen.getByTestId('update-button').click();
        });

        // Check updated state
        const stateEl = screen.getByTestId('section-data');
        const parsedState = JSON.parse(stateEl.textContent || '{}');

        expect(parsedState.anthropometrics).toEqual({ height: { value: 180, unit: 'cm' } });

        // Verify persistence is called (with debounce)
        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        expect(saveMedicalCustomizationData).toHaveBeenCalled();
    });

    test('marks section as complete', async () => {
        render(
            <MedicalCustomizationProvider>
                <TestComponent />
            </MedicalCustomizationProvider>
        );

        // Wait for loading
        await screen.findByTestId('complete-button');

        // Complete section
        await act(async () => {
            screen.getByTestId('complete-button').click();
        });

        // Check updated state
        const stateEl = screen.getByTestId('section-data');
        const parsedState = JSON.parse(stateEl.textContent || '{}');

        expect(parsedState.meta.completedSections).toContain('anthropometrics');
    });
}); 