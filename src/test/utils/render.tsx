import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { createTestProviders, TestProviderOptions } from './providers';

/**
 * Extended render options for our custom render
 */
interface CustomRenderOptions extends RenderOptions {
    providerProps?: TestProviderOptions;
    route?: string;
    initialState?: Record<string, any>;
    routerProps?: Record<string, any>;
}

/**
 * Custom render function with all providers
 * Use this as the default renderer for component testing
 */
export function renderWithProviders(
    ui: React.ReactElement,
    options: CustomRenderOptions = {}
) {
    const {
        providerProps = {},
        route,
        initialState,
        routerProps,
        ...renderOptions
    } = options;

    // Create wrapper with all providers
    const Wrapper = createTestProviders(providerProps);

    // Return render result with additional testing helpers
    const utils = render(ui, {
        wrapper: Wrapper,
        ...renderOptions,
    });

    return {
        ...utils,
        // Provide userEvent instance for better event testing
        user: userEvent.setup(),

        // Add helpful rerender function that preserves the wrapper
        rerender: (newUi: React.ReactElement) =>
            renderWithProviders(newUi, options),

        // Helper for waiting for element to appear/disappear
        waitForElementChange: async (callback: () => Promise<void> | void) => {
            await callback();
            return utils;
        },
    };
}

/**
 * Helper to create a custom render function with specific provider props
 * Useful when multiple tests need the same provider setup
 */
export function createRenderWithProviders(defaultProviderProps: TestProviderOptions = {}) {
    return (ui: React.ReactElement, options: CustomRenderOptions = {}) => {
        return renderWithProviders(ui, {
            ...options,
            providerProps: {
                ...defaultProviderProps,
                ...options.providerProps,
            },
        });
    };
}

/**
 * Renders a hook with all providers
 * @param hook The hook to render
 * @param options Render options including provider props
 * @returns The rendered hook result
 */
export function renderHook<Result, Props>(
    hook: (props: Props) => Result,
    options: CustomRenderOptions & { initialProps?: Props } = {}
) {
    const { initialProps, ...renderOptions } = options;
    let result: { current: Result };

    // Use renderWithProviders to render a component that calls the hook
    const { rerender } = renderWithProviders(
        <HookWrapper hook={hook} initialProps={initialProps as Props}
            onChange={r => { result = { current: r }; }} />,
        renderOptions
    );

    return {
        result,
        rerender: (newProps: Props) => {
            rerender(
                <HookWrapper hook={hook} initialProps={newProps}
                    onChange={r => { result = { current: r }; }} />
            );
        },
    };
}

// Helper component to render hooks
function HookWrapper<Result, Props>({
    hook,
    initialProps,
    onChange,
}: {
    hook: (props: Props) => Result;
    initialProps?: Props;
    onChange: (result: Result) => void;
}) {
    const result = hook(initialProps as Props);

    React.useEffect(() => {
        onChange(result);
    }, [onChange, result]);

    return null;
}

/**
 * Re-export everything from RTL for convenience
 */
export * from '@testing-library/react';
export { renderWithProviders as render };
