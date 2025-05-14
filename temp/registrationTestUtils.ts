/**
 * @jest-environment jsdom
 * @jest-ignore
 * This file contains test utilities for Registration tests and is not a test file itself
 */

import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { RegistrationData, RegistrationStep } from '../../types';
import { JourneyProvider } from '../../Journey/components/JourneyContext';

// Mock storage implementation for testing
export const createMockSessionStorage = () => {
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
        getStore: () => ({ ...store }),
    };
};

// Replace session storage with our mock implementation for tests
export const setupMockSessionStorage = () => {
    const mockStorage = createMockSessionStorage();

    Object.defineProperty(window, 'sessionStorage', {
        value: mockStorage,
        writable: true
    });

    return mockStorage;
};

// Create a mock for transition event tracking
export const createMockTransitionEvents = () => {
    return {
        trackStandardTransition: jest.fn(),
        trackMapTransition: jest.fn(),
        trackDirectNavigation: jest.fn(),
        trackBackNavigation: jest.fn(),
        trackOverrideNavigation: jest.fn(),
    };
};

// Create mock analytics events
export const createMockAnalytics = () => {
    return {
        trackCustomEvent: jest.fn(),
        trackStepView: jest.fn(),
        trackTransition: jest.fn(),
    };
};

// Create mock for the transition event manager
export const createMockTransitionEventManager = () => {
    const listeners: Array<(event: any) => void> = [];

    return {
        emitTransition: jest.fn((from, to, type, metadata) => {
            const event = { sourceStep: from, destinationStep: to, transitionType: type, metadata, timestamp: Date.now() };
            listeners.forEach(listener => listener(event));
        }),
        subscribe: jest.fn((listener: (event: any) => void) => {
            listeners.push(listener);
            return jest.fn(() => {
                const index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            });
        }),
        getListeners: () => [...listeners],
    };
};

// Custom renderer that includes the JourneyProvider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    initialData?: RegistrationData;
}

export const renderWithJourneyProvider = (
    ui: React.ReactElement,
    { initialData = {}, ...options }: CustomRenderOptions = {}
): RenderResult => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <JourneyProvider initialData= { initialData } >
        { children }
        </JourneyProvider>
    );

return render(ui, { wrapper: Wrapper, ...options });
};

// Generate step state for a given step in the registration flow
export const createStepState = (step: RegistrationStep) => {
    const baseProps = {
        onNext: jest.fn(),
        onBack: jest.fn(),
        data: {} as RegistrationData,
        updateData: jest.fn(),
    };

    switch (step) {
        case RegistrationStep.EXPERIENCE_LEVEL:
            return {
                ...baseProps,
                experienceLevels: ['beginner', 'intermediate', 'advanced'],
            };
        case RegistrationStep.GOALS:
            return {
                ...baseProps,
                goals: ['strength', 'weight_loss', 'cardio', 'flexibility'],
            };
        case RegistrationStep.EQUIPMENT:
            return {
                ...baseProps,
                equipment: ['none', 'basic', 'full_gym'],
            };
        case RegistrationStep.TIME_COMMITMENT:
            return {
                ...baseProps,
                timeOptions: ['low', 'medium', 'high'],
            };
        case RegistrationStep.PRICING:
            return {
                ...baseProps,
                plans: ['monthly', 'annual', 'lifetime'],
            };
        default:
            return baseProps;
    }
};

// Mock registration data for testing
export const createMockRegistrationData = (overrides: Partial<RegistrationData> = {}): RegistrationData => {
    return {
        experienceLevel: 'intermediate',
        selectedGoals: ['strength', 'weight_loss'],
        selectedEquipment: ['basic'],
        timeCommitment: 'medium',
        selectedPlan: 'monthly',
        completedCustomizationSections: ['goals_completed', 'equipment_completed'],
        ...overrides
    };
};

// Test utility for waiting for storage operations to complete
export const waitForStorageUpdate = async (): Promise<void> => {
    // Wait for the debounce timeout in JourneyProvider
    await new Promise((resolve) => setTimeout(resolve, 400));
}; 