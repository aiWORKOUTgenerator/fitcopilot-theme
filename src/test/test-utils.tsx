/**
 * Test Utilities
 * 
 * Shared utilities for consistent component testing
 */

import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';

// Define the type for provider props
interface ProviderProps {
    [key: string]: any;
}

// Define render options with provider props
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    providerProps?: ProviderProps;
}

/**
 * Custom render function that wraps components with necessary providers
 * 
 * @param ui - The component to render
 * @param options - Render options including provider props
 * @returns The rendered component with testing utilities
 */
export function renderWithProviders(
    ui: ReactElement,
    { providerProps = {}, ...renderOptions }: CustomRenderOptions = {}
) {
    // Create user event instance
    const user = userEvent.setup();

    // Return the rendered component with user event instance added
    return {
        user,
        ...render(ui, {
            // Add a wrapper with providers if needed
            wrapper: ({ children }) => (
                <>
                    {/* Add context providers here as needed */}
                    {children}
                </>
            ),
            ...renderOptions,
        }),
    };
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