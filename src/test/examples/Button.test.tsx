import React from 'react';
import { render, screen, waitFor } from '../utils';
import { mockAnalyticsService } from '../utils/mocks/services';

// This is a placeholder - in a real scenario, you would import the actual Button component
const Button = ({
    onClick,
    children,
    disabled = false,
    variant = 'primary',
    trackingId,
}: {
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    trackingId?: string;
}) => {
    // Placeholder for analytics hook
    const analytics = {
        trackEvent: jest.fn(),
    };

    const handleClick = () => {
        if (trackingId) {
            analytics.trackEvent('button_click', { id: trackingId });
        }
        onClick?.();
    };

    return (
        <button
            data-testid="button"
            onClick={handleClick}
            disabled={disabled}
            className={`button button-${variant}`}
            aria-disabled={disabled}
        >
            {children}
        </button>
    );
};

describe('Button Component', () => {
    // Example of a setup function using our utilities
    const setup = (props = {}) => {
        const analyticsService = mockAnalyticsService();

        // Using our custom render with providers
        const utils = render(<Button {...props} />, {
            providerProps: {
                // This would pass the mock service to a provider in a real implementation
                analyticsContext: {
                    trackEvent: analyticsService.trackEvent,
                },
            },
        });

        return {
            ...utils,
            analyticsService,
            button: screen.getByRole('button'),
        };
    };

    it('renders correctly with default props', () => {
        const { button } = setup({ children: 'Click me' });

        // Using role-based queries (preferred over test-id)
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Click me');
        expect(button).not.toBeDisabled();
        expect(button).toHaveClass('button-primary');
    });

    it('applies the correct variant class', () => {
        const { button } = setup({
            children: 'Secondary Button',
            variant: 'secondary',
        });

        expect(button).toHaveClass('button-secondary');
        expect(button).not.toHaveClass('button-primary');
    });

    it('disables the button when disabled prop is true', () => {
        const { button } = setup({
            children: 'Disabled Button',
            disabled: true,
        });

        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('calls onClick handler when clicked', async () => {
        const handleClick = jest.fn();
        const { button, user } = setup({
            children: 'Clickable Button',
            onClick: handleClick,
        });

        // Using userEvent from setup (better than fireEvent)
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
        const handleClick = jest.fn();
        const { button, user } = setup({
            children: 'Disabled Button',
            onClick: handleClick,
            disabled: true,
        });

        await user.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('tracks click events when trackingId is provided', async () => {
        const { button, user, analyticsService } = setup({
            children: 'Tracked Button',
            trackingId: 'test-button-id',
        });

        await user.click(button);

        // Wait for async tracking to complete
        await waitFor(() => {
            expect(analyticsService.trackEvent).toHaveBeenCalledWith(
                'button_click',
                { id: 'test-button-id' }
            );
        });
    });
}); 