/**
 * Nested Context Providers Testing Utilities
 * 
 * This file provides utilities for testing components that need multiple context providers.
 */
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { FC, ReactNode } from 'react';
import { UserInfo } from '../../context/AppContext';
import { JourneyProvider } from '../../features/Registration/Journey/components/JourneyContext';
import { RegistrationData } from '../../features/Registration/types';
import { MockAppProvider } from './user-context';
import { MockWorkoutProvider, Workout } from './workout-context';

// Props for the combined test provider
interface TestProvidersProps {
    // User context props
    initialUser?: UserInfo;

    // Workout context props
    initialWorkouts?: Workout[];
    initialSelectedWorkout?: Workout | null;
    workoutLoading?: boolean;
    workoutError?: string | null;
    shouldFailWorkoutLoad?: boolean;
    shouldFailWorkoutSave?: boolean;
    shouldFailWorkoutDelete?: boolean;

    // Journey context props
    initialJourneyData?: RegistrationData;

    // React children
    children: ReactNode;
}

/**
 * Combined provider component that wraps the children in all the necessary contexts
 * in the correct nesting order
 */
export const TestProviders: FC<TestProvidersProps> = ({
    // User context defaults
    initialUser,

    // Workout context defaults
    initialWorkouts = [],
    initialSelectedWorkout = null,
    workoutLoading = false,
    workoutError = null,
    shouldFailWorkoutLoad = false,
    shouldFailWorkoutSave = false,
    shouldFailWorkoutDelete = false,

    // Journey context defaults
    initialJourneyData = {},

    // Children
    children
}) => {
    // Wrap the providers in the correct order (outer to inner)
    return (
        <MockAppProvider initialUser={initialUser}>
            <MockWorkoutProvider
                initialWorkouts={initialWorkouts}
                initialSelected={initialSelectedWorkout}
                initialLoading={workoutLoading}
                initialError={workoutError}
                shouldFailOnLoad={shouldFailWorkoutLoad}
                shouldFailOnSave={shouldFailWorkoutSave}
                shouldFailOnDelete={shouldFailWorkoutDelete}
            >
                <JourneyProvider initialData={initialJourneyData}>
                    {children}
                </JourneyProvider>
            </MockWorkoutProvider>
        </MockAppProvider>
    );
};

/**
 * Custom render function that wraps the component in all necessary providers
 */
export function renderWithAllProviders(
    ui: React.ReactElement,
    providerProps: Omit<TestProvidersProps, 'children'> = {},
    renderOptions: Omit<RenderOptions, 'wrapper'> = {}
): RenderResult {
    return render(ui, {
        wrapper: ({ children }) => (
            <TestProviders {...providerProps}>{children}</TestProviders>
        ),
        ...renderOptions,
    });
}

/**
 * Creates a wrapper function for use with renderHook
 */
export function createTestProvidersWrapper(providerProps: Omit<TestProvidersProps, 'children'> = {}) {
    const TestProviderWrapper = ({ children }: { children?: ReactNode }) => (
        <TestProviders {...providerProps}>{children}</TestProviders>
    );

    TestProviderWrapper.displayName = 'TestProviderWrapper';

    return TestProviderWrapper;
} 