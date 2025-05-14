/* eslint-disable */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RegistrationStep } from '../../types';
import JourneyStepCard, { JourneyStepFeature } from '../components/JourneyStepCard';

// Simple mock storage
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

// Setup the mock BEFORE importing components
Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true,
});

// Define mock features
const mockFeatures: JourneyStepFeature[] = [
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
];

const mockAnalyticsFeatures: JourneyStepFeature[] = [
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
];

// Mock Journey step card data
const mockJourneyStepData = {
    title: "Define Your Goals",
    description: "Tell us what you want to achieve",
    icon: <div data-testid="goal-icon">Goal Icon</div>,
    delay: 100,
    accentColor: "from-lime-300 to-emerald-400",
    ctaText: "Set Your Goals",
    nextStep: RegistrationStep.EXPERIENCE_LEVEL,
    detailedFeatures: mockFeatures
};

const mockAnalyticsStepData = {
    title: "Track Your Progress",
    description: "Select tracking features",
    icon: <div data-testid="analytics-icon">Analytics Icon</div>,
    delay: 400,
    accentColor: "from-amber-300 to-orange-400",
    ctaText: "Set Tracking Preferences",
    nextStep: RegistrationStep.PRICING,
    detailedFeatures: mockAnalyticsFeatures
};

// Mock the JourneyContext to prevent external dependencies
jest.mock('../components/JourneyContext', () => {
    const originalModule = jest.requireActual('../components/JourneyContext');

    return {
        ...originalModule,
        useJourney: () => ({
            registrationData: {},
            updateRegistrationData: jest.fn(),
            expandedStep: 0,
            toggleStep: jest.fn(),
            completedSteps: [],
        }),
        JourneyProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
    };
});

// Set a short timeout for each test
jest.setTimeout(5000);

describe('Journey Selector Integration', () => {
    // Run just one test for now
    it('displays goal and analytics titles', () => {
        // Basic render with simplified approach
        render(
            <>
                <JourneyStepCard
                    step={mockJourneyStepData}
                    index={0}
                    onStepAction={jest.fn()}
                />
                <JourneyStepCard
                    step={mockAnalyticsStepData}
                    index={3}
                    onStepAction={jest.fn()}
                />
            </>
        );

        // Use queryAllByText to handle multiple matches and test each one
        const titleElements = screen.queryAllByText('Define Your Goals');
        expect(titleElements.length).toBeGreaterThan(0);

        const analyticsElements = screen.queryAllByText('Track Your Progress');
        expect(analyticsElements.length).toBeGreaterThan(0);
    });
}); 