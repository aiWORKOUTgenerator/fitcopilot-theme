import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  CustomRenderOptions,
  TestProviderOptions,
  TestRenderResult
} from '../../types/test';
import { createTestProviders } from './providers';

/**
 * Custom render function with all providers
 * Use this as the default renderer for component testing
 * 
 * @template T HTML element type of the container
 * @param ui React element to render
 * @param options Custom render options including provider props
 * @returns Enhanced render result with additional testing helpers
 */
export function renderWithProviders<T = HTMLElement>(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): TestRenderResult<T> {
  const {
    providerProps = {},
    _route,
    _initialState,
    _routerProps,
    ...renderOptions
  } = options;

  // Create wrapper with all providers
  const Wrapper = createTestProviders(providerProps as TestProviderOptions);

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
  } as TestRenderResult<T>;
}

/**
 * Helper to create a custom render function with specific provider props
 * Useful when multiple tests need the same provider setup
 * 
 * @template T HTML element type of the container
 * @param defaultProviderProps Default provider props to use
 * @returns Render function with preconfigured provider props
 */
export function createRenderWithProviders(defaultProviderProps: TestProviderOptions = {}) {
  return <T = HTMLElement>(ui: React.ReactElement, options: CustomRenderOptions = {}) => {
    return renderWithProviders<T>(ui, {
      ...options,
      providerProps: {
        ...defaultProviderProps,
        ...options.providerProps,
      } as TestProviderOptions,
    });
  };
}

/**
 * Props for the hook wrapper component 
 */
interface HookWrapperProps<Result, Props> {
    hook: (props: Props) => Result;
    initialProps: Props;
    onChange: (result: Result) => void;
}

/**
 * Helper component to render hooks
 */
function HookWrapper<Result, Props>({
  hook,
  initialProps,
  onChange,
}: HookWrapperProps<Result, Props>) {
  const result = hook(initialProps);

  React.useEffect(() => {
    onChange(result);
  }, [onChange, result]);

  return null;
}

/**
 * Renders a hook with all providers
 * 
 * @template Result The return type of the hook
 * @template Props The props type of the hook
 * @param hook The hook to render
 * @param options Render options including provider props and initial hook props
 * @returns Object with the hook result and a rerender function
 */
export function renderHook<Result, Props>(
  hook: (props: Props) => Result,
  options: CustomRenderOptions & { initialProps: Props } = { initialProps: {} as Props }
) {
  const { initialProps, ...renderOptions } = options;
  const result = { current: {} as Result };

  // Use renderWithProviders to render a component that calls the hook
  const { rerender } = renderWithProviders(
    <HookWrapper
      hook={hook}
      initialProps={initialProps}
      onChange={(r: Result) => { result.current = r; }}
    />,
    renderOptions
  );

  return {
    result,
    rerender: (newProps: Props) => {
      rerender(
        <HookWrapper
          hook={hook}
          initialProps={newProps}
          onChange={(r: Result) => { result.current = r; }}
        />
      );
    },
  };
}

/**
 * Re-export everything from RTL for convenience
 */
export * from '@testing-library/react';
export { renderWithProviders as render };

