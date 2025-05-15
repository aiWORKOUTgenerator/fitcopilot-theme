/**
 * Context Testing Utilities
 * 
 * This file provides reusable utilities for testing React context providers.
 */
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { renderHook, RenderHookOptions, RenderHookResult } from '@testing-library/react-hooks';
import React, { ReactElement, ReactNode } from 'react';

/**
 * Creates a wrapper function for testing a context provider
 * 
 * @param Provider - The context provider component
 * @param providerProps - Props to pass to the provider
 * @returns A wrapper function for use with testing-library render functions
 */
export function createProviderWrapper<T>(
    Provider: React.ComponentType<{ children?: ReactNode } & T>,
    providerProps: T
) {
    const ProviderWrapper = ({ children }: { children?: ReactNode }) => (
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
export function createNestedProviders(
    providers: Array<{
        Provider: React.ComponentType<any>;
        props: Record<string, any>;
    }>
) {
    const NestedProviders = ({ children }: { children?: ReactNode }) => (
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
    Provider: React.ComponentType<{ children?: ReactNode } & P>,
    providerProps: P,
    options?: Omit<RenderOptions, 'wrapper'>
): RenderResult & { providerProps: P } {
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
    Provider: React.ComponentType<{ children?: ReactNode } & P>,
    providerProps: P,
    options?: Omit<RenderHookOptions<Props>, 'wrapper'>
): RenderHookResult<Props, Result> & { providerProps: P } {
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
export function createMockContextValue<T extends Record<string, any>>(
    defaultValue: T,
    overrides: Partial<T> = {}
): T {
    // Create jest mock functions for all function properties
    const mockedFunctions = Object.entries(defaultValue).reduce((acc, [key, value]) => {
        if (typeof value === 'function') {
            acc[key] = jest.fn();
        }
        return acc;
    }, {} as Record<string, jest.Mock>);

    // Combine default values, mocked functions, and overrides
    return {
        ...defaultValue,
        ...mockedFunctions,
        ...overrides,
    };
} 