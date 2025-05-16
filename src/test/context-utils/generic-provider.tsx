/**
 * Generic Context Provider Testing Utilities
 * 
 * This file provides utilities for creating type-safe test context providers
 * for any context type.
 */
import React, { createContext, FC, useContext } from 'react';
import { BaseTestProviderProps } from '../../types/context-test';
import { createMockContext } from './testing-library';

/**
 * Creates a mock context provider for testing
 * 
 * @param Context - The actual context to mock
 * @param defaultValue - The default context value
 * @returns A test provider component and related utilities
 */
export function createMockContextProvider<T extends Record<string, unknown>>(
    Context: React.Context<T>,
    defaultValue: T
) {
    // Create a test provider component
    const MockProvider: FC<BaseTestProviderProps & { value?: Partial<T> }> = ({
        children,
        value = {}
    }) => {
        const contextValue = createMockContext({
            defaultValue,
            overrides: value
        });

        return (
            <Context.Provider value={contextValue}>
                {children}
            </Context.Provider>
        );
    };

    MockProvider.displayName = `Mock${Context.displayName || 'Context'}Provider`;

    // Create a hook to access the context in tests
    const useMockContext = () => useContext(Context);

    // Create a helper to reset all mock functions
    const resetMocks = (mockContextValue: T) => {
        Object.values(mockContextValue).forEach(value => {
            if (typeof value === 'function' && 'mockReset' in value) {
                (value as jest.Mock).mockReset();
            }
        });
    };

    return {
        MockProvider,
        useMockContext,
        resetMocks
    };
}

/**
 * Creates a mock context and provider from scratch for testing
 * 
 * @param name - Name for the context (for debugging)
 * @param defaultValue - The default context value
 * @returns A test context, provider, and related utilities
 */
export function createTestContext<T extends Record<string, unknown>>(
    name: string,
    defaultValue: T
) {
    // Create a new context
    const TestContext = createContext<T>(defaultValue);
    TestContext.displayName = `${name}Context`;

    // Create a provider
    const { MockProvider, useMockContext, resetMocks } = createMockContextProvider(
        TestContext,
        defaultValue
    );

    return {
        TestContext,
        TestProvider: MockProvider,
        useTestContext: useMockContext,
        resetMocks
    };
}

/**
 * Type-safe test provider creator with configuration
 */
export interface TestProviderFactory<T, Config = unknown> {
    Provider: FC<BaseTestProviderProps & { value?: Partial<T>; config?: Config }>;
    useValue: () => T;
    getDefaultValue: (config?: Config) => T;
    createValue: (overrides?: Partial<T>, config?: Config) => T;
}

/**
 * Creates a configurable test provider factory
 * 
 * @param name - Provider name for debugging
 * @param createDefaultValue - Function to create the default value, possibly based on config
 * @returns A provider factory with configuration support
 */
export function createTestProviderFactory<T extends Record<string, unknown>, Config = unknown>(
    name: string,
    createDefaultValue: (config?: Config) => T
): TestProviderFactory<T, Config> {
    // Create context
    const TestContext = createContext<T>({} as T);
    TestContext.displayName = `${name}Context`;

    // Provider component
    const Provider: FC<BaseTestProviderProps & { value?: Partial<T>; config?: Config }> = ({
        children,
        value = {},
        config
    }) => {
        const defaultValue = createDefaultValue(config);
        const contextValue = createMockContext({
            defaultValue,
            overrides: value
        });

        return (
            <TestContext.Provider value={contextValue}>
                {children}
            </TestContext.Provider>
        );
    };

    Provider.displayName = `${name}Provider`;

    // Hook to access the context
    const useValue = () => useContext(TestContext);

    // Helper to create a context value with overrides
    const createValue = (overrides: Partial<T> = {}, config?: Config): T => {
        const defaultValue = createDefaultValue(config);
        return {
            ...defaultValue,
            ...overrides
        };
    };

    return {
        Provider,
        useValue,
        getDefaultValue: createDefaultValue,
        createValue
    };
} 