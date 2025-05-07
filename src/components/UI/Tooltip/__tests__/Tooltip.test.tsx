import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { Tooltip } from '../';

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

describe('Tooltip Component Suite', () => {
    describe('Main Tooltip Component', () => {
        test('renders children correctly', () => {
            render(
                <Tooltip content="Tooltip content">
                    <button>Hover me</button>
                </Tooltip>
            );

            expect(screen.getByText('Hover me')).toBeInTheDocument();
        });

        test('renders with default theme context', () => {
            render(
                <Tooltip content="Tooltip content">
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipTrigger = screen.getByText('Hover me').closest('.tooltip-trigger');
            expect(tooltipTrigger).toBeInTheDocument();
        });

        test('renders with hero theme context', async () => {
            render(
                <Tooltip content="Tooltip content" themeContext="hero">
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipTrigger = screen.getByText('Hover me').closest('.tooltip-trigger');
            expect(tooltipTrigger).toBeInTheDocument();
        });

        test('renders with pricing theme context', async () => {
            render(
                <Tooltip content="Tooltip content" themeContext="pricing">
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipTrigger = screen.getByText('Hover me').closest('.tooltip-trigger');
            expect(tooltipTrigger).toBeInTheDocument();
        });
    });

    describe('Uncontrolled Behavior', () => {
        test('shows tooltip on hover', async () => {
            render(
                <Tooltip content="Tooltip content">
                    <button>Hover me</button>
                </Tooltip>
            );

            const trigger = screen.getByText('Hover me').closest('.tooltip-trigger');

            // Tooltip should initially be hidden
            const tooltipElement = screen.getByRole('tooltip', { hidden: true });
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');

            // Hover over the trigger
            fireEvent.mouseEnter(trigger!);

            // Tooltip should now be visible
            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'false');
            });

            // Mouse out should hide tooltip
            fireEvent.mouseLeave(trigger!);

            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');
            });
        });

        test('shows tooltip on focus', async () => {
            render(
                <Tooltip content="Tooltip content">
                    <button>Focus me</button>
                </Tooltip>
            );

            const trigger = screen.getByText('Focus me').closest('.tooltip-trigger');

            // Tooltip should initially be hidden
            const tooltipElement = screen.getByRole('tooltip', { hidden: true });
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');

            // Focus the trigger
            fireEvent.focus(trigger!);

            // Tooltip should now be visible
            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'false');
            });

            // Blur should hide tooltip
            fireEvent.blur(trigger!);

            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');
            });
        });

        test('respects initialVisible prop', () => {
            render(
                <Tooltip content="Tooltip content" initialVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipElement = screen.getByRole('tooltip');
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'false');
        });

        test('respects showOnHover prop', async () => {
            render(
                <Tooltip content="Tooltip content" showOnHover={false}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const trigger = screen.getByText('Hover me').closest('.tooltip-trigger');

            // Tooltip should initially be hidden
            const tooltipElement = screen.getByRole('tooltip', { hidden: true });
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');

            // Hover over the trigger
            fireEvent.mouseEnter(trigger!);

            // Tooltip should still be hidden
            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');
            });
        });

        test('respects showOnFocus prop', async () => {
            render(
                <Tooltip content="Tooltip content" showOnFocus={false}>
                    <button>Focus me</button>
                </Tooltip>
            );

            const trigger = screen.getByText('Focus me').closest('.tooltip-trigger');

            // Tooltip should initially be hidden
            const tooltipElement = screen.getByRole('tooltip', { hidden: true });
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');

            // Focus the trigger
            fireEvent.focus(trigger!);

            // Tooltip should still be hidden
            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });

    describe('Controlled Behavior', () => {
        test('honors isVisible prop for controlled visibility', async () => {
            const { rerender } = render(
                <Tooltip content="Tooltip content" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            // Tooltip should be visible
            const tooltipElement = screen.getByRole('tooltip');
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'false');

            // Change isVisible to false
            rerender(
                <Tooltip content="Tooltip content" isVisible={false}>
                    <button>Hover me</button>
                </Tooltip>
            );

            // Tooltip should now be hidden
            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');
            });
        });

        test('ignores hover events in controlled mode', async () => {
            render(
                <Tooltip content="Tooltip content" isVisible={false}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const trigger = screen.getByText('Hover me').closest('.tooltip-trigger');

            // Tooltip should initially be hidden
            const tooltipElement = screen.getByRole('tooltip', { hidden: true });
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');

            // Hover over the trigger
            fireEvent.mouseEnter(trigger!);

            // Tooltip should still be hidden (controlled mode)
            await waitFor(() => {
                expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });

    describe('Prop Handling', () => {
        test('renders with title and icon', () => {
            render(
                <Tooltip
                    content="Tooltip content"
                    title="Tooltip Title"
                    icon={<span data-testid="tooltip-icon">🔍</span>}
                    isVisible={true}
                >
                    <button>Hover me</button>
                </Tooltip>
            );

            expect(screen.getByText('Tooltip Title')).toBeInTheDocument();
            expect(screen.getByTestId('tooltip-icon')).toBeInTheDocument();
        });

        test('respects position prop', () => {
            const { rerender } = render(
                <Tooltip content="Tooltip content" position="top" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            let tooltipContent = screen.getByRole('tooltip');
            expect(tooltipContent.classList.toString()).toContain('tooltip-top');

            rerender(
                <Tooltip content="Tooltip content" position="bottom" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            tooltipContent = screen.getByRole('tooltip');
            expect(tooltipContent.classList.toString()).toContain('tooltip-bottom');
        });

        test('applies custom width', () => {
            render(
                <Tooltip content="Tooltip content" width="300px" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipElement = screen.getByRole('tooltip');
            expect(tooltipElement).toHaveStyle('width: 300px');
        });

        test('applies custom accent color', () => {
            render(
                <Tooltip content="Tooltip content" accentColor="rgba(255, 0, 0, 0.5)" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipElement = screen.getByRole('tooltip');
            expect(tooltipElement).toHaveStyle('--accent-color: rgba(255, 0, 0, 0.5)');
        });

        test('applies additional className', () => {
            render(
                <Tooltip content="Tooltip content" className="custom-class" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipElement = screen.getByRole('tooltip');
            expect(tooltipElement.classList.toString()).toContain('custom-class');
        });

        test('adds id attribute for accessibility', () => {
            render(
                <Tooltip content="Tooltip content" id="test-tooltip" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipElement = screen.getByRole('tooltip');
            expect(tooltipElement).toHaveAttribute('id', 'test-tooltip');
        });
    });

    describe('Accessibility', () => {
        test('has no accessibility violations', async () => {
            const { container } = render(
                <Tooltip content="Tooltip content" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        test('uses proper ARIA attributes', () => {
            render(
                <Tooltip content="Tooltip content" isVisible={true}>
                    <button>Hover me</button>
                </Tooltip>
            );

            const tooltipElement = screen.getByRole('tooltip');
            expect(tooltipElement).toHaveAttribute('aria-hidden', 'false');
        });
    });
}); 