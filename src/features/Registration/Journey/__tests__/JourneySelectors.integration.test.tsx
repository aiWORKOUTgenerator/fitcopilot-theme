import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { RegistrationData, RegistrationStep } from '../../types';
import { AnalyticsSelector } from '../components/AnalyticsSelector';
import GoalSelector from '../components/GoalSelector/GoalSelector';
import { JourneyProvider } from '../components/JourneyContext';
import { JourneyStepCard } from '../components/JourneyStepCard';

// Mock storage
const mockSessionStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
});

// Mock Journey step card data for testing
const mockJourneyStepData = {
    title: "Define Your Goals",
    description: "Tell us what you want to achieve",
    icon: <div data-testid="goal-icon">Goal Icon</div>,
    delay: 100,
    accentColor: "from-lime-300 to-emerald-400",
    ctaText: "Set Your Goals",
    nextStep: RegistrationStep.EXPERIENCE_LEVEL,
    detailedFeatures: [
        {
            title: "Strength Building",
            description: "Focus on compound movements",
            icon: <div data-testid="strength-icon">Strength Icon</div>
        },
        {
            title: "Fat Loss",
            description: "Optimize caloric deficit",
            icon: <div data-testid="fat-loss-icon">Fat Loss Icon</div>
        }
    ]
};

const mockAnalyticsStepData = {
    title: "Track Your Progress",
    description: "Select tracking features",
    icon: <div data-testid="analytics-icon">Analytics Icon</div>,
    delay: 400,
    accentColor: "from-amber-300 to-orange-400",
    ctaText: "Set Tracking Preferences",
    nextStep: RegistrationStep.PRICING,
    detailedFeatures: [
        {
            title: "Visual Analytics",
            description: "Interactive charts",
            icon: <div data-testid="visual-analytics-icon">Visual Analytics Icon</div>
        },
        {
            title: "Achievement System",
            description: "Unlock badges and achievements",
            icon: <div data-testid="achievements-icon">Achievements Icon</div>
        }
    ]
};

// Props for testing
const mockStepProps = {
    onNext: jest.fn(),
    onBack: jest.fn(),
    data: {} as RegistrationData,
    updateData: jest.fn(),
};

// Render utility for integration testing
const renderIntegrationTest = (initialData = {}) => {
    return render(
        <JourneyProvider initialData={initialData}>
            {/* Render both step cards which will contain our selectors */}
            <JourneyStepCard step={mockJourneyStepData} index={0} currentStep={RegistrationStep.GOALS} {...mockStepProps} />
            <JourneyStepCard step={mockAnalyticsStepData} index={3} currentStep={RegistrationStep.GOALS} {...mockStepProps} />
        </JourneyProvider>
    );
};

// For testing the full journey flow:
const renderJourneySelectorSequence = () => {
    const { rerender } = render(
        <JourneyProvider>
            <div data-testid="journey-container">
                <GoalSelector
                    onValidChange={jest.fn()}
                    onConfirm={jest.fn()}
                />
            </div>
        </JourneyProvider>
    );

    const updateJourneyStep = () => {
        rerender(
            <JourneyProvider>
                <div data-testid="journey-container">
                    <AnalyticsSelector
                        onValidChange={jest.fn()}
                        onConfirm={jest.fn()}
                    />
                </div>
            </JourneyProvider>
        );
    };

    return { updateJourneyStep };
};

describe('Journey Selector Integration', () => {
    beforeEach(() => {
        mockSessionStorage.clear();
        jest.clearAllMocks();
    });

    it('displays both step cards with their respective selectors', async () => {
        renderIntegrationTest();

        // Check for goal step card
        expect(screen.getByText('Define Your Goals')).toBeInTheDocument();

        // Check for analytics step card
        expect(screen.getByText('Track Your Progress')).toBeInTheDocument();
    });

    it('retains data when navigating between selectors', async () => {
        const { updateJourneyStep } = renderJourneySelectorSequence();

        // Select a goal in GoalSelector
        fireEvent.click(screen.getByText('Strength Building'));

        // Move to the AnalyticsSelector
        updateJourneyStep();

        // Select analytics features
        fireEvent.click(screen.getByText('Visual Analytics'));

        // The data should be stored in sessionStorage
        expect(mockSessionStorage.setItem).toHaveBeenCalled();

        // Extract the storage keys that were used
        const storageKeys = mockSessionStorage.setItem.mock.calls.map(call => call[0]);

        // Expect both storage keys to be present
        expect(storageKeys).toContain('fitcopilot_goal_selector');
        expect(storageKeys).toContain('fitcopilot_analytics_selector');
    });

    it('handles selection across both components correctly', () => {
        // First render GoalSelector
        const { rerender } = render(
            <JourneyProvider>
                <GoalSelector
                    onValidChange={jest.fn()}
                    onConfirm={jest.fn()}
                />
            </JourneyProvider>
        );

        // Select goals
        fireEvent.click(screen.getByText('Strength Building'));
        fireEvent.click(screen.getByText('Fat Loss'));

        // Now render AnalyticsSelector
        rerender(
            <JourneyProvider>
                <AnalyticsSelector
                    onValidChange={jest.fn()}
                    onConfirm={jest.fn()}
                />
            </JourneyProvider>
        );

        // Select analytics features
        fireEvent.click(screen.getByText('Visual Analytics'));
        fireEvent.click(screen.getByText('Achievement System'));

        // Verify that both components have stored their data
        const storageKeys = mockSessionStorage.setItem.mock.calls.map(call => call[0]);
        expect(storageKeys).toContain('fitcopilot_goal_selector');
        expect(storageKeys).toContain('fitcopilot_analytics_selector');

        // Go back to GoalSelector to verify data persistence
        rerender(
            <JourneyProvider>
                <GoalSelector
                    onValidChange={jest.fn()}
                    onConfirm={jest.fn()}
                />
            </JourneyProvider>
        );

        // The goals should still be selected
        expect(screen.getByText('2 goals selected')).toBeInTheDocument();
    });

    it('saves all data to JourneyContext', async () => {
        const updateData = jest.fn();

        render(
            <JourneyProvider>
                <GoalSelector
                    onValidChange={jest.fn()}
                    onConfirm={jest.fn()}
                />
            </JourneyProvider>
        );

        // Select goals
        fireEvent.click(screen.getByText('Strength Building'));

        // updateRegistrationData should be called
        await waitFor(() => {
            expect(mockSessionStorage.setItem).toHaveBeenCalled();
        });

        // Check that the data was saved to session storage
        const goalStorageKey = mockSessionStorage.setItem.mock.calls
            .find(call => call[0] === 'fitcopilot_journey_state');

        expect(goalStorageKey).toBeTruthy();
    });
}); 