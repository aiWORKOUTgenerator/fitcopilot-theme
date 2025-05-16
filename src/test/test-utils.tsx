/**
 * Test Utilities
 * 
 * Shared utilities for consistent component testing
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AnalyticsProvider } from '../context/AnalyticsContext';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../context/ThemeContext';
import { WorkoutProvider } from '../context/WorkoutContext';

// Define the type for provider props
interface ProviderProps {
    [key: string]: any;
}

// Define render options with provider props
interface _CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    providerProps?: ProviderProps;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    route?: string;
    initialState?: any;
    routerProps?: any;
    providerProps?: {
        appContext?: Record<string, unknown>;
        workoutContext?: Record<string, unknown>;
        themeContext?: Record<string, unknown>;
        analyticsContext?: Record<string, unknown>;
    };
}

/**
 * Custom render function that includes common providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: ExtendedRenderOptions = {}
): RenderResult {
  const {
    _route = '/',  // Prefix with underscore to indicate unused variable
    _initialState = {},  // Prefix with underscore to indicate unused variable
    _routerProps = {},  // Prefix with underscore to indicate unused variable
    providerProps = {},
    ...renderOptions
  } = options;

  const { appContext, workoutContext, themeContext, analyticsContext } = providerProps;

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <MemoryRouter initialEntries={[_route]}>
        <AppProvider initialState={appContext}>
          <WorkoutProvider initialState={workoutContext}>
            <ThemeProvider initialState={themeContext}>
              <AnalyticsProvider initialState={analyticsContext}>
                {children}
              </AnalyticsProvider>
            </ThemeProvider>
          </WorkoutProvider>
        </AppProvider>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Custom render function for testing routes
 */
export function renderWithRouter(
  ui: React.ReactElement,
  { route = '/', ...renderOptions }: ExtendedRenderOptions = {}
): RenderResult {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={route} element={ui} />
      </Routes>
    </MemoryRouter>,
    renderOptions
  );
}

/**
 * Factory function to create mock data for common component props
 */
export const createMockProps = {
  // Button mock props
  button: (props = {}) => ({
    onClick: jest.fn(),
    variant: 'primary',
    children: 'Test Button',
    ...props,
  }),

  // Card mock props
  card: (props = {}) => ({
    children: 'Test Card Content',
    elevation: 'default',
    padding: 'default',
    bordered: false,
    interactive: false,
    ...props,
  }),
};

/**
 * Utility to test for proper accessibility attributes
 */
export const accessibilityChecks = {
  // Check for proper button accessibility
  button: (element: HTMLElement) => {
    if (element.hasAttribute('disabled')) {
      expect(element).toHaveAttribute('aria-disabled', 'true');
    }

    if (element.getAttribute('role') === 'button') {
      expect(element).toHaveAttribute('tabIndex', expect.any(String));
    }
  },

  // Check for proper interactive element accessibility
  interactive: (element: HTMLElement) => {
    if (element.getAttribute('role') === 'button') {
      expect(element).toHaveAttribute('tabIndex', expect.any(String));
    }
  },
}; 