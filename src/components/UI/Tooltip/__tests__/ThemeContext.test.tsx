import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { Tooltip, TooltipThemeProvider } from '../';

// Mock the lazy loaded components
jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        lazy: (factory) => {
            const Component = factory();
            Component.then = (resolve) => resolve(Component);
            return Component;
        },
    };
});

describe('Tooltip Theme Context System', () => {
    test('applies theme from TooltipThemeProvider to child tooltips', async () => {
        render(
            <TooltipThemeProvider theme="hero">
                <div data-testid="hero-section">
                    <Tooltip content="Hero tooltip" isVisible={true}>
                        <button>Hover me</button>
                    </Tooltip>
                </div>
            </TooltipThemeProvider>
        );

        const tooltipWrapper = screen.getByTestId('hero-section').querySelector('.tooltip-wrapper');
        expect(tooltipWrapper).toHaveClass('tooltip-theme-hero');
    });

    test('allows individual tooltips to override the section theme', async () => {
        render(
            <TooltipThemeProvider theme="hero">
                <div data-testid="hero-section">
                    <Tooltip content="Pricing tooltip" themeContext="pricing" isVisible={true}>
                        <button>Hover me</button>
                    </Tooltip>
                </div>
            </TooltipThemeProvider>
        );

        const tooltipWrapper = screen.getByTestId('hero-section').querySelector('.tooltip-wrapper');
        expect(tooltipWrapper).toHaveClass('tooltip-theme-pricing');
        expect(tooltipWrapper).not.toHaveClass('tooltip-theme-hero');
    });

    test('nests theme providers correctly', async () => {
        render(
            <TooltipThemeProvider theme="hero">
                <div data-testid="hero-section">
                    <Tooltip content="Hero tooltip" isVisible={true}>
                        <button>Hero Tooltip</button>
                    </Tooltip>

                    <TooltipThemeProvider theme="pricing">
                        <div data-testid="pricing-section">
                            <Tooltip content="Pricing tooltip" isVisible={true}>
                                <button>Pricing Tooltip</button>
                            </Tooltip>
                        </div>
                    </TooltipThemeProvider>
                </div>
            </TooltipThemeProvider>
        );

        const heroTooltipWrapper = screen.getByText('Hero Tooltip').closest('.tooltip-wrapper');
        const pricingTooltipWrapper = screen.getByText('Pricing Tooltip').closest('.tooltip-wrapper');

        expect(heroTooltipWrapper).toHaveClass('tooltip-theme-hero');
        expect(pricingTooltipWrapper).toHaveClass('tooltip-theme-pricing');
    });

    test('falls back to default theme without provider', async () => {
        render(
            <div data-testid="no-theme-section">
                <Tooltip content="Default tooltip" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            </div>
        );

        await waitFor(() => {
            const tooltipContent = screen.getByRole('tooltip');
            expect(tooltipContent).toBeInTheDocument();
        });

        // Should not have hero or pricing specific classes
        const tooltipWrapper = screen.getByTestId('no-theme-section').querySelector('.tooltip-wrapper');
        expect(tooltipWrapper).not.toHaveClass('tooltip-theme-hero');
        expect(tooltipWrapper).not.toHaveClass('tooltip-theme-pricing');
    });

    test('has no accessibility violations', async () => {
        const { container } = render(
            <TooltipThemeProvider theme="pricing">
                <div>
                    <Tooltip content="Accessible tooltip" isVisible={true}>
                        <button>Hover me</button>
                    </Tooltip>
                </div>
            </TooltipThemeProvider>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
}); 