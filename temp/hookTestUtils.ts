/**
 * @jest-environment jsdom
 * @jest-ignore
 * This file contains utilities for testing hooks in the Registration flow
 */

import { renderHook, RenderHookOptions, RenderHookResult } from '@testing-library/react';
import React from 'react';
import { RegistrationData, RegistrationStep } from '../../types';

// Create a simple wrapper provider for context-dependent hooks
export function createContextWrapper<T>(
    ContextProvider: React.FC<T & { children: React.ReactNode }>,
    providerProps: T
) {
    return ({ children }: { children: React.ReactNode }) => (
        <ContextProvider { ...providerProps } > { children } </ContextProvider>
    );
}

// Render a hook with mocked session storage
export function renderHookWithStorage<TProps, TResult>(
    hook: (props: TProps) => TResult,
    options?: RenderHookOptions<TProps>
): RenderHookResult<TProps, TResult> {
    // Create a mock storage implementation for the test
    const mockStorage: Record<string, string> = {};

    // Mock sessionStorage methods
    const sessionStorageMock = {
        getItem: jest.fn((key: string) => mockStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            mockStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete mockStorage[key];
        }),
        clear: jest.fn(() => {
            Object.keys(mockStorage).forEach(key => {
                delete mockStorage[key];
            });
        }),
        key: jest.fn((index: number) => Object.keys(mockStorage)[index] || null),
        length: Object.keys(mockStorage).length
    };

    // Mock window.sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
        value: sessionStorageMock,
        writable: true
    });

    return renderHook(hook, options);
}

// Helper function for registration progress hook testing
export function setupRegistrationProgressTest(initialStep: RegistrationStep = RegistrationStep.SPLASH) {
    // Create event tracking mocks
    const eventTrackingMocks = {
        trackStandardTransition: jest.fn(),
        trackMapTransition: jest.fn(),
        trackDirectNavigation: jest.fn(),
        trackBackNavigation: jest.fn(),
        trackOverrideNavigation: jest.fn(),
    };

    // Mock the session storage
    const mockSessionStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0
    };

    Object.defineProperty(window, 'sessionStorage', {
        value: mockSessionStorage,
        writable: true
    });

    return {
        eventTrackingMocks,
        mockSessionStorage,
        initialStep
    };
}

// Helper for testing hook state transitions
export interface StepTransitionTest {
    description: string;
    fromStep: RegistrationStep;
    action: 'next' | 'previous' | 'goTo';
    targetStep?: RegistrationStep; // For goTo action
    expectedStep: RegistrationStep;
    expectedTracking: keyof typeof trackingFunctions;
}

// Types for test expectations
type TrackingFunction = 'trackStandardTransition' | 'trackMapTransition' | 'trackDirectNavigation' | 'trackBackNavigation' | 'trackOverrideNavigation';

export const trackingFunctions = {
    standard: 'trackStandardTransition' as TrackingFunction,
    map: 'trackMapTransition' as TrackingFunction,
    direct: 'trackDirectNavigation' as TrackingFunction,
    back: 'trackBackNavigation' as TrackingFunction,
    override: 'trackOverrideNavigation' as TrackingFunction
}; 