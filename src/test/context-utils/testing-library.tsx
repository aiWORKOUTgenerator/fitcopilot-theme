/**
 * Context Testing Utilities
 * 
 * This file provides reusable utilities for testing React context providers.
 */
import { render, RenderOptions } from '@testing-library/react';
import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';
import React, { ReactElement, ReactNode } from 'react';
import {
    BaseTestProviderProps,
    ContextProvider,
    MockContextValueOptions,
    MockFunctionMapping,
    ProviderConfig,
    ProviderRenderHookResult,
    ProviderRenderResult
} from '../../types/context-test';

/**
 * Type for a context provider component with children and additional props
 */
export type ProviderComponent<T = unknown> = React.ComponentType<{ children?: ReactNode } & T>;

/**
 * Type for a provider descriptor to be used in nested providers
 */
export interface ProviderDescriptor<T = unknown> {
    Provider: ProviderComponent<T>;
    props: T;
}

/**
 * Creates a wrapper function for testing a context provider
 * 
 * @param Provider - The context provider component
 * @param providerProps - Props to pass to the provider
 * @returns A wrapper function for use with testing-library render functions
 */
export function createProviderWrapper<T>(
    Provider: ContextProvider<T>,
    providerProps: T
) {
    const ProviderWrapper = ({ children }: BaseTestProviderProps) => (
        <Provider {...providerProps}>{children}</Provider>
    );

    ProviderWrapper.displayName = `${Provider.displayName || Provider.name}Wrapper`;

    return ProviderWrapper;
}

/**
 * Creates a wrapper for nested providers
 * 
 * @param providers - Array of provider components with their props
 * @returns A wrapper function for use with testing-library render functions
 */
export function createNestedProviders<T extends ProviderConfig[]>(
    providers: T
) {
    const NestedProviders = ({ children }: BaseTestProviderProps) => (
        <>
            {providers.reduce(
                (acc, { Provider, props }) => (
                    <Provider {...props}>{acc}</Provider>
                ),
                children
            )}
        </>
    );

    NestedProviders.displayName = 'NestedProviders';

    return NestedProviders;
}

/**
 * Renders a component with a context provider
 * 
 * @param ui - The component to render
 * @param Provider - The context provider component
 * @param providerProps - Props to pass to the provider
 * @param options - Additional render options
 * @returns The render result and provider props
 */
export function renderWithProvider<P>(
    ui: ReactElement,
    Provider: ContextProvider<P>,
    providerProps: P,
    options?: Omit<RenderOptions, 'wrapper'>
): ProviderRenderResult<P> {
    return {
        ...render(ui, {
            wrapper: createProviderWrapper(Provider, providerProps),
            ...options,
        }),
        providerProps,
    };
}

/**
 * Renders a hook with a context provider
 * 
 * @param hook - The hook to test
 * @param Provider - The context provider component
 * @param providerProps - Props to pass to the provider
 * @param options - Additional render options
 * @returns The render hook result
 */
export function renderHookWithProvider<Result, Props, P>(
    hook: (props: Props) => Result,
    Provider: ContextProvider<P>,
    providerProps: P,
    options?: Omit<RenderHookOptions<Props>, 'wrapper'>
): ProviderRenderHookResult<P, Result, Props> {
    return {
        ...renderHook(hook, {
            wrapper: createProviderWrapper(Provider, providerProps),
            ...options,
        }),
        providerProps,
    };
}

/**
 * Creates mock props for a context provider based on its default value
 * 
 * @param defaultValue - The default context value
 * @param overrides - Optional overrides for specific properties
 * @returns Mocked context value
 */
export function createMockContextValue<T extends Record<string, unknown>>(
    defaultValue: T,
    overrides: Partial<T> = {}
): T {
    // Create jest mock functions for all function properties
    const mockedFunctions = Object.entries(defaultValue).reduce<MockFunctionMapping<T>>((acc, [key, value]) => {
        if (typeof value === 'function') {
            acc[key as keyof T] = jest.fn() as any;
        }
        return acc;
    }, {});

    // Combine default values, mocked functions, and overrides
    return {
        ...defaultValue,
        ...mockedFunctions as Partial<T>,
        ...overrides,
    };
}

/**
 * Enhanced version of createMockContextValue with more control
 * 
 * @param options - Configuration options for creating mock context value
 * @returns Mocked context value
 */
export function createMockContext<T extends Record<string, unknown>>(
    options: MockContextValueOptions<T>
): T {
    const { defaultValue, overrides = {}, mockFunctions = [] } = options;

    // Create mock functions for specified keys
    const mockedFunctions = mockFunctions.reduce<MockFunctionMapping<T>>((acc, key) => {
        if (typeof defaultValue[key] === 'function') {
            acc[key] = jest.fn() as any;
        }
        return acc;
    }, {});

    // Create automatic mock functions for any remaining function properties
    const autoMockedFunctions = Object.entries(defaultValue).reduce<MockFunctionMapping<T>>((acc, [key, value]) => {
        const k = key as keyof T;
        if (typeof value === 'function' && !mockFunctions.includes(k) && !overrides[k]) {
            acc[k] = jest.fn() as any;
        }
        return acc;
    }, {});

    // Combine everything with the correct precedence
    return {
        ...defaultValue,
        ...autoMockedFunctions as Partial<T>,
        ...mockedFunctions as Partial<T>,
        ...overrides,
    };
} 